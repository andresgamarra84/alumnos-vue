<template>
<h3 class='h3cabecera'>Histórico de cursadas</h3>
<label>Ciclo lectivo</label>
<select class='w-100' @change="listAllCursadas()" v-model="ciclolectivo">
    <option selected disabled>Seleccione el año...</option>
    <option v-for="anio in arrAnios" :value="anio.codciclolectivo">{{anio.anio}}</option>
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
import { ref, onMounted } from 'vue'
import { api } from '@/api/api';
const arrAllCursadas = ref([])
const ciclolectivo = ref("")
const arrAnios = ref([])
onMounted(async ()=>{
    arrAnios.value = await getAniosCursados()
})
const getAniosCursados = async () => {
    const {payload} = await api.get({
        entity: "calificaciones",
        action: "getAniosCursados",
    })
    return payload
}
const listAllCursadas = async () => {
    const r = await api.get({
        entity: "calificaciones",
        action: "getHistoricoCursadas",
        payload: {
            codciclolectivo: ciclolectivo.value
        }
    })
    arrAllCursadas.value = r.payload
}
</script>