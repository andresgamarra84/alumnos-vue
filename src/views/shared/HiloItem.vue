<template>
    <div
      :key="item.codHilo"
      class="row carrera-item hilo-item"
      style="margin: 20px 0; cursor:pointer"
    >
      <!-- Mientras se envía una respuesta o se carga la conversación de este hilo: spinner sobre el hilo, el resto de la pantalla sigue operable -->
      <div v-if="textoOcupado" class="hilo-item__cargando" role="status" :aria-label="textoOcupado" @click.stop>
        <div class="spinner-border text-primary" aria-hidden="true"></div>
        <span>{{ textoOcupado }}</span>
      </div>
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
    },
    // true = hay un envío en curso en este hilo: se superpone un spinner y se bloquea la interacción con él
    enviando: {
      type: Boolean,
      default: false,
    },
    // true = se está cargando la conversación de este hilo (mismo efecto que enviando, con otro texto)
    cargando: {
      type: Boolean,
      default: false,
    }
  })
  const emit = defineEmits(["open-panel"])
  const textoOcupado = computed(() => props.enviando ? 'Enviando…' : props.cargando ? 'Cargando conversación…' : '')
  // 0 = mensaje nuevo del alumno, 2 = el alumno respondio en el hilo; en ambos hay algo para leer
  const sinLeer = computed(() => props.item.estadoMensaje === 0 || props.item.estadoMensaje === 2)
</script>

<style scoped>
.hilo-item {
  position: relative;
}
.hilo-item__cargando {
  position: absolute;
  inset: 0;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  border-radius: 8px;
  cursor: progress;
  background: rgba(127, 127, 127, 0.35);
  background: color-mix(in srgb, var(--color-fondo-principal) 70%, transparent);
  font-weight: 600;
}
</style>
