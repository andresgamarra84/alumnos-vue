<template>
<div class="p-2">
    <h3 class="h3cabecera">Configuración del Panel de Estudiantes</h3>

    <label><input type="checkbox" v-model="config.reserva"> Reserva de vacante</label><br>
    <label><input type="checkbox" v-model="config.inscrMaterias"> Inscripción a materias</label><br>
    <label><input type="checkbox" v-model="config.inscrMateriasIngresantes"> Inscripción a materias para ingresantes</label><br>

    <label>
    <input type="checkbox" v-model="config.inscrConReserva">
    Inscripción instrumento (reserva + docente asignado)
    </label><br>

    <label>
    <input type="checkbox" v-model="config.inscrInstrADesignar">
    Inscripción instrumento (reserva + docente a designar)
    </label><br>

    <label>
    <input type="checkbox" v-model="config.inscrSinReserva">
    Inscripción instrumento sin reserva
    </label><br>

    <label>
    <input type="checkbox" v-model="config.inscrListaEsp">
    Inscripción instrumento lista de espera
    </label><br>

    <label><input type="checkbox" v-model="config.inscrExamenes"> Inscripción a exámenes</label><br>
    <label><input type="checkbox" v-model="config.inscrCarreras"> Inscripción a carreras</label><br>
    <label><input type="checkbox" v-model="config.habilitarActividades"> Sección de Actividades</label><br>

    <label><input type="checkbox" v-model="config.cambioCatedra"> Solicitud de cambio de cátedra</label><br>
    <label><input type="checkbox" v-model="config.solicitudMesa"> Solicitud de mesa de examen</label><br>
    <label><input type="checkbox" v-model="config.solicitudCarrera"> Solicitud de nueva carrera</label><br>
    <label><input type="checkbox" v-model="config.solicitudAnalitico"> Solicitud de analítico</label><br>
    <label><input type="checkbox" v-model="config.solicitudConstancia"> Constancia de alumno regular</label>
</div>

<div class="p-2">
    <h3 class="h3cabecera">Configuración del Panel de Docentes</h3>
    <label><input type="checkbox" v-model="config.cargarNotasCursada1"> Cargar notas 1º Cuatr.</label><br>
    <label><input type="checkbox" v-model="config.cargarNotasCursada2"> Cargar notas 2º Cuatr.</label>
</div>

<div class="p-2">
    <h3 class="h3cabecera">Configuración de preinscripciones</h3>
    <label><input type="checkbox" v-model="config.preinscripcion"> Preinscripción ingresantes</label><br>
    <label><input type="checkbox" v-model="config.preinscripcionPasesEquiv"> Preinscripción equivalencias</label><br>

    <label>F. Nac mínima</label>
    <input type="date" v-model="config.fNacMinima"><br>

    <label>F. Nac FOBA Adultos</label>
    <input type="date" v-model="config.fNacAdultos">
</div>

<button @click="setConfig" class="btn btn-primary">Guardar Cambios</button>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from '@/api/api'
import { showModal } from '@/services/uiBus'

const config = ref({})

const getConfig = async () => {
  const r = await api.get({
    entity:"config",
    action:"getConfig"
  })
  config.value = r.payload ?? {}
}

const setConfig = async () => {
  const r = await api.post({
    entity: "config",
    action: "setConfig",
    payload: config.value,
  })

  if (r.ok) showModal("Cambios guardados")
}

onMounted(() => {
  getConfig()
})
</script>
