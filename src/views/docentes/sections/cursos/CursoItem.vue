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
        v-if="curso.listaAbierta"
      >
        <AlumnoItem
          v-for="alumno in curso.alumnos"
          :alumno="alumno"
        />
      </ListaAlumnos>
      <div class="col-12 text-end mt-2">
        <a
          v-if="curso.listaAbierta"
          href="#"
          class="me-3"
          @click.prevent="copyEmails"
        >
          Copiar correos
        </a>
        <a href="#" @click.prevent="showHideList">
          {{ curso.listaAbierta ? 'Ocultar lista' : 'Ver lista' }}
        </a>
      </div>
    </template>
    <template v-else>
      <div>(No hay estudiantes inscriptos)</div>
    </template>
  </div>
</template>
<script setup>
import { showModal } from '@/services/uiBus'
import ListaAlumnos from './ListaAlumnos.vue'
import AlumnoItem from './AlumnoItem.vue';

const props = defineProps({
  curso: Object,
})
const emit = defineEmits(['toggle-estudiantes'])

const copyEmails = async () => {
  const emails = [...new Set(
    (props.curso?.alumnos ?? [])
      .map((alumno) => (alumno?.email ?? '').trim())
      .filter(Boolean)
  )]

  if (emails.length === 0) {
    await showModal('No hay correos para copiar')
    return
  }

  try {
    await navigator.clipboard.writeText(emails.join('; '))
    await showModal('Correos copiados al portapapeles')
  } catch {
    await showModal('No se pudo copiar al portapapeles')
  }
}

const showHideList = () => {
  emit('toggle-estudiantes')
}
</script>
