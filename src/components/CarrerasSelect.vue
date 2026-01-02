<script setup>
defineProps({
  carreras: {
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
  <div v-if="carreras.length">
    <label>Carrera:</label>
    <select :value="modelValue" @change="onChange">
      <option disabled selected value="">Seleccione una carrera</option>

      <option
        v-for="(item, k) in carreras"
        :key="item.codigo"
        :value="k"
        :disabled="item.disabled"
      >
        {{ item.nombre }}
      </option>
    </select>
  </div>
</template>
