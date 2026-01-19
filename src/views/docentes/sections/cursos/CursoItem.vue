<template>
  <div class="lista row recuadro">
    <div class="col-12 fw-bold">
      {{ curso.nombreCurso }}
    </div>

    <div
      v-for="info in curso.horarios"
      class="col-12 text-muted"
    >
      {{ info.dia }} de {{ info.horario[0] }} a {{ info.horario[1] }},
      Aula {{ info.aula }} – Sede {{ info.sede }}
    </div>
    <template v-if="curso.cantInscriptos > 0">
      <ListaAlumnos
        v-if="abierto"
      >
        <AlumnoItem
          v-for="alumno in alumnos"
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
const showHideList = async () => {
  const r = await api.get({
    entity:"cursos",
    action:"getEstudiantesInscriptos",
    payload:{
      codPlHorarios:curso.value.codPlHorarios,
      tipoMateria:curso.value.tipoMateria,
    },
})
}
</script>