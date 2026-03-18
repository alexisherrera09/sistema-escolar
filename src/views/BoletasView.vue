<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-gray-900">📄 Boletas de Calificaciones</h2>
      <AppButton @click="showPublicar = true">📢 Publicar Boletas</AppButton>
    </div>

    <div class="card mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AppSelect
          v-model="periodoSeleccionado"
          label="Período"
          :options="periodosOptions"
          placeholder="Selecciona un período"
        />
        <AppSelect
          v-model="gradoSeleccionado"
          label="Grado"
          :options="gradosOptions"
          placeholder="Selecciona un grado"
        />
        <AppSelect
          v-model="grupoSeleccionado"
          label="Grupo"
          :options="gruposOptions"
          placeholder="Selecciona un grupo"
        />
      </div>
    </div>

    <div v-if="puedeMostrarBoletas" class="card">
      <div class="mb-4 flex justify-between items-center">
        <h3 class="text-lg font-semibold">Boletas del Período</h3>
        <AppBadge v-if="periodo?.boletasPublicadas" variant="success">
          ✅ Publicadas
        </AppBadge>
        <AppBadge v-else variant="warning">
          ⚠️ No publicadas
        </AppBadge>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Matrícula</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Alumno</th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Promedio</th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="alumno in alumnos" :key="alumno.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ alumno.matricula }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ `${alumno.nombre} ${alumno.apellidoPaterno} ${alumno.apellidoMaterno}` }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <span class="text-lg font-semibold">
                  {{ getPromedioAlumno(alumno.id).toFixed(1) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <AppButton size="sm" variant="outline" @click="verBoleta(alumno)">
                  👁️ Ver Boleta
                </AppButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-else class="card">
      <p class="text-gray-600 text-center py-8">
        Selecciona período, grado y grupo para ver las boletas
      </p>
    </div>

    <!-- Modal Publicar Boletas -->
    <AppModal :show="showPublicar" @close="showPublicar = false" size="lg">
      <template #title>Publicar Boletas</template>
      <PublicarBoletas @close="showPublicar = false" @success="handleBoletasPublicadas" />
    </AppModal>

    <!-- Modal Ver Boleta -->
    <AppModal :show="showBoleta" @close="showBoleta = false" size="xl">
      <template #title>Boleta de Calificaciones</template>
      <BoletaAlumno
        v-if="alumnoSeleccionado && periodoSeleccionado"
        :alumno="alumnoSeleccionado"
        :periodo="periodo"
        :ciclo="ciclo!"
        :maestro-nombre="getMaestroNombre()"
        :grupo-nombre="getGrupoNombre()"
        @close="showBoleta = false"
      />
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useCalificacionesStore } from '../stores/calificaciones.store';
import { useAlumnosStore } from '../stores/alumnos.store';
import { useStorage } from '../composables/useStorage';
import { useSingleStorage } from '../composables/useStorage';
import type { Alumno, Grupo, CicloEscolar, Periodo } from '../types';
import AppButton from '../components/ui/AppButton.vue';
import AppCard from '../components/ui/AppCard.vue';
import AppSelect from '../components/ui/AppSelect.vue';
import AppModal from '../components/ui/AppModal.vue';
import AppBadge from '../components/ui/AppBadge.vue';
import PublicarBoletas from '../components/calificaciones/PublicarBoletas.vue';
import BoletaAlumno from '../components/calificaciones/BoletaAlumno.vue';

const calificacionesStore = useCalificacionesStore();
const alumnosStore = useAlumnosStore();
const gruposStorage = useStorage<Grupo>('escolar_grupos');
const cicloStorage = useSingleStorage<CicloEscolar>('escolar_ciclo');

const periodoSeleccionado = ref('');
const gradoSeleccionado = ref('');
const grupoSeleccionado = ref('');
const showPublicar = ref(false);
const showBoleta = ref(false);
const alumnoSeleccionado = ref<Alumno | null>(null);

const ciclo = computed(() => cicloStorage.get());

const periodosOptions = computed(() => {
  return ciclo.value?.periodos.map(p => ({
    value: p.id,
    label: p.nombre,
  })) || [];
});

const gradosOptions = [
  { value: '1', label: '1° Primaria' },
  { value: '2', label: '2° Primaria' },
  { value: '3', label: '3° Primaria' },
  { value: '4', label: '4° Primaria' },
  { value: '5', label: '5° Primaria' },
  { value: '6', label: '6° Primaria' },
];

const gruposOptions = computed(() => {
  if (!gradoSeleccionado.value) return [];
  const grupos = gruposStorage.get();
  return grupos
    .filter(g => g.gradoId === `gr${gradoSeleccionado.value}`)
    .map(g => ({ value: g.id, label: g.nombre }));
});

const alumnos = computed(() => {
  if (!grupoSeleccionado.value) return [];
  return alumnosStore.getAlumnosPorGrupo(grupoSeleccionado.value);
});

const periodo = computed(() => {
  if (!periodoSeleccionado.value || !ciclo.value) return null;
  return ciclo.value.periodos.find(p => p.id === periodoSeleccionado.value) || null;
});

const puedeMostrarBoletas = computed(() => {
  return periodoSeleccionado.value && grupoSeleccionado.value;
});

const getPromedioAlumno = (alumnoId: string): number => {
  if (!periodoSeleccionado.value) return 0;
  return calificacionesStore.getPromedioGeneralAlumno(alumnoId, periodoSeleccionado.value);
};

const getMaestroNombre = (): string => {
  if (!grupoSeleccionado.value) return 'N/A';
  const grupo = gruposStorage.findById(grupoSeleccionado.value);
  // Obtener maestro desde store de maestros (por ahora placeholder)
  return grupo ? 'Maestro del Grupo' : 'N/A';
};

const getGrupoNombre = (): string => {
  if (!grupoSeleccionado.value) return 'N/A';
  const grupo = gruposStorage.findById(grupoSeleccionado.value);
  return grupo ? `${grupo.gradoId}${grupo.nombre}` : 'N/A';
};

const verBoleta = (alumno: Alumno) => {
  alumnoSeleccionado.value = alumno;
  showBoleta.value = true;
};

const handleBoletasPublicadas = () => {
  showPublicar.value = false;
};
</script>
