<script setup>
import { ref, watch } from 'vue'
import { showModal } from '@/services/uiBus'
const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['send-msg', 'close'])

const title = ref('')
const message = ref('')

/* Resetear campos cuando cambia el destinatario */
watch(
  () => props.item,
  () => {
    title.value = ''
    message.value = ''
  }
)

const send = () => {
  if (!title.value || !message.value) {
    showModal('Complete asunto y mensaje')
    return
  }

  emit('send-msg', {
    asunto: title.value,
    mensaje: message.value,
    codAlumno: props.item.codigo
  })
}

const close = () => {
  emit('close')
}
</script>

<template>
  <div
    class="position-fixed top-50 start-50 translate-middle bg-white shadow p-3 rounded ontop"
    style="width: 90%; max-width: 500px;"
  >
    <div class="mb-3">
      <input
        type="text"
        class="form-control"
        placeholder="Asunto"
        v-model="title"
      />
    </div>

    <div class="mb-3">
      <textarea
        class="form-control"
        placeholder="Mensaje"
        rows="5"
        v-model="message"
      />
    </div>

    <div class="d-flex justify-content-around">
      <button
        class="btn btn-success"
        @click="send"
      >
        Enviar
      </button>

      <button
        class="btn btn-danger"
        @click="close"
      >
        Cancelar
      </button>
    </div>
  </div>
</template>
