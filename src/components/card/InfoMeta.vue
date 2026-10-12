<template>
  <div class="info-meta">
    <span v-if="icon" class="info-meta__icon" aria-hidden="true">{{ icon }}</span>
    <span v-if="label" class="info-meta__label">{{ label }}</span>
    <span class="info-meta__value"><slot /></span>
  </div>
</template>

<script setup>
// Fila "ícono + etiqueta + valor" para el cuerpo de un InfoCard.
defineProps({
  icon: String,
  label: String,
});
</script>

<style scoped>
.info-meta { display: flex; align-items: baseline; gap: 8px; font-size: .95rem; }
.info-meta__icon { flex: 0 0 1.4em; text-align: center; }
.info-meta__label { color: var(--color-texto-secundario); }
.info-meta__value { min-width: 0; overflow-wrap: anywhere; }
</style>
