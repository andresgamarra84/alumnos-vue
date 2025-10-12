import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import './assets/estilos.css'; // Tu CSS personalizado
import './assets/modal.css'; // Tu CSS para el modal

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: () => import('./components/Login.vue') },
    { path: '/userpanel', component: () => import('./components/UserPanel.vue') },
    { path: '/maintenance', component: () => import('./components/Maintenance.vue') },
  ],
});

const app = createApp(App);
app.use(router);
app.mount('#app');