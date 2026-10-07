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
		<div class='col-12 text-end d-flex justify-content-end flex-wrap gap-3'>
			<a v-if="puedeEnviarMensaje" @click='abrirMensaje(k)'>Enviar mensaje</a>
			<a @click='descargarAsistencia(k)'>Descargar planilla de asistencia</a>
			<a @click='descargarCuatrimestral(k)'>Descargar planilla cuatrimestral</a>
			<a @click='listDatosAlumnosHorario(k)'>Mostrar lista</a>
		</div>
		<template v-if='item.mostrar'>
		<div v-for='estudiante in item.listaInscriptos' class='row'>
			<div class='col-4'>{{estudiante.apellido}}, {{estudiante.nombre}}</div>
			<div class='col-4'>{{estudiante.nrodoc}}</div>
			<div class='col-4'>{{estudiante.email}}</div>
		</div>
		<div class='col-12 text-end'><a @click='copiarCorreos(k)'>Copiar correos electrónicos</a></div>
		</template>
	</div>

	<NuevoMensaje
		v-if="showMsgModal"
		@send-msg="enviarMensaje"
		@close="showMsgModal = false"
	/>
</div>
</template>
<script setup>
import { ref, computed, onMounted } from "vue"
import { api } from "@/api/api"
import { showModal, showToast } from "@/services/uiBus"
import { useFileDownload } from "@/composables/useFileDownload"
import { usePermisos } from "@/composables/usePermisos"
import NuevoMensaje from "@/views/shared/NuevoMensaje.vue"

const { downloadBlob } = useFileDownload()
const { tienePermiso } = usePermisos()
const puedeEnviarMensaje = computed(() => tienePermiso('cursos_resumen_inscriptos_mensaje', 'cursos_all'))

const arrCursos = ref([])
const arrHorarios = ref([])
const curso = ref('')
const showMsgModal = ref(false)
const codPlHorariosSeleccionado = ref(null)

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
    showToast("Correos copiados al portapapeles", 'success');
}

const abrirMensaje = (k) => {
    if (!arrHorarios.value[k].cantidadInscriptos) {
        showToast("Este curso no tiene estudiantes inscriptos", 'error')
        return
    }
    codPlHorariosSeleccionado.value = arrHorarios.value[k].codPlHorarios
    showMsgModal.value = true
}

const enviarMensaje = async ({ asunto, mensaje }) => {
    const { ok } = await showModal('¿Confirma que desea enviar este mensaje a los inscriptos del curso?', 1)
    if (!ok) return
    const r = await api.post({
        entity: 'cursoshorarios',
        action: 'enviarMensajeCurso',
        payload: {
            codPlHorarios: codPlHorariosSeleccionado.value,
            asunto,
            mensaje,
        }
    })
    if (!r.ok) return
    showToast(`Mensaje enviado a ${r.payload.notificados} estudiante(s).`, 'success')
}

const descargarAsistencia = async (k) => {
    const item = arrHorarios.value[k]
    const blob = await api.getPDF({
        entity: 'planillas',
        action: 'getPlanillaEstudiantes',
        payload: { codPlHorarios: item.codPlHorarios }
    })
    downloadBlob(blob, `Asistencia - ${item.nombreCurso}.pdf`, 'application/pdf')
}

const descargarCuatrimestral = async (k) => {
    const item = arrHorarios.value[k]
    const blob = await api.getPDF({
        entity: 'planillas',
        action: 'getPlanillaCuatrimestral',
        payload: { codPlHorarios: item.codPlHorarios }
    })
    downloadBlob(blob, `Cuatrimestral - ${item.nombreCurso}.pdf`, 'application/pdf')
}

onMounted (() => {
    listCursos()
})
</script>
