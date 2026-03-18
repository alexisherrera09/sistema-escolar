<template>
  <div>
    <h2 class="text-2xl font-bold text-gray-900 mb-6">✅ Asistencia</h2>

    <div v-if="!grupoSeleccionado" class="card">
      <h3 class="text-lg font-semibold mb-4">Selecciona un grupo</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          v-for="grupo in gruposDisponibles"
          :key="grupo.id"
          @click="seleccionarGrupo(grupo)"
          class="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-left"
        >
          <h4 class="font-semibold text-gray-900">{{ getGradoNombre(grupo.gradoId) }} {{ grupo.nombre }}</h4>
          <p class="text-sm text-gray-600">{{ getAlumnosCount(grupo.id) }} alumnos</p>
        </button>
      </div>
    </div>

    <div v-else>
      <div class="mb-4">
        <AppButton variant="outline" size="sm" @click="grupoSeleccionado = null">
          ← Cambiar grupo
        </AppButton>
      </div>
      <AsistenciaLista
        :grupo-id="grupoSeleccionado.id"
        :grupo-nombre="`${getGradoNombre(grupoSeleccionado.gradoId)} ${grupoSeleccionado.nombre}`"
        :maestro-nombre="getMaestroNombre(grupoSeleccionado.maestroTitularId)"
        @saved="handleAsistenciaGuardada"
        @cancel="grupoSeleccionado = null"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useStorage } from '../composables/useStorage';
import { useAlumnosStore } from '../stores/alumnos.store';
import type { Grupo, Maestro } from '../types';
import { useAuthStore } from '../stores/auth.store';
import AppButton from '../components/ui/AppButton.vue';
import AppCard from '../components/ui/AppCard.vue';
import AsistenciaLista from '../components/asistencia/AsistenciaLista.vue';

const authStore = useAuthStore();
const alumnosStore = useAlumnosStore();
const gruposStorage = useStorage<Grupo>('escolar_grupos');
const maestrosStorage = useStorage<Maestro>('escolar_maestros');

const grupoSeleccionado = ref<Grupo | null>(null);

const gruposDisponibles = computed(() => {
  const grupos = gruposStorage.get();
  
  // Si es maestro, solo mostrar su grupo
  if (authStore.userRole === 'maestro') {
    const maestro = maestrosStorage.find(m => m.usuarioId === authStore.currentUser?.id);
    if (maestro?.grupoTitularId) {
      return grupos.filter(g => g.id === maestro.grupoTitularId);
    }
  }
  
  return grupos.filter(g => g.activo);
});

const seleccionarGrupo = (grupo: Grupo) => {
  grupoSeleccionado.value = grupo;
};

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
  return alumnosStore.getAlumnosPorGrupo(grupoId).length;
};

const getMaestroNombre = (maestroId: string): string => {
  const maestro = maestrosStorage.findById(maestroId);
  return maestro?.nombre || 'Sin asignar';
};

const handleAsistenciaGuardada = () => {
  // Mostrar mensaje de éxito
  grupoSeleccionado.value = null;
};
</script>
