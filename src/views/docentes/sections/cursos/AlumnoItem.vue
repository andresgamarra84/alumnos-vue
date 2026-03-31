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

  const franjaActual = franjasDisponibles.value.find(
    (franja) =>
      franja.codplhorarios === codplhorarios &&
      franja.inicioFranja === inicioFranja
  )

  return franjaActual
    ? `${franjaActual.codplhorarios}-${franjaActual.inicioFranja}`
    : ''
})

watch(
  claveHorarioActual,
  (value) => {
    horarioSeleccionado.value = value
  },
  { immediate: true }
)
</script>

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
        <select v-model="horarioSeleccionado">
          <option
            v-for="franja in franjasDisponibles"
            :key="`${franja.codplhorarios}-${franja.inicioFranja}`"
            :value="`${franja.codplhorarios}-${franja.inicioFranja}`"
          >
            {{ franja.dia }} {{ franja.hora }}
          </option>
        </select>
      </div>
    </template>
  </div>
</template>
