<template>
  <div v-for='(item, key) in arrSolicitudes' :class="['row recuadro lista', item.estado==1?'fw-bold':'']" :id="'solicitud_'+key">
		<div class='col-12 col-md-5'>{{item.apellido}}, {{item.nombre}} DNI {{item.nrodoc}}</div>
		<div class='col-12 col-md-3'>{{item.fecha}}</div>
		<div class='col-12 col-md-4'> {{item.destino}} {{item.dato}}</div>
		<div class='col-6'><a v-on:click='mostrarCursos(key)'>Ver inscripciones</a></div>
		<div class='col-6'><a v-on:click='getConstancia(key)'>Descargar constancia</a></div>
	</div>
	<div id='datosCurso' v-show='arrDatosAlumno.length>0' class='col-12' style='padding:10px'>
		<div>Inscripto en:</div>
		<div v-for='item in arrDatosAlumno'>{{item.contenido}}, Prof. {{item.nombreProf}} - Sede {{item.sede}}</div>
	</div>
</template>
<script setup>
  import { ref, onMounted } from 'vue'
  import { api } from '@/api/api'
  import { useFileDownload } from '@/composables/useFileDownload'
  const { downloadBlob } = useFileDownload()
  const arrSolicitudes = ref([])
  const arrDatosAlumno = ref([])
  onMounted(()=>{
    getSolicitudes()
  })
  const getSolicitudes = async () => {
    const {payload} = await api.get({
      entity: "solicitudes",
      action: "listSolicitudesConstancia",
    })
    arrSolicitudes.value = payload
  }
  const getConstancia = async (key) => {
    const fileName = `constancia_${arrSolicitudes.value[key].apellido}.pdf`
    const blob = await api.getPDF({
      entity:"solicitudes",
      action: "getPDFConstancia",
      payload: {
        codigo:arrSolicitudes.value[key].codigo,
        codAlumno:arrSolicitudes.value[key].codalumno
      }
    })
    downloadBlob(blob, fileName)
  }
</script>