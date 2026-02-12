<template>
    <!-- Conversación -->
    <div class="col-12 recuadro">
        <div
            v-for="(m, i) in arrMensajes"
            :key="i"
            :class="['mensaje', m.clase]"
            v-html="m.mensaje"
        />
        <div>
            <textarea
                class="form-control"
                rows="4"
                :value="respuesta"
                @input="emit('update:respuesta', $event.target.value)"
            />
        </div>
        <div class="text-end">
            <button class="btn btn-primary m-2" @click.stop="emit('close-chat')">
                Cerrar conversación
            </button>
            <button class="btn m-2" @click="emit('send-msg')">
                Enviar respuesta
            </button>
        </div>
    </div>
</template>
<script setup>
    import { defineEmits, defineProps } from 'vue';
    const emit = defineEmits(["send-msg", "update:respuesta", "close-chat"])
    const props = defineProps({
        arrMensajes: {
            type: Array,
            default: () => [],
        },
        respuesta: {
            type: String,
            default: ''
        }
    })
</script>
<style>
    .mensaje {
        white-space: pre-line; 
        margin-bottom: 10px;
        padding: 10px;
        border-radius: 10px;
    }
    .alumno {
        background: #e6f2ff;
        text-align: left;
    }

    .admin {
        background: #f0e6ff;
        text-align: right;
        margin-left: auto; /* equivalente al offset */
    }
</style>
