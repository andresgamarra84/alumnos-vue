<template>
    	<div class='row'>
		<div class='col-12'><h3 class='h3cabecera'>Notificaciones</h3></div>
		<div class='col-12 offset-1'>
			<div class='col' v-if='arrNotificaciones.length==0'><i>No hay notificaciones para mostrar</i></div>
			<div v-for='(item,key) in arrNotificaciones' class='col-12 row' style='margin: 20px 0;'>
				<div class='row'>
					<div class='col-12' v-for='i in item.notificaciones'>{{i.comentarios}}</div>
				</div>
			</div>
		</div>
	</div>
	<div class='row'>
		<div class='col-12'><h3 class='h3cabecera'>Docentes ausentes</h3></div>
		<div class='col-12 offset-1'>
			<div class='col' v-if='arrAusentes.length==0'><i>No hay ausentes para informar</i></div>
			<div v-for='(item,key) in arrAusentes' class='col-12 row' style='margin: 20px 0;'>
				<div class='col-12'>{{key}}</div>
				<div class='row'>
					<div class='col-12' v-for='i in item'>
						<template v-if=i.nombre>{{i.nombre}}</template>
						<template v-else>{{i.comentarios}}</template>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
    import {ref, onMounted} from 'vue'
    import {api} from '@/api/api'
    const arrAusentes = ref([])
    const arrNotificaciones = ref([])
    const arrDocentes = ref([])
    onMounted(async ()=>{
        const r = await api.get({
            entity: "novedades",
            action: 'getNovedades'
        });
        arrAusentes.value = r.payload.ausentes
        arrNotificaciones.value = r.payload.notificaciones
    })
</script>