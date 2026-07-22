<template>
<div class="row g-4">
	<h3 class='h3cabecera'>Listado de Inscriptos por curso</h3>
	<div class='col-12'>
		<select 
            v-model="curso" 
            @change='listHorarios()'
        >
			<option disabled value="">Seleccione un Curso</option>
			<option v-for='item in arrCursos' :value='item.codigo'>{{item.nombre}}</option>
		</select>
	</div>
	<div class='row recuadro lista' v-for='item,k in arrHorarios'>
		<div class='col-4'>{{item.nombreProf}}</div>
		<div class='col-4'>
            <div v-for='horario in item.horarios'>
                {{horario.dia}} de {{ horario.desde }} a {{ horario.hasta }} ({{ horario.sede }})
            </div>
        </div>
		<div class='col-4'>({{item.cantidadInscriptos}} inscriptos)</div>
		<div class='col-12 text-end'><a @click='listDatosAlumnosHorario(k)'>Mostrar lista</a></div>
		<template v-if='item.mostrar'>
		<div v-for='estudiante in item.listaInscriptos' class='row'>
			<div class='col-4'>{{estudiante.apellido}}, {{estudiante.nombre}}</div>
			<div class='col-4'>{{estudiante.nrodoc}}</div>
			<div class='col-4'>{{estudiante.email}}</div>
		</div>
		<div class='col-12 text-end'><a @click='copiarCorreos(k)'>Copiar correos electrónicos</a></div>
		</template>
	</div>
</div>
</template>
<script setup>
import { ref, onMounted } from "vue"
import { api } from "@/api/api"
import { showModal } from "@/services/uiBus"
const arrCursos = ref([])
const arrHorarios = ref([])
const curso = ref('')
const listCursos = async () => {
    const {payload} = await api.get({
        entity:'cursos',
        action:'getCursos'
    })
    arrCursos.value = payload ?? []
}
const listHorarios = async () => {
    const {payload} = await api.get({
        entity:'cursoshorarios',
        action:'getHorariosByCurso',
        payload: {
            codCurso: curso.value
        }
    })
    arrHorarios.value = payload ?? []
}
const listDatosAlumnosHorario = async (k) => {
    arrHorarios.value.forEach((v, i) => {
        v.mostrar = i === k
    })
}
const copiarCorreos = (k) => {
    let arr = [];
    arrHorarios.value[k].listaInscriptos.forEach(v=>arr.push(v.email));
    navigator.clipboard.writeText(arr.join(","));
    showModal("Correos copiados al portapapeles");
}
onMounted (() => {
    listCursos()
})
</script>