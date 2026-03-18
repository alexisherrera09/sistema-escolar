<template>
  <div>
    <h2 class="text-2xl font-bold text-gray-900 mb-6">⚙️ Configuración</h2>

    <div class="space-y-6">
      <!-- Datos del Plantel -->
      <AppCard>
        <h3 class="text-lg font-semibold mb-4">🏫 Datos del Plantel</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AppInput
            v-model="configForm.nombrePlantel"
            label="Nombre del Plantel"
          />
          <AppInput
            v-model="configForm.cct"
            label="CCT (Clave de Centro de Trabajo)"
          />
          <AppInput
            v-model="configForm.rfc"
            label="RFC"
          />
          <AppInput
            v-model="configForm.regimenFiscal"
            label="Régimen Fiscal"
          />
          <AppInput
            v-model="configForm.direccion"
            label="Dirección"
          />
          <AppInput
            v-model="configForm.telefono"
            label="Teléfono"
          />
          <AppInput
            v-model="configForm.correo"
            type="email"
            label="Correo Electrónico"
          />
        </div>
        <div class="mt-4 flex justify-end">
          <AppButton @click="guardarConfiguracion">💾 Guardar</AppButton>
        </div>
      </AppCard>

      <!-- Ciclo Escolar -->
      <AppCard>
        <h3 class="text-lg font-semibold mb-4">📅 Ciclo Escolar y Períodos</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AppInput
            v-model="cicloForm.nombre"
            label="Nombre del Ciclo"
            placeholder="2024-2025"
          />
          <AppInput
            v-model="cicloForm.fechaInicio"
            type="date"
            label="Fecha de Inicio"
          />
          <AppInput
            v-model="cicloForm.fechaFin"
            type="date"
            label="Fecha de Fin"
          />
        </div>
        <div class="mt-4 flex justify-end">
          <AppButton @click="guardarCiclo">💾 Guardar</AppButton>
        </div>
      </AppCard>

      <!-- Tarifas -->
      <AppCard>
        <h3 class="text-lg font-semibold mb-4">💰 Tarifas y Conceptos de Pago</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AppInput
            v-model.number="configForm.montoColegiaturaBase"
            type="number"
            label="Colegiatura Mensual Base"
          />
          <AppInput
            v-model.number="configForm.montoInscripcionBase"
            type="number"
            label="Inscripción Base"
          />
          <AppInput
            v-model.number="configForm.diaCorte"
            type="number"
            label="Día de Corte Mensual"
            min="1"
            max="31"
          />
        </div>
        <div class="mt-4 flex justify-end">
          <AppButton @click="guardarConfiguracion">💾 Guardar</AppButton>
        </div>
      </AppCard>

      <!-- Horarios -->
      <AppCard>
        <h3 class="text-lg font-semibold mb-4">🚪 Horarios de Entrada/Salida</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AppInput
            v-model="configForm.horaEntrada"
            type="time"
            label="Hora de Entrada"
          />
          <AppInput
            v-model="configForm.horaSalida"
            type="time"
            label="Hora de Salida"
          />
          <AppInput
            v-model.number="configForm.minutosTolerancia"
            type="number"
            label="Minutos de Tolerancia para Tardanzas"
            min="0"
          />
        </div>
        <div class="mt-4 flex justify-end">
          <AppButton @click="guardarConfiguracion">💾 Guardar</AppButton>
        </div>
      </AppCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useConfigStore } from '../stores/config.store';
import { useToast } from 'vue-toastification';
import AppCard from '../components/ui/AppCard.vue';
import AppInput from '../components/ui/AppInput.vue';
import AppButton from '../components/ui/AppButton.vue';

const configStore = useConfigStore();
const toast = useToast();

const configForm = ref({
  nombrePlantel: '',
  cct: '',
  rfc: '',
  regimenFiscal: '',
  direccion: '',
  telefono: '',
  correo: '',
  montoColegiaturaBase: 0,
  montoInscripcionBase: 0,
  diaCorte: 5,
  horaEntrada: '07:30',
  horaSalida: '13:30',
  minutosTolerancia: 10,
});

const cicloForm = ref({
  nombre: '',
  fechaInicio: '',
  fechaFin: '',
});

onMounted(() => {
  if (configStore.config) {
    configForm.value = {
      nombrePlantel: configStore.config.nombrePlantel,
      cct: configStore.config.cct,
      rfc: configStore.config.rfc,
      regimenFiscal: configStore.config.regimenFiscal,
      direccion: configStore.config.direccion,
      telefono: configStore.config.telefono,
      correo: configStore.config.correo,
      montoColegiaturaBase: configStore.config.montoColegiaturaBase,
      montoInscripcionBase: configStore.config.montoInscripcionBase,
      diaCorte: configStore.config.diaCorte,
      horaEntrada: configStore.config.horaEntrada,
      horaSalida: configStore.config.horaSalida,
      minutosTolerancia: configStore.config.minutosTolerancia,
    };
  }

  if (configStore.ciclo) {
    cicloForm.value = {
      nombre: configStore.ciclo.nombre,
      fechaInicio: configStore.ciclo.fechaInicio,
      fechaFin: configStore.ciclo.fechaFin,
    };
  }
});

const guardarConfiguracion = () => {
  configStore.actualizarConfiguracion(configForm.value);
  toast.success('Configuración guardada correctamente');
};

const guardarCiclo = () => {
  configStore.actualizarCiclo(cicloForm.value);
  toast.success('Ciclo escolar actualizado correctamente');
};
</script>
