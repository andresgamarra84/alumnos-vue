import { createRouter, createWebHistory } from 'vue-router'
import AuthLayout from '@/layouts/AuthLayout.vue'
import LoginEstudiantes from '@/views/auth/LoginEstudiantes.vue'
import estudiantesRoutes from './estudiantes.routes'
//import docentesRoutes from './docentes.routes'
//import adminRoutes from './admin.routes'

const routes = [
  { path: '/', redirect: '/login/estudiantes' },
  {
    path: '/login',
    component: AuthLayout,
    meta: { requiresAuth: false },
    children: [
      { path: 'estudiantes', component: LoginEstudiantes },
      //{ path: 'docentes', component: LoginDocentes },
      //{ path: 'admin', component: LoginAdmin }
    ]
  },
  estudiantesRoutes,
 // docentesRoutes,
  //adminRoutes
]

const router = createRouter({
  history: createWebHistory(),
  routes
})
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.meta.requiresAuth !== false
  console.log('➡️ Navegando a:', to.fullPath)

  if (!requiresAuth) {
    next()
    return
  }

  try {
    const r = await fetch(
      'https://cjjc.edu.ar/api-v2/?entity=auth&action=checkSession',
      { credentials: 'include' }
    )

    if (!r.ok) {
      window.location.href = '/'
      return
    }

    next()
  } catch (e) {

    window.location.href = '/'
  }
})
/*
router.isReady().then(() => {
  if (!router.currentRoute.value.name) {
    router.replace('/estudiantes/')
  }
})
router.beforeEach(async (to, from, next) => {
  const url = "https://cjjc.edu.ar/api-v2/?entity=auth&action=checkSession"
  // ROOT siempre existe ahora
  if (to.path === '/') {
    const r = await fetch(url, {
      credentials: 'include'
    });
    next(r.ok ? '/dashboard' : '/login')
    return
  }
  const requiresAuth = to.meta.requiresAuth !== false
  if (!requiresAuth) {
    next()
    return
  }
  const r = await fetch(url, {
    credentials: 'include'
  });
  next(r.ok ? undefined : '/login')
})
  */
export default router;