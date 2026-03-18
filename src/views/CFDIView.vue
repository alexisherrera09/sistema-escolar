<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-gray-900">🧾 CFDI Emitidos</h2>
      <div class="flex gap-2">
        <AppButton variant="outline" @click="exportarReporte">
          📊 Reporte
        </AppButton>
      </div>
    </div>

    <AppCard>
      <div class="mb-4">
        <h3 class="text-lg font-semibold mb-2">Resumen</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-blue-50 p-4 rounded-lg">
            <p class="text-sm text-gray-600">Total CFDI Emitidos</p>
            <p class="text-2xl font-bold text-blue-600">{{ cfdiStore.cfdis.length }}</p>
          </div>
          <div class="bg-green-50 p-4 rounded-lg">
            <p class="text-sm text-gray-600">Total Facturado</p>
            <p class="text-2xl font-bold text-green-600">
              {{ formatCurrency(totalFacturado) }}
            </p>
          </div>
          <div class="bg-purple-50 p-4 rounded-lg">
            <p class="text-sm text-gray-600">Este Mes</p>
            <p class="text-2xl font-bold text-purple-600">{{ cfdisEsteMes }}</p>
          </div>
        </div>
      </div>

      <CFDIList />
    </AppCard>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useCFDIStore } from '../stores/cfdi.store';
import { formatCurrency } from '../utils/formatters';
import { format } from 'date-fns';
import AppButton from '../components/ui/AppButton.vue';
import AppCard from '../components/ui/AppCard.vue';
import CFDIList from '../components/cfdi/CFDIList.vue';

const cfdiStore = useCFDIStore();

const totalFacturado = computed(() => {
  return cfdiStore.cfdis.reduce((sum, c) => sum + c.monto, 0);
});

const cfdisEsteMes = computed(() => {
  const mesActual = format(new Date(), 'yyyy-MM');
  return cfdiStore.cfdis.filter(c => c.fecha.startsWith(mesActual)).length;
});

const exportarReporte = () => {
  // Implementar exportación a CSV/Excel
  const csv = [
    ['Folio', 'RFC', 'Razón Social', 'Monto', 'Fecha'].join(','),
    ...cfdiStore.cfdis.map(c => [
      c.folio,
      c.rfc,
      c.razonSocial,
      c.monto,
      c.fecha,
    ].join(','))
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `CFDI_Reporte_${format(new Date(), 'yyyy-MM-dd')}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};
</script>
