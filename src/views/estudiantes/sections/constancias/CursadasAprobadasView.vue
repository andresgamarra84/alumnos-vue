<template>

    <h3 class='h3cabecera'>Notas de Cursada</h3>
    <div class='row'>
        <div class='w-100'>
            <CarrerasSelect
            :carreras="arrCarreras"
            :model-value="selectedCarrera"
            @change="listCursadasForCarrera"
            />
        </div>
    </div>
    <section v-for='grupo in cursadasPorAnio' :key='grupo.anio' class='grupo-anio'>
    <h4 class='grupo-anio__titulo'>{{ tituloAnio(grupo.anio) }}</h4>
    <InfoCardGrid>
        <InfoCard
            v-for='{ item, key } in grupo.items'
            :key='item.codcursosalumnos ?? key'
            :title='item.nombre'
            :badge="item.deleted ? 'Adeuda cursada' : ''"
            badge-variant='neutral'
            :variant="item.deleted ? 'neutral' : 'primary'"
            :muted='item.deleted'
        >
            <template v-if='!item.deleted'>
                <InfoMeta label='1º Cuatr:'>{{ item.calificacion1 }}</InfoMeta>
                <InfoMeta label='2º Cuatr:'>{{ item.calificacion2 }}</InfoMeta>
                <InfoMeta label='Calificación final:'>{{ item.calificacionFinal }}</InfoMeta>
                <InfoMeta><template #icon><CalendarDays /></template>{{ item.fechaInscripcion }}</InfoMeta>
            </template>

            <template #actions v-if='!item.deleted'>
                <button type='button' class='card-link card-link--danger' @click='delCursada(key)'>Borrar cursada</button>
            </template>
        </InfoCard>
    </InfoCardGrid>
    </section>
</template>
<script setup>
    import { ref, computed, onMounted } from 'vue';
    import { api } from '@/api/api';
    import CarrerasSelect from '@/components/CarrerasSelect.vue';
    import InfoCard from '@/components/card/InfoCard.vue';
    import InfoCardGrid from '@/components/card/InfoCardGrid.vue';
    import InfoMeta from '@/components/card/InfoMeta.vue';
    import { CalendarDays } from '@lucide/vue';
    const arrCarreras = ref([])
    const arrCursadas = ref([])
    // Agrupa por año de carrera conservando el índice original para las acciones sobre arrCursadas
    const cursadasPorAnio = computed(() => {
        const grupos = new Map()
        arrCursadas.value.forEach((item, key) => {
            const anio = item.anioCarrera
            if (!grupos.has(anio)) grupos.set(anio, { anio, items: [] })
            grupos.get(anio).items.push({ item, key })
        })
        return [...grupos.values()].sort((a, b) => a.anio - b.anio)
    })
    const tituloAnio = (anio) => anio > 0 ? `${anio}° año` : 'Otras materias'
    onMounted(async ()=>{
        const r = await api.get({
            entity: 'carreras',
            action: 'getCarrerasAlumno',
        })
        arrCarreras.value = r.payload
    })
    const listCursadasForCarrera = async (k) => {
        const r = await api.get({
            entity:"calificaciones",
            action:"getCursadasForCarrera",
            payload: {
                codAlC: arrCarreras.value[k].codigo
            }
        })
        arrCursadas.value = r.payload
    }
    const delCursada = async (key) => {
        const codigo = arrCursadas.value[key].codcursosalumnos
        if (!codigo) return
        const r = await api.post({
            entity: "calificaciones",
            action: "borrarCursada",
            payload: {
                codigo
            }
        })
        if (r.ok) {
                arrCursadas.value[key].calificacion1 = null
                arrCursadas.value[key].calificacion2 = null
                arrCursadas.value[key].calificacionFinal = null
                arrCursadas.value[key].deleted = true
        }
    }
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