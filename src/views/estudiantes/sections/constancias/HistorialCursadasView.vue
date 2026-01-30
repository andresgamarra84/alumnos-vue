<template>
<h3 class='h3cabecera'>Histórico de cursadas</h3>
<label>Ciclo lectivo</label>
<select class='w-100' @change="listAllCursadas()" v-model="anio">
    <option selected disabled>Seleccione el año...</option>
    <option v-for="n in 5" :value="n+2021">{{n + 2021}}</option>
</select>
<div v-for='item in arrAllCursadas' style='padding-bottom:30px;'>
    <h3>{{item.nombreCarrera}} <template v-if='item.instrumento'>({{item.instrumento}})</template></h3>
    <div v-for='(it, key) in item.cursada' class='lista delimitador text-center row centrado'>
        <div class='col-12 col-sm-3 flex-container'>{{it.nombreCurso}} <template v-if="it.inscripcionBorrada"> - (Inscripción borrada)</template></div>
        <div class='col-6 col-sm-3 flex-container'>
            <div>Nota 1er cuatr.: <template v-if='it.notaNumerica1'>{{it.notaNumerica1}}</template><template v-else>{{it.notaConceptual1}}</template></div>
            <div>Nota 2do cuatr.: <template v-if='it.notaNumerica2'>{{it.notaNumerica2}}</template><template v-else>{{it.notaConceptual2}}</template></div>
        </div>
        <div class='col-6 col-sm-3'>{{it.fechaInscripcion}}</div>
        <div class='col-12 col-sm-3'>{{it.nombreProfesor}}</div>
    </div>	
</div>
</template>
<script setup>
import { ref } from 'vue'
import { api } from '@/api/api';
const arrAllCursadas = ref([])
const anio = ref(null)
const listAllCursadas = async () => {
    const r = await api.get({
        entity: "calificaciones",
        action: "getHistoricoCursadas",
        payload: {
            anio : anio.value
        }
    })
    arrAllCursadas.value = r.payload
};
</script>