<template>
    <div class='row'>
        <div class='col-12'><h3>Descarga de horarios de cursos</h3></div>
        <div>
            <label>Seleccione el tipo:</label>
            <select v-model='seccion'>
                <option value='' disabled>Seleccione...</option>
                <option value='5'>Todo</option>
                <option value='0'>Materias grupales</option>
                <option value='1'>Instrumento</option>
                <option value='2'>Instrumento Armónico</option>
                <option value='3'>Espacios Institucionales</option>
                <option value='4'>Esp. Inst. Alternativos</option>
            </select>
        </div>
    </div>
</template>
<script setup>
import { watch, ref } from 'vue'
import { api } from '@/api/api'
import { useFileDownload } from '@/composables/useFileDownload'
const { downloadBlob } = useFileDownload()
const seccion = ref('')
watch(seccion, async (nuevaSeccion) => {
    const fileName = `horarios_cursos.pdf`
    const blob = await api.getPDF({
      entity:"horarios",
      action: "getPDFHorarios",
      payload: {
        tipo:nuevaSeccion
      }
    })
    downloadBlob(blob, fileName)
})
</script>
