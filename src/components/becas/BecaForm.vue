<template>
  <div class="space-y-4">
    <AppSelect
      v-model="form.alumnoId"
      label="Alumno"
      :options="alumnosOptions"
      placeholder="Selecciona un alumno"
      required
      :error="errors.alumnoId"
    />

    <AppSelect
      v-model="form.tipo"
      label="Tipo de Beca"
      :options="tiposBecaOptions"
      required
      :error="errors.tipo"
    />

    <AppInput
      v-model.number="form.porcentaje"
      type="number"
      label="Porcentaje de descuento"
      min="0"
      max="100"
      required
      :error="errors.porcentaje"
    />

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Motivo</label>
      <textarea
        v-model="form.motivo"
        rows="3"
        class="input"
        required
        :error="errors.motivo"
      />
      <p v-if="errors.motivo" class="mt-1 text-sm text-red-600">{{ errors.motivo }}</p>
    </div>

    <div class="flex justify-end gap-3 pt-4">
      <AppButton variant="outline" @click="$emit('close')">Cancelar</AppButton>
      <AppButton @click="guardarBeca" :disabled="guardando">
        {{ guardando ? 'Guardando...' : '✅ Guardar Beca' }}
      </AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useBecasStore } from '../../stores/becas.store';
import { useAlumnosStore } from '../../stores/alumnos.store';
import { useSingleStorage } from '../../composables/useStorage';
import type { CicloEscolar } from '../../types';
import { useToast } from 'vue-toastification';
import AppInput from '../ui/AppInput.vue';
import AppSelect from '../ui/AppSelect.vue';
import AppButton from '../ui/AppButton.vue';

const emit = defineEmits<{
  close: [];
  success: [];
}>();

const becasStore = useBecasStore();
const alumnosStore = useAlumnosStore();
const cicloStorage = useSingleStorage<CicloEscolar>('escolar_ciclo');
const toast = useToast();

const guardando = ref(false);
const errors = ref<Record<string, string>>({});

const form = ref({
  alumnoId: '',
  tipo: '',
  porcentaje: 0,
  motivo: '',
});

const alumnosOptions = computed(() => {
  return alumnosStore.alumnos.map(a => ({
    value: a.id,
    label: `${a.nombre} ${a.apellidoPaterno} ${a.apellidoMaterno} · ${a.matricula}`,
  }));
});

const tiposBecaOptions = computed(() => {
  return becasStore.tiposBecaConfigurados.map(t => ({
    value: t.tipo,
    label: `${t.nombre} (${t.porcentaje}%)`,
  }));
});

const guardarBeca = async () => {
  errors.value = {};

  if (!form.value.alumnoId) {
    errors.value.alumnoId = 'Selecciona un alumno';
    return;
  }

  if (!form.value.tipo) {
    errors.value.tipo = 'Selecciona un tipo de beca';
    return;
  }

  if (!form.value.porcentaje || form.value.porcentaje <= 0 || form.value.porcentaje > 100) {
    errors.value.porcentaje = 'El porcentaje debe estar entre 1 y 100';
    return;
  }

  if (!form.value.motivo) {
    errors.value.motivo = 'El motivo es requerido';
    return;
  }

  guardando.value = true;

  try {
    const ciclo = cicloStorage.get();
    if (!ciclo) {
      throw new Error('Ciclo escolar no encontrado');
    }

    becasStore.crearBeca({
      alumnoId: form.value.alumnoId,
      tipo: form.value.tipo,
      porcentaje: form.value.porcentaje,
      motivo: form.value.motivo,
      fechaInicio: new Date().toISOString(),
      fechaFin: ciclo.fechaFin,
    });

    toast.success('Beca creada correctamente');
    emit('success');
    emit('close');
  } catch (error) {
    toast.error('Error al crear beca');
    console.error(error);
  } finally {
    guardando.value = false;
  }
};
</script>
