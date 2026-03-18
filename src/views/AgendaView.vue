<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-gray-900">📢 Agenda Escolar</h2>
      <AppButton @click="showNuevoComunicado = true">+ Nuevo Comunicado</AppButton>
    </div>

    <div class="card mb-6">
      <div class="flex gap-4 mb-4">
        <select v-model="filtroDestinatario" class="input max-w-xs">
          <option value="">Todos los destinatarios</option>
          <option value="todos">Toda la escuela</option>
          <option value="grado">Por grado</option>
          <option value="grupo">Por grupo</option>
        </select>
        <select v-model="filtroTipo" class="input max-w-xs">
          <option value="">Todos los tipos</option>
          <option value="aviso">Aviso</option>
          <option value="tarea">Tarea</option>
          <option value="evento">Evento</option>
          <option value="circular">Circular</option>
          <option value="urgente">Urgente</option>
        </select>
      </div>

      <div class="space-y-4">
        <ComunicadoCard
          v-for="comunicado in comunicadosFiltrados"
          :key="comunicado.id"
          :comunicado="comunicado"
          :mostrar-lecturas="true"
        />
      </div>

      <div v-if="comunicadosFiltrados.length === 0" class="text-center py-8 text-gray-600">
        No hay comunicados
      </div>
    </div>

    <AppModal :show="showNuevoComunicado" @close="showNuevoComunicado = false" size="lg">
      <template #title>Nuevo Comunicado</template>
      <ComunicadoForm @close="showNuevoComunicado = false" @success="handleComunicadoPublicado" />
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useComunicadosStore } from '../stores/comunicados.store';
import { useAuthStore } from '../stores/auth.store';
import { DestinatarioComunicado } from '../types';
import AppButton from '../components/ui/AppButton.vue';
import AppCard from '../components/ui/AppCard.vue';
import AppModal from '../components/ui/AppModal.vue';
import ComunicadoForm from '../components/comunicados/ComunicadoForm.vue';
import ComunicadoCard from '../components/comunicados/ComunicadoCard.vue';

const comunicadosStore = useComunicadosStore();
const authStore = useAuthStore();

const showNuevoComunicado = ref(false);
const filtroDestinatario = ref('');
const filtroTipo = ref('');

const comunicadosFiltrados = computed(() => {
  let comunicados = comunicadosStore.comunicados;

  // Filtrar por destinatario según rol
  if (authStore.userRole === 'maestro') {
    // Maestros solo ven comunicados de su grupo
    // Placeholder - obtener grupo del maestro
    comunicados = comunicados.filter(c => 
      c.destinatario === DestinatarioComunicado.TODOS ||
      c.destinatario === DestinatarioComunicado.GRUPO
    );
  }

  if (filtroDestinatario.value) {
    comunicados = comunicados.filter(c => c.destinatario === filtroDestinatario.value);
  }

  if (filtroTipo.value) {
    comunicados = comunicados.filter(c => c.tipo === filtroTipo.value);
  }

  return comunicados.sort((a, b) => b.publicadoEn.localeCompare(a.publicadoEn));
});

const handleComunicadoPublicado = () => {
  showNuevoComunicado.value = false;
};
</script>
