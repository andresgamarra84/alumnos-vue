<template>
  <div class="row lista py-1">
    <div class="col-md-2"><strong>DNI:</strong> {{ alumno.nrodoc }}</div>
    <div class="col-md-5">
      {{ alumno.apellido }}, {{ alumno.nombre }}
      <span v-if="alumno.condicion">(Condicional)</span>
    </div>
    <div class="col-md-5">{{ alumno.email }}</div>

    <template v-if="esInstrumento">
      <div class="col-12 d-flex align-items-baseline mt-1">
        <div class="col-4 text-center">Dia: {{ diaActual || '-' }}</div>
        <div class="col-4 text-center">Hora: {{ horarioActual || '-' }}</div>
        <div class="col-4 text-end">
          <a href="#" @click.prevent="desplegarSelectHorario">
            {{ editando ? 'Cancelar' : 'Editar' }}
          </a>
        </div>
      </div>

      <div v-if="editando" class="col-12 d-flex gap-2 align-items-baseline mt-1">
        <select :value="nuevoDia" @change="updHoras">
          <option selected disabled value="">Seleccione el dia...</option>
          <option
            v-for="(it, key) in arrDias"
            :key="key"
            :value="key"
          >
            {{ key }}
          </option>
        </select>

        <select :value="nuevaHora" @change="setHora">
          <option selected disabled value="">Seleccione la hora...</option>
          <option
            v-for="(it, j) in arrHoras"
            :key="`${it[0]}-${j}`"
            :value="j"
          >
            {{ it[1] }}
          </option>
        </select>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { api } from '@/api/api'
import { showModal } from '@/services/uiBus'

const props = defineProps({
  alumno: Object,
  esInstrumento: Boolean,
})

const editando = ref(false)
const nuevoDia = ref('')
const nuevaHora = ref('')
const arrDias = ref({})
const arrHoras = ref([])

const horarioActual = computed(() => {
  if (props.alumno?.datosInstrumento?.hora) return props.alumno.datosInstrumento.hora
  return props.alumno?.horario ?? ''
})

const diaActual = computed(() => props.alumno?.datosInstrumento?.dia ?? '')

const codInstrumento = computed(() => (
  props.alumno?.datosInstrumento?.codInstrumento
  ?? props.alumno?.codInstrumento
  ?? null
))

const wasConfirmed = (result) => result === true || result?.ok === true

const resetEdicion = () => {
  editando.value = false
  nuevoDia.value = ''
  nuevaHora.value = ''
  arrHoras.value = []
}

const hydrateHoras = (dia) => {
  const franjas = arrDias.value?.[dia] ?? []
  arrHoras.value = franjas.map((franja, key) => [key, franja?.hora, franja?.duracion])
}

const listDias = async () => {
  if (!codInstrumento.value) {
    await showModal('No se encontró el instrumento de la inscripción')
    return false
  }

  const r = await api.get({
    entity: 'cursoshorarios',
    action: 'getDiasCursos',
    payload: {
      codCursosAlumnos: props.alumno.codCursosAlumnos,
    },
  })

  const payload = r.payload ?? {}
  arrDias.value = payload?.[codInstrumento.value] ?? payload
  return true
}

const desplegarSelectHorario = async () => {
  if (editando.value) {
    resetEdicion()
    return
  }

  const ok = await listDias()
  if (!ok) return

  editando.value = true
  nuevoDia.value = diaActual.value
  nuevaHora.value = ''

  if (nuevoDia.value) {
    hydrateHoras(nuevoDia.value)
  }
}

const updHoras = (event) => {
  nuevoDia.value = event?.target?.value ?? ''
  nuevaHora.value = ''
  hydrateHoras(nuevoDia.value)
}

const setHora = async (event) => {
  const horaIndex = event?.target?.value
  if (horaIndex === undefined || horaIndex === null || horaIndex === '') return

  const confirm = await showModal('¿Confirma el cambio de horario para este alumno?', 1)
  if (!wasConfirmed(confirm)) {
    nuevaHora.value = ''
    return
  }

  const horaSeleccionada = arrHoras.value[horaIndex]
  const arrNuevaFranja = arrDias.value?.[nuevoDia.value]?.[horaSeleccionada?.[0]]

  if (!arrNuevaFranja) {
    await showModal('No se encontró la franja horaria seleccionada')
    return
  }

  const r = await api.post({
    entity: 'cursos',
    action: 1,
    payload: {
      arrInscripcion: props.alumno,
      arrNuevaFranja,
    },
  })

  if (!r.ok) return

  if (!props.alumno.datosInstrumento) {
    props.alumno.datosInstrumento = {}
  }

  props.alumno.datosInstrumento.dia = nuevoDia.value
  props.alumno.datosInstrumento.hora = horaSeleccionada?.[1] ?? ''
  props.alumno.horario = horaSeleccionada?.[1] ?? props.alumno.horario

  await showModal('Datos actualizados')
  resetEdicion()
}
</script>