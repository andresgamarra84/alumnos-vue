<template>
  <div>
    <MateriaItem
      v-for="(materia, i) in materias"
      :key="materia.codigo"
      :materia="materia"
      :codAlC="codAlC"
      @reload="$emit('reload')"
    />
  </div>
</template>

<script setup>
import MateriaItem from './MateriaItem.vue';
defineProps({
  materias: Array,
  materia: Object,
  codAlC: Number,
});
</script>
