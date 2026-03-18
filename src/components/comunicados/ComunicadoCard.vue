<template>
  <div
    :class="[
      'p-4 rounded-lg border-2 transition-all',
      comunicado.urgente
        ? 'bg-red-50 border-red-200'
        : 'bg-white border-gray-200 hover:border-primary-300',
    ]"
  >
    <div class="flex items-start justify-between mb-2">
      <div class="flex items-center gap-2">
        <span class="text-2xl">{{ getIconoTipo(comunicado.tipo) }}</span>
        <div>
          <h4 class="font-semibold text-gray-900">{{ comunicado.titulo }}</h4>
          <p class="text-xs text-gray-500">
            {{ formatDate(comunicado.publicadoEn, 'dd/MM/yyyy') }}
            <span v-if="comunicado.fechaEvento">
              · Evento: {{ formatDate(comunicado.fechaEvento) }}
            </span>
          </p>
        </div>
      </div>
      <AppBadge v-if="comunicado.urgente" variant="danger">Urgente</AppBadge>
    </div>

    <p class="text-sm text-gray-700 mb-3 whitespace-pre-line">{{ comunicado.mensaje }}</p>

    <div class="flex items-center justify-between text-xs text-gray-500">
      <span>{{ getDestinatarioTexto(comunicado) }}</span>
      <span v-if="mostrarLecturas">
        👁️ {{ comunicado.leidoPor.length }} leído{{ comunicado.leidoPor.length !== 1 ? 's' : '' }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatDate } from '../../utils/formatters';
import type { Comunicado } from '../../types';
import { TipoComunicado, DestinatarioComunicado } from '../../types';
import AppBadge from '../ui/AppBadge.vue';

interface Props {
  comunicado: Comunicado;
  mostrarLecturas?: boolean;
}

withDefaults(defineProps<Props>(), {
  mostrarLecturas: false,
});

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

const getDestinatarioTexto = (comunicado: Comunicado): string => {
  if (comunicado.destinatario === DestinatarioComunicado.TODOS) {
    return 'Toda la escuela';
  }
  if (comunicado.destinatario === DestinatarioComunicado.GRADO) {
    return `Grado ${comunicado.destinatarioId}`;
  }
  if (comunicado.destinatario === DestinatarioComunicado.GRUPO) {
    return `Grupo ${comunicado.destinatarioId}`;
  }
  return '';
};
</script>
