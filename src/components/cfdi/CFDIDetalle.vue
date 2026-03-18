<template>
  <div v-if="cfdi" class="space-y-4">
    <div class="bg-gray-50 p-4 rounded-lg">
      <h4 class="font-semibold text-gray-900 mb-2">Información del CFDI</h4>
      <div class="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p class="text-gray-600">Folio</p>
          <p class="font-medium text-gray-900">{{ cfdi.folio }}</p>
        </div>
        <div>
          <p class="text-gray-600">Fecha</p>
          <p class="font-medium text-gray-900">{{ formatDate(cfdi.fecha) }}</p>
        </div>
        <div>
          <p class="text-gray-600">RFC</p>
          <p class="font-medium text-gray-900">{{ cfdi.rfc }}</p>
        </div>
        <div>
          <p class="text-gray-600">Razón Social</p>
          <p class="font-medium text-gray-900">{{ cfdi.razonSocial }}</p>
        </div>
        <div>
          <p class="text-gray-600">Monto</p>
          <p class="font-medium text-gray-900">{{ formatCurrency(cfdi.monto) }}</p>
        </div>
        <div>
          <p class="text-gray-600">Uso CFDI</p>
          <p class="font-medium text-gray-900">{{ cfdi.usoCFDI }}</p>
        </div>
      </div>
    </div>

    <div>
      <h4 class="font-semibold text-gray-900 mb-2">Conceptos</h4>
      <ul class="list-disc list-inside text-sm text-gray-700">
        <li v-for="(concepto, index) in cfdi.conceptos" :key="index">
          {{ concepto }}
        </li>
      </ul>
    </div>

    <div class="flex gap-3">
      <AppButton @click="descargarPDF">📄 Descargar PDF</AppButton>
      <AppButton variant="outline" @click="descargarXML">📦 Descargar XML</AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCFDIStore } from '../../stores/cfdi.store';
import { formatCurrency, formatDate } from '../../utils/formatters';
import type { CFDI } from '../../types';
import AppButton from '../ui/AppButton.vue';

interface Props {
  cfdi: CFDI;
}

const props = defineProps<Props>();
const cfdiStore = useCFDIStore();

const descargarPDF = () => {
  cfdiStore.descargarPDF(props.cfdi.id);
};

const descargarXML = () => {
  cfdiStore.descargarXML(props.cfdi.id);
};
</script>
