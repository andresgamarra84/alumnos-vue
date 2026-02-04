<template>
  <div class="row">    
    <NuevoMensaje
      v-if="showMsgModal"
      @send-msg="newMsg"
      @close="closeMsgModal"
    />
    <div class="col-12">
      <HiloItem
        v-for="(item, k) in arrHilos"
        :item="item"
        @click="getMsg(k)"
      >
        <Conversacion
          v-if="item.mensajes.length>0"
          :mensajes="item.mensajes"
          :txtRespuesta="txtRespuesta"
          @send-msg="sendMsg(k)"
          @close-chat="closeChat(k)"
          @update:txt-respuesta="updateTxtRespuesta"
        />
      </HiloItem>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { api } from '@/api/api'
import { showModal } from '@/services/uiBus'
import Conversacion from '@/views/shared/Conversacion.vue'
import HiloItem from '@/views/shared/HiloItem.vue'
import NuevoMensaje from '../shared/NuevoMensaje.vue'

/* ---------- state ---------- */
const showMsgModal = ref(false)
const nuevoAsunto = ref('')
const nuevoMensaje = ref('')
const arrHilos = ref([])
const txtRespuesta = ref('')

/* ---------- methods ---------- */
const list = async () => {
  const {payload} = await api.get({
    entity: 'mensajes',
    action: 'getAllThreads'
  })
  arrHilos.value = payload ?? []
}

const getMsg = async (index) => {
  if (arrHilos.value[index].mensajes.length>0) return
  const item = arrHilos.value[index]
  const codHilo = item.codHilo
  const { payload } = await api.get({
    entity: 'mensajes',
    action: 'getMessageFromThread',
    payload: { codHilo }
  })
  item.mensajes = payload.map(v => ({
    mensaje: v.mensaje,
    fechaIngreso: v.fechaIngreso,
    clase : v.codTipo
  })) ?? []
}
const closeChat = (k) => {
  arrHilos.value[k].mensajes = []
}

const closeMsgModal = () => {
  showMsgModal.value = false
}

const sendMsg = async (k) => {
  if (!txtRespuesta.value) {
    await showModal('El mensaje no puede estar vacío')
    return
  }
  const {ok} = await showModal(
    '¿Confirma que desea enviar este mensaje?',
    1
  )
  if (!ok) return
  const codHilo = arrHilos.value[k].codHilo
  const mensaje = txtRespuesta.value
  const r = await api.post({
    entity: 'mensajes',
    action: 'addMessageToThread',
    payload: {
      codHilo,
      mensaje,
      codAlumno: arrHilos.value[k].codAlumno
    }
  })
  if (r.ok) {
    await showModal('Mensaje enviado')
  }
  txtRespuesta.value = ''
  closeChat(k)
  list()
}

const newMsg = async (asunto, mensaje) => {
  const c = await showModal(
    '¿Confirma que desea enviar este mensaje?',
    1
  )
  if (!c.ok) return
  const r = await api.post({
    entity: 'mensajes',
    action: 'addMessageToThread',
    payload: { asunto, mensaje }
  })
  if (r.ok) {
    showModal('Mensaje enviado')
  }
  showMsgModal.value = false
  nuevoAsunto.value = ""
  nuevoMensaje.value = ""
  list()
}

const updateTxtRespuesta = (str) => {
  txtRespuesta.value = str
}

/* ---------- lifecycle ---------- */
onMounted(() => {
  list()
})
</script>
