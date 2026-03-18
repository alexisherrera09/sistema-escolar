import { defineStore } from 'pinia';
import { computed } from 'vue';
import { useStorage } from '../composables/useStorage';
import type { RegistroAsistencia, Alumno } from '../types';
import { AsistenciaStatus } from '../types';
import { format } from 'date-fns';
import { useAuthStore } from './auth.store';

export const useAsistenciaStore = defineStore('asistencia', () => {
  const asistenciaStorage = useStorage<RegistroAsistencia>('escolar_asistencia');
  const alumnosStorage = useStorage<Alumno>('escolar_alumnos');
  const authStore = useAuthStore();

  const registros = computed(() => asistenciaStorage.get());

  const getAsistenciaDelDia = (grupoId: string, fecha: string = format(new Date(), 'yyyy-MM-dd')): RegistroAsistencia[] => {
    return registros.value.filter(r => r.grupoId === grupoId && r.fecha === fecha);
  };

  const getAsistenciaAlumno = (alumnoId: string, periodo?: { inicio: string; fin: string }): RegistroAsistencia[] => {
    let registrosAlumno = registros.value.filter(r => r.alumnoId === alumnoId);
    
    if (periodo) {
      registrosAlumno = registrosAlumno.filter(r => 
        r.fecha >= periodo.inicio && r.fecha <= periodo.fin
      );
    }
    
    return registrosAlumno;
  };

  const registrarAsistencia = (
    grupoId: string,
    registros: Array<{ alumnoId: string; status: AsistenciaStatus; justificacion?: string }>
  ): void => {
    const fecha = format(new Date(), 'yyyy-MM-dd');
    const maestroId = authStore.currentUser?.id || '';

    registros.forEach(({ alumnoId, status, justificacion }) => {
      // Verificar si ya existe registro para este alumno en este día
      const existente = asistenciaStorage.find(r => 
        r.alumnoId === alumnoId && r.fecha === fecha && r.grupoId === grupoId
      );

      const registro: RegistroAsistencia = {
        id: existente?.id || `asist_${Date.now()}_${alumnoId}`,
        alumnoId,
        grupoId,
        fecha,
        status,
        justificacion,
        maestroId,
        registradoEn: new Date().toISOString(),
      };

      if (existente) {
        asistenciaStorage.update(registro.id, registro);
      } else {
        asistenciaStorage.add(registro);
      }
    });
  };

  const getEstadisticasAsistencia = (alumnoId: string, periodo: { inicio: string; fin: string }) => {
    const registrosAlumno = getAsistenciaAlumno(alumnoId, periodo);
    const total = registrosAlumno.length;
    const presentes = registrosAlumno.filter(r => r.status === AsistenciaStatus.PRESENTE).length;
    const faltas = registrosAlumno.filter(r => r.status === AsistenciaStatus.FALTA).length;
    const tardanzas = registrosAlumno.filter(r => r.status === AsistenciaStatus.TARDANZA).length;
    const faltasJustificadas = registrosAlumno.filter(r => r.status === AsistenciaStatus.FALTA_JUSTIFICADA).length;
    
    const porcentaje = total > 0 ? Math.round((presentes / total) * 100) : 0;

    return {
      total,
      presentes,
      faltas,
      tardanzas,
      faltasJustificadas,
      porcentaje,
    };
  };

  const tieneFaltasConsecutivas = (alumnoId: string, cantidad: number = 3): boolean => {
    const registrosAlumno = registros.value
      .filter(r => r.alumnoId === alumnoId)
      .sort((a, b) => b.fecha.localeCompare(a.fecha));

    let faltasConsecutivas = 0;
    for (const registro of registrosAlumno) {
      if (registro.status === AsistenciaStatus.FALTA) {
        faltasConsecutivas++;
        if (faltasConsecutivas >= cantidad) {
          return true;
        }
      } else if (registro.status === AsistenciaStatus.PRESENTE || registro.status === AsistenciaStatus.TARDANZA) {
        break;
      }
    }

    return false;
  };

  return {
    registros,
    getAsistenciaDelDia,
    getAsistenciaAlumno,
    registrarAsistencia,
    getEstadisticasAsistencia,
    tieneFaltasConsecutivas,
  };
});
