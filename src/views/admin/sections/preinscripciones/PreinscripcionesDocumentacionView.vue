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
                  <a v-else :href="url" target="_blank" class="archivo-link">Ver archivo{{ doc[1].length > 1 ? ` ${i2 + 1}` : '' }}</a>
                </template>
                <span v-if="doc[1].length === 0" class="sin-archivo">Sin archivo cargado</span>
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
          <button class="btn btn-outline-secondary" @click="closeShow(k)">Cerrar</button>
          <button class="btn btn-outline-primary" @click="getPDF(k)">Descargar planilla</button>
          <button class="btn btn-primary" @click="sendMailInfo(k)">Guardar cambios</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { api } from "@/api/api"
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
