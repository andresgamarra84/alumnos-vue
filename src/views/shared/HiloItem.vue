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
        <span :class="{ 'fw-bold': sinLeer, 'opacity-75': !sinLeer }">
          {{ item.asunto }}
        </span>
      </div>
      <div class="col-6 text-end">{{ item.fechaIngreso }}</div>
      <slot />   
    </div>
</template>
<script setup>
  import { computed } from 'vue'
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
  // 0 = mensaje nuevo del alumno, 2 = el alumno respondio en el hilo; en ambos hay algo para leer
  const sinLeer = computed(() => props.item.estadoMensaje === 0 || props.item.estadoMensaje === 2)
</script>
