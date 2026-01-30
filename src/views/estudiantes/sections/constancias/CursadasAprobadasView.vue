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
    <div v-for='(item, key) in arrCursadas' class='lista delimitador text-center'>
        <div class='row centrado'>
            <div class='col-12 col-sm-6 col-md-3 flex-container'>
                <div>{{item.nombre}}</div>
            </div>
            <template v-if="!item.deleted">
                <div class='col-6 col-sm-6 col-md-3 flex-container'>
                    <div>1º Cuatr: {{item.calificacion1}}</div>
                    <div>2º Cuatr: {{item.calificacion2}}</div>
                    <div>Calificación final: {{ item.calificacionFinal }}</div>
                </div>
                <div class='col-6 col-sm-6 col-md-3'>{{item.fechaInscripcion}}</div>
                <div class='col-12 col-sm-6 col-md-3'>
                    <a @click='delCursada(key)'>Borrar cursada</a>
                </div>
            </template>
            <template v-else>
                <div class='col-12 col-sm-6 col-md-9'>Adeuda cursada</div>
            </template>
        </div>
    </div>
</template>
<script setup>
    import { ref, onMounted } from 'vue';
    import { api } from '@/api/api';
    import CarrerasSelect from '@/components/CarrerasSelect.vue';
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
    const delCursada = async (k) => {
        const r = await api.post({
            entity: "calificaciones",
            action: "borrarCursada",
            payload: {
                codigo: arrCarreras.value[k].codigo
            }
        })
        if (r.ok) arrCarreras.value[k].splice(k,1)
    }
</script>