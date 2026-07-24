<template>
  <div v-for='(item, key) in arrSolicitudes' :key='key' :class="['row recuadro lista', item.codEstado==1?'fw-bold':'']" :id="'solicitud_'+key">
    <div class="row">
      <div class='col-12 col-md-5'>
        <span style='cursor:pointer' @click="openPanel(item.codalumno)">{{item.apellido}}, {{item.nombre}} DNI {{item.nrodoc}}</span>
      </div>
      <div class='col-12 col-md-3'>{{item.fecha}}</div>
      <div class='col-12 col-md-4'>Destino: {{item.destino}} {{item.dato}}</div>
    </div>
    <div class="row">
      <div class='col-6'><a v-on:click='mostrarCursos(key)'>Ver inscripciones</a></div>
      <div class='col-6'><a v-on:click='getConstancia(key)'>Descargar constancia</a></div>
    </div>
    <div v-if="item.inscripciones.length>0" class='col-12' style='padding:10px'>
      <div>Inscripto en:</div>
      <div v-for='it in item.inscripciones'>{{it.nombreCurso}}, Prof. {{it.nombreProf.apellido}} - Sede {{it.sede}}</div> 
    </div>
	</div>
</template>
<script setup>
  import { ref, onMounted } from 'vue'
  import { api } from '@/api/api'
  import { showModal } from '@/services/uiBus'
  import { useFileDownload } from '@/composables/useFileDownload'
  import { useImpersonation } from '@/views/admin/composables/useImpersonation'
  const { openUserPanel } = useImpersonation()
  const { downloadBlob } = useFileDownload()
  const arrSolicitudes = ref([])
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
    const {ok} = await showModal("¿Desea enviar el aviso por mail al estudiante?", 1)
    const sendMail = ok
    const fileName = `constancia_${arrSolicitudes.value[key].apellido}.pdf`
    const blob = await api.getPDF({
      entity:"solicitudes",
      action: "getPDFConstancia",
      payload: {
        codigo:arrSolicitudes.value[key].codigo,
        codAlumno:arrSolicitudes.value[key].codalumno,
        sendMail
      }
    })
    downloadBlob(blob, fileName)
  }
  const mostrarCursos = async (key) => {
    const {payload} = await api.get({
      entity:'inscripciones',
      action:'getInscripcionesAlumno',
      payload: {
        codalumno: arrSolicitudes.value[key].codalumno
      }
    })
    arrSolicitudes.value[key].inscripciones = payload
  }
  const openPanel = (codigo) => {
    openUserPanel({area: 'estudiantes',codigo})
  }
</script>