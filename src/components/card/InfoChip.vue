<template>
  <component
    :is="clickable ? 'button' : 'span'"
    :type="clickable ? 'button' : undefined"
    :class="['info-chip', { 'info-chip--clickable': clickable }]"
  >
    <span class="info-chip__main"><slot /></span>
    <span v-if="$slots.secondary" class="info-chip__secondary"><slot name="secondary" /></span>
  </component>
</template>

<script setup>
// Píldora para horarios, sedes, franjas, etc. Con `clickable` se vuelve un botón.
defineProps({ clickable: Boolean });
</script>

<style scoped>
.info-chip {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 4px 12px;
  font: inherit;
  font-size: .9rem;
  color: var(--color-texto-principal);
  background: var(--color-fondo-principal);
  border: 1px solid var(--color-borde);
  border-radius: 999px;
}
.info-chip__main { font-weight: 600; }
.info-chip__secondary { font-size: .8rem; color: var(--color-texto-secundario); }

.info-chip--clickable { cursor: pointer; border-radius: 8px; padding: 8px 12px; min-width: 120px; transition: all .2s ease; }
.info-chip--clickable:hover {
  border-color: var(--color-acento);
  background: var(--color-acento-claro);
  transform: translateY(-1px);
}
.info-chip--clickable:focus-visible { outline: 2px solid var(--color-acento); outline-offset: 2px; }
</style>
