<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-gray-900">💰 Pagos y Colegiaturas</h2>
      <AppButton @click="showRegistrarPago = true">+ Registrar Pago</AppButton>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <AppCard>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Al día</p>
            <p class="text-2xl font-bold text-green-600">{{ estadisticas.alDia }}</p>
          </div>
          <span class="text-3xl">✅</span>
        </div>
      </AppCard>
      <AppCard>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Pendientes</p>
            <p class="text-2xl font-bold text-yellow-600">{{ estadisticas.pendientes }}</p>
          </div>
          <span class="text-3xl">⚠️</span>
        </div>
      </AppCard>
      <AppCard>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Vencidos</p>
            <p class="text-2xl font-bold text-red-600">{{ estadisticas.vencidos }}</p>
          </div>
          <span class="text-3xl">🔴</span>
        </div>
      </AppCard>
    </div>

    <AppCard>
      <div class="mb-4 flex gap-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="🔍 Buscar alumno..."
          class="flex-1 input"
        />
        <select v-model="filtroEstado" class="input">
          <option value="">Todos los estados</option>
          <option value="pagado">Pagado</option>
          <option value="pendiente">Pendiente</option>
          <option value="vencido">Vencido</option>
        </select>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Alumno</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Concepto</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monto</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vencimiento</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="cargo in cargosFiltrados" :key="cargo.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ getAlumnoNombre(cargo.alumnoId) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ cargo.descripcion }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatCurrency(cargo.monto) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(cargo.fechaVencimiento) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <AppBadge :variant="getEstadoVariant(cargo)">
                  {{ getEstadoTexto(cargo) }}
                </AppBadge>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  v-if="cargo.status !== 'pagado'"
                  @click="abrirRegistrarPago(cargo)"
                  class="text-primary-600 hover:text-primary-900"
                >
                  Pagar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </AppCard>

    <AppModal :show="showRegistrarPago" @close="showRegistrarPago = false" size="lg">
      <template #title>Registrar Pago</template>
      <RegistrarPagoModal
        v-if="cargoSeleccionado"
        :cargo="cargoSeleccionado"
        @success="handlePagoRegistrado"
        @close="showRegistrarPago = false"
      />
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { usePagosStore } from '../stores/pagos.store';
import { useAlumnosStore } from '../stores/alumnos.store';
import { formatCurrency, formatDate, getEstadoPagoColor } from '../utils/formatters';
import type { Cargo } from '../types';
import AppButton from '../components/ui/AppButton.vue';
import AppCard from '../components/ui/AppCard.vue';
import AppModal from '../components/ui/AppModal.vue';
import AppBadge from '../components/ui/AppBadge.vue';
import RegistrarPagoModal from '../components/pagos/RegistrarPagoModal.vue';

const pagosStore = usePagosStore();
const alumnosStore = useAlumnosStore();

const searchQuery = ref('');
const filtroEstado = ref('');
const showRegistrarPago = ref(false);
const cargoSeleccionado = ref<Cargo | null>(null);

onMounted(() => {
  pagosStore.actualizarVencimientos();
});

const cargosFiltrados = computed(() => {
  let cargos = pagosStore.cargos;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    cargos = cargos.filter(c => {
      const nombreAlumno = getAlumnoNombre(c.alumnoId).toLowerCase();
      return nombreAlumno.includes(query) || c.descripcion.toLowerCase().includes(query);
    });
  }

  if (filtroEstado.value) {
    cargos = cargos.filter(c => c.status === filtroEstado.value);
  }

  return cargos;
});

const estadisticas = computed(() => {
  const cargos = pagosStore.cargos;
  return {
    alDia: cargos.filter(c => c.status === 'pagado').length,
    pendientes: cargos.filter(c => c.status === 'pendiente').length,
    vencidos: cargos.filter(c => c.status === 'vencido').length,
  };
});

const getAlumnoNombre = (alumnoId: string): string => {
  const alumno = alumnosStore.getAlumno(alumnoId);
  return alumno ? `${alumno.nombre} ${alumno.apellidoPaterno}` : 'N/A';
};

const getEstadoVariant = (cargo: Cargo): 'success' | 'warning' | 'danger' => {
  const estado = getEstadoPagoColor(cargo.status, cargo.fechaVencimiento);
  if (estado.color === 'red') return 'danger';
  if (estado.color === 'yellow') return 'warning';
  return 'success';
};

const getEstadoTexto = (cargo: Cargo): string => {
  const estado = getEstadoPagoColor(cargo.status, cargo.fechaVencimiento);
  return estado.texto;
};

const abrirRegistrarPago = (cargo: Cargo) => {
  cargoSeleccionado.value = cargo;
  showRegistrarPago.value = true;
};

const handlePagoRegistrado = () => {
  showRegistrarPago.value = false;
  cargoSeleccionado.value = null;
};
</script>
