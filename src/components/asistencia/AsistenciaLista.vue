<template>
  <div class="max-w-4xl mx-auto">
    <div class="mb-6">
      <h3 class="text-xl font-semibold text-gray-900 mb-2">
        Asistencia · {{ grupoNombre }} · {{ formatDate(fecha, 'EEEE dd/MM/yyyy') }}
      </h3>
      <p class="text-sm text-gray-600">Maestro: {{ maestroNombre }} · {{ alumnos.length }} alumnos</p>
    </div>

    <div class="mb-4">
      <AppButton variant="secondary" size="sm" @click="marcarTodosPresentes">
        Marcar todos presentes
      </AppButton>
    </div>

    <div class="space-y-2">
      <div
        v-for="(alumno, index) in alumnos"
        :key="alumno.id"
        class="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4 flex-1">
            <span class="text-gray-500 font-medium w-8">{{ index + 1 }}.</span>
            <span class="font-medium text-gray-900 flex-1">
              {{ `${alumno.apellidoPaterno} ${alumno.apellidoMaterno}, ${alumno.nombre}` }}
            </span>
          </div>

          <div class="flex gap-2">
            <button
              v-for="status in estadosAsistencia"
              :key="status.value"
              :class="[
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                getStatusClass(status.value, getEstadoAlumno(alumno.id)),
              ]"
              @click="cambiarEstado(alumno.id, status.value)"
            >
              {{ status.icono }} {{ status.label }}
            </button>
          </div>
        </div>

        <div v-if="getEstadoAlumno(alumno.id) === 'falta_justificada'" class="mt-2">
          <input
            v-model="justificaciones[alumno.id]"
            type="text"
            placeholder="Motivo de la falta justificada..."
            class="w-full input text-sm"
          />
        </div>
      </div>
    </div>

    <div class="mt-6 bg-gray-50 rounded-lg p-4">
      <div class="flex items-center justify-between text-sm">
        <span>✅ {{ estadisticas.presentes }} presentes</span>
        <span>❌ {{ estadisticas.faltas }} faltas</span>
        <span>⏰ {{ estadisticas.tardanzas }} tardanzas</span>
        <span>🏥 {{ estadisticas.faltasJustificadas }} faltas justificadas</span>
      </div>
    </div>

    <div class="mt-6 flex justify-end gap-3">
      <AppButton variant="outline" @click="$emit('cancel')">Cancelar</AppButton>
      <AppButton @click="guardarAsistencia" :disabled="guardando">
        {{ guardando ? 'Guardando...' : '💾 Guardar Asistencia' }}
      </AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAsistenciaStore } from '../../stores/asistencia.store';
import { useAlumnosStore } from '../../stores/alumnos.store';
import { AsistenciaStatus } from '../../types';
import { formatDate } from '../../utils/formatters';
import { format } from 'date-fns';
import AppButton from '../ui/AppButton.vue';

interface Props {
  grupoId: string;
  grupoNombre: string;
  maestroNombre: string;
  fecha?: string;
}

const props = withDefaults(defineProps<Props>(), {
  fecha: () => format(new Date(), 'yyyy-MM-dd'),
});

const emit = defineEmits<{
  saved: [];
  cancel: [];
}>();

const asistenciaStore = useAsistenciaStore();
const alumnosStore = useAlumnosStore();

const alumnos = computed(() => alumnosStore.getAlumnosPorGrupo(props.grupoId));
const estadosAlumnos = ref<Record<string, AsistenciaStatus>>({});
const justificaciones = ref<Record<string, string>>({});
const guardando = ref(false);

const estadosAsistencia = [
  { value: AsistenciaStatus.PRESENTE, label: 'Presente', icono: '✅' },
  { value: AsistenciaStatus.FALTA, label: 'Falta', icono: '❌' },
  { value: AsistenciaStatus.TARDANZA, label: 'Tardanza', icono: '⏰' },
  { value: AsistenciaStatus.FALTA_JUSTIFICADA, label: 'Justificada', icono: '🏥' },
];

// Inicializar estados (todos presentes por defecto)
alumnos.value.forEach(alumno => {
  const registroExistente = asistenciaStore.getAsistenciaDelDia(props.grupoId, props.fecha)
    .find(r => r.alumnoId === alumno.id);
  
  estadosAlumnos.value[alumno.id] = registroExistente?.status || AsistenciaStatus.PRESENTE;
  if (registroExistente?.justificacion) {
    justificaciones.value[alumno.id] = registroExistente.justificacion;
  }
});

const getEstadoAlumno = (alumnoId: string): AsistenciaStatus => {
  return estadosAlumnos.value[alumnoId] || AsistenciaStatus.PRESENTE;
};

const cambiarEstado = (alumnoId: string, status: AsistenciaStatus) => {
  estadosAlumnos.value[alumnoId] = status;
  if (status !== AsistenciaStatus.FALTA_JUSTIFICADA) {
    delete justificaciones.value[alumnoId];
  }
};

const marcarTodosPresentes = () => {
  alumnos.value.forEach(alumno => {
    estadosAlumnos.value[alumno.id] = AsistenciaStatus.PRESENTE;
  });
};

const getStatusClass = (status: AsistenciaStatus, estadoActual: AsistenciaStatus): string => {
  const isActive = status === estadoActual;
  
  if (status === AsistenciaStatus.PRESENTE) {
    return isActive
      ? 'bg-green-500 text-white'
      : 'bg-green-50 text-green-700 hover:bg-green-100';
  }
  if (status === AsistenciaStatus.FALTA) {
    return isActive
      ? 'bg-red-500 text-white'
      : 'bg-red-50 text-red-700 hover:bg-red-100';
  }
  if (status === AsistenciaStatus.TARDANZA) {
    return isActive
      ? 'bg-yellow-500 text-white'
      : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100';
  }
  if (status === AsistenciaStatus.FALTA_JUSTIFICADA) {
    return isActive
      ? 'bg-blue-500 text-white'
      : 'bg-blue-50 text-blue-700 hover:bg-blue-100';
  }
  
  return 'bg-gray-100 text-gray-700';
};

const estadisticas = computed(() => {
  const presentes = Object.values(estadosAlumnos.value).filter(s => s === AsistenciaStatus.PRESENTE).length;
  const faltas = Object.values(estadosAlumnos.value).filter(s => s === AsistenciaStatus.FALTA).length;
  const tardanzas = Object.values(estadosAlumnos.value).filter(s => s === AsistenciaStatus.TARDANZA).length;
  const faltasJustificadas = Object.values(estadosAlumnos.value).filter(s => s === AsistenciaStatus.FALTA_JUSTIFICADA).length;

  return { presentes, faltas, tardanzas, faltasJustificadas };
});

const guardarAsistencia = async () => {
  guardando.value = true;

  try {
    const registros = alumnos.value.map(alumno => ({
      alumnoId: alumno.id,
      status: estadosAlumnos.value[alumno.id] || AsistenciaStatus.PRESENTE,
      justificacion: justificaciones.value[alumno.id],
    }));

    asistenciaStore.registrarAsistencia(props.grupoId, registros);
    emit('saved');
  } catch (error) {
    console.error('Error al guardar asistencia:', error);
  } finally {
    guardando.value = false;
  }
};
</script>
