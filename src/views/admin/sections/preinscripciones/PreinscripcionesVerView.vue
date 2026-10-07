<template>
  <div class="row g-3">
    <h3 class="h3cabecera">Preinscripciones</h3>

    <div class="col-12 d-flex align-items-center justify-content-center gap-4">
      <label><input type="radio" name="conDoc" v-model="filtro" :value="0" @change="onFilterChange"> Todo</label>
      <label><input type="radio" name="conDoc" v-model="filtro" :value="1" @change="onFilterChange"> Sin documentación cargada</label>
      <label><input type="radio" name="conDoc" v-model="filtro" :value="2" @change="onFilterChange"> Con documentación cargada</label>
    </div>

    <div class="col-12 d-flex align-items-center justify-content-center gap-3">
      <div>Desde: <input type="date" class="form-control d-inline-block w-auto" v-model="fechaInicio"></div>
      <div>Hasta: <input type="date" class="form-control d-inline-block w-auto" v-model="fechaFin"></div>
      <button class="btn btn-primary" @click="listAll">Buscar</button>
    </div>

    <div class="col-12 d-flex justify-content-around text-center flex-wrap">
      <div class="lista recuadro col-12 col-md" style="cursor:pointer" @click="listInfo(4)">
        Ingresos Foba Niños <template v-if="arrResumen[4]">({{ arrResumen[4] }})</template>
      </div>
      <div class="lista recuadro col-12 col-md" style="cursor:pointer" @click="listInfo(3)">
        Ingresos Foba Adultos <template v-if="arrResumen[3]">({{ arrResumen[3] }})</template>
      </div>
      <div class="lista recuadro col-12 col-md" style="cursor:pointer" @click="listInfo(1)">
        Pases y equivalencias <template v-if="arrResumen[1]">({{ arrResumen[1] }})</template>
      </div>
      <div class="lista recuadro col-12 col-md" style="cursor:pointer" @click="listInfo(2)">
        Reincorporaciones <template v-if="arrResumen[2]">({{ arrResumen[2] }})</template>
      </div>
      <div class="lista recuadro col-12 col-md" style="cursor:pointer" @click="listInfo(5)">
        Fuera de término <template v-if="arrResumen[5]">({{ arrResumen[5] }})</template>
      </div>
    </div>

    <div v-if="arrInscripciones.length > 0" class="col-12 text-center">
      <template v-if="filtro === 1">Sin documentación ({{ arrInscripciones.length }} de {{ total }})</template>
      <template v-if="filtro === 2">Con documentación ({{ arrInscripciones.length }} de {{ total }})</template>
    </div>

    <div v-if="Object.keys(arrResumenInstrumento).length > 0" class="col-12">
      <div v-for="(cant, instrumento) in arrResumenInstrumento" :key="instrumento">{{ instrumento }}: {{ cant }} inscriptos</div>
    </div>

    <div
      v-for="(item, k) in arrInscripciones"
      :key="item.codAlumno"
      class="col-12 recuadro"
      :style="item.tieneUsuario ? 'background-color:#3d6e9c; color:#fff;' : ''"
    >
      <div class="text-end">Código: {{ item.codAlumno }} - {{ item.fechaInscripcion }}</div>
      <div class="row pb-2">
        <div class="col-6 col-md-4">{{ item.nombre }}</div>
        <div class="col-6 col-md-4">{{ item.nrodoc }}</div>
        <div class="col-12 col-md-4">{{ item.instrumento }}</div>
      </div>
      <div v-if="tipoActual === 1" class="row pb-2">
        <div class="col-12">Institución de procedencia: {{ item.institucionOrigen }}</div>
        <div class="col-12">{{ item.infoEstudios }}</div>
      </div>
      <div class="col-12">E-mail de contacto: {{ item.email }}</div>
      <div class="row py-2">
        <div class="col-12" v-for="(doc, idx) in item.archivos" :key="idx">
          <template v-if="doc[1].length === 0">{{ doc[0] }}: Adeuda / No corresponde</template>
          <template v-else v-for="(url, j) in doc[1]" :key="j">
            {{ doc[0] }}: <a :href="url" target="_blank">Ver</a>
          </template>
        </div>
      </div>
      <div class="text-end">
        <a v-if="!item.tieneUsuario" @click="enviarClave(k)">Enviar Clave</a>
        <a v-if="!item.tieneUsuario" class="ms-3 text-danger" @click="borrarSolicitud(k)">Borrar solicitud</a>
      </div>
    </div>

    <div v-if="arrInscripciones.length > 0" class="col-12">
      <a @click="mailsToClipboard">Copiar correos electrónicos</a>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { api } from "@/api/api"
import { showModal, showToast } from "@/services/uiBus"

const fechaInicio = ref('')
const fechaFin = ref('')
const filtro = ref(0)
const tipoActual = ref(-1)
const arrResumen = ref({})
const arrInscripciones = ref([])
const arrResumenInstrumento = ref({})
const total = ref(0)

const listAll = async () => {
  const { payload } = await api.get({
    entity: 'preinscripciones',
    action: 'getResumen',
    payload: { fechaInicio: fechaInicio.value || null, fechaFin: fechaFin.value || null }
  })
  arrResumen.value = payload ?? {}
}

const onFilterChange = () => {
  arrInscripciones.value = []
}

const listInfo = async (tipo) => {
  tipoActual.value = tipo
  arrInscripciones.value = []
  arrResumenInstrumento.value = {}
  const { payload } = await api.get({
    entity: 'preinscripciones',
    action: 'getInscripciones',
    payload: {
      tipo,
      fechaInicio: fechaInicio.value || null,
      fechaFin: fechaFin.value || null,
      filtro: filtro.value,
    }
  })
  arrInscripciones.value = payload?.lista ?? []
  arrResumenInstrumento.value = payload?.instrumentos ?? {}
  total.value = arrResumen.value[tipo] ?? 0
}

const mailsToClipboard = () => {
  const emails = arrInscripciones.value.map(i => i.email)
  navigator.clipboard.writeText(emails.join(","))
  showToast("Correos copiados al portapapeles", 'success')
}

const enviarClave = async (k) => {
  const item = arrInscripciones.value[k]
  const { ok } = await showModal('¿Confirma que desea enviar el correo de activación?', 1, 'Confirmación')
  if (!ok) return
  const r = await api.post({
    entity: 'preinscripciones',
    action: 'enviarClave',
    payload: { codAlumno: item.codAlumno, email: item.email, nombre: item.nombre }
  })
  if (r.ok) {
    item.tieneUsuario = true
    showToast('Correo enviado', 'success')
  }
}

const borrarSolicitud = async (k) => {
  const item = arrInscripciones.value[k]
  const { ok } = await showModal('¿Confirma que desea borrar esta solicitud y todos los datos del ingresante?', 1, 'Confirmación')
  if (!ok) return
  const r = await api.post({
    entity: 'preinscripciones',
    action: 'delSolicitud',
    payload: { codAlumno: item.codAlumno }
  })
  if (r.ok) {
    arrInscripciones.value.splice(k, 1)
    showToast('Solicitud borrada', 'success')
  }
}
</script>
