<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-gray-900">📋 Inscripciones</h2>
      <AppButton @click="showNuevaInscripcion = true">+ Nueva Inscripción</AppButton>
    </div>

    <div class="card mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div class="bg-blue-50 p-4 rounded-lg">
          <p class="text-sm text-gray-600">Nuevos ingresos</p>
          <p class="text-2xl font-bold text-blue-600">
            {{ nuevasInscripciones.length }} solicitudes
          </p>
          <p class="text-xs text-gray-500 mt-1">
            Confirmadas: {{ nuevasConfirmadas }}
          </p>
        </div>
        <div class="bg-green-50 p-4 rounded-lg">
          <p class="text-sm text-gray-600">Reinscripciones</p>
          <p class="text-2xl font-bold text-green-600">
            {{ reinscripciones.length }} total
          </p>
          <p class="text-xs text-gray-500 mt-1">
            Confirmadas: {{ reinscripcionesConfirmadas }} · Pendientes: {{ reinscripcionesPendientes }}
          </p>
        </div>
        <div class="bg-yellow-50 p-4 rounded-lg">
          <p class="text-sm text-gray-600">En revisión</p>
          <p class="text-2xl font-bold text-yellow-600">
            {{ enRevision }}
          </p>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="mb-4 flex gap-4">
        <select v-model="filtroTipo" class="input max-w-xs">
          <option value="">Todos los tipos</option>
          <option value="nueva">Nuevo ingreso</option>
          <option value="reinscripcion">Reinscripción</option>
        </select>
        <select v-model="filtroEstado" class="input max-w-xs">
          <option value="">Todos los estados</option>
          <option value="en_revision">En revisión</option>
          <option value="pendiente_pago">Pendiente pago</option>
          <option value="confirmada">Confirmada</option>
          <option value="cancelada">Cancelada</option>
        </select>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Alumno</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grado Sig.</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="inscripcion in inscripcionesFiltradas" :key="inscripcion.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ getAlumnoNombre(inscripcion.alumnoId) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <AppBadge :variant="inscripcion.tipo === 'nueva' ? 'info' : 'success'">
                  {{ inscripcion.tipo === 'nueva' ? 'Nuevo ingreso' : 'Reinscripción' }}
                </AppBadge>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ inscripcion.gradoDestino }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <AppBadge :variant="getEstadoVariant(inscripcion.status)">
                  {{ getEstadoTexto(inscripcion.status) }}
                </AppBadge>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  v-if="inscripcion.status === 'pendiente_pago'"
                  @click="confirmarInscripcion(inscripcion.id)"
                  class="text-green-600 hover:text-green-900 mr-3"
                >
                  Confirmar
                </button>
                <button
                  @click="verDetalle(inscripcion.id)"
                  class="text-primary-600 hover:text-primary-900"
                >
                  Ver
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="inscripcionesFiltradas.length === 0" class="text-center py-8 text-gray-600">
        No hay inscripciones
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useInscripcionesStore } from '../stores/inscripciones.store';
import { useAlumnosStore } from '../stores/alumnos.store';
import { EstadoInscripcion } from '../types';
import { useToast } from 'vue-toastification';
import AppButton from '../components/ui/AppButton.vue';
import AppCard from '../components/ui/AppCard.vue';
import AppBadge from '../components/ui/AppBadge.vue';

const inscripcionesStore = useInscripcionesStore();
const alumnosStore = useAlumnosStore();
const toast = useToast();

const showNuevaInscripcion = ref(false);
const filtroTipo = ref('');
const filtroEstado = ref('');

const nuevasInscripciones = computed(() => inscripcionesStore.getInscripcionesNuevas());
const reinscripciones = computed(() => inscripcionesStore.getInscripcionesReinscripciones());

const nuevasConfirmadas = computed(() => {
  return nuevasInscripciones.value.filter(i => i.status === EstadoInscripcion.CONFIRMADA).length;
});

const reinscripcionesConfirmadas = computed(() => {
  return reinscripciones.value.filter(i => i.status === EstadoInscripcion.CONFIRMADA).length;
});

const reinscripcionesPendientes = computed(() => {
  return reinscripciones.value.filter(i => i.status === EstadoInscripcion.PENDIENTE_PAGO).length;
});

const enRevision = computed(() => {
  return inscripcionesStore.inscripciones.filter(i => i.status === EstadoInscripcion.EN_REVISION).length;
});

const inscripcionesFiltradas = computed(() => {
  let inscripciones = inscripcionesStore.inscripciones;

  if (filtroTipo.value) {
    inscripciones = inscripciones.filter(i => i.tipo === filtroTipo.value);
  }

  if (filtroEstado.value) {
    inscripciones = inscripciones.filter(i => i.status === filtroEstado.value);
  }

  return inscripciones.sort((a, b) => b.fecha.localeCompare(a.fecha));
});

const getAlumnoNombre = (alumnoId?: string): string => {
  if (!alumnoId) return 'Nuevo ingreso';
  const alumno = alumnosStore.getAlumno(alumnoId);
  return alumno ? `${alumno.nombre} ${alumno.apellidoPaterno} ${alumno.apellidoMaterno}` : 'N/A';
};

const getEstadoVariant = (estado: EstadoInscripcion): 'success' | 'warning' | 'danger' | 'info' => {
  if (estado === EstadoInscripcion.CONFIRMADA) return 'success';
  if (estado === EstadoInscripcion.PENDIENTE_PAGO) return 'warning';
  if (estado === EstadoInscripcion.CANCELADA) return 'danger';
  return 'info';
};

const getEstadoTexto = (estado: EstadoInscripcion): string => {
  const textos: Record<EstadoInscripcion, string> = {
    [EstadoInscripcion.EN_REVISION]: 'En revisión',
    [EstadoInscripcion.PENDIENTE_PAGO]: 'Pendiente pago',
    [EstadoInscripcion.CONFIRMADA]: 'Confirmada',
    [EstadoInscripcion.CANCELADA]: 'Cancelada',
    [EstadoInscripcion.LISTA_ESPERA]: 'Lista de espera',
  };
  return textos[estado] || estado;
};

const confirmarInscripcion = (id: string) => {
  inscripcionesStore.confirmarInscripcion(id);
  toast.success('Inscripción confirmada');
};

const verDetalle = (id: string) => {
  // Implementar vista de detalle
  alert('Vista de detalle en desarrollo');
};
</script>
