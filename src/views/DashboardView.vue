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

    <nav class="navbar navbar-expand-lg navbar-light fondo1" ref="navbarRef">
      <div class="container-fluid">
        <div class="collapse navbar-collapse" id="navbarNavDropdown">
          <ul class="navbar-nav me-auto">
            <li
              v-for="entry in menu"
              :key="entry.key"
              class="nav-item"
              :class="{ dropdown: entry.esDropDown }"
            >
              <template v-if="entry.esDropDown">
                <a
                  class="nav-link dropdown-toggle"
                  href="#"
                  data-bs-toggle="dropdown"
                >
                  {{ entry.data.nombre }}
                </a>
                <ul class="dropdown-menu">
                  <li v-for="item in entry.items" :key="item.path">
                    <a
                      class="dropdown-item"
                      href="#"
                      @click.prevent="navigate(item)"
                    >
                      {{ item.label }}
                    </a>
                  </li>
                </ul>
              </template>

              <template v-else>
                <a
                  class="nav-link"
                  href="#"
                  @click.prevent="navigate(data)"
                >
                  {{ entry.data.nombre }}
                </a>
              </template>
            </li>
          </ul>

          <!--<ul class="navbar-nav me-auto">
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
          </ul>-->
        </div>
        <div style="width: 100%; display: inline;" class="text-end">
          <div id="d_pers" class="py-2">{{ userName.nombreEdad || 'Cargando...' }}</div>
          <button class="navbar-toggler custom-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
            <span id="toggler" class="navbar-toggler-icon"></span>
          </button>
        </div>
      </div>
    </nav>

    <div id="cuerpo_T" style="margin-top: 30px;">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { api } from '@/api/api.js'; // Adjust path

// Modal State
const isModalVisible = ref(false);
const modalTitle = ref('');
const modalMessage = ref('');
const modalType = ref(0); // 0: info, 1: confirm, 2: input
const modalTxt = ref('');
const navbarRef = ref(null);
const menu = ref([]);
const collections = ref([
  "inscr",
  "const",
  "tramites",
  "consultas",
  "notif",
]);
let modalResolver = null;

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

// Loading Control
const showLoading = () => document.getElementById('loading').classList.remove('d-none');
const hideLoading = () => document.getElementById('loading').classList.add('d-none');

// User Data
const userName = ref([]);

// Router
const router = useRouter();

const navigate = (item) => {
  if (item.path === '/logout') {
    logout()
  } else if (item.external) {
    window.open(item.path, '_blank')
  } else {
    router.push(item.path)
  }
}

// Populate Navbar

const populateNavbar = async () => {
  const r = await api.get({ entity: 'menu', action: 'getMenu' })
  const payload = r.payload.menu
  userName.value = r.payload.datosPersonales
  menu.value = Object.entries(payload).map(([key, item]) => {
    return {
      key,
      esDropDown: item.esDropDown,
      data: item.data,
      items: item.esDropDown
        ? item.children.map(d => ({
            path: d.path,
            label: d.nombre,
            external: d.external,
          }))
        : [],
    }
  })
  console.log(menu);
};

// Logout
const logout = async () => {
  const confirm = await showModal('Confirmar', '¿Salir de la sesión?', 1);
  if (confirm) {
    try {
      await api.post({ entity: 'auth', action: 'logout' });
      router.push('/login');
    } catch (err) {
      await showModal('Error', 'Error al cerrar sesión: ' + err.message, 0);
    }
  }
};

onMounted(() => {
  if (navbarRef.value) {
    // Busca todos los <li> con id dentro del navbar
    const liElements = navbarRef.value.querySelectorAll('li[id]');
    collections.value = Array.from(liElements).map(li => li.id);
  }
  populateNavbar();
  router.push('/inicio'); // Internal SPA navigation
});
</script>

<style scoped>
.fondo1 {
  background-color: var(--color-fondo-principal);
}
</style>