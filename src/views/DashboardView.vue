<template>
  <div>
    <!-- Navbar Superior -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">Dashboard</a>
        <div class="collapse navbar-collapse">
          <ul class="navbar-nav me-auto">
            <li v-for="item in menuItems" :key="item.path" class="nav-item">
              <router-link :to="'/dashboard/' + item.path" class="nav-link">{{ item.label }}</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Cuerpo Dinámico -->
    <div class="container mt-3">
      <router-view /> <!-- Aquí se carga la view de la sección -->
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import { api } from '../api/api.js';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const menuItems = ref([]);
    const router = useRouter();

    onMounted(async () => {
    try {
        const res = await api.get({ 
            entity: 'menu', 
            action: 'getMenu' 
        });
        menuItems.value = res.menu;
    } catch (err) {
        console.error(err);
    }
});

    return { menuItems };
  },
};
</script>