<template>
    <h3 class="h3cabecera">Agenda de actividades</h3>
    <div class="text-end mb-4">
        <button class="btn btn-primary" @click="nuevaEntrada">
            Nueva entrada
        </button>
    </div>
    <div v-if="entradas.length === 0" class="text-center"><i>- No hay entradas cargadas -</i></div>
    <div v-for="e in entradas" :key="e.codigo" class="row lista recuadro align-items-center" style="padding:15px 10px; margin-bottom:15px;">
        <div class="col-md-3 text-center mb-2 mb-md-0">
            <img v-if="e.img_path" :src="imgUrl(e)" alt="" style="max-width:100%; max-height:120px; object-fit:cover;" />
            <span v-else class="text-muted"><i>- Sin imagen -</i></span>
        </div>
        <div class="col-md-7">
            <div class="titulo">{{ e.titulo }}</div>
            <div v-if="e.fecha_actividad" class="text-muted small mb-1">
                {{ formatFechaHora(e.fecha_actividad, e.hora_actividad) }}
            </div>
            <div>{{ e.descripcion }}</div>
        </div>
        <div class="col-md-2 text-end">
            <button class="btn btn-sm btn-secondary mb-2 w-100" @click="subirImagen(e)">
                {{ e.img_path ? 'Cambiar imagen' : 'Cargar imagen' }}
            </button>
            <button class="btn btn-sm btn-danger w-100" @click="borrarEntrada(e)">Borrar</button>
        </div>
    </div>

    <!-- MODAL OVERLAY -->
    <div v-if="showForm" class="modal-overlay" @click.self="cerrarForm">
        <div class="modal-box">
            <h4 class="text-center mb-3">Nueva entrada de agenda</h4>

            <label class="form-label">Título</label>
            <input type="text" class="form-control mb-3" v-model="nuevoTitulo">

            <label class="form-label">Descripción</label>
            <textarea class="form-control mb-3" rows="4" v-model="nuevaDescripcion"></textarea>

            <div class="row">
                <div class="col-6">
                    <label class="form-label">Fecha de la actividad</label>
                    <input type="date" class="form-control mb-3" v-model="nuevaFecha">
                </div>
                <div class="col-6">
                    <label class="form-label">Hora de la actividad</label>
                    <input type="time" class="form-control mb-3" v-model="nuevaHora">
                </div>
            </div>

            <label class="form-label">Imagen</label>
            <input type="file" accept="image/*" class="form-control mb-2" @change="onImagenSeleccionada">
            <div v-if="imagenPreview" class="text-center mb-3">
                <img :src="imagenPreview" alt="Vista previa" style="max-width:100%; max-height:160px; object-fit:contain;" />
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
    import Resumable from 'resumablejs'
    import { showToast, showModal } from '@/services/uiBus.js'
    import { api } from '@/api/api'
    import { SESSION_NAME } from '@/config/app.config'

    const entradas = ref([])
    const showForm = ref(false)
    const nuevoTitulo = ref('')
    const nuevaDescripcion = ref('')
    const nuevaFecha = ref('')
    const nuevaHora = ref('')
    const imagenFile = ref(null)
    const imagenPreview = ref('')

    onMounted(() => {
        getNovedades()
    })

    const getNovedades = async () => {
        const { payload } = await api.get({
            entity: 'novedades',
            action: 'getNovedades',
        })
        entradas.value = payload
    }

    const imgUrl = (e) => `https://cjjc.edu.ar/uploads/novedades/${e.codigo}/${e.img_path}`

    const formatFechaHora = (fecha, hora) => {
        const [y, m, d] = fecha.split('-')
        const fechaFmt = `${d}/${m}/${y}`
        return hora ? `${fechaFmt} - ${hora.slice(0, 5)} hs` : fechaFmt
    }

    const nuevaEntrada = () => {
        nuevoTitulo.value = ''
        nuevaDescripcion.value = ''
        nuevaFecha.value = ''
        nuevaHora.value = ''
        limpiarImagenSeleccionada()
        showForm.value = true
    }

    const cerrarForm = () => {
        showForm.value = false
        limpiarImagenSeleccionada()
    }

    const limpiarImagenSeleccionada = () => {
        if (imagenPreview.value) URL.revokeObjectURL(imagenPreview.value)
        imagenFile.value = null
        imagenPreview.value = ''
    }

    const onImagenSeleccionada = (event) => {
        const file = event.target.files?.[0]
        if (!file) return
        if (!file.type.startsWith('image')) {
            showToast('Solo se permiten imágenes (PNG o JPG).', 'error')
            event.target.value = ''
            return
        }
        limpiarImagenSeleccionada()
        imagenFile.value = file
        imagenPreview.value = URL.createObjectURL(file)
    }

    const guardarEntrada = async () => {
        const { ok, payload: codigo } = await api.post({
            entity: 'novedades',
            action: 'addNovedad',
            payload: {
                titulo: nuevoTitulo.value?.trim() || null,
                descripcion: nuevaDescripcion.value?.trim() || null,
                fecha_actividad: nuevaFecha.value || null,
                hora_actividad: nuevaHora.value || null,
            },
        })
        if (!ok) return
        const archivo = imagenFile.value
        showForm.value = false
        limpiarImagenSeleccionada()
        showToast('La entrada fue creada.', 'success')
        await getNovedades()
        if (archivo) {
            const creada = entradas.value.find(item => item.codigo == codigo)
            if (creada) await subirImagenArchivo(creada, archivo)
        }
    }

    const crearResumable = (entrada, { onSuccess, onError } = {}) => {
        const uploadPayload = {
            typeFile: 'novedades',
            codNovedad: entrada.codigo,
        }
        const upl = new Resumable({
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem(SESSION_NAME)}`
            },
            target: 'https://cjjc.edu.ar/api-v2/',
            testChunks: false,
            query: () => ({
                entity: 'novedades',
                action: 'uploadFile',
                payload: JSON.stringify(uploadPayload),
            }),
        })
        upl.on('fileSuccess', () => {
            showToast('La imagen fue cargada correctamente.', 'success')
            getNovedades()
            onSuccess?.()
        })
        upl.on('fileError', (_, message) => {
            showToast(`No fue posible subir la imagen. ${message || ''}`.trim(), 'error')
            onError?.()
        })
        upl.on('fileAdded', (file) => {
            if (!file.file.type.startsWith('image')) {
                upl.removeFile(file)
                showToast('Solo se permiten imágenes (PNG o JPG).', 'error')
                onError?.()
                return
            }
            file.fileName = file.fileName.replace(/[^a-zA-Z0-9\s\-_,.!¡¿?]/g, '')
            upl.upload()
        })
        return upl
    }

    const subirImagen = (entrada) => {
        const upl = crearResumable(entrada)
        if (!upl.support) {
            showToast('Tu navegador no soporta la carga de archivos.', 'error')
            return
        }
        const f = document.createElement('input')
        f.setAttribute('type', 'file')
        upl.assignBrowse(f)
        f.click()
    }

    const subirImagenArchivo = (entrada, file) => {
        return new Promise((resolve) => {
            const upl = crearResumable(entrada, { onSuccess: () => resolve(true), onError: () => resolve(false) })
            if (!upl.support) {
                showToast('Tu navegador no soporta la carga de archivos.', 'error')
                resolve(false)
                return
            }
            upl.addFile(file)
        })
    }

    const borrarEntrada = async (entrada) => {
        const { ok } = await showModal('¿Confirma borrar esta entrada de la agenda? Esta acción no se puede deshacer.', 1)
        if (!ok) return
        const { ok: deleted } = await api.post({
            entity: 'novedades',
            action: 'delNovedad',
            payload: { codigo: entrada.codigo },
        })
        if (!deleted) return
        showToast('La entrada fue borrada.', 'success')
        getNovedades()
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
