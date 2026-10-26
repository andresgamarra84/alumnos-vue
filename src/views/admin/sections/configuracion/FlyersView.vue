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
        <button type="button" class="seccion-header" @click="alternarSeccion('plantilla')">
          <h3>Plantilla</h3>
          <span class="chevron" :class="{ colapsado: !secciones.plantilla }">▾</span>
        </button>
        <div v-show="secciones.plantilla" class="seccion-body">
          <div class="opciones">
            <button
              type="button"
              v-for="p in PLANTILLAS"
              :key="p.clave"
              :class="{ activo: plantilla === p.clave }"
              @click="plantilla = p.clave"
            >{{ p.etiqueta }}</button>
          </div>

          <template v-if="plantilla !== 'libre'">
            <label class="campo-imagen">
              Imagen principal (PNG o JPG)
              <input type="file" accept="image/png, image/jpeg" @change="cargarImagenPrincipal" />
            </label>

            <div class="campo-slider">
              <label>Área de imagen</label>
              <input type="range" min="35" max="75" v-model.number="proporcionImagenPct" />
              <span>{{ proporcionImagenPct }}%</span>
            </div>

            <span class="ajustes-titulo">Borde de la imagen</span>
            <div class="campo-slider">
              <label>Recto</label>
              <input type="range" min="0" max="100" v-model.number="nivelRasgadoPct" title="De recto a rasgado" />
              <label>Rasgado</label>
            </div>
            <button
              type="button"
              class="btn-agregar-texto"
              :disabled="nivelRasgadoPct === 0"
              title="Sortea una nueva forma para el borde rasgado"
              @click="nuevoRasgado"
            >Nuevo rasgado</button>

            <div class="campo-slider">
              <label>Inclinación</label>
              <input type="range" min="-100" max="100" v-model.number="inclinacionPct" @dblclick="inclinacionPct = 0" />
              <span>{{ inclinacionPct }}%</span>
            </div>
            <p class="ajustes-hint">
              {{ plantilla === 'vertical'
                ? 'Negativo: la línea se corre a la izquierda al descender. Positivo: a la derecha.'
                : 'Negativo: la línea sube hacia la derecha. Positivo: baja hacia la derecha.' }}
              Doble click para volver a 0.
            </p>

            <div class="campo-slider">
              <label>Curvatura</label>
              <input type="range" min="-100" max="100" v-model.number="curvaturaPct" @dblclick="curvaturaPct = 0" />
              <span>{{ curvaturaPct }}%</span>
            </div>
            <p class="ajustes-hint">
              {{ plantilla === 'vertical'
                ? 'En 0 el corte es recto. Negativo: se curva hacia la izquierda. Positivo: hacia la derecha.'
                : 'En 0 el corte es recto. Negativo: se curva hacia arriba. Positivo: hacia abajo.' }}
              Doble click para volver a 0.
            </p>

            <div class="campo-slider">
              <label>Definido</label>
              <input type="range" min="0" max="100" v-model.number="desvanecidoPct" title="De borde definido a difuminado" />
              <label>Difuminado</label>
            </div>
            <p class="ajustes-hint">
              En "Definido" la línea de corte es nítida. Hacia "Difuminado" la imagen se funde gradualmente con el fondo.
            </p>

            <p class="ajustes-hint">
              La imagen se recorta para llenar su área sin deformarse; arrastrala sobre el lienzo para elegir qué parte se ve. El área de información usa el color o la
              imagen de "Fondo", y los textos nuevos se ubican dentro de ella.
            </p>
          </template>
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
          <h3>Logos e imágenes</h3>
          <span class="chevron" :class="{ colapsado: !secciones.logos }">▾</span>
        </button>
        <div v-show="secciones.logos" class="seccion-body">
          <div class="bloque-logo" v-for="l in logos" :key="l.id">
            <div class="campo-texto-header">
              <label class="fila-logo">
                <input type="checkbox" v-model="l.visible" />
                <span class="nombre-logo" :title="l.nombre">{{ l.nombre }}</span>
              </label>
              <button type="button" class="btn-quitar-texto" title="Quitar imagen" @click="eliminarLogo(l.id)">🗑</button>
            </div>

            <div class="ajustes-fondo-logo">
              <span class="ajustes-titulo">Color</span>
              <div class="opciones">
                <button type="button" :class="{ activo: !l.tintar }" @click="l.tintar = false">Original</button>
                <button type="button" :class="{ activo: l.tintar }" @click="l.tintar = true">Recolorear</button>
              </div>
              <div v-if="l.tintar" class="selector-color">
                <button
                  v-for="c in logoSwatches"
                  :key="c"
                  type="button"
                  class="swatch"
                  :class="{ activo: l.color === c }"
                  :style="{ background: c, boxShadow: c === '#ffffff' ? '0 0 0 1px #ccc' : undefined }"
                  @click="l.color = c"
                />
                <input type="color" v-model="l.color" title="Color personalizado de la imagen" />
              </div>
            </div>

            <div class="campo-slider">
              <label>Opacidad</label>
              <input type="range" min="5" max="100" v-model.number="l.opacidadPct" />
              <span>{{ l.opacidadPct }}%</span>
            </div>

            <div class="ajustes">
              <span class="ajustes-titulo">Tamaño</span>
              <button type="button" @click="cambiarTamano(l, -PASO_TAMANO)">−</button>
              <button type="button" @click="cambiarTamano(l, PASO_TAMANO)">+</button>
              <button type="button" title="Centrar horizontalmente" @click="centrarHorizontal(l)">↔</button>
            </div>
            <p class="ajustes-hint">Arrastrá la imagen directamente sobre el lienzo para moverla.</p>

            <div class="ajustes-fondo-logo">
              <span class="ajustes-titulo">Fondo</span>
              <div class="opciones">
                <button type="button" :class="{ activo: l.bgMode === 'transparent' }" @click="l.bgMode = 'transparent'">Transparente</button>
                <button type="button" :class="{ activo: l.bgMode === 'color' }" @click="l.bgMode = 'color'">Color</button>
              </div>

              <template v-if="l.bgMode === 'color'">
                <div class="opciones">
                  <button type="button" :class="{ activo: l.bgForma === 'circulo' }" @click="l.bgForma = 'circulo'">Circular</button>
                  <button type="button" :class="{ activo: l.bgForma === 'rect' }" @click="l.bgForma = 'rect'">Rectangular</button>
                </div>

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

          <label class="btn-agregar-texto btn-agregar-logo">
            + Agregar imagen PNG
            <input type="file" accept="image/png" multiple hidden @change="cargarLogos" />
          </label>
          <p class="ajustes-hint">Usá PNG con fondo transparente para logos o marcas de agua.</p>
          <p v-if="errorLogos" class="aviso-fuentes">{{ errorLogos }}</p>
        </div>
      </section>

      <section class="seccion">
        <button type="button" class="seccion-header" @click="alternarSeccion('iconos')">
          <h3>Íconos</h3>
          <span class="chevron" :class="{ colapsado: !secciones.iconos }">▾</span>
        </button>
        <div v-show="secciones.iconos" class="seccion-body">
          <div class="grilla-iconos">
            <button
              v-for="ic in ICONOS"
              :key="ic.clave"
              type="button"
              class="btn-icono"
              :title="'Agregar ' + ic.etiqueta"
              @click="agregarIcono(ic)"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true"><path :d="ic.d" fill="currentColor" /></svg>
              <span>{{ ic.etiqueta }}</span>
            </button>
          </div>
          <label class="btn-agregar-texto btn-agregar-logo">
            + Agregar SVG propio
            <input type="file" accept="image/svg+xml,.svg" multiple hidden @change="cargarLogos" />
          </label>
          <p class="ajustes-hint">
            Los íconos se agregan a "Logos e imágenes", donde podés recolorearlos, cambiar su tamaño y moverlos sobre el lienzo.
          </p>
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

            <div class="selector-color">
              <span class="ajustes-titulo">Color</span>
              <button
                v-for="c in textSwatches"
                :key="c"
                type="button"
                class="swatch"
                :class="{ activo: t.color === c }"
                :style="{ background: c, boxShadow: c === '#ffffff' ? '0 0 0 1px #ccc' : undefined }"
                @click="t.color = c"
              />
              <input type="color" v-model="t.color" title="Color de texto personalizado" />
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

      <section class="seccion">
        <button type="button" class="seccion-header" @click="alternarSeccion('especificacion')">
          <h3>Flyers guardados / JSON</h3>
          <span class="chevron" :class="{ colapsado: !secciones.especificacion }">▾</span>
        </button>
        <div v-show="secciones.especificacion" class="seccion-body">
          <div class="campo-texto">
            <label>Flyers guardados</label>
            <select v-model="flyerSeleccionado" @change="cargarFlyerGuardado">
              <option :value="null">— Elegí un flyer para cargarlo —</option>
              <option v-for="f in flyersGuardados" :key="f.codigo" :value="f.codigo">{{ f.titulo }}</option>
            </select>
          </div>

          <div class="campo-texto">
            <label>Título del flyer</label>
            <input type="text" v-model="tituloFlyer" maxlength="150" placeholder="Ej: Concierto de cuerdas - Octubre" />
          </div>
          <div class="opciones">
            <button type="button" :disabled="!tituloFlyer.trim() || guardandoFlyer" @click="guardarFlyer(false)">
              {{ flyerSeleccionado ? 'Guardar como nuevo' : 'Guardar' }}
            </button>
            <button v-if="flyerSeleccionado" type="button" :disabled="!tituloFlyer.trim() || guardandoFlyer" @click="guardarFlyer(true)">Actualizar</button>
            <button v-if="flyerSeleccionado" type="button" class="btn-quitar-texto" @click="eliminarFlyerGuardado">Eliminar</button>
          </div>

          <span class="ajustes-titulo">Cargar desde JSON</span>
          <textarea v-model="textoSpec" rows="5" class="texto-spec" placeholder="Pegá acá la especificación del flyer en JSON..."></textarea>
          <div class="opciones">
            <button type="button" :disabled="!textoSpec.trim()" @click="aplicarTextoSpec">Aplicar JSON</button>
            <label class="btn-agregar-texto btn-agregar-logo">
              Abrir archivo .json
              <input type="file" accept="application/json,.json" hidden @change="cargarArchivoSpec" />
            </label>
          </div>
          <p v-if="errorSpec" class="aviso-fuentes aviso-multilinea">{{ errorSpec }}</p>
          <p v-if="avisoSpec" class="ajustes-hint">{{ avisoSpec }}</p>
          <p v-if="creditoImagen" class="ajustes-hint">
            Crédito de la foto: {{ [creditoImagen.autor, creditoImagen.licencia].filter(Boolean).join(' · ') }}
            <template v-if="creditoImagen.fuente"> — {{ creditoImagen.fuente }}</template>
          </p>
          <p class="ajustes-hint">Aplicar un JSON reemplaza todo el flyer actual (textos, íconos, imagen y ajustes).</p>
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
import { reactive, ref, shallowRef, computed, watch, onMounted, nextTick } from 'vue'
import { api } from '@/api/api'
import { showModal, showToast } from '@/services/uiBus'
import { ICONOS, VERSION_SPEC, urlSvgIcono, validarEspecificacion } from '@/domain/flyerSpec'

const PASO_TAMANO = 0.1
const FACTOR_TAMANO_LOGO = 1.2 // cada click en +/− escala un logo o ícono un 20 %
const TAMANO_MIN_LOGO = 0.05

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

// Plantillas: "libre" no reserva áreas; "horizontal" pone la imagen principal arriba y la información
// debajo; "vertical" pone la imagen a la izquierda y la información a la derecha.
// El área de información no se dibuja aparte: es el fondo (color o imagen) que queda visible.
const PLANTILLAS = [
  { clave: 'libre', etiqueta: 'Libre' },
  { clave: 'horizontal', etiqueta: 'Imagen arriba' },
  { clave: 'vertical', etiqueta: 'Imagen al costado' },
]

const plantilla = ref('libre')
const proporcionImagenPct = ref(60) // fracción del alto (horizontal) o del ancho (vertical) para la imagen
const inclinacionPct = ref(0) // -100 a 100
const curvaturaPct = ref(0) // -100 a 100: 0 = recto, el signo indica hacia qué lado se arquea
const nivelRasgadoPct = ref(40) // 0 (recto) a 100 (muy ondulado)
const desvanecidoPct = ref(0) // 0 (borde nítido) a 100 (imagen que se funde con el fondo)
const imagenPrincipal = shallowRef(null)
// Desplazamiento de la imagen principal dentro de su área (drag/drop). Se limita para que la
// imagen siempre cubra el área completa: solo se puede mover lo que sobresale del recorte.
const encuadre = reactive({ offsetX: 0, offsetY: 0 })

// Colapsado/expandido de cada sección del panel izquierdo
const secciones = reactive({
  formato: true,
  plantilla: true,
  fondo: true,
  logos: true,
  iconos: true,
  contenido: true,
  especificacion: true,
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

// Listado libre de textos: cada uno mantiene tamaño, fuente, color, alineación y posición (drag/drop) propios.
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
    color: '#1b2452',
    ...overrides,
  }
}

const textos = reactive([])

// yBase escalonado para que los textos nuevos no queden apilados uno sobre otro por defecto.
// Con una plantilla activa, el texto nuevo se ubica dentro del área de información.
function agregarTexto() {
  const n = textos.length
  const p = proporcionImagenPct.value / 100

  if (plantilla.value === 'horizontal') {
    const rango = Math.max(1 - p - 0.12, 0.06)
    textos.push(crearTexto('Nuevo texto', { yBase: p + 0.08 + ((n * 0.06) % rango) }))
  } else if (plantilla.value === 'vertical') {
    // offsetX desplaza el ancla (centro del lienzo) hasta el centro del panel derecho
    const centroPanel = ((p + 1) / 2) * ANCHO_BASE
    textos.push(crearTexto('Nuevo texto', {
      yBase: 0.12 + ((n * 0.08) % 0.76),
      offsetX: centroPanel - ANCHO_BASE / 2,
      fontBase: 0.035,
    }))
  } else {
    textos.push(crearTexto('Nuevo texto', { yBase: 0.3 + ((n * 0.08) % 0.6) }))
  }
}

function eliminarTexto(id) {
  const indice = textos.findIndex((t) => t.id === id)
  if (indice !== -1) textos.splice(indice, 1)
}

// --- Fondo y logos (integrado desde vue-flyer-editor/FlyerEditor.vue) ---
const bgMode = ref('color') // 'color' | 'image'
const bgColor = ref('#ffffff')

const bgSwatches = ['#ffffff', '#dceaf5', '#eef2e2', '#f6e6ea', '#f4ecd8', '#e7e5ee']
const logoSwatches = ['#1b2452', '#000000', '#ffffff', '#3c4470', '#b8863f', '#5c5142']
const textSwatches = ['#ffffff', '#1b2452', '#000000', '#3c4470', '#8a6d3b', '#333333']
const logoBgSwatches = ['#ffffff', '#000000', '#1b2452', '#dceaf5', '#f6e6ea', '#f4ecd8']

// Listado libre de imágenes PNG (logos o marcas de agua) cargadas por el usuario.
// Cada una tiene visibilidad, color (original o recoloreada), opacidad, tamaño, posición y fondo propios.
// bgMode: 'transparent' | 'color'. bgForma: 'circulo' | 'rect'.
// Los objetos Image no se guardan en el estado reactivo: viven en imagenesLogos, indexados por id.
const logos = reactive([])
const imagenesLogos = new Map()
const errorLogos = ref('')
let idSeqLogos = 0

function crearLogo(nombre, ratio) {
  idSeqLogos += 1
  return {
    id: idSeqLogos,
    nombre,
    ratio,
    claveIcono: null, // clave del set de íconos si salió de ahí (para exportar la especificación)
    visible: true,
    tintar: false,
    color: '#1b2452',
    opacidadPct: 100,
    tamano: 1,
    // Escalonado para que las imágenes nuevas no queden apiladas una sobre otra por defecto.
    offsetX: 0,
    offsetY: (logos.length * 40) % 400,
    bgMode: 'transparent',
    bgForma: 'rect',
    bgColor: '#ffffff',
    bgOpacityPct: 100,
    bgFeatherPct: 30,
  }
}

// Agrega una imagen (URL o blob) a la lista de logos una vez cargada. opciones pisa los valores por defecto.
function agregarLogoDesdeUrl(url, nombre, opciones = {}, alTerminar = () => {}) {
  const img = new Image()
  img.onload = () => {
    // Un SVG sin width/height puede reportar 0 en algunos navegadores: se asume cuadrado
    const ratio = img.naturalWidth && img.naturalHeight ? img.naturalWidth / img.naturalHeight : 1
    const logo = Object.assign(crearLogo(nombre, ratio), opciones)
    imagenesLogos.set(logo.id, img)
    logos.push(logo)
    alTerminar()
  }
  img.onerror = () => {
    errorLogos.value = `No se pudo leer "${nombre}".`
    alTerminar()
  }
  img.src = url
}

function cargarLogos(event) {
  errorLogos.value = ''
  const archivos = [...event.target.files]
  event.target.value = '' // permite volver a elegir el mismo archivo

  for (const archivo of archivos) {
    const esSvg = archivo.type === 'image/svg+xml'
    if (archivo.type !== 'image/png' && !esSvg) {
      errorLogos.value = `"${archivo.name}" no es un PNG ni un SVG y no se agregó.`
      continue
    }

    const url = URL.createObjectURL(archivo)
    // Los SVG se agregan recoloreables (suelen ser íconos de un solo color) y chicos
    agregarLogoDesdeUrl(
      url,
      archivo.name.replace(/\.(png|svg)$/i, ''),
      esSvg ? { tintar: true, tamano: 0.15 } : {},
      () => URL.revokeObjectURL(url)
    )
  }
}

function agregarIcono(icono) {
  errorLogos.value = ''
  agregarLogoDesdeUrl(urlSvgIcono(icono), icono.etiqueta, { tintar: true, tamano: 0.15, claveIcono: icono.clave })
}

function eliminarLogo(id) {
  const indice = logos.findIndex((l) => l.id === id)
  if (indice !== -1) logos.splice(indice, 1)
  imagenesLogos.delete(id)
  cacheTinte.delete(id)
}

// Recolorea una imagen preservando su forma (conserva el canal alfa del PNG).
// Se guarda un único tintado por imagen (el del último color usado) para no acumular
// un canvas por cada color que se prueba con el selector.
const cacheTinte = new Map() // id -> { color, canvas }
function obtenerTintado(id, img, color) {
  const enCache = cacheTinte.get(id)
  if (enCache && enCache.color === color) return enCache.canvas

  const off = document.createElement('canvas')
  off.width = img.naturalWidth
  off.height = img.naturalHeight
  const octx = off.getContext('2d')
  octx.drawImage(img, 0, 0)
  octx.globalCompositeOperation = 'source-atop'
  octx.fillStyle = color
  octx.fillRect(0, 0, off.width, off.height)

  cacheTinte.set(id, { color, canvas: off })
  return off
}

const canvasRef = ref(null)
let ctx = null
const imagenFondo = ref(null)

const descargaDeshabilitada = computed(
  () => (bgMode.value === 'image' && !imagenFondo.value) || (plantilla.value !== 'libre' && !imagenPrincipal.value)
)

onMounted(() => {
  ctx = canvasRef.value.getContext('2d')
  dibujar()
})

// Misma función para textos y logos: reciben el ítem directamente (ambos son objetos
// reactivos con .tamano/.offsetX), así que no hace falta distinguir de qué colección vienen.
function cambiarTamano(item, delta) {
  if (logos.includes(item)) {
    // Imágenes e íconos: paso proporcional, para poder achicar un ícono chico sin saltar a un mínimo alto
    const nuevo = delta > 0 ? item.tamano * FACTOR_TAMANO_LOGO : item.tamano / FACTOR_TAMANO_LOGO
    item.tamano = Math.min(3, Math.max(TAMANO_MIN_LOGO, +nuevo.toFixed(3)))
    return
  }
  item.tamano = Math.min(3, Math.max(0.4, +(item.tamano + delta).toFixed(2)))
}

// Centra horizontalmente un elemento (logo o texto) respecto al lienzo completo.
function centrarHorizontal(item) {
  const { width, height } = canvasRef.value
  // El offsetX de cada ítem se suma linealmente (coeficiente 1) a la posición base de su caja,
  // sea cual sea esa base. Por eso centrar de verdad requiere medir la caja actual y corregir la
  // diferencia, en vez de solo poner offsetX = 0 (que solo devuelve al ítem a su anclaje original).
  const caja = logos.includes(item) ? obtenerCajaLogo(item, width, height) : obtenerCajaTexto(item, width, height)

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
    urlImagenFondo = null
    dibujar()

    URL.revokeObjectURL(url) // liberamos memoria
  }

  img.src = url
}

function cargarImagenPrincipal(event) {
  const archivo = event.target.files[0]
  if (!archivo) return

  const url = URL.createObjectURL(archivo)
  const img = new Image()
  img.onload = () => {
    imagenPrincipal.value = img
    urlImagenPrincipal = null
    creditoImagen.value = null
    encuadre.offsetX = 0
    encuadre.offsetY = 0
    URL.revokeObjectURL(url)
  }
  img.src = url
}

// Área (x, y, w, h) que ocupa la imagen principal según la plantilla activa.
function zonaImagen(width, height) {
  const p = proporcionImagenPct.value / 100
  if (plantilla.value === 'horizontal') return { x: 0, y: 0, w: width, h: height * p }
  return { x: 0, y: 0, w: width * p, h: height }
}

// Pseudoaleatorio (0 a 1) a partir de una semilla. La semilla se sortea al abrir el editor y con el
// botón "Nuevo rasgado": fuera de eso no cambia (ni al mover sliders ni al redibujar).
let semillaRasgado = 0
let faseOnda = 0
let frecuenciaOnda = 0

function sortearRasgado() {
  semillaRasgado = Math.random() * 1000
  faseOnda = Math.random() * Math.PI * 2
  frecuenciaOnda = 4 + Math.random() * 3
}
sortearRasgado()

function nuevoRasgado() {
  sortearRasgado()
  dibujar()
}

function rugosidad(i) {
  const s = Math.sin((i + semillaRasgado) * 12.9898) * 43758.5453
  return s - Math.floor(s)
}

// Desplazamiento máximo del borde por inclinación (a ±100%): una fracción de la dimensión
// perpendicular al borde, para que la diagonal nunca se coma toda el área de imagen o de información.
function desplazamientoInclinacion(width, height) {
  const max = plantilla.value === 'vertical' ? width * 0.25 : height * 0.15
  return (inclinacionPct.value / 100) * max
}

// Flecha máxima del arco (a ±100%), con el mismo criterio que la inclinación.
function flechaCurvatura(width, height) {
  const max = plantilla.value === 'vertical' ? width * 0.2 : height * 0.12
  return (curvaturaPct.value / 100) * max
}

// Amplitud del borde rasgado según el nivel elegido (0 = recto, 100 = muy ondulado).
function amplitudRasgado(width, height) {
  return Math.min(width, height) * 0.03 * (nivelRasgadoPct.value / 100)
}

// Posición del borde (perpendicular a él) en el punto t (0 a 1) a lo largo del borde, relativa a su
// posición base. Suma la inclinación (recta que va de -d/2 a +d/2), la curvatura (arco de flecha c) y el rasgado (una onda suave
// más picos irregulares, ambos escalados por amp; con amp = 0 el borde queda recto).
function desvioBorde(t, i, { d, c, amp }) {
  const inclinacion = (t - 0.5) * d
  const curva = Math.sin(t * Math.PI) * c // 0 en los extremos, c en el medio
  const onda = Math.sin(t * Math.PI * frecuenciaOnda + faseOnda) * 0.5 + (rugosidad(i) - 0.5)
  return inclinacion + curva + onda * amp
}

// Desviación estándar (px) del difuminado del corte. Es una fracción de la dimensión perpendicular
// al borde, para que a 100% el degradé sea amplio pero no se coma toda el área de imagen.
function sigmaDesvanecido(width, height) {
  const dimension = plantilla.value === 'vertical' ? width : height
  return dimension * 0.08 * (desvanecidoPct.value / 100)
}

// Traza el contorno del área de imagen. El lado que da al área de información puede ir inclinado
// curvado y/o rasgado; si es una recta alcanza con un solo segmento.
// margen: prolonga el contorno hacia afuera del lienzo por los otros tres lados (para que el
// difuminado de la máscara no clarée también en los bordes del lienzo).
function trazarZonaImagen(z, width, height, borde, margen = 0, c = ctx) {
  const pasos = borde.amp > 0 || borde.c !== 0 ? 60 : 1
  const m = margen
  c.beginPath()
  if (plantilla.value === 'horizontal') {
    // El borde va de izquierda a derecha: con inclinación positiva baja hacia la derecha
    c.moveTo(-m, -m)
    c.lineTo(width + m, -m)
    if (m) c.lineTo(width + m, z.h + desvioBorde(1, pasos, borde))
    for (let i = pasos; i >= 0; i--) c.lineTo((width * i) / pasos, z.h + desvioBorde(i / pasos, i, borde))
    if (m) c.lineTo(-m, z.h + desvioBorde(0, 0, borde))
  } else {
    // El borde va de arriba hacia abajo: con inclinación positiva se corre a la derecha al descender
    c.moveTo(-m, -m)
    if (m) c.lineTo(z.w + desvioBorde(0, 0, borde), -m)
    for (let i = 0; i <= pasos; i++) c.lineTo(z.w + desvioBorde(i / pasos, i, borde), (height * i) / pasos)
    if (m) c.lineTo(z.w + desvioBorde(1, pasos, borde), height + m)
    c.lineTo(-m, height + m)
  }
  c.closePath()
}

// Dibuja img cubriendo por completo la caja (recorta lo que sobra, sin deformar).
// Tamaño (dw, dh) con el que img cubre por completo una caja de w × h.
function medidasCubriendo(img, w, h) {
  const escala = Math.max(w / img.naturalWidth, h / img.naturalHeight)
  return { dw: img.naturalWidth * escala, dh: img.naturalHeight * escala }
}

// Mantiene el encuadre dentro del margen que sobresale de la caja (sin dejar huecos).
function limitarEncuadre(width, height) {
  if (!imagenPrincipal.value) return
  const { w, h } = cajaImagenPrincipal(width, height)
  const { dw, dh } = medidasCubriendo(imagenPrincipal.value, w, h)
  const maxX = (dw - w) / 2
  const maxY = (dh - h) / 2
  encuadre.offsetX = Math.min(maxX, Math.max(-maxX, encuadre.offsetX))
  encuadre.offsetY = Math.min(maxY, Math.max(-maxY, encuadre.offsetY))
}

// Zona, borde y caja (w, h) que debe cubrir la imagen principal. La caja se agranda hacia el área
// de información lo máximo que puede avanzar el borde (mitad de la inclinación, arco de la curvatura y
// picos del rasgado), para que la imagen lo cubra siempre.
function cajaImagenPrincipal(width, height) {
  const z = zonaImagen(width, height)
  const borde = {
    d: desplazamientoInclinacion(width, height),
    c: flechaCurvatura(width, height),
    amp: amplitudRasgado(width, height),
  }
  // La curvatura solo agranda la caja cuando se arquea hacia el área de información (c > 0)
  // El difuminado también avanza hacia el área de información (hasta ~3 sigmas).
  const extension = Math.abs(borde.d) / 2 + Math.max(borde.c, 0) + borde.amp * 1.5 + sigmaDesvanecido(width, height) * 3
  const w = plantilla.value === 'vertical' ? z.w + extension : z.w
  const h = plantilla.value === 'horizontal' ? z.h + extension : z.h
  return { z, borde, w, h }
}

// Lienzos auxiliares (reutilizados) para fundir la imagen con el fondo: uno con la imagen y otro con la máscara.
let lienzoImagen = null
let lienzoMascara = null

function lienzoAuxiliar(actual, width, height) {
  const l = actual || document.createElement('canvas')
  if (l.width !== width) l.width = width
  if (l.height !== height) l.height = height
  const c = l.getContext('2d')
  c.setTransform(1, 0, 0, 1, 0, 0)
  c.clearRect(0, 0, width, height)
  return l
}

// Dibuja la imagen principal (o su marcador) en el contexto c, dentro de la caja que debe cubrir.
function pintarContenidoImagen(c, z, w, h, width) {
  if (imagenPrincipal.value) {
    const { dw, dh } = medidasCubriendo(imagenPrincipal.value, w, h)
    c.drawImage(
      imagenPrincipal.value,
      z.x + (w - dw) / 2 + encuadre.offsetX,
      z.y + (h - dh) / 2 + encuadre.offsetY,
      dw,
      dh
    )
  } else {
    // Marcador mientras no hay imagen cargada (la descarga queda deshabilitada)
    c.fillStyle = '#d9d9d9'
    c.fillRect(z.x, z.y, w, h)
    c.fillStyle = '#888'
    c.font = `${width * 0.03}px Arial`
    c.textAlign = 'center'
    c.fillText('Imagen principal', z.x + z.w / 2, z.y + z.h / 2)
  }
}

function dibujarImagenPrincipal(width, height) {
  // Si cambió el área (proporción, inclinación, formato), el encuadre guardado puede quedar fuera de rango
  limitarEncuadre(width, height)
  const { z, borde, w, h } = cajaImagenPrincipal(width, height)
  const sigma = sigmaDesvanecido(width, height)

  if (sigma < 0.5) {
    ctx.save()
    trazarZonaImagen(z, width, height, borde)
    ctx.clip()
    pintarContenidoImagen(ctx, z, w, h, width)
    ctx.restore()
    return
  }

  // Borde difuminado: la imagen se multiplica por una máscara (la forma del área, desenfocada).
  // La forma se prolonga fuera del lienzo para que el desenfoque solo afecte al lado del corte.
  lienzoImagen = lienzoAuxiliar(lienzoImagen, width, height)
  lienzoMascara = lienzoAuxiliar(lienzoMascara, width, height)
  const cImg = lienzoImagen.getContext('2d')
  const cMask = lienzoMascara.getContext('2d')

  pintarContenidoImagen(cImg, z, w, h, width)

  cMask.filter = `blur(${sigma}px)`
  cMask.fillStyle = '#000'
  trazarZonaImagen(z, width, height, borde, sigma * 4, cMask)
  cMask.fill()
  cMask.filter = 'none'

  cImg.globalCompositeOperation = 'destination-in'
  cImg.drawImage(lienzoMascara, 0, 0)
  cImg.globalCompositeOperation = 'source-over'

  ctx.drawImage(lienzoImagen, 0, 0)
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

// Dibuja el fondo de un logo detrás de su imagen, circular o rectangular.
// Su opacidad es independiente de la opacidad de la imagen.
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
// Por defecto cada imagen ocupa el 25% del ancho, centrada horizontalmente y cerca del borde superior.
function obtenerCajaLogo(l, width, height) {
  const w = width * 0.25 * l.tamano
  const h = w / l.ratio
  const x = (width - w) / 2 + l.offsetX
  const y = height * 0.05 + l.offsetY
  return { x, y, w, h }
}

function dibujarLogos(width, height) {
  for (const l of logos) {
    const img = imagenesLogos.get(l.id)
    if (!l.visible || !img) continue

    const { x, y, w, h } = obtenerCajaLogo(l, width, height)
    if (l.bgMode === 'color') dibujarFondoLogo(l.bgForma, x, y, w, h, l.bgColor, l.bgOpacityPct / 100, l.bgFeatherPct / 100)
    ctx.save()
    ctx.globalAlpha = l.opacidadPct / 100
    ctx.drawImage(l.tintar ? obtenerTintado(l.id, img, l.color) : img, x, y, w, h)
    ctx.restore()
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

// --- Drag & drop de logos, textos e imagen principal sobre el lienzo ---
// arrastre guarda una referencia directa al ítem (logo, texto o encuadre): todos son objetos
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
  // Mismo criterio para las imágenes: la última de la lista se dibuja arriba.
  for (let i = logos.length - 1; i >= 0; i--) {
    const l = logos[i]
    if (!l.visible) continue
    const caja = obtenerCajaLogo(l, width, height)
    if (x >= caja.x && x <= caja.x + caja.w && y >= caja.y && y <= caja.y + caja.h) return l
  }
  // Por debajo de todo, la imagen principal de la plantilla: se testea con el mismo contorno
  // (recto, inclinado o rasgado) con el que se recorta al dibujarla.
  if (plantilla.value !== 'libre' && imagenPrincipal.value) {
    const { z, borde } = cajaImagenPrincipal(width, height)
    trazarZonaImagen(z, width, height, borde)
    if (ctx.isPointInPath(x, y)) return encuadre
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
  if (arrastre.item === encuadre) limitarEncuadre(canvasRef.value.width, canvasRef.value.height)
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
  for (const t of textos) {
    if (!t.valor.trim()) continue // texto vacío: no se dibuja

    const tamanoFuente = width * t.fontBase * t.tamano
    const alturaLinea = tamanoFuente * 1.2
    const lineas = t.valor.split('\n')
    const yInicio = height * t.yBase + t.offsetY - (alturaLinea * (lineas.length - 1)) / 2

    ctx.font = `${tamanoFuente}px ${t.fuente}`
    ctx.fillStyle = t.color
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
  if (plantilla.value !== 'libre') dibujarImagenPrincipal(width, height)
  dibujarLogos(width, height)
  dibujarTextos(width, height)
}

watch(
  [bgMode, bgColor, plantilla, proporcionImagenPct, inclinacionPct, curvaturaPct, nivelRasgadoPct, desvanecidoPct, imagenPrincipal, encuadre, logos, textos],
  dibujar,
  { deep: true }
)

// El cambio de ancho/alto del <canvas> se aplica al DOM en el próximo tick; recién ahí se puede redibujar
watch(formato, () => nextTick(dibujar))

// --- Especificación JSON: aplicar un flyer completo o exportar el actual (ver src/domain/flyerSpec.js) ---
// De dónde salió cada imagen, para poder exportarla. Una imagen subida desde un archivo no tiene URL.
let urlImagenPrincipal = null
let urlImagenFondo = null
const creditoImagen = ref(null) // { autor, licencia, fuente } de la imagen cargada desde una especificación
const textoSpec = ref('')
const errorSpec = ref('')
const avisoSpec = ref('')

function cargarImagenUrl(url) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous' // sin esto el canvas queda "tainted" y no se puede descargar
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`No se pudo cargar la imagen: ${url.slice(0, 120)}`))
    img.src = url
  })
}

// Reemplaza TODO el estado del editor (formato, plantilla, imagen, bordes, fondo, textos e íconos).
// Primero valida y descarga las imágenes; si algo falla, el flyer actual queda intacto.
async function aplicarEspecificacion(raw) {
  errorSpec.value = ''
  avisoSpec.value = ''

  const { ok, errores, spec } = validarEspecificacion(raw)
  if (!ok) {
    errorSpec.value = errores.join('\n')
    return false
  }

  let imgPrincipal, imgFondo, imgsIconos
  try {
    ;[imgPrincipal, imgFondo, ...imgsIconos] = await Promise.all([
      spec.imagen.url ? cargarImagenUrl(spec.imagen.url) : null,
      spec.fondo.tipo === 'imagen' ? cargarImagenUrl(spec.fondo.url) : null,
      ...spec.iconos.map((ic) => cargarImagenUrl(urlSvgIcono(ICONOS.find((i) => i.clave === ic.icono)))),
    ])
  } catch (error) {
    errorSpec.value = error.message
    return false
  }

  formato.value = spec.formato
  plantilla.value = spec.plantilla
  proporcionImagenPct.value = spec.borde.areaPct
  nivelRasgadoPct.value = spec.borde.rasgadoPct
  inclinacionPct.value = spec.borde.inclinacionPct
  curvaturaPct.value = spec.borde.curvaturaPct
  desvanecidoPct.value = spec.borde.difuminadoPct

  bgMode.value = spec.fondo.tipo === 'imagen' ? 'image' : 'color'
  bgColor.value = spec.fondo.color
  imagenFondo.value = imgFondo
  urlImagenFondo = spec.fondo.url

  imagenPrincipal.value = imgPrincipal
  urlImagenPrincipal = spec.imagen.url
  encuadre.offsetX = spec.imagen.offsetX
  encuadre.offsetY = spec.imagen.offsetY
  creditoImagen.value =
    spec.imagen.autor || spec.imagen.licencia || spec.imagen.fuente
      ? { autor: spec.imagen.autor, licencia: spec.imagen.licencia, fuente: spec.imagen.fuente }
      : null

  fuenteAbierta.value = null
  textos.splice(0)
  for (const t of spec.textos) {
    textos.push(
      crearTexto(t.valor, { fuente: t.fuente, color: t.color, tamano: t.tamano, align: t.align, yBase: t.yBase, offsetX: t.offsetX, offsetY: t.offsetY })
    )
  }

  for (const l of [...logos]) eliminarLogo(l.id)
  spec.iconos.forEach((ic, i) => {
    const icono = ICONOS.find((x) => x.clave === ic.icono)
    const img = imgsIconos[i]
    const opciones = { tintar: true, color: ic.color, tamano: ic.tamano, opacidadPct: ic.opacidadPct, claveIcono: icono.clave }
    if (ic.offsetX !== null) opciones.offsetX = ic.offsetX
    if (ic.offsetY !== null) opciones.offsetY = ic.offsetY
    const logo = Object.assign(crearLogo(icono.etiqueta, img.naturalWidth / img.naturalHeight), opciones)
    imagenesLogos.set(logo.id, img)
    logos.push(logo)
  })

  if (spec.plantilla !== 'libre' && !spec.imagen.url) {
    avisoSpec.value = 'La plantilla necesita una imagen principal: cargala desde "Imagen principal".'
  }
  nextTick(dibujar)
  return true
}

async function aplicarTextoSpec() {
  let raw
  try {
    raw = JSON.parse(textoSpec.value)
  } catch (error) {
    errorSpec.value = 'El texto no es un JSON válido: ' + error.message
    avisoSpec.value = ''
    return
  }
  await aplicarEspecificacion(raw)
}

async function cargarArchivoSpec(event) {
  const archivo = event.target.files[0]
  event.target.value = '' // permite volver a elegir el mismo archivo
  if (!archivo) return
  textoSpec.value = await archivo.text()
  await aplicarTextoSpec()
}

function especificacionActual() {
  const redondear = (n) => Math.round(n * 100) / 100
  return {
    version: VERSION_SPEC,
    formato: formato.value,
    plantilla: plantilla.value,
    imagen: {
      url: urlImagenPrincipal,
      offsetX: redondear(encuadre.offsetX),
      offsetY: redondear(encuadre.offsetY),
      autor: creditoImagen.value?.autor ?? '',
      licencia: creditoImagen.value?.licencia ?? '',
      fuente: creditoImagen.value?.fuente ?? '',
    },
    borde: {
      areaPct: proporcionImagenPct.value,
      rasgadoPct: nivelRasgadoPct.value,
      inclinacionPct: inclinacionPct.value,
      curvaturaPct: curvaturaPct.value,
      difuminadoPct: desvanecidoPct.value,
    },
    fondo: bgMode.value === 'image' && urlImagenFondo ? { tipo: 'imagen', url: urlImagenFondo } : { tipo: 'color', color: bgColor.value },
    textos: textos.map((t) => ({
      valor: t.valor,
      fuente: t.fuente,
      color: t.color,
      tamano: t.tamano,
      align: t.align,
      yBase: redondear(t.yBase),
      offsetX: redondear(t.offsetX),
      offsetY: redondear(t.offsetY),
    })),
    iconos: logos
      .filter((l) => l.claveIcono)
      .map((l) => ({
        icono: l.claveIcono,
        color: l.color,
        tamano: l.tamano,
        opacidadPct: l.opacidadPct,
        offsetX: redondear(l.offsetX),
        offsetY: redondear(l.offsetY),
      })),
  }
}

// --- Flyers guardados en la base (tabla flyers): listado, carga, guardado y borrado lógico ---
const flyersGuardados = ref([]) // [{ codigo, titulo }]
const flyerSeleccionado = ref(null) // codigo del flyer cargado en pantalla (null = ninguno)
const tituloFlyer = ref('')
const guardandoFlyer = ref(false)

async function cargarListadoFlyers() {
  const r = await api.get({ entity: 'flyers', action: 'getFlyers' })
  if (r.ok) flyersGuardados.value = r.payload
}

async function cargarFlyerGuardado() {
  if (flyerSeleccionado.value === null) {
    tituloFlyer.value = ''
    return
  }
  const r = await api.get({ entity: 'flyers', action: 'getFlyer', payload: { codigo: flyerSeleccionado.value } })
  if (!r.ok) return

  if (await aplicarEspecificacion(r.payload.spec)) {
    tituloFlyer.value = r.payload.titulo
    textoSpec.value = JSON.stringify(r.payload.spec, null, 2)
  } else {
    showToast('No se pudo cargar el flyer: ' + errorSpec.value.split('\n')[0], 'error')
  }
}

// actualizar = true pisa el flyer seleccionado; false crea uno nuevo con el título ingresado.
async function guardarFlyer(actualizar) {
  const avisos = []
  if (!urlImagenPrincipal && plantilla.value !== 'libre') avisos.push('la imagen principal se subió desde un archivo y no tiene URL')
  if (bgMode.value === 'image' && !urlImagenFondo) avisos.push('la imagen de fondo se subió desde un archivo: se guardó el color de fondo')
  if (logos.some((l) => !l.claveIcono)) avisos.push('los logos o imágenes propias no se guardan (solo los íconos del set)')
  avisoSpec.value = avisos.length ? 'Se guardó con limitaciones: ' + avisos.join('; ') + '.' : ''

  guardandoFlyer.value = true
  try {
    const r = await api.post({
      entity: 'flyers',
      action: 'saveFlyer',
      payload: {
        codigo: actualizar ? flyerSeleccionado.value : null,
        titulo: tituloFlyer.value.trim(),
        spec: especificacionActual(),
      },
    })
    if (!r.ok) return
    showToast(actualizar ? 'Flyer actualizado' : 'Flyer guardado', 'success')
    await cargarListadoFlyers()
    flyerSeleccionado.value = r.payload
  } finally {
    guardandoFlyer.value = false
  }
}

async function eliminarFlyerGuardado() {
  const flyer = flyersGuardados.value.find((f) => f.codigo === flyerSeleccionado.value)
  if (!flyer) return
  const { ok } = await showModal(`¿Eliminar el flyer "${flyer.titulo}"? Esta acción no se puede deshacer desde el panel.`, 1)
  if (!ok) return

  const r = await api.post({ entity: 'flyers', action: 'delFlyer', payload: { codigo: flyer.codigo } })
  if (!r.ok) return
  showToast('Flyer eliminado', 'success')
  flyerSeleccionado.value = null
  tituloFlyer.value = ''
  await cargarListadoFlyers()
}

onMounted(cargarListadoFlyers)

function descargar() {
  const link = document.createElement('a')
  link.download = 'flyer.png'
  link.href = canvasRef.value.toDataURL('image/png')
  link.click()
}
</script>

<style scoped>
/* Panel de opciones = 1/3 del ancho, lienzo = 2/3; nunca se apilan salvo en pantallas muy angostas */
.editor {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
  gap: 1.5rem;
  align-items: start;
}

@media (max-width: 640px) {
  .editor {
    grid-template-columns: minmax(0, 1fr);
  }
}

.controles {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-width: 0;
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

.fila-logo {
  min-width: 0;
}

.nombre-logo {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 12rem;
}

.btn-agregar-logo {
  text-align: center;
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

.btn-agregar-texto:hover:not(:disabled) {
  border-color: #1b2452;
  color: #1b2452;
}

.btn-agregar-texto:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.campo-texto input[type='text'],
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
  min-width: 0;
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

.texto-spec {
  width: 100%;
  font-family: monospace;
  font-size: 0.75rem;
  resize: vertical;
}

.aviso-multilinea {
  white-space: pre-line;
}

.grilla-iconos {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(4.2rem, 1fr));
  gap: 0.4rem;
}

.btn-icono {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
  padding: 0.4rem 0.2rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: #f5f5f5;
  color: #1b2452;
  font-size: 0.7rem;
  cursor: pointer;
}

.btn-icono:hover {
  background: #dde1ef;
}

.btn-icono svg {
  width: 1.5rem;
  height: 1.5rem;
}

canvas {
  display: block;
  height: auto;
}
</style>
