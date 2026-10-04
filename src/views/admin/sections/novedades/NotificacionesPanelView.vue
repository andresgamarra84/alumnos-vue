<template>
    <h3 class="h3cabecera">Notificaciones del panel</h3>
    <div class="text-end mb-4">
        <button class="btn btn-primary" @click="nuevaEntrada">
            Nueva notificación
        </button>
    </div>
    <div v-if="arrNotif.length === 0" class="text-center"><i>- No hay notificaciones cargadas -</i></div>
    <div v-for="item in arrNotif" :key="item.codigo" class="row lista recuadro align-items-center" style="padding:15px 10px; margin-bottom:15px;">
        <div class="col-8">
            <div>{{ item.texto }}</div>
            <div v-if="item.link" class="text-muted small">{{ item.link }}</div>
        </div>
        <div class="col-4 text-end">
            <button class="btn btn-sm btn-danger" @click="borrarEntrada(item)">Borrar</button>
        </div>
    </div>

    <div v-if="showForm" class="modal-overlay" @click.self="cerrarForm">
        <div class="modal-box">
            <h4 class="text-center mb-3">Nueva notificación</h4>

            <label class="form-label">Texto</label>
            <textarea class="form-control mb-3" rows="4" v-model="textoNotif"></textarea>

            <label class="form-label">Link (opcional)</label>
            <input type="text" class="form-control mb-3" v-model="linkNotif" placeholder="https://...">

            <div class="text-center">
                <button class="btn btn-primary me-2" @click="guardarEntrada">
                    Guardar
                </button>
                <button class="btn btn-secondary" @click="cerrarForm">
                    Cancelar
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from '@/api/api'
import { showToast, showModal } from '@/services/uiBus'

const arrNotif = ref([])
const showForm = ref(false)
const textoNotif = ref('')
const linkNotif = ref('')

onMounted(() => {
    getNotificaciones()
})

const getNotificaciones = async () => {
    const { payload } = await api.get({ entity: 'notificaciones', action: 'getAll' })
    arrNotif.value = payload ?? []
}

const nuevaEntrada = () => {
    textoNotif.value = ''
    linkNotif.value = ''
    showForm.value = true
}

const cerrarForm = () => {
    showForm.value = false
}

const guardarEntrada = async () => {
    if (!textoNotif.value?.trim()) {
        showToast('Ingrese el texto de la notificación', 'error')
        return
    }
    const { ok } = await api.post({
        entity: 'notificaciones',
        action: 'addNotificacion',
        payload: {
            textoNotif: textoNotif.value.trim(),
            linkNotif: linkNotif.value?.trim() || null,
        },
    })
    if (!ok) return
    showForm.value = false
    showToast('La notificación fue creada.', 'success')
    getNotificaciones()
}

const borrarEntrada = async (item) => {
    const ok = await showModal('¿Confirma borrar esta notificación?', 1, 'Confirmación')
    if (!ok) return
    const { ok: deleted } = await api.post({
        entity: 'notificaciones',
        action: 'delNotificacion',
        payload: { codigo: item.codigo },
    })
    if (!deleted) return
    showToast('La notificación fue borrada.', 'success')
    getNotificaciones()
}
</script>

<style scoped>
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
