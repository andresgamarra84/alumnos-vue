<template>
    <h3 class="h3cabecera">Docentes ausentes</h3>
    <div class="text-end mb-4">
        <button class="btn btn-primary" @click="nuevaEntrada">
            Nueva entrada
        </button>
    </div>
    <div v-if="arrAusentes.length === 0" class="text-center"><i>- No hay ausencias cargadas -</i></div>
    <div v-for="item in arrAusentes" :key="item.codigo" class="row lista recuadro align-items-center" style="padding:15px 10px; margin-bottom:15px;">
        <div class="col-8">
            <div class="titulo">{{ item.nombreProfesor }}</div>
            <div class="text-muted small">{{ formatRango(item.desde, item.hasta) }}</div>
        </div>
        <div class="col-4 text-end">
            <button class="btn btn-sm btn-danger" @click="borrarEntrada(item)">Borrar</button>
        </div>
    </div>

    <div v-if="showForm" class="modal-overlay" @click.self="cerrarForm">
        <div class="modal-box">
            <h4 class="text-center mb-3">Nuevo docente ausente</h4>

            <label class="form-label">Docente</label>
            <select class="form-control mb-3" v-model="codProfesor">
                <option disabled value="">Seleccione...</option>
                <option v-for="p in arrDocentes" :key="p.codigo" :value="p.codigo">{{ p.nombre }}</option>
            </select>

            <div class="row">
                <div class="col-6">
                    <label class="form-label">Desde</label>
                    <input type="date" class="form-control mb-3" v-model="fechaDesde">
                </div>
                <div class="col-6">
                    <label class="form-label">Hasta</label>
                    <input type="date" class="form-control mb-3" v-model="fechaHasta">
                </div>
            </div>

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

const arrAusentes = ref([])
const arrDocentes = ref([])
const showForm = ref(false)
const codProfesor = ref('')
const fechaDesde = ref('')
const fechaHasta = ref('')

onMounted(() => {
    getDocentes()
    getAusentes()
})

const getAusentes = async () => {
    const { payload } = await api.get({ entity: 'calendario', action: 'getAusentes' })
    arrAusentes.value = payload ?? []
}

const getDocentes = async () => {
    const { payload } = await api.get({ entity: 'profesores', action: 'getProfesores' })
    arrDocentes.value = payload ?? []
}

const formatRango = (desde, hasta) => {
    const fmt = (f) => {
        const [y, m, d] = f.split('-')
        return `${d}/${m}/${y}`
    }
    if (!hasta || hasta === desde) return fmt(desde)
    return `${fmt(desde)} - ${fmt(hasta)}`
}

const nuevaEntrada = () => {
    codProfesor.value = ''
    fechaDesde.value = ''
    fechaHasta.value = ''
    showForm.value = true
}

const cerrarForm = () => {
    showForm.value = false
}

const guardarEntrada = async () => {
    if (!codProfesor.value || !fechaDesde.value) {
        showToast('Seleccione el docente y la fecha desde', 'error')
        return
    }
    const { ok } = await api.post({
        entity: 'calendario',
        action: 'addAusente',
        payload: {
            codProfesor: codProfesor.value,
            fechaDesde: fechaDesde.value,
            fechaHasta: fechaHasta.value || null,
        },
    })
    if (!ok) return
    showForm.value = false
    showToast('La ausencia fue registrada.', 'success')
    getAusentes()
}

const borrarEntrada = async (item) => {
    const ok = await showModal('¿Confirma borrar esta ausencia?', 1, 'Confirmación')
    if (!ok) return
    const { ok: deleted } = await api.post({
        entity: 'calendario',
        action: 'delAusente',
        payload: { codigo: item.codigo },
    })
    if (!deleted) return
    showToast('La ausencia fue borrada.', 'success')
    getAusentes()
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
