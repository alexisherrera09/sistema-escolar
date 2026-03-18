<template>
  <div>
    <div class="mb-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold">Paso {{ pasoActual }} de 4</h3>
        <div class="flex gap-2">
          <div
            v-for="i in 4"
            :key="i"
            :class="[
              'w-3 h-3 rounded-full',
              i <= pasoActual ? 'bg-primary-500' : 'bg-gray-300',
            ]"
          />
        </div>
      </div>
    </div>

    <!-- Paso 1: Datos del Alumno -->
    <div v-if="pasoActual === 1" class="space-y-4">
      <h4 class="text-xl font-semibold mb-4">Datos del Alumno</h4>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AppInput
          v-model="form.nombre"
          label="Nombre(s)"
          required
          :error="errors.nombre"
        />
        <AppInput
          v-model="form.apellidoPaterno"
          label="Apellido Paterno"
          required
          :error="errors.apellidoPaterno"
        />
        <AppInput
          v-model="form.apellidoMaterno"
          label="Apellido Materno"
          required
          :error="errors.apellidoMaterno"
        />
        <AppInput
          v-model="form.curp"
          label="CURP"
          required
          :error="errors.curp"
          maxlength="18"
        />
        <AppInput
          v-model="form.fechaNacimiento"
          type="date"
          label="Fecha de Nacimiento"
          required
          :error="errors.fechaNacimiento"
        />
        <AppSelect
          v-model="form.sexo"
          label="Sexo"
          :options="[
            { value: 'M', label: 'Masculino' },
            { value: 'F', label: 'Femenino' },
          ]"
          required
        />
        <AppSelect
          v-model="form.grado"
          label="Grado"
          :options="gradosOptions"
          required
        />
        <AppSelect
          v-model="form.grupo"
          label="Grupo"
          :options="gruposOptions"
          required
        />
      </div>
    </div>

    <!-- Paso 2: Datos Familiares -->
    <div v-if="pasoActual === 2" class="space-y-4">
      <h4 class="text-xl font-semibold mb-4">Tutor y Familia</h4>
      
      <AppInput
        v-model="form.tutor.nombre"
        label="Nombre del tutor principal"
        required
        :error="errors.tutorNombre"
      />
      <AppSelect
        v-model="form.tutor.parentesco"
        label="Parentesco"
        :options="[
          { value: 'Mamá', label: 'Mamá' },
          { value: 'Papá', label: 'Papá' },
          { value: 'Tutor', label: 'Tutor' },
          { value: 'Abuelo/a', label: 'Abuelo/a' },
        ]"
        required
      />
      <AppInput
        v-model="form.tutor.telefono"
        label="Teléfono"
        required
        :error="errors.tutorTelefono"
      />
      <AppInput
        v-model="form.tutor.correo"
        type="email"
        label="Correo electrónico"
        required
        :error="errors.tutorCorreo"
      />
      <AppInput
        v-model="form.tutor.rfc"
        label="RFC (para CFDI)"
        :error="errors.tutorRFC"
      />
      <AppInput
        v-model="form.tutor.direccion"
        label="Dirección"
      />
    </div>

    <!-- Paso 3: Expediente Médico -->
    <div v-if="pasoActual === 3" class="space-y-4">
      <h4 class="text-xl font-semibold mb-4">Expediente Médico</h4>
      
      <AppInput
        v-model="form.expediente.tipoSangre"
        label="Tipo de sangre"
      />
      <AppInput
        v-model="form.expediente.medico"
        label="Médico de cabecera"
      />
      <AppInput
        v-model="form.expediente.telefonoMedico"
        label="Teléfono médico"
      />
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          ¿Tiene alergias?
        </label>
        <div class="flex gap-4">
          <label class="flex items-center">
            <input
              v-model="form.expediente.tieneAlergias"
              type="radio"
              :value="true"
              class="mr-2"
            />
            Sí
          </label>
          <label class="flex items-center">
            <input
              v-model="form.expediente.tieneAlergias"
              type="radio"
              :value="false"
              class="mr-2"
            />
            No
          </label>
        </div>
      </div>

      <AppInput
        v-if="form.expediente.tieneAlergias"
        v-model="form.expediente.alergiasTexto"
        label="Describe las alergias"
        type="textarea"
      />
    </div>

    <!-- Paso 4: Configuración de Pagos -->
    <div v-if="pasoActual === 4" class="space-y-4">
      <h4 class="text-xl font-semibold mb-4">Configuración de Pagos</h4>
      
      <div class="bg-gray-50 p-4 rounded-lg">
        <p class="text-sm text-gray-600 mb-2">Colegiatura mensual: {{ formatCurrency(montoColegiatura) }}</p>
        <p class="text-sm text-gray-600">Inscripción: {{ formatCurrency(montoInscripcion) }}</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          ¿Aplica beca o descuento?
        </label>
        <div class="flex gap-4">
          <label class="flex items-center">
            <input
              v-model="form.tieneBeca"
              type="radio"
              :value="true"
              class="mr-2"
            />
            Sí
          </label>
          <label class="flex items-center">
            <input
              v-model="form.tieneBeca"
              type="radio"
              :value="false"
              class="mr-2"
            />
            No
          </label>
        </div>
      </div>

      <div v-if="form.tieneBeca" class="space-y-4">
        <AppSelect
          v-model="form.becaTipo"
          label="Tipo de beca"
          :options="[
            { value: 'hermano', label: 'Hermano en el plantel' },
            { value: 'excelencia', label: 'Beca excelencia' },
            { value: 'socioeconomica', label: 'Beca socioeconómica' },
          ]"
        />
        <AppInput
          v-model.number="form.becaPorcentaje"
          type="number"
          label="Porcentaje de descuento"
          min="0"
          max="100"
        />
      </div>
    </div>

    <!-- Botones de navegación -->
    <div class="flex justify-between mt-8">
      <AppButton
        v-if="pasoActual > 1"
        variant="outline"
        @click="pasoActual--"
      >
        ← Anterior
      </AppButton>
      <div v-else></div>
      
      <AppButton
        v-if="pasoActual < 4"
        @click="siguientePaso"
      >
        Siguiente →
      </AppButton>
      <AppButton
        v-else
        @click="registrarAlumno"
        :disabled="guardando"
      >
        {{ guardando ? 'Registrando...' : '✅ Registrar Alumno' }}
      </AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAlumnosStore } from '../../stores/alumnos.store';
import { useStorage } from '../../composables/useStorage';
import { validateCURP, validateEmail, validateAge } from '../../utils/validators';
import { formatCurrency } from '../../utils/formatters';
import type { Grupo } from '../../types';
import { useSingleStorage } from '../../composables/useStorage';
import type { ConfiguracionEscolar } from '../../types';
import AppInput from '../ui/AppInput.vue';
import AppSelect from '../ui/AppSelect.vue';
import AppButton from '../ui/AppButton.vue';

const emit = defineEmits<{
  close: [];
  success: [];
}>();

const alumnosStore = useAlumnosStore();
const gruposStorage = useStorage<Grupo>('escolar_grupos');
const configStorage = useSingleStorage<ConfiguracionEscolar>('escolar_configuracion');

const pasoActual = ref(1);
const guardando = ref(false);
const errors = ref<Record<string, string>>({});

const form = ref({
  nombre: '',
  apellidoPaterno: '',
  apellidoMaterno: '',
  curp: '',
  fechaNacimiento: '',
  sexo: 'M' as 'M' | 'F',
  grado: '',
  grupo: '',
  tutor: {
    nombre: '',
    parentesco: 'Mamá',
    telefono: '',
    correo: '',
    rfc: '',
    direccion: '',
  },
  expediente: {
    tipoSangre: '',
    medico: '',
    telefonoMedico: '',
    tieneAlergias: false,
    alergiasTexto: '',
  },
  tieneBeca: false,
  becaTipo: '',
  becaPorcentaje: 0,
});

const montoColegiatura = computed(() => {
  const config = configStorage.get();
  const descuento = form.value.tieneBeca ? form.value.becaPorcentaje : 0;
  return (config?.montoColegiaturaBase || 2500) * (1 - descuento / 100);
});

const montoInscripcion = computed(() => {
  const config = configStorage.get();
  const descuento = form.value.tieneBeca ? form.value.becaPorcentaje : 0;
  return (config?.montoInscripcionBase || 1500) * (1 - descuento / 100);
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
  if (!form.value.grado) return [];
  const grupos = gruposStorage.get();
  return grupos
    .filter(g => g.gradoId === `gr${form.value.grado}`)
    .map(g => ({ value: g.id, label: g.nombre }));
});

const validarPaso = (paso: number): boolean => {
  errors.value = {};

  if (paso === 1) {
    if (!form.value.nombre) errors.value.nombre = 'Requerido';
    if (!form.value.apellidoPaterno) errors.value.apellidoPaterno = 'Requerido';
    if (!form.value.curp || !validateCURP(form.value.curp)) {
      errors.value.curp = 'CURP no válida';
    }
    if (!form.value.fechaNacimiento || !validateAge(form.value.fechaNacimiento)) {
      errors.value.fechaNacimiento = 'Edad no corresponde al nivel primaria';
    }
    if (!form.value.grado) errors.value.grado = 'Requerido';
    if (!form.value.grupo) errors.value.grupo = 'Requerido';
  }

  if (paso === 2) {
    if (!form.value.tutor.nombre) errors.value.tutorNombre = 'Requerido';
    if (!form.value.tutor.telefono) errors.value.tutorTelefono = 'Requerido';
    if (!form.value.tutor.correo || !validateEmail(form.value.tutor.correo)) {
      errors.value.tutorCorreo = 'Correo no válido';
    }
  }

  return Object.keys(errors.value).length === 0;
};

const siguientePaso = () => {
  if (validarPaso(pasoActual.value)) {
    pasoActual.value++;
  }
};

const registrarAlumno = async () => {
  if (!validarPaso(4)) return;

  guardando.value = true;

  try {
    const alergias = form.value.expediente.tieneAlergias && form.value.expediente.alergiasTexto
      ? form.value.expediente.alergiasTexto.split(',').map(a => a.trim())
      : [];

    alumnosStore.crearAlumno({
      nombre: form.value.nombre,
      apellidoPaterno: form.value.apellidoPaterno,
      apellidoMaterno: form.value.apellidoMaterno,
      curp: form.value.curp.toUpperCase(),
      fechaNacimiento: form.value.fechaNacimiento,
      sexo: form.value.sexo,
      grupoId: form.value.grupo,
      tutor: form.value.tutor,
      expedienteMedico: {
        tipoSangre: form.value.expediente.tipoSangre,
        medico: form.value.expediente.medico,
        telefonoMedico: form.value.expediente.telefonoMedico,
        alergias,
        medicamentos: [],
        condicionesEspeciales: '',
        seguroMedico: false,
        contactosEmergencia: [],
      },
      beca: form.value.tieneBeca ? {
        tipo: form.value.becaTipo,
        porcentaje: form.value.becaPorcentaje,
      } : undefined,
    });

    emit('success');
    emit('close');
  } catch (error) {
    console.error('Error al registrar alumno:', error);
  } finally {
    guardando.value = false;
  }
};
</script>
