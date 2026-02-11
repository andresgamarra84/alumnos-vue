<script setup>
defineProps({
  carreras: {
    type: Array,
    required: true
  },
  modelValue: {
    type: [String, Number],
    default: ''
  },
  showLabel: {
    type: Boolean,
    default: true
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
    <label v-if="showLabel">Carrera:</label>
    <select v-model="modelValue" @change="onChange">
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
