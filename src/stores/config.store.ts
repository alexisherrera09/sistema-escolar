import { defineStore } from 'pinia';
import { computed } from 'vue';
import { useSingleStorage } from '../composables/useStorage';
import type { ConfiguracionEscolar, CicloEscolar } from '../types';

export const useConfigStore = defineStore('config', () => {
  const configStorage = useSingleStorage<ConfiguracionEscolar>('escolar_configuracion');
  const cicloStorage = useSingleStorage<CicloEscolar>('escolar_ciclo');

  const config = computed(() => configStorage.get());
  const ciclo = computed(() => cicloStorage.get());

  const actualizarConfiguracion = (updates: Partial<ConfiguracionEscolar>): void => {
    const current = configStorage.get();
    if (!current) return;

    configStorage.set({ ...current, ...updates });
  };

  const actualizarCiclo = (updates: Partial<CicloEscolar>): void => {
    const current = cicloStorage.get();
    if (!current) return;

    cicloStorage.set({ ...current, ...updates });
  };

  return {
    config,
    ciclo,
    actualizarConfiguracion,
    actualizarCiclo,
  };
});
