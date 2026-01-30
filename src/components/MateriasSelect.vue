<template>
  <template v-if="materias.length">
    <label v-if="showLabel">Materia:</label>
    <select :value="modelValue" @change="onChange">
      <option disabled value="">Seleccione una materia</option>

      <option
        v-for="item in materias"
        :key="item.codigo"
        :value="item.codigo"
        :disabled="item.disabled"
      >
        {{ item.nombre }}
      </option>
    </select>
  </template>
</template>
<script setup>
const props = defineProps({
  materias: {
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
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

function onChange(event) {
  emit('update:modelValue', event.target.value)
  emit('change', event.target.value)
}
</script>