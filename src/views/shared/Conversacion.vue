<template>
    <div class="col-12 recuadro msg-cuerpo">
        <div
            v-for="(m, i) in arrMensajes"
            :key="i"
            :class="['mensaje', getMessageClass(m.clase)]"
            v-html="m.mensaje"
        />

        <div>
            <textarea
                class="form-control t-area-rta"
                rows="4"
                :value="respuesta"
                @input="emit('update:respuesta', $event.target.value)"
            />
        </div>

        <div class="text-end">
            <button class="btn btn-secondary m-2" @click.stop="emit('close-chat')">
                Cerrar conversacion
            </button>
            <button class="btn btn-primary m-2" @click="emit('send-msg')">
                Enviar respuesta
            </button>
        </div>
    </div>
</template>

<script setup>
import { defineEmits, defineProps } from 'vue'

const emit = defineEmits(['send-msg', 'update:respuesta', 'close-chat'])

defineProps({
    arrMensajes: {
        type: Array,
        default: () => []
    },
    respuesta: {
        type: String,
        default: ''
    }
})

const getMessageClass = (clase) => {
    if (clase === 'alumno' || clase === 'fondoAlumno' || clase === 0 || clase === 1 || clase === '0' || clase === '1') {
        return 'text-left fondoAlumno'
    }
    return 'text-right fondoAdmin'
}
</script>

<style scoped>
.msg-cuerpo {
    width: 100%;
    margin-top: 10px;
    background-color: var(--color-fondo-secundario);
    box-shadow: 0 4px 8px var(--sombra-suave);
    border: 1px solid var(--color-borde);
    border-radius: 8px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.mensaje {
    white-space: pre-line;
    margin-bottom: 10px;
    padding: 10px;
    border-bottom: 1px solid #ddd;
}

.text-left {
    align-self: flex-start;
    max-width: 80%;
    margin-right: 20%;
    border-radius: 10px 10px 10px 0;
}

.text-right {
    align-self: flex-end;
    max-width: 80%;
    margin-left: 20%;
    border-radius: 10px 10px 0 10px;
}

.fondoAlumno {
    background-color: var(--color-fondo-principal);
    color: var(--color-texto-principal);
}

.fondoAdmin {
    background-color: var(--color-acento);
    color: var(--color-fondo-secundario);
}

.t-area-rta {
    width: 100%;
    resize: none;
    border: 1px solid var(--color-borde);
    border-radius: 5px;
    padding: 10px;
    background-color: var(--color-fondo-principal);
    color: var(--color-texto-principal);
}
</style>
