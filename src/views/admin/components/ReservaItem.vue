<template>
  <div class="row lista">
    <div class="col-3">
      {{ item.codigo }}
      -
      <a @click="$emit('open', { area: 'estudiantes', codigo: item.codAlumno })">
        {{ item.apellido }}, {{ item.nombre }}
      </a>
    </div>
    <div class="col-2">{{ item.nombreProf }}</div>
    <div class="col-3">{{ item.carrera }} ({{ item.instrumento }})</div>
    <div class="col-3">
      <template v-if="item.cambio != 'cambioInstr'"">{{ item.estado }}</template>
      <template v-else>Cambio a {{ item.nuevoInstrumento }}</template>
    </div>
    <div class="col-1">
      {{ item.fecha }}
      <a class='link-primary' @click="$emit('edit')">Editar</a> - <a class='link-danger' @click="$emit('delete')">Borrar</a>
    </div>
  </div>
</template>

<script setup>
defineProps({
  item: { type: Object, required: true },
})
defineEmits(["edit", "open", "delete"])
</script>
