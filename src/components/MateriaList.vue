<template>
  <div>
    <MateriaItem
      v-for="(materia, i) in materiasCarrera"
      :key="i"
      :materia="materia"
      :materias="materias"
      @delete="emit('delete',i)"
      @update-espacio="codMateria => updateEspacio(codMateria, i)"
      @nuevo="emit('nuevo-examen',i)"
    />
  </div>
</template>

<script setup>
import MateriaItem from './MateriaItem.vue';
defineProps({
  materiasCarrera: Array,
  materias: Array,
});
const updateEspacio = (codMateria, k) => {
  emit("update-espacio", codMateria, k)
}
const emit = defineEmits(["delete", "nuevo-examen", "update-espacio"])

</script>
