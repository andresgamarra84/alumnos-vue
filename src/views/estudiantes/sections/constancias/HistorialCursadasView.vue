<template>
<h3 class='h3cabecera'>Histórico de cursadas</h3>
<label>Ciclo lectivo</label>
<select class='w-100' @change="listAllCursadas()" v-model="ciclolectivo">
    <option selected disabled>Seleccione el año...</option>
    <option v-for="anio in arrAnios" :value="anio.codciclolectivo">{{anio.anio}}</option>
</select>
<div v-for='item in arrAllCursadas' style='padding-bottom:30px;'>
    <h3>{{item.nombreCarrera}} <template v-if='item.instrumento'>({{item.instrumento}})</template></h3>
    <InfoCardGrid>
        <InfoCard
            v-for='(it, key) in item.cursada'
            :key='key'
            :title='it.nombreCurso'
            :badge="it.inscripcionBorrada ? 'Inscripción borrada' : ''"
            badge-variant='neutral'
            :variant="it.inscripcionBorrada ? 'neutral' : 'primary'"
            :muted='it.inscripcionBorrada'
        >
            <InfoMeta label='1er cuatr.:'>{{ it.notaNumerica1 || it.notaConceptual1 }}</InfoMeta>
            <InfoMeta label='2do cuatr.:'>{{ it.notaNumerica2 || it.notaConceptual2 }}</InfoMeta>
            <InfoMeta><template #icon><CalendarDays /></template>{{ it.fechaInscripcion }}</InfoMeta>
            <InfoMeta><template #icon><User /></template>Prof. {{ it.nombreProfesor }}</InfoMeta>
        </InfoCard>
    </InfoCardGrid>
</div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { api } from '@/api/api';
import InfoCard from '@/components/card/InfoCard.vue';
import InfoCardGrid from '@/components/card/InfoCardGrid.vue';
import InfoMeta from '@/components/card/InfoMeta.vue';
import { CalendarDays, User } from '@lucide/vue';
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