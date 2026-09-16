<template>
  <div class="flyer-editor">
    <aside class="panel">

      <section class="section">
        <h2>Diseño</h2>
        <div class="layout-choice">
          <button
            class="layout-card"
            :class="{ active: layout === 'A' }"
            type="button"
            @click="layout = 'A'"
          >
            <svg viewBox="0 0 100 75">
              <rect x="1" y="1" width="98" height="73" rx="3" fill="var(--paper)" stroke="var(--line)" />
              <circle cx="80" cy="16" r="11" fill="none" stroke="var(--accent)" stroke-width="2" />
              <rect x="30" y="55" width="40" height="10" rx="2" fill="var(--accent)" />
              <line x1="20" y1="30" x2="80" y2="30" stroke="var(--line)" stroke-width="2" />
              <line x1="20" y1="38" x2="80" y2="38" stroke="var(--line)" stroke-width="2" />
            </svg>
            <span>Círculo arriba · logo al pie</span>
          </button>

          <button
            class="layout-card"
            :class="{ active: layout === 'B' }"
            type="button"
            @click="layout = 'B'"
          >
            <svg viewBox="0 0 100 75">
              <rect x="1" y="1" width="98" height="73" rx="3" fill="var(--paper)" stroke="var(--line)" />
              <rect x="25" y="6" width="50" height="12" rx="2" fill="var(--accent)" />
              <circle cx="80" cy="60" r="11" fill="none" stroke="var(--accent)" stroke-width="2" />
              <line x1="20" y1="34" x2="80" y2="34" stroke="var(--line)" stroke-width="2" />
              <line x1="20" y1="42" x2="80" y2="42" stroke="var(--line)" stroke-width="2" />
            </svg>
            <span>Logo como título · círculo al pie</span>
          </button>
        </div>
      </section>

      <section class="section">
        <h2>Fondo</h2>
        <div class="toggle-row">
          <button
            class="toggle-btn"
            :class="{ active: bgMode === 'color' }"
            type="button"
            @click="bgMode = 'color'"
          >Color</button>
          <button
            class="toggle-btn"
            :class="{ active: bgMode === 'image' }"
            type="button"
            @click="bgMode = 'image'"
          >Imagen propia</button>
        </div>

        <div v-if="bgMode === 'color'" style="margin-top:12px;">
          <div class="swatches">
            <button
              v-for="c in bgSwatches"
              :key="c"
              class="swatch"
              type="button"
              :class="{ active: bgColor === c }"
              :style="{ background: c, boxShadow: c === '#ffffff' ? '0 0 0 1px var(--line)' : undefined }"
              @click="bgColor = c"
            />
          </div>
          <div class="colorline">
            <input type="color" v-model="bgColor">
            <span>Color personalizado</span>
          </div>
        </div>

        <div v-else style="margin-top:12px;">
          <input type="file" accept="image/png, image/jpeg" @change="onBgImageChange">
          <p class="hint" style="text-align:left; margin-top:8px;">
            Se recorta para cubrir todo el flyer (4:3). Elegí una imagen con zonas simples donde vayan el título y el texto.
          </p>
        </div>
      </section>

      <section class="section">
        <h2>Color de los logos</h2>
        <div class="swatches">
          <button
            v-for="c in logoSwatches"
            :key="c"
            class="swatch"
            type="button"
            :class="{ active: logoColor === c }"
            :style="{ background: c, boxShadow: c === '#ffffff' ? '0 0 0 1px var(--line)' : undefined }"
            @click="logoColor = c"
          />
        </div>
        <div class="colorline">
          <input type="color" v-model="logoColor">
          <span>Personalizado</span>
        </div>
        <p class="hint" style="text-align:left; margin-top:8px;">
          Recolorea ambos logos manteniendo su forma. Usá blanco o un tono claro si elegís un fondo oscuro.
        </p>

        <div class="field" style="margin-top:14px;">
          <label>Opacidad del círculo de aniversario</label>
          <div class="slider-row">
            <input type="range" min="30" max="100" v-model.number="circleOpacityPct">
            <span class="val">{{ circleOpacityPct }}%</span>
          </div>
        </div>
      </section>

      <section class="section">
        <h2>Color del texto informativo</h2>
        <div class="swatches">
          <button
            v-for="c in textSwatches"
            :key="c"
            class="swatch"
            type="button"
            :class="{ active: textColor === c }"
            :style="{ background: c, boxShadow: c === '#ffffff' ? '0 0 0 1px var(--line)' : undefined }"
            @click="textColor = c"
          />
        </div>
        <div class="colorline">
          <input type="color" v-model="textColor">
          <span>Personalizado</span>
        </div>
      </section>

      <section class="section">
        <h2>Contenido</h2>
        <div class="field">
          <label>Título del evento</label>
          <input type="text" v-model="fields.titulo">
        </div>
        <div class="field">
          <label>Bajada / subtítulo (opcional)</label>
          <input type="text" v-model="fields.subtitulo">
        </div>
        <div class="row2">
          <div class="field">
            <label>Fecha</label>
            <input type="text" v-model="fields.fecha">
          </div>
          <div class="field">
            <label>Hora</label>
            <input type="text" v-model="fields.hora">
          </div>
        </div>
        <div class="field">
          <label>Lugar</label>
          <input type="text" v-model="fields.lugar">
        </div>
        <div class="field">
          <label>Texto adicional (opcional)</label>
          <textarea v-model="fields.extra"></textarea>
        </div>
      </section>

      <button class="btn-primary" type="button" @click="download">Descargar flyer (PNG)</button>
      <button class="btn-secondary" type="button" @click="resetAll">Restablecer valores</button>
    </aside>

    <main class="stage">
      <div class="canvas-wrap">
        <canvas ref="canvasRef" width="1600" height="1200"></canvas>
      </div>
      <p class="hint">Formato <strong>4:3</strong>, listo para redes e impresión. Todo se genera en el navegador de quien lo usa.</p>
    </main>
  </div>
</template>

<script setup>
/**
 * FlyerEditor.vue
 * Editor en vivo de flyers para el Conservatorio Juan José Castro / Semana de las Artes.
 * Requiere Vue 3. Las dos imágenes base van en src/assets junto a este componente
 * (o ajustá las rutas de import más abajo si las ubicás en otro lado).
 *
 * Fuentes: el diseño usa 'Cormorant Garamond' (títulos) e 'Inter' (texto de UI e info).
 * Si tu proyecto no las carga globalmente, agregá en tu index.html o CSS global:
 *   https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Inter:wght@400;500;600;700&display=swap
 */
import { ref, reactive, computed, onMounted, watch, nextTick } from 'vue'
import circuloSrc from './assets/circulo-60-aniversario.png'
import semanaSrc from './assets/logo-semana-de-las-artes.png'

const canvasRef = ref(null)
let ctx = null
const W = 1600
const H = 1200

const layout = ref('A') // 'A' | 'B'
const bgMode = ref('color') // 'color' | 'image'
const bgColor = ref('#ffffff')
const logoColor = ref('#1b2452')
const textColor = ref('#1b2452')
const circleOpacityPct = ref(70)
const circleOpacity = computed(() => circleOpacityPct.value / 100)

const bgSwatches = ['#ffffff', '#dceaf5', '#eef2e2', '#f6e6ea', '#f4ecd8', '#e7e5ee']
const logoSwatches = ['#1b2452', '#000000', '#ffffff', '#3c4470', '#b8863f', '#5c5142']
const textSwatches = ['#1b2452', '#000000', '#ffffff', '#3c4470', '#8a6d3b', '#333333']

const defaultFields = {
  titulo: 'Concierto de Piano',
  subtitulo: 'Alumnos avanzados del Conservatorio',
  fecha: 'Viernes 9 de octubre',
  hora: '19:00 hs',
  lugar: 'Salón Auditorio — Conservatorio Juan José Castro',
  extra: 'Entrada libre y gratuita',
}
const fields = reactive({ ...defaultFields })

const circuloImg = new Image()
const semanaImg = new Image()
let circuloRatio = 1
let semanaRatio = 1
let imagesReady = 0
let userBgImg = null

function handleImgLoad() {
  imagesReady++
  if (imagesReady >= 2) redraw()
}
circuloImg.onload = () => {
  circuloRatio = circuloImg.naturalWidth / circuloImg.naturalHeight
  handleImgLoad()
}
semanaImg.onload = () => {
  semanaRatio = semanaImg.naturalWidth / semanaImg.naturalHeight
  handleImgLoad()
}
circuloImg.src = circuloSrc
semanaImg.src = semanaSrc

// --- recolor helper: preserves the logo's alpha shape, fills it with a flat color ---
const tintCache = new Map()
function getTinted(img, color) {
  const key = color + '|' + img.src
  if (tintCache.has(key)) return tintCache.get(key)
  const off = document.createElement('canvas')
  off.width = img.naturalWidth
  off.height = img.naturalHeight
  const octx = off.getContext('2d')
  octx.drawImage(img, 0, 0)
  octx.globalCompositeOperation = 'source-atop'
  octx.fillStyle = color
  octx.fillRect(0, 0, off.width, off.height)
  tintCache.set(key, off)
  return off
}

function wrapText(text, maxWidth) {
  const words = text.split(/\s+/).filter(Boolean)
  const lines = []
  let line = ''
  for (const w of words) {
    const test = line ? line + ' ' + w : w
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line)
      line = w
    } else {
      line = test
    }
  }
  if (line) lines.push(line)
  return lines
}

function drawCover(img, x, y, w, h) {
  const ir = img.naturalWidth / img.naturalHeight
  const tr = w / h
  let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight
  if (ir > tr) {
    sw = img.naturalHeight * tr
    sx = (img.naturalWidth - sw) / 2
  } else {
    sh = img.naturalWidth / tr
    sy = (img.naturalHeight - sh) / 2
  }
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h)
}

function onBgImageChange(e) {
  const file = e.target.files && e.target.files[0]
  if (!file) return
  const url = URL.createObjectURL(file)
  const img = new Image()
  img.onload = () => {
    userBgImg = img
    URL.revokeObjectURL(url)
    redraw()
  }
  img.src = url
}

function redraw() {
  if (!ctx || imagesReady < 2) return
  ctx.clearRect(0, 0, W, H)

  // background
  if (bgMode.value === 'image' && userBgImg) {
    drawCover(userBgImg, 0, 0, W, H)
  } else {
    ctx.fillStyle = bgColor.value
    ctx.fillRect(0, 0, W, H)
  }

  const circuloTinted = getTinted(circuloImg, logoColor.value)
  const semanaTinted = getTinted(semanaImg, logoColor.value)

  const marginX = 130
  let textTop, textBottom

  if (layout.value === 'A') {
    const cW = 330, cH = cW / circuloRatio
    const cX = W - 70 - cW, cY = 60
    ctx.save()
    ctx.globalAlpha = circleOpacity.value
    ctx.drawImage(circuloTinted, cX, cY, cW, cH)
    ctx.restore()

    const sW = 470, sH = sW / semanaRatio
    const sX = (W - sW) / 2, sY = H - 60 - sH
    ctx.drawImage(semanaTinted, sX, sY, sW, sH)

    textTop = cY + cH + 50
    textBottom = sY - 40
  } else {
    const sW = 640, sH = sW / semanaRatio
    const sX = (W - sW) / 2, sY = 55
    ctx.drawImage(semanaTinted, sX, sY, sW, sH)

    const cW = 290, cH = cW / circuloRatio
    const cX = W - 70 - cW, cY = H - 55 - cH
    ctx.save()
    ctx.globalAlpha = circleOpacity.value
    ctx.drawImage(circuloTinted, cX, cY, cW, cH)
    ctx.restore()

    textTop = sY + sH + 45
    textBottom = cY - 35
  }

  // --- free text zone, vertically centered within [textTop, textBottom] ---
  ctx.textAlign = 'center'
  ctx.fillStyle = textColor.value

  const maxTextWidth = W - marginX * 2
  const blocks = []

  if (fields.titulo.trim()) {
    ctx.font = "600 56px 'Cormorant Garamond', serif"
    blocks.push({ lines: wrapText(fields.titulo.trim(), maxTextWidth), lineHeight: 64, gapAfter: 14, font: ctx.font })
  }
  if (fields.subtitulo.trim()) {
    ctx.font = "italic 500 26px 'Cormorant Garamond', serif"
    blocks.push({ lines: wrapText(fields.subtitulo.trim(), maxTextWidth), lineHeight: 34, gapAfter: 30, font: ctx.font })
  }
  const metaLine = [fields.fecha.trim(), fields.hora.trim(), fields.lugar.trim()].filter(Boolean).join('   ·   ')
  if (metaLine) {
    ctx.font = "600 24px 'Inter', sans-serif"
    blocks.push({ lines: wrapText(metaLine, maxTextWidth), lineHeight: 34, gapAfter: 22, font: ctx.font })
  }
  if (fields.extra.trim()) {
    ctx.font = "400 20px 'Inter', sans-serif"
    const lines = fields.extra.trim().split('\n').flatMap(p => wrapText(p, maxTextWidth))
    blocks.push({ lines, lineHeight: 28, gapAfter: 0, font: ctx.font })
  }

  const totalHeight = blocks.reduce((sum, b) => sum + b.lines.length * b.lineHeight + b.gapAfter, 0)
  let cursorY = textTop + Math.max(0, ((textBottom - textTop) - totalHeight) / 2)

  blocks.forEach(b => {
    ctx.font = b.font
    b.lines.forEach(line => {
      cursorY += b.lineHeight
      ctx.fillText(line, W / 2, cursorY - b.lineHeight * 0.28)
    })
    cursorY += b.gapAfter
  })
}

function download() {
  const canvas = canvasRef.value
  if (!canvas) return
  const link = document.createElement('a')
  const nombre = (fields.titulo.trim() || 'flyer')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  link.download = (nombre || 'flyer') + '.png'
  link.href = canvas.toDataURL('image/png')
  link.click()
}

function resetAll() {
  Object.assign(fields, defaultFields)
  layout.value = 'A'
  bgMode.value = 'color'
  bgColor.value = '#ffffff'
  logoColor.value = '#1b2452'
  textColor.value = '#1b2452'
  circleOpacityPct.value = 70
  userBgImg = null
  nextTick(redraw)
}

onMounted(() => {
  ctx = canvasRef.value.getContext('2d')
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(redraw)
  }
  redraw()
})

watch(
  [layout, bgMode, bgColor, logoColor, textColor, circleOpacityPct, fields],
  redraw,
  { deep: true }
)
</script>

<style scoped>
.flyer-editor {
  --ink: #1b2452;
  --ink-soft: #3c4470;
  --paper: #faf8f4;
  --panel: #ffffff;
  --line: #e4e0d6;
  --accent: #b8863f;
  --accent-soft: #e9dcc3;
  --muted: #8b8676;
  --bg-app: #f2efe7;
  --shadow: 0 1px 2px rgba(27, 36, 82, .06), 0 8px 24px rgba(27, 36, 82, .08);
  --radius: 14px;

  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 28px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px 24px 60px;
  background: var(--bg-app);
  color: var(--ink);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}
@media (max-width: 900px) {
  .flyer-editor { grid-template-columns: 1fr; padding: 20px 16px 48px; }
}

.panel {
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 22px;
  align-self: start;
  position: sticky;
  top: 20px;
  max-height: calc(100vh - 40px);
  overflow-y: auto;
}
.section { margin-bottom: 22px; }
.section:last-child { margin-bottom: 0; }
.section h2 {
  font-size: 11.5px;
  text-transform: uppercase;
  letter-spacing: .09em;
  color: var(--muted);
  font-weight: 600;
  margin: 0 0 12px;
}
.field { margin-bottom: 12px; }
.field label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 6px;
  color: var(--ink-soft);
}
.field input[type="text"], .field textarea {
  width: 100%;
  padding: 9px 11px;
  border: 1px solid var(--line);
  border-radius: 9px;
  background: var(--paper);
  color: var(--ink);
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  resize: vertical;
  box-sizing: border-box;
}
.field textarea { min-height: 56px; line-height: 1.4; }
.field input:focus, .field textarea:focus {
  outline: 2px solid var(--accent);
  outline-offset: 1px;
}
.row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

.layout-choice { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.layout-card {
  border: 1.5px solid var(--line);
  border-radius: 11px;
  padding: 8px;
  cursor: pointer;
  background: var(--paper);
  text-align: center;
  transition: border-color .15s ease;
}
.layout-card.active { border-color: var(--accent); background: var(--accent-soft); }
.layout-card svg { width: 100%; height: auto; display: block; margin-bottom: 6px; }
.layout-card span { font-size: 12px; font-weight: 500; color: var(--ink-soft); }

.swatches { display: flex; flex-wrap: wrap; gap: 8px; }
.swatch {
  width: 30px; height: 30px; border-radius: 50%;
  border: 2px solid var(--panel);
  box-shadow: 0 0 0 1px var(--line);
  cursor: pointer;
  padding: 0;
}
.swatch.active { box-shadow: 0 0 0 2px var(--accent); }

.colorline { display: flex; align-items: center; gap: 10px; margin-top: 8px; }
.colorline input[type="color"] {
  width: 34px; height: 34px; padding: 0; border: 1px solid var(--line);
  border-radius: 8px; background: none; cursor: pointer;
}
.colorline span { font-size: 12.5px; color: var(--muted); }

.slider-row { display: flex; align-items: center; gap: 10px; }
.slider-row input[type=range] { flex: 1; accent-color: var(--accent); }
.slider-row .val { font-size: 12.5px; color: var(--muted); width: 34px; text-align: right; }

.toggle-row { display: flex; gap: 8px; }
.toggle-btn {
  flex: 1;
  padding: 8px 6px;
  border: 1px solid var(--line);
  background: var(--paper);
  color: var(--ink-soft);
  border-radius: 9px;
  font-size: 12.5px;
  font-weight: 500;
  cursor: pointer;
  text-align: center;
}
.toggle-btn.active { border-color: var(--accent); background: var(--accent-soft); color: var(--ink); }

input[type="file"] { width: 100%; font-size: 12.5px; color: var(--muted); }

.btn-primary {
  width: 100%;
  padding: 13px;
  background: var(--ink);
  color: var(--paper);
  border: none;
  border-radius: 10px;
  font-size: 14.5px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 4px;
}
.btn-primary:hover { background: var(--ink-soft); }
.btn-secondary {
  width: 100%;
  padding: 10px;
  background: none;
  color: var(--ink-soft);
  border: 1px solid var(--line);
  border-radius: 10px;
  font-size: 13px;
  cursor: pointer;
  margin-top: 8px;
}

.stage { display: flex; flex-direction: column; align-items: center; gap: 16px; }
.canvas-wrap {
  width: 100%;
  max-width: 900px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: var(--shadow);
  border: 1px solid var(--line);
  background: #fff;
}
canvas { display: block; width: 100%; height: auto; }
.hint { font-size: 12.5px; color: var(--muted); max-width: 620px; text-align: center; line-height: 1.5; }
</style>
