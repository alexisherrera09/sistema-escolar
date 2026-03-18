import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Usuario } from '../types';
import { UserRole } from '../types';
import { useSingleStorage, useStorage } from '../composables/useStorage';

export const useAuthStore = defineStore('auth', () => {
  const userStorage = useSingleStorage<Usuario>('escolar_current_user');
  const currentUser = ref<Usuario | null>(userStorage.get());

  const isAuthenticated = computed(() => currentUser.value !== null);
  const userRole = computed(() => currentUser.value?.rol || null);

  const login = (usuario: string, password: string): { success: boolean; error?: string } => {
    const usuariosStorage = useStorage<Usuario>('escolar_usuarios');
    const usuarios = usuariosStorage.get();

    const user = usuarios.find(u => 
      (u.usuario === usuario || u.correo === usuario) && 
      u.passwordHash === password &&
      u.activo
    );

    if (!user) {
      return { success: false, error: 'Usuario o contraseña incorrectos' };
    }

    if (user.bloqueadoHasta && new Date(user.bloqueadoHasta) > new Date()) {
      return { success: false, error: 'Cuenta bloqueada. Intenta más tarde.' };
    }

    currentUser.value = user;
    userStorage.set(user);

    // Resetear intentos fallidos
    usuariosStorage.update(user.id, {
      intentosFallidos: 0,
      bloqueadoHasta: undefined,
    });

    return { success: true };
  };

  const logout = (): void => {
    currentUser.value = null;
    userStorage.set(null);
  };

  const hasRole = (roles: UserRole[]): boolean => {
    if (!currentUser.value) return false;
    return roles.includes(currentUser.value.rol);
  };

  const canAccess = (module: string): boolean => {
    if (!currentUser.value) return false;
    const role = currentUser.value.rol;

    // Tabla de permisos según especificación
    const permissions: Record<string, UserRole[]> = {
      alumnos: [UserRole.DIRECTOR, UserRole.COORDINADOR, UserRole.CAJERO, UserRole.MAESTRO, UserRole.PADRE],
      grupos: [UserRole.DIRECTOR, UserRole.COORDINADOR],
      calificaciones: [UserRole.DIRECTOR, UserRole.COORDINADOR, UserRole.MAESTRO, UserRole.PADRE],
      asistencia: [UserRole.DIRECTOR, UserRole.COORDINADOR, UserRole.MAESTRO, UserRole.PADRE],
      boletas: [UserRole.DIRECTOR, UserRole.COORDINADOR, UserRole.PADRE],
      pagos: [UserRole.DIRECTOR, UserRole.CAJERO, UserRole.PADRE],
      cfdi: [UserRole.DIRECTOR, UserRole.CAJERO, UserRole.PADRE],
      comedor: [UserRole.DIRECTOR, UserRole.CAJERO, UserRole.MAESTRO, UserRole.PADRE],
      becas: [UserRole.DIRECTOR, UserRole.CAJERO, UserRole.PADRE],
      inscripciones: [UserRole.DIRECTOR, UserRole.COORDINADOR, UserRole.CAJERO, UserRole.PADRE],
      entrada_salida: [UserRole.DIRECTOR, UserRole.COORDINADOR, UserRole.CAJERO, UserRole.MAESTRO, UserRole.PADRE],
      expediente_medico: [UserRole.DIRECTOR, UserRole.COORDINADOR, UserRole.MAESTRO, UserRole.PADRE],
      comunicados: [UserRole.DIRECTOR, UserRole.COORDINADOR, UserRole.MAESTRO, UserRole.PADRE],
      reportes: [UserRole.DIRECTOR, UserRole.COORDINADOR, UserRole.CAJERO],
      configuracion: [UserRole.DIRECTOR],
    };

    return permissions[module]?.includes(role) || false;
  };

  return {
    currentUser,
    isAuthenticated,
    userRole,
    login,
    logout,
    hasRole,
    canAccess,
  };
});
