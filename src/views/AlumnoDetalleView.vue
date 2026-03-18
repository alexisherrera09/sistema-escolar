<template>
  <div>
    <div class="mb-6">
      <router-link to="/alumnos" class="text-primary-600 hover:text-primary-800">← Alumnos</router-link>
    </div>

    <div v-if="alumno" class="card">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">
        {{ `${alumno.nombre} ${alumno.apellidoPaterno} ${alumno.apellidoMaterno}` }}
        <span class="text-lg font-normal text-gray-500">· {{ alumno.matricula }}</span>
      </h2>

      <!-- Tabs -->
      <div class="border-b border-gray-200 mb-6">
        <nav class="flex space-x-8">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="tabActivo = tab.id"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
              tabActivo === tab.id
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            ]"
          >
            {{ tab.label }}
          </button>
        </nav>
      </div>

      <!-- Contenido de tabs -->
      <div v-if="tabActivo === 'datos'">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 class="font-semibold text-gray-900 mb-2">Datos Personales</h3>
            <p class="text-sm text-gray-600">CURP: {{ alumno.curp }}</p>
            <p class="text-sm text-gray-600">Fecha Nac.: {{ formatDate(alumno.fechaNacimiento) }}</p>
            <p class="text-sm text-gray-600">Grado: {{ getGradoNombre(alumno.grupoId) }}</p>
          </div>

          <div>
            <h3 class="font-semibold text-gray-900 mb-2">Datos Familiares</h3>
            <p class="text-sm text-gray-600">Tutor: {{ getTutorNombre(alumno.tutorPrincipalId) }}</p>
            <p class="text-sm text-gray-600">Correo: {{ getTutorCorreo(alumno.tutorPrincipalId) }}</p>
            <p class="text-sm text-gray-600">Teléfono: {{ getTutorTelefono(alumno.tutorPrincipalId) }}</p>
          </div>
        </div>
      </div>

      <div v-if="tabActivo === 'academico'">
        <div class="space-y-4">
          <h3 class="font-semibold text-gray-900 mb-4">Información Académica</h3>
          <p class="text-gray-600">Grado: {{ getGradoNombre(alumno.grupoId) }}</p>
          <p class="text-gray-600">Ciclo: {{ getCicloNombre() }}</p>
          <!-- Aquí se pueden agregar calificaciones y boletas -->
        </div>
      </div>

      <div v-if="tabActivo === 'pagos'">
        <div class="space-y-4">
          <h3 class="font-semibold text-gray-900 mb-4">Estado de Cuenta</h3>
          <router-link :to="`/pagos?alumno=${alumno.id}`" class="text-primary-600 hover:text-primary-800">
            Ver estado de cuenta completo →
          </router-link>
        </div>
      </div>

      <div v-if="tabActivo === 'expediente'">
        <ExpedienteMedico :expediente="alumno.expedienteMedico" />
      </div>

      <div v-if="tabActivo === 'documentos'">
        <div class="space-y-4">
          <h3 class="font-semibold text-gray-900 mb-4">Documentos</h3>
          <p class="text-gray-600">Gestión de documentos en desarrollo</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useStorage } from '../composables/useStorage';
import { useSingleStorage } from '../composables/useStorage';
import type { Alumno, Tutor, Grupo, CicloEscolar } from '../types';
import { formatDate } from '../utils/formatters';
import AppCard from '../components/ui/AppCard.vue';
import ExpedienteMedico from '../components/alumnos/ExpedienteMedico.vue';

const route = useRoute();
const alumnosStorage = useStorage<Alumno>('escolar_alumnos');
const tutoresStorage = useStorage<Tutor>('escolar_tutores');
const gruposStorage = useStorage<Grupo>('escolar_grupos');
const cicloStorage = useSingleStorage<CicloEscolar>('escolar_ciclo');

const tabActivo = ref('datos');

const tabs = [
  { id: 'datos', label: 'Datos' },
  { id: 'academico', label: 'Académico' },
  { id: 'pagos', label: 'Pagos' },
  { id: 'expediente', label: 'Expediente' },
  { id: 'documentos', label: 'Documentos' },
];

const alumno = computed(() => {
  return alumnosStorage.findById(route.params.id as string);
});

const getTutorNombre = (tutorId: string): string => {
  const tutor = tutoresStorage.findById(tutorId);
  return tutor?.nombre || 'N/A';
};

const getTutorCorreo = (tutorId: string): string => {
  const tutor = tutoresStorage.findById(tutorId);
  return tutor?.correo || 'N/A';
};

const getTutorTelefono = (tutorId: string): string => {
  const tutor = tutoresStorage.findById(tutorId);
  return tutor?.telefono || 'N/A';
};

const getGradoNombre = (grupoId: string): string => {
  const grupo = gruposStorage.findById(grupoId);
  return grupo ? `${grupo.gradoId}${grupo.nombre}` : 'N/A';
};

const getCicloNombre = (): string => {
  const ciclo = cicloStorage.get();
  return ciclo?.nombre || 'N/A';
};
</script>
