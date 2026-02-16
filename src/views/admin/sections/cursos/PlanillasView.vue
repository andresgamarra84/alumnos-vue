<template>
  <div class="row g-4">
    <div class="col-12">
      <h3>Planillas de asistencia de estudiantes</h3>
      <div class="row g-3 align-items-end">
        <div class="col-12 col-md-6">
          <label class="form-label">Ano lectivo:</label>
          <select v-model="selectedYear" class="form-select">
            <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
          </select>
        </div>
        <div class="col-12 col-md-6">
          <label class="form-label">Sede:</label>
          <select v-model="sedeEst" class="form-select">
            <option value="S">Santa Fe</option>
            <option value="A">Anchorena</option>
          </select>
        </div>
        <div class="col-12 d-flex flex-column gap-2">
          <label>
            <input v-model="esInstrEst" type="checkbox" />
            Planillas de Instrumento/Canto
          </label>
          <label>
            <input v-model="porNombreEst" type="checkbox" />
            Ordenar por nombre de materia
          </label>
        </div>
        <div class="col-12 text-end">
          <button class="btn btn-primary" @click="plEstudiantes">Descargar</button>
        </div>
      </div>
    </div>

    <div class="col-12">
      <h3>Planillas de calificacion cuatrimestral</h3>
      <div class="row g-3 align-items-end">
        <div class="col-12 col-md-6">
          <label class="form-label">Ano lectivo:</label>
          <select v-model="selectedYear2" class="form-select">
            <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
          </select>
        </div>
        <div class="col-12 col-md-6">
          <label class="form-label">Seleccione el ciclo:</label>
          <select v-model="carreraCuatr" class="form-select">
            <option value="3">FOBA Ninos</option>
            <option value="1">FOBA Adultos</option>
            <option value="4">FOBA Adultos y Ninos</option>
            <option value="2">Superior</option>
          </select>
        </div>
        <div class="col-12 col-md-6">
          <label class="form-label">Seleccione la sede:</label>
          <select v-model="sedeCuatr" class="form-select">
            <option value="S">Santa Fe</option>
            <option value="A">Anchorena</option>
          </select>
        </div>
        <div class="col-12 col-md-6">
          <label class="form-label">Seleccione el tipo de materia:</label>
          <select v-model="tipoCuatr" class="form-select">
            <option value="1">Grupales</option>
            <option value="2">Instrumento</option>
            <option value="3">Instr. Arm.</option>
            <option value="4">Espacios Inst.</option>
          </select>
        </div>
        <div class="col-12 text-end">
          <button class="btn btn-primary" @click="plCuatrimestrales">Descargar</button>
        </div>
      </div>
    </div>

    <div class="col-12">
      <h3>Planillas de asistencia de docentes</h3>
      <div class="row g-3 align-items-end">
        <div class="col-12 col-md-6">
          <label class="form-label">Sede:</label>
          <select v-model="sedeDoc" class="form-select">
            <option value="S">Santa Fe</option>
            <option value="A">Anchorena</option>
          </select>
        </div>
        <div class="col-12 col-md-6">
          <label class="form-label">Fecha:</label>
          <input v-model="fechaDoc" type="date" class="form-control" />
        </div>
        <div class="col-12 text-end">
          <button class="btn btn-primary" @click="plDocentes">Descargar</button>
        </div>
      </div>
    </div>

    <div class="col-12">
      <h3>Planillas de asistencia a mesas de examen</h3>
      <div class="row g-3 align-items-end">
        <div class="col-12 col-md-6">
          <label class="form-label">Fecha:</label>
          <input v-model="fechaMesas" type="date" class="form-control" />
        </div>
        <div class="col-12 col-md-6 text-end">
          <button class="btn btn-primary" @click="plMesas">Descargar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { api } from "@/api/api"
import { showModal } from "@/services/uiBus"
import { useFileDownload } from "@/composables/useFileDownload"

const { downloadBlob } = useFileDownload()

const currentYear = new Date().getFullYear()
const years = Array.from({ length: 11 }, (_, i) => currentYear - i)

const today = new Date().toISOString().slice(0, 10)

const selectedYear = ref(currentYear)
const selectedYear2 = ref(currentYear)

const sedeEst = ref("S")
const esInstrEst = ref(false)
const porNombreEst = ref(false)

const carreraCuatr = ref("3")
const sedeCuatr = ref("S")
const tipoCuatr = ref("1")

const sedeDoc = ref("S")
const fechaDoc = ref(today)
const fechaMesas = ref(today)

const plEstudiantes = async () => {
  const payload = {
    anio: selectedYear.value,
    sede: sedeEst.value,
    ordenPorNombre: porNombreEst.value,
  }

  const action = esInstrEst.value ? "getPlanillaEstudiantesInstrumento" : "getPlanillaEstudiantes"

  const blob = await api.getPDF({
    entity: "planillas",
    action,
    payload,
  })

  downloadBlob(blob, "Planillas Estudiantes.pdf", "application/pdf")
}

const plDocentes = async () => {
  const payload = {
    sede: sedeDoc.value,
    fecha: fechaDoc.value,
  }

  const blob = await api.getPDF({
    entity: "planillas",
    action: "getPlanillaDocentes",
    payload,
  })

  downloadBlob(blob, "AsistenciaDocentes.pdf", "application/pdf")
}

const plMesas = async () => {
  if (!fechaMesas.value) {
    showModal("Debe seleccionar una fecha")
    return
  }

  const payload = { fecha: fechaMesas.value }

  const blob = await api.getPDF({
    entity: "planillas",
    action: "getPlanillaMesas",
    payload,
  })

  downloadBlob(blob, `Asistencia Mesas docentes - ${fechaMesas.value}.pdf`, "application/pdf")
}

const plCuatrimestrales = async () => {
  const payload = {
    tipoMateria: tipoCuatr.value,
    sede: sedeCuatr.value,
    ciclo: carreraCuatr.value,
    anio: selectedYear2.value,
  }

  const blob = await api.getPDF({
    entity: "planillas",
    action: "getPlanillaCuatrimestral",
    payload,
  })

  downloadBlob(blob, "cuatrimestrales.pdf", "application/pdf")
}
</script>
