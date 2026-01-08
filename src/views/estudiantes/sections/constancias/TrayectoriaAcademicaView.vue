<template>
    <h3 class='h3cabecera'>Trayectoria académica</h3>
	<div v-for='item in arrAllExamenes' style='padding-bottom:30px;'>
		<h3>{{item.nombreCompleto}}</h3>
		<div v-for='(it, key) in item.examenes' class='lista delimitador text-center row centrado'>
			<div class='col-12 col-sm-4 col-md-3 flex-container'>{{it.infoMateria.nombre}}</div>
			<div class='col-6 col-sm-4 col-md-3 flex-container'>
				<div>Nota: <template v-if='it.infoExamen.notanumerica'>{{it.infoExamen.notanumerica}}</template><template v-else-if='it.infoExamen.esAprobada'>Aprobado</template></div>
				<div>({{it.infoExamen.libroletra}}{{it.infoExamen.libro}} {{it.infoExamen.acta}})</div>
			</div>
			<div class='col-6 col-sm-4 col-md-3'>{{it.infoExamen.fechaexamen}}</div>
			<div class='col-sm-12 col-md-3'>{{it.infoExamen.nombreinstitucion}}</div>
		</div>	
		<div v-if='item.examenes.length==0' class='text-center'><i>(Esta carrera no posee exámenes acreditados)</i></div>
	</div>
</template>
<script setup>
    import {ref, onMounted} from 'vue'
    import { api } from '@/api/api'
    const arrAllExamenes = ref([])
    onMounted (async () => {
        const r = await api.get({
            entity: 'constancias',
            action: 'getTrayectoriaExamenes'
        })
        arrAllExamenes.value = r.payload
    })
</script>