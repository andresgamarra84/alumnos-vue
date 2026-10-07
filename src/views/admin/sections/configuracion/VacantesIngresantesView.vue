<template>
  <div class="row g-3">
    <h3 class="h3cabecera">Vacantes para ingresantes</h3>

    <div class="row recuadro fw-bold">
      <div class="col-md-4">Instrumento</div>
      <div class="col-md-2">Vacantes adultos</div>
      <div class="col-md-2">L. de Esp. adultos</div>
      <div class="col-md-2">Vacantes niños</div>
      <div class="col-md-2">L. de Esp. niños</div>
    </div>
    <div v-for="(item, k) in arrVacantes" :key="item.codInstrumento" class="row recuadro lista">
      <div class="col-md-4 d-flex align-items-center">{{ item.nombre }}</div>
      <div class="col-md-2"><input class="form-control" type="number" :value="item.adultos" @change="updData(k, 0, $event.target.value)"></div>
      <div class="col-md-2"><input class="form-control" type="number" :value="item.adultosEspera" @change="updData(k, 1, $event.target.value)"></div>
      <div class="col-md-2"><input class="form-control" type="number" :value="item.ninios" @change="updData(k, 2, $event.target.value)"></div>
      <div class="col-md-2"><input class="form-control" type="number" :value="item.niniosEspera" @change="updData(k, 3, $event.target.value)"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { api } from "@/api/api"
import { showToast } from "@/services/uiBus"

const arrVacantes = ref([])

const list = async () => {
  const { payload } = await api.get({
    entity: 'vacantesingresantes',
    action: 'getVacantes'
  })
  arrVacantes.value = payload ?? []
}

const updData = async (k, indice, valor) => {
  const item = arrVacantes.value[k]
  const r = await api.post({
    entity: 'vacantesingresantes',
    action: 'updVacante',
    payload: { codInstrumento: item.codInstrumento, indice, valor }
  })
  if (r.ok) showToast('Datos actualizados', 'success')
}

onMounted(() => {
  list()
})
</script>
