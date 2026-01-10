import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import './assets/estilos.css';
createApp(App).use(router).mount('#app');
window.addEventListener('session-expired', () => {
  // tu decisión de arquitectura
  window.location.href = '/'
})
