<template>
  <div>
    <div v-if="!alumnoId" class="text-center py-8 text-gray-600">
      Selecciona un alumno
    </div>
    <div v-else>
      <h4 class="font-semibold text-gray-900 mb-4">Asistencia</h4>

      <div class="mb-6">
        <select v-model="periodoSeleccionado" class="input max-w-xs">
          <option value="mes">Este mes</option>
          <option value="bimestre">Bimestre actual</option>
          <option value="ciclo">Ciclo completo</option>
        </select>
      </div>

      <div class="bg-blue-50 p-4 rounded-lg mb-4">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p class="text-sm text-gray-600">Asistencia</p>
            <p class="text-2xl font-bold text-blue-600">{{ estadisticas.porcentaje }}%</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Presentes</p>
            <p class="text-xl font-semibold text-green-600">{{ estadisticas.presentes }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Faltas</p>
            <p class="text-xl font-semibold text-red-600">{{ estadisticas.faltas }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Tardanzas</p>
            <p class="text-xl font-semibold text-yellow-600">{{ estadisticas.tardanzas }}</p>
          </div>
        </div>
      </div>

      <div class="space-y-2">
        <div
          v-for="registro in registrosRecientes"
          :key="registro.id"
          class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
        >
          <div class="flex items-center gap-3">
            <span class="text-2xl">{{ getIconoStatus(registro.status) }}</span>
            <div>
              <p class="text-sm font-medium text-gray-900">
                {{ formatDate(registro.fecha, 'dd/MM/yyyy') }}
              </p>
              <p class="text-xs text-gray-500">{{ getStatusTexto(registro.status) }}</p>
            </div>
          </div>
          <span v-if="registro.justificacion" class="text-xs text-gray-600">
            {{ registro.justificacion }}
          </span>
        </div>
      </div>

      <div v-if="registrosRecientes.length === 0" class="text-center py-8 text-gray-600">
        No hay registros de asistencia
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAsistenciaStore } from '../../stores/asistencia.store';
import { useSingleStorage } from '../../composables/useStorage';
import { formatDate } from '../../utils/formatters';
import { AsistenciaStatus } from '../../types';
import type { CicloEscolar } from '../../types';
import { format, startOfMonth, subMonths } from 'date-fns';

interface Props {
  alumnoId: string;
}

const props = defineProps<Props>();

const asistenciaStore = useAsistenciaStore();
const cicloStorage = useSingleStorage<CicloEscolar>('escolar_ciclo');

const periodoSeleccionado = ref('mes');

const periodo = computed(() => {
  const ciclo = cicloStorage.get();
  const hoy = new Date();

  if (periodoSeleccionado.value === 'mes') {
    return {
      inicio: format(startOfMonth(hoy), 'yyyy-MM-dd'),
      fin: format(hoy, 'yyyy-MM-dd'),
    };
  }

  if (periodoSeleccionado.value === 'bimestre') {
    // Obtener período actual del ciclo
    if (ciclo) {
      const periodoActual = ciclo.periodos.find(p => {
        const inicio = new Date(p.fechaInicio);
        const fin = new Date(p.fechaFin);
        return hoy >= inicio && hoy <= fin;
      });
      if (periodoActual) {
        return {
          inicio: periodoActual.fechaInicio,
          fin: periodoActual.fechaFin,
        };
      }
    }
  }

  if (periodoSeleccionado.value === 'ciclo' && ciclo) {
    return {
      inicio: ciclo.fechaInicio,
      fin: ciclo.fechaFin,
    };
  }

  return {
    inicio: format(startOfMonth(hoy), 'yyyy-MM-dd'),
    fin: format(hoy, 'yyyy-MM-dd'),
  };
});

const estadisticas = computed(() => {
  if (!props.alumnoId) {
    return { porcentaje: 0, presentes: 0, faltas: 0, tardanzas: 0, total: 0 };
  }
  return asistenciaStore.getEstadisticasAsistencia(props.alumnoId, periodo.value);
});

const registrosRecientes = computed(() => {
  if (!props.alumnoId) return [];
  const registros = asistenciaStore.getAsistenciaAlumno(props.alumnoId, periodo.value);
  return registros
    .sort((a, b) => b.fecha.localeCompare(a.fecha))
    .slice(0, 10);
});

const getIconoStatus = (status: AsistenciaStatus): string => {
  const iconos: Record<AsistenciaStatus, string> = {
    [AsistenciaStatus.PRESENTE]: '✅',
    [AsistenciaStatus.FALTA]: '❌',
    [AsistenciaStatus.TARDANZA]: '⏰',
    [AsistenciaStatus.FALTA_JUSTIFICADA]: '🏥',
  };
  return iconos[status] || '⚪';
};

const getStatusTexto = (status: AsistenciaStatus): string => {
  const textos: Record<AsistenciaStatus, string> = {
    [AsistenciaStatus.PRESENTE]: 'Presente',
    [AsistenciaStatus.FALTA]: 'Falta',
    [AsistenciaStatus.TARDANZA]: 'Tardanza',
    [AsistenciaStatus.FALTA_JUSTIFICADA]: 'Falta justificada',
  };
  return textos[status] || status;
};
</script>
