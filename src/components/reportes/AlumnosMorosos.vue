<template>
  <div>
    <div class="mb-4">
      <p class="text-sm text-gray-600 mb-4">
        Alumnos con pagos vencidos o pendientes por más de 1 mes
      </p>
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Alumno</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grado</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Adeudo Total</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cargos Vencidos</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="moroso in alumnosMorosos" :key="moroso.alumnoId" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ moroso.nombre }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ moroso.grado }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-600">
              {{ formatCurrency(moroso.adeudoTotal) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ moroso.cargosVencidos }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button
                @click="verDetalle(moroso.alumnoId)"
                class="text-primary-600 hover:text-primary-900"
              >
                Ver detalle
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="alumnosMorosos.length === 0" class="text-center py-8 text-gray-600">
      No hay alumnos morosos
    </div>

    <div class="mt-4 flex justify-end">
      <AppButton variant="outline" @click="exportarCSV">📥 Exportar CSV</AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { usePagosStore } from '../../stores/pagos.store';
import { useAlumnosStore } from '../../stores/alumnos.store';
import { useStorage } from '../../composables/useStorage';
import { formatCurrency } from '../../utils/formatters';
import type { Grupo } from '../../types';
import AppButton from '../ui/AppButton.vue';

const emit = defineEmits<{
  close: [];
}>();

const pagosStore = usePagosStore();
const alumnosStore = useAlumnosStore();
const gruposStorage = useStorage<Grupo>('escolar_grupos');

const alumnosMorosos = computed(() => {
  const hoy = new Date();
  const morosos: Array<{
    alumnoId: string;
    nombre: string;
    grado: string;
    adeudoTotal: number;
    cargosVencidos: number;
  }> = [];

  const alumnosIds = new Set<string>();
  
  // Obtener todos los cargos vencidos o pendientes por más de 1 mes
  pagosStore.cargos.forEach(cargo => {
    if (cargo.status === 'vencido' || cargo.status === 'pendiente') {
      const vencimiento = new Date(cargo.fechaVencimiento);
      const diffMeses = (hoy.getTime() - vencimiento.getTime()) / (1000 * 60 * 60 * 24 * 30);
      
      if (diffMeses > 1) {
        alumnosIds.add(cargo.alumnoId);
      }
    }
  });

  // Agrupar por alumno
  alumnosIds.forEach(alumnoId => {
    const alumno = alumnosStore.getAlumno(alumnoId);
    if (!alumno) return;

    const grupo = gruposStorage.findById(alumno.grupoId);
    const cargosAlumno = pagosStore.getCargosPorAlumno(alumnoId);
    const cargosVencidos = cargosAlumno.filter(c => {
      if (c.status !== 'vencido' && c.status !== 'pendiente') return false;
      const vencimiento = new Date(c.fechaVencimiento);
      const diffMeses = (hoy.getTime() - vencimiento.getTime()) / (1000 * 60 * 60 * 24 * 30);
      return diffMeses > 1;
    });

    if (cargosVencidos.length > 0) {
      morosos.push({
        alumnoId: alumno.id,
        nombre: `${alumno.nombre} ${alumno.apellidoPaterno} ${alumno.apellidoMaterno}`,
        grado: grupo ? `${grupo.gradoId}${grupo.nombre}` : 'N/A',
        adeudoTotal: cargosVencidos.reduce((sum, c) => sum + c.monto, 0),
        cargosVencidos: cargosVencidos.length,
      });
    }
  });

  return morosos.sort((a, b) => b.adeudoTotal - a.adeudoTotal);
});

const verDetalle = (alumnoId: string) => {
  // Redirigir a detalle del alumno
  window.location.href = `/alumnos/${alumnoId}`;
};

const exportarCSV = () => {
  const csv = [
    ['Alumno', 'Grado', 'Adeudo Total', 'Cargos Vencidos'].join(','),
    ...alumnosMorosos.value.map(m => [
      m.nombre,
      m.grado,
      m.adeudoTotal,
      m.cargosVencidos,
    ].join(','))
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Alumnos_Morosos_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};
</script>
