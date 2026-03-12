<template>
  <h3 class="h3cabecera">Listado de estudiantes inscriptos</h3>

  <CursoItem
    v-for="(curso, k) in cursos"
    :key="k"
    :curso="curso"
    @toggle-estudiantes="openCloseEstudiantesInscriptos(k)"
  />
</template>
<script setup>
    import {ref, onMounted} from 'vue'
    import CursoItem from './CursoItem.vue'
    import { api } from '@/api/api'
    const cursos = ref([])

    onMounted(async () => {
        const c = await getCursos()
        c.forEach(v=>v.listaAbierta=false)
        console.log(c)
        cursos.value = c
    })
    const getCursos = async () => {
        const r = await api.get({
            entity: "cursos",
            action: 'getCursos',
        })
        return r.payload.cursos
    }
    const openCloseEstudiantesInscriptos = async (k) => {
        if (cursos.value[k].listaAbierta) {
            cursos.value[k].listaAbierta=false
            cursos.value[k].alumnos = []
            return
        }
        const r = await api.get({
            entity:"cursos",
            action:"getEstudiantesInscriptos",
            payload:{
                codPlHorarios:cursos.value[k].codPlHorarios,
                tipoMateria:cursos.value[k].tipoMateria,
            },
        })
        cursos.value[k].alumnos = r.payload
        cursos.value[k].listaAbierta = true
    }
</script>
