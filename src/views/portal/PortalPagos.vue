<template>
  <div>
    <div v-if="!alumnoId" class="text-center py-8 text-gray-600">
      Selecciona un alumno
    </div>
    <div v-else>
      <h4 class="font-semibold text-gray-900 mb-4">Estado de Cuenta</h4>

      <div class="mb-6">
        <h5 class="text-sm font-medium text-gray-700 mb-2">Pendientes de Pago</h5>
        <div v-if="cargosPendientes.length > 0" class="space-y-2">
          <div
            v-for="cargo in cargosPendientes"
            :key="cargo.id"
            class="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
          >
            <div>
              <p class="font-medium text-gray-900">{{ cargo.descripcion }}</p>
              <p class="text-sm text-gray-600">Vence: {{ formatDate(cargo.fechaVencimiento) }}</p>
            </div>
            <span class="text-lg font-bold text-gray-900">{{ formatCurrency(cargo.monto) }}</span>
          </div>
        </div>
        <div v-else class="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
          <p class="text-green-800 font-medium">✅ No hay pagos pendientes</p>
        </div>
      </div>

      <div>
        <h5 class="text-sm font-medium text-gray-700 mb-2">Historial de Pagos</h5>
        <div v-if="pagos.length > 0" class="space-y-2">
          <div
            v-for="pago in pagos"
            :key="pago.id"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div>
              <p class="font-medium text-gray-900">Recibo: {{ pago.recibo }}</p>
              <p class="text-sm text-gray-600">{{ formatDate(pago.fecha) }} · {{ pago.metodo }}</p>
            </div>
            <span class="text-lg font-bold text-green-600">{{ formatCurrency(pago.montoTotal) }}</span>
          </div>
        </div>
        <div v-else class="p-4 text-center text-gray-600">
          No hay pagos registrados
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { usePagosStore } from '../../stores/pagos.store';
import { formatCurrency, formatDate } from '../../utils/formatters';

interface Props {
  alumnoId: string;
}

const props = defineProps<Props>();

const pagosStore = usePagosStore();

const cargosPendientes = computed(() => {
  if (!props.alumnoId) return [];
  return pagosStore.getCargosPendientes(props.alumnoId);
});

const pagos = computed(() => {
  if (!props.alumnoId) return [];
  return pagosStore.pagos.filter(p => p.alumnoId === props.alumnoId);
});
</script>
