<template>
    <div class="modal-overlay">
        <div class="modal-box">
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
                    :maxlength="maxLength || undefined"
                ></textarea>
                <div v-if="maxLength" class="text-end text-muted small">
                    {{ nuevoMensaje.length }}/{{ maxLength }}
                </div>
            </div>

            <div v-if="showFechaHasta" class="mb-2">
                <label>Mostrar en el panel del estudiante hasta</label>
                <input
                    type="date"
                    class="form-control"
                    v-model="fechaHasta"
                />
            </div>

            <div class="text-end">
                <button
                    class="btn btn-secondary me-2"
                    @click="emit('close')"
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
    </div>
</template>

<script setup>
import { defineEmits, defineProps, ref } from 'vue'
import { showToast } from '@/services/uiBus'

const props = defineProps({
    maxLength: { type: Number, default: null },
    showFechaHasta: { type: Boolean, default: false },
})

const emit = defineEmits(['send-msg', 'close'])
const nuevoAsunto = ref('')
const nuevoMensaje = ref('')

const diasDefault = 30
const fechaHasta = ref(
    new Date(Date.now() + diasDefault * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
)

const newMsg = (asunto, mensaje) => {
    if (!asunto?.trim() || !mensaje?.trim()) {
        showToast('El asunto y mensaje no pueden estar vacios.', 'error')
        return
    }
    if (props.maxLength && mensaje.trim().length > props.maxLength) {
        showToast(`El mensaje no puede superar los ${props.maxLength} caracteres.`, 'error')
        return
    }

    emit('send-msg', {
        asunto: asunto.trim(),
        mensaje: mensaje.trim(),
        fechaHasta: props.showFechaHasta ? fechaHasta.value : null,
    })
    emit('close')
    nuevoAsunto.value = ''
    nuevoMensaje.value = ''
}
</script>

<style>
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.55);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
}

.modal-box {
    background: #fff;
    padding: 25px;
    border-radius: 8px;
    width: 100%;
    max-width: 420px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}
</style>
