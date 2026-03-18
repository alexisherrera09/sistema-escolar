<template>
  <div>
    <div v-if="!alumnoId" class="text-center py-8 text-gray-600">
      Selecciona un alumno
    </div>
    <div v-else>
      <h4 class="font-semibold text-gray-900 mb-4">Comunicados</h4>
      
      <div v-if="comunicados.length > 0" class="space-y-4">
        <div
          v-for="comunicado in comunicados"
          :key="comunicado.id"
          :class="[
            'p-4 rounded-lg border-2 cursor-pointer transition-all',
            comunicado.urgente
              ? 'bg-red-50 border-red-200 hover:border-red-300'
              : 'bg-white border-gray-200 hover:border-primary-300',
            !estaLeido(comunicado.id) && 'ring-2 ring-primary-200',
          ]"
          @click="marcarComoLeido(comunicado.id)"
        >
          <div class="flex items-start justify-between mb-2">
            <div class="flex items-center gap-2">
              <span class="text-2xl">{{ getIconoTipo(comunicado.tipo) }}</span>
              <div>
                <h5 class="font-semibold text-gray-900">{{ comunicado.titulo }}</h5>
                <p class="text-xs text-gray-500">
                  {{ formatDate(comunicado.publicadoEn, 'dd/MM/yyyy') }}
                  <span v-if="comunicado.fechaEvento">
                    · Evento: {{ formatDate(comunicado.fechaEvento) }}
                  </span>
                </p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <AppBadge v-if="comunicado.urgente" variant="danger">Urgente</AppBadge>
              <AppBadge v-if="!estaLeido(comunicado.id)" variant="info">Nuevo</AppBadge>
            </div>
          </div>
          
          <p class="text-sm text-gray-700 whitespace-pre-line">{{ comunicado.mensaje }}</p>
        </div>
      </div>
      
      <div v-else class="text-center py-8 text-gray-600">
        No hay comunicados disponibles
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useComunicadosStore } from '../../stores/comunicados.store';
import { useAuthStore } from '../../stores/auth.store';
import { formatDate } from '../../utils/formatters';
import { TipoComunicado } from '../../types';
import AppBadge from '../../components/ui/AppBadge.vue';

interface Props {
  alumnoId: string;
}

const props = defineProps<Props>();

const comunicadosStore = useComunicadosStore();
const authStore = useAuthStore();

const comunicados = computed(() => {
  if (!props.alumnoId) return [];
  return comunicadosStore.getComunicadosParaPadre(props.alumnoId);
});

const estaLeido = (comunicadoId: string): boolean => {
  if (!authStore.currentUser) return false;
  const comunicado = comunicadosStore.comunicados.find(c => c.id === comunicadoId);
  return comunicado?.leidoPor.includes(authStore.currentUser.id) || false;
};

const marcarComoLeido = (comunicadoId: string) => {
  if (authStore.currentUser && !estaLeido(comunicadoId)) {
    comunicadosStore.marcarComoLeido(comunicadoId, authStore.currentUser.id);
  }
};

const getIconoTipo = (tipo: TipoComunicado): string => {
  const iconos: Record<TipoComunicado, string> = {
    [TipoComunicado.AVISO]: '📌',
    [TipoComunicado.TAREA]: '📋',
    [TipoComunicado.EVENTO]: '📅',
    [TipoComunicado.CIRCULAR]: '📄',
    [TipoComunicado.URGENTE]: '🚨',
  };
  return iconos[tipo] || '📌';
};
</script>
