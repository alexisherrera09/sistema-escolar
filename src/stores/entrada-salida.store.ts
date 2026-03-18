import { defineStore } from 'pinia';
import { computed } from 'vue';
import { useStorage } from '../composables/useStorage';
import type { RegistroEntradaSalida, Alumno } from '../types';
import { format } from 'date-fns';
import { useAuthStore } from './auth.store';
import { useAlumnosStore } from './alumnos.store';
import { useSingleStorage } from '../composables/useStorage';
import type { ConfiguracionEscolar } from '../types';

export const useEntradaSalidaStore = defineStore('entrada-salida', () => {
  const registrosStorage = useStorage<RegistroEntradaSalida>('escolar_entradas_salidas');
  const authStore = useAuthStore();
  const alumnosStore = useAlumnosStore();
  const configStorage = useSingleStorage<ConfiguracionEscolar>('escolar_configuracion');

  const registros = computed(() => registrosStorage.get());

  const getRegistrosDelDia = (fecha: string = format(new Date(), 'yyyy-MM-dd')): RegistroEntradaSalida[] => {
    return registros.value.filter(r => r.fecha === fecha)
      .sort((a, b) => b.hora.localeCompare(a.hora));
  };

  const getRegistroEntrada = (alumnoId: string, fecha: string): RegistroEntradaSalida | undefined => {
    return registros.value.find(r =>
      r.alumnoId === alumnoId &&
      r.fecha === fecha &&
      r.tipo === 'entrada'
    );
  };

  const registrarEntrada = (
    alumnoId: string,
    hora: string
  ): RegistroEntradaSalida => {
    const config = configStorage.get();
    const horaEntrada = config?.horaEntrada || '07:30';
    const minutosTolerancia = config?.minutosTolerancia || 10;

    const [horaEnt, minEnt] = horaEntrada.split(':').map(Number);
    const [horaReg, minReg] = hora.split(':').map(Number);

    const minutosEntrada = horaEnt * 60 + minEnt;
    const minutosRegistro = horaReg * 60 + minReg;
    const tardanza = minutosRegistro > minutosEntrada + minutosTolerancia;

    const registro: RegistroEntradaSalida = {
      id: `entrada_${Date.now()}_${alumnoId}`,
      alumnoId,
      fecha: format(new Date(), 'yyyy-MM-dd'),
      tipo: 'entrada',
      hora,
      tardanza,
      salida_anticipada: false,
      registradoPor: authStore.currentUser?.id || '',
    };

    registrosStorage.add(registro);
    return registro;
  };

  const registrarSalida = (
    alumnoId: string,
    hora: string,
    personaRecogeId?: string,
    personaRecogeNombre?: string
  ): RegistroEntradaSalida => {
    const alumno = alumnosStore.getAlumno(alumnoId);
    if (!alumno) {
      throw new Error('Alumno no encontrado');
    }

    // Verificar que la persona esté autorizada
    if (personaRecogeId || personaRecogeNombre) {
      const autorizada = alumno.personasAutorizadas.some(p =>
        p.nombre.toLowerCase().includes((personaRecogeNombre || '').toLowerCase())
      );

      if (!autorizada && authStore.userRole !== 'director') {
        throw new Error('La persona no está autorizada para recoger al alumno');
      }
    }

    const [horaReg, minReg] = hora.split(':').map(Number);
    const salidaAnticipada = horaReg < 12;

    const registro: RegistroEntradaSalida = {
      id: `salida_${Date.now()}_${alumnoId}`,
      alumnoId,
      fecha: format(new Date(), 'yyyy-MM-dd'),
      tipo: 'salida',
      hora,
      tardanza: false,
      salida_anticipada: salidaAnticipada,
      personaRecogeId,
      personaRecogeNombre,
      registradoPor: authStore.currentUser?.id || '',
    };

    registrosStorage.add(registro);
    return registro;
  };

  return {
    registros,
    getRegistrosDelDia,
    getRegistroEntrada,
    registrarEntrada,
    registrarSalida,
  };
});
