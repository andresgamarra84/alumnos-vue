import DashboardView from '@/layouts/Dashboard.vue'

export default [
    {
        path: '/admin/login',
        component: () => import('@/views/auth/LoginAdmin.vue'),
        meta: { requiresAuth: false, area: 'admin'}
    },
    {  
        path: '/admin',
        component: DashboardView,
        meta: { 
            requiresAuth: true, 
            area: 'admin',
            title: "Panel de Administración"
        },
        children: [
            {
            path: '',
            redirect: '/admin/inicio'
            },
            {
            path: 'inicio',
            component: () => import('@/views/admin/HomeSection.vue')
            },
            {
            path: 'busquedaEstudiantes',
            component: () => import ('@/views/admin/sections/BusquedaView.vue'),
            meta: {
                area: 'estudiantes'
                },
            },
            {
            path: 'busquedaDocentes',
            component: () => import ('@/views/admin/sections/BusquedaView.vue'),
            meta: {
                area: 'docentes',
                },
            },
            {
            path: 'grillaHorarios',
            component: () => import('@/views/admin/GrillaHorariosView.vue')
            },
            {
            path: 'mensajes',
            component: () => import('@/views/admin/MensajesView.vue')
            },
            {
            path: 'config',
            component: () => import('@/views/admin/config/ConfiguracionView.vue')
            },
            /*
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
            */
        ]
    }
]
