export default [
  {
    path: '/docentes/login',
    component: () => import("@/views/auth/LoginDocentes.vue"),
    meta: { requiresAuth: false, area: 'docentes' },  
  },
  {
    path: '/docentes',
    component: () => import('@/layouts/Dashboard.vue'),
    meta: { 
      requiresAuth: true, 
      area: 'docentes',
      title: "Panel de Docentes",
    },
    children: [
      {
        path: '',
        redirect: '/docentes/inicio'
      },
      {
        path: 'inicio',
        component: () => import('@/views/docentes/HomeSection.vue')
      },
      {
        path: 'listaEstudiantes',
        component: () => import('@/views/docentes/sections/cursos/ListaEstudiantesView.vue')
      },
      {
        path: 'notasCursada',
        component: () => import('@/views/docentes/sections/cursos/NotasCursadaView.vue')
      },
      /*{
        path: 'mensajes',
        component: () => import('@/views/docentes/MensajesView.vue')
      },
      {
        path: 'datosPersonales',
        component: () =>
          import('@/views/docentes/sections/tramites/DatosPersonalesView.vue')
      },*/
      {
        path: 'planes_programas',
        component: () =>
          import('@/views/shared/PlanesProgramasView.vue')
      },
      {
        path: 'mesasExamen',
        component: ()=>
          import('@/views/docentes/MesasExamenView.vue')
      },
    ]
  }
]
