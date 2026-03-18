import type { RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';
import { UserRole } from '../types';

export const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/',
    component: () => import('../components/layout/AppLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('../views/DashboardView.vue'),
        meta: { roles: [UserRole.DIRECTOR, UserRole.COORDINADOR, UserRole.CAJERO, UserRole.MAESTRO] },
      },
      {
        path: 'alumnos',
        name: 'alumnos',
        component: () => import('../views/AlumnosView.vue'),
      },
      {
        path: 'alumnos/:id',
        name: 'alumno-detalle',
        component: () => import('../views/AlumnoDetalleView.vue'),
      },
      {
        path: 'grupos',
        name: 'grupos',
        component: () => import('../views/GruposView.vue'),
      },
      {
        path: 'asistencia',
        name: 'asistencia',
        component: () => import('../views/AsistenciaView.vue'),
      },
      {
        path: 'calificaciones',
        name: 'calificaciones',
        component: () => import('../views/CalificacionesView.vue'),
      },
      {
        path: 'boletas',
        name: 'boletas',
        component: () => import('../views/BoletasView.vue'),
      },
      {
        path: 'pagos',
        name: 'pagos',
        component: () => import('../views/PagosView.vue'),
      },
      {
        path: 'cfdi',
        name: 'cfdi',
        component: () => import('../views/CFDIView.vue'),
      },
      {
        path: 'comedor',
        name: 'comedor',
        component: () => import('../views/ComedorView.vue'),
      },
      {
        path: 'entrada-salida',
        name: 'entrada-salida',
        component: () => import('../views/EntradaSalidaView.vue'),
      },
      {
        path: 'comunicados',
        name: 'comunicados',
        component: () => import('../views/AgendaView.vue'),
      },
      {
        path: 'becas',
        name: 'becas',
        component: () => import('../views/BecasView.vue'),
      },
      {
        path: 'inscripciones',
        name: 'inscripciones',
        component: () => import('../views/InscripcionesView.vue'),
      },
      {
        path: 'reportes',
        name: 'reportes',
        component: () => import('../views/ReportesView.vue'),
      },
      {
        path: 'configuracion',
        name: 'configuracion',
        component: () => import('../views/ConfiguracionView.vue'),
        meta: { roles: [UserRole.DIRECTOR] },
      },
    ],
  },
  {
    path: '/portal',
    component: () => import('../components/layout/PortalLayout.vue'),
    meta: { requiresAuth: true, roles: [UserRole.PADRE] },
    children: [
      {
        path: '',
        name: 'portal',
        component: () => import('../views/portal/PortalView.vue'),
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login',
  },
];

export function createRouterGuards(router: any) {
  router.beforeEach((to: any, from: any, next: any) => {
    const authStore = useAuthStore();

    // Si requiere autenticación y no está autenticado
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      next('/login');
      return;
    }

    // Si ya está autenticado y va a login, redirigir según rol
    if (to.meta.requiresAuth === false && authStore.isAuthenticated) {
      if (authStore.userRole === UserRole.PADRE) {
        next('/portal');
      } else {
        next('/');
      }
      return;
    }

    // Verificar permisos por rol
    if (to.meta.roles && authStore.currentUser) {
      const roles = to.meta.roles as UserRole[];
      if (!roles.includes(authStore.currentUser.rol)) {
        // Si no tiene permiso, redirigir al dashboard
        next('/');
        return;
      }
    }

    // Permitir navegación
    next();
  });

  // Manejar errores de navegación
  router.onError((error: any) => {
    console.error('Error de navegación:', error);
  });
}
