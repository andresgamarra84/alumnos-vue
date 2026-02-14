<template>
    <div
      :key="item.codHilo"
      class="row carrera-item"
      style="margin: 20px 0; cursor:pointer"
    >
      <div class="col-6">
        <a v-if="showNombre" @click="emit('open-panel')">
          {{ item.nombreAlumno }} {{ item.apellidoAlumno }} |
        </a>
        {{ item.asunto }}
      </div>
      <div class="col-6 text-end">{{ item.fechaIngreso }}</div>
      <slot />   
    </div>
</template>
<script setup>
  const props = defineProps({
    item : {
      type: Object,
      required: true
    },
    showNombre: {
      type: Boolean,
      value: false,
    }
  })
  const emit = defineEmits(["open-panel"])
</script>