<template>
    <div id='divCursos' v-if='cursos.length>0' class='margen-bottom'>
		<h3 class='h3cabecera'>Cursos</h3>
		<div v-for="(item,key) in cursos" class='row lista recuadro'>
			<div class='col-12 col-md-6 titulo'>{{item.nombreCurso}}</div>
			<div style='padding-left:20px' class='col-12 col-md-6'>
				<div v-for='info in item.infoCurso.horarios' style='padding:5px 0;'>
					<div>{{info.dia}} {{info.horario[0]}} a {{info.horario[1]}}</div>
					<div>Aula {{info.aula}}, Sede {{info.sede}}</div>
				</div>
			</div>
			<div class='col-12 text-end' v-if='item.actividades'><a v-on:click="setActividades(key)">Ver actividades</a></div>
		</div>
		<div class='text-end'>Total de modulos: {{totalHoras}} horas</div>
	</div>
	<div id='divReservas' v-if='reservas.length>0' class='margen-bottom'>
		<h3 class='h3cabecera'>Reservas de vacante</h3>
		<div v-for="item in reservas" class='row lista recuadro'>
			<div class='col-12 col-md-6 titulo'>{{item.apellido}}, {{item.nombre}}</div>
			<div class='col-12 col-md-6'>
				<div>Nivel: {{item.materia}}</div>
				<div>Carrera: {{item.carrera}}</div>
				<div>E-mail: {{item.email}}</div>
			</div>
		</div>
		<div class='text-end'><a v-on:click='copyMails()'>Copiar todos los correos</a></div>
	</div>
</template>
<script setup>
    import { ref, onMounted } from 'vue'
    import { api } from '@/api/api'
    const cursos = ref([])
	const totalHoras = ref(0)
    const reservas = ref([])
    onMounted(async () => {
		const infoCursos = await getCursos()
        cursos.value = infoCursos.cursos
		totalHoras.value = infoCursos.totalHoras
        reservas.value = getReservas()
    })
    const getCursos = async () => {
        const r = await api.get({
            entity: "cursos",
            action: "getCursos",
        })
        return r.payload
    }
    const getReservas = async () => {
        const r = await api.get({
            entity: "reservas",
            action: "getReservas"
        })
        return r.payload
    }
</script>