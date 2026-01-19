<template>
  <div
    class="row lista delimitador"
  >
    <div class="col-md-2">{{ alumno.nrodoc }}</div>

    <div class="col-md-3">
      {{ alumno.apellido }}, {{ alumno.nombre }}
      <i v-if="alumno.esCondicional">(Condicional)</i>
    </div>

    <!-- 1° Cuatrimestre -->
    <div class="col-md-3">
      <template v-if="alumno.esCondicional">
        Adeuda correlativas
      </template>

      <select
        v-else
        v-model="alumno.notanumerica1"
        :disabled="disabled1"
        @change="update(1, alumno.notanumerica1)"
      >
        <option disabled value="">Seleccione...</option>
        <!--<option
          v-for="op in alumno.esConceptual ? alumno.conceptuales : alumno.numericas"
          :key="op.value"
          :value="op.value"
        >
          {{ op.label }}
        </option>-->
      </select>
    </div>

    <!-- 2° Cuatrimestre -->
    <div class="col-md-3">
      <template v-if="alumno.esCondicional">
        Adeuda correlativas
      </template>

      <select
        v-else
        v-model="alumno.notanumerica2"
        :disabled="disabled2"
        @change="update(2, alumno.notanumerica2)"
      >
        <option disabled value="">Seleccione...</option>
        <!--<option
          v-for="op in alumno.esConceptual ? alumno.conceptuales : alumno.numericas"
          :key="op.value"
          :value="op.value"
        >
          {{ op.label }}
        </option>-->
      </select>
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'

const props = defineProps({
  alumno: Object,
  allowCalif: Array
})

const disabled1 = false//computed(() => !props.allowCalif[0] && !props.allowCalif[2])
const disabled2 = false//computed(() => !props.allowCalif[1] && !props.allowCalif[2])

const emit = defineEmits(['update'])

function update(cuatri, value) {
  emit('update', props.alumno.codcursosalumnos, cuatri, value)
}
</script>
