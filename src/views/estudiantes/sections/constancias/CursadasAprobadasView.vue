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
    <InfoCardGrid>
        <InfoCard
            v-for='(item, key) in arrCursadas'
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
</template>
<script setup>
    import { ref, onMounted } from 'vue';
    import { api } from '@/api/api';
    import CarrerasSelect from '@/components/CarrerasSelect.vue';
    import InfoCard from '@/components/card/InfoCard.vue';
    import InfoCardGrid from '@/components/card/InfoCardGrid.vue';
    import InfoMeta from '@/components/card/InfoMeta.vue';
    import { CalendarDays } from '@lucide/vue';
    const arrCarreras = ref([])
    const arrCursadas = ref([])
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