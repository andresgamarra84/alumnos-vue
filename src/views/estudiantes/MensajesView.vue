<template>
  <div class="row">
    <!-- Nuevo mensaje -->
      <div class="col-12 mb-3 text-end">
        <button
            class="btn btn-primary"
            @click="showNewMsg = true"
        >
            Nuevo mensaje
        </button>
      </div>

    <NuevoMensaje />

    <!-- Bandeja -->
    <div class="col-12">
      <div
        v-for="(item, k) in arrBandeja"
        :key="item.codHilo"
        class="row carrera-item"
        style="margin: 20px 0; cursor:pointer"
        @click="getMsg(k)"
      >
        <div class="col-6">{{ item.asunto }}</div>
        <div class="col-6 text-end">{{ item.fechaIngreso }}</div>
        <Conversacion
          :arrMensajes="item.mensajes"
          :respuesta="respuesta"
          @send-msg="sendMsg(k)"
          @close-chat="closeChat(k)"
          @update:respuesta="updateRespuesta"
        />
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { api } from '@/api/api'
import { showModal } from '@/services/uiBus'
import { Conversacion } from '@/views/shared/Conversacion.vue'

/* ---------- state ---------- */
const showNewMsg = ref(false)
const nuevoAsunto = ref('')
const nuevoMensaje = ref('')
const respuesta = ref('')
const arrBandeja = ref([])
/* ---------- methods ---------- */
const list = async () => {
  arrBandeja.value = []
  const {payload} = await api.get({
    entity: 'mensajes',
    action: 'getAllThreads'
  })
  arrBandeja.value = payload ?? []
}

const getMsg = async (index) => {
  if (arrBandeja.value[index].mensajes.length>0) return
  let codHilo = arrBandeja.value[index].codHilo
  const {payload} = await api.get({
    entity: 'mensajes',
    action: 'getMessageFromThread',
    payload: { codHilo }
  })
  arrBandeja.value[index].mensajes = payload.map(v => ({
    mensaje: v.mensaje,
    fechaIngreso: v.fechaIngreso,
    clase: v.codTipo 
  }))
}

const closeChat = (k) => {
  arrBandeja.value[k].mensajes = []
}
const updateRespuesta = (t) => {
  respuesta.value = t
}
const sendMsg = async (k) => {
  if (!respuesta.value) {
    showModal('El mensaje no puede estar vacío')
    return
  }
  const {ok} = await showModal(
    '¿Confirma que desea enviar este mensaje?',
    1,
    'Confirmación'
  )
  if (!ok) return
  const codHilo = arrBandeja.value[k].codHilo
  const mensaje = respuesta.value
  const r = await api.post({
    entity: 'mensajes',
    action: 'addMessageToThread',
    payload: {
      codHilo,
      mensaje
    }
  })

  if (r.ok) {
    await showModal('Mensaje enviado')
    arrBandeja.value[k].mensajes.push({mensaje, clase:"alumno"})
    respuesta.value = ''
  }
}

const newMsg = async (asunto, mensaje) => {
  if (!asunto || !mensaje) {
    await showModal('Asunto y mensaje son obligatorios', 0, 'Error')
    return
  }

  const rta = await showModal(
    '¿Confirma que desea enviar este mensaje?',
    1,
    'Confirmación'
  )

  if (!rta.ok) return

  const r = await api.post({
    entity: 'mensajes',
    action: 'createThread',
    payload: { asunto, mensaje }
  })

  if (r.ok) {
    await showModal('Mensaje enviado')
    nuevoAsunto.value = ''
    nuevoMensaje.value = ''
    showNewMsg.value = false
    list()
  }
}

/* ---------- lifecycle ---------- */
onMounted(() => {
  list()
})
</script>
