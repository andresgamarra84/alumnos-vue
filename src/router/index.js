import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '@/views/LoginView.vue';
import HomeSection from '@/views/sections/HomeSection.vue';
import DashboardView from '@/views/DashboardView.vue';

// Import dinámico para secciones (agrega más según menú)
const MesasView = () => import('@/views/sections/inscripciones/MesasView.vue');
const MateriasView = () => import('../views/sections/inscripciones/MateriasView.vue');
const CarrerasView = () => import('../views/sections/inscripciones/CarrerasView.vue');
const ReservasView = () => import('../views/sections/ReservasView.vue');


// ... agrega más

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginView, meta: {requiresAuth: false}},
  {
    path: '/dashboard',
    component: DashboardView,
    children: [
      { path: '/inicio', component: HomeSection },
      { path: '/inscrExamenes', component: MesasView },
      { path: '/inscrMaterias', component: MateriasView },
      { path: '/inscrCarreras', component: CarrerasView },
      { path: '/reservas', component: ReservasView },

    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.meta.requiresAuth !== false
  if (!requiresAuth) {
    next()
    return
  }
  const url = "https://cjjc.edu.ar/api-v2/?entity=auth&action=checkSession";
  const r = await fetch(url, {
      credentials: 'include'
  });
  if (r.ok) {
    next()
  } else {
    next('/login')
  }
})


export default router;