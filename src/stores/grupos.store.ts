import { defineStore } from 'pinia';
import { computed } from 'vue';
import { useStorage } from '../composables/useStorage';
import type { Grupo, Materia } from '../types';
import { useAlumnosStore } from './alumnos.store';

export const useGruposStore = defineStore('grupos', () => {
  const gruposStorage = useStorage<Grupo>('escolar_grupos');
  const materiasStorage = useStorage<Materia>('escolar_materias');
  const alumnosStore = useAlumnosStore();

  const grupos = computed(() => gruposStorage.get());
  const materias = computed(() => materiasStorage.get());

  const getGruposPorGrado = (gradoId: string): Grupo[] => {
    return grupos.value.filter(g => g.gradoId === gradoId && g.activo);
  };

  const getGrupo = (id: string): Grupo | undefined => {
    return gruposStorage.findById(id);
  };

  const crearGrupo = (datos: Partial<Grupo>): Grupo => {
    const grupo: Grupo = {
      id: `grupo_${Date.now()}`,
      gradoId: datos.gradoId || '',
      nombre: datos.nombre || '',
      cicloId: datos.cicloId || '',
      maestroTitularId: datos.maestroTitularId || '',
      capacidadMaxima: datos.capacidadMaxima || 30,
      turno: datos.turno || 'matutino',
      activo: true,
    };

    gruposStorage.add(grupo);
    return grupo;
  };

  const actualizarGrupo = (id: string, updates: Partial<Grupo>): void => {
    gruposStorage.update(id, updates);
  };

  const getAlumnosEnGrupo = (grupoId: string) => {
    return alumnosStore.getAlumnosPorGrupo(grupoId);
  };

  const getMateriasPorGrado = (gradoId: string): Materia[] => {
    return materias.value.filter(m => m.gradoId === gradoId);
  };

  return {
    grupos,
    materias,
    getGruposPorGrado,
    getGrupo,
    crearGrupo,
    actualizarGrupo,
    getAlumnosEnGrupo,
    getMateriasPorGrado,
  };
});
