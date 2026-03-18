<template>
  <aside class="fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 hidden lg:block">
    <div class="h-full flex flex-col">
      <div class="p-6 border-b">
        <h2 class="text-xl font-bold text-primary-600">🏫 Colegio Veracruz</h2>
        <p class="text-sm text-gray-500">Sistema Escolar</p>
      </div>

      <nav class="flex-1 overflow-y-auto p-4">
        <router-link
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          :class="[
            'flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors',
            route.path === item.path
              ? 'bg-primary-50 text-primary-600 font-medium'
              : 'text-gray-700 hover:bg-gray-50',
          ]"
        >
          <span class="text-xl">{{ item.icon }}</span>
          <span>{{ item.label }}</span>
        </router-link>
      </nav>

      <div class="p-4 border-t">
        <button
          @click="handleLogout"
          class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
        >
          <span>🚪</span>
          <span>Salir</span>
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../../stores/auth.store';
import { UserRole } from '../../types';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const menuItems = computed(() => {
  const role = authStore.userRole;
  const baseMenu = [
    { path: '/', label: 'Dashboard', icon: '📊', roles: [UserRole.DIRECTOR, UserRole.COORDINADOR, UserRole.CAJERO, UserRole.MAESTRO] },
    { path: '/alumnos', label: 'Alumnos', icon: '👨‍🎓', roles: [UserRole.DIRECTOR, UserRole.COORDINADOR, UserRole.CAJERO, UserRole.MAESTRO] },
    { path: '/grupos', label: 'Grupos', icon: '📚', roles: [UserRole.DIRECTOR, UserRole.COORDINADOR] },
    { path: '/asistencia', label: 'Asistencia', icon: '✅', roles: [UserRole.DIRECTOR, UserRole.COORDINADOR, UserRole.MAESTRO] },
    { path: '/calificaciones', label: 'Calificaciones', icon: '📝', roles: [UserRole.DIRECTOR, UserRole.COORDINADOR, UserRole.MAESTRO] },
    { path: '/boletas', label: 'Boletas', icon: '📄', roles: [UserRole.DIRECTOR, UserRole.COORDINADOR] },
    { path: '/pagos', label: 'Pagos', icon: '💰', roles: [UserRole.DIRECTOR, UserRole.CAJERO] },
    { path: '/cfdi', label: 'CFDI', icon: '🧾', roles: [UserRole.DIRECTOR, UserRole.CAJERO] },
    { path: '/comedor', label: 'Comedor', icon: '🍽️', roles: [UserRole.DIRECTOR, UserRole.CAJERO, UserRole.MAESTRO] },
    { path: '/entrada-salida', label: 'Entrada/Salida', icon: '🚪', roles: [UserRole.DIRECTOR, UserRole.COORDINADOR, UserRole.CAJERO, UserRole.MAESTRO] },
    { path: '/comunicados', label: 'Comunicados', icon: '📢', roles: [UserRole.DIRECTOR, UserRole.COORDINADOR, UserRole.MAESTRO] },
    { path: '/becas', label: 'Becas', icon: '🎓', roles: [UserRole.DIRECTOR, UserRole.CAJERO] },
    { path: '/inscripciones', label: 'Inscripciones', icon: '📋', roles: [UserRole.DIRECTOR, UserRole.COORDINADOR, UserRole.CAJERO] },
    { path: '/reportes', label: 'Reportes', icon: '📊', roles: [UserRole.DIRECTOR, UserRole.COORDINADOR, UserRole.CAJERO] },
    { path: '/configuracion', label: 'Configuración', icon: '⚙️', roles: [UserRole.DIRECTOR] },
  ];

  return baseMenu.filter(item => !item.roles || item.roles.includes(role!));
});

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>
