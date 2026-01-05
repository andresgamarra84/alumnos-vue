<template>
  <Spinner :class="{ 'd-none': !isLoading }" />
  <!-- Contenedor Principal -->
  <div id="contenedor_T" class="container-fluid fondo1">
    <header>
      <h2 class="text-center">Panel de Estudiantes</h2>
    </header>
    <Navbar />
    <div id="cuerpo_T" style="margin-top: 30px;">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import Spinner from '@/components/Spinner.vue'
import { useLoading } from '@/composables/useLoading'
import Navbar from '@/components/Navbar.vue';
const { isLoading } = useLoading()
</script>

<style scoped>
.fondo1 {
  background-color: var(--color-fondo-principal);
}
</style>