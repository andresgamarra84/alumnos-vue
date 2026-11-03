<template>
  <div class="doc-ing">
    <h3 class="h3cabecera">Documentación de ingresantes</h3>

    <div class="filtros">
      <label v-for="f in filtros" :key="f.label" class="chip">
        <input type="checkbox" v-model="f.model.value" @change="list">
        <span>{{ f.label }}</span>
      </label>
    </div>

    <p v-if="arrDocIng.length === 0" class="vacio">No hay ingresantes para los filtros seleccionados.</p>

    <div
      v-for="(item, k) in arrDocIng"
      :key="item.codAlumno"
      class="ing-card"
      :class="{ 'ing-card--abierta': item.mostrarInfo, 'ing-card--clave': item.tieneClave }"
    >
      <div class="ing-card__head" @click="changeShow(k)">
        <div class="ing-card__titulo">
          <span class="ing-card__nombre">{{ item.apellido }}, {{ item.nombre }}</span>
          <span class="ing-card__meta">DNI {{ item.nrodoc }} · {{ item.email }}</span>
        </div>
        <div class="ing-card__badges">
          <span v-if="item.esEspera" class="badge-estado badge-estado--espera">Lista de espera</span>
          <span v-if="item.tieneClave" class="badge-estado badge-estado--ok">Con clave</span>
          <span class="badge-estado badge-estado--neutro">{{ item.docs.numDocs }}/{{ item.docs.docs.length }} archivos</span>
          <span class="ing-card__chevron" aria-hidden="true">▾</span>
        </div>
      </div>

      <div v-if="item.mostrarInfo" class="ing-card__body">
        <div class="datos">
          <div><span class="datos__label">Fecha de nacimiento</span>{{ item.fechaNac }} ({{ item.edad }} años)</div>
          <div><span class="datos__label">Carrera</span>{{ item.tipoIngreso[0] }} ({{ item.instrumento }})</div>
        </div>

        <div class="docs">
          <div v-for="(doc, j) in item.docs.docs" :key="j" class="doc">
            <div class="doc__info">
              <div class="doc__nombre">{{ doc[0] }}</div>
              <div class="doc__archivos">
                <template v-for="(url, i2) in doc[1]" :key="i2">
                  <span v-if="!url" class="sin-archivo">Sin archivo cargado</span>
                  <span v-else class="archivo-item">
                    <a :href="url" target="_blank" class="archivo-link">{{ nombreArchivo(url) }}</a>
                    <a href="#" class="archivo-borrar" @click.prevent="borrarArchivo(item, j, url)">Borrar</a>
                  </span>
                </template>
                <span v-if="doc[1].length === 0" class="sin-archivo">Sin archivo cargado</span>
              </div>
              <div class="doc__subir">
                <button
                  type="button"
                  class="btn btn-outline-secondary btn-sm"
                  :disabled="subiendo[claveSubida(item, j)] !== undefined"
                  @click="subirArchivo(item, j)"
                >
                  Subir archivo
                </button>
                <span v-if="subiendo[claveSubida(item, j)] !== undefined" class="doc__progreso">{{ subiendo[claveSubida(item, j)] }}%</span>
              </div>
            </div>
            <div class="segmentado" role="radiogroup" :aria-label="doc[0]">
              <label v-for="op in opcionesDoc" :key="op.valor" :class="'segmentado__op segmentado__op--' + op.clase">
                <input
                  type="radio"
                  :name="'doc_' + item.codAlumno + '_' + j"
                  :value="op.valor"
                  v-model="item.docPresentada[j]"
                >
                <span>{{ op.label }}</span>
              </label>
            </div>
          </div>
        </div>

        <div class="extras">
          <label class="campo">
            <span class="campo__label">Comisión de Lenguaje Musical I</span>
            <select v-model="item.comisionLM" class="form-select form-select-sm">
              <option value="">Sin asignar</option>
              <option v-for="c in comisionesLM" :key="c" :value="c">{{ c }}</option>
            </select>
          </label>
          <!-- Oculto por ahora
          <label class="chip chip--sm">
            <input type="checkbox" v-model="item.addToMailList" @change="addToList">
            <span>Copiar correo</span>
          </label>
          -->
        </div>

        <div class="acciones">
          <button v-if="!item.tieneClave" class="btn btn-outline-secondary btn-sm me-auto" @click="enviarClave(k)">Enviar clave</button>
          <button class="btn btn-accion btn-accion--cerrar" @click="closeShow(k)">Cerrar</button>
          <button class="btn btn-accion btn-accion--planilla" @click="getPDF(k)">Descargar planilla</button>
          <button class="btn btn-accion btn-accion--guardar" @click="sendMailInfo(k)">Guardar cambios</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue"
import Resumable from "resumablejs"
import { api } from "@/api/api"
import { BASE_URL, SESSION_NAME } from "@/config/app.config"
import { showModal, showToast } from "@/services/uiBus"
import { useFileDownload } from "@/composables/useFileDownload"

const { downloadBlob } = useFileDownload()

const filtroOn = ref(false)
const fltMedico = ref(false)
const fltEstudios = ref(false)
const fltORL = ref(false)
const fltEspera = ref(false)
const fltReincorporacion = ref(false)
// Mismo orden que el array `filtro` que espera el BE
const filtros = [
  { label: 'Toda la documentación presentada', model: filtroOn },
  { label: 'Adeuda Cert. médico', model: fltMedico },
  { label: 'Adeuda Cert. estudios', model: fltEstudios },
  { label: 'Adeuda ORL', model: fltORL },
  { label: 'Lista de espera', model: fltEspera },
  { label: 'Reincorporaciones', model: fltReincorporacion },
]
const opcionesDoc = [
  { valor: 0, label: 'Adeuda entrega', clase: 'adeuda' },
  { valor: 1, label: 'Presentado', clase: 'presentado' },
  { valor: 2, label: 'No corresponde', clase: 'nocorresponde' },
]
const arrDocIng = ref([])
const comisionesLM = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']

const list = async () => {
  const filtro = filtros.map(f => f.model.value)
  const { payload } = await api.get({
    entity: 'docingresantes',
    action: 'getList',
    payload: { filtro }
  })
  arrDocIng.value = payload ?? []
}

const changeShow = (k) => {
  arrDocIng.value.forEach((item, i) => { item.mostrarInfo = i === k ? !item.mostrarInfo : false })
}

const closeShow = (k) => {
  arrDocIng.value[k].mostrarInfo = false
}

const sendMailInfo = async (k) => {
  const item = arrDocIng.value[k]
  const { ok } = await showModal('¿Confirma el ingreso de los datos?', 1, 'Confirmación')
  if (!ok) return
  const r = await api.post({
    entity: 'docingresantes',
    action: 'updDocumentacion',
    payload: { codAlumno: item.codAlumno, docPresentada: item.docPresentada, comisionLM: item.comisionLM }
  })
  if (r.ok) showToast('Datos ingresados', 'success')
  item.mostrarInfo = false
}

const getPDF = async (k) => {
  const item = arrDocIng.value[k]
  const blob = await api.getPDF({
    entity: 'docingresantes',
    action: 'getFichaPDF',
    payload: { codAlumno: item.codAlumno }
  })
  // Si el BE respondió con un error (JSON) en lugar de un PDF, no descargarlo como si lo fuera
  if (blob.type && !blob.type.includes('pdf')) {
    const { message } = JSON.parse(await blob.text())
    showToast(message || 'No se pudo generar la planilla', 'error')
    return
  }
  downloadBlob(blob, `Ficha_Preinscripcion_${item.codAlumno}.pdf`, 'application/pdf')
}

// Subida de documentación en nombre del ingresante. El índice j del documento es la subcarpeta de uploads/ingresantes/{codAlumno}/
const MAX_BYTES = 15 * 1024 * 1024
const CARACTERES_INVALIDOS = /[,=?¿!'¡]/g
const subiendo = reactive({}) // clave "codAlumno_j" -> porcentaje, solo mientras se sube
const claveSubida = (item, j) => `${item.codAlumno}_${j}`

const subirArchivo = (item, j) => {
  const clave = claveSubida(item, j)
  const upl = new Resumable({
    headers: { Authorization: `Bearer ${sessionStorage.getItem(SESSION_NAME)}` },
    target: BASE_URL,
    testChunks: false,
    query: () => ({
      entity: 'docingresantes',
      action: 'uploadFile',
      payload: JSON.stringify({ codAlumno: item.codAlumno, tipo: j }),
    }),
  })
  if (!upl.support) {
    showToast('Tu navegador no soporta la carga de archivos.', 'error')
    return
  }
  const error = (texto) => {
    delete subiendo[clave]
    showToast(texto || 'No fue posible subir el archivo.', 'error')
  }
  upl.on('fileAdded', (file) => {
    if (file.file.type.startsWith('video/')) return error('No pueden subirse videos.')
    if (file.size > MAX_BYTES) return error('El archivo supera el tamaño máximo permitido (15 MB).')
    file.fileName = file.fileName.replace(CARACTERES_INVALIDOS, '')
    subiendo[clave] = 0
    upl.upload()
  })
  upl.on('fileProgress', () => { subiendo[clave] = Math.floor(upl.progress() * 100) })
  upl.on('fileSuccess', (file, message) => {
    try {
      const r = JSON.parse(message)
      if (r.ok === false) return error(r.message)
    } catch { /* respuesta no JSON: se considera subida correcta */ }
    delete subiendo[clave]
    const url = `/uploads/ingresantes/${item.codAlumno}/${j}/${file.fileName}`
    const archivos = item.docs.docs[j][1]
    if (!archivos.includes(url)) {
      if (archivos.length === 0) item.docs.numDocs++
      archivos.push(url)
    }
    showToast('El archivo fue cargado.', 'success')
  })
  upl.on('fileError', (file, message) => {
    let texto
    try { texto = JSON.parse(message).message } catch { /* mensaje por defecto */ }
    error(texto)
  })
  const input = document.createElement('input')
  input.type = 'file'
  upl.assignBrowse(input)
  input.click()
}

const nombreArchivo = (url) => url.split('/').pop()

const borrarArchivo = async (item, j, url) => {
  const fileName = nombreArchivo(url)
  const { ok } = await showModal(`¿Confirma que desea borrar el archivo ${fileName}?`, 1, 'Confirmación')
  if (!ok) return
  const r = await api.post({
    entity: 'docingresantes',
    action: 'delFile',
    payload: { codAlumno: item.codAlumno, tipo: j, fileName }
  })
  if (!r.ok) return showToast('No se pudo borrar el archivo', 'error')
  const archivos = item.docs.docs[j][1]
  archivos.splice(archivos.indexOf(url), 1)
  if (archivos.length === 0) item.docs.numDocs--
  showToast('El archivo fue borrado.', 'success')
}

const enviarClave = async (k) => {
  const item = arrDocIng.value[k]
  const r = await api.post({
    entity: 'docingresantes',
    action: 'enviarClave',
    payload: { datosIngresante: item, esCondicional: false }
  })
  if (r.ok) {
    item.tieneClave = true
    showToast('Correo enviado', 'success')
  } else {
    showToast('No se pudo enviar el correo', 'error')
  }
}

const addToList = () => {
  const emails = arrDocIng.value.filter(i => i.addToMailList).map(i => i.email)
  navigator.clipboard.writeText(emails.join(","))
}

onMounted(() => {
  list()
})
</script>

<style scoped>
.doc-ing {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Filtros como chips */
.filtros {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  padding-bottom: 8px;
}
.chip {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  margin: 0;
}
.chip input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}
.chip span {
  padding: 6px 14px;
  border: 1px solid var(--color-borde);
  border-radius: 999px;
  background: var(--color-fondo-secundario);
  color: var(--color-texto-secundario);
  font-size: 0.9rem;
  transition: all 0.2s ease-in-out;
}
.chip:hover span {
  border-color: var(--color-acento);
  color: var(--color-texto-principal);
}
.chip input:checked + span {
  background: var(--color-acento);
  border-color: var(--color-acento);
  color: #fff;
}
.chip input:focus-visible + span {
  outline: 2px solid var(--color-acento-claro);
  outline-offset: 2px;
}
.chip--sm span {
  padding: 4px 12px;
  font-size: 0.85rem;
}

.vacio {
  text-align: center;
  color: var(--color-texto-secundario);
  font-style: italic;
}

/* Tarjeta de ingresante */
.ing-card {
  background: var(--color-fondo-secundario);
  border: 1px solid var(--color-borde);
  border-left: 4px solid var(--color-borde);
  border-radius: 8px;
  box-shadow: 0 2px 4px var(--sombra-suave);
  transition: box-shadow 0.2s ease-in-out, border-color 0.2s ease-in-out;
}
.ing-card--clave {
  border-left-color: #2e9e6b;
}
.ing-card:hover,
.ing-card--abierta {
  box-shadow: 0 4px 10px var(--sombra-hover);
}
.ing-card--abierta {
  border-left-color: var(--color-acento);
}
.ing-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  padding: 14px 18px;
  cursor: pointer;
}
.ing-card__titulo {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.ing-card__nombre {
  font-weight: 700;
  font-size: 1.05rem;
}
.ing-card__meta {
  color: var(--color-texto-secundario);
  font-size: 0.85rem;
  overflow-wrap: anywhere;
}
.ing-card__badges {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}
.ing-card__chevron {
  color: var(--color-texto-secundario);
  transition: transform 0.2s ease-in-out;
  margin-left: 4px;
}
.ing-card--abierta .ing-card__chevron {
  transform: rotate(180deg);
}

.badge-estado {
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid transparent;
}
.badge-estado--ok {
  background: rgba(46, 158, 107, 0.15);
  color: #2e9e6b;
  border-color: rgba(46, 158, 107, 0.35);
}
.badge-estado--espera {
  background: rgba(230, 160, 30, 0.15);
  color: #c58a14;
  border-color: rgba(230, 160, 30, 0.4);
}
.badge-estado--neutro {
  background: transparent;
  color: var(--color-texto-secundario);
  border-color: var(--color-borde);
}

/* Detalle */
.ing-card__body {
  padding: 4px 18px 18px;
  border-top: 1px solid var(--color-borde);
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.datos {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 32px;
  padding-top: 14px;
}
.datos__label {
  display: block;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-texto-secundario);
}

.docs {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.doc {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px 16px;
  padding: 10px 14px;
  border: 1px solid var(--color-borde);
  border-radius: 8px;
  background: var(--color-fondo-principal);
}
.doc__nombre {
  font-weight: 500;
}
.doc__archivos {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  font-size: 0.85rem;
}
.sin-archivo {
  color: var(--color-texto-secundario);
  font-style: italic;
}
.archivo-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  max-width: 100%;
}
.archivo-link {
  overflow-wrap: anywhere;
}
.archivo-borrar {
  color: #d9534f;
}
.doc__subir {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
}
.doc__progreso {
  font-size: 0.85rem;
  color: var(--color-texto-secundario);
}

/* Radios como control segmentado */
.segmentado {
  display: inline-flex;
  border: 1px solid var(--color-borde);
  border-radius: 8px;
  overflow: hidden;
  background: var(--color-fondo-secundario);
}
.segmentado__op {
  margin: 0;
  cursor: pointer;
}
.segmentado__op + .segmentado__op {
  border-left: 1px solid var(--color-borde);
}
.segmentado__op input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}
.segmentado__op span {
  display: block;
  padding: 6px 14px;
  font-size: 0.85rem;
  color: var(--color-texto-secundario);
  transition: background-color 0.15s ease-in-out, color 0.15s ease-in-out;
}
.segmentado__op:hover span {
  background: var(--color-fondo-principal);
}
.segmentado__op input:focus-visible + span {
  outline: 2px solid var(--color-acento-claro);
  outline-offset: -2px;
}
.segmentado__op--adeuda input:checked + span {
  background: #d9534f;
  color: #fff;
}
.segmentado__op--presentado input:checked + span {
  background: #2e9e6b;
  color: #fff;
}
.segmentado__op--nocorresponde input:checked + span {
  background: #7b8794;
  color: #fff;
}

.extras {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
}
.campo {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 0;
}
.campo__label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-texto-secundario);
}

.acciones {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid var(--color-borde);
}

/* Botones de acción con colores distintos (mismos tonos que los estados de documentación) */
.btn-accion {
  color: #fff;
  border: 1px solid transparent;
  transition: filter 0.15s ease-in-out;
}
.btn-accion:hover,
.btn-accion:focus-visible {
  color: #fff;
  filter: brightness(0.9);
}
.btn-accion--cerrar {
  background: #7b8794;
}
.btn-accion--planilla {
  background: #2f80c0;
}
.btn-accion--guardar {
  background: #2e9e6b;
}

@media (max-width: 576px) {
  .segmentado {
    width: 100%;
  }
  .segmentado__op {
    flex: 1;
  }
  .segmentado__op span {
    text-align: center;
    padding: 6px 4px;
    font-size: 0.78rem;
  }
  .acciones .btn {
    flex: 1 1 auto;
  }
}
</style>
