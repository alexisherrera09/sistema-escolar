import { defineStore } from 'pinia';
import { computed } from 'vue';
import { useStorage } from '../composables/useStorage';
import type { Beca } from '../types';
import { useAuthStore } from './auth.store';
import { useSingleStorage } from '../composables/useStorage';
import type { CicloEscolar } from '../types';

export const useBecasStore = defineStore('becas', () => {
  const becasStorage = useStorage<Beca>('escolar_becas');
  const authStore = useAuthStore();
  const cicloStorage = useSingleStorage<CicloEscolar>('escolar_ciclo');

  const becas = computed(() => becasStorage.get());

  const getBecasActivas = (): Beca[] => {
    const ciclo = cicloStorage.get();
    if (!ciclo) return [];

    return becas.value.filter(b =>
      b.activa &&
      b.cicloId === ciclo.id &&
      new Date(b.fechaFin) >= new Date()
    );
  };

  const getBecaPorAlumno = (alumnoId: string): Beca | undefined => {
    return getBecasActivas().find(b => b.alumnoId === alumnoId);
  };

  const crearBeca = (datos: Partial<Beca>): Beca => {
    const ciclo = cicloStorage.get();
    if (!ciclo) {
      throw new Error('Ciclo escolar no encontrado');
    }

    // Desactivar beca anterior si existe
    const becaAnterior = getBecaPorAlumno(datos.alumnoId || '');
    if (becaAnterior) {
      becasStorage.update(becaAnterior.id, { activa: false });
    }

    const beca: Beca = {
      id: `beca_${Date.now()}`,
      alumnoId: datos.alumnoId || '',
      tipo: datos.tipo || '',
      porcentaje: datos.porcentaje || 0,
      motivo: datos.motivo || '',
      cicloId: ciclo.id,
      aprobadoPor: authStore.currentUser?.id || '',
      fechaInicio: datos.fechaInicio || new Date().toISOString(),
      fechaFin: datos.fechaFin || ciclo.fechaFin,
      activa: true,
    };

    becasStorage.add(beca);
    return beca;
  };

  const actualizarBeca = (id: string, updates: Partial<Beca>): void => {
    becasStorage.update(id, updates);
  };

  const eliminarBeca = (id: string): void => {
    becasStorage.update(id, { activa: false });
  };

  const tiposBecaConfigurados = [
    { tipo: 'excelencia', nombre: 'Beca Excelencia (promedio ≥9.5)', porcentaje: 25 },
    { tipo: 'hermano', nombre: 'Hermano en el plantel', porcentaje: 10 },
    { tipo: 'convenio', nombre: 'Convenio empresarial', porcentaje: 15 },
    { tipo: 'socioeconomica', nombre: 'Beca socioeconómica', porcentaje: 50 },
  ];

  return {
    becas,
    getBecasActivas,
    getBecaPorAlumno,
    crearBeca,
    actualizarBeca,
    eliminarBeca,
    tiposBecaConfigurados,
  };
});
