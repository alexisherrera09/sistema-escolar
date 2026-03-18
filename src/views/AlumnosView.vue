<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-gray-900">👨‍🎓 Alumnos</h2>
      <AppButton @click="showWizard = true">+ Nuevo Alumno</AppButton>
    </div>

    <div class="card">
      <div class="mb-4 flex gap-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="🔍 Buscar por nombre, CURP o matrícula..."
          class="flex-1 input"
        />
        <select v-model="filtroGrado" class="input">
          <option value="">Todos los grados</option>
          <option value="1">1°</option>
          <option value="2">2°</option>
          <option value="3">3°</option>
          <option value="4">4°</option>
          <option value="5">5°</option>
          <option value="6">6°</option>
        </select>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Matrícula</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grado</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado Pago</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="alumno in alumnosFiltrados" :key="alumno.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ alumno.matricula }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ `${alumno.nombre} ${alumno.apellidoPaterno} ${alumno.apellidoMaterno}` }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ getGradoLabel(alumno.grupoId) }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <AppBadge :variant="getEstadoPagoVariant(alumno.id)">
                  {{ getEstadoPagoTexto(alumno.id) }}
                </AppBadge>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <router-link :to="`/alumnos/${alumno.id}`" class="text-primary-600 hover:text-primary-900">
                  Ver
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <AppModal :show="showWizard" @close="showWizard = false" size="xl">
      <template #title>Registrar Nuevo Alumno</template>
      <AlumnoWizard @close="showWizard = false" @success="handleAlumnoRegistrado" />
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useStorage } from '../composables/useStorage';
import type { Alumno, Grupo } from '../types';
import AppButton from '../components/ui/AppButton.vue';
import AppCard from '../components/ui/AppCard.vue';
import AppModal from '../components/ui/AppModal.vue';
import AppBadge from '../components/ui/AppBadge.vue';
import AlumnoWizard from '../components/alumnos/AlumnoWizard.vue';
import { usePagosStore } from '../stores/pagos.store';

const alumnosStorage = useStorage<Alumno>('escolar_alumnos');
const searchQuery = ref('');
const filtroGrado = ref('');
const showWizard = ref(false);

const pagosStore = usePagosStore();

const alumnosFiltrados = computed(() => {
  let alumnos = alumnosStorage.get();

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    alumnos = alumnos.filter(a =>
      a.nombre.toLowerCase().includes(query) ||
      a.apellidoPaterno.toLowerCase().includes(query) ||
      a.matricula.toLowerCase().includes(query) ||
      a.curp.toLowerCase().includes(query)
    );
  }

  return alumnos;
});

const handleAlumnoRegistrado = () => {
  showWizard.value = false;
  // Recargar datos
};

const getGradoLabel = (grupoId: string): string => {
  const gruposStorage = useStorage<Grupo>('escolar_grupos');
  const grupo = gruposStorage.findById(grupoId);
  return grupo ? `${grupo.gradoId}${grupo.nombre}` : 'N/A';
};

const getEstadoPagoVariant = (alumnoId: string): 'success' | 'warning' | 'danger' => {
  const estado = pagosStore.getEstadoPagoAlumno(alumnoId);
  if (estado.color === 'red') return 'danger';
  if (estado.color === 'yellow') return 'warning';
  return 'success';
};

const getEstadoPagoTexto = (alumnoId: string): string => {
  const estado = pagosStore.getEstadoPagoAlumno(alumnoId);
  return estado.texto;
};
</script>
