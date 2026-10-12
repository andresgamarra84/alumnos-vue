<template>
  <div class="info-stat">
    <div class="info-stat__label">{{ label }}</div>
    <div class="info-stat__value" :class="{ 'info-stat__value--empty': empty }">
      <template v-if="empty">—</template>
      <slot v-else />
    </div>
    <div v-if="$slots.caption" class="info-stat__caption"><slot name="caption" /></div>
  </div>
</template>

<script setup>
// Recuadro con un dato destacado (nota, cupo, cantidad). `empty` muestra un guion gris.
defineProps({
  label: String,
  empty: Boolean,
});
</script>

<style scoped>
.info-stat {
  flex: 1 1 0;
  min-width: 90px;
  padding: 8px 12px;
  text-align: center;
  background: var(--color-fondo-principal);
  border: 1px solid var(--color-borde);
  border-radius: 8px;
}
.info-stat__label { font-size: .75rem; text-transform: uppercase; letter-spacing: .03em; color: var(--color-texto-secundario); }
.info-stat__value { font-size: 1.5rem; font-weight: 700; line-height: 1.3; }
.info-stat__value--empty { color: var(--color-texto-secundario); font-weight: 400; }
.info-stat__caption { font-size: .8rem; color: var(--color-texto-secundario); }
</style>
