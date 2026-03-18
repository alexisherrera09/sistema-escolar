<template>
  <div>
    <h2 class="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <AppCard>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Total Alumnos</p>
            <p class="text-3xl font-bold text-gray-900">{{ totalAlumnos }}</p>
          </div>
          <span class="text-4xl">👨‍🎓</span>
        </div>
      </AppCard>
      <AppCard>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Pagos del Mes</p>
            <p class="text-3xl font-bold text-gray-900">{{ formatCurrency(pagosMes) }}</p>
          </div>
          <span class="text-4xl">💰</span>
        </div>
      </AppCard>
      <AppCard>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Asistencia Hoy</p>
            <p class="text-3xl font-bold text-gray-900">{{ asistenciaHoy }}%</p>
          </div>
          <span class="text-4xl">✅</span>
        </div>
      </AppCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStorage } from '../composables/useStorage';
import type { Alumno, Pago, Grupo } from '../types';
import { formatCurrency } from '../utils/formatters';
import { format } from 'date-fns';
import AppCard from '../components/ui/AppCard.vue';
import { useAsistenciaStore } from '../stores/asistencia.store';

const alumnosStorage = useStorage<Alumno>('escolar_alumnos');
const pagosStorage = useStorage<Pago>('escolar_pagos');
const asistenciaStore = useAsistenciaStore();

const totalAlumnos = computed(() => {
  return alumnosStorage.get().length;
});

const pagosMes = computed(() => {
  const mesActual = format(new Date(), 'yyyy-MM');
  const pagos = pagosStorage.get();
  return pagos
    .filter(p => p.fecha.startsWith(mesActual))
    .reduce((sum, p) => sum + p.montoTotal, 0);
});

const gruposStorage = useStorage<Grupo>('escolar_grupos');

const asistenciaHoy = computed(() => {
  const hoy = format(new Date(), 'yyyy-MM-dd');
  const grupos = gruposStorage.get();
  let totalAlumnos = 0;
  let totalPresentes = 0;

  grupos.forEach((grupo) => {
    const registros = asistenciaStore.getAsistenciaDelDia(grupo.id, hoy);
    const alumnosGrupo = alumnosStorage.filter((a: Alumno) => a.grupoId === grupo.id);
    totalAlumnos += alumnosGrupo.length;
    totalPresentes += registros.filter((r) => r.status === 'presente').length;
  });

  return totalAlumnos > 0 ? Math.round((totalPresentes / totalAlumnos) * 100) : 0;
});
</script>
