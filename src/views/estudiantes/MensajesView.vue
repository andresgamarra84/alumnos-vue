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

    <div v-if="showNewMsg" class="col-12 recuadro mt-3">

    <div class="mb-2">
        <label>Asunto</label>
        <input
        type="text"
        class="form-control"
        v-model="nuevoAsunto"
        />
    </div>

    <div class="mb-2">
        <label>Mensaje</label>
        <textarea
        class="form-control"
        rows="4"
        v-model="nuevoMensaje"
        ></textarea>
    </div>

    <div class="text-end">
        <button
        class="btn btn-secondary me-2"
        @click="showNewMsg = false"
        >
        Cancelar
        </button>

        <button
        class="btn btn-success"
        @click="newMsg(nuevoAsunto, nuevoMensaje)"
        >
        Enviar mensaje
        </button>
    </div>

    </div>

    <!-- Bandeja -->
    <div class="col-12" id="msg_lista">
      <div
        v-for="(item, k) in arrBandeja"
        :key="item.codHilo"
        class="row carrera-item"
        style="margin: 20px 0; cursor:pointer"
        @click="getMsg(k)"
      >
        <div class="col-6">{{ item.asunto }}</div>
        <div class="col-6 text-end">{{ item.fechaIngreso }}</div>
      </div>
    </div>

    <!-- Conversación -->
    <div v-if="showCuerpo" id="msg_cuerpo" class="col-12 recuadro">
      <div
        v-for="(m, i) in arrMensajes"
        :key="i"
        :class="m.clase"
        style="white-space: pre-line; margin-bottom: 10px"
      >
        {{ m.mensaje }}
      </div>

      <button class="btn btn-secondary mt-2" @click="ocultarConversacion">
        Cerrar conversación
      </button>
    </div>

    <!-- Respuesta -->
    <div v-if="showRta" class="col-12 mt-3">
      <textarea
        id="tAreaRta"
        class="form-control"
        rows="4"
        v-model="respuesta"
      />
      <button class="btn btn-primary mt-2" @click="sendMsg(respuesta)">
        Enviar respuesta
      </button>
    </div>

  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { api } from '@/api/api'
import { showModal } from '@/services/uiBus'

/* ---------- state ---------- */
const showCuerpo = ref(false)
const showRta = ref(false)
const showNewMsg = ref(false)
const nuevoAsunto = ref('')
const nuevoMensaje = ref('')

const hilo = ref(null)

const arrBandeja = ref([])
const arrMensajes = ref([])

/* ---------- methods ---------- */
const list = async () => {
  arrBandeja.value = []
  const r = await api.get({
    entity: 'mensajes',
    action: 'getAllThreads'
  })

  if (r.ok) {
    arrBandeja.value = r.payload ?? []
  }
}

const getMsg = async (index) => {
  const item = arrBandeja.value[index]
  hilo.value = item.codHilo
  arrMensajes.value = []

  const r = await api.get({
    entity: 'mensajes',
    action: 'getMessageFromThread',
    payload: { codHilo: hilo.value }
  })

  if (r.ok) {
    r.payload.forEach(v => {
      arrMensajes.value.push({
        mensaje: v.mensaje,
        fechaIngreso: v.fechaIngreso,
        clase:
          v.codTipo === 0 || v.codTipo === 1
            ? 'col-10 fondoAlumno text-left'
            : 'col-10 offset-2 fondoAdmin text-right',
      })
    })

    showCuerpo.value = true
    showRta.value = !r.payload[r.payload.length - 1]?.estado
  }
}

const ocultarConversacion = () => {
  arrMensajes.value = []
  hilo.value = null
  showCuerpo.value = false
  showRta.value = false
}

const sendMsg = async (mensaje) => {
  if (!mensaje) {
    await showModal('El mensaje no puede estar vacío', 0, 'Error')
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
    action: 'addMessageToThread',
    payload: {
      codHilo: hilo.value,
      mensaje
    }
  })

  if (r.ok) {
    await showModal('Mensaje enviado')
    ocultarConversacion()
    list()
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
