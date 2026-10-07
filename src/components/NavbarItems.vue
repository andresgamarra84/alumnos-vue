<template>
  <li
    v-for="item in items"
    :key="item.path ?? item.label"
    :class="{ 'dropdown-submenu': item.esDropDown }"
  >
    <template v-if="item.esDropDown">
      <a
        class="dropdown-item dropdown-toggle"
        href="#"
        @click.prevent.stop="toggleSubmenu"
      >
        {{ item.label }}
      </a>
      <ul class="dropdown-menu">
        <NavbarItems :items="item.items" @navegar="navegar" />
      </ul>
    </template>

    <a
      v-else
      class="dropdown-item"
      href="#"
      @click.prevent="navegar(item)"
    >
      {{ item.label }}
    </a>
  </li>
</template>

<script setup>
// Renderiza recursivamente los items de un dropdown. Un item con esDropDown abre un submenu.
// El estado abierto/cerrado se maneja con la clase "show" para poder resetearlo desde Navbar al cerrar el dropdown padre.
defineProps({
  items: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(["navegar"])
const navegar = (item) => emit("navegar", item)

// .stop evita que Bootstrap cierre el dropdown raiz al hacer click dentro del menu
const toggleSubmenu = (e) => {
  const li = e.currentTarget.parentElement
  const abrir = !li.classList.contains("show")
  // Cierra los submenus hermanos
  li.parentElement
    .querySelectorAll(":scope > .dropdown-submenu.show")
    .forEach((el) => cerrar(el))
  if (abrir) {
    li.classList.add("show")
    li.querySelector(":scope > .dropdown-menu").classList.add("show")
  }
}

const cerrar = (li) => {
  li.classList.remove("show")
  li.querySelectorAll(".show").forEach((el) => el.classList.remove("show"))
  li.querySelector(":scope > .dropdown-menu")?.classList.remove("show")
}
</script>

<style scoped>
.dropdown-submenu {
  position: relative;
}

.dropdown-submenu > .dropdown-toggle::after {
  float: right;
  margin-top: 0.5em;
  border-top: 0.3em solid transparent;
  border-bottom: 0.3em solid transparent;
  border-left: 0.3em solid;
  border-right: 0;
}

@media (min-width: 992px) {
  .dropdown-submenu > .dropdown-menu {
    top: 0;
    left: 100%;
    margin-top: -0.5rem;
  }
}

/* En el menu colapsado (mobile) el submenu se apila debajo, indentado */
@media (max-width: 991.98px) {
  .dropdown-submenu > .dropdown-menu {
    position: static;
    float: none;
    border: 0;
    padding-left: 1rem;
  }
}
</style>
