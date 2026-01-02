<script setup>
defineProps({
  instrumentos: {
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
    <label>Instrumento:</label>
    <select :value="modelValue" @change="onChange">
      <option disabled selected value="">Seleccione un Instrumento</option>

      <option
        v-for="item in instrumentos"
        :key="item.codigo"
        :value="item.codigo"
      >
        {{ item.nombre }}
      </option>
    </select>
  </div>
</template>