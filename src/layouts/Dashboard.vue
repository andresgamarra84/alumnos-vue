<template>
  <Spinner :class="{ 'd-none': !isLoading }" />
  <!-- Contenedor Principal -->
  <div class="container-fluid fondo1">
    <header>
      <h2 class="text-center">Panel institucional</h2>
    </header>
    <Navbar />
    <div ref="layoutContainer" style="margin-top: 30px;">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import { ref, provide } from 'vue'
import Spinner from '@/components/Spinner.vue'
import { useLoading } from '@/composables/useLoading'
import Navbar from '@/components/Navbar.vue';
const { isLoading } = useLoading()
const layoutContainer = ref(null)
provide('layoutContainer', layoutContainer)
</script>

<style scoped>
.fondo1 {
  background-color: var(--color-fondo-principal);
}
</style>