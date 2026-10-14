<template>
    <h3 class='h3cabecera'>Trayectoria académica</h3>
	<div v-for='item in arrAllExamenes' style='padding-bottom:30px;'>
		<h3>{{item.nombreCompleto}}</h3>
		<InfoCardGrid v-if='item.examenes.length'>
			<InfoCard
				v-for='(it, key) in item.examenes'
				:key='key'
				:title='it.infoMateria.nombre'
				variant='success'
			>
				<InfoMeta label='Libro:'>
					<template #icon><BookOpen /></template>
					{{ it.infoExamen.libroletra }}{{ it.infoExamen.libro }} · Acta {{ it.infoExamen.acta }}
				</InfoMeta>
				<InfoMeta label='Nota:'>
					<template #icon><FileCheck2 /></template>
					{{ it.infoExamen.notanumerica || (it.infoExamen.esAprobada ? 'Aprobado' : '') }}
				</InfoMeta>
				<InfoMeta label='Fecha:'>
					<template #icon><CalendarDays /></template>
					{{ it.infoExamen.fechaexamen }}
				</InfoMeta>
				<InfoMeta label='Institución:'>
					<template #icon><Building2 /></template>
					{{ it.infoExamen.nombreinstitucion }}
				</InfoMeta>
			</InfoCard>
		</InfoCardGrid>
		<div v-else class='text-center'><i>(Esta carrera no posee exámenes acreditados)</i></div>
	</div>
</template>
<script setup>
    import {ref, onMounted} from 'vue'
    import { api } from '@/api/api'
    import InfoCard from '@/components/card/InfoCard.vue';
    import InfoCardGrid from '@/components/card/InfoCardGrid.vue';
    import InfoMeta from '@/components/card/InfoMeta.vue';
    import { BookOpen, FileCheck2, CalendarDays, Building2 } from '@lucide/vue';
    const arrAllExamenes = ref([])
    onMounted (async () => {
        const r = await api.get({
            entity: 'calificaciones',
            action: 'getTrayectoriaExamenes'
        })
        arrAllExamenes.value = r.payload
    })
</script>