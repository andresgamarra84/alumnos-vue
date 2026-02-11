<template>
  <div class="row lista delimitador">

    <div class="col-md-3">
      {{ materia.nombres?.nombre }}
      <MateriasSelect
        v-if="materia.esEspacio"
        :showLabel="false"
        :materias="materias"
        :modelValue="materia.infoExamen.codmateriaespacio"
        @change="updateEspacio"
      />
    </div>

    <template v-if="materia.esAprobada">
      <div class="col-md-2">
        Libro: {{ materia.infoExamen.libroletra }}{{ materia.infoExamen.libro }} acta {{ materia.infoExamen.acta }} -
        Nota:
        {{ materia.infoExamen.notanumerica || 'Aprobado' }}
      </div>

      <div class="col-md-2">
        {{ materia.infoExamen.fechaexamen }}
      </div>

      <div class="col-md-3">
        {{ materia.infoExamen.nombreinstitucion }}
      </div>

      <div class="col-md-2">
        <a @click="emit('delete')">Borrar examen</a>
      </div>
    </template>

    <template v-else>
      <div class="col-md-9">
        <a @click="emit('nuevo')">Agregar examen</a>
      </div>
    </template>
  </div>
</template>

<script setup>
import MateriasSelect from './MateriasSelect.vue';

const props = defineProps({
  materia: Object,
  materias:Array,
});
const updateEspacio = (codMateria) => {
  emit('update-espacio', codMateria)
}
const emit = defineEmits(['nuevo', 'delete', 'update-espacio']);

</script>
