<template>
    <div class="col-12 recuadro msg-cuerpo">
        <div
            v-for="(m, i) in arrMensajes"
            :key="i"
            :class="['mensaje', getMessageClass(m.clase)]"
        >
            <div v-html="linkify(m.mensaje)" />
            <div
                v-if="showVistoIndicator && m.clase === 'admin'"
                class="visto-indicator"
                :class="m.visto ? 'visto-leido' : 'visto-pendiente'"
                :title="m.visto ? 'Visto por el estudiante' : 'No visto todavía'"
            >
                &#10003;&#10003;
            </div>
        </div>

        <div>
            <textarea
                class="form-control t-area-rta"
                rows="4"
                :value="respuesta"
                @input="emit('update:respuesta', $event.target.value)"
            />
        </div>

        <div class="text-end">
            <button v-if="showArchivar" class="btn btn-outline-secondary m-2" @click.stop="emit('close-thread')">
                Archivar
            </button>
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
import DOMPurify from 'dompurify'

const emit = defineEmits(['send-msg', 'update:respuesta', 'close-chat', 'close-thread'])

defineProps({
    arrMensajes: {
        type: Array,
        default: () => []
    },
    respuesta: {
        type: String,
        default: ''
    },
    showArchivar: {
        type: Boolean,
        default: false
    },
    showVistoIndicator: {
        type: Boolean,
        default: false
    }
})

const URL_REGEX = /\b(?:https?:\/\/|www\.)[^\s<>"']+/gi

// Los links existentes también se abren en una pestaña nueva
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    if (node.tagName === 'A') {
        node.setAttribute('target', '_blank')
        node.setAttribute('rel', 'noopener noreferrer')
    }
})

const sanitize = (html) => DOMPurify.sanitize(String(html ?? ''), {
    ALLOWED_TAGS: ['br', 'a', 'b', 'strong', 'i', 'em', 'u', 'p', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href'],
})

// Sanitiza el mensaje y convierte las URL del texto en links, sin tocar las etiquetas HTML ni lo que ya está dentro de un <a>
const linkify = (html) => {
    let dentroDeLink = false
    return sanitize(html).split(/(<[^>]*>)/).map((parte) => {
        if (parte.startsWith('<')) {
            if (/^<a[\s>]/i.test(parte)) dentroDeLink = true
            else if (/^<\/a\s*>/i.test(parte)) dentroDeLink = false
            return parte
        }
        if (dentroDeLink) return parte
        return parte.replace(URL_REGEX, (url) => {
            // la puntuación final no forma parte de la URL
            const [, limpia, resto] = url.match(/^(.*?)([.,;:!?)\]]*)$/)
            const href = /^www\./i.test(limpia) ? `https://${limpia}` : limpia
            return `<a href="${href}" target="_blank" rel="noopener noreferrer">${limpia}</a>${resto}`
        })
    }).join('')
}

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
    background-color: var(--color-acento-hover);
    color: #fff;
}

.mensaje :deep(a) {
    color: inherit;
    text-decoration: underline;
    word-break: break-all;
}

.visto-indicator {
    font-size: 0.85em;
    text-align: right;
    letter-spacing: -1px;
    margin-top: -4px;
}

.visto-pendiente {
    color: rgba(255, 255, 255, 0.75);
}

.visto-leido {
    color: #34b7f1;
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
