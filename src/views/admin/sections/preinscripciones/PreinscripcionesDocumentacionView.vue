<template>
  <div class="row g-3">
    <h3 class="h3cabecera">Documentación de ingresantes</h3>

    <div class="col-12 d-flex flex-wrap justify-content-around py-2">
      <label><input type="checkbox" v-model="filtroOn" @change="list"> Toda la documentación presentada</label>
      <label><input type="checkbox" v-model="fltMedico" @change="list"> Adeuda Cert. médico</label>
      <label><input type="checkbox" v-model="fltEstudios" @change="list"> Adeuda Cert. estudios</label>
      <label><input type="checkbox" v-model="fltORL" @change="list"> Adeuda ORL</label>
      <label><input type="checkbox" v-model="fltEspera" @change="list"> Lista de espera</label>
      <label><input type="checkbox" v-model="fltReincorporacion" @change="list"> Reincorporaciones</label>
    </div>

    <div
      v-for="(item, k) in arrDocIng"
      :key="item.codAlumno"
      class="col-12 recuadro"
      :style="item.tieneClave ? 'background-color: aliceblue;' : ''"
    >
      <div :class="{ 'fw-bold': item.docs.numDocs }" style="cursor:pointer" @click="changeShow(k)">
        {{ item.apellido }}, {{ item.nombre }} - DNI: {{ item.nrodoc }} - E-mail: {{ item.email }}
      </div>

      <template v-if="item.mostrarInfo">
        <div class="col-12 mt-2">Fecha de Nacimiento: {{ item.fechaNac }} ({{ item.edad }} años)</div>
        <div class="col-12">
          Carrera: {{ item.tipoIngreso[0] }} ({{ item.instrumento }})
          <template v-if="item.esEspera"> - Lista de espera</template>
        </div>
        <div class="col-12 mt-3" v-for="(doc, j) in item.docs.docs" :key="j" style="margin:10px 0;">
          <div v-for="(url, i2) in doc[1]" :key="i2">
            {{ doc[0] }}:
            <template v-if="!url">(Sin archivo cargado)</template>
            <a v-else :href="url" target="_blank">Ver</a>
          </div>
          <div v-if="doc[1].length === 0">{{ doc[0] }}: (Sin archivo cargado)</div>
          <div class="d-flex ps-3">
            <label class="px-3"><input type="radio" :name="'docFisico' + j" :checked="item.docPresentada[j] === 0" @change="item.docPresentada[j] = 0"> Adeuda entrega</label>
            <label class="px-3"><input type="radio" :name="'docFisico' + j" :checked="item.docPresentada[j] === 1" @change="item.docPresentada[j] = 1"> Presentado</label>
            <label class="px-3"><input type="radio" :name="'docFisico' + j" :checked="item.docPresentada[j] === 2" @change="item.docPresentada[j] = 2"> No corresponde</label>
          </div>
        </div>
        <div class="col-12 mt-3">
          <label>
            Comisión de Lenguaje Musical I:
            <select v-model="item.comisionLM" class="form-select d-inline-block w-auto ms-2">
              <option value="">Sin asignar</option>
              <option v-for="c in comisionesLM" :key="c" :value="c">{{ c }}</option>
            </select>
          </label>
        </div>
        <div class="col-12">
          <label><input type="checkbox" v-model="item.addToMailList" @change="addToList"> Copiar correo</label>
        </div>
        <div class="col-12 text-end mt-2">
          <button class="btn btn-secondary" @click="closeShow(k)">Cerrar</button>
          <button class="btn mx-2" @click="getPDF(k)">Descargar Planilla</button>
          <button class="btn btn-danger" @click="sendMailInfo(k)">Guardar cambios</button>
        </div>
        <div v-if="!item.tieneClave" class="col-12">
          <a @click="enviarClave(k)">Enviar Clave</a>
        </div>
      </template>
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
const arrDocIng = ref([])
const comisionesLM = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']

const list = async () => {
  const filtro = [filtroOn.value, fltMedico.value, fltEstudios.value, fltORL.value, fltEspera.value, fltReincorporacion.value]
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
