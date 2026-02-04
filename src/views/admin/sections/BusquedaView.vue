<template>
  <div class="container my-4">

    <!-- Fila de búsqueda -->
    <div class="row p-3 rounded shadow-sm mb-4">

      <!-- Apellido / DNI -->
      <div class="col-12 col-md-5 mb-3 mb-md-0">
        <label class="form-label fw-bold">
          Apellido / DNI
        </label>

        <input
          type="text"
          class="form-control"
          v-model="searchText"
          @keyup.enter="listSearch"
          placeholder="Ingrese Apellido o DNI"
        />
      </div>

      <!-- Email -->
      <div class="col-12 col-md-4 mb-3 mb-md-0">
        <label class="form-label fw-bold">
          E-mail
        </label>

        <input
          type="text"
          class="form-control"
          v-model="searchEmail"
          @keyup.enter="listSearch"
          placeholder="Ingrese un E-mail"
        />
      </div>

      <!-- Botón -->
      <div class="col-12 col-md-3 d-flex align-items-end">
        <button
          type="button"
          class="btn btn-primary w-100"
          @click="listSearch"
        >
          Buscar
        </button>
      </div>

      <!-- Checkbox regulares -->
      <div
        v-if="searchArea === 'estudiantes'"
        class="col-12 mt-3"
      >
        <div class="form-check">
          <input
            type="checkbox"
            class="form-check-input"
            id="mostrarRegulares"
            v-model="showRegulares"
          />
          <label
            for="mostrarRegulares"
            class="form-check-label"
          >
            Mostrar solo alumnos regulares
          </label>
        </div>
      </div>

    </div>
  </div>

  <div class="row">
    <BusquedaItem
      v-for="(item, k) in arrBusqueda"
      :key="item.codigo"
      :item="item"
      :index="k"
      :area="searchArea"
      :showRegulares="showRegulares"
      @open-panel="openPanel"
      @send-key="sendKey"
      @del-user="delUser"
      @show-message="toggleMsgForm"
    />
  </div>

  <MessagePopup
    v-if="showMessage"
    :item="arrBusqueda[indexArr]"
    @close="toggleMsgForm"
    @send-msg="sendMsg"
  />
</template>
<script setup>
import { ref } from 'vue'
import { api } from '@/api/api'
import BusquedaItem from '@/views/admin/components/BusquedaItem.vue'

import MessagePopup from '@/views/admin/components/MessagePopup.vue'
import { showModal } from '@/services/uiBus'
import { useRoute } from 'vue-router'
import { useImpersonation } from '@/views/admin/composables/useImpersonation'
const { openUserPanel }  = useImpersonation()
const searchText = ref('')
const searchEmail = ref('')
const arrBusqueda = ref([])
const showRegulares = ref(false)
const showMessage = ref(false)
const selectedIndex = ref(null)
const indexArr = ref(null)
//const selectedItem = ref(null)
const searchArea = useRoute().meta.area
const listSearch = async () => {
  if (!searchText.value && !searchEmail.value) {
    showModal('Complete el campo de búsqueda')
    return
  }

  const d = {
    searchArea: searchArea,
    nombreDni: searchText.value,
    email: searchEmail.value
  }

  const r = await api.get({
    entity:"busqueda",
    action: "getSearchResults",
    payload: d,
  })
  arrBusqueda.value = r.payload
  selectedIndex.value = null
}
/*
const showData = (index) => {
  if (selectedIndex.value === index) {
    selectedIndex.value = null
    selectedItem.value = null
  } else {
    selectedIndex.value = index
    selectedItem.value = arrBusqueda.value[index]
  }
}
  */
const openPanel = (codigo) => {
    openUserPanel({area: searchArea,codigo})
}
const sendKey = (codigo) => {

}
const toggleMsgForm = (k) => {
    indexArr.value = k
    if (showMessage.value) {
        indexArr.value = null
    }
    showMessage.value = !showMessage.value
}
const sendMsg = async ({asunto, mensaje, codAlumno}) => {
    const r = await api.post({
        entity: "mensajes",
        action: "createThread",
        payload: {
            asunto:asunto,
            mensaje:mensaje,
            codAlumno:codAlumno
        }
    })
    if (r.ok) showModal("Mensaje enviado")
    indexArr.value = null
    showMessage.value = false
}
const delUser = (codigo) => {
    //Codigo para borrar el usuario
}
</script>
