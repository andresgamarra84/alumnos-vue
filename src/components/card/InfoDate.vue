<template>
  <div class="info-date">
    <div class="info-date__top">{{ top }}</div>
    <div class="info-date__big">{{ big }}</div>
    <div v-if="bottom" class="info-date__bottom">{{ bottom }}</div>
  </div>
</template>

<script setup>
// Bloque tipo "hoja de calendario" para el slot #media de InfoCard.
defineProps({
  top: String,    // mes o día de la semana
  big: [String, Number], // día del mes
  bottom: String, // hora u otro texto
});
</script>

<style scoped>
.info-date {
  width: 64px;
  text-align: center;
  background: var(--color-fondo-principal);
  border: 1px solid var(--color-borde);
  border-radius: 8px;
  overflow: hidden;
}
.info-date__top { background: var(--color-acento); color: #fff; font-size: .7rem; font-weight: 700; text-transform: uppercase; padding: 2px 0; }
.info-date__big { font-size: 1.6rem; font-weight: 700; line-height: 1.2; }
.info-date__bottom { font-size: .75rem; color: var(--color-texto-secundario); padding-bottom: 3px; }
</style>
