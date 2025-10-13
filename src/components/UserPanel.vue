<script setup>
import { ref, onMounted, markRaw } from 'vue';
import { useRouter } from 'vue-router';
import { useApiClient } from '../composables/useApiClient';
import Modal from './Modal.vue';

const { get, post } = useApiClient();
const router = useRouter();

// Estado para el modal
const modal = ref({
  isVisible: false,
  title: 'Información',
  message: '',
  type: 2, // 1 para confirmación, 2 para info
  input: '',
});

// Estado para datos dinámicos
const userData = ref({ name: '', nrodoc: '' });
const menuItems = ref({
  inicio: { esDropDown: false, data: [] },
  inscripciones: { esDropDown: true, data: [] },
  constancias: { esDropDown: true, data: [] },
  tramites: { esDropDown: true, data: [] },
  consultas: { esDropDown: false, data: [] },
  notificaciones: { esDropDown: false, data: [] },
});

// Estado para el componente dinámico
const currentComponent = ref(null);

// Mostrar modal
const showModal = (title, message, type = 2, input = '') => {
  modal.value = { isVisible: true, title, message, type, input };
};

// Resolver modal
const resolveModal = async (result) => {
  modal.value.isVisible = false;
  if (modal.value.type === 1 && result) {
    if (modal.value.title === 'Cerrar Sesión') {
      await logout();
    }
  }
};

// Cargar datos iniciales
const loadInitialData = async () => {
  try {
    // Obtener datos del usuario
    const userResponse = await get('user', 0, {});
    userData.value = userResponse.payload.data || { name: 'Usuario', nrodoc: 'N/A' };

    // Obtener opciones del menú
    const menuResponse = await get('menu', 0, {});
    menuItems.value = menuResponse.payload.data || menuItems.value;

    // Cargar mensajes
    const mensajesResponse = await get('mensajes', 4, {});
    const mensajes = mensajesResponse.payload || [];
    if (mensajes.length > 0) {
      let j = 0;
      const mostrarMensajes = () => {
        if (!modal.value.isVisible && j < mensajes.length) {
          showModal('Información', mensajes[j][1], 2);
          j++;
          setTimeout(mostrarMensajes, 1000);
        }
      };
      mostrarMensajes();
    }

    // Cargar componente inicial
    loadComponent('inicio');
  } catch (error) {
    showModal('Error', 'No se pudieron cargar los datos iniciales', 2);
  }
};

// Cargar componente dinámico
const loadComponent = async (opcion) => {
  try {
    if (opcion === 'analitico') {
     // currentComponent.value = markRaw(() => import('./Analitico.vue'));
    } else if (opcion === 'constancia') {
      //currentComponent.value = markRaw(() => import('./Constancia.vue'));
    } else if (opcion === 'logout') {
      showModal('Cerrar Sesión', '¿Desea cerrar la sesión?', 1);
    } else if (opcion !== '#') {
      // Para otras opciones, cargar un componente genérico o dinámico
      currentComponent.value = markRaw(() => import(`./${opcion.charAt(0).toUpperCase() + opcion.slice(1)}.vue`));
    }
  } catch (error) {
    //showModal('Error', `Error al cargar ${opcion}`, 2);
  }
};

// Cerrar sesión
const logout = async () => {
  try {
    await post('logout', 0, {});
    router.push('/');
  } catch (error) {
    showModal('Error', 'Error al cerrar sesión', 2);
  }
};

// Inicializar datos al montar
onMounted(() => {
  loadInitialData();
});
</script>

<template>
  <div class="container-fluid fondo1">
    <!-- Spinner -->
    <div id="loading" class="d-none" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; background-color: rgba(255, 255, 255, 0.8); z-index: 9999;">
      <div class="spinner-border" role="status" style="width: 3rem; height: 3rem;">
        <span class="visually-hidden">Aguarde...</span>
      </div>
    </div>

    <!-- Modal -->
    <Modal
      :isVisible="modal.isVisible"
      :title="modal.title"
      :message="modal.message"
      :type="modal.type"
      :input="modal.input"
      @resolve="resolveModal"
    />

    <!-- Header -->
    <header>
      <h2 class="text-center">Panel de Estudiantes</h2>
    </header>

    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-light fondo1">
      <div class="container-fluid">
        <button
          class="navbar-toggler custom-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span id="toggler" class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavDropdown">
          <ul class="navbar-nav">
            <li class="nav-item" id="inicio">
              <a
                v-if="menuItems.inicio.data.length"
                class="nav-link"
                href="#"
                @click.prevent="loadComponent(menuItems.inicio.data[0])"
              >{{ menuItems.inicio.data[1] }}</a>
            </li>
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >Inscripciones</a>
              <ul class="dropdown-menu" id="inscr">
                <li v-for="item in menuItems.inscripciones.data" :key="item[0]">
                  <a class="dropdown-item" href="#" @click.prevent="loadComponent(item[0])">{{ item[1] }}</a>
                </li>
              </ul>
            </li>
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >Constancias</a>
              <ul class="dropdown-menu" id="const">
                <li v-for="item in menuItems.constancias.data" :key="item[0]">
                  <a class="dropdown-item" href="#" @click.prevent="loadComponent(item[0])">{{ item[1] }}</a>
                </li>
              </ul>
            </li>
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >Trámites online</a>
              <ul class="dropdown-menu" id="tramites">
                <li v-for="item in menuItems.tramites.data" :key="item[0]">
                  <a class="dropdown-item" href="#" @click.prevent="loadComponent(item[0])">{{ item[1] }}</a>
                </li>
              </ul>
            </li>
            <li class="nav-item" id="consultas">
              <a
                v-if="menuItems.consultas.data.length"
                class="nav-link"
                href="#"
                @click.prevent="loadComponent(menuItems.consultas.data[0])"
              >{{ menuItems.consultas.data[1] }}</a>
            </li>
            <li class="nav-item" id="notif">
              <a
                v-if="menuItems.notificaciones.data.length"
                class="nav-link"
                href="#"
                @click.prevent="loadComponent(menuItems.notificaciones.data[0])"
              >{{ menuItems.notificaciones.data[1] }}</a>
            </li>
            <li class="nav-item" id="salir">
              <a class="nav-link" href="#" @click.prevent="loadComponent('logout')">Salir</a>
            </li>
          </ul>
        </div>
        <div style="width: 100%; display: inline" class="text-end">
          <div id="d_pers" class="py-2">{{ userData.name }} ({{ userData.nrodoc }})</div>
        </div>
      </div>
    </nav>

    <!-- Contenido dinámico -->
    <component :is="currentComponent" />
  </div>
</template>

<style scoped>
.fondo1 {
  background-color: #f0f0f0; /* Ajusta según estilos2.css */
}
.custom-toggler .navbar-toggler-icon {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba(0, 0, 0, 0.55)' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
}
</style>