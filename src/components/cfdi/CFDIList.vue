<template>
  <div>
    <div class="mb-4 flex gap-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="🔍 Buscar por RFC, folio o nombre..."
        class="flex-1 input"
      />
      <select v-model="filtroMes" class="input max-w-xs">
        <option value="">Todos los meses</option>
        <option v-for="mes in meses" :key="mes.value" :value="mes.value">
          {{ mes.label }}
        </option>
      </select>
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Folio</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">RFC</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Razón Social</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monto</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="cfdi in cfdisFiltrados" :key="cfdi.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ cfdi.folio }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ cfdi.rfc }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ cfdi.razonSocial }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ formatCurrency(cfdi.monto) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(cfdi.fecha) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div class="flex gap-2">
                <button
                  @click="descargarPDF(cfdi.id)"
                  class="text-primary-600 hover:text-primary-900"
                  title="Descargar PDF"
                >
                  📄 PDF
                </button>
                <button
                  @click="descargarXML(cfdi.id)"
                  class="text-primary-600 hover:text-primary-900"
                  title="Descargar XML"
                >
                  📦 XML
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="cfdisFiltrados.length === 0" class="text-center py-8 text-gray-600">
      No hay CFDI emitidos
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useCFDIStore } from '../../stores/cfdi.store';
import { formatCurrency, formatDate } from '../../utils/formatters';

const cfdiStore = useCFDIStore();
const searchQuery = ref('');
const filtroMes = ref('');

const meses = [
  { value: '2024-08', label: 'Agosto 2024' },
  { value: '2024-09', label: 'Septiembre 2024' },
  { value: '2024-10', label: 'Octubre 2024' },
  { value: '2024-11', label: 'Noviembre 2024' },
  { value: '2024-12', label: 'Diciembre 2024' },
  { value: '2025-01', label: 'Enero 2025' },
  { value: '2025-02', label: 'Febrero 2025' },
  { value: '2025-03', label: 'Marzo 2025' },
];

const cfdisFiltrados = computed(() => {
  let cfdis = cfdiStore.cfdis;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    cfdis = cfdis.filter(c =>
      c.folio.toLowerCase().includes(query) ||
      c.rfc.toLowerCase().includes(query) ||
      c.razonSocial.toLowerCase().includes(query)
    );
  }

  if (filtroMes.value) {
    cfdis = cfdis.filter(c => c.fecha.startsWith(filtroMes.value));
  }

  return cfdis.sort((a, b) => b.fecha.localeCompare(a.fecha));
});

const descargarPDF = (cfdiId: string) => {
  cfdiStore.descargarPDF(cfdiId);
};

const descargarXML = (cfdiId: string) => {
  cfdiStore.descargarXML(cfdiId);
};
</script>
