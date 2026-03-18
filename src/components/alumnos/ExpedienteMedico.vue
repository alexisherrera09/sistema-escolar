<template>
  <div class="space-y-6">
    <div>
      <h3 class="text-lg font-semibold text-gray-900 mb-4">🏥 Expediente Médico</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <p class="text-sm text-gray-600">Tipo de sangre</p>
          <p class="font-medium text-gray-900">{{ expediente.tipoSangre || 'No registrado' }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-600">Médico de cabecera</p>
          <p class="font-medium text-gray-900">{{ expediente.medico || 'No registrado' }}</p>
        </div>
        <div v-if="expediente.telefonoMedico">
          <p class="text-sm text-gray-600">Teléfono médico</p>
          <p class="font-medium text-gray-900">{{ expediente.telefonoMedico }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-600">Seguro médico</p>
          <p class="font-medium text-gray-900">{{ expediente.seguroMedico ? 'Sí' : 'No' }}</p>
        </div>
      </div>

      <div v-if="expediente.alergias.length > 0" class="mb-6">
        <h4 class="font-semibold text-red-600 mb-2">⛔ ALERGIAS (IMPORTANTES)</h4>
        <div class="bg-red-50 border-2 border-red-200 rounded-lg p-4">
          <ul class="list-disc list-inside space-y-1">
            <li v-for="alergia in expediente.alergias" :key="alergia" class="text-red-800 font-medium">
              🔴 {{ alergia }}
            </li>
          </ul>
        </div>
      </div>

      <div v-if="expediente.medicamentos.length > 0" class="mb-6">
        <h4 class="font-semibold text-gray-900 mb-2">💊 MEDICAMENTOS</h4>
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <ul class="list-disc list-inside space-y-1">
            <li v-for="medicamento in expediente.medicamentos" :key="medicamento" class="text-gray-800">
              {{ medicamento }}
            </li>
          </ul>
        </div>
      </div>

      <div v-if="expediente.condicionesEspeciales" class="mb-6">
        <h4 class="font-semibold text-gray-900 mb-2">🩺 CONDICIONES ESPECIALES</h4>
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p class="text-gray-800">{{ expediente.condicionesEspeciales }}</p>
        </div>
      </div>

      <div v-if="expediente.contactosEmergencia.length > 0" class="mb-6">
        <h4 class="font-semibold text-gray-900 mb-2">🆘 CONTACTOS DE EMERGENCIA</h4>
        <div class="space-y-2">
          <div
            v-for="(contacto, index) in expediente.contactosEmergencia"
            :key="index"
            class="p-3 bg-gray-50 rounded-lg"
          >
            <p class="font-medium text-gray-900">{{ contacto.nombre }}</p>
            <p class="text-sm text-gray-600">{{ contacto.parentesco }} · {{ contacto.telefono }}</p>
          </div>
        </div>
      </div>

      <div v-if="!expediente.alergias.length && !expediente.medicamentos.length && !expediente.condicionesEspeciales" class="text-center py-8 text-gray-500">
        No hay información médica registrada
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DatosmedAlumno } from '../../types';

interface Props {
  expediente: DatosmedAlumno;
}

defineProps<Props>();
</script>
