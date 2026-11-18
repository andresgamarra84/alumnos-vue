<template>
<div class="row g-4">
    <h3 class='h3cabecera'>Graduados</h3>
    <p class='col-12'>
        Estudiantes que finalizaron una carrera en el período seleccionado.
        Si no se elige ninguna carrera se muestran todas.
    </p>

    <div class='col-12 col-md-3'>
        <label class='form-label'>Egreso desde</label>
        <input type='date' class='form-control' v-model='desde'>
    </div>
    <div class='col-12 col-md-3'>
        <label class='form-label'>Egreso hasta</label>
        <input type='date' class='form-control' v-model='hasta'>
    </div>
    <div class='col-12 col-md-6'>
        <label class='form-label'>Carreras</label>
        <div class='border rounded p-2' style='max-height: 160px; overflow-y: auto;'>
            <div v-for='c in arrCarreras' :key='c.codigo' class='form-check'>
                <input class='form-check-input' type='checkbox' :id="`carrera_${c.codigo}`" :value='c.codigo' v-model='carrerasSel'>
                <label class='form-check-label' :for="`carrera_${c.codigo}`">{{ c.nombre }}</label>
            </div>
        </div>
        <a v-if='carrerasSel.length' class='small' @click='carrerasSel = []'>Quitar selección</a>
    </div>
    <div class='col-12'>
        <button type='button' class='btn btn-primary' @click='buscar'>Buscar</button>
    </div>

    <div v-if='!buscado' class='col-12'></div>
    <div v-else-if='arrGraduados.length === 0' class='col-12'>No hay graduados para los filtros seleccionados.</div>
    <template v-else>
        <div class='col-12'>{{ arrGraduados.length }} graduado{{ arrGraduados.length === 1 ? '' : 's' }}</div>
        <div
            v-for='item in arrGraduados'
            :key="`${item.codalumno}-${item.codcarrera}`"
            class='row recuadro lista'
        >
            <div class='col-12 col-md-4 py-2'>
                <a @click='openPanel(item.codalumno)'>{{ item.apellido }}, {{ item.nombre }}</a>
                <div>DNI {{ item.nrodoc }}</div>
                <div>Nac.: {{ formatFecha(item.fechanac) }}</div>
            </div>
            <div class='col-12 col-md-4 py-2'>
                <div>{{ item.nombrecarrera }}<span v-if='item.nombreinstrumento'> ({{ item.nombreinstrumento }})</span></div>
                <div>Egreso: {{ formatFecha(item.fechaegreso) }}</div>
            </div>
            <div class='col-12 col-md-4 py-2'>
                <div>{{ item.email || 'Sin mail' }}</div>
                <div>{{ telefonos(item) || 'Sin teléfono' }}</div>
            </div>
        </div>
    </template>
</div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { api } from '@/api/api'
import { useImpersonation } from '@/views/admin/composables/useImpersonation'
const { openUserPanel } = useImpersonation()

const arrCarreras = ref([])
const arrGraduados = ref([])
const carrerasSel = ref([])
const desde = ref('')
const hasta = ref('')
const buscado = ref(false)

onMounted(async () => {
    const { payload } = await api.get({ entity: 'carreras', action: 'getCarreras' })
    arrCarreras.value = payload ?? []
})

const buscar = async () => {
    const { payload } = await api.get({
        entity: 'estudiantes',
        action: 'getGraduados',
        payload: {
            desde: desde.value || null,
            hasta: hasta.value || null,
            codCarreras: carrerasSel.value
        }
    })
    arrGraduados.value = payload ?? []
    buscado.value = true
}

const formatFecha = (f) => {
    if (!f) return '-'
    const [y, m, d] = String(f).slice(0, 10).split('-')
    return `${d}/${m}/${y}`
}
const telefonos = (item) => [item.telcelular, item.telefono].filter(Boolean).join(' / ')
const openPanel = (codigo) => openUserPanel({ area: 'estudiantes', codigo })
</script>
