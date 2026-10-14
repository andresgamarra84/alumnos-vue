<template>
  <InfoCardGrid min-width="480px">
    <InfoCard
      v-for="(item, key) in arrSolicitudes"
      :key="key"
      :id="'solicitud_'+key"
      :subtitle="`DNI ${item.nrodoc}`"
      :badge="item.codEstado == 1 ? 'Pendiente' : ''"
      badge-variant="warning"
      :variant="item.codEstado == 1 ? 'warning' : 'primary'"
    >
      <template #title>
        <span class="link-like" @click="openPanel(item.codalumno)">{{ item.apellido }}, {{ item.nombre }}</span>
      </template>

      <InfoMeta><template #icon><CalendarDays /></template>{{ item.fecha }}</InfoMeta>
      <InfoMeta label="Destino:">
        <template #icon><GraduationCap /></template>
        {{ item.destino }} {{ item.dato }}
      </InfoMeta>

      <div v-if="item.inscripciones.length > 0" class="chips">
        <InfoChip v-for="(it, i) in item.inscripciones" :key="i">
          {{ it.nombreCurso }}
          <template #secondary>Prof. {{ it.nombreProf.apellido }} · Sede {{ it.sede }}</template>
        </InfoChip>
      </div>

      <template #actions>
        <button type="button" class="card-link" @click="mostrarCursos(key)">Ver inscripciones</button>
        <button type="button" class="card-link" @click="getConstancia(key)">Descargar constancia</button>
      </template>
    </InfoCard>
  </InfoCardGrid>
</template>
<script setup>
  import { ref, onMounted } from 'vue'
  import { api } from '@/api/api'
  import { showModal } from '@/services/uiBus'
  import { useFileDownload } from '@/composables/useFileDownload'
  import { useImpersonation } from '@/views/admin/composables/useImpersonation'
  import InfoCard from '@/components/card/InfoCard.vue'
  import InfoCardGrid from '@/components/card/InfoCardGrid.vue'
  import InfoMeta from '@/components/card/InfoMeta.vue'
  import InfoChip from '@/components/card/InfoChip.vue'
  import { CalendarDays, GraduationCap } from '@lucide/vue'
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
<style scoped>
.link-like {
  cursor: pointer;
}
.link-like:hover {
  color: var(--color-acento);
}
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
</style>
