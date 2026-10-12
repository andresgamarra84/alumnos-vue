<template>
  <div class="info-card-grid" :style="{ '--min-col': minWidth }">
    <slot />
  </div>
</template>

<script setup>
// Grilla responsive: tantas columnas como entren con un ancho mínimo por tarjeta.
defineProps({
  minWidth: { type: String, default: '340px' },
});
</script>

<style scoped>
.info-card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(var(--min-col), 100%), 1fr));
  gap: 14px;
  margin-bottom: 20px;
}
</style>
