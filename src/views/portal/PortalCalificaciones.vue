<template>
  <div>
    <div v-if="!alumnoId" class="text-center py-8 text-gray-600">
      Selecciona un alumno
    </div>
    <div v-else>
      <div class="mb-4">
        <h4 class="font-semibold text-gray-900 mb-2">Calificaciones por Período</h4>
        <select v-model="periodoSeleccionado" class="input max-w-xs">
          <option v-for="periodo in periodos" :key="periodo.id" :value="periodo.id">
            {{ periodo.nombre }}
          </option>
        </select>
      </div>

      <div v-if="calificaciones.length > 0" class="space-y-4">
        <div
          v-for="cal in calificaciones"
          :key="cal.id"
          class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
        >
          <span class="font-medium text-gray-900">{{ getMateriaNombre(cal.materiaId) }}</span>
          <span
            :class="[
              'text-xl font-bold',
              cal.promedio < 6 ? 'text-red-600' : 'text-gray-900',
            ]"
          >
            {{ cal.promedio.toFixed(1) }}
          </span>
        </div>
        <div class="mt-4 p-4 bg-primary-50 rounded-lg">
          <div class="flex items-center justify-between">
            <span class="font-semibold text-gray-900">Promedio General</span>
            <span class="text-2xl font-bold text-primary-600">
              {{ promedioGeneral.toFixed(1) }}
            </span>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-8 text-gray-600">
        No hay calificaciones disponibles para este período
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useCalificacionesStore } from '../../stores/calificaciones.store';
import { useSingleStorage } from '../../composables/useStorage';
import type { CicloEscolar } from '../../types';

interface Props {
  alumnoId: string;
}

const props = defineProps<Props>();

const calificacionesStore = useCalificacionesStore();
const cicloStorage = useSingleStorage<CicloEscolar>('escolar_ciclo');

const periodoSeleccionado = ref('');

const periodos = computed(() => {
  const ciclo = cicloStorage.get();
  return ciclo?.periodos || [];
});

watch(() => periodos.value, (newPeriodos) => {
  if (newPeriodos.length > 0 && !periodoSeleccionado.value) {
    periodoSeleccionado.value = newPeriodos[0].id;
  }
}, { immediate: true });

const calificaciones = computed(() => {
  if (!props.alumnoId || !periodoSeleccionado.value) return [];
  return calificacionesStore.getCalificacionesAlumnoPorPeriodo(props.alumnoId, periodoSeleccionado.value);
});

const promedioGeneral = computed(() => {
  if (calificaciones.value.length === 0) return 0;
  const suma = calificaciones.value.reduce((acc, c) => acc + c.promedio, 0);
  return suma / calificaciones.value.length;
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
</script>
