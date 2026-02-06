<template>
  <template v-if="cursos.length">
    <label v-if="showLabel">Curso:</label>
    <select :value="modelValue" @change="onChange">
      <option disabled value="">Seleccione un curso</option>

      <option
        v-for="item in cursos"
        :key="item.codigo"
        :value="item.codigo"
      >
        {{ item.nombre }}
      </option>
    </select>
  </template>
</template>
<script setup>
const props = defineProps({
  cursos: {
    type: Array,
    required: true
  },
  modelValue: {
    type: [String, Number],
    default: ''
  },
  showLabel:{
    type:Boolean,
    default:true
  },
})

const emit = defineEmits(['update:modelValue', 'change'])

function onChange(event) {
  emit('update:modelValue', event.target.value)
  emit('change', event.target.value)
}
</script>