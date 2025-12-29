<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router'
import { api } from '@/api/api.js';

const navbarRef = ref(null);
const menu = ref([]);
const collections = ref([
  "inscr",
  "const",
  "tramites",
  "consultas",
  "notif",
]);
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
defineProps({
  menu: Array,
  userName: Object
})
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-light fondo1">
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
                @click.prevent="navigate(entry.data)"
              >
                {{ entry.data.nombre }}
              </a>
            </template>
          </li>
        </ul>
      </div>

      <div class="text-end">
        <div class="py-2">
          {{ userName.nombreEdad || 'Cargando...' }}
        </div>

        <button 
          class="navbar-toggler custom-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
      </div>
    </div>
  </nav>
</template>
