/**
 * @fileoverview Punto de entrada principal de la aplicación Sistema Escolar
 * @copyright Copyright (c) 2026 Ing. Alexis Salvador Herrera Garcia, DTM
 * @license MIT
 */

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import './assets/styles/main.css';
import App from './App.vue';
import { initializeData } from './data/seed';
import { routes, createRouterGuards } from './router';

// Inicializar datos semilla
initializeData();

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Configurar guards del router
createRouterGuards(router);

const pinia = createPinia();

const app = createApp(App);
app.use(pinia);
app.use(router);
app.use(Toast, {
  position: 'top-right',
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false,
});

app.mount('#app');
