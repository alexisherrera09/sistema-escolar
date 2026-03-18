<template>
  <div>
    <h2 class="text-2xl font-bold text-gray-900 mb-6">📚 Grupos y Materias</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <AppCard v-for="grupo in grupos" :key="grupo.id" class="cursor-pointer hover:shadow-lg transition-shadow">
        <div class="text-center">
          <h3 class="text-xl font-bold text-primary-600 mb-2">{{ getGradoNombre(grupo.gradoId) }} {{ grupo.nombre }}</h3>
          <p class="text-sm text-gray-600">{{ getAlumnosCount(grupo.id) }} alumnos</p>
          <p class="text-sm text-gray-500">{{ getMaestroNombre(grupo.maestroTitularId) }}</p>
        </div>
      </AppCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useGruposStore } from '../stores/grupos.store';
import { useMaestrosStore } from '../stores/maestros.store';
import AppCard from '../components/ui/AppCard.vue';

const gruposStore = useGruposStore();
const maestrosStore = useMaestrosStore();

const grupos = computed(() => gruposStore.grupos);

const getGradoNombre = (gradoId: string): string => {
  const grados: Record<string, string> = {
    gr1: '1°',
    gr2: '2°',
    gr3: '3°',
    gr4: '4°',
    gr5: '5°',
    gr6: '6°',
  };
  return grados[gradoId] || gradoId;
};

const getAlumnosCount = (grupoId: string): number => {
  return gruposStore.getAlumnosEnGrupo(grupoId).length;
};

const getMaestroNombre = (maestroId: string): string => {
  const maestro = maestrosStore.getMaestro(maestroId);
  return maestro?.nombre || 'Sin asignar';
};
</script>
