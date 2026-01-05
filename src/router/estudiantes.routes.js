import DashboardView from '@/layouts/Dashboard.vue'

export default {
  path: '/estudiantes',
  component: DashboardView,
  meta: { requiresAuth: true, area: 'estudiantes' },
  children: [
    {
      path: '',
      redirect: '/estudiantes/inicio'
    },
    {
      path: 'inicio',
      component: () => import('@/views/estudiantes/HomeSection.vue')
    },
    {
      path: 'mensajes',
      component: () => import('@/views/estudiantes/MensajesView.vue')
    },
    {
      path: 'inscrExamenes',
      component: () =>
        import('@/views/estudiantes/sections/inscripciones/MesasView.vue')
    },
    {
      path: 'inscrMaterias',
      component: () =>
        import('@/views/estudiantes/sections/inscripciones/MateriasView.vue')
    },
    {
      path: 'inscrCarreras',
      component: () =>
        import('@/views/estudiantes/sections/inscripciones/CarrerasView.vue')
    },
    {
      path: 'datosPersonales',
      component: () =>
        import('@/views/estudiantes/sections/tramites/DatosPersonalesView.vue')
    },
    {
      path: 'reservas',
      component: () =>
        import('@/views/estudiantes/sections/tramites/ReservasView.vue')
    },
    {
      path: 'planes_programas',
      component: () =>
        import('@/views/shared/PlanesProgramasView.vue')
    },
  ]
}
