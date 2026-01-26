<template>
  <div class="p-3">
    <h3 class="h3cabecera">Calificación de cursada</h3>
  </div>
	<div>
		<label>Ciclo lectivo:</label>
		<select v-model="anioSeleccionado">
			<option :value='null' disabled>Seleccione</option>
			<option v-for='n in 4' :value='n+2022'>{{n+2022}}</option>
		</select>
	</div>
    <div>
		<label>Curso:</label>
		<select v-model="cursoSeleccionado" @change='listEstudiantes'>
			<option :value='null' disabled>Seleccione</option>
			<option v-for='curso in cursos' :value='curso.codPlHorarios'>{{curso.nombreCurso}}</option>
		</select>
	</div>
  <ListaAlumnos v-if="alumnos.length>0">
    <AlumnoCursadaItem
      v-for="alumno in alumnos"
      :key="alumno.codcursosalumnos"
      :alumno="alumno"
      :parametros="parametros"
      :allow-calif="allowCalif"
      @update="updCursada"
    />
  </ListaAlumnos>
</template>
<script setup>
    import {ref, onMounted} from 'vue'
    import ListaAlumnos from './ListaAlumnos.vue'
    import AlumnoCursadaItem from './AlumnoCursadaItem.vue'
    import { api } from '@/api/api'
    const cursos = ref([])
    const cursoSeleccionado = ref(null) 
    const anioSeleccionado = ref(null)
    const alumnos = ref([])
    const parametros = ref({})
    const allowCalif = ref([true,true,true])
    onMounted(async()=>{
        cursos.value = await getCursos()
        parametros.value = await getParametrosCalificacion()
    })
    const getCursos = async () => {
      const r = await api.get({
          entity:"cursos",
          action: "getCursos",
      })
      return r.payload.cursos
    }
    const listEstudiantes = async ()=> {
      alumnos.value= []
      const r = await api.get({
        entity:"cursos",
        action:"getEstudiantesParaCalificar",
        payload:{
          codPlHorarios: cursoSeleccionado.value,
          anio : anioSeleccionado.value,
        }
      })
      alumnos.value = r.payload
    }
    const getParametrosCalificacion = async () => {
      const r = await api.get({
        entity:"cursos",
        action:"getParametrosCalificacion",
      })
      return r.payload
      
    }
    const updCursada = async (alumno, cuatri, calif)=>{
      const r = await api.post({
        entity:"cursos",
        action:"updCalificacionCursada",
        payload: {
          cursada:alumno,
          cuatrimestre:cuatri,
          calificacion:calif
        }
      })
    }
</script>
