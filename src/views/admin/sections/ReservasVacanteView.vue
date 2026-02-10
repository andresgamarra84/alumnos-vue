<template>
  <div>
    <h3 class="h3cabecera">Listado de Reservas de vacante</h3>

    <div class="mb-3">
      <label>Ciclo lectivo</label>
      <select v-model="selectedCiclo" class="form-select" @change="listReservas()">
        <option disabled value="0">Seleccione...</option>
        <option v-for="item in arrCiclos" :key="item.codigo" :value="item.codigo">
          {{ item.anio }}
        </option>
      </select>
    </div>

    <div class="row">
      <div class="cabecera col-3" @click="filterReservas('comun')">
        Reserva de Vacante
        <template v-if="countByType.comun > 0">({{ countByType.comun }})</template>
      </div>
      <div class="cabecera col-3" @click="filterReservas('cambioInstr')">
        Cambio de Instrumento
        <template v-if="countByType.cambioInstr > 0">({{ countByType.cambioInstr }})</template>
      </div>
      <div class="cabecera col-3" @click="filterReservas('cambioProf')">
        Cambio de Profesor
        <template v-if="countByType.cambioProf > 0">({{ countByType.cambioProf }})</template>
      </div>
      <div class="cabecera col-3" @click="listReservas('resumen')">Resumen</div>
    </div>

    <!-- Reservas (lista unica filtrada por tipo) -->
    <div v-show="filteredReservas.length > 0">
      <ReservaItem
        v-for="(item, k) in filteredReservas"
        :key="item.codigo ?? k"
        v-show="item.show"
        :item="item"
        @edit="editReserva(item)"
        @open="({ area, codigo }) => openPanel(area, codigo)"
        @show-prof="showProfList"
        @delete="delReservaItem(item)"
      />
    </div>

    <!-- Resumen -->
    <div v-show="arrResumen.length > 0">
      <h2>Resumen total por instrumento</h2>
      <div class="row">
        <div class="col-3"><h4>Instrumento</h4></div>
        <div class="col-2"><h4>Horas disponibles</h4></div>
        <div class="col-2"><h4>Horas reservadas</h4></div>
        <div class="col-2"><h4>Diferencia</h4></div>
        <div class="col-2"><h4>Diferencia en vacantes</h4></div>
      </div>
      <div><h2>Desgloce por docente</h2></div>
      <div
        v-for="(item, key) in arrResumen"
        :key="key"
        class="row recuadro lista"
        style="margin-bottom:30px;"
      >
        <h4>{{ item[0]?.nombre }}</h4>
        <div class="row" v-for="(i, idx) in item" :key="idx">
          <div class="col-3"><b>{{ i.instrumento }}</b></div>
          <div class="col-2">{{ i.cantHoras?.[1] }}</div>
          <div class="col-2">{{ i.cantReservado?.[1] }}</div>
          <div class="col-2">{{ i.diferencia?.[1] }}</div>
          <div class="col-2"></div>
        </div>
      </div>
    </div>
    <!-- Modal editar reserva -->
    <div v-if="showEditModal" class="modal-backdrop-custom" @click.self="closeEditModal">
      <div class="modal-card">
        <h4>Editar reserva</h4>

        <div class="mb-2 text-muted">
          {{ editReservaInfo.apellido }}, {{ editReservaInfo.nombre }}
        </div>

        <div class="mb-3">
          <label class="form-label">Tipo de reserva</label>
          <select v-model="editReservaInfo.cambio" class="form-select">
            <option v-for="t in arrTipoReserva" :key="t.codigo" :value="t.codigo">
              {{ t.nombre }}
            </option>
          </select>
        </div>

        <div class="mb-3">
          <label class="form-label">Carrera</label>
          <select v-model="editReservaInfo.codAlumnosCarreras" class="form-select">
            <option disabled value="">Seleccione...</option>
            <option v-for="c in arrCarrerasAlumno" :key="c.codigo" :value="c.codigo">
              {{ c.nombre }}
            </option>
          </select>
        </div>

        <div class="mb-3" v-if="editReservaInfo.cambio === 'cambioInstr'">
          <label class="form-label">Nuevo instrumento</label>
          <select
            v-model="editReservaInfo.codNuevoInstrumento"
            class="form-select"
          >
            <option disabled :value="null">Seleccione...</option>
            <option
              v-for="i in arrInstrumentos"
              :key="i.codigo"
              :value="i.codigo"
            >
              {{ i.nombre }}
            </option>
          </select>
        </div>

        <div class="mb-3">
          <label class="form-label">Profesor</label>
          <select v-model="editReservaInfo.codProfesor" class="form-select">
            <option disabled value="">Seleccione...</option>
            <option v-for="p in arrProfList" :key="p.codigo" :value="p.codigo">
              {{ p.nombre }}
            </option>
          </select>
        </div>

        <div class="d-flex justify-content-end gap-2">
          <button class="btn btn-secondary" @click="closeEditModal">
            Cancelar
          </button>
          <button class="btn btn-primary" @click="saveEditReserva">
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue"
import { api } from "@/api/api"
import { showModal } from "@/services/uiBus"
import { useImpersonation } from "@/views/admin/composables/useImpersonation"
import ReservaItem from "@/views/admin/components/ReservaItem.vue"

const { openUserPanel } = useImpersonation()

const selectedCiclo = ref("0")

const arrCiclos = ref([])
const arrReservas = ref([])
const filteredReservas = ref([])
const arrResumen = ref([])
const arrTotal = ref({})

const showSelectProfList = ref(false)
const arrProfList = ref([])
const currentCode = ref(null)
const showEditModal = ref(false)
const editReservaInfo = ref({})
const editReservaOriginal = ref(null)

const arrCarrerasAlumno = ref([])
const arrInstrumentos = ref([])
const arrTipoReserva = ref([
  { codigo: "comun", nombre: "Común" },
  { codigo: "cambioInstr", nombre: "Cambio de Instr." },
  { codigo: "cambioProf", nombre: "Cambio de Prof." },
])

const countByType = computed(() => ({
  comun: arrReservas.value.filter((i) => i.cambio === "comun").length,
  cambioInstr: arrReservas.value.filter((i) => i.cambio === "cambioInstr").length,
  cambioProf: arrReservas.value.filter((i) => i.cambio === "cambioProf").length,
}))
const listInstrumentos = async () => {
    const rInstrumentos = await api.get({
    entity: "instrumentos",
    action: "getInstrumentos",
  })
  arrInstrumentos.value = rInstrumentos.payload ?? []
}
const listCiclos = async () => {
  const r = await api.get({
    entity: "cicloslectivos",
    action: "getCiclosLectivos",
  })
  arrCiclos.value = r.payload ?? []
}

const listReservas = async (t = "comun") => {
  if (!selectedCiclo.value || selectedCiclo.value === "0") {
    showModal("Seleccione el ciclo lectivo")
    return
  }
  const r = await api.get({
    entity: "reservas",
    action: "getReservas",
    payload: {
        cicloLectivo: selectedCiclo.value,
        tipo: t 
    },
  })
  const arr = r.payload ?? []
  arrReservas.value = []
  arrResumen.value = []
  arrTotal.value = {}

  switch (t) {
    case "comun":
    case "cambioInstr":
    case "cambioProf":
      arrReservas.value = arr.map((it) => ({ ...it, show: it.show ?? true }))
      break
    case "resumen":
      arr.forEach((value) => {
        arrResumen.value.push(value)
        value.forEach((v) => {
          if (isNaN(arrTotal.value[v.instrumento])) arrTotal.value[v.instrumento] = 0
          arrTotal.value[v.instrumento] += v.diferencia?.[0] ?? 0
        })
      })
      break
  }
}
const filterReservas = (tipo) => {
  if (!selectedCiclo.value || selectedCiclo.value === "0") {
    showModal("Seleccione el ciclo lectivo")
    return
  }
  filteredReservas.value = arrReservas.value.filter((i) => i.cambio === tipo)
}
const showProfList = (codigo) => {
  currentCode.value = codigo
  showSelectProfList.value = true
}

const updProf = async (ev) => {
  const s = ev?.target
  if (!s || !s.value) return
  const ok = await showModal(
    `¿Confirma el cambio de docente a ${s.options[s.selectedIndex].text}?`,
    1
  )
  if (ok) {
    const d = {
      codigo: currentCode.value,
      newCodProfesor: s.value,
    }
    const r = await api.post({
      entity: "reservas",
      action: "updProfesor",
      payload: d,
    })
    if (!r.ok) showModal("No fue posible realizar el cambio en la reserva")
  }
  s.selectedIndex = 0
  currentCode.value = null
  showSelectProfList.value = false
}

const editReserva = async (item) => {
  console.log(item)
  showEditModal.value = true
  editReservaOriginal.value = { ...item }
  editReservaInfo.value = { ...item }

  const rCarreras = await api.get({
    entity: "carreras",
    action: "getCarrerasAlumno",
    payload: { codAlumno: item.codAlumno },
  })
  arrCarrerasAlumno.value = (rCarreras.payload ?? []).map((c) => ({
    codigo: c.codigo,
    nombre: c.nombreCorto,
  }))
}

const closeEditModal = () => {
  editReservaInfo.value = editReservaOriginal.value
    ? { ...editReservaOriginal.value }
    : {}
  editReservaOriginal.value = null
  showEditModal.value = false
}

const saveEditReserva = async () => {
  const {ok} = showModal("¿Confirma cambios en la reserva?",1)
  if (!ok) return
  const d = {
    codigo: editReservaInfo.value.codigo,
    codProfesor: editReservaInfo.value.codProfesor,
    codAlumnosCarreras: editReservaInfo.value.codAlumnosCarreras,
    codNuevoInstrumento: editReservaInfo.value.codNuevoInstrumento,
    cambio: editReservaInfo.value.cambio,
  }
  const r = await api.post({
    entity: "reservas",
    action: "updReserva",
    payload: d,
  })
  if (r.ok) {
    showModal("Datos actualizados")
    closeEditModal()
    listReservas(tipo.value)
  }
}

const delReserva = async (codReserva) => {
  const ok = await showModal("¿Confirma que desea borrar esta reserva?", 1)
  if (!ok) return false
  const r = await api.post({
    entity: "reservas",
    action: "delReserva",
    payload: { codReserva },
  })
  return r.ok
}

const delReservaItem = async (item) => {
  const ok = await delReserva(item.codigo)
  if (ok) item.show = false
}

const openPanel = (area, codigo) => {
  openUserPanel({ area, codigo })
}

const listProfesores = async () => {
  const r = await api.get({
    entity: "profesores",
    action: "getProfesores",
  })
  arrProfList.value = r.payload ?? []
}

onMounted(async () => {
  await listCiclos()
  await listProfesores()
  await listInstrumentos()
})
</script>

<style scoped>
.modal-backdrop-custom {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
}
.modal-card {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  width: 520px;
  max-width: 95%;
}
</style>
