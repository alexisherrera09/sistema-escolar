<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-gray-900">🎓 Becas y Descuentos</h2>
      <AppButton @click="showNuevaBeca = true">+ Nueva Beca</AppButton>
    </div>

    <div class="card mb-6">
      <h3 class="text-lg font-semibold mb-4">Tipos de Beca Configurados</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="tipo in becasStore.tiposBecaConfigurados"
          :key="tipo.tipo"
          class="p-4 bg-gray-50 rounded-lg border border-gray-200"
        >
          <p class="font-semibold text-gray-900">{{ tipo.nombre }}</p>
          <p class="text-sm text-gray-600">{{ tipo.porcentaje }}% descuento</p>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="mb-4 flex justify-between items-center">
        <h3 class="text-lg font-semibold">
          Becas Activas este Ciclo: {{ becasActivas.length }} alumnos
        </h3>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Alumno</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo de Beca</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descuento</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vigencia</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="beca in becasActivas" :key="beca.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ getAlumnoNombre(beca.alumnoId) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ getTipoBecaNombre(beca.tipo) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ beca.porcentaje }}%
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(beca.fechaInicio) }} - {{ formatDate(beca.fechaFin) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  @click="eliminarBeca(beca.id)"
                  class="text-red-600 hover:text-red-900"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="becasActivas.length === 0" class="text-center py-8 text-gray-600">
        No hay becas activas
      </div>
    </div>

    <AppModal :show="showNuevaBeca" @close="showNuevaBeca = false" size="lg">
      <template #title>Nueva Beca</template>
      <BecaForm @close="showNuevaBeca = false" @success="handleBecaCreada" />
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useBecasStore } from '../stores/becas.store';
import { useAlumnosStore } from '../stores/alumnos.store';
import { formatDate } from '../utils/formatters';
import { useToast } from 'vue-toastification';
import AppButton from '../components/ui/AppButton.vue';
import AppCard from '../components/ui/AppCard.vue';
import AppModal from '../components/ui/AppModal.vue';
import BecaForm from '../components/becas/BecaForm.vue';

const becasStore = useBecasStore();
const alumnosStore = useAlumnosStore();
const toast = useToast();

const showNuevaBeca = ref(false);

const becasActivas = computed(() => becasStore.getBecasActivas());

const getAlumnoNombre = (alumnoId: string): string => {
  const alumno = alumnosStore.getAlumno(alumnoId);
  return alumno ? `${alumno.nombre} ${alumno.apellidoPaterno} ${alumno.apellidoMaterno}` : 'N/A';
};

const getTipoBecaNombre = (tipo: string): string => {
  const tipoBeca = becasStore.tiposBecaConfigurados.find(t => t.tipo === tipo);
  return tipoBeca?.nombre || tipo;
};

const eliminarBeca = (id: string) => {
  if (confirm('¿Estás seguro de eliminar esta beca?')) {
    becasStore.eliminarBeca(id);
    toast.success('Beca eliminada');
  }
};

const handleBecaCreada = () => {
  showNuevaBeca.value = false;
};
</script>
