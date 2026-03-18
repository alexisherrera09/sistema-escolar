<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-gray-900">🍽️ Comedor</h2>
      <AppButton @click="showNuevoMenu = true">+ Nuevo Menú</AppButton>
    </div>

    <div class="card mb-6">
      <h3 class="text-lg font-semibold mb-4">Menú de la Semana</h3>
      <div v-if="menuActual" class="space-y-3">
        <div
          v-for="dia in menuActual.dias"
          :key="dia.dia"
          class="p-4 bg-gray-50 rounded-lg border border-gray-200"
        >
          <h4 class="font-semibold text-gray-900 mb-2 capitalize">{{ dia.dia }}</h4>
          <p class="text-sm text-gray-700">
            <span class="font-medium">Sopa:</span> {{ dia.sopa }} ·
            <span class="font-medium">Platillo:</span> {{ dia.platilloPrincipal }} ·
            <span class="font-medium">Bebida:</span> {{ dia.bebida }}
          </p>
        </div>
      </div>
      <div v-else class="text-center py-8 text-gray-600">
        No hay menú configurado para esta semana
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <AppCard>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Alumnos inscritos</p>
            <p class="text-2xl font-bold text-gray-900">{{ inscripcionesActivas.length }}</p>
          </div>
          <span class="text-3xl">👥</span>
        </div>
      </AppCard>
      <AppCard>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Raciones hoy</p>
            <p class="text-2xl font-bold text-gray-900">{{ racionesHoy }}</p>
          </div>
          <span class="text-3xl">🍽️</span>
        </div>
      </AppCard>
      <AppCard>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Faltas</p>
            <p class="text-2xl font-bold text-gray-900">{{ faltas }}</p>
          </div>
          <span class="text-3xl">❌</span>
        </div>
      </AppCard>
    </div>

    <div class="card">
      <div class="flex gap-2 mb-4">
        <AppButton variant="outline" size="sm" @click="mostrarLista = true">
          📋 Lista del día
        </AppButton>
        <AppButton variant="outline" size="sm" @click="mostrarEstadisticas = true">
          📊 Estadísticas
        </AppButton>
        <AppButton variant="outline" size="sm" @click="mostrarPagos = true">
          💰 Pagos Comedor
        </AppButton>
      </div>
    </div>

    <AppModal :show="showNuevoMenu" @close="showNuevoMenu = false" size="lg">
      <template #title>Nuevo Menú Semanal</template>
      <p class="text-gray-600">Formulario de menú en desarrollo</p>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useComedorStore } from '../stores/comedor.store';
import AppButton from '../components/ui/AppButton.vue';
import AppCard from '../components/ui/AppCard.vue';
import AppModal from '../components/ui/AppModal.vue';

const comedorStore = useComedorStore();

const showNuevoMenu = ref(false);
const mostrarLista = ref(false);
const mostrarEstadisticas = ref(false);
const mostrarPagos = ref(false);

const menuActual = computed(() => comedorStore.getMenuActual());
const inscripcionesActivas = computed(() => comedorStore.getInscripcionesActivas());

const racionesHoy = computed(() => {
  // Placeholder - implementar lógica real
  return inscripcionesActivas.value.length - 2;
});

const faltas = computed(() => {
  // Placeholder - implementar lógica real
  return 2;
});
</script>
