<template>
  <div class="row">
    <NuevoMensaje
      v-if="showMsgModal"
      :max-length="240"
      :show-fecha-hasta="true"
      @send-msg="newMsg"
      @close="closeMsgModal"
    />
    <div class="col-12">
      <div class="tabs-row">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          type="button"
          class="tab-btn"
          :class="{ 'tab-btn--active': filtroActivo === tab.key }"
          @click="filtroActivo = tab.key"
        >
          {{ tab.label }}
          <span class="tab-btn__count">{{ tab.count }}</span>
        </button>
      </div>

      <template v-if="filtroActivo === 'globales'">
        <div class="text-end mb-3">
          <button class="btn btn-primary" @click="showMsgModal = true">
            Nuevo mensaje global
          </button>
        </div>
        <div v-if="arrGlobales.length === 0" class="text-center"><i>- No hay mensajes globales enviados -</i></div>
        <div
          v-for="item in arrGlobales"
          :key="item.codHilo"
          class="row lista recuadro"
          style="padding:15px 10px; margin-bottom:15px;"
        >
          <div class="col-12 d-flex justify-content-between">
            <strong>{{ item.asunto }}</strong>
            <span class="text-muted small">{{ item.fechaIngreso }}</span>
          </div>
          <div class="col-12 mt-1">{{ item.mensaje }}</div>
        </div>
      </template>

      <template v-else>
        <HiloItem
          v-for="{ item, idx } in hilosFiltrados"
          :key="item.codHilo"
          :item="item"
          :showNombre="true"
          @open-panel="openPanel(item.codAlumno)"
          @click="getMsg(idx)"
        >
          <Conversacion
            v-if="item.mensajes.length>0"
            :arrMensajes="item.mensajes"
            :respuesta="respuesta"
            :show-archivar="true"
            :show-visto-indicator="true"
            @send-msg="sendMsg(idx)"
            @close-chat="closeChat(idx)"
            @close-thread="closeThread(idx)"
            @update:respuesta="updateRespuesta"
          />
        </HiloItem>
      </template>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { api } from '@/api/api'
import { showModal, showToast } from '@/services/uiBus'
import Conversacion from '@/views/shared/Conversacion.vue'
import HiloItem from '@/views/shared/HiloItem.vue'
import NuevoMensaje from '../shared/NuevoMensaje.vue'
import { useImpersonation } from "@/views/admin/composables/useImpersonation"
const { openUserPanel } = useImpersonation()

/* ---------- state ---------- */
const showMsgModal = ref(false)
const arrHilos = ref([])
const arrGlobales = ref([])
const respuesta = ref('')
const filtroActivo = ref('todos')

/* ---------- filtros ---------- */
const esActivo = (estado) => estado === 1 || estado === 2

const tabs = computed(() => [
  { key: 'todos', label: 'Todos', count: arrHilos.value.length },
  { key: 'nuevos', label: 'Nuevos', count: arrHilos.value.filter(h => h.estadoMensaje === 0).length },
  { key: 'activos', label: 'Conversaciones activas', count: arrHilos.value.filter(h => esActivo(h.estadoMensaje)).length },
  { key: 'archivados', label: 'Archivados', count: arrHilos.value.filter(h => h.estadoMensaje === 3).length },
  { key: 'globales', label: 'Mensajes globales', count: arrGlobales.value.length },
])

const hilosFiltrados = computed(() =>
  arrHilos.value
    .map((item, idx) => ({ item, idx }))
    .filter(({ item }) => {
      if (filtroActivo.value === 'nuevos') return item.estadoMensaje === 0
      if (filtroActivo.value === 'activos') return esActivo(item.estadoMensaje)
      if (filtroActivo.value === 'archivados') return item.estadoMensaje === 3
      return true
    })
)

/* ---------- methods ---------- */
const list = async () => {
  const {payload} = await api.get({
    entity: 'mensajes',
    action: 'getAllThreads'
  })
  arrHilos.value = payload ?? []
}
const openPanel = (codigo) =>  {
  openUserPanel({area: "estudiantes", codigo})
}
const getMsg = async (index) => {
  if (arrHilos.value[index].mensajes.length>0) return
  const item = arrHilos.value[index]
  const codHilo = item.codHilo
  const { payload } = await api.get({
    entity: 'mensajes',
    action: 'getMessageFromThread',
    payload: { codHilo }
  })
  item.mensajes = payload.map(v => ({
    mensaje: v.mensaje,
    fechaIngreso: v.fechaIngreso,
    clase : v.codTipo,
    visto: v.visto,
  })) ?? []
}
const closeChat = (k) => {
  arrHilos.value[k].mensajes = []
}

const closeThread = async (k) => {
  const codHilo = arrHilos.value[k].codHilo
  const r = await api.post({
    entity: 'mensajes',
    action: 'closeThread',
    payload: { codHilo }
  })
  if (r.ok) {
    arrHilos.value[k].estadoMensaje = 3
    closeChat(k)
  }
}

const closeMsgModal = () => {
  showMsgModal.value = false
}

const sendMsg = async (k) => {
  if (!respuesta.value) {
    showToast('El mensaje no puede estar vacío', 'error')
    return
  }
  const {ok} = await showModal(
    '¿Confirma que desea enviar este mensaje?',
    1
  )
  if (!ok) return
  const codHilo = arrHilos.value[k].codHilo
  const mensaje = respuesta.value
  const r = await api.post({
    entity: 'mensajes',
    action: 'addMessageToThread',
    payload: {
      codHilo,
      mensaje,
      codAlumno: arrHilos.value[k].codAlumno
    }
  })
  if (r.ok) {
    showToast('Mensaje enviado', 'success')
  }
  respuesta.value = ''
  closeChat(k)
  list()
}

const newMsg = async ({ asunto, mensaje, fechaHasta }) => {
  const { ok } = await showModal(
    '¿Confirma que desea crear este mensaje global?',
    1
  )
  if (!ok) return

  const r = await api.post({
    entity: 'mensajes',
    action: 'createGlobalMsg',
    payload: { asunto, mensaje, fechaHasta }
  })
  showMsgModal.value = false
  if (!r.ok) return
  showToast('Mensaje global creado', 'success')
  getGlobalMsgs()

  const { ok: enviarMail } = await showModal(
    '¿Desea enviar este mensaje por correo a todos los estudiantes?',
    1,
    'Notificar por email'
  )
  if (!enviarMail) return

  await api.post({
    entity: 'mensajes',
    action: 'queueGlobalMsgMail',
    payload: {
      codMensaje: r.payload.codMensaje,
      asunto: r.payload.asunto,
      mensaje: r.payload.mensaje
    }
  })
  showToast('El envío fue encolado, los correos se enviarán en breve.', 'success')
}

const getGlobalMsgs = async () => {
  const { payload } = await api.get({
    entity: 'mensajes',
    action: 'getGlobalMsgs'
  })
  arrGlobales.value = payload ?? []
}

const updateRespuesta = (str) => {
  respuesta.value = str
}

/* ---------- lifecycle ---------- */
onMounted(() => {
  list()
  getGlobalMsgs()
})
</script>

<style scoped>
.tabs-row {
  display: flex;
  gap: 8px;
  margin-bottom: 1rem;
  overflow-x: auto;
  padding-bottom: 4px;
}

.tab-btn {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  font-weight: 600;
  white-space: nowrap;
  color: var(--color-texto-principal);
  background: var(--color-fondo-secundario);
  border: 1px solid var(--color-borde);
  border-radius: 999px;
  cursor: pointer;
  transition: border-color 0.2s ease, background-color 0.2s ease, color 0.2s ease;
}

.tab-btn:hover {
  border-color: var(--color-acento);
}

.tab-btn--active {
  color: #fff;
  background: var(--color-acento);
  border-color: var(--color-acento);
}

.tab-btn__count {
  padding: 1px 8px;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-texto-principal);
  background: var(--color-fondo-principal);
  border-radius: 999px;
}

.tab-btn--active .tab-btn__count {
  color: #fff;
  background: rgba(255, 255, 255, 0.25);
}
</style>

