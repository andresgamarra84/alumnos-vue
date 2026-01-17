import { createRouter, createWebHistory } from 'vue-router'
import estudiantesRoutes from './estudiantes.routes'
import docentesRoutes from './docentes.routes'
import adminRoutes from './admin.routes'

const routes = [
  ...estudiantesRoutes,
  ...docentesRoutes,
  ...adminRoutes
]

const router = createRouter({
  history: createWebHistory('/panel/'),
  routes
})
router.beforeEach(async (to, from, next) => {
  //if (to.meta.requiresAuth !== true) {
    return next()
  //}
  /*try {
    // --- ADMIN ---
    if (to.path.startsWith('/admin')) {
      /*const r = await fetch(
        'https://cjjc.edu.ar/api-v2/?entity=auth&action=checkSessionAdm',
        { credentials: 'include' }
      )
      
      return r.ok
        ? next()
        : next('/admin/login')
    }
    const token = sessionStorage.getItem('CJJC_USER')
    if (!token) {
      return next(
        to.path.startsWith('/docentes')
          ? '/docentes/login'
          : '/estudiantes/login'
      )
    }
    const r = await fetch(
      'https://cjjc.edu.ar/api-v2/?entity=auth&action=checkSessionUsr',
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    if (!r.ok) {
      return next(
        to.path.startsWith('/docentes')
          ? '/docentes/login'
          : '/estudiantes/login'
      )
    }
    return next()
  } catch (e) {
    return next('/estudiantes/login')
  }*/
})

export default router;