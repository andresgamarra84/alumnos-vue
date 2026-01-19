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
    <template>
      <ListaAlumnos>
        <AlumnoCursadaItem
          v-for="alumno in alumnos"
          :key="alumno.codcursosalumnos"
          :alumno="alumno"
          :allow-calif="allowCalif"
          @update="updCursada"
        />
      </ListaAlumnos>
    </template>
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
    const allowCalif = ref([true,true,true])
    onMounted(async()=>{
        const r = await api.get({
            entity:"cursos",
            action: "getCursos",
        })
        cursos.value = r.payload.cursos
    })
    const listEstudiantes = async ()=> {
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
    const updCursada = async ()=>{}
</script>
