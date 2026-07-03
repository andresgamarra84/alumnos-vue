<template>
  <h3 class="h3cabecera">Listado de estudiantes inscriptos</h3>

  <CursoItem
    v-for="(curso, k) in cursos"
    :key="k"
    :curso="curso"
    @toggle-estudiantes="openCloseEstudiantesInscriptos(k)"
    @update-franja="updateFranjaInscripcion"
    :puede-agregar-externos="puedeAgregarExternos"
  />
</template>
<script setup>
    import {ref, onMounted} from 'vue'
    import CursoItem from './CursoItem.vue'
    import { api } from '@/api/api'
    const cursos = ref([])
    const puedeAgregarExternos = ref(true)

    onMounted(async () => {
        const c = await getCursos()
        const { payload } = await api.get({
            entity: 'cursos',
            action: 'puedeAgregarExternos'
        })
        //puedeAgregarExternos.value = payload;
        c.forEach(v => {
            v.listaAbierta = false
            v.alumnos = []
            v.franjas = {}
        })
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
            cursos.value[k].franjas = {}
            return
        }
        const r = await api.get({
            entity:"cursos",
            action:"getEstudiantesInscriptosTest",
            payload:{
                codPlHorarios:cursos.value[k].codPlHorarios,
                tipoMateria:cursos.value[k].tipoMateria,
            },
        })
        cursos.value[k].alumnos = r.payload.alumnos
        cursos.value[k].franjas = r.payload.franjas
        cursos.value[k].listaAbierta = true
    }
    const updateFranjaInscripcion = async (d) => {
        const r = await api.post({
            entity:"cursos",
            action:"updateFranjaInscripcion",
            payload: d
        })
        cursos.value.forEach(v=>{
            v.listaAbierta = false
        })
    }
</script>
