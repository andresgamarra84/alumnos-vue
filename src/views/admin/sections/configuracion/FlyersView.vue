<template>
  <div class="editor">
    <div class="controles">

      <section class="seccion">
        <h3>Formato</h3>
        <div class="opciones">
          <button
            type="button"
            v-for="f in FORMATOS"
            :key="f.clave"
            :class="{ activo: formato === f.clave }"
            @click="formato = f.clave"
          >{{ f.etiqueta }}</button>
        </div>
      </section>

      <section class="seccion">
        <h3>Diseño</h3>
        <div class="opciones">
          <button type="button" :class="{ activo: layout === 'A' }" @click="layout = 'A'">Círculo arriba · logo al pie</button>
          <button type="button" :class="{ activo: layout === 'B' }" @click="layout = 'B'">Logo como título · círculo al pie</button>
        </div>
      </section>

      <section class="seccion">
        <h3>Fondo</h3>
        <div class="opciones">
          <button type="button" :class="{ activo: bgMode === 'color' }" @click="bgMode = 'color'">Color</button>
          <button type="button" :class="{ activo: bgMode === 'image' }" @click="bgMode = 'image'">Imagen propia</button>
        </div>

        <div v-if="bgMode === 'color'" class="selector-color">
          <button
            v-for="c in bgSwatches"
            :key="c"
            type="button"
            class="swatch"
            :class="{ activo: bgColor === c }"
            :style="{ background: c }"
            @click="bgColor = c"
          />
          <input type="color" v-model="bgColor" title="Color de fondo personalizado" />
        </div>

        <label v-else class="campo-imagen">
          Imagen de fondo (PNG o JPG)
          <input type="file" accept="image/png, image/jpeg" @change="cargarImagen" />
        </label>
      </section>

      <section class="seccion">
        <h3>Logos</h3>

        <div class="bloque-logo" v-for="(l, clave) in logos" :key="clave">
          <label class="fila-logo">
            <input type="checkbox" v-model="l.visible" />
            {{ etiquetasLogos[clave] }}
          </label>

          <div class="ajustes">
            <span class="ajustes-titulo">Tamaño</span>
            <button type="button" @click="cambiarTamanoLogo(clave, -PASO_TAMANO)">−</button>
            <button type="button" @click="cambiarTamanoLogo(clave, PASO_TAMANO)">+</button>

            <span class="ajustes-titulo">Posición</span>
            <button type="button" @click="moverLogo(clave, 0, -PASO_DESPLAZAMIENTO)">↑</button>
            <button type="button" @click="moverLogo(clave, 0, PASO_DESPLAZAMIENTO)">↓</button>
            <button type="button" @click="moverLogo(clave, -PASO_DESPLAZAMIENTO, 0)">←</button>
            <button type="button" title="Restablecer posición y tamaño" @click="restablecerLogo(clave)">↺</button>
            <button type="button" @click="moverLogo(clave, PASO_DESPLAZAMIENTO, 0)">→</button>
          </div>
        </div>

        <span class="ajustes-titulo">Color de los logos</span>
        <div class="selector-color">
          <button
            v-for="c in logoSwatches"
            :key="c"
            type="button"
            class="swatch"
            :class="{ activo: logoColor === c }"
            :style="{ background: c }"
            @click="logoColor = c"
          />
          <input type="color" v-model="logoColor" title="Color de logos personalizado" />
        </div>

        <div class="campo-slider">
          <label>Opacidad del círculo</label>
          <input type="range" min="30" max="100" v-model.number="circleOpacityPct" />
          <span>{{ circleOpacityPct }}%</span>
        </div>
      </section>

      <section class="seccion">
        <h3>Color de texto</h3>
        <div class="selector-color">
          <button
            v-for="c in textSwatches"
            :key="c"
            type="button"
            class="swatch"
            :class="{ activo: textColor === c }"
            :style="{ background: c, boxShadow: c === '#ffffff' ? '0 0 0 1px #ccc' : undefined }"
            @click="textColor = c"
          />
          <input type="color" v-model="textColor" title="Color de texto personalizado" />
        </div>
      </section>

      <section class="seccion">
        <h3>Contenido</h3>

        <div class="campo-texto" v-for="(t, clave) in textos" :key="clave">
          <div class="campo-texto-header">
            <label>{{ etiquetas[clave] }}</label>
            <button type="button" class="btn-fuente" title="Elegir fuente" @click="alternarFuente(clave)">🔤</button>
          </div>
          <textarea v-model="t.valor" rows="2"></textarea>

          <div v-if="fuenteAbierta === clave">
            <select v-model="t.fuente" :style="{ fontFamily: `${t.fuente}, sans-serif` }">
              <option v-for="f in fuentesDisponibles" :key="f" :value="f" :style="{ fontFamily: `${f}, sans-serif` }">{{ f }}</option>
            </select>
            <p v-if="errorFuentes" class="aviso-fuentes">{{ errorFuentes }}</p>
          </div>

          <div class="ajustes">
            <span class="ajustes-titulo">Tamaño</span>
            <button type="button" @click="cambiarTamano(clave, -PASO_TAMANO)">−</button>
            <button type="button" @click="cambiarTamano(clave, PASO_TAMANO)">+</button>

            <span class="ajustes-titulo">Posición</span>
            <button type="button" @click="mover(clave, 0, -PASO_DESPLAZAMIENTO)">↑</button>
            <button type="button" @click="mover(clave, 0, PASO_DESPLAZAMIENTO)">↓</button>
            <button type="button" @click="mover(clave, -PASO_DESPLAZAMIENTO, 0)">←</button>
            <button type="button" title="Centrar horizontalmente" @click="centrarHorizontal(clave)">↔</button>
            <button type="button" @click="mover(clave, PASO_DESPLAZAMIENTO, 0)">→</button>
          </div>
        </div>
      </section>

      <button @click="descargar" :disabled="descargaDeshabilitada">Descargar flyer</button>
    </div>

    <canvas ref="canvasRef" :width="dimensiones.ancho" :height="dimensiones.alto"></canvas>
  </div>
</template>

<script setup>
import { reactive, ref, computed, watch, onMounted, nextTick } from 'vue'
import circuloSrc from '@/assets/flyers/circulo-60-aniversario.png'
import semanaSrc from '@/assets/flyers/logo-semana-de-las-artes.png'

const PASO_TAMANO = 0.1
const PASO_DESPLAZAMIENTO = 10

// Formatos de publicación: el ancho se mantiene fijo en 1200px, el alto surge de la relación de aspecto
const ANCHO_BASE = 1200
const FORMATOS = [
  { clave: '4:5', etiqueta: '4:5', alto: ANCHO_BASE * (5 / 4) },
  { clave: '16:9', etiqueta: '16:9', alto: ANCHO_BASE * (9 / 16) },
  { clave: '1:1', etiqueta: '1:1', alto: ANCHO_BASE },
]

const formato = ref('4:5')
const dimensiones = computed(() => {
  const f = FORMATOS.find((f) => f.clave === formato.value)
  return { ancho: ANCHO_BASE, alto: f.alto }
})

// Fuentes de respaldo para navegadores sin soporte de Local Font Access API (Firefox, Safari)
const FUENTES_RESPALDO = ['Arial', 'Georgia', 'Times New Roman', 'Verdana', 'Courier New', 'Impact', 'Comic Sans MS']

const fuentesDisponibles = ref([...FUENTES_RESPALDO])
const errorFuentes = ref('')
let fuentesSistemaCargadas = false

// clave del campo-texto cuyo desplegable de fuente está abierto (null = ninguno)
const fuenteAbierta = ref(null)

async function alternarFuente(clave) {
  if (fuenteAbierta.value === clave) {
    fuenteAbierta.value = null
    return
  }

  if (!fuentesSistemaCargadas) {
    await cargarFuentesDelSistema()
  }
  fuenteAbierta.value = clave
}

async function cargarFuentesDelSistema() {
  fuentesSistemaCargadas = true

  if (!('queryLocalFonts' in window)) {
    errorFuentes.value = 'Tu navegador no permite listar las fuentes instaladas; se muestra un listado reducido.'
    return
  }

  try {
    const fuentes = await window.queryLocalFonts()
    const familias = [...new Set(fuentes.map((f) => f.family))].sort((a, b) => a.localeCompare(b))
    if (familias.length) fuentesDisponibles.value = familias
  } catch (error) {
    errorFuentes.value = 'No se pudo acceder a las fuentes del sistema; se muestra un listado reducido.'
  }
}

const etiquetas = {
  titulo: 'Título del evento',
  fecha: 'Fecha',
  lugar: 'Lugar',
  descripcion: 'Descripción (opcional)',
}

// yBase: posición vertical proporcional al alto del canvas. fontBase: tamaño de fuente proporcional al ancho.
const textos = reactive({
  titulo: { valor: 'Título del evento', bold: true, fontBase: 0.05, yBase: 0.30, tamano: 1, offsetX: 0, offsetY: 0, fuente: 'Arial' },
  fecha: { valor: '20/09/2026', bold: false, fontBase: 0.035, yBase: 0.36, tamano: 1, offsetX: 0, offsetY: 0, fuente: 'Arial' },
  lugar: { valor: 'Buenos Aires', bold: false, fontBase: 0.035, yBase: 0.40, tamano: 1, offsetX: 0, offsetY: 0, fuente: 'Arial' },
  descripcion: { valor: '', bold: false, fontBase: 0.03, yBase: 0.55, tamano: 1, offsetX: 0, offsetY: 0, fuente: 'Arial' },
})

// --- Diseño, fondo y logos (integrado desde vue-flyer-editor/FlyerEditor.vue) ---
const layout = ref('A') // 'A': círculo arriba / logo al pie — 'B': logo arriba / círculo al pie
const bgMode = ref('color') // 'color' | 'image'
const bgColor = ref('#ffffff')
const logoColor = ref('#1b2452')
const circleOpacityPct = ref(70)
const circleOpacity = computed(() => circleOpacityPct.value / 100)
const textColor = ref('#ffffff')

const bgSwatches = ['#ffffff', '#dceaf5', '#eef2e2', '#f6e6ea', '#f4ecd8', '#e7e5ee']
const logoSwatches = ['#1b2452', '#000000', '#ffffff', '#3c4470', '#b8863f', '#5c5142']
const textSwatches = ['#ffffff', '#1b2452', '#000000', '#3c4470', '#8a6d3b', '#333333']

const etiquetasLogos = {
  circulo: 'Círculo 60° aniversario',
  semana: 'Logo Semana de las Artes',
}

// Visibilidad, tamaño y posición individual de cada logo
const logos = reactive({
  circulo: { visible: true, tamano: 1, offsetX: 0, offsetY: 0 },
  semana: { visible: true, tamano: 1, offsetX: 0, offsetY: 0 },
})

function moverLogo(clave, dx, dy) {
  const l = logos[clave]
  l.offsetX += dx
  l.offsetY += dy
}

function cambiarTamanoLogo(clave, delta) {
  const l = logos[clave]
  l.tamano = Math.min(3, Math.max(0.4, +(l.tamano + delta).toFixed(2)))
}

function restablecerLogo(clave) {
  const l = logos[clave]
  l.tamano = 1
  l.offsetX = 0
  l.offsetY = 0
}

const circuloImg = new Image()
const semanaImg = new Image()
let circuloRatio = 1
let semanaRatio = 1
let logosListos = 0

function alCargarLogo() {
  logosListos++
  if (logosListos >= 2) dibujar()
}
circuloImg.onload = () => {
  circuloRatio = circuloImg.naturalWidth / circuloImg.naturalHeight
  alCargarLogo()
}
semanaImg.onload = () => {
  semanaRatio = semanaImg.naturalWidth / semanaImg.naturalHeight
  alCargarLogo()
}
circuloImg.src = circuloSrc
semanaImg.src = semanaSrc

// Recolorea un logo preservando su forma (conserva el canal alfa del PNG)
const cacheTinte = new Map()
function obtenerTintado(img, color) {
  const clave = color + '|' + img.src
  if (cacheTinte.has(clave)) return cacheTinte.get(clave)

  const off = document.createElement('canvas')
  off.width = img.naturalWidth
  off.height = img.naturalHeight
  const octx = off.getContext('2d')
  octx.drawImage(img, 0, 0)
  octx.globalCompositeOperation = 'source-atop'
  octx.fillStyle = color
  octx.fillRect(0, 0, off.width, off.height)

  cacheTinte.set(clave, off)
  return off
}

const canvasRef = ref(null)
let ctx = null
const imagenFondo = ref(null)

const descargaDeshabilitada = computed(() => bgMode.value === 'image' && !imagenFondo.value)

onMounted(() => {
  ctx = canvasRef.value.getContext('2d')
  dibujar()
})

function cambiarTamano(clave, delta) {
  const t = textos[clave]
  t.tamano = Math.min(3, Math.max(0.4, +(t.tamano + delta).toFixed(2)))
}

function mover(clave, dx, dy) {
  const t = textos[clave]
  t.offsetX += dx
  t.offsetY += dy
}

function centrarHorizontal(clave) {
  textos[clave].offsetX = 0
}

function cargarImagen(event) {
  const archivo = event.target.files[0]
  if (!archivo) return

  const url = URL.createObjectURL(archivo)
  const img = new Image()

  img.onload = () => {
    // El canvas mantiene siempre la resolución 4:3, la imagen se recorta para llenarlo sin deformarse
    imagenFondo.value = img
    dibujar()

    URL.revokeObjectURL(url) // liberamos memoria
  }

  img.src = url
}

function dibujarFondo(width, height) {
  if (bgMode.value === 'image' && imagenFondo.value) {
    // Estira la imagen para llenar todo el canvas según la relación de aspecto seleccionada, sin recortar
    ctx.drawImage(imagenFondo.value, 0, 0, width, height)
  } else {
    ctx.fillStyle = bgColor.value
    ctx.fillRect(0, 0, width, height)
  }
}

function dibujarLogos(width, height) {
  const circuloTintado = obtenerTintado(circuloImg, logoColor.value)
  const semanaTintado = obtenerTintado(semanaImg, logoColor.value)

  if (layout.value === 'A') {
    if (logos.circulo.visible) {
      const cW = width * 0.20625 * logos.circulo.tamano
      const cH = cW / circuloRatio
      const cX = width - width * 0.04375 - cW + logos.circulo.offsetX
      const cY = height * 0.05 + logos.circulo.offsetY
      ctx.save()
      ctx.globalAlpha = circleOpacity.value
      ctx.drawImage(circuloTintado, cX, cY, cW, cH)
      ctx.restore()
    }
    if (logos.semana.visible) {
      const sW = width * 0.29375 * logos.semana.tamano
      const sH = sW / semanaRatio
      const sX = (width - sW) / 2 + logos.semana.offsetX
      const sY = height - height * 0.05 - sH + logos.semana.offsetY
      ctx.drawImage(semanaTintado, sX, sY, sW, sH)
    }
  } else {
    if (logos.semana.visible) {
      const sW = width * 0.4 * logos.semana.tamano
      const sH = sW / semanaRatio
      const sX = (width - sW) / 2 + logos.semana.offsetX
      const sY = height * 0.04583 + logos.semana.offsetY
      ctx.drawImage(semanaTintado, sX, sY, sW, sH)
    }
    if (logos.circulo.visible) {
      const cW = width * 0.18125 * logos.circulo.tamano
      const cH = cW / circuloRatio
      const cX = width - width * 0.04375 - cW + logos.circulo.offsetX
      const cY = height - height * 0.04583 - cH + logos.circulo.offsetY
      ctx.save()
      ctx.globalAlpha = circleOpacity.value
      ctx.drawImage(circuloTintado, cX, cY, cW, cH)
      ctx.restore()
    }
  }
}

function dibujarTextos(width, height) {
  ctx.fillStyle = textColor.value
  ctx.textAlign = 'center'

  for (const clave in textos) {
    const t = textos[clave]
    if (!t.valor.trim()) continue // texto vacío: no se dibuja

    const tamanoFuente = width * t.fontBase * t.tamano
    const alturaLinea = tamanoFuente * 1.2
    const lineas = t.valor.split('\n')
    const yInicio = height * t.yBase + t.offsetY - (alturaLinea * (lineas.length - 1)) / 2

    ctx.font = `${t.bold ? 'bold ' : ''}${tamanoFuente}px ${t.fuente}`
    lineas.forEach((linea, i) => {
      ctx.fillText(linea, width / 2 + t.offsetX, yInicio + i * alturaLinea)
    })
  }
}

function dibujar() {
  if (!ctx) return

  const { width, height } = canvasRef.value
  ctx.clearRect(0, 0, width, height)

  dibujarFondo(width, height)
  if (logosListos >= 2) dibujarLogos(width, height)
  dibujarTextos(width, height)
}

watch([layout, bgMode, bgColor, logoColor, circleOpacityPct, textColor, logos, textos], dibujar, { deep: true })

// El cambio de ancho/alto del <canvas> se aplica al DOM en el próximo tick; recién ahí se puede redibujar
watch(formato, () => nextTick(dibujar))

function descargar() {
  const link = document.createElement('a')
  link.download = 'flyer.png'
  link.href = canvasRef.value.toDataURL('image/png')
  link.click()
}
</script>

<style scoped>
.editor {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  align-items: flex-start;
}

.controles {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-width: 260px;
}

.seccion {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.75rem;
}

.seccion h3 {
  margin: 0;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #666;
}

.opciones {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.opciones button {
  flex: 1;
  padding: 0.4rem 0.5rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: #f5f5f5;
  cursor: pointer;
  font-size: 0.85rem;
}

.opciones button.activo {
  border-color: #1b2452;
  background: #dde1ef;
  color: #1b2452;
}

.selector-color {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.swatch {
  width: 1.6rem;
  height: 1.6rem;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 0 0 1px #ccc;
  cursor: pointer;
  padding: 0;
}

.swatch.activo {
  box-shadow: 0 0 0 2px #1b2452;
}

.selector-color input[type='color'] {
  width: 1.8rem;
  height: 1.8rem;
  padding: 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
}

.bloque-logo {
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.fila-logo {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.9rem;
}

.campo-slider {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
}

.campo-slider input[type='range'] {
  flex: 1;
}

.campo-imagen,
.campo-texto {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.campo-texto {
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
}

.campo-texto-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.btn-fuente {
  cursor: pointer;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #f5f5f5;
  line-height: 1;
  padding: 0.2rem 0.4rem;
}

.campo-texto select {
  cursor: pointer;
  width: 100%;
}

.campo-texto textarea {
  resize: vertical;
  font-family: inherit;
}

.aviso-fuentes {
  font-size: 0.75rem;
  color: #b45309;
  margin: 0.25rem 0 0;
}

.ajustes {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  flex-wrap: wrap;
}

.ajustes-titulo {
  font-size: 0.8rem;
  color: #666;
  margin-right: 0.15rem;
}

.ajustes button {
  width: 2rem;
  height: 2rem;
  line-height: 1;
  cursor: pointer;
}

canvas {
  max-width: 100%;
  height: auto;
  border: 1px solid #ccc;
}
</style>
