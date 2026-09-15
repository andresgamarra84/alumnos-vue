<template>
<div class="row g-4">
    <h3 class='h3cabecera'>Estudiantes de Superior con FOBA incompleto</h3>
    <p class='col-12'>
        Estudiantes actualmente inscriptos en carreras de Superior que aún conservan
        una carrera FOBA (Niños, Adultos o Canto) sin finalizar.
    </p>
    <div v-if='!cargado' class='col-12'>Cargando...</div>
    <div v-else-if='arrFobaIncompleto.length === 0' class='col-12'>
        No hay estudiantes con FOBA incompleto.
    </div>
    <div
        v-for='item in arrFobaIncompleto'
        :key="`${item.codAlumno}-${item.codCarrera}`"
        class='row recuadro lista'
        :style="{ backgroundColor: item.finalizado ? '#33ccff' : '#f7c18f' }"
    >
        <div class='col-4 py-2'><a @click='openPanel(item.codAlumno)'>{{ item.apellido }}, {{ item.nombre }}</a></div>
        <div class='col-2 py-2'>DNI {{ item.nrodoc }}</div>
        <div class='col-3 py-2'>{{ item.nombreCarrera }} ({{ item.nombreInstrumento }})</div>
        <div class='col-3 py-2 text-end'>
            <span v-if='item.finalizado'>Carrera finalizada</span>
            <span v-else>Adeuda {{ item.diferencia }} materia{{ item.diferencia === 1 ? '' : 's' }}</span>
        </div>
    </div>
</div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { api } from '@/api/api'
import { useImpersonation } from '@/views/admin/composables/useImpersonation'
const { openUserPanel } = useImpersonation()
const arrFobaIncompleto = ref([])
const cargado = ref(false)
onMounted(async () => {
    const { payload } = await api.get({
        entity: 'correlativas',
        action: 'getFobaIncompleto'
    })
    arrFobaIncompleto.value = payload ?? []
    cargado.value = true
})
const openPanel = (codigo) => {
    openUserPanel({ area: 'estudiantes', codigo })
}
</script>
