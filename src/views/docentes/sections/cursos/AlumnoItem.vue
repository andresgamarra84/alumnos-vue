
<template>
  <div class="row lista py-1">
    <div class="col-md-2"><strong>DNI:</strong> {{ alumno.nrodoc }}</div>
    <div class="col-md-5">
      {{ alumno.apellido }}, {{ alumno.nombre }}
      <span v-if="alumno.condicion">(Condicional)</span>
    </div>
    <div class="col-md-5">{{ alumno.email }}</div>

    <template v-if="esInstrumento">
      <div class="col-12 d-flex justify-content-between mt-1">
        <span>Hora: {{ alumno.horario }}</span>
      </div>

      <div
        v-if="franjasDisponibles.length > 0"
        class="col-12 d-flex gap-2 mt-1 align-items-center"
      >
        <label class="mb-0">Horario de cursado:</label>
        <select v-model="horarioSeleccionado" @change="updateFranjaInscripcion">
          <option
            v-for="(franja, index) in franjasDisponibles"
            :key="`${franja.codplhorarios}-${franja.inicioFranja}`"
            :value="index"
          >
            {{ franja.dia }} {{ franja.hora }}
          </option>
        </select>
      </div>
    </template>
  </div>
</template>
<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  alumno: Object,
  esInstrumento: Boolean,
  franjas: {
    type: Object,
    default: () => ({})
  }
})
const emit = defineEmits(['update-franja'])

const horarioSeleccionado = ref('')

const getAlumnoValue = (keys) => {
  for (const key of keys) {
    const value = props.alumno?.[key]
    if (value !== undefined && value !== null && value !== '') {
      return value
    }
  }
  return null
}

const franjasDisponibles = computed(() =>
  Object.entries(props.franjas ?? {}).flatMap(([dia, franjasDia]) =>
    (Array.isArray(franjasDia) ? franjasDia : []).map((franja) => ({
      dia,
      codplhorarios: Number(franja?.codplhorarios ?? franja?.codPlHorarios),
      inicioFranja: Number(franja?.inicioFranja ?? franja?.incioFranja),
      hora: franja?.hora ?? ''
    }))
  )
)

const claveHorarioActual = computed(() => {
  const codplhorarios = Number(
    getAlumnoValue(['codplhorarios', 'codPlHorarios', 'codplhorario'])
  )
  const inicioFranja = Number(
    getAlumnoValue(['inicioFranja', 'incioFranja', 'inicio', 'iniciohorario'])
  )

  if (Number.isNaN(codplhorarios) || Number.isNaN(inicioFranja)) {
    return ''
  }

  const franjaActualIndex = franjasDisponibles.value.findIndex(
    (franja) =>
      franja.codplhorarios === codplhorarios &&
      franja.inicioFranja === inicioFranja
  )

  return franjaActualIndex >= 0 ? String(franjaActualIndex) : ''
})

const updateFranjaInscripcion = async () => {
  const indexSeleccionado = Number(horarioSeleccionado.value)
  emit('update-franja', {
    alumno: props.alumno,
    franja: franjasDisponibles.value[indexSeleccionado],
    indexSeleccionado,
  })
}
</script>