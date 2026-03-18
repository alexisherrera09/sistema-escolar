import { defineStore } from 'pinia';
import { computed } from 'vue';
import { useStorage } from '../composables/useStorage';
import { calcularPromedio, calcularPromedioGeneral } from '../utils/calificaciones';
import type { Calificacion, Alumno } from '../types';
import { useAuthStore } from './auth.store';

export const useCalificacionesStore = defineStore('calificaciones', () => {
  const calificacionesStorage = useStorage<Calificacion>('escolar_calificaciones');
  const alumnosStorage = useStorage<Alumno>('escolar_alumnos');
  const authStore = useAuthStore();

  const calificaciones = computed(() => calificacionesStorage.get());

  const getCalificacionesPorPeriodo = (
    grupoId: string,
    periodoId: string,
    materiaId: string
  ): Calificacion[] => {
    const alumnosGrupo = alumnosStorage.filter(a => a.grupoId === grupoId);
    const alumnosIds = alumnosGrupo.map(a => a.id);

    return calificaciones.value.filter(c =>
      alumnosIds.includes(c.alumnoId) &&
      c.periodoId === periodoId &&
      c.materiaId === materiaId
    );
  };

  const getCalificacionAlumno = (
    alumnoId: string,
    periodoId: string,
    materiaId: string
  ): Calificacion | undefined => {
    return calificaciones.value.find(c =>
      c.alumnoId === alumnoId &&
      c.periodoId === periodoId &&
      c.materiaId === materiaId
    );
  };

  const guardarCalificacion = (
    alumnoId: string,
    materiaId: string,
    periodoId: string,
    cicloId: string,
    evaluaciones: number[],
    observaciones?: string
  ): Calificacion => {
    const promedio = calcularPromedio(evaluaciones);
    const maestroId = authStore.currentUser?.id || '';

    const existente = calificaciones.value.find(c =>
      c.alumnoId === alumnoId &&
      c.materiaId === materiaId &&
      c.periodoId === periodoId
    );

    const calificacion: Calificacion = {
      id: existente?.id || `cal_${Date.now()}_${alumnoId}`,
      alumnoId,
      materiaId,
      periodoId,
      cicloId,
      evaluaciones,
      promedio,
      observaciones,
      finalizada: false,
      maestroId,
      actualizadoEn: new Date().toISOString(),
    };

    if (existente) {
      calificacionesStorage.update(calificacion.id, calificacion);
    } else {
      calificacionesStorage.add(calificacion);
    }

    return calificacion;
  };

  const finalizarCaptura = (
    grupoId: string,
    periodoId: string,
    materiaId: string
  ): void => {
    const calificacionesGrupo = getCalificacionesPorPeriodo(grupoId, periodoId, materiaId);
    
    calificacionesGrupo.forEach(cal => {
      calificacionesStorage.update(cal.id, { finalizada: true });
    });
  };

  const getPromedioGeneralAlumno = (alumnoId: string, periodoId: string): number => {
    const calificacionesAlumno = calificaciones.value.filter(c =>
      c.alumnoId === alumnoId && c.periodoId === periodoId
    );

    return calcularPromedioGeneral(calificacionesAlumno);
  };

  const getCalificacionesAlumnoPorPeriodo = (alumnoId: string, periodoId: string): Calificacion[] => {
    return calificaciones.value.filter(c =>
      c.alumnoId === alumnoId && c.periodoId === periodoId
    );
  };

  return {
    calificaciones,
    getCalificacionesPorPeriodo,
    getCalificacionAlumno,
    guardarCalificacion,
    finalizarCaptura,
    getPromedioGeneralAlumno,
    getCalificacionesAlumnoPorPeriodo,
  };
});
