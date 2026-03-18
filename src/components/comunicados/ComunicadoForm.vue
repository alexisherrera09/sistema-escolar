<template>
  <div class="space-y-4">
    <AppSelect
      v-model="form.tipo"
      label="Tipo"
      :options="[
        { value: 'aviso', label: 'Aviso' },
        { value: 'tarea', label: 'Tarea' },
        { value: 'evento', label: 'Evento' },
        { value: 'circular', label: 'Circular' },
        { value: 'urgente', label: 'Urgente' },
      ]"
      required
    />

    <AppSelect
      v-model="form.destinatario"
      label="Destinatario"
      :options="destinatariosOptions"
      required
      @update:model-value="form.destinatarioId = ''"
    />

    <AppSelect
      v-if="form.destinatario === 'grado' || form.destinatario === 'grupo'"
      v-model="form.destinatarioId"
      :label="form.destinatario === 'grado' ? 'Grado' : 'Grupo'"
      :options="destinatarioIdOptions"
      required
    />

    <AppInput
      v-model="form.titulo"
      label="Título"
      required
      :error="errors.titulo"
    />

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
      <textarea
        v-model="form.mensaje"
        rows="5"
        class="input"
        required
        :error="errors.mensaje"
      />
      <p v-if="errors.mensaje" class="mt-1 text-sm text-red-600">{{ errors.mensaje }}</p>
    </div>

    <AppInput
      v-if="form.tipo === 'evento'"
      v-model="form.fechaEvento"
      type="date"
      label="Fecha del evento"
    />

    <div class="flex items-center gap-2">
      <input
        v-model="form.urgente"
        type="checkbox"
        id="urgente"
        class="rounded"
      />
      <label for="urgente" class="text-sm text-gray-700">Marcar como urgente</label>
    </div>

    <div class="flex justify-end gap-3 pt-4">
      <AppButton variant="outline" @click="$emit('close')">Cancelar</AppButton>
      <AppButton @click="publicar" :disabled="guardando">
        {{ guardando ? 'Publicando...' : '📢 Publicar' }}
      </AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useComunicadosStore } from '../../stores/comunicados.store';
import { useStorage } from '../../composables/useStorage';
import { useAuthStore } from '../../stores/auth.store';
import { DestinatarioComunicado } from '../../types';
import type { Grupo } from '../../types';
import { useToast } from 'vue-toastification';
import AppInput from '../ui/AppInput.vue';
import AppSelect from '../ui/AppSelect.vue';
import AppButton from '../ui/AppButton.vue';

const emit = defineEmits<{
  close: [];
  success: [];
}>();

const comunicadosStore = useComunicadosStore();
const authStore = useAuthStore();
const gruposStorage = useStorage<Grupo>('escolar_grupos');
const toast = useToast();

const guardando = ref(false);
const errors = ref<Record<string, string>>({});

const form = ref({
  tipo: 'aviso',
  destinatario: DestinatarioComunicado.TODOS,
  destinatarioId: '',
  titulo: '',
  mensaje: '',
  fechaEvento: '',
  urgente: false,
});

const destinatariosOptions = computed(() => {
  const base = [
    { value: DestinatarioComunicado.TODOS, label: 'Toda la escuela' },
  ];

  if (authStore.userRole === 'director') {
    return [
      ...base,
      { value: DestinatarioComunicado.GRADO, label: 'Por grado' },
      { value: DestinatarioComunicado.GRUPO, label: 'Por grupo' },
    ];
  }

  if (authStore.userRole === 'maestro') {
    return [
      { value: DestinatarioComunicado.GRUPO, label: 'Mi grupo' },
    ];
  }

  return base;
});

const destinatarioIdOptions = computed(() => {
  if (form.value.destinatario === DestinatarioComunicado.GRUPO) {
    return gruposStorage.get().map(g => ({
      value: g.id,
      label: `${g.gradoId}${g.nombre}`,
    }));
  }
  // Para grados
  return [
    { value: 'gr1', label: '1° Primaria' },
    { value: 'gr2', label: '2° Primaria' },
    { value: 'gr3', label: '3° Primaria' },
    { value: 'gr4', label: '4° Primaria' },
    { value: 'gr5', label: '5° Primaria' },
    { value: 'gr6', label: '6° Primaria' },
  ];
});

const publicar = async () => {
  errors.value = {};

  if (!form.value.titulo) {
    errors.value.titulo = 'El título es requerido';
    return;
  }

  if (!form.value.mensaje) {
    errors.value.mensaje = 'El mensaje es requerido';
    return;
  }

  if ((form.value.destinatario === DestinatarioComunicado.GRADO || 
       form.value.destinatario === DestinatarioComunicado.GRUPO) && 
      !form.value.destinatarioId) {
    errors.value.destinatarioId = 'Selecciona un destinatario';
    return;
  }

  guardando.value = true;

  try {
    comunicadosStore.crearComunicado({
      tipo: form.value.tipo as any,
      titulo: form.value.titulo,
      mensaje: form.value.mensaje,
      destinatario: form.value.destinatario,
      destinatarioId: form.value.destinatarioId || undefined,
      fechaEvento: form.value.fechaEvento || undefined,
      urgente: form.value.urgente,
    });

    toast.success('Comunicado publicado correctamente');
    emit('success');
    emit('close');
  } catch (error) {
    toast.error('Error al publicar comunicado');
    console.error(error);
  } finally {
    guardando.value = false;
  }
};
</script>
