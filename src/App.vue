<script setup>
import { ref } from 'vue';
import Login from './components/Login.vue';
import Maintenance from './components/Maintenance.vue';

// Simula la variable $abierto; puedes obtenerla desde una API o .env
const isOpen = ref(true); // Cambia a false para modo mantenimiento
</script>

<template>
  <div class="fondo1 texto-regular">
    <router-view v-if="isOpen" />
    <Maintenance v-else />
  </div>
</template>

<style scoped>
.fondo1 {
  /* Copia los estilos de fondo1 de estilos2.css */
  background-color: #f0f0f0; /* Ejemplo, ajusta según tu CSS */
}
.texto-regular {
  font-family: Arial, sans-serif; /* Ajusta según estilos2.css */
}
</style>