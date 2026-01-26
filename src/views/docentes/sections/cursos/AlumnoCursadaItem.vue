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
        v-model="nota1"
        :disabled="disabled1"
        @change="update(1, nota1)"
      >
        <option disabled :value="null">Sin Calificar</option>
        <option
          v-for="(op,k) in alumno.esConceptual ? parametros.codConceptuales : parametros.notaNumerica"
          :value="k"
        >
          {{ op }}
        </option>
      </select>
    </div>

    <!-- 2° Cuatrimestre -->
    <div class="col-md-3">
      <template v-if="alumno.esCondicional">
        Adeuda correlativas
      </template>

      <select
        v-else
        v-model="nota2"
        :disabled="disabled2"
        @change="update(2, nota2)"
      >
        <option disabled :value="null">Sin calificar</option>
        <option
          v-for="(op,k) in alumno.esConceptual ? parametros.codConceptuales : parametros.notaNumerica"
          :value="k"
        >
          {{ op }}
        </option>
      </select>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'

const props = defineProps({
  alumno: Object,
  parametros:Object,
  allowCalif: Array
})

const disabled1 = false//computed(() => !props.allowCalif[0] && !props.allowCalif[2])
const disabled2 = false//computed(() => !props.allowCalif[1] && !props.allowCalif[2])
const nota1 = ref(null)
const nota2 = ref(null)
const emit = defineEmits(['update'])
onMounted(()=>{
  nota1.value = props.alumno.esConceptual ? props.alumno.notaconceptual1 : props.alumno.notanumerica1
  nota2.value = props.alumno.esConceptual ? props.alumno.notaconceptual2 : props.alumno.notanumerica2
})
function update(cuatri, value) {
  emit('update', props.alumno, cuatri, value)
}
</script>
