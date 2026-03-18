<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
    <div class="max-w-md w-full mx-4">
      <div class="card">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">🏫 Colegio Veracruz</h1>
          <p class="text-gray-600">Sistema de Gestión Escolar</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <AppInput
            id="usuario"
            v-model="usuario"
            label="Usuario o correo"
            placeholder="Ingresa tu usuario"
            required
            :error="errors.usuario"
          />

          <AppInput
            id="password"
            v-model="password"
            type="password"
            label="Contraseña"
            placeholder="Ingresa tu contraseña"
            required
            :error="errors.password"
          />

          <div v-if="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {{ errorMessage }}
          </div>

          <AppButton type="submit" :disabled="loading" class="w-full">
            {{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
          </AppButton>

          <p class="text-center text-sm text-gray-500">
            ¿Olvidaste tu contraseña?
          </p>
        </form>

        <div class="mt-8 flex justify-center">
          <VersionInfo />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';
import { UserRole } from '../types';
import AppInput from '../components/ui/AppInput.vue';
import AppButton from '../components/ui/AppButton.vue';
import VersionInfo from '../components/VersionInfo.vue';

const router = useRouter();
const authStore = useAuthStore();

const usuario = ref('');
const password = ref('');
const loading = ref(false);
const errorMessage = ref('');
const errors = ref({
  usuario: '',
  password: '',
});

const handleLogin = async () => {
  errors.value = { usuario: '', password: '' };
  errorMessage.value = '';

  if (!usuario.value) {
    errors.value.usuario = 'Ingresa tu usuario o correo';
    return;
  }

  if (!password.value) {
    errors.value.password = 'Ingresa tu contraseña';
    return;
  }

  loading.value = true;

  const result = authStore.login(usuario.value, password.value);

  if (result.success) {
    // Redirigir según rol
    if (authStore.userRole === UserRole.PADRE) {
      router.push('/portal');
    } else {
      router.push('/');
    }
  } else {
    errorMessage.value = result.error || 'Error al iniciar sesión';
  }

  loading.value = false;
};
</script>
