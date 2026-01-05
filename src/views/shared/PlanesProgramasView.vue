<template>
    <h3 class='h3cabecera'>Planes de estudio y Correlatividades por carrera</h3>
    <!-- Selector de Carrera -->
    <div class="col-12 p-3">
    <CarrerasSelect
        v-model="selectedIndexCarrera"
        :carreras="carreras"
        @change="listMaterias"
    />
    </div>
    <template v-if="arrMaterias.length>0">
        <div v-for='(item, key) in arrMaterias' class='row lista recuadro' style='border:1px solid beige;padding:10px;'>
            <div class='col-12 col-md-6'>
                <span class='titulo'>{{item.nroOrden}} - {{item.nombre}}</span>
                <br>
                <a v-if='item.linkPrograma' :href='item.linkPrograma' target='_blank'>Descargar programa</a>
                <a v-else>(Sin programa cargado)</a>
            </div>
            <div class='col-12 col-md-6'>
                <div v-if='item.correlativas.length==0'><i>(Sin correlativas)</i></div>
                <div v-else v-for='(i,k) in item.correlativas'>{{i.nombre}}</div>
            </div>
        </div>
    </template>
</template>>
<script setup>

import {ref, onMounted } from 'vue'
import { api } from '@/api/api.js';
import CarrerasSelect from '@/components/CarrerasSelect.vue';
const carreras = ref([])
const arrMaterias = ref([])
const selectedIndexCarrera = ref('')
onMounted(() => {
    listCarreras();
});
const listCarreras = async () => {
    const r = await api.get({
        entity:'carreras',
        action: 'getCarreras'
    });
    carreras.value = r.payload;
}
const listMaterias = async () => {
    const codCarrera = carreras.value[selectedIndexCarrera.value].codigo
    const r = await api.get({
        entity:"planesprogramas", 
        action: 'getMaterias', 
        payload: {codCarrera: codCarrera }
    });
    arrMaterias.value = r.payload;    
}
</script>