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
    <template v-if="puedeAgregarExternos">
      <div class='col-6 text-center mt-4'><a @click='addExternal(0)'>Agregar oyente</a></div>
		  <div class='col-6 text-center mt-4'><a @click='addExternal(1)'>Agregar itinerante</a></div>
    </template>
    <template v-if="curso.cantInscriptos > 0">
      <ListaAlumnos
        v-if="curso.listaAbierta"
      >
        <AlumnoItem
          v-for="alumno in curso.alumnos"
          :key="alumno.codcursosalumnos ?? alumno.codinscripcionmateria ?? alumno.nrodoc"
          :es-instrumento="curso.esInstrumento"
          :alumno="alumno"
          :franjas="curso.franjas"
          @update-franja="emit('update-franja', $event)"
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
import { api } from '@/api/api';
import ListaAlumnos from './ListaAlumnos.vue'
import AlumnoItem from './AlumnoItem.vue';
const props = defineProps({
  curso: {
    type: Object,
  },
  puedeAgregarExternos: {
    type: Boolean,
    default:false
  }
})
const emit = defineEmits(['toggle-estudiantes', 'update-franja'])

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
const addExternal = async (type=0) => {
  const tipoAlumno = type == 0 ? "Oyente" : "Itinerante"
  const respuestaNrodoc = await showModal(
    "Nro de DNI",
    2,
    "Ingresar estudiante "+tipoAlumno
  )
  if (!respuestaNrodoc.value) {
    showModal("El campo no puede estar vacío")
    return;
  }
  const nrodoc = respuestaNrodoc.value
  const { payload } = await api.get({
    entity: "cursos",
    action: "buscarEstudiantePorDni",
    payload: {
      tipo: type,
      nrodoc: nrodoc
    }
  })
  const nombre = payload.nombre
  const email = payload.email
  const nombreApellido = await showModal(
    "Apellido y nombre",
    2,
    "Ingresar estudiante "+tipoAlumno,
    nombre
  )
  if (!nombreApellido.value) {
    showModal.show("El campo no puede estar vacío")
    return
  }
  const modalEmail = await showModal(
    "Correo electrónico",
    2, 
    "Ingresar estudiante "+tipoAlumno,
    email
  )
  if (!modalEmail.value) {
    showModal("El campo no puede estar vacío")
    return
  }    
  const confirma = await showModal(
    "¿Confirma inscripción a la unidad curricular?", 
    1,
    "Ingresar estudiante "+tipoAlumno
  )
  if (!confirma.ok){
    return
  }
  const r = await api.post({
    entity: "cursos",
    action: "agregarEstudianteExterno",
    payload: {
      curso: props.curso,
      nrodoc,
      nombre,
      email,
      tipo: type
    }
  })
  if (r.ok) showModal("El estudiante fue ingresado al curso")
}
const showHideList = () => {
  emit('toggle-estudiantes')
}
</script>
