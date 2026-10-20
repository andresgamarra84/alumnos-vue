<template>
    <h3 class='h3cabecera'>Trayectoria académica</h3>
	<div v-for='item in arrAllExamenes' style='padding-bottom:30px;'>
		<h3>{{item.nombreCompleto}}</h3>
		<template v-if='item.examenes.length'>
			<section v-for='grupo in examenesPorAnio(item.examenes)' :key='grupo.anio' class='grupo-anio'>
				<h4 class='grupo-anio__titulo'>{{ tituloAnio(grupo.anio) }}</h4>
				<InfoCardGrid>
					<InfoCard
						v-for='(it, key) in grupo.items'
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
			</section>
		</template>
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
    // Agrupa los exámenes de una carrera por año de carrera de la materia
    const examenesPorAnio = (examenes) => {
        const grupos = new Map()
        examenes.forEach(it => {
            const anio = Number(it.infoMateria?.aniocarrera) || 0
            if (!grupos.has(anio)) grupos.set(anio, { anio, items: [] })
            grupos.get(anio).items.push(it)
        })
        return [...grupos.values()].sort((a, b) => a.anio - b.anio)
    }
    const tituloAnio = (anio) => anio > 0 ? `${anio}° año` : 'Otras materias'
    onMounted (async () => {
        const r = await api.get({
            entity: 'calificaciones',
            action: 'getTrayectoriaExamenes'
        })
        arrAllExamenes.value = r.payload
    })
</script>
<style>
.grupo-anio {
  margin-top: 1.5rem;
}
.grupo-anio__titulo {
  margin-bottom: 0.75rem;
  padding-bottom: 0.4rem;
  border-bottom: 2px solid #dee2e6;
}
</style>
