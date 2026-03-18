<template>
  <div class="boleta-container">
    <div class="boleta-content">
      <!-- Encabezado -->
      <div class="text-center mb-6">
        <h1 class="text-2xl font-bold">{{ config.nombrePlantel }}</h1>
        <p class="text-sm text-gray-600">CCT: {{ config.cct }}</p>
        <p class="text-lg font-semibold mt-2">Boleta de Evaluación · {{ periodo.nombre }} {{ ciclo.nombre }}</p>
      </div>

      <!-- Datos del Alumno -->
      <div class="mb-6">
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span class="font-semibold">Alumno:</span>
            <span class="ml-2">{{ alumnoNombre }}</span>
          </div>
          <div>
            <span class="font-semibold">Matrícula:</span>
            <span class="ml-2">{{ alumno.matricula }}</span>
          </div>
          <div>
            <span class="font-semibold">Grado:</span>
            <span class="ml-2">{{ grupoNombre }}</span>
          </div>
          <div>
            <span class="font-semibold">Turno:</span>
            <span class="ml-2">Matutino</span>
          </div>
          <div>
            <span class="font-semibold">Maestro:</span>
            <span class="ml-2">{{ maestroNombre }}</span>
          </div>
        </div>
      </div>

      <!-- Tabla de Calificaciones -->
      <table class="w-full border-collapse border border-gray-300 mb-6">
        <thead>
          <tr class="bg-gray-100">
            <th class="border border-gray-300 px-4 py-2 text-left font-semibold">MATERIA</th>
            <th class="border border-gray-300 px-4 py-2 text-center font-semibold">CALIFICACIÓN</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cal in calificaciones" :key="cal.materiaId">
            <td class="border border-gray-300 px-4 py-2">{{ getMateriaNombre(cal.materiaId) }}</td>
            <td class="border border-gray-300 px-4 py-2 text-center font-semibold">
              {{ cal.promedio.toFixed(1) }}
            </td>
          </tr>
          <tr class="bg-gray-50 font-bold">
            <td class="border border-gray-300 px-4 py-2">PROMEDIO GENERAL</td>
            <td class="border border-gray-300 px-4 py-2 text-center">
              {{ promedioGeneral.toFixed(1) }}
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Asistencia -->
      <div class="mb-6 text-sm">
        <p>
          <span class="font-semibold">Asistencias:</span>
          {{ estadisticas.presentes }}/{{ estadisticas.total }} días
          <span class="mx-2">·</span>
          <span class="font-semibold">Faltas:</span>
          {{ estadisticas.faltas }}
          <span class="mx-2">·</span>
          <span class="font-semibold">Tardanzas:</span>
          {{ estadisticas.tardanzas }}
        </p>
      </div>

      <!-- Observaciones -->
      <div class="mb-6" v-if="observaciones">
        <p class="font-semibold mb-2">Observaciones:</p>
        <p class="text-sm">{{ observaciones }}</p>
      </div>

      <!-- Firmas -->
      <div class="grid grid-cols-2 gap-8 mt-8">
        <div class="text-center">
          <div class="border-t-2 border-gray-400 pt-2 mt-16">
            <p class="text-sm font-semibold">Firma del Maestro</p>
          </div>
        </div>
        <div class="text-center">
          <div class="border-t-2 border-gray-400 pt-2 mt-16">
            <p class="text-sm font-semibold">Firma del Director</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Botones de acción -->
    <div class="flex justify-end gap-3 mt-6 print:hidden">
      <AppButton variant="outline" @click="$emit('close')">Cerrar</AppButton>
      <AppButton @click="imprimir">🖨️ Imprimir</AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useCalificacionesStore } from '../../stores/calificaciones.store';
import { useAsistenciaStore } from '../../stores/asistencia.store';
import { useSingleStorage } from '../../composables/useStorage';
import type { Alumno, CicloEscolar, Periodo, ConfiguracionEscolar } from '../../types';
import AppButton from '../ui/AppButton.vue';

interface Props {
  alumno: Alumno;
  periodo: Periodo;
  ciclo: CicloEscolar;
  maestroNombre: string;
  grupoNombre: string;
  observaciones?: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
}>();

const calificacionesStore = useCalificacionesStore();
const asistenciaStore = useAsistenciaStore();
const configStorage = useSingleStorage<ConfiguracionEscolar>('escolar_configuracion');

const config = computed(() => configStorage.get() || {
  nombrePlantel: 'Colegio Veracruz',
  cct: '30PPR0123A',
} as ConfiguracionEscolar);

const alumnoNombre = computed(() => {
  return `${props.alumno.nombre} ${props.alumno.apellidoPaterno} ${props.alumno.apellidoMaterno}`;
});

const calificaciones = computed(() => {
  return calificacionesStore.getCalificacionesAlumnoPorPeriodo(props.alumno.id, props.periodo.id);
});

const promedioGeneral = computed(() => {
  if (calificaciones.value.length === 0) return 0;
  const suma = calificaciones.value.reduce((acc, c) => acc + c.promedio, 0);
  return suma / calificaciones.value.length;
});

const estadisticas = computed(() => {
  const stats = asistenciaStore.getEstadisticasAsistencia(props.alumno.id, {
    inicio: props.periodo.fechaInicio,
    fin: props.periodo.fechaFin,
  });
  return stats;
});

const getMateriaNombre = (materiaId: string): string => {
  const materias: Record<string, string> = {
    esp: 'Español',
    mat: 'Matemáticas',
    civ: 'Ciencias Naturales',
    hist: 'Historia',
    geo: 'Geografía',
    form: 'Formación Cívica y Ética',
    art: 'Educación Artística',
    fis: 'Educación Física',
    ing: 'Inglés',
  };
  return materias[materiaId] || materiaId;
};

const imprimir = () => {
  window.print();
};
</script>

<style scoped>
@media print {
  .print\:hidden {
    display: none;
  }

  .boleta-container {
    padding: 0;
  }

  .boleta-content {
    max-width: 100%;
  }

  body {
    background: white;
  }
}

.boleta-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
}

.boleta-content {
  font-family: 'Times New Roman', serif;
}
</style>
