<template>
  <div class="space-y-6">
    <div class="card">
      <h3 class="text-lg font-semibold mb-4">Publicar Boletas</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <AppSelect
          v-model="periodoSeleccionado"
          label="Período"
          :options="periodosOptions"
          placeholder="Selecciona un período"
        />
        <AppSelect
          v-model="gradoSeleccionado"
          label="Grado"
          :options="gradosOptions"
          placeholder="Selecciona un grado"
        />
        <AppSelect
          v-model="grupoSeleccionado"
          label="Grupo"
          :options="gruposOptions"
          placeholder="Selecciona un grupo"
        />
      </div>

      <div v-if="puedePublicar" class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <p class="text-sm text-blue-800">
          Se publicarán las boletas de <strong>{{ alumnosCount }}</strong> alumnos del grupo seleccionado.
          Los padres podrán verlas en el portal.
        </p>
      </div>

      <div v-if="!todasCalificacionesFinalizadas" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
        <p class="text-sm text-yellow-800">
          ⚠️ No todas las calificaciones están finalizadas. Revisa antes de publicar.
        </p>
      </div>

      <div class="flex justify-end gap-3">
        <AppButton variant="outline" @click="$emit('close')">Cancelar</AppButton>
        <AppButton
          @click="publicarBoletas"
          :disabled="!puedePublicar || publicando"
        >
          {{ publicando ? 'Publicando...' : '📢 Publicar Boletas' }}
        </AppButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useCalificacionesStore } from '../../stores/calificaciones.store';
import { useAlumnosStore } from '../../stores/alumnos.store';
import { useStorage } from '../../composables/useStorage';
import { useSingleStorage } from '../../composables/useStorage';
import type { Grupo, CicloEscolar } from '../../types';
import { useToast } from 'vue-toastification';
import AppButton from '../ui/AppButton.vue';
import AppSelect from '../ui/AppSelect.vue';
import AppCard from '../ui/AppCard.vue';

const emit = defineEmits<{
  close: [];
  success: [];
}>();

const calificacionesStore = useCalificacionesStore();
const alumnosStore = useAlumnosStore();
const gruposStorage = useStorage<Grupo>('escolar_grupos');
const cicloStorage = useSingleStorage<CicloEscolar>('escolar_ciclo');
const toast = useToast();

const periodoSeleccionado = ref('');
const gradoSeleccionado = ref('');
const grupoSeleccionado = ref('');
const publicando = ref(false);

const ciclo = computed(() => cicloStorage.get());

const periodosOptions = computed(() => {
  return ciclo.value?.periodos.map(p => ({
    value: p.id,
    label: p.nombre,
  })) || [];
});

const gradosOptions = [
  { value: '1', label: '1° Primaria' },
  { value: '2', label: '2° Primaria' },
  { value: '3', label: '3° Primaria' },
  { value: '4', label: '4° Primaria' },
  { value: '5', label: '5° Primaria' },
  { value: '6', label: '6° Primaria' },
];

const gruposOptions = computed(() => {
  if (!gradoSeleccionado.value) return [];
  const grupos = gruposStorage.get();
  return grupos
    .filter(g => g.gradoId === `gr${gradoSeleccionado.value}`)
    .map(g => ({ value: g.id, label: g.nombre }));
});

const alumnosCount = computed(() => {
  if (!grupoSeleccionado.value) return 0;
  return alumnosStore.getAlumnosPorGrupo(grupoSeleccionado.value).length;
});

const todasCalificacionesFinalizadas = computed(() => {
  // Verificar que todas las calificaciones estén finalizadas
  // Placeholder - implementar lógica real
  return true;
});

const puedePublicar = computed(() => {
  return periodoSeleccionado.value && grupoSeleccionado.value && todasCalificacionesFinalizadas.value;
});

const publicarBoletas = async () => {
  if (!puedePublicar.value) return;

  publicando.value = true;

  try {
    // Actualizar período para marcar boletas como publicadas
    if (ciclo.value) {
      const periodo = ciclo.value.periodos.find(p => p.id === periodoSeleccionado.value);
      if (periodo) {
        // Marcar como publicadas (esto debería actualizarse en el store)
        toast.success(`Boletas publicadas para ${alumnosCount.value} alumnos`);
        emit('success');
        emit('close');
      }
    }
  } catch (error) {
    toast.error('Error al publicar boletas');
    console.error(error);
  } finally {
    publicando.value = false;
  }
};
</script>
