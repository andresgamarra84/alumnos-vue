import { createRouter, createWebHistory } from 'vue-router'
//import AuthLayout from '@/layouts/AuthLayout.vue'
//import LoginEstudiantes from '@/views/auth/LoginEstudiantes.vue'
import estudiantesRoutes from './estudiantes.routes'
//import docentesRoutes from './docentes.routes'
import adminRoutes from './admin.routes'

const routes = [
  ...estudiantesRoutes,
 // docentesRoutes,
  ...adminRoutes
]

const router = createRouter({
  history: createWebHistory('/panel/'),
  routes
})
/*
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.meta.requiresAuth === true
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
  */
 router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth !== true) {
    next()
    return
  }

  try {
    const r = await fetch(
      'https://cjjc.edu.ar/api-v2/?entity=auth&action=checkSession',
      { credentials: 'include' }
    )

    if (!r.ok) {
      // 👇 redirige al login correcto
      if (to.path.startsWith('/admin')) {
        next('/admin/login')
      } else if (to.path.startsWith('/docentes')) {
        next('/docentes/login')
      } else {
        next('/estudiantes/login')
      }
      return
    }

    next()
  } catch {
    next('/estudiantes/login')
  }
})

export default router;