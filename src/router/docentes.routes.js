export default [
  {
    path: '/docentes/login',
    component: () => import("@/views/auth/LoginDocentes.vue"),
    meta: { requiresAuth: false, area: 'docentes' },  
  },
  {
    path: '/docentes',
    component: () => import('@/layouts/Dashboard.vue'),
    meta: { requiresAuth: true, area: 'docentes' },
    children: [
      {
        path: '',
        redirect: '/docentes/inicio'
      },
      {
        path: 'inicio',
        component: () => import('@/views/docentes/HomeSection.vue')
      },
      /*{
        path: 'mensajes',
        component: () => import('@/views/docentes/MensajesView.vue')
      },
      {
        path: 'datosPersonales',
        component: () =>
          import('@/views/docentes/sections/tramites/DatosPersonalesView.vue')
      },
      {
        path: 'planes_programas',
        component: () =>
          import('@/views/shared/PlanesProgramasView.vue')
      },*/

    ]
  }
]
