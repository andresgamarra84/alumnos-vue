<template>
    <div class='row'>
        <h3>Correlatividades por carrera</h3>
        <div class='p-3 text-center'>
            <label>Tipo de listado</label>
            <select v-model="tipoCorrelativa">
                <option disabled value=''>Seleccione...</option>
                <option value="1">Listado de condicionalidades</option>
                <option value="2">Estudiantes que no pueden promocionar</option>
            </select>
            <label>Carrera</label>
            <select 
                v-model='carrera' 
            >
                <option selected disabled>Seleccione...</option>
                <option value=0>FOBA Niños</option>
                <option value=1>FOBA Adultos</option>
                <option value=2>FOBA Canto</option>
                <option value=3>Superior Instrumento</option>
                <option value=4>Superior Canto</option>
                <option value=5>Superior Composición</option>
                <option value=6>Superior D. Coral</option>
                <option value=7>Superior Ed. Musical</option>
            </select>
        </div>
        <div class='row recuadro lista' v-for='item in arrCorrelatividades'>
            <div class='col-3 py-2'><a @click='openPanel(item.codAlumno)'>{{item.apellido}}, {{item.nombre}}</a></div>
            <div class='col-3 py-2'>DNI {{item.nrodoc}}</div>
            <div class='col-6 py-2'>{{item.email}}</div>
            <div class='row py-2' v-for='it in item.correlativas'>
                <div class='col-6 align-content-center text-center'>{{it.materia}}</div>
                <div class='col-6 text-center'>
                    <div v-if="it.cursadas.length>0">Adeuda cursada de: {{it.cursadas}}</div>
                    <div v-if="it.examenes.length>0">Adeuda examenes de : {{it.examenes}}</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, watch } from 'vue'
import { api } from '@/api/api'
import { showModal } from '@/services/uiBus'
import { useImpersonation } from '@/views/admin/composables/useImpersonation'
const { openUserPanel }  = useImpersonation()
const tipoCorrelativa = ref('')
const arrCorrelatividades = ref([])
const carrera = ref(null)
watch(carrera, async (nuevaCarrera) => {
    if (!tipoCorrelativa.value) {
        showModal("Seleccione un tipo de listado");
        return;
    }
    const r = await showModal('Ingrese el ciclo lectivo', 2)
    const {payload} = await api.get({
        entity:'correlativas',
        action:'getCorrelativas',
        payload: {
            anio:r.value,
            carrera:nuevaCarrera,
            tipo:tipoCorrelativa.value
        }
    })
    arrCorrelatividades.value = []
    let emails = []
    payload.forEach(v=>{
        arrCorrelatividades.value.push(v)
        emails.push(v.email)
    })
    navigator.clipboard.writeText(emails.join(', '));
})
const openPanel = (codigo) => {
    openUserPanel({area: 'estudiantes',codigo})
}
</script>