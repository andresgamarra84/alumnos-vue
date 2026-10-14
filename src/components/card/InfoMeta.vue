<template>
  <div class="info-meta">
    <span v-if="$slots.icon" class="info-meta__icon info-meta__icon--svg" aria-hidden="true"><slot name="icon" /></span>
    <span v-else-if="icon" class="info-meta__icon" aria-hidden="true">{{ icon }}</span>
    <span v-if="label" class="info-meta__label">{{ label }}</span>
    <span class="info-meta__value"><slot /></span>
  </div>
</template>

<script setup>
// Fila "ícono + etiqueta + valor" para el cuerpo de un InfoCard.
// El ícono puede ser un emoji (prop `icon`) o un componente SVG (slot #icon, ej. lucide).
defineProps({
  icon: String,
  label: String,
});
</script>

<style scoped>
.info-meta { display: flex; align-items: baseline; gap: 8px; font-size: .95rem; }
.info-meta__icon { flex: 0 0 1.4em; text-align: center; }
.info-meta__icon--svg {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-texto-secundario);
}
.info-meta__icon--svg :deep(svg) { width: 16px; height: 16px; }
.info-meta__label { color: var(--color-texto-secundario); }
.info-meta__value { min-width: 0; overflow-wrap: anywhere; }
</style>
