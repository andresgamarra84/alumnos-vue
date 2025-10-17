<template>
  <!-- Loading Overlay -->
  <div id="loading" class="d-none" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; background-color: rgba(255, 255, 255, 0.8); z-index: 9999;">
    <div class="spinner-border" role="status" style="width: 3rem; height: 3rem;">
      <span class="visually-hidden">Aguarde...</span>
    </div>
  </div>

  <!-- Modal Popup -->
  <div id="popup">
    <div v-if="isModalVisible" class="modal-overlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 10000;">
      <div class="modal-content" style="background: var(--color-fondo-secundario); padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px var(--sombra-suave); max-width: 400px; width: 90%;">
        <h2>{{ modalTitle }}</h2>
        <p>{{ modalMessage }}</p>
        <input type="text" v-if="modalType === 2" v-model="modalTxt" class="form-control mb-3" />
        <div class="modal-buttons text-end">
          <template v-if="modalType === 1">
            <button class="btn btn-success me-2" @click="resolveModal(true)">Sí</button>
            <button class="btn btn-danger" @click="resolveModal(false)">No</button>
          </template>
          <template v-else>
            <button class="btn btn-primary" @click="resolveModal(true)">Aceptar</button>
          </template>
        </div>
      </div>
    </div>
  </div>

  <!-- Contenedor Principal -->
  <div id="contenedor_T" class="container-fluid fondo1">
    <header>
      <h2 class="text-center">Panel de Estudiantes</h2>
    </header>

    <nav class="navbar navbar-expand-lg navbar-light fondo1">
      <div class="container-fluid">
        <div class="collapse navbar-collapse" id="navbarNavDropdown">
          <ul class="navbar-nav me-auto">
            <li class="nav-item" id="inicio"></li>
            <li class="nav-item dropdown">
              <a class="dropdown-toggle nav-link" href="#" id="navbarDropdownInscr" role="button" data-bs-toggle="dropdown" aria-expanded="false">Inscripciones</a>
              <ul class="dropdown-menu" id="inscr" aria-labelledby="navbarDropdownInscr"></ul>
            </li>
            <li class="nav-item dropdown">
              <a class="dropdown-toggle nav-link" href="#" id="navbarDropdownConst" role="button" data-bs-toggle="dropdown" aria-expanded="false">Constancias</a>
              <ul class="dropdown-menu" id="const" aria-labelledby="navbarDropdownConst"></ul>
            </li>
            <li class="nav-item dropdown">
              <a class="dropdown-toggle nav-link" href="#" id="navbarDropdownTramites" role="button" data-bs-toggle="dropdown" aria-expanded="false">Trámites online</a>
              <ul class="dropdown-menu" id="tramites" aria-labelledby="navbarDropdownTramites"></ul>
            </li>
            <li class="nav-item" style="flex-shrink: 0;" id="consultas"></li>
            <li class="nav-item" style="flex-shrink: 0;" id="notif"></li>
            <li class="nav-item" id="salir"></li>
          </ul>
        </div>
        <div style="width: 100%; display: inline;" class="text-end">
          <div id="d_pers" class="py-2"></div>
          <button class="navbar-toggler custom-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
            <span id="toggler" class="navbar-toggler-icon"></span>
          </button>
        </div>
      </div>
    </nav>

    <div id="cuerpo_T" style="margin-top: 30px;">
      <!-- Contenido dinámico: Usa slots o router-view para subsecciones -->
      <slot></slot> <!-- O <router-view /> si usas nested routes -->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { api } from '../api/api.js'; // Ajusta path
import { useRouter } from 'vue-router';

// Modal State
const isModalVisible = ref(false);
const modalTitle = ref('');
const modalMessage = ref('');
const modalType = ref(0); // 0: info, 1: confirm, 2: input
const modalTxt = ref('');
let modalResolver = null;

// Función para mostrar modal (llámala desde cualquier lógica)
const showModal = (title, message, type = 0) => {
  modalTitle.value = title;
  modalMessage.value = message;
  modalType.value = type;
  modalTxt.value = '';
  isModalVisible.value = true;
  return new Promise((resolve) => {
    modalResolver = resolve;
  });
};

const resolveModal = (value) => {
  if (modalType.value === 2) {
    modalResolver(modalTxt.value);
  } else {
    modalResolver(value);
  }
  isModalVisible.value = false;
};

// Ejemplo de uso: const result = await showModal('Título', 'Mensaje', 1);

// Loading Control
const showLoading = () => document.getElementById('loading').classList.remove('d-none');
const hideLoading = () => document.getElementById('loading').classList.add('d-none');
// Router para navegación interna (opcional, reemplaza href si usas Vue Router)
const router = useRouter();
// Función a_Click adaptada: Previene default, usa router si es interno, o permite href externo
const handleLinkClick = (event) => {
  event.preventDefault(); // Previene navegación full page
  const href = event.target.getAttribute('href');
  
  // Lógica custom: Ej, si href empieza con '/', usa router
  if (href.startsWith('/')) {
    router.push(href); // Navegación SPA
  } else {
    // Externo: window.location = href;
    window.open(href, '_blank'); // O _self
  }
  
  // Agrega tu lógica original aquí (ej: cargar contenido en #cuerpo_T via API)
  console.log('Link clicked:', href); // Placeholder para tu a_Click original
  // Ej: loadContent(href); 
};

onMounted(async () => {
  showLoading();
  try {
    // Fetch menú (ajusta entity/action para tu backend)
    const r = await api.get({ entity: 'menu', action: 'getMenu' });
    const dato = r.payload || {}; // Asegura payload

    // IDs de elementos (agrega más si necesitas)
    const collections = ['inscr', 'const', 'tramites', 'inicio', 'consultas', 'notif', 'salir'];

    for (let coleccion of collections) {
      const menuItem = dato[coleccion];
      if (!menuItem) continue; // Salta si no existe en payload

      const element = document.getElementById(coleccion);
      if (!element) continue; // Seguridad

      if (menuItem.esDropDown) {
        // Limpia dropdown previo
        element.innerHTML = '';
        
        menuItem.data.forEach(function(valor) {
          const li = document.createElement('li');
          const a = document.createElement('a');
          a.setAttribute('href', valor[0]);
          a.textContent = valor[1];
          a.setAttribute('class', 'dropdown-item');
          a.addEventListener('click', handleLinkClick); // Tu a_Click adaptado
          li.appendChild(a);
          element.appendChild(li);
        });
      } else {
        // Item simple: Sobrescribe contenido
        element.innerHTML = '';
        const a = document.createElement('a');
        a.setAttribute('href', menuItem.data[0]);
        a.textContent = menuItem.data[1];
        a.setAttribute('class', 'nav-link'); // Para consistencia Bootstrap
        a.addEventListener('click', handleLinkClick);
        element.appendChild(a);
      }
    }

    // Opcional: Popula #d_pers aquí o en separado API
    // const userData = await api.get({ entity: 'auth', action: 'getProfile' });
    // document.getElementById('d_pers').innerText = `${userData.nombre} (${userData.tipo})`;

  } catch (err) {
    await showModal('Error', 'No se pudieron cargar los menús: ' + err.message, 0);
    console.error(err);
  } finally {
    hideLoading();
  }
});

// Logout Ejemplo

const logout = async () => {
  const confirm = await showModal('Confirmar', '¿Salir de la sesión?', 1);
  if (confirm) {
    await api.post({ entity: 'auth', action: 'logout' });
    router.push('/login');
  }
};
</script>

<style scoped>
/* Estilos locales si necesitas overrides; global.css maneja la mayoría */
.fondo1 {
  background-color: var(--color-fondo-principal);
}
.modal-overlay {
  /* Asegura overlay */
}
.custom-toggler {
  /* Para tu #toggler icon */
}
</style>