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

    const nuevaEntrada = () => {
        nuevoTitulo.value = ''
        nuevaDescripcion.value = ''
        showForm.value = true
    }

    const cerrarForm = () => {
        showForm.value = false
    }

    const guardarEntrada = async () => {
        const titulo = nuevoTitulo.value?.trim()
        const descripcion = nuevaDescripcion.value?.trim()
        if (!titulo || !descripcion) {
            showToast('El título y la descripción son obligatorios', 'error')
            return
        }
        const { ok, payload: codigo } = await api.post({
            entity: 'novedades',
            action: 'addNovedad',
            payload: { titulo, descripcion },
        })
        if (!ok) return
        showForm.value = false
        await getNovedades()
        showToast('La entrada fue creada. Puede cargar una imagen para acompañarla.', 'success')
        const creada = entradas.value.find(item => item.codigo == codigo)
        if (creada) subirImagen(creada)
    }

    const subirImagen = (entrada) => {
        const f = document.createElement('input')
        f.setAttribute('type', 'file')
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
        if (!upl.support) {
            showToast('Tu navegador no soporta la carga de archivos.', 'error')
            return
        }
        upl.assignBrowse(f)
        upl.on('fileSuccess', () => {
            showToast('La imagen fue cargada correctamente.', 'success')
            getNovedades()
        })
        upl.on('fileError', (_, message) => {
            showToast(`No fue posible subir la imagen. ${message || ''}`.trim(), 'error')
        })
        upl.on('fileAdded', (file) => {
            if (!file.file.type.startsWith('image')) {
                upl.removeFile(file)
                showToast('Solo se permiten imágenes (PNG o JPG).', 'error')
                return
            }
            file.fileName = file.fileName.replace(/[^a-zA-Z0-9\s\-_,.!¡¿?]/g, '')
            upl.upload()
        })
        f.click()
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
