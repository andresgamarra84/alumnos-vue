<template>
  <Spinner :class="{ 'd-none': !isLoading }" />
  <!-- Contenedor Principal -->
  <div class="container-fluid fondo1">
    <header>
      <h2 class="text-center">{{titulo}}</h2>
    </header>
    <Navbar />
    <div ref="layoutContainer" style="margin-top: 30px;">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import { ref, provide, computed } from 'vue'
import { useRoute } from 'vue-router'
import Spinner from '@/components/Spinner.vue'
import { useLoading } from '@/composables/useLoading'
import Navbar from '@/components/Navbar.vue';
const { isLoading } = useLoading()
const layoutContainer = ref(null)
provide('layoutContainer', layoutContainer)
const route = useRoute()
const titulo = computed(() => route.meta.title)
</script>

<style scoped>
.fondo1 {
  background-color: var(--color-fondo-principal);
}
</style>