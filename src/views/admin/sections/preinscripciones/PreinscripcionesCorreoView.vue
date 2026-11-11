<template>
  <div class="correo">
    <div class="correo__cabecera">
      <h3 class="h3cabecera">Correo de consultas</h3>
      <div class="correo__herramientas">
        <input v-model="busqueda" class="form-control form-control-sm" type="search" placeholder="Buscar remitente, asunto o texto" @keyup.enter="cargar(1)">
        <label class="chip"><input type="checkbox" v-model="soloNoLeidos" @change="cargar(1)"><span>No leídos<template v-if="noLeidos"> ({{ noLeidos }})</template></span></label>
        <button class="btn btn-outline-secondary btn-sm" :disabled="sincronizando" @click="sincronizar">{{ sincronizando ? 'Sincronizando…' : 'Actualizar' }}</button>
      </div>
    </div>

    <p v-if="!configurado" class="vacio">La casilla de correo todavía no está configurada en el servidor.</p>

    <div class="correo__cuerpo">
      <div class="lista" :class="{ 'lista--oculta': seleccionado }">
        <p v-if="!items.length" class="vacio">No hay mensajes.</p>
        <div
          v-for="m in items"
          :key="m.codigo"
          class="item"
          :class="{ 'item--nuevo': !m.leido, 'item--activo': seleccionado?.codigo === m.codigo }"
          @click="abrir(m)"
        >
          <div class="item__linea">
            <span class="item__de">{{ m.de_nombre || m.de_email }}</span>
            <span class="item__fecha">{{ fechaCorta(m.fecha) }}</span>
          </div>
          <div class="item__asunto">
            {{ m.asunto || '(sin asunto)' }}
            <span v-if="m.tiene_adjuntos" title="Adjuntos">📎</span>
            <span v-if="m.respondido" class="badge-estado badge-estado--ok">Respondido</span>
            <span v-if="m.codalumno" class="badge-estado badge-estado--neutro">Ingresante</span>
          </div>
          <div class="item__extracto">{{ m.extracto }}</div>
        </div>
        <div v-if="paginas > 1" class="paginacion">
          <button class="btn btn-sm btn-outline-secondary" :disabled="pagina <= 1" @click="cargar(pagina - 1)">‹</button>
          <span>{{ pagina }} / {{ paginas }}</span>
          <button class="btn btn-sm btn-outline-secondary" :disabled="pagina >= paginas" @click="cargar(pagina + 1)">›</button>
        </div>
      </div>

      <div v-if="seleccionado" class="detalle">
        <button class="btn btn-sm btn-outline-secondary detalle__volver" @click="seleccionado = null">← Volver</button>
        <h4 class="detalle__asunto">{{ seleccionado.asunto || '(sin asunto)' }}</h4>
        <div class="detalle__meta">
          <div><strong>{{ seleccionado.de_nombre }}</strong> &lt;{{ seleccionado.de_email }}&gt;</div>
          <div>{{ fechaLarga(seleccionado.fecha) }}</div>
          <div v-if="seleccionado.alumno">Ingresante: {{ seleccionado.alumno.apellido }}, {{ seleccionado.alumno.nombre }} (DNI {{ seleccionado.alumno.nrodoc }})</div>
        </div>
        <div class="detalle__acciones">
          <button class="btn btn-sm btn-outline-secondary" @click="marcarNoLeido">Marcar como no leído</button>
          <button class="btn btn-sm btn-outline-danger" @click="borrar">Quitar de la bandeja</button>
        </div>

        <div class="detalle__texto" v-html="cuerpoSeguro"></div>

        <div v-if="seleccionado.adjuntos?.length" class="adjuntos">
          <a v-for="a in seleccionado.adjuntos" :key="a.codigo" href="#" @click.prevent="descargar(a)">📎 {{ a.nombre }} ({{ tamano(a.tamano) }})</a>
        </div>

        <div v-for="r in seleccionado.respuestas" :key="r.codigo" class="respuesta-enviada">
          <div class="respuesta-enviada__meta">Respondido el {{ fechaLarga(r.fecha) }}</div>
          <div v-html="sanitize(r.cuerpo_html)"></div>
        </div>

        <div v-for="p in seleccionado.programados" :key="p.codigo" class="respuesta-programada" :class="{ 'respuesta-programada--error': p.estado == 2 }">
          <div class="respuesta-programada__meta">
            <template v-if="p.estado == 2">⚠ No se pudo enviar la respuesta programada para el {{ fechaProgramada(p.enviar_en) }}.</template>
            <template v-else>🕒 Respuesta programada para el {{ fechaProgramada(p.enviar_en) }}</template>
            <a href="#" @click.prevent="cancelarProgramado(p)">Cancelar</a>
          </div>
          <div class="respuesta-programada__texto">{{ p.cuerpo_texto }}</div>
        </div>

        <div class="responder">
          <textarea v-model="respuesta" class="form-control" rows="6" placeholder="Escribí tu respuesta…"></textarea>
          <button class="btn btn-accion btn-accion--guardar" :disabled="!respuesta.trim() || enviando" @click="responder">{{ enviando ? 'Enviando…' : 'Responder' }}</button>
        </div>

        <div v-if="dlgProgramar.visible" class="dlg-fondo" @click.self="dlgProgramar.visible = false">
          <div class="dlg">
            <h5>Son más de las {{ horaCorte }} hs</h5>
            <p>¿Querés programar la respuesta para otro momento?</p>
            <label class="dlg__campo">
              <span>Día y hora de envío</span>
              <input type="datetime-local" v-model="dlgProgramar.fecha" :min="minFecha" class="form-control form-control-sm">
            </label>
            <div class="dlg__acciones">
              <button class="btn btn-sm btn-outline-secondary me-auto" @click="dlgProgramar.visible = false">Cancelar</button>
              <button class="btn btn-sm btn-outline-secondary" :disabled="enviando" @click="confirmarEnvio({ enviarAhora: true })">Enviar ahora</button>
              <button class="btn btn-sm btn-accion btn-accion--guardar" :disabled="!dlgProgramar.fecha || enviando" @click="confirmarEnvio({ programarPara: dlgProgramar.fecha })">Programar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import DOMPurify from 'dompurify'
import { api } from '@/api/api'
import { showModal, showToast } from '@/services/uiBus'
import { useFileDownload } from '@/composables/useFileDownload'

const { downloadBlob } = useFileDownload()

const items = ref([])
const total = ref(0)
const porPagina = ref(30)
const pagina = ref(1)
const noLeidos = ref(0)
const configurado = ref(true)
const busqueda = ref('')
const soloNoLeidos = ref(false)
const seleccionado = ref(null)
const respuesta = ref('')
const sincronizando = ref(false)
const enviando = ref(false)

const paginas = computed(() => Math.max(1, Math.ceil(total.value / porPagina.value)))

// El HTML del correo es contenido externo: se sanitiza y los links se abren en pestaña nueva. Imágenes remotas fuera (tracking).
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A') {
    node.setAttribute('target', '_blank')
    node.setAttribute('rel', 'noopener noreferrer')
  }
})
const sanitize = (html) => DOMPurify.sanitize(String(html ?? ''), {
  ALLOWED_TAGS: ['br', 'a', 'b', 'strong', 'i', 'em', 'u', 'p', 'div', 'span', 'ul', 'ol', 'li', 'blockquote', 'table', 'tbody', 'thead', 'tr', 'td', 'th', 'h1', 'h2', 'h3', 'h4', 'pre'],
  ALLOWED_ATTR: ['href'],
})
const escapar = (t) => String(t ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
const cuerpoSeguro = computed(() => {
  const m = seleccionado.value
  if (!m) return ''
  return m.cuerpo_html ? sanitize(m.cuerpo_html) : `<div style="white-space:pre-wrap">${escapar(m.cuerpo_texto)}</div>`
})

const parseFecha = (f) => new Date(String(f).replace(' ', 'T'))
const fechaCorta = (f) => {
  const d = parseFecha(f)
  const hoy = new Date()
  return d.toDateString() === hoy.toDateString()
    ? d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
    : d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' })
}
const fechaLarga = (f) => parseFecha(f).toLocaleString('es-AR', { dateStyle: 'long', timeStyle: 'short' })
const tamano = (b) => (b > 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`)

async function cargar(p = 1) {
  pagina.value = p
  const { ok, payload } = await api.get({
    entity: 'correo',
    action: 'getMensajes',
    payload: { pagina: p, busqueda: busqueda.value, soloNoLeidos: soloNoLeidos.value }
  })
  if (!ok) return
  items.value = payload.items
  total.value = payload.total
  porPagina.value = payload.porPagina
  noLeidos.value = payload.noLeidos
  configurado.value = payload.configurado
}

async function sincronizar(silencioso = false) {
  sincronizando.value = true
  try {
    const r = await api.post({ entity: 'correo', action: 'sincronizar', payload: {} })
    if (r.ok) {
      if (silencioso !== true) showToast(r.payload.nuevos ? `${r.payload.nuevos} mensaje(s) nuevo(s)` : 'No hay mensajes nuevos', 'success')
      await cargar(1)
    }
  } finally {
    sincronizando.value = false
  }
}

async function abrir(m) {
  const r = await api.get({ entity: 'correo', action: 'getMensaje', payload: { codigo: m.codigo } })
  if (!r.ok) return
  if (!m.leido) {
    m.leido = 1
    noLeidos.value = Math.max(0, noLeidos.value - 1)
  }
  seleccionado.value = r.payload
  respuesta.value = ''
}

async function marcarNoLeido() {
  const r = await api.post({ entity: 'correo', action: 'marcarLeido', payload: { codigo: seleccionado.value.codigo, leido: false } })
  if (!r.ok) return
  const it = items.value.find((i) => i.codigo === seleccionado.value.codigo)
  if (it) it.leido = 0
  noLeidos.value++
  seleccionado.value = null
}

async function borrar() {
  const { ok } = await showModal('¿Quitar este mensaje de la bandeja? No se borra del servidor de correo.', 1, 'Confirmación')
  if (!ok) return
  const r = await api.post({ entity: 'correo', action: 'delMensaje', payload: { codigo: seleccionado.value.codigo } })
  if (!r.ok) return
  seleccionado.value = null
  await cargar(pagina.value)
}

// Pasada la hora de corte (hora de Argentina) las respuestas se pueden programar. El BE tiene la última palabra: si
// el reloj de este equipo no coincide, responde requiereProgramar y se muestra el diálogo igual.
const horaCorte = 20
const dlgProgramar = reactive({ visible: false, fecha: '' })
const aLocalInput = (d) => {
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`
}
const minFecha = computed(() => (dlgProgramar.visible ? aLocalInput(new Date()) : ''))
const horaArgentina = () => Number(new Intl.DateTimeFormat('es-AR', { timeZone: 'America/Argentina/Buenos_Aires', hour: 'numeric', hourCycle: 'h23' }).format(new Date()))
const fechaProgramada = (f) => parseFecha(f).toLocaleString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }) + ' hs'

function abrirDialogoProgramar() {
  const manana = new Date()
  manana.setDate(manana.getDate() + 1)
  manana.setHours(8, 0, 0, 0)
  dlgProgramar.fecha = aLocalInput(manana)
  dlgProgramar.visible = true
}

async function responder() {
  if (horaArgentina() >= horaCorte) return abrirDialogoProgramar()
  const { ok } = await showModal(`¿Enviar la respuesta a ${seleccionado.value.de_email}?`, 1, 'Confirmación')
  if (!ok) return
  await confirmarEnvio({})
}

// extra: {} (el BE decide), { enviarAhora: true } o { programarPara: 'YYYY-MM-DDTHH:mm' }
async function confirmarEnvio(extra) {
  enviando.value = true
  try {
    const r = await api.post({ entity: 'correo', action: 'responder', payload: { codigo: seleccionado.value.codigo, texto: respuesta.value, ...extra } })
    if (!r.ok) return
    if (r.payload.requiereProgramar) return abrirDialogoProgramar()
    dlgProgramar.visible = false
    if (r.payload.programado) {
      showToast('Respuesta programada', 'success')
    } else {
      showToast('Respuesta enviada', 'success')
      const it = items.value.find((i) => i.codigo === seleccionado.value.codigo)
      if (it) it.respondido = 1
    }
    await abrir(seleccionado.value)
  } finally {
    enviando.value = false
  }
}

async function cancelarProgramado(p) {
  const { ok } = await showModal('¿Cancelar el envío programado de esta respuesta?', 1, 'Confirmación')
  if (!ok) return
  const r = await api.post({ entity: 'correo', action: 'cancelarProgramado', payload: { codigo: p.codigo } })
  if (!r.ok) return
  seleccionado.value.programados = seleccionado.value.programados.filter((x) => x.codigo !== p.codigo)
  showToast('Envío cancelado', 'success')
}

async function descargar(a) {
  const blob = await api.getPDF({ entity: 'correo', action: 'getAdjunto', payload: { codigo: a.codigo } })
  if (blob.type && blob.type.includes('json')) return showToast('No se pudo descargar el adjunto', 'error')
  downloadBlob(blob, a.nombre, a.tipo)
}

onMounted(async () => {
  await cargar(1)
  // Trae lo nuevo de la casilla al abrir la bandeja
  if (configurado.value) sincronizar(true)
})
</script>

<style scoped>
.correo { display: flex; flex-direction: column; gap: 12px; }
.correo__cabecera { display: flex; flex-wrap: wrap; gap: 8px; justify-content: space-between; align-items: center; }
.correo__herramientas { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
.correo__herramientas input[type=search] { width: 260px; }
.correo__cuerpo { display: grid; grid-template-columns: minmax(280px, 380px) 1fr; gap: 12px; align-items: start; }
.lista { border: 1px solid var(--color-borde); border-radius: 8px; background: var(--color-fondo-secundario); max-height: 75vh; overflow-y: auto; }
.item { padding: 10px 12px; border-bottom: 1px solid var(--color-borde); cursor: pointer; }
.item:hover, .item--activo { background: var(--color-fondo-terciario, rgba(127,127,127,.12)); }
.item--nuevo .item__de, .item--nuevo .item__asunto { font-weight: 700; }
.item__linea { display: flex; justify-content: space-between; gap: 8px; }
.item__de { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.item__fecha { color: var(--color-texto-secundario); font-size: .8rem; flex-shrink: 0; }
.item__asunto { font-size: .92rem; }
.item__extracto { color: var(--color-texto-secundario); font-size: .82rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.paginacion { display: flex; justify-content: center; align-items: center; gap: 12px; padding: 8px; }
.detalle { border: 1px solid var(--color-borde); border-radius: 8px; background: var(--color-fondo-secundario); padding: 16px; display: flex; flex-direction: column; gap: 12px; min-width: 0; }
.detalle__volver { display: none; align-self: flex-start; }
.detalle__asunto { margin: 0; }
.detalle__meta { color: var(--color-texto-secundario); font-size: .9rem; }
.detalle__acciones { display: flex; gap: 8px; flex-wrap: wrap; }
.detalle__texto { overflow-x: auto; word-break: break-word; padding: 12px; border-radius: 6px; background: var(--color-fondo-principal, transparent); border: 1px solid var(--color-borde); }
.adjuntos { display: flex; flex-direction: column; gap: 4px; }
.respuesta-enviada { border-left: 3px solid var(--color-acento); padding-left: 12px; }
.respuesta-enviada__meta { color: var(--color-texto-secundario); font-size: .8rem; }
.respuesta-programada { border-left: 3px solid #d39e00; padding-left: 12px; }
.respuesta-programada--error { border-left-color: #dc3545; }
.respuesta-programada__meta { color: var(--color-texto-secundario); font-size: .85rem; display: flex; gap: 12px; flex-wrap: wrap; }
.respuesta-programada__texto { white-space: pre-wrap; font-size: .9rem; }
.dlg-fondo { position: fixed; inset: 0; background: rgba(0,0,0,.5); display: flex; align-items: center; justify-content: center; z-index: 1050; padding: 16px; }
.dlg { background: var(--color-fondo-secundario); border: 1px solid var(--color-borde); border-radius: 10px; padding: 20px; width: 100%; max-width: 420px; display: flex; flex-direction: column; gap: 12px; }
.dlg h5, .dlg p { margin: 0; }
.dlg__campo { display: flex; flex-direction: column; gap: 4px; font-size: .9rem; }
.dlg__acciones { display: flex; gap: 8px; flex-wrap: wrap; justify-content: flex-end; }
.responder { display: flex; flex-direction: column; gap: 8px; align-items: flex-end; }
.responder textarea { width: 100%; }
.chip { display: inline-flex; align-items: center; cursor: pointer; user-select: none; margin: 0; }
.chip input { position: absolute; opacity: 0; pointer-events: none; }
.chip span { padding: 4px 12px; border: 1px solid var(--color-borde); border-radius: 999px; background: var(--color-fondo-secundario); color: var(--color-texto-secundario); font-size: .85rem; }
.chip input:checked + span { background: var(--color-acento); border-color: var(--color-acento); color: #fff; }
.vacio { text-align: center; color: var(--color-texto-secundario); font-style: italic; padding: 16px; }
@media (max-width: 800px) {
  .correo__cuerpo { grid-template-columns: 1fr; }
  .lista--oculta { display: none; }
  .detalle__volver { display: inline-block; }
}
</style>
