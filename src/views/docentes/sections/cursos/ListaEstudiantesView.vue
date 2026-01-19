<template>
  <h3 class="h3cabecera">Listado de alumnos inscriptos</h3>

  <CursoItem
    v-for="(curso, k) in cursos"
    :key="k"
    :curso="curso"
  />
</template>
<script setup>
    import {ref, onMounted} from 'vue'
    import CursoItem from './CursoItem.vue'
    import { api } from '@/api/api'
    const cursos = ref([])
    onMounted(async () => {
        cursos.value = await getCursos()
    })
    const getCursos = async () => {
        const r = await api.get({
            entity: "cursos",
            action: 'getCursos',
        })
        return r.payload.cursos
    }
</script>
