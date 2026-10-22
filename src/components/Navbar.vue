<template>
  <nav ref="navRef" class="navbar navbar-expand-lg navbar-light fondo1">
    <div class="container-fluid">
      <div class="collapse navbar-collapse" id="navbarNavDropdown">
        <ul class="navbar-nav me-auto">
          <li
            v-for="entry in navbarData.menu"
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
                <NavbarItems :items="entry.items" @navegar="navegar" />
              </ul>
            </template>

            <template v-else>
              <a
                class="nav-link"
                href="#"
                @click.prevent="navegar(entry.data)"
              >
                {{ entry.data.nombre }}
              </a>
            </template>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#" @click.prevent="salir">Salir</a>
          </li>
        </ul>
      </div>

      <div class="text-end">
        <div class="py-2">
          {{ navbarData.user.titulo || 'Cargando...' }}
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
<script setup>
import { onMounted, onBeforeUnmount, ref } from "vue"
import NavbarItems from "@/components/NavbarItems.vue"
import { useRouter, useRoute } from "vue-router"
import { SESSION_NAME } from "@/config/app.config"

const router = useRouter()
const route = useRoute()

// Cierra la sesión y vuelve al login del rol actual
const salir = () => {
  sessionStorage.removeItem(SESSION_NAME)
  const rol = ["admin", "docentes"].find(r => route.path.startsWith(`/${r}`)) ?? "estudiantes"
  router.push(`/${rol}/login`)
}

const emit = defineEmits(["navegar"])
const navegar = (item) => {
  emit("navegar", item)
}

defineProps({
  navbarData: {
    type: Object,
    required: true,
  },
})

// Al cerrarse un dropdown raiz se cierran sus submenus abiertos
const navRef = ref(null)
const cerrarSubmenus = (e) => {
  e.target
    .closest("li")
    ?.querySelectorAll(".show")
    .forEach((el) => {
      if (el !== e.target && !el.contains(e.target)) el.classList.remove("show")
    })
}
onMounted(() => navRef.value?.addEventListener("hidden.bs.dropdown", cerrarSubmenus))
onBeforeUnmount(() => navRef.value?.removeEventListener("hidden.bs.dropdown", cerrarSubmenus))
</script>
