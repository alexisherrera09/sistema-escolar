<template>
  <div>
    <div class="mb-8">
      <h2 class="text-3xl font-bold text-gray-900 mb-2">Portal de Padres</h2>
      <p class="text-gray-600">Bienvenido, {{ authStore.currentUser?.nombre }}</p>
    </div>

    <div v-if="hijos.length === 0" class="card text-center py-12">
      <p class="text-gray-600">No tienes hijos registrados en el sistema</p>
    </div>

    <div v-else>
      <!-- Selector de hijo -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">Selecciona un hijo:</label>
        <select
          v-model="hijoSeleccionado"
          class="input max-w-md"
        >
          <option v-for="hijo in hijos" :key="hijo.id" :value="hijo.id">
            {{ `${hijo.nombre} ${hijo.apellidoPaterno} ${hijo.apellidoMaterno} · ${hijo.matricula}` }}
          </option>
        </select>
      </div>

      <div v-if="hijoSeleccionado" class="space-y-6">
        <!-- Resumen rápido -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AppCard>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">Promedio Actual</p>
                <p class="text-2xl font-bold text-gray-900">{{ promedioActual }}</p>
              </div>
              <span class="text-3xl">📚</span>
            </div>
          </AppCard>
          <AppCard>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">Asistencia</p>
                <p class="text-2xl font-bold text-gray-900">{{ porcentajeAsistencia }}%</p>
              </div>
              <span class="text-3xl">✅</span>
            </div>
          </AppCard>
          <AppCard>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">Estado de Pagos</p>
                <p class="text-lg font-semibold" :class="estadoPagoColor">
                  {{ estadoPagoTexto }}
                </p>
              </div>
              <span class="text-2xl">{{ estadoPagoIcono }}</span>
            </div>
          </AppCard>
        </div>

        <!-- Secciones -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AppCard class="cursor-pointer hover:shadow-lg transition-shadow" @click="mostrarCalificaciones = true">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">📚 Calificaciones</h3>
            <p class="text-sm text-gray-600">Ver calificaciones y boletas de tu hijo</p>
          </AppCard>
          <AppCard class="cursor-pointer hover:shadow-lg transition-shadow" @click="mostrarPagos = true">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">💰 Pagos</h3>
            <p class="text-sm text-gray-600">Estado de cuenta y pagos pendientes</p>
          </AppCard>
          <AppCard class="cursor-pointer hover:shadow-lg transition-shadow" @click="mostrarComunicados = true">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">📢 Comunicados</h3>
            <p class="text-sm text-gray-600">Avisos y comunicados del colegio</p>
          </AppCard>
          <AppCard class="cursor-pointer hover:shadow-lg transition-shadow" @click="mostrarAsistencia = true">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">✅ Asistencia</h3>
            <p class="text-sm text-gray-600">Registro de asistencia de tu hijo</p>
          </AppCard>
        </div>
      </div>
    </div>

    <!-- Modales -->
    <AppModal :show="mostrarCalificaciones" @close="mostrarCalificaciones = false" size="xl">
      <template #title>Calificaciones</template>
      <PortalCalificaciones :alumno-id="hijoSeleccionado" />
    </AppModal>

    <AppModal :show="mostrarPagos" @close="mostrarPagos = false" size="xl">
      <template #title>Estado de Cuenta</template>
      <PortalPagos :alumno-id="hijoSeleccionado" />
    </AppModal>

    <AppModal :show="mostrarComunicados" @close="mostrarComunicados = false" size="xl">
      <template #title>Comunicados</template>
      <PortalComunicados :alumno-id="hijoSeleccionado" />
    </AppModal>

    <AppModal :show="mostrarAsistencia" @close="mostrarAsistencia = false" size="xl">
      <template #title>Asistencia</template>
      <PortalAsistencia :alumno-id="hijoSeleccionado" />
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '../../stores/auth.store';
import { useAlumnosStore } from '../../stores/alumnos.store';
import { usePagosStore } from '../../stores/pagos.store';
import { useCalificacionesStore } from '../../stores/calificaciones.store';
import { useAsistenciaStore } from '../../stores/asistencia.store';
import { useSingleStorage } from '../../composables/useStorage';
import type { Alumno } from '../../types';
import AppCard from '../../components/ui/AppCard.vue';
import AppModal from '../../components/ui/AppModal.vue';
import PortalCalificaciones from './PortalCalificaciones.vue';
import PortalPagos from './PortalPagos.vue';
import PortalComunicados from './PortalComunicados.vue';
import PortalAsistencia from './PortalAsistencia.vue';

const authStore = useAuthStore();
const alumnosStore = useAlumnosStore();
const pagosStore = usePagosStore();
const calificacionesStore = useCalificacionesStore();
const asistenciaStore = useAsistenciaStore();

const hijoSeleccionado = ref('');
const mostrarCalificaciones = ref(false);
const mostrarPagos = ref(false);
const mostrarComunicados = ref(false);
const mostrarAsistencia = ref(false);

const hijos = computed(() => {
  if (!authStore.currentUser) return [];
  // Obtener hijos del tutor
  const tutor = alumnosStore.tutores.find(t => t.usuarioId === authStore.currentUser?.id);
  if (!tutor) return [];
  
  return tutor.alumnosIds
    .map(id => alumnosStore.getAlumno(id))
    .filter((a): a is Alumno => a !== undefined);
});

const promedioActual = computed(() => {
  if (!hijoSeleccionado.value) return '—';
  const ciclo = useSingleStorage('escolar_ciclo').get();
  if (!ciclo) return '—';
  
  // Obtener período actual
  const hoy = new Date();
  const periodoActual = ciclo.periodos.find(p => {
    const inicio = new Date(p.fechaInicio);
    const fin = new Date(p.fechaFin);
    return hoy >= inicio && hoy <= fin;
  });
  
  if (periodoActual) {
    const promedio = calificacionesStore.getPromedioGeneralAlumno(
      hijoSeleccionado.value,
      periodoActual.id
    );
    return promedio > 0 ? promedio.toFixed(1) : '—';
  }
  
  return '—';
});

const porcentajeAsistencia = computed(() => {
  if (!hijoSeleccionado.value) return 0;
  const estadisticas = asistenciaStore.getEstadisticasAsistencia(hijoSeleccionado.value, {
    inicio: '2024-08-19',
    fin: new Date().toISOString().split('T')[0],
  });
  return estadisticas.porcentaje;
});

const estadoPago = computed(() => {
  if (!hijoSeleccionado.value) return { color: 'gray', texto: '—', icono: '⚪' };
  return pagosStore.getEstadoPagoAlumno(hijoSeleccionado.value);
});

const estadoPagoColor = computed(() => {
  if (estadoPago.value.color === 'red') return 'text-red-600';
  if (estadoPago.value.color === 'yellow') return 'text-yellow-600';
  return 'text-green-600';
});

const estadoPagoTexto = computed(() => estadoPago.value.texto);
const estadoPagoIcono = computed(() => estadoPago.value.icono);

// Seleccionar primer hijo por defecto
if (hijos.value.length > 0) {
  hijoSeleccionado.value = hijos.value[0].id;
}
</script>
