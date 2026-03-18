import { defineStore } from 'pinia';
import { computed } from 'vue';
import { useStorage } from '../composables/useStorage';
import type { Maestro } from '../types';

export const useMaestrosStore = defineStore('maestros', () => {
  const maestrosStorage = useStorage<Maestro>('escolar_maestros');

  const maestros = computed(() => maestrosStorage.get());

  const getMaestro = (id: string): Maestro | undefined => {
    return maestrosStorage.findById(id);
  };

  const getMaestroPorUsuario = (usuarioId: string): Maestro | undefined => {
    return maestros.value.find(m => m.usuarioId === usuarioId);
  };

  const crearMaestro = (datos: Partial<Maestro>): Maestro => {
    const maestro: Maestro = {
      id: `maestro_${Date.now()}`,
      usuarioId: datos.usuarioId || '',
      nombre: datos.nombre || '',
      titulo: datos.titulo || 'Prof.',
      telefono: datos.telefono || '',
      correo: datos.correo || '',
      grupoTitularId: datos.grupoTitularId,
      materiasIds: datos.materiasIds || [],
      activo: true,
      creadoEn: new Date().toISOString(),
    };

    maestrosStorage.add(maestro);
    return maestro;
  };

  const actualizarMaestro = (id: string, updates: Partial<Maestro>): void => {
    maestrosStorage.update(id, updates);
  };

  return {
    maestros,
    getMaestro,
    getMaestroPorUsuario,
    crearMaestro,
    actualizarMaestro,
  };
});
