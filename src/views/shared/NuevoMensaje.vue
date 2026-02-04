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
                ></textarea>
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
    import {defineEmits} from 'vue'
    import { showModal } from '@/services/uiBus';
    const emit = defineEmits(['send-msg', 'close'])
    const newMsg = (asunto, mensaje) => {
        if (asunto === "" || mensaje === "") {
            showModal("El asunto y mensaje no pueden estar vacíos.")
            return
        }
        emit('send-msg', {asunto, mensaje})
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