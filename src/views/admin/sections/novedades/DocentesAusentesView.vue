<template>
    <h3 class="h3cabecera">Docentes ausentes</h3>
    <div class="text-end mb-4">
        <button class="btn btn-primary" @click="nuevaEntrada">
            Nueva entrada
        </button>
    </div>
    <div v-if="!hayAusentes" class="text-center"><i>- No hay ausencias cargadas -</i></div>

    <template v-else>
        <div class="grupo-header grupo-header--seccion" @click="toggleSeccion('proximos')">
            <span class="chevron" :class="{ 'is-open': expandedSecciones.proximos }">❯</span>
            <span class="grupo-titulo">Próximos</span>
            <span class="grupo-contador">{{ contarItems(proximos) }}</span>
        </div>
        <div v-show="expandedSecciones.proximos" class="grupo-contenido grupo-contenido--items-seccion mb-4">
            <div v-if="proximos.length === 0" class="text-muted"><i>- No hay ausencias próximas -</i></div>
            <div v-for="grupoFecha in proximos" :key="grupoFecha.fecha">
                <div class="fecha-titulo">{{ formatFecha(grupoFecha.fecha) }}</div>
                <div v-for="item in grupoFecha.items" :key="item.codigo" class="row lista recuadro align-items-center" style="padding:15px 10px; margin-bottom:15px;">
                    <div class="col-8">
                        <div class="titulo">{{ item.nombreProfesor }}</div>
                        <div class="text-muted small">{{ formatRango(item.desde, item.hasta) }}</div>
                    </div>
                    <div class="col-4 text-end">
                        <button class="btn btn-sm btn-secondary me-2" @click="editarEntrada(item)">Editar</button>
                        <button class="btn btn-sm btn-danger" @click="borrarEntrada(item)">Borrar</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="grupo-header grupo-header--seccion" @click="toggleSeccion('anteriores')">
            <span class="chevron" :class="{ 'is-open': expandedSecciones.anteriores }">❯</span>
            <span class="grupo-titulo">Anteriores</span>
        </div>
        <div v-show="expandedSecciones.anteriores" class="grupo-contenido">
            <div v-if="anteriores.length === 0" class="text-muted"><i>- No hay ausencias anteriores -</i></div>
            <div v-for="grupoAnio in anteriores" :key="grupoAnio.anio">
                <div class="grupo-header grupo-header--anio" @click="toggleAnio(grupoAnio.anio)">
                    <span class="chevron" :class="{ 'is-open': expandedAnios[grupoAnio.anio] }">❯</span>
                    <span class="grupo-titulo">{{ grupoAnio.anio }}</span>
                </div>
                <div v-show="expandedAnios[grupoAnio.anio]" class="grupo-contenido">
                    <div v-for="grupoMes in grupoAnio.meses" :key="grupoMes.mes">
                        <div class="grupo-header grupo-header--mes" @click="toggleMes(grupoAnio.anio, grupoMes.mes)">
                            <span class="chevron" :class="{ 'is-open': expandedMeses[claveMes(grupoAnio.anio, grupoMes.mes)] }">❯</span>
                            <span class="grupo-titulo">{{ grupoMes.label }}</span>
                            <span class="grupo-contador">{{ contarItems(grupoMes.fechas) }}</span>
                        </div>
                        <div v-show="expandedMeses[claveMes(grupoAnio.anio, grupoMes.mes)]" class="grupo-contenido grupo-contenido--items-mes">
                            <div v-for="grupoFecha in grupoMes.fechas" :key="grupoFecha.fecha">
                                <div class="fecha-titulo">{{ formatFecha(grupoFecha.fecha) }}</div>
                                <div v-for="item in grupoFecha.items" :key="item.codigo" class="row lista recuadro align-items-center" style="padding:15px 10px; margin-bottom:15px;">
                                    <div class="col-8">
                                        <div class="titulo">{{ item.nombreProfesor }}</div>
                                        <div class="text-muted small">{{ formatRango(item.desde, item.hasta) }}</div>
                                    </div>
                                    <div class="col-4 text-end">
                                        <button class="btn btn-sm btn-danger" @click="borrarEntrada(item)">Borrar</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </template>

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

    <div v-if="showEditForm" class="modal-overlay" @click.self="cerrarEditForm">
        <div class="modal-box">
            <h4 class="text-center mb-3">Modificar ausencia</h4>

            <p class="text-center text-muted mb-3">{{ editNombreProfesor }}</p>

            <div class="row">
                <div class="col-6">
                    <label class="form-label">Desde</label>
                    <input type="date" class="form-control mb-3" v-model="editFechaDesde">
                </div>
                <div class="col-6">
                    <label class="form-label">Hasta</label>
                    <input type="date" class="form-control mb-3" v-model="editFechaHasta">
                </div>
            </div>

            <div class="text-center">
                <button class="btn btn-primary me-2" @click="guardarEdicion">
                    Guardar
                </button>
                <button class="btn btn-secondary" @click="cerrarEditForm">
                    Cancelar
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { api } from '@/api/api'
import { showToast, showModal } from '@/services/uiBus'

const arrMonths = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

const arrAusentes = ref({ proximos: [], anteriores: [] })
const arrDocentes = ref([])
const showForm = ref(false)
const codProfesor = ref('')
const fechaDesde = ref('')
const fechaHasta = ref('')

// Al elegir la fecha Desde, Hasta se iguala para que por defecto sea un solo día
watch(fechaDesde, (nueva) => {
    fechaHasta.value = nueva
})

const showEditForm = ref(false)
const editCodigo = ref(null)
const editCodProfesor = ref(null)
const editNombreProfesor = ref('')
const editFechaDesde = ref('')
const editFechaHasta = ref('')

const expandedSecciones = reactive({ proximos: false, anteriores: false })
const expandedAnios = reactive({})
const expandedMeses = reactive({})

const claveMes = (anio, mes) => `${anio}-${mes}`

const toggleSeccion = (clave) => {
    expandedSecciones[clave] = !expandedSecciones[clave]
}

const toggleAnio = (anio) => {
    expandedAnios[anio] = !expandedAnios[anio]
}

const toggleMes = (anio, mes) => {
    const clave = claveMes(anio, mes)
    expandedMeses[clave] = !expandedMeses[clave]
}

const proximos = computed(() => arrAusentes.value.proximos ?? [])

// Los meses llegan del BE como "01".."12"; se les agrega el nombre para mostrarlos
const anteriores = computed(() =>
    (arrAusentes.value.anteriores ?? []).map(grupoAnio => ({
        ...grupoAnio,
        meses: grupoAnio.meses.map(grupoMes => ({
            ...grupoMes,
            label: arrMonths[parseInt(grupoMes.mes, 10) - 1],
        })),
    }))
)

const contarItems = (fechas) => fechas.reduce((total, f) => total + f.items.length, 0)

const hayAusentes = computed(() => proximos.value.length > 0 || anteriores.value.length > 0)

onMounted(() => {
    getDocentes()
    getAusentes()
})

const getAusentes = async () => {
    const { payload } = await api.get({ entity: 'calendario', action: 'getAusentesAgrupados' })
    arrAusentes.value = payload ?? { proximos: [], anteriores: [] }
}

const getDocentes = async () => {
    const { payload } = await api.get({ entity: 'profesores', action: 'getProfesores' })
    arrDocentes.value = payload ?? []
}

const arrDiasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

const formatFecha = (f) => {
    const [y, m, d] = f.split('-')
    return `${arrDiasSemana[new Date(y, m - 1, d).getDay()]} ${d}/${m}/${y}`
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
    const payloadAusente = {
        codProfesor: codProfesor.value,
        fechaDesde: fechaDesde.value,
        fechaHasta: fechaHasta.value || null,
    }
    const { ok } = await api.post({
        entity: 'calendario',
        action: 'addAusente',
        payload: payloadAusente,
    })
    if (!ok) return
    showForm.value = false
    showToast('La ausencia fue registrada.', 'success')
    getAusentes()

    const { ok: notificar } = await showModal(
        '¿Desea notificar por mail a los estudiantes inscriptos en las clases afectadas por esta ausencia?',
        1,
        'Notificar estudiantes'
    )
    if (!notificar) return
    const { ok: notifOk, payload } = await api.post({
        entity: 'calendario',
        action: 'notificarAusentes',
        payload: payloadAusente,
    })
    if (!notifOk) return
    showToast(`Se notificó a ${payload.notificados} estudiante(s).`, 'success')
}

const borrarEntrada = async (item) => {
    const { ok } = await showModal('¿Confirma borrar esta ausencia?', 1, 'Confirmación')
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

const editarEntrada = (item) => {
    editCodigo.value = item.codigo
    editCodProfesor.value = item.codprofesor
    editNombreProfesor.value = item.nombreProfesor
    editFechaDesde.value = item.desde
    editFechaHasta.value = item.hasta === item.desde ? '' : item.hasta
    showEditForm.value = true
}

const cerrarEditForm = () => {
    showEditForm.value = false
}

const guardarEdicion = async () => {
    if (!editFechaDesde.value) {
        showToast('Ingrese la fecha desde', 'error')
        return
    }
    const { ok } = await api.post({
        entity: 'calendario',
        action: 'updAusente',
        payload: {
            codigo: editCodigo.value,
            codProfesor: editCodProfesor.value,
            fechaDesde: editFechaDesde.value,
            fechaHasta: editFechaHasta.value || null,
        },
    })
    if (!ok) return
    showEditForm.value = false
    showToast('La ausencia fue actualizada.', 'success')
    getAusentes()
}
</script>

<style scoped>
.grupo-header {
    cursor: pointer;
    user-select: none;
    display: flex;
    align-items: center;
    gap: 10px;
    border-radius: 8px;
    transition: background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.grupo-header:hover {
    background-color: var(--color-fondo-principal);
}

.chevron {
    display: inline-block;
    width: 0.7em;
    flex-shrink: 0;
    color: var(--color-acento);
    transition: transform 0.2s ease-in-out;
}

.chevron.is-open {
    transform: rotate(90deg);
}

.grupo-titulo {
    flex: 1;
}

.grupo-contador {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--color-acento);
    background-color: var(--color-fondo-principal);
    border: 1px solid var(--color-borde);
    border-radius: 999px;
    padding: 2px 10px;
}

.grupo-header--seccion {
    padding: 14px 16px;
    margin-bottom: 10px;
    background-color: var(--color-fondo-secundario);
    border: 1px solid var(--color-borde);
    border-left: 4px solid var(--color-acento);
    box-shadow: 0px 2px 4px var(--sombra-suave);
}

.grupo-header--seccion:hover {
    box-shadow: 0px 4px 8px var(--sombra-hover);
}

.grupo-header--seccion .grupo-titulo {
    font-size: 1.1rem;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    color: var(--color-texto-principal);
}

.grupo-header--anio {
    padding: 10px 14px;
    margin: 0 0 8px 20px;
    background-color: var(--color-fondo-secundario);
    border-left: 3px solid var(--color-acento-claro);
}

.grupo-header--anio .grupo-titulo {
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-texto-principal);
}

.grupo-header--mes {
    padding: 8px 12px;
    margin: 0 0 8px 44px;
    background-color: transparent;
    border-left: 2px solid var(--color-borde);
}

.grupo-header--mes .grupo-titulo {
    font-size: 0.9rem;
    color: var(--color-texto-secundario);
}

.grupo-contenido {
    margin-bottom: 6px;
}

.fecha-titulo {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--color-texto-secundario);
    margin: 0 0 8px 4px;
}

.grupo-contenido--items-seccion {
    padding-left: 16px;
}

.grupo-contenido--items-mes {
    padding-left: 44px;
}

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
