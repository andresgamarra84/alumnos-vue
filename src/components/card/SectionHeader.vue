<template>
  <button
    type="button"
    class="section-header"
    :aria-expanded="!collapsed"
    @click="$emit('update:collapsed', !collapsed)"
  >
    <span class="section-header__chevron" :class="{ 'section-header__chevron--collapsed': collapsed }">▾</span>
    <span class="section-header__title">{{ title }}</span>
    <span v-if="count !== null" class="section-header__count">{{ count }}</span>
  </button>
</template>

<script setup>
// Encabezado de sección colapsable, reemplaza al h3cabecera suelto cuando
// la sección tiene una lista que conviene poder plegar.
defineProps({
  title: { type: String, required: true },
  count: { type: Number, default: null },
  collapsed: { type: Boolean, default: false },
});
defineEmits(['update:collapsed']);
</script>

<style scoped>
.section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  margin-bottom: 20px;
  padding: 10px;
  font: inherit;
  text-align: left;
  background: none;
  border: none;
  border-bottom: 2px solid var(--color-acento);
  cursor: pointer;
  color: var(--color-texto-principal);
}

.section-header__chevron {
  display: inline-block;
  color: var(--color-acento);
  transition: transform 0.2s ease;
}
.section-header__chevron--collapsed { transform: rotate(-90deg); }

.section-header__title {
  flex: 1 1 auto;
  font-size: 1.5rem;
  font-weight: bold;
  text-transform: uppercase;
}

.section-header__count {
  padding: 2px 10px;
  font-size: 0.85rem;
  font-weight: 700;
  color: #fff;
  background: var(--color-acento);
  border-radius: 999px;
}
</style>
