<template>
  <div>
    <h2 class="text-2xl font-bold text-gray-900 mb-6">📊 Reportes</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <!-- Reportes Financieros -->
      <AppCard>
        <h3 class="text-lg font-semibold mb-4">💰 Reportes Financieros</h3>
        
        <div class="space-y-4 mb-6">
          <div class="bg-blue-50 p-4 rounded-lg">
            <p class="text-sm text-gray-600">Ingresos del mes</p>
            <p class="text-2xl font-bold text-blue-600">
              {{ formatCurrency(ingresosMes) }}
            </p>
            <p class="text-xs text-gray-500 mt-1">
              vs estimado: {{ formatCurrency(ingresosEstimados) }}
            </p>
          </div>

          <div class="bg-yellow-50 p-4 rounded-lg">
            <p class="text-sm text-gray-600">Colegiaturas pendientes</p>
            <p class="text-xl font-bold text-yellow-600">
              {{ colegiaturasPendientes.cantidad }} alumnos
            </p>
            <p class="text-sm text-gray-600">
              {{ formatCurrency(colegiaturasPendientes.monto) }} en riesgo
            </p>
          </div>

          <div class="bg-red-50 p-4 rounded-lg">
            <p class="text-sm text-gray-600">Vencidas >1 mes</p>
            <p class="text-xl font-bold text-red-600">
              {{ vencidas.cantidad }} alumnos
            </p>
            <p class="text-sm text-gray-600">
              {{ formatCurrency(vencidas.monto) }}
            </p>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <AppButton variant="outline" size="sm" @click="exportarReportePagos">
            📊 Reporte de Pagos
          </AppButton>
          <AppButton variant="outline" size="sm" @click="verAlumnosMorosos">
            📋 Alumnos Morosos
          </AppButton>
          <AppButton variant="outline" size="sm" @click="verIngresosPorConcepto">
            💰 Ingresos por Concepto
          </AppButton>
        </div>
      </AppCard>

      <!-- Reportes Académicos -->
      <AppCard>
        <h3 class="text-lg font-semibold mb-4">📚 Reportes Académicos</h3>
        
        <div class="space-y-4 mb-6">
          <div class="bg-green-50 p-4 rounded-lg">
            <p class="text-sm text-gray-600">Promedio general del plantel</p>
            <p class="text-2xl font-bold text-green-600">
              {{ promedioGeneral.toFixed(1) }}
            </p>
          </div>

          <div class="bg-blue-50 p-4 rounded-lg">
            <p class="text-sm text-gray-600">Asistencia promedio</p>
            <p class="text-2xl font-bold text-blue-600">
              {{ asistenciaPromedio }}%
            </p>
          </div>

          <div class="bg-yellow-50 p-4 rounded-lg">
            <p class="text-sm text-gray-600">Alumnos en riesgo académico</p>
            <p class="text-xl font-bold text-yellow-600">
              {{ alumnosEnRiesgo }} alumnos
            </p>
            <p class="text-xs text-gray-500">(promedio &lt;6)</p>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <AppButton variant="outline" size="sm" @click="verCalificacionesPorGrupo">
            📝 Calificaciones por Grupo
          </AppButton>
          <AppButton variant="outline" size="sm" @click="verAsistenciaGeneral">
            📅 Asistencia General
          </AppButton>
          <AppButton variant="outline" size="sm" @click="verAlumnosEnRiesgo">
            ⚠️ Alumnos en Riesgo
          </AppButton>
          <AppButton variant="outline" size="sm" @click="verMejoresPromedios">
            🏆 Mejores Promedios
          </AppButton>
        </div>
      </AppCard>
    </div>

    <!-- Modal Alumnos Morosos -->
    <AppModal :show="showMorosos" @close="showMorosos = false" size="xl">
      <template #title>Alumnos Morosos</template>
      <AlumnosMorosos @close="showMorosos = false" />
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { usePagosStore } from '../stores/pagos.store';
import { useCalificacionesStore } from '../stores/calificaciones.store';
import { useAsistenciaStore } from '../stores/asistencia.store';
import { useAlumnosStore } from '../stores/alumnos.store';
import { formatCurrency } from '../utils/formatters';
import { format } from 'date-fns';
import AppCard from '../components/ui/AppCard.vue';
import AppButton from '../components/ui/AppButton.vue';
import AppModal from '../components/ui/AppModal.vue';
import AlumnosMorosos from '../components/reportes/AlumnosMorosos.vue';

const pagosStore = usePagosStore();
const calificacionesStore = useCalificacionesStore();
const asistenciaStore = useAsistenciaStore();
const alumnosStore = useAlumnosStore();

const showMorosos = ref(false);

const mesActual = computed(() => format(new Date(), 'yyyy-MM'));

const ingresosMes = computed(() => {
  return pagosStore.pagos
    .filter(p => p.fecha.startsWith(mesActual.value))
    .reduce((sum, p) => sum + p.montoTotal, 0);
});

const ingresosEstimados = computed(() => {
  // Calcular ingresos estimados basado en colegiaturas del mes
  const cargosMes = pagosStore.cargos.filter(c => 
    c.mesAplica === mesActual.value && c.concepto === 'colegiatura'
  );
  return cargosMes.reduce((sum, c) => sum + c.monto, 0);
});

const colegiaturasPendientes = computed(() => {
  const pendientes = pagosStore.cargos.filter(c => 
    c.concepto === 'colegiatura' && 
    (c.status === 'pendiente' || c.status === 'vencido')
  );
  return {
    cantidad: new Set(pendientes.map(c => c.alumnoId)).size,
    monto: pendientes.reduce((sum, c) => sum + c.monto, 0),
  };
});

const vencidas = computed(() => {
  const hoy = new Date();
  const vencidos = pagosStore.cargos.filter(c => {
    if (c.status !== 'vencido') return false;
    const vencimiento = new Date(c.fechaVencimiento);
    const diffMeses = (hoy.getTime() - vencimiento.getTime()) / (1000 * 60 * 60 * 24 * 30);
    return diffMeses > 1;
  });
  return {
    cantidad: new Set(vencidos.map(c => c.alumnoId)).size,
    monto: vencidos.reduce((sum, c) => sum + c.monto, 0),
  };
});

const promedioGeneral = computed(() => {
  // Calcular promedio general del plantel
  // Placeholder - implementar lógica real
  return 8.4;
});

const asistenciaPromedio = computed(() => {
  // Calcular asistencia promedio
  // Placeholder - implementar lógica real
  return 92;
});

const alumnosEnRiesgo = computed(() => {
  // Contar alumnos con promedio < 6
  // Placeholder - implementar lógica real
  return 8;
});

const exportarReportePagos = () => {
  const csv = [
    ['Fecha', 'Alumno', 'Concepto', 'Monto', 'Método', 'Estado'].join(','),
    ...pagosStore.pagos.map(p => {
      const alumno = alumnosStore.getAlumno(p.alumnoId);
      const nombre = alumno ? `${alumno.nombre} ${alumno.apellidoPaterno}` : 'N/A';
      return [
        p.fecha,
        nombre,
        'Pago',
        p.montoTotal,
        p.metodo,
        'Pagado',
      ].join(',');
    })
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Reporte_Pagos_${format(new Date(), 'yyyy-MM-dd')}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

const verAlumnosMorosos = () => {
  showMorosos.value = true;
};

const verIngresosPorConcepto = () => {
  // Implementar vista de ingresos por concepto
  alert('Funcionalidad en desarrollo');
};

const verCalificacionesPorGrupo = () => {
  alert('Funcionalidad en desarrollo');
};

const verAsistenciaGeneral = () => {
  alert('Funcionalidad en desarrollo');
};

const verAlumnosEnRiesgo = () => {
  alert('Funcionalidad en desarrollo');
};

const verMejoresPromedios = () => {
  alert('Funcionalidad en desarrollo');
};
</script>
