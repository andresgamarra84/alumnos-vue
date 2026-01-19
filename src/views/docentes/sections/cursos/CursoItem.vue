<template>
  <div class="lista row recuadro">
    <div class="col-12 fw-bold">
      {{ curso.nombreCurso }}
    </div>

    <div
      v-for="info in curso.infoCurso.horarios"
      class="col-12 text-muted"
    >
      {{ info.dia }} de {{ info.horario[0] }} a {{ info.horario[1] }},
      Aula {{ info.aula }} – Sede {{ info.sede }}
    </div>
    <template v-if="curso.infoCurso.inscriptos.length > 0">
      <ListaAlumnos
        v-if="abierto"
      >
        <AlumnoItem
          v-for="alumno in curso.infoCurso.inscriptos"
          :alumno="alumno"
        />
      </ListaAlumnos>
      <div class="col-12 text-end mt-2">
        <a @click="showHideList">
          {{ abierto ? 'Ocultar lista' : 'Ver lista' }}
        </a>
      </div>
    </template>
    <template v-else>
      <div>(No hay estudiantes inscriptos)</div>
    </template>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import ListaAlumnos from './ListaAlumnos.vue'
import AlumnoItem from './AlumnoItem.vue';
const abierto = ref(false)
const props = defineProps({
  curso: Object,
})
</script>