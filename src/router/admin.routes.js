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
            {
            path: 'solicitudesConstancias',
            component: () => import ('@/views/admin/sections/estudiantes/SolicitudesConstanciasView.vue')
            },
            {
                path: 'carreras',
                component: () => import ('@/views/admin/sections/configuracion/CarrerasView.vue')
            },
            {
                path: 'materias',
                component: () => import ('@/views/admin/sections/configuracion/MateriasView.vue')
            },
            {
                path: 'cursos',
                component: () => import ('@/views/admin/sections/configuracion/CursosView.vue')
            },
            {
                path: 'planesProgramas',
                component: () => import('@/views/admin/sections/configuracion/PlanesEstudioView.vue')
            },
            {
                path: 'mesasExamen',
                component: () => import ('@/views/admin/sections/MesasExamenView.vue')
            }
        ]
    }
]
