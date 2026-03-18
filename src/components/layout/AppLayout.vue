<template>
  <div class="min-h-screen bg-gray-50">
    <AppSidebar />
    <div class="lg:pl-64">
      <AppHeader />
      <main class="p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppSidebar from './AppSidebar.vue';
import AppHeader from './AppHeader.vue';
</script>
