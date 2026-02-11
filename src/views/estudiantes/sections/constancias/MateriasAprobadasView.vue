<template>
  <h3 class="h3cabecera">Materias aprobadas</h3>
  <CarrerasSelect
    :carreras="arrCarreras"
    v-model="selectedCarrera"
    @change="listExamenes"
  />
  <div v-if='arrExamenes.length>0' class="text-end">
    <button 
        class="btn btn-primary" 
        @click="getAnalitico">
            Descargar analítico
    </button>
  </div>
  <MateriaList
    v-if="selectedCarrera !== null"
    :materiasCarrera="arrExamenes"
    :materias="arrMaterias"
    @delete ="delExamen"
    @nuevo-examen="showFormNuevoExamen"
    @update-espacio="updEspacioExamen"
  />
  <Teleport to="body">
  <div
    v-if="showModalExamen"
    class="modal-overlay"
    @click.self="cerrarModal"
  >
    <div class="modal-content">
        <ExamenForm
            @save-examen="saveExamen"
            @close = "closeFormNuevoExamen"
        />
    </div>
  </div>
</Teleport>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { api } from '@/api/api'
import CarrerasSelect from '@/components/CarrerasSelect.vue';
import MateriaList from '@/components/MateriaList.vue';
import ExamenForm from '../../components/ExamenForm.vue';
import { useFileDownload } from '@/composables/useFileDownload';
const { downloadBlob } = useFileDownload()

import { showModal } from '@/services/uiBus';
const arrCarreras = ref([])
const codAlC = ref(null)
const arrExamenes = ref([])
const selectedCarrera = ref(null)
const codMCNuevoExamen = ref(null)
const showModalExamen = ref(false)
const arrMaterias = ref([])
const updEspacioExamen=async(codMateria, k) => {
    const r = await api.post({
        entity:"examenes",
        action:"updEspacioExamen",
        payload:{
            codMateria:codMateria,
            codExamen:arrExamenes.value[k].infoExamen.codigo,
        }
    })
}

const delExamen = async (k) => {
  const ok = await showModal("¿Confirma que desea borrar este examen?", 1, "Atención")
  if (!ok) return
  const r = await api.post({
    entity: "examenes",
    action: "deleteExamen",
    payload: {
      codExamen: arrExamenes.value[k].infoExamen.codigo,
    }
  })
  if (r.ok) arrExamenes.value[k].esAprobada = false;
}
const showFormNuevoExamen = async (k) =>{
    codMCNuevoExamen.value = arrExamenes.value[k].codigo
    showModalExamen.value = true
}
const closeFormNuevoExamen = () => {
    codMCNuevoExamen.value = null
    showModalExamen.value = false
}

const listCarreras = async () => {
    arrCarreras.value = [];
    const r = await api.get({
        entity: "carreras",
        action: "getCarrerasAlumno"
    })
    r.payload.forEach(v=>{
        v.disabled = false;
        arrCarreras.value.push(v)
    })
}

const listExamenes = async () => {
    arrExamenes.value = [];
    //showSinCarrera.value = selectedCarrera.value == 0;
    const carrera = arrCarreras.value[selectedCarrera.value];
    codAlC.value = carrera.codigo
    const r = await api.get({
        entity: "examenes",
        action: "getMateriasAprobadas",
        payload: {
            codAlC: codAlC.value,
            codCarrera: carrera.codCarrera,
        },
    })
    arrExamenes.value = r.payload
}
const saveExamen = async (d) => {
    const r = await api.post({
        entity:"examenes",
        action:"addExamen",
        payload:{
            codMC: codMCNuevoExamen.value,
            codAlC:codAlC.value,
            d:d
        }
    })
    listExamenes()
    closeFormNuevoExamen()
}
const listMaterias = async () => {
    const r = await api.get({
        entity:"materias",
        action:"getMateriasAll",
    })
    arrMaterias.value = r.payload
}

const getAnalitico = async () => {
    const carrera = arrCarreras.value[selectedCarrera.value];
    let input = await showModal("Lugar de nacimiento:", 2)
    const lugarNac = input.value
    input = await showModal("Para presentar ante:", 2)
    const lugarPresenta = input.value
    const blob = await api.getPDF({
        entity: "analiticos",
        action: "getAnaliticoEstudiante",
        payload: {
            codAlC: codAlC.value,
            codCarrera: carrera.codCarrera,
            lugarNac,
            lugarPresenta
        },
    })
    downloadBlob(blob, `analitico.pdf`)
}
onMounted(() => {
    listCarreras();
    listMaterias();
});

</script>
<style>
.modal-overlay {
  position: fixed;
  inset: 0;               /* top, right, bottom, left = 0 */
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-content {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  min-width: 300px;
  max-width: 90vw;
  max-height: 90vh;
  overflow: auto;
}
</style>