<template>
    <h3 class="h3cabecera">Carrusel de la landing</h3>
    <div class="text-end mb-4">
        <button class="btn btn-primary" @click="nuevoItem">Agregar imagen</button>
    </div>
    <div v-if="items.length === 0" class="text-center"><i>- No hay imágenes cargadas -</i></div>

    <div v-for="item in items" :key="item.codigo" class="row lista recuadro align-items-start" style="padding:15px 10px; margin-bottom:15px;">
        <div class="col-md-5 text-center mb-3 mb-md-0">
            <img v-if="item.img_path" :src="imgUrl(item)" alt="" class="img-fluid" :style="{ opacity: item.oculto ? 0.3 : 1 }" />
            <span v-else class="text-muted"><i>- Sin imagen -</i></span>
            <div class="mt-2">
                <span class="badge" :class="estado(item).clase">{{ estado(item).texto }}</span>
            </div>
        </div>
        <div class="col-md-7">
            <div class="row g-2">
                <div class="col-12">
                    <label class="form-label mb-0">Descripción</label>
                    <input type="text" class="form-control form-control-sm" v-model="item.descripcion" @change="guardar(item)">
                </div>
                <div class="col-12">
                    <label class="form-label mb-0">Link</label>
                    <input type="text" class="form-control form-control-sm" v-model="item.link" @change="guardar(item)" placeholder="https://...">
                </div>
                <div class="col-6">
                    <label class="form-label mb-0">Desde</label>
                    <input type="date" class="form-control form-control-sm" v-model="item.fecha_inicio" @change="guardar(item)">
                </div>
                <div class="col-6">
                    <label class="form-label mb-0">Hasta</label>
                    <input type="date" class="form-control form-control-sm" v-model="item.fecha_fin" @change="guardar(item)">
                </div>
                <div class="col-6">
                    <label class="form-label mb-0">Mostrar durante (segundos)</label>
                    <input type="number" min="1" max="9" class="form-control form-control-sm" v-model.number="item.duracion" @change="guardar(item)">
                </div>
                <div class="col-6">
                    <label class="form-label mb-0">N° de orden</label>
                    <input type="number" min="0" class="form-control form-control-sm" v-model.number="item.orden" @change="guardar(item)">
                </div>
                <div class="col-6">
                    <label class="form-check-label">
                        <input type="checkbox" class="form-check-input" v-model="item.indefinido" @change="guardar(item)">
                        Mostrar indefinidamente
                    </label>
                </div>
                <div class="col-6">
                    <label class="form-check-label">
                        <input type="checkbox" class="form-check-input" v-model="item.oculto" @change="guardar(item)">
                        Mantener oculto
                    </label>
                </div>
                <div class="col-12 text-end">
                    <button class="btn btn-sm btn-secondary me-2" @click="cambiarImagen(item)">Cambiar imagen</button>
                    <button class="btn btn-sm btn-danger" @click="borrarItem(item)">Borrar del carrusel</button>
                </div>
            </div>
        </div>
    </div>

    <!-- MODAL NUEVO ITEM -->
    <div v-if="showForm" class="modal-overlay" @click.self="cerrarForm">
        <div class="modal-box">
            <h4 class="text-center mb-3">Nueva imagen del carrusel</h4>

            <label class="form-label">Imagen</label>
            <input type="file" accept="image/*" class="form-control mb-2" @change="onImagenSeleccionada">
            <div v-if="imagenPreview" class="text-center mb-3">
                <img :src="imagenPreview" alt="Vista previa" style="max-width:100%; max-height:160px; object-fit:contain;" />
            </div>

            <label class="form-label">Link</label>
            <input type="text" class="form-control mb-3" v-model="form.link" placeholder="https://...">

            <label class="form-label">Descripción</label>
            <input type="text" class="form-control mb-3" v-model="form.descripcion">

            <div class="row">
                <div class="col-6">
                    <label class="form-label">Fecha de inicio</label>
                    <input type="date" class="form-control mb-3" v-model="form.fecha_inicio">
                </div>
                <div class="col-6">
                    <label class="form-label">Fecha de fin</label>
                    <input type="date" class="form-control mb-3" v-model="form.fecha_fin">
                </div>
            </div>

            <div class="row align-items-end">
                <div class="col-6 mb-3">
                    <label class="form-label">Duración (segundos)</label>
                    <select class="form-select" v-model.number="form.duracion">
                        <option v-for="n in [1, 2, 3, 4, 5, 6, 7, 8, 9]" :key="n" :value="n">{{ n }}</option>
                    </select>
                </div>
                <div class="col-6 mb-3">
                    <label class="form-check-label d-block">
                        <input type="checkbox" class="form-check-input" v-model="form.indefinido"> Indefinido
                    </label>
                    <label class="form-check-label d-block">
                        <input type="checkbox" class="form-check-input" v-model="form.oculto"> Oculto
                    </label>
                </div>
            </div>

            <div class="text-center">
                <button class="btn btn-primary me-2" :disabled="guardando" @click="guardarNuevo">Agregar</button>
                <button class="btn btn-secondary" @click="cerrarForm">Cancelar</button>
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

    const items = ref([])
    const showForm = ref(false)
    const guardando = ref(false)
    const imagenFile = ref(null)
    const imagenPreview = ref('')

    const formVacio = () => ({
        link: '',
        descripcion: '',
        fecha_inicio: '',
        fecha_fin: '',
        indefinido: false,
        oculto: false,
        duracion: 3,
    })
    const form = ref(formVacio())

    onMounted(() => {
        getItems()
    })

    const getItems = async () => {
        const { ok, payload } = await api.get({
            entity: 'carrusel',
            action: 'getItemsCarrusel',
        })
        if (!ok) return
        items.value = payload.map(i => ({
            ...i,
            indefinido: i.indefinido == 1,
            oculto: i.oculto == 1,
            duracion: Number(i.duracion),
            orden: Number(i.orden),
        }))
    }

    const imgUrl = (i) => `https://cjjc.edu.ar/uploads/carrusel/${i.img_path}`

    // Mismo criterio que usa el backend para mostrar o no la imagen en la landing
    const estado = (i) => {
        if (i.oculto) return { texto: 'Oculto', clase: 'bg-secondary' }
        if (i.indefinido) return { texto: 'Visible', clase: 'bg-success' }
        const hoy = new Date().toLocaleDateString('en-CA')
        if (!i.fecha_inicio || !i.fecha_fin) return { texto: 'Sin vigencia definida', clase: 'bg-warning text-dark' }
        if (hoy < i.fecha_inicio) return { texto: 'Programado', clase: 'bg-info text-dark' }
        if (hoy > i.fecha_fin) return { texto: 'Vencido', clase: 'bg-danger' }
        return { texto: 'Visible', clase: 'bg-success' }
    }

    const payloadItem = (i) => ({
        link: i.link?.trim() || null,
        descripcion: i.descripcion?.trim() || null,
        fecha_inicio: i.fecha_inicio || null,
        fecha_fin: i.fecha_fin || null,
        indefinido: i.indefinido ? 1 : 0,
        oculto: i.oculto ? 1 : 0,
        duracion: i.duracion || 3,
    })

    const guardar = async (item) => {
        const { ok } = await api.post({
            entity: 'carrusel',
            action: 'updItemCarrusel',
            payload: { codigo: item.codigo, orden: item.orden || 0, ...payloadItem(item) },
        })
        if (!ok) {
            await getItems() // vuelve al estado guardado si el servidor rechazó el cambio
            return
        }
        showToast('Cambios guardados.', 'success')
    }

    const limpiarImagenSeleccionada = () => {
        if (imagenPreview.value) URL.revokeObjectURL(imagenPreview.value)
        imagenFile.value = null
        imagenPreview.value = ''
    }

    const nuevoItem = () => {
        form.value = formVacio()
        limpiarImagenSeleccionada()
        showForm.value = true
    }

    const cerrarForm = () => {
        showForm.value = false
        limpiarImagenSeleccionada()
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

    const guardarNuevo = async () => {
        if (!imagenFile.value) {
            showToast('Seleccione una imagen.', 'error')
            return
        }
        guardando.value = true
        try {
            const { ok, payload: codigo } = await api.post({
                entity: 'carrusel',
                action: 'addItemCarrusel',
                payload: payloadItem(form.value),
            })
            if (!ok) return
            const archivo = imagenFile.value
            const subida = await subirImagenArchivo(codigo, archivo)
            if (!subida) {
                // Sin imagen el ítem no sirve: se descarta para no dejar basura
                await api.post({ entity: 'carrusel', action: 'delItemCarrusel', payload: { codigo } })
            } else {
                showToast('La imagen fue agregada al carrusel.', 'success')
            }
            cerrarForm()
            await getItems()
        } finally {
            guardando.value = false
        }
    }

    const nombreArchivo = (file) => `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9\-_.]/g, '')}`

    const crearResumable = (codigo, { onSuccess, onError } = {}) => {
        const upl = new Resumable({
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem(SESSION_NAME)}`
            },
            target: 'https://cjjc.edu.ar/api-v2/',
            testChunks: false,
            query: (file) => ({
                entity: 'carrusel',
                action: 'uploadFile',
                payload: JSON.stringify({
                    typeFile: 'carrusel',
                    codCarrusel: codigo,
                    customFileName: file.customName,
                }),
            }),
        })
        upl.on('fileSuccess', () => onSuccess?.())
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
            file.customName = nombreArchivo(file.file)
            upl.upload()
        })
        return upl
    }

    const cambiarImagen = (item) => {
        const upl = crearResumable(item.codigo, {
            onSuccess: () => {
                showToast('La imagen fue cargada correctamente.', 'success')
                getItems()
            },
        })
        if (!upl.support) {
            showToast('Tu navegador no soporta la carga de archivos.', 'error')
            return
        }
        const f = document.createElement('input')
        f.setAttribute('type', 'file')
        upl.assignBrowse(f)
        f.click()
    }

    const subirImagenArchivo = (codigo, file) => {
        return new Promise((resolve) => {
            const upl = crearResumable(codigo, { onSuccess: () => resolve(true), onError: () => resolve(false) })
            if (!upl.support) {
                showToast('Tu navegador no soporta la carga de archivos.', 'error')
                resolve(false)
                return
            }
            upl.addFile(file)
        })
    }

    const borrarItem = async (item) => {
        const { ok } = await showModal('¿Confirma borrar esta imagen del carrusel? Esta acción no se puede deshacer.', 1)
        if (!ok) return
        const { ok: deleted } = await api.post({
            entity: 'carrusel',
            action: 'delItemCarrusel',
            payload: { codigo: item.codigo },
        })
        if (!deleted) return
        showToast('La imagen fue borrada.', 'success')
        getItems()
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
        max-width: 480px;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }
</style>
