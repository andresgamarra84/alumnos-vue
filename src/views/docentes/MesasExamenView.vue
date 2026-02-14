<template>
  <div class="p-3">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h3 class="m-0">Mesas de examen</h3>
      <a
        v-if="showDetalle"
        href="#"
        @click.prevent="mostrarTodo"
      >
        Mostrar todo
      </a>
    </div>

    <div
      v-for="(item, k) in mesasVisibles"
      :key="item?.codigo ?? k"
      class="lista row mb-2 p-2"
      style="cursor: pointer;"
      @click="verMesa(k)"
    >
      <div class="col-12 titulo">{{ item?.nombre }}</div>
      <div class="col-12 col-md-4">Fecha: {{ item?.fecha }}</div>
      <div class="col-12 col-md-4">Condicion: {{ item?.condicion }}</div>
      <div class="col-12 col-md-4">Alumnos inscriptos: {{ item?.cantAlumnos ?? 0 }}</div>
    </div>

    <div v-if="showDetalle" class="container mt-4">
      <div
        v-for="(autoridad, idx) in mesaActual?.autoridades ?? []"
        :key="idx"
        class="row py-1"
      >
        <div class="col-12 col-md-6 text-md-end">
          {{ autoridad.condicion }}: {{ autoridad.nombreProf }}
        </div>
        <div class="col-12 col-md-6">E-mail: {{ autoridad.email }}</div>
      </div>

      <div class="col-12 text-center py-3">
        <h4>Alumnos inscriptos</h4>
      </div>

      <div v-if="arrInscriptos.length === 0" class="text-center">
        - (No hay alumnos inscriptos a la mesa) -
      </div>

      <div
        v-for="(inscripto, i) in arrInscriptos"
        :key="inscripto.codMesasAl ?? i"
        class="row delimitador lista py-2 mb-2"
      >
        <div class="col-12 col-md-6 d-flex align-items-center">
          <span>
            {{ inscripto.apellido }}, {{ inscripto.nombre }} - DNI: {{ inscripto.nrodoc }}<br />
            ({{ inscripto.condicion }})<br />
            {{ inscripto.carrera }}, {{ inscripto.aniocarrera }}º Año<br />
            {{ inscripto.email }}
          </span>
        </div>

        <div class="col-12 col-md-6">
          <div
            v-for="(archivo, idx) in inscripto.archivos ?? []"
            :key="idx"
            class="py-1"
          >
            <a
              :href="`https://cjjc.edu.ar/uploads/alumnos/examenes/${archivo.subDir}${archivo.nombre}`"
              target="_blank"
            >
              {{ archivo.nombre }}
            </a>
          </div>
          <div v-if="!inscripto.archivos || inscripto.archivos.length === 0">
            - Sin archivos cargados por el alumno -
          </div>
        </div>

        <div class="col-12 mt-2">
          <span class="me-2">Calificaciones:</span>

          <label class="me-2">Oral:</label>
          <select
            :value="inscripto.calificacionOral"
            @change="setCalif(i, 'calificacionOral', $event)"
          >
            <option disabled value="">Seleccione...</option>
            <option value="0">Ausente</option>
            <template v-if="inscripto.esConceptual">
              <option value="11">Aprobado</option>
              <option value="12">Desaprobado</option>
            </template>
            <template v-else>
              <option v-for="n in 10" :key="`oral-${i}-${n}`" :value="n">{{ n }}</option>
            </template>
          </select>

          <label class="mx-2">Escrita:</label>
          <select
            :value="inscripto.calificacionEscrita"
            @change="setCalif(i, 'calificacionEscrita', $event)"
          >
            <option disabled value="">Seleccione...</option>
            <option value="0">Ausente</option>
            <template v-if="inscripto.esConceptual">
              <option value="11">Aprobado</option>
              <option value="12">Desaprobado</option>
            </template>
            <template v-else>
              <option v-for="n in 10" :key="`escrita-${i}-${n}`" :value="n">{{ n }}</option>
            </template>
          </select>

          <label class="mx-2">Promedio:</label>
          <select
            :value="inscripto.calificacionPromedio"
            @change="setCalif(i, 'calificacionPromedio', $event)"
          >
            <option disabled value="">Seleccione...</option>
            <option value="0">Ausente</option>
            <template v-if="inscripto.esConceptual">
              <option value="11">Aprobado</option>
              <option value="12">Desaprobado</option>
            </template>
            <template v-else>
              <option v-for="n in 10" :key="`prom-${i}-${n}`" :value="n">{{ n }}</option>
            </template>
          </select>
        </div>
      </div>

      <div v-if="arrInscriptos.length > 0" class="mt-3">
        <button class="btn btn-primary" @click="downloadActa">Descargar acta</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { api } from '@/api/api'
import { showModal } from '@/services/uiBus'
import { useFileDownload } from '@/composables/useFileDownload'

const { downloadBlob } = useFileDownload()

const arrMesas = ref([])
const arrInscriptos = ref([])
const selectedMesaIndex = ref(null)

const showDetalle = computed(() => selectedMesaIndex.value !== null)
const mesaActual = computed(() => {
  if (selectedMesaIndex.value === null) return null
  return arrMesas.value[selectedMesaIndex.value] ?? null
})
const mesasVisibles = computed(() => {
  if (!showDetalle.value) return arrMesas.value
  const item = mesaActual.value
  return item ? [item] : []
})

const wasConfirmed = (result) => result === true || result?.ok === true

const listMesas = async () => {
  const r = await api.get({
    entity: 'mesasexamen',
    action: 'getMesasByProfesor',
  })

  arrMesas.value = (r.payload ?? []).map((mesa) => ({
    ...mesa,
    show: true,
  }))
}

const mostrarTodo = () => {
  selectedMesaIndex.value = null
  arrInscriptos.value = []
}

const verMesa = async (visibleIndex) => {
  const mesaCodigo = mesasVisibles.value[visibleIndex]?.codigo
  const realIndex = arrMesas.value.findIndex((m) => m?.codigo === mesaCodigo)
  if (realIndex < 0) return

  selectedMesaIndex.value = realIndex
  arrInscriptos.value = []

  const codMesa = arrMesas.value[realIndex]?.codigo
  const r = await api.get({
    entity: 'mesasexamen',
    action: 'verDatosMesa',
    payload: { codMesa },
  })

  arrInscriptos.value = r.payload ?? []
}

const setCalif = async (index, campo, event) => {
  const valor = event?.target?.value
  const item = arrInscriptos.value[index]
  if (!item || valor === undefined) return

  const confirm = await showModal('¿Confirma la calificación?', 1, 'Confirmación')
  if (!wasConfirmed(confirm)) return

  const r = await api.post({
    entity: 'mesas',
    action: 2,
    payload: {
      codMesasAl: item.codMesasAl,
      campo,
      valor,
    },
  })

  if (r.ok) item[campo] = valor
}

const downloadActa = async () => {
  if (!mesaActual.value?.codigo) return

  const todosCalificados = arrInscriptos.value.every(
    (v) => v.calificacionPromedio !== null && v.calificacionPromedio !== undefined
  )

  if (!todosCalificados) {
    await showModal('No puede descargarse el acta porque aún quedan alumnos sin calificar')
    return
  }

  const codigo = mesaActual.value.codigo
  const blob = await api.getPDF({
    entity: 'mesas',
    action: 3,
    payload: { codigo },
  })

  downloadBlob(blob, `ActaMesa - ${codigo}.pdf`, 'application/pdf')
}

onMounted(() => {
  listMesas()
})
</script>
