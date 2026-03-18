<template>
  <div>
    <h2 class="text-2xl font-bold text-gray-900 mb-6">📝 Calificaciones</h2>

    <div class="card mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AppSelect
          v-model="grupoSeleccionado"
          label="Grupo"
          :options="gruposOptions"
          placeholder="Selecciona un grupo"
        />
        <AppSelect
          v-model="materiaSeleccionada"
          label="Materia"
          :options="materiasOptions"
          placeholder="Selecciona una materia"
        />
        <AppSelect
          v-model="periodoSeleccionado"
          label="Período"
          :options="periodosOptions"
          placeholder="Selecciona un período"
        />
      </div>
    </div>

    <div v-if="puedeCapturar" class="card">
      <div class="mb-4 flex justify-between items-center">
        <h3 class="text-lg font-semibold">Captura de Calificaciones</h3>
        <div class="flex gap-2">
          <AppButton variant="secondary" size="sm" @click="guardarBorrador">
            💾 Guardar
          </AppButton>
          <AppButton size="sm" @click="finalizarCaptura">
            ✅ Finalizar
          </AppButton>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Alumno</th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Eval 1</th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Eval 2</th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Eval 3</th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Promedio</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="alumno in alumnos" :key="alumno.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ `${alumno.apellidoPaterno} ${alumno.apellidoMaterno}, ${alumno.nombre}` }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <input
                  v-model.number="calificaciones[alumno.id][0]"
                  type="number"
                  min="5"
                  max="10"
                  step="0.1"
                  class="w-20 px-2 py-1 border rounded text-center"
                  @input="actualizarPromedio(alumno.id)"
                />
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <input
                  v-model.number="calificaciones[alumno.id][1]"
                  type="number"
                  min="5"
                  max="10"
                  step="0.1"
                  class="w-20 px-2 py-1 border rounded text-center"
                  @input="actualizarPromedio(alumno.id)"
                />
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <input
                  v-model.number="calificaciones[alumno.id][2]"
                  type="number"
                  min="5"
                  max="10"
                  step="0.1"
                  class="w-20 px-2 py-1 border rounded text-center"
                  @input="actualizarPromedio(alumno.id)"
                />
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <span
                  :class="[
                    'font-semibold',
                    promedios[alumno.id] < 6 ? 'text-red-600' : 'text-gray-900',
                  ]"
                >
                  {{ promedios[alumno.id]?.toFixed(1) || '—' }}
                  <span v-if="promedios[alumno.id] < 6" class="ml-1">⚠️</span>
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-else class="card">
      <p class="text-gray-600">Selecciona grupo, materia y período para comenzar la captura</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useCalificacionesStore } from '../stores/calificaciones.store';
import { useAlumnosStore } from '../stores/alumnos.store';
import { useStorage } from '../composables/useStorage';
import { useSingleStorage } from '../composables/useStorage';
import { calcularPromedio } from '../utils/calificaciones';
import type { Grupo, Alumno, CicloEscolar } from '../types';
import AppButton from '../components/ui/AppButton.vue';
import AppCard from '../components/ui/AppCard.vue';
import AppSelect from '../components/ui/AppSelect.vue';
import { useToast } from 'vue-toastification';

const calificacionesStore = useCalificacionesStore();
const alumnosStore = useAlumnosStore();
const gruposStorage = useStorage<Grupo>('escolar_grupos');
const cicloStorage = useSingleStorage<CicloEscolar>('escolar_ciclo');
const toast = useToast();

const grupoSeleccionado = ref('');
const materiaSeleccionada = ref('');
const periodoSeleccionado = ref('');
const calificaciones = ref<Record<string, number[]>>({});
const promedios = ref<Record<string, number>>({});

const gruposOptions = computed(() => {
  return gruposStorage.get().map(g => ({
    value: g.id,
    label: `${g.gradoId}${g.nombre}`,
  }));
});

const materiasOptions = computed(() => {
  // Placeholder - implementar lógica real según grado
  return [
    { value: 'esp', label: 'Español' },
    { value: 'mat', label: 'Matemáticas' },
    { value: 'civ', label: 'Ciencias Naturales' },
  ];
});

const periodosOptions = computed(() => {
  const ciclo = cicloStorage.get();
  return ciclo?.periodos.map(p => ({
    value: p.id,
    label: p.nombre,
  })) || [];
});

const alumnos = computed(() => {
  if (!grupoSeleccionado.value) return [];
  return alumnosStore.getAlumnosPorGrupo(grupoSeleccionado.value);
});

const puedeCapturar = computed(() => {
  return grupoSeleccionado.value && materiaSeleccionada.value && periodoSeleccionado.value;
});

watch([grupoSeleccionado, materiaSeleccionada, periodoSeleccionado], () => {
  if (puedeCapturar.value) {
    cargarCalificaciones();
  }
});

const cargarCalificaciones = () => {
  alumnos.value.forEach(alumno => {
    const calificacion = calificacionesStore.getCalificacionAlumno(
      alumno.id,
      periodoSeleccionado.value,
      materiaSeleccionada.value
    );

    if (calificacion) {
      calificaciones.value[alumno.id] = [...calificacion.evaluaciones];
      promedios.value[alumno.id] = calificacion.promedio;
    } else {
      calificaciones.value[alumno.id] = [0, 0, 0];
      promedios.value[alumno.id] = 0;
    }
  });
};

const actualizarPromedio = (alumnoId: string) => {
  const evals = calificaciones.value[alumnoId].filter(e => e > 0);
  promedios.value[alumnoId] = calcularPromedio(evals);
};

const guardarBorrador = async () => {
  const ciclo = cicloStorage.get();
  if (!ciclo) return;

  try {
    for (const alumno of alumnos.value) {
      const evals = calificaciones.value[alumno.id].filter(e => e > 0);
      if (evals.length > 0) {
        calificacionesStore.guardarCalificacion(
          alumno.id,
          materiaSeleccionada.value,
          periodoSeleccionado.value,
          ciclo.id,
          evals
        );
      }
    }
    toast.success('Calificaciones guardadas');
  } catch (error) {
    toast.error('Error al guardar calificaciones');
  }
};

const finalizarCaptura = async () => {
  await guardarBorrador();
  
  try {
    calificacionesStore.finalizarCaptura(
      grupoSeleccionado.value,
      periodoSeleccionado.value,
      materiaSeleccionada.value
    );
    toast.success('Captura finalizada');
  } catch (error) {
    toast.error('Error al finalizar captura');
  }
};
</script>
