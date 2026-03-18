<template>
  <header class="bg-white border-b border-gray-200 sticky top-0 z-30">
    <div class="px-6 py-4 flex items-center justify-between">
      <h1 class="text-2xl font-semibold text-gray-900">
        {{ pageTitle }}
      </h1>
      <div class="flex items-center gap-4 flex-wrap">
        <VersionInfo />
        <div class="text-right">
          <p class="text-sm font-medium text-gray-900">{{ authStore.currentUser?.nombre }}</p>
          <p class="text-xs text-gray-500">{{ roleLabel }}</p>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '../../stores/auth.store';
import { UserRole } from '../../types';
import VersionInfo from '../VersionInfo.vue';

const route = useRoute();
const authStore = useAuthStore();

const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    '/': 'Dashboard',
    '/alumnos': 'Alumnos',
    '/grupos': 'Grupos y Materias',
    '/asistencia': 'Asistencia',
    '/calificaciones': 'Calificaciones',
    '/boletas': 'Boletas de Calificaciones',
    '/pagos': 'Pagos y Colegiaturas',
    '/cfdi': 'CFDI Emitidos',
    '/comedor': 'Comedor',
    '/entrada-salida': 'Entrada y Salida',
    '/comunicados': 'Agenda Escolar',
    '/becas': 'Becas y Descuentos',
    '/inscripciones': 'Inscripciones',
    '/reportes': 'Reportes',
    '/configuracion': 'Configuración',
  };
  return titles[route.path] || 'Sistema Escolar';
});

const roleLabel = computed(() => {
  const labels: Record<UserRole, string> = {
    [UserRole.DIRECTOR]: 'Director',
    [UserRole.COORDINADOR]: 'Coordinador',
    [UserRole.CAJERO]: 'Cajero',
    [UserRole.MAESTRO]: 'Maestro',
    [UserRole.PADRE]: 'Padre de Familia',
  };
  return labels[authStore.userRole!] || '';
});
</script>
