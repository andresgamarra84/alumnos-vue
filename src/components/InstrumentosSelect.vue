<script setup>
defineProps({
  materias: {
    type: Array,
    required: true
  },
  modelValue: {
    type: [String, Number],
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

function onChange(event) {
  emit('update:modelValue', event.target.value)
  emit('change', event.target.value)
}
</script>

<template>
  <div v-if="instrumentos.length">
    <label>Materia:</label>
    <select :value="modelValue" @change="onChange">
      <option disabled value="">Seleccione un Instrumento</option>

      <option
        v-for="item in materias"
        :key="item.codigo"
        :value="item.codigo"
      >
        {{ item.nombre }}
      </option>
    </select>
  </div>
</template>