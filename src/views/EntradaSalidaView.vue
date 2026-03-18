<template>
  <div>
    <h2 class="text-2xl font-bold text-gray-900 mb-6">🚪 Entrada y Salida</h2>

    <div class="card mb-6">
      <div class="mb-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="🔍 Buscar alumno por nombre o matrícula..."
          class="w-full input"
          @input="buscarAlumno"
        />
      </div>

      <div v-if="alumnoSeleccionado" class="bg-blue-50 p-4 rounded-lg mb-4">
        <h4 class="font-semibold text-gray-900 mb-2">
          {{ `${alumnoSeleccionado.nombre} ${alumnoSeleccionado.apellidoPaterno} ${alumnoSeleccionado.apellidoMaterno}` }}
        </h4>
        <p class="text-sm text-gray-600">Grado: {{ getGradoNombre(alumnoSeleccionado.grupoId) }}</p>
        <p class="text-sm text-gray-600">Personas autorizadas:</p>
        <ul class="text-sm text-gray-700 list-disc list-inside">
          <li v-for="persona in alumnoSeleccionado.personasAutorizadas" :key="persona.nombre">
            {{ persona.nombre }} ({{ persona.parentesco }})
          </li>
        </ul>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <AppCard>
        <h3 class="text-lg font-semibold mb-4">Registrar Entrada</h3>
        <div v-if="alumnoSeleccionado" class="space-y-4">
          <AppInput
            v-model="horaEntrada"
            type="time"
            label="Hora de entrada"
            required
          />
          <AppButton @click="registrarEntrada" :disabled="!horaEntrada">
            📥 Registrar Entrada
          </AppButton>
        </div>
        <p v-else class="text-gray-600">Busca un alumno para registrar entrada</p>
      </AppCard>

      <AppCard>
        <h3 class="text-lg font-semibold mb-4">Registrar Salida</h3>
        <div v-if="alumnoSeleccionado" class="space-y-4">
          <AppInput
            v-model="horaSalida"
            type="time"
            label="Hora de salida"
            required
          />
          <AppSelect
            v-model="personaRecoge"
            label="Persona que recoge"
            :options="personasAutorizadasOptions"
            placeholder="Selecciona quien recoge"
          />
          <AppButton @click="registrarSalida" :disabled="!horaSalida">
            📤 Registrar Salida
          </AppButton>
        </div>
        <p v-else class="text-gray-600">Busca un alumno para registrar salida</p>
      </AppCard>
    </div>

    <div class="card">
      <h3 class="text-lg font-semibold mb-4">Registros de HOY</h3>
      <div class="space-y-2">
        <div
          v-for="registro in registrosHoy"
          :key="registro.id"
          class="p-3 bg-gray-50 rounded-lg flex items-center justify-between"
        >
          <div>
            <span class="font-medium">{{ registro.hora }}</span>
            <span class="ml-2">{{ getAlumnoNombre(registro.alumnoId) }}</span>
            <span class="ml-2 text-sm text-gray-600">
              {{ registro.tipo === 'entrada' ? 'ENTRADA' : 'SALIDA' }}
            </span>
            <AppBadge
              v-if="registro.tardanza"
              variant="warning"
              class="ml-2"
            >
              Tardanza
            </AppBadge>
            <AppBadge
              v-if="registro.salida_anticipada"
              variant="info"
              class="ml-2"
            >
              Salida anticipada
            </AppBadge>
          </div>
          <span v-if="registro.personaRecogeNombre" class="text-sm text-gray-600">
            · {{ registro.personaRecogeNombre }}
          </span>
        </div>
      </div>

      <div v-if="registrosHoy.length === 0" class="text-center py-8 text-gray-600">
        No hay registros hoy
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useEntradaSalidaStore } from '../stores/entrada-salida.store';
import { useAlumnosStore } from '../stores/alumnos.store';
import { useStorage } from '../composables/useStorage';
import type { Alumno, Grupo } from '../types';
import { format } from 'date-fns';
import { useToast } from 'vue-toastification';
import AppButton from '../components/ui/AppButton.vue';
import AppCard from '../components/ui/AppCard.vue';
import AppInput from '../components/ui/AppInput.vue';
import AppSelect from '../components/ui/AppSelect.vue';
import AppBadge from '../components/ui/AppBadge.vue';

const entradaSalidaStore = useEntradaSalidaStore();
const alumnosStore = useAlumnosStore();
const gruposStorage = useStorage<Grupo>('escolar_grupos');
const toast = useToast();

const searchQuery = ref('');
const alumnoSeleccionado = ref<Alumno | null>(null);
const horaEntrada = ref('');
const horaSalida = ref('');
const personaRecoge = ref('');

const registrosHoy = computed(() => {
  return entradaSalidaStore.getRegistrosDelDia();
});

const personasAutorizadasOptions = computed(() => {
  if (!alumnoSeleccionado.value) return [];
  return alumnoSeleccionado.value.personasAutorizadas.map(p => ({
    value: p.nombre,
    label: `${p.nombre} (${p.parentesco})`,
  }));
});

const buscarAlumno = () => {
  if (!searchQuery.value) {
    alumnoSeleccionado.value = null;
    return;
  }

  const resultados = alumnosStore.buscarAlumno(searchQuery.value);
  if (resultados.length > 0) {
    alumnoSeleccionado.value = resultados[0];
  } else {
    alumnoSeleccionado.value = null;
  }
};

const getGradoNombre = (grupoId: string): string => {
  const grupo = gruposStorage.findById(grupoId);
  return grupo ? `${grupo.gradoId}${grupo.nombre}` : 'N/A';
};

const getAlumnoNombre = (alumnoId: string): string => {
  const alumno = alumnosStore.getAlumno(alumnoId);
  return alumno ? `${alumno.nombre} ${alumno.apellidoPaterno}` : 'N/A';
};

const registrarEntrada = async () => {
  if (!alumnoSeleccionado.value || !horaEntrada.value) return;

  try {
    entradaSalidaStore.registrarEntrada(alumnoSeleccionado.value.id, horaEntrada.value);
    toast.success('Entrada registrada correctamente');
    horaEntrada.value = '';
    searchQuery.value = '';
    alumnoSeleccionado.value = null;
  } catch (error) {
    toast.error('Error al registrar entrada');
    console.error(error);
  }
};

const registrarSalida = async () => {
  if (!alumnoSeleccionado.value || !horaSalida.value) return;

  try {
    entradaSalidaStore.registrarSalida(
      alumnoSeleccionado.value.id,
      horaSalida.value,
      undefined,
      personaRecoge.value
    );
    toast.success('Salida registrada correctamente');
    horaSalida.value = '';
    personaRecoge.value = '';
    searchQuery.value = '';
    alumnoSeleccionado.value = null;
  } catch (error: any) {
    toast.error(error.message || 'Error al registrar salida');
    console.error(error);
  }
};
</script>
