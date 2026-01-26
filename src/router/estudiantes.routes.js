export default [
  {
    path: '/estudiantes/login',
    component: () => import("@/views/auth/LoginEstudiantes.vue"),
    meta: { requiresAuth: false, area: 'estudiantes' },  
  },
  {
    path: '/estudiantes',
    component: () => import('@/layouts/Dashboard.vue'),
    meta: { 
      requiresAuth: true, 
      area: 'estudiantes',
      title: "Panel de Estudiantes",
    },
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
        path: 'planesProgramas',
        component: () =>
          import('@/views/shared/PlanesProgramasView.vue')
      },
      {
        path: 'envioDocumentacion',
        component: () =>
          import("@/views/estudiantes/sections/tramites/DocumentacionView.vue")
      },
      {
        path: 'trayectoriaAcademica',
        component: () =>
          import("@/views/estudiantes/sections/constancias/TrayectoriaAcademicaView.vue")
      },
      {
        path: 'materiasAprobadas',
        component: () =>
          import("@/views/estudiantes/sections/constancias/MateriasAprobadasView.vue")
      },
      {
        path: 'novedadesDiarias',
        component: () =>
          import("@/views/estudiantes/NovedadesDiariasView.vue")
      },
      {
        path: 'constanciaEstudianteRegular',
        component: () =>
          import("@/views/estudiantes/sections/constancias/EstudianteRegularView.vue")
      },
    ]
  }
]
