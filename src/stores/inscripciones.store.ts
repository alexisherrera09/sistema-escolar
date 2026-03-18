import { defineStore } from 'pinia';
import { computed } from 'vue';
import { useStorage } from '../composables/useStorage';
import type { Inscripcion } from '../types';
import { EstadoInscripcion } from '../types';
import { useAuthStore } from './auth.store';
import { usePagosStore } from './pagos.store';

export const useInscripcionesStore = defineStore('inscripciones', () => {
  const inscripcionesStorage = useStorage<Inscripcion>('escolar_inscripciones');
  const authStore = useAuthStore();
  const pagosStore = usePagosStore();

  const inscripciones = computed(() => inscripcionesStorage.get());

  const getInscripcionesPorCiclo = (cicloId: string): Inscripcion[] => {
    return inscripciones.value.filter(i => i.cicloDestino === cicloId);
  };

  const getInscripcionesNuevas = (): Inscripcion[] => {
    return inscripciones.value.filter(i => i.tipo === 'nueva');
  };

  const getInscripcionesReinscripciones = (): Inscripcion[] => {
    return inscripciones.value.filter(i => i.tipo === 'reinscripcion');
  };

  const crearInscripcion = (datos: Partial<Inscripcion>): Inscripcion => {
    // Verificar si es reinscripción y si tiene adeudos
    if (datos.tipo === 'reinscripcion' && datos.alumnoId) {
      const cargosPendientes = pagosStore.getCargosPendientes(datos.alumnoId);
      if (cargosPendientes.length > 0) {
        throw new Error('El alumno tiene adeudos pendientes. Debe liquidar antes de reinscribirse.');
      }
    }

    const inscripcion: Inscripcion = {
      id: `insc_${Date.now()}`,
      alumnoId: datos.alumnoId,
      tipo: datos.tipo || 'nueva',
      cicloDestino: datos.cicloDestino || '',
      gradoDestino: datos.gradoDestino || '',
      grupoDestino: datos.grupoDestino,
      status: datos.status || EstadoInscripcion.EN_REVISION,
      documentos: datos.documentos || [],
      pagado: false,
      solicitadoPor: authStore.currentUser?.id || '',
      fecha: new Date().toISOString(),
    };

    inscripcionesStorage.add(inscripcion);
    return inscripcion;
  };

  const actualizarInscripcion = (id: string, updates: Partial<Inscripcion>): void => {
    inscripcionesStorage.update(id, updates);
  };

  const confirmarInscripcion = (id: string): void => {
    inscripcionesStorage.update(id, {
      status: EstadoInscripcion.CONFIRMADA,
      pagado: true,
    });
  };

  const cancelarInscripcion = (id: string): void => {
    inscripcionesStorage.update(id, { status: EstadoInscripcion.CANCELADA });
  };

  return {
    inscripciones,
    getInscripcionesPorCiclo,
    getInscripcionesNuevas,
    getInscripcionesReinscripciones,
    crearInscripcion,
    actualizarInscripcion,
    confirmarInscripcion,
    cancelarInscripcion,
  };
});
