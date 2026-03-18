<template>
  <div class="space-y-4">
    <div class="bg-gray-50 p-4 rounded-lg">
      <p class="text-sm text-gray-600">Alumno: {{ getAlumnoNombre() }}</p>
      <p class="text-lg font-semibold text-gray-900">{{ cargo.descripcion }}</p>
      <p class="text-2xl font-bold text-primary-600">{{ formatCurrency(cargo.monto) }}</p>
    </div>

    <AppSelect
      v-model="metodoPago"
      label="Método de pago"
      :options="[
        { value: 'efectivo', label: 'Efectivo' },
        { value: 'transferencia', label: 'Transferencia' },
        { value: 'cheque', label: 'Cheque' },
        { value: 'tarjeta', label: 'Tarjeta' },
        { value: 'deposito', label: 'Depósito bancario' },
      ]"
      required
      :error="errors.metodoPago"
    />

    <AppInput
      v-if="metodoPago === 'transferencia' || metodoPago === 'deposito'"
      v-model="referencia"
      label="Referencia/Folio"
      required
      :error="errors.referencia"
    />

    <div class="flex items-center gap-2">
      <input
        v-model="emitirCFDI"
        type="checkbox"
        id="emitirCFDI"
        class="rounded"
      />
      <label for="emitirCFDI" class="text-sm text-gray-700">¿Emitir CFDI?</label>
    </div>

    <div class="flex justify-end gap-3 pt-4">
      <AppButton variant="outline" @click="$emit('close')">Cancelar</AppButton>
      <AppButton @click="confirmarPago" :disabled="guardando">
        {{ guardando ? 'Procesando...' : '✅ Confirmar Pago' }}
      </AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { usePagosStore } from '../../stores/pagos.store';
import { useToast } from 'vue-toastification';
import { formatCurrency } from '../../utils/formatters';
import type { Cargo } from '../../types';
import { MetodoPago } from '../../types';
import { useAlumnosStore } from '../../stores/alumnos.store';
import AppInput from '../ui/AppInput.vue';
import AppSelect from '../ui/AppSelect.vue';
import AppButton from '../ui/AppButton.vue';

interface Props {
  cargo: Cargo;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  success: [];
  close: [];
}>();

const pagosStore = usePagosStore();
const alumnosStore = useAlumnosStore();
const toast = useToast();

const metodoPago = ref<MetodoPago>(MetodoPago.EFECTIVO);
const referencia = ref('');
const emitirCFDI = ref(false);
const guardando = ref(false);
const errors = ref<Record<string, string>>({});

const getAlumnoNombre = (): string => {
  const alumno = alumnosStore.getAlumno(props.cargo.alumnoId);
  return alumno ? `${alumno.nombre} ${alumno.apellidoPaterno} ${alumno.apellidoMaterno}` : 'N/A';
};

const confirmarPago = async () => {
  errors.value = {};

  if (!metodoPago.value) {
    errors.value.metodoPago = 'Selecciona el método de pago';
    return;
  }

  if ((metodoPago.value === MetodoPago.TRANSFERENCIA || metodoPago.value === MetodoPago.DEPOSITO) && !referencia.value) {
    errors.value.referencia = 'Ingresa el número de referencia';
    return;
  }

  guardando.value = true;

  try {
    await pagosStore.registrarPago(
      props.cargo.alumnoId,
      [props.cargo.id],
      metodoPago.value,
      referencia.value || undefined,
      emitirCFDI.value
    );

    toast.success('Pago registrado correctamente');
    emit('success');
  } catch (error) {
    toast.error('Error al registrar el pago');
    console.error(error);
  } finally {
    guardando.value = false;
  }
};
</script>
