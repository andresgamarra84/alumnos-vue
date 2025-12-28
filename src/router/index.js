import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '@/views/LoginView.vue';
import HomeSection from '@/views/sections/HomeSection.vue';
import DashboardView from '@/views/DashboardView.vue';
//import { api } from '../api/api.js';  // Import api para check

// Import dinámico para secciones (agrega más según menú)
const MesasView = () => import('@/views/sections/inscripciones/MesasView.vue');
//const MesasView = () => import('../views/sections/inscripciones/MesasView.vue');
// ... agrega más

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginView },
  {
    path: '/dashboard',
    component: DashboardView,
    children: [
      { path: '/inicio', component: HomeSection },
      { path: '/inscrExamenes', component: MesasView },
    ],
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
    if (to.meta.requiresAuth) {
        try {
            //await api.get({ entity: 'auth', action: 'checkSession' });
            next();
        } catch (err) {
            next('/login');
        }
    } else {
        next();
    }
});

export default router;