<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-primary-600">🏫 Colegio Veracruz</h1>
            <p class="text-sm text-gray-600">Portal de Padres</p>
          </div>
          <div class="flex items-center gap-4 flex-wrap">
            <VersionInfo />
            <span class="text-sm text-gray-700">Hola, {{ authStore.currentUser?.nombre }}</span>
            <AppButton variant="outline" size="sm" @click="handleLogout">
              Salir
            </AppButton>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth.store';
import AppButton from '../ui/AppButton.vue';
import VersionInfo from '../VersionInfo.vue';

const router = useRouter();
const authStore = useAuthStore();

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>
