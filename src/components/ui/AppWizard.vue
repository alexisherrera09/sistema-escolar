<template>
  <div>
    <div class="mb-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold">Paso {{ pasoActual }} de {{ totalPasos }}</h3>
        <div class="flex gap-2">
          <div
            v-for="i in totalPasos"
            :key="i"
            :class="[
              'w-3 h-3 rounded-full',
              i <= pasoActual ? 'bg-primary-500' : 'bg-gray-300',
            ]"
          />
        </div>
      </div>
    </div>

    <div class="mb-6">
      <slot :name="`paso-${pasoActual}`" />
    </div>

    <div class="flex justify-between mt-8">
      <AppButton
        v-if="pasoActual > 1"
        variant="outline"
        @click="anterior"
      >
        ← Anterior
      </AppButton>
      <div v-else></div>
      
      <AppButton
        v-if="pasoActual < totalPasos"
        @click="siguiente"
      >
        Siguiente →
      </AppButton>
      <slot name="final" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AppButton from './AppButton.vue';

interface Props {
  totalPasos: number;
  pasoInicial?: number;
}

const props = withDefaults(defineProps<Props>(), {
  pasoInicial: 1,
});

const emit = defineEmits<{
  siguiente: [];
  anterior: [];
  cambio: [paso: number];
}>();

const pasoActual = ref(props.pasoInicial);

const siguiente = () => {
  if (pasoActual.value < props.totalPasos) {
    pasoActual.value++;
    emit('cambio', pasoActual.value);
    emit('siguiente');
  }
};

const anterior = () => {
  if (pasoActual.value > 1) {
    pasoActual.value--;
    emit('cambio', pasoActual.value);
    emit('anterior');
  }
};
</script>
