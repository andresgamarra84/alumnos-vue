<template>
  <h3 class="h3cabecera">Materias aprobadas</h3>
  <CarrerasSelect
    :carreras="arrCarreras"
    v-model="selectedCarrera"
    @change="listExamenes"
  />
  <MateriaList
    v-if="selectedCarrera !== null"
    :materias="arrExamenes"
    :codAlC="codAlC"
    :showSinCarrera="showSinCarrera"
    @reload="listExamenes"
  />
</template>
<script setup>
import { ref, onMounted } from 'vue';
import CarrerasSelect from '@/components/CarrerasSelect.vue';
import { api } from '@/api/api'
import MateriaList from '@/components/MateriaList.vue';

const arrCarreras = ref([])
const arrExamenes = ref([])
const selectedCarrera = ref(null)
const codAlC = ref(null)
const showSinCarrera = ref(false)

const listCarreras = async () => {
    arrCarreras.value = [];
    const r = await api.get({
        entity: "carreras",
        action: "getCarrerasAlumno"
    })
    r.payload.forEach(v=>{
        v.disabled = false;
        arrCarreras.value.push(v)
    })
}

const listExamenes = async () => {
    arrExamenes.value = [];
    //showSinCarrera.value = selectedCarrera.value == 0;
    const carrera = arrCarreras.value[selectedCarrera.value];
    codAlC.value = carrera.codigo
    const r = await api.get({
        entity: "examenes",
        action: "getMateriasAprobadas",
        payload: {
            codAlC: codAlC.value,
            codCarrera: carrera.codCarrera,
        },
    })
    arrExamenes.value = r.payload
}

onMounted(() => {
    listCarreras();
/*
    apiData.setData("constancias", 8);
    api.get().then(r => r.payload.forEach(v => arrMateriasAll.value.push(v)));

    apiData.setData("constancias", 2);
    api.get().then(r => r.payload.forEach(v => arrInst.value.push(v)));*/
});
</script>