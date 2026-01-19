<script setup>
import { ref } from 'vue'

const props = defineProps({
  alumno: Object,
  esInstrumento: Boolean
})

const editando = ref(false)
const nuevoDia = ref(null)
const nuevaHora = ref(null)
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
        <span>Día: {{ alumno.horarios.dia }}</span>
        <span>Hora: {{ alumno.horarios.hora }}</span>
        <a @click="editando = !editando">Editar</a>
      </div>

      <div v-if="editando" class="col-12 d-flex gap-2 mt-1">
        <select v-model="nuevoDia">
          <option disabled value="">Seleccione día</option>
        </select>

        <select v-model="nuevaHora">
          <option disabled value="">Seleccione hora</option>
        </select>
      </div>
    </template>
  </div>
</template>
