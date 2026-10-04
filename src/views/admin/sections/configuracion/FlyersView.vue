<template>
  <div class="editor">
    <div class="controles">

      <section class="seccion">
        <button type="button" class="seccion-header" @click="alternarSeccion('formato')">
          <h3>Formato</h3>
          <span class="chevron" :class="{ colapsado: !secciones.formato }">▾</span>
        </button>
        <div v-show="secciones.formato" class="seccion-body">
          <div class="opciones">
            <button
              type="button"
              v-for="f in FORMATOS"
              :key="f.clave"
              :class="{ activo: formato === f.clave }"
              @click="formato = f.clave"
            >{{ f.etiqueta }}</button>
          </div>
        </div>
      </section>

      <section class="seccion">
        <button type="button" class="seccion-header" @click="alternarSeccion('fondo')">
          <h3>Fondo</h3>
          <span class="chevron" :class="{ colapsado: !secciones.fondo }">▾</span>
        </button>
        <div v-show="secciones.fondo" class="seccion-body">
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
        </div>
      </section>

      <section class="seccion">
        <button type="button" class="seccion-header" @click="alternarSeccion('logos')">
          <h3>Logos</h3>
          <span class="chevron" :class="{ colapsado: !secciones.logos }">▾</span>
        </button>
        <div v-show="secciones.logos" class="seccion-body">
          <div class="bloque-logo" v-for="(l, clave) in logos" :key="clave">
            <label class="fila-logo">
              <input type="checkbox" v-model="l.visible" />
              {{ etiquetasLogos[clave] }}
            </label>

            <div class="ajustes">
              <span class="ajustes-titulo">Tamaño</span>
              <button type="button" @click="cambiarTamano(l, -PASO_TAMANO)">−</button>
              <button type="button" @click="cambiarTamano(l, PASO_TAMANO)">+</button>
              <button type="button" title="Centrar horizontalmente" @click="centrarHorizontal(l)">↔</button>
            </div>
            <p class="ajustes-hint">Arrastrá el logo directamente sobre el lienzo para moverlo.</p>

            <div class="ajustes-fondo-logo">
              <span class="ajustes-titulo">Fondo ({{ clave === 'circulo' ? 'circular' : 'rectangular' }})</span>
              <div class="opciones">
                <button type="button" :class="{ activo: l.bgMode === 'transparent' }" @click="l.bgMode = 'transparent'">Transparente</button>
                <button type="button" :class="{ activo: l.bgMode === 'color' }" @click="l.bgMode = 'color'">Color</button>
              </div>

              <template v-if="l.bgMode === 'color'">
                <div class="selector-color">
                  <button
                    v-for="c in logoBgSwatches"
                    :key="c"
                    type="button"
                    class="swatch"
                    :class="{ activo: l.bgColor === c }"
                    :style="{ background: c, boxShadow: c === '#ffffff' ? '0 0 0 1px #ccc' : undefined }"
                    @click="l.bgColor = c"
                  />
                  <input type="color" v-model="l.bgColor" title="Color de fondo del logo" />
                </div>

                <div class="campo-slider">
                  <label>Opacidad del fondo</label>
                  <input type="range" min="0" max="100" v-model.number="l.bgOpacityPct" />
                  <span>{{ l.bgOpacityPct }}%</span>
                </div>

                <div class="campo-slider">
                  <label>Difuminado del borde</label>
                  <input type="range" min="0" max="60" v-model.number="l.bgFeatherPct" />
                  <span>{{ l.bgFeatherPct }}%</span>
                </div>
              </template>
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
        </div>
      </section>

      <section class="seccion">
        <button type="button" class="seccion-header" @click="alternarSeccion('colorTexto')">
          <h3>Color de texto</h3>
          <span class="chevron" :class="{ colapsado: !secciones.colorTexto }">▾</span>
        </button>
        <div v-show="secciones.colorTexto" class="seccion-body">
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
        </div>
      </section>

      <section class="seccion">
        <button type="button" class="seccion-header" @click="alternarSeccion('contenido')">
          <h3>Contenido</h3>
          <span class="chevron" :class="{ colapsado: !secciones.contenido }">▾</span>
        </button>
        <div v-show="secciones.contenido" class="seccion-body">
          <div class="campo-texto" v-for="(t, index) in textos" :key="t.id">
            <div class="campo-texto-header">
              <label>Texto {{ index + 1 }}</label>
              <div class="campo-texto-acciones">
                <button type="button" class="btn-fuente" title="Elegir fuente" @click="alternarFuente(t.id)">🔤</button>
                <button type="button" class="btn-quitar-texto" title="Quitar texto" @click="eliminarTexto(t.id)">🗑</button>
              </div>
            </div>
            <textarea v-model="t.valor" rows="2" placeholder="Escribí el texto..."></textarea>

            <div v-if="fuenteAbierta === t.id">
              <select v-model="t.fuente" :style="{ fontFamily: `${t.fuente}, sans-serif` }">
                <option v-for="f in fuentesDisponibles" :key="f" :value="f" :style="{ fontFamily: `${f}, sans-serif` }">{{ f }}</option>
              </select>
              <p v-if="errorFuentes" class="aviso-fuentes">{{ errorFuentes }}</p>
            </div>

            <div class="ajustes">
              <span class="ajustes-titulo">Tamaño</span>
              <button type="button" @click="cambiarTamano(t, -PASO_TAMANO)">−</button>
              <button type="button" @click="cambiarTamano(t, PASO_TAMANO)">+</button>
              <button type="button" title="Centrar horizontalmente" @click="centrarHorizontal(t)">↔</button>
            </div>

            <div class="opciones">
              <button type="button" :class="{ activo: t.align === 'left' }" @click="t.align = 'left'">Izq</button>
              <button type="button" :class="{ activo: t.align === 'center' }" @click="t.align = 'center'">Centro</button>
              <button type="button" :class="{ activo: t.align === 'right' }" @click="t.align = 'right'">Der</button>
            </div>

            <p class="ajustes-hint">Arrastrá el texto directamente sobre el lienzo para moverlo.</p>
          </div>

          <button type="button" class="btn-agregar-texto" @click="agregarTexto">+ Agregar texto</button>
        </div>
      </section>

      <button class="btn-descargar" @click="descargar" :disabled="descargaDeshabilitada">Descargar flyer</button>
    </div>

    <div class="lienzo-panel">
      <div class="zoom-controles">
        <button type="button" @click="alejarZoom" title="Alejar">−</button>
        <span class="zoom-valor">{{ zoom }}%</span>
        <button type="button" @click="acercarZoom" title="Acercar">+</button>
        <button type="button" @click="restablecerZoom" title="Ajustar al 100%">Ajustar</button>
      </div>
      <div class="lienzo-scroll">
        <canvas
          ref="canvasRef"
          :width="dimensiones.ancho"
          :height="dimensiones.alto"
          :style="{ width: zoom + '%', maxWidth: zoom <= 100 ? '100%' : 'none' }"
          @mousedown="onCanvasMouseDown"
          @mousemove="onCanvasMouseMoveHover"
          @mouseleave="onCanvasMouseLeave"
        ></canvas>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, watch, onMounted, nextTick } from 'vue'
import circuloSrc from '@/assets/flyers/circulo-60-aniversario.png'
import semanaSrc from '@/assets/flyers/logo-semana-de-las-artes.png'

const PASO_TAMANO = 0.1

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

// Colapsado/expandido de cada sección del panel izquierdo
const secciones = reactive({
  formato: true,
  fondo: true,
  logos: true,
  colorTexto: true,
  contenido: true,
})

function alternarSeccion(clave) {
  secciones[clave] = !secciones[clave]
}

// Zoom visual del canvas: solo cambia el tamaño en pantalla, no la resolución ni la relación de aspecto
const PASO_ZOOM = 10
const ZOOM_MIN = 25
const ZOOM_MAX = 200
const zoom = ref(100)

function acercarZoom() {
  zoom.value = Math.min(ZOOM_MAX, zoom.value + PASO_ZOOM)
}

function alejarZoom() {
  zoom.value = Math.max(ZOOM_MIN, zoom.value - PASO_ZOOM)
}

function restablecerZoom() {
  zoom.value = 100
}

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

// Listado libre de textos: cada uno mantiene tamaño, fuente, alineación y posición (drag/drop) propios.
// yBase: posición vertical proporcional al alto del canvas. fontBase: tamaño de fuente proporcional al ancho.
let idSeqTextos = 0
function crearTexto(valorInicial, overrides = {}) {
  idSeqTextos += 1
  return {
    id: idSeqTextos,
    valor: valorInicial,
    fontBase: 0.04,
    yBase: 0.3,
    tamano: 1,
    offsetX: 0,
    offsetY: 0,
    fuente: 'Arial',
    align: 'center',
    ...overrides,
  }
}

const textos = reactive([
  crearTexto('Título del evento', { fontBase: 0.05, yBase: 0.30 }),
  crearTexto('20/09/2026', { fontBase: 0.035, yBase: 0.36 }),
  crearTexto('Buenos Aires', { fontBase: 0.035, yBase: 0.40 }),
])

// yBase escalonado para que los textos nuevos no queden apilados uno sobre otro por defecto.
function agregarTexto() {
  const yBase = 0.3 + ((textos.length * 0.08) % 0.6)
  textos.push(crearTexto('Nuevo texto', { yBase }))
}

function eliminarTexto(id) {
  const indice = textos.findIndex((t) => t.id === id)
  if (indice !== -1) textos.splice(indice, 1)
}

// --- Fondo y logos (integrado desde vue-flyer-editor/FlyerEditor.vue) ---
const bgMode = ref('color') // 'color' | 'image'
const bgColor = ref('#ffffff')
const logoColor = ref('#1b2452')
const circleOpacityPct = ref(70)
const circleOpacity = computed(() => circleOpacityPct.value / 100)
const textColor = ref('#ffffff')

const bgSwatches = ['#ffffff', '#dceaf5', '#eef2e2', '#f6e6ea', '#f4ecd8', '#e7e5ee']
const logoSwatches = ['#1b2452', '#000000', '#ffffff', '#3c4470', '#b8863f', '#5c5142']
const textSwatches = ['#ffffff', '#1b2452', '#000000', '#3c4470', '#8a6d3b', '#333333']
const logoBgSwatches = ['#ffffff', '#000000', '#1b2452', '#dceaf5', '#f6e6ea', '#f4ecd8']

const etiquetasLogos = {
  circulo: 'Círculo 60° aniversario',
  semana: 'Logo Semana de las Artes',
}

// Visibilidad, tamaño, posición y fondo individual de cada logo.
// bgMode: 'transparent' | 'color'. El fondo del círculo se dibuja circular, el de "semana" rectangular.
const logos = reactive({
  circulo: { visible: true, tamano: 1, offsetX: 0, offsetY: 0, bgMode: 'transparent', bgColor: '#ffffff', bgOpacityPct: 100, bgFeatherPct: 30 },
  semana: { visible: true, tamano: 1, offsetX: 0, offsetY: 0, bgMode: 'transparent', bgColor: '#ffffff', bgOpacityPct: 100, bgFeatherPct: 30 },
})

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

// Misma función para textos y logos: reciben el ítem directamente (ambos son objetos
// reactivos con .tamano/.offsetX), así que no hace falta distinguir de qué colección vienen.
function cambiarTamano(item, delta) {
  item.tamano = Math.min(3, Math.max(0.4, +(item.tamano + delta).toFixed(2)))
}

// Centra horizontalmente un elemento (logo o texto) respecto al lienzo completo.
function centrarHorizontal(item) {
  const { width, height } = canvasRef.value
  // El offsetX de cada ítem se suma linealmente (coeficiente 1) a la posición base de su caja,
  // sea cual sea esa base (el centro del lienzo para "semana"/textos, o el margen derecho para
  // "circulo"). Por eso centrar de verdad requiere medir la caja actual y corregir la diferencia,
  // en vez de solo poner offsetX = 0 (que solo devuelve al ítem a su anclaje de diseño original).
  let caja
  if (item === logos.circulo) caja = obtenerCajaLogo('circulo', width, height)
  else if (item === logos.semana) caja = obtenerCajaLogo('semana', width, height)
  else caja = obtenerCajaTexto(item, width, height)

  const centroActual = caja.x + caja.w / 2
  item.offsetX += width / 2 - centroActual
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

// Dibuja el fondo de un logo detrás de su imagen: circular para "circulo", rectangular para "semana".
// Su opacidad es independiente del deslizador de opacidad del círculo (que solo afecta al logo).
// difuminado (0 a 1): fracción del radio/mitad de lado que se dedica a difuminar el borde hacia
// opacity 0. Se logra dibujando la forma más chica y aplicándole un blur del mismo tamaño: el blur
// expande el borde hacia afuera hasta el tamaño original, dejando el centro sólido intacto.
function dibujarFondoLogo(forma, x, y, w, h, color, opacidad, difuminado) {
  const cx = x + w / 2
  const cy = y + h / 2
  const dimensionBase = forma === 'circulo' ? Math.max(w, h) / 2 : Math.min(w, h) / 2
  const feather = dimensionBase * difuminado

  ctx.save()
  ctx.globalAlpha = opacidad
  ctx.fillStyle = color
  ctx.filter = feather > 0.5 ? `blur(${feather}px)` : 'none'

  if (forma === 'circulo') {
    const radio = Math.max((Math.max(w, h) / 2) * 1.15 - feather, 0)
    ctx.beginPath()
    ctx.arc(cx, cy, radio, 0, Math.PI * 2)
    ctx.fill()
  } else {
    const padX = w * 0.12
    const padY = h * 0.12
    ctx.fillRect(
      x - padX + feather,
      y - padY + feather,
      Math.max(w + padX * 2 - feather * 2, 0),
      Math.max(h + padY * 2 - feather * 2, 0)
    )
  }
  ctx.restore()
}

// Caja (x, y, w, h) de un logo en coordenadas del canvas. La misma función se usa
// para dibujar y para detectar sobre qué logo se hizo click al arrastrar.
function obtenerCajaLogo(clave, width, height) {
  if (clave === 'circulo') {
    const cW = width * 0.20625 * logos.circulo.tamano
    const cH = cW / circuloRatio
    const cX = width - width * 0.04375 - cW + logos.circulo.offsetX
    const cY = height * 0.05 + logos.circulo.offsetY
    return { x: cX, y: cY, w: cW, h: cH }
  }
  const sW = width * 0.29375 * logos.semana.tamano
  const sH = sW / semanaRatio
  const sX = (width - sW) / 2 + logos.semana.offsetX
  const sY = height - height * 0.05 - sH + logos.semana.offsetY
  return { x: sX, y: sY, w: sW, h: sH }
}

function dibujarLogos(width, height) {
  const circuloTintado = obtenerTintado(circuloImg, logoColor.value)
  const semanaTintado = obtenerTintado(semanaImg, logoColor.value)

  if (logos.circulo.visible) {
    const { x: cX, y: cY, w: cW, h: cH } = obtenerCajaLogo('circulo', width, height)
    if (logos.circulo.bgMode === 'color') dibujarFondoLogo('circulo', cX, cY, cW, cH, logos.circulo.bgColor, logos.circulo.bgOpacityPct / 100, logos.circulo.bgFeatherPct / 100)
    ctx.save()
    ctx.globalAlpha = circleOpacity.value
    ctx.drawImage(circuloTintado, cX, cY, cW, cH)
    ctx.restore()
  }
  if (logos.semana.visible) {
    const { x: sX, y: sY, w: sW, h: sH } = obtenerCajaLogo('semana', width, height)
    if (logos.semana.bgMode === 'color') dibujarFondoLogo('rect', sX, sY, sW, sH, logos.semana.bgColor, logos.semana.bgOpacityPct / 100, logos.semana.bgFeatherPct / 100)
    ctx.drawImage(semanaTintado, sX, sY, sW, sH)
  }
}

// Caja (x, y, w, h) de un texto en coordenadas del canvas, usada para detectar el arrastre.
// Requiere ctx.font igual al usado al dibujar, por eso lo fija antes de medir.
function obtenerCajaTexto(t, width, height) {
  const tamanoFuente = width * t.fontBase * t.tamano
  const alturaLinea = tamanoFuente * 1.2
  const lineas = t.valor.split('\n')
  const yInicio = height * t.yBase + t.offsetY - (alturaLinea * (lineas.length - 1)) / 2

  ctx.font = `${tamanoFuente}px ${t.fuente}`
  const anchoMaximo = Math.max(...lineas.map((linea) => ctx.measureText(linea).width))
  const anchorX = width / 2 + t.offsetX
  const x = t.align === 'left' ? anchorX : t.align === 'right' ? anchorX - anchoMaximo : anchorX - anchoMaximo / 2

  return {
    x,
    y: yInicio - tamanoFuente * 0.8, // aproxima el ascenso de la primera línea
    w: anchoMaximo,
    h: alturaLinea * lineas.length,
  }
}

// --- Drag & drop de logos y textos sobre el lienzo ---
// arrastre guarda una referencia directa al ítem (logo o texto): ambos son objetos
// reactivos con .offsetX/.offsetY, así que no hace falta distinguir su tipo.
let arrastre = null // { item, startX, startY, startOffsetX, startOffsetY }

// Convierte coordenadas del mouse (CSS px) a coordenadas del canvas (resolución real),
// para que el drag funcione igual con cualquier zoom o ancho responsivo.
function coordenadasCanvas(event) {
  const rect = canvasRef.value.getBoundingClientRect()
  const escalaX = canvasRef.value.width / rect.width
  const escalaY = canvasRef.value.height / rect.height
  return {
    x: (event.clientX - rect.left) * escalaX,
    y: (event.clientY - rect.top) * escalaY,
  }
}

function elementoEnPunto(x, y) {
  const { width, height } = canvasRef.value
  // Los textos se dibujan encima de los logos: se testean primero, en orden inverso al de dibujo
  // (el último de la lista es el que queda arriba visualmente si se superponen).
  for (let i = textos.length - 1; i >= 0; i--) {
    const t = textos[i]
    if (!t.valor.trim()) continue
    const caja = obtenerCajaTexto(t, width, height)
    if (x >= caja.x && x <= caja.x + caja.w && y >= caja.y && y <= caja.y + caja.h) return t
  }
  // Orden inverso al de dibujo de logos: "semana" se dibuja último y queda arriba visualmente.
  for (const clave of ['semana', 'circulo']) {
    if (!logos[clave].visible) continue
    const caja = obtenerCajaLogo(clave, width, height)
    if (x >= caja.x && x <= caja.x + caja.w && y >= caja.y && y <= caja.y + caja.h) return logos[clave]
  }
  return null
}

function onCanvasMouseDown(event) {
  const { x, y } = coordenadasCanvas(event)
  const item = elementoEnPunto(x, y)
  if (!item) return

  event.preventDefault()
  arrastre = {
    item,
    startX: x,
    startY: y,
    startOffsetX: item.offsetX,
    startOffsetY: item.offsetY,
  }
  canvasRef.value.style.cursor = 'grabbing'
  window.addEventListener('mousemove', onWindowMouseMoveDrag)
  window.addEventListener('mouseup', onWindowMouseUpDrag)
}

function onWindowMouseMoveDrag(event) {
  if (!arrastre) return
  if (event.buttons === 0) { // el botón se soltó fuera de la ventana
    onWindowMouseUpDrag()
    return
  }
  const { x, y } = coordenadasCanvas(event)
  arrastre.item.offsetX = arrastre.startOffsetX + (x - arrastre.startX)
  arrastre.item.offsetY = arrastre.startOffsetY + (y - arrastre.startY)
}

function onWindowMouseUpDrag() {
  arrastre = null
  if (canvasRef.value) canvasRef.value.style.cursor = 'default'
  window.removeEventListener('mousemove', onWindowMouseMoveDrag)
  window.removeEventListener('mouseup', onWindowMouseUpDrag)
}

// Cambia el cursor a "grab" al pasar sobre un elemento arrastrable, fuera de un drag activo.
function onCanvasMouseMoveHover(event) {
  if (arrastre) return
  const { x, y } = coordenadasCanvas(event)
  canvasRef.value.style.cursor = elementoEnPunto(x, y) ? 'grab' : 'default'
}

function onCanvasMouseLeave() {
  if (arrastre) return
  canvasRef.value.style.cursor = 'default'
}

function dibujarTextos(width, height) {
  ctx.fillStyle = textColor.value

  for (const t of textos) {
    if (!t.valor.trim()) continue // texto vacío: no se dibuja

    const tamanoFuente = width * t.fontBase * t.tamano
    const alturaLinea = tamanoFuente * 1.2
    const lineas = t.valor.split('\n')
    const yInicio = height * t.yBase + t.offsetY - (alturaLinea * (lineas.length - 1)) / 2

    ctx.font = `${tamanoFuente}px ${t.fuente}`
    ctx.textAlign = t.align
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

watch([bgMode, bgColor, logoColor, circleOpacityPct, textColor, logos, textos], dibujar, { deep: true })

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
  border-bottom: 1px solid #eee;
  padding-bottom: 0.75rem;
}

.seccion-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  text-align: left;
}

.seccion h3 {
  margin: 0;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #666;
}

.chevron {
  font-size: 0.75rem;
  color: #999;
  transition: transform 0.15s ease;
}

.chevron.colapsado {
  transform: rotate(-90deg);
}

.seccion-body {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.opciones {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.opciones button,
.ajustes button,
.btn-fuente,
.btn-quitar-texto,
.btn-descargar,
input[type='file']::file-selector-button,
input[type='file']::-webkit-file-upload-button {
  border: 1px solid #ccc;
  border-radius: 6px;
  background: #f5f5f5;
  cursor: pointer;
  font-size: 0.85rem;
}

.opciones button,
.btn-descargar {
  flex: 1;
  padding: 0.4rem 0.5rem;
}

.opciones button.activo {
  border-color: #1b2452;
  background: #dde1ef;
  color: #1b2452;
}

.btn-descargar:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

input[type='file']::file-selector-button,
input[type='file']::-webkit-file-upload-button {
  padding: 0.4rem 0.5rem;
  margin-right: 0.5rem;
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

.ajustes-fondo-logo {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.ajustes-hint {
  font-size: 0.75rem;
  color: #888;
  margin: 0;
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

.campo-texto-acciones {
  display: flex;
  gap: 0.3rem;
}

.btn-fuente,
.btn-quitar-texto {
  line-height: 1;
  padding: 0.2rem 0.4rem;
}

.btn-agregar-texto {
  border: 1px dashed #bbb;
  border-radius: 6px;
  background: none;
  color: #666;
  cursor: pointer;
  font-size: 0.85rem;
  padding: 0.5rem;
}

.btn-agregar-texto:hover {
  border-color: #1b2452;
  color: #1b2452;
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
  padding: 0;
  line-height: 1;
}

.lienzo-panel {
  flex: 1;
  min-width: 280px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.zoom-controles {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.zoom-controles button {
  border: 1px solid #ccc;
  border-radius: 6px;
  background: #f5f5f5;
  cursor: pointer;
  font-size: 0.85rem;
  padding: 0.3rem 0.6rem;
}

.zoom-valor {
  font-size: 0.85rem;
  color: #666;
  min-width: 3rem;
  text-align: center;
}

.lienzo-scroll {
  overflow: auto;
  max-height: 80vh;
  background: #fafafa;
  border: 1px solid #ccc;
  border-radius: 6px;
}

canvas {
  display: block;
  height: auto;
}
</style>
