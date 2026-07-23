<script setup>
import { ref, nextTick, onMounted } from 'vue'
import './estilos.css'

const CONTENT_BASE = import.meta.env.VITE_CONTENT_BASE ?? '/web/'

const navBarContent = ref('')
const contenidoSeccion = ref('')
const contentVisible = ref(false)
const contenidoEl = ref(null)
const navbarEl = ref(null)

async function getDataFromServer(seccion) {
  const response = await fetch(`${CONTENT_BASE}getContent.php?s=${seccion}`)
  return response.json()
}

function executeScripts(js, css) {
  document.getElementById('tempScript')?.remove()
  document.getElementById('tempCSS')?.remove()

  const tempScript = document.createElement('script')
  tempScript.id = 'tempScript'
  tempScript.textContent = js
  document.body.appendChild(tempScript)

  const tempCSS = document.createElement('style')
  tempCSS.id = 'tempCSS'
  tempCSS.textContent = css
  document.head.appendChild(tempCSS)
}

async function renderCarrusel() {
  const carrInner = document.getElementById('carr_inner')
  if (!carrInner) return
  try {
    const data = await getDataFromServer('carrusel')
    carrInner.innerHTML = data.html
  } catch (error) {
    console.error('Error al cargar el carrusel:', error)
  }
}

async function cargarContenido(seccion) {
  try {
    contentVisible.value = false
    const data = await getDataFromServer(seccion)
    contenidoSeccion.value = data.html

    await nextTick()
    executeScripts(data.js, data.css)
    await renderCarrusel()
    setTimeout(() => {
      contentVisible.value = true
    }, 700)

    if (navbarEl.value) {
      const bsCollapse = new window.bootstrap.Collapse(navbarEl.value, { toggle: false })
      bsCollapse.hide()
    }
  } catch (error) {
    console.error('Error al cargar contenido:', error)
  }
}

function handleNavClick(event) {
  if (event.target.tagName === 'A' && event.target.closest('#navbarSupportedContent')) {
    const seccion = event.target.dataset.cjjcSeccion
    if (seccion) cargarContenido(seccion)
  }
}

onMounted(async () => {
  try {
    const navBarData = await getDataFromServer('navBar')
    navBarContent.value = navBarData.html
    await cargarContenido('inicio')
  } catch (error) {
    console.error('Error al cargar contenido:', error)
  }
})
</script>

<template>
  <div class="container">
    <div class="col-12">
      <nav class="navbar navbar-dark" style="background-color:#03005f">
        <div class="container">
          <a class="navbar-brand" href="#!">CJJC</a>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent" ref="navbarEl">
            <ul
              class="navbar-nav ms-auto mb-2 mb-lg-0"
              v-html="navBarContent"
              @click="handleNavClick"
            ></ul>
          </div>
        </div>
      </nav>
    </div>

    <div
      class="py-5 fade-in"
      :class="{ visible: contentVisible }"
      id="contenido"
      ref="contenidoEl"
      v-html="contenidoSeccion"
    ></div>

    <div class="py-5 bg-dark">
      <div class="container">
        <p class="m-0 text-center text-white">
          Sedes<br />
          Central: Av. Santa Fe 1740 – Martínez<br />
          Anexo: Anchorena 901 – La Lucila<br />
          Buenos Aires, Argentina
        </p>
      </div>
    </div>
  </div>
</template>
