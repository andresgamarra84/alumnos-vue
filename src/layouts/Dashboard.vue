<template>
  <div class="container-fluid fondo1" ref="layoutContainer">
    <Spinner :class="{ 'd-none': !isLoading }" />
    <Header :titulo="titulo" />
    <Navbar 
      v-if="navbarData"
      :navbar-data = "navbarData"
      @navegar="navegarRoute"
    />
    <ViewContainer>
      <router-view :key="$route.fullPath" />
    </ViewContainer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, provide } from 'vue'
import { api } from '@/api/api'
import { useRoute, useRouter } from 'vue-router'
import Spinner from '@/components/Spinner.vue'
import Header from '@/components/Header.vue'
import { useLoading } from '@/composables/useLoading'
import Navbar from '@/components/Navbar.vue';
import ViewContainer from '@/components/ViewContainer.vue'
import { showModal } from '@/services/uiBus'
import { usePermisos } from '@/composables/usePermisos'
const { isLoading } = useLoading()
const { cargarPermisos } = usePermisos()
//layoutContainer Para uso de la grilla de horarios y el resize
const layoutContainer = ref(null)
provide('layoutContainer', layoutContainer)
const route = useRoute()
const router = useRouter()
const titulo = computed(() => route.meta.title)
const navbarData = ref(null)
// Populate Navbar
onMounted(async () => {
  navbarData.value = await getNavbarData()
  if (route.meta.area === 'admin') cargarPermisos()
})
const getNavbarData = async () => {
  const r = await api.get({ entity: 'menu', action: 'getMenu' })
  const payload = r.payload.menu ?? {}
  const user = r.payload.datosPersonales ?? {}
  const menu = Object.entries(payload).map(([key, item]) => {
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
  return {
    menu:menu, 
    user:user
  }
};
const navegarRoute = (item) => {

  if (item.path === '/logout') {
    logout()
  } else if (item.external) {
    window.open(item.path, '_blank')
  } else {
    //router.push(`/${area}/${item.path}`)
    router.push(item.path)
  }
}
// Logout
const logout = async () => {
  const { ok } = await showModal('¿Salir de la sesión?', 1, 'Confirmar');
  if (!ok) return;
  try {
    await api.post({ entity: 'auth', action: 'logout' });
    router.push('/login');
  } catch (err) {
    await showModal('Error al cerrar sesión: ' + err.message, 0, 'Error');
  }
};
</script>

<style scoped>
.fondo1 {
  background-color: var(--color-fondo-principal);
}
</style>