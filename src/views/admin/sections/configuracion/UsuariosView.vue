<template>
  <div>
    <h3 class="h3cabecera">Usuarios del panel de administracion</h3>

    <div>
      <select class="form-select" v-model="selectedUserIndex" @change="listPermisos">
        <option disabled value="">Seleccione...</option>
        <option v-for="(item, k) in arrUsuarios" :key="item.codigo ?? k" :value="k">
          {{ item.nombre }}
        </option>
      </select>
    </div>

    <div v-if="datoUsuario && Object.keys(datoUsuario).length > 0">
      <div class="my-3">
        Nombre: {{ datoUsuario.nombre }}<br />
        Tipo: {{ datoUsuario.tipo }}<br />
      </div>

      <div id="permisos">
        <div class="my-3"><h4>Permisos del usuario</h4></div>
        <div class="mx-2">
          <div v-for="section in permissionSections" :key="section.title" class="mb-3">
            <div>{{ section.title }}</div>
            <div class="m-3">
              <label
                v-for="perm in section.items"
                :key="perm.id"
                :for="perm.id"
                class="d-block"
              >
                <input
                  :id="perm.id"
                  type="checkbox"
                  :checked="Boolean(permisos[perm.id])"
                  @change="onTogglePermission(perm.id, $event.target.checked)"
                />
                {{ perm.label }}
              </label>
            </div>
          </div>

          <div class="text-end">
            <input
              type="button"
              value="Guardar cambios"
              class="btn btn-primary"
              @click="saveConfig"
            />
            <input
              type="button"
              value="Borrar usuario"
              class="btn btn-danger ms-2"
              @click="delUser(datoUsuario.codigo)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue"
import { api } from "@/api/api"
import { showModal } from "@/services/uiBus"

const arrUsuarios = ref([])
const permisos = ref({})
const datoUsuario = ref({})
const selectedUserIndex = ref("")

const permissionSections = [
  {
    title: "Menu Estudiantes:",
    items: [
      { id: "estudiantes_all", label: "Todos los permisos" },
      { id: "estudiantes_buscar", label: "Buscar estudiantes" },
      { id: "estudiantes_nuevo", label: "Nuevo estudiantes" },
      { id: "estudiantes_solicitud_constancia", label: "Solicitudes de constancia" },
      { id: "estudiantes_documentacion", label: "Envio de documentacion" },
    ],
  },
  {
    title: "Menu Docentes:",
    items: [
      { id: "docentes_all", label: "Todos los permisos" },
      { id: "docentes_buscar", label: "Buscar docentes" },
      { id: "docentes_nuevo", label: "Nuevo docente" },
    ],
  },
  {
    title: "Panel Docente:",
    items: [{ id: "panel_docente_oyente_itinerante", label: "Inscribir oyentes/itinerantes" }],
  },
  {
    title: "Menu Cursos:",
    items: [
      { id: "cursos_all", label: "Todos los permisos" },
      { id: "cursos_grilla", label: "Ver/Editar grilla de Horarios" },
      { id: "cursos_vacantes_instrumento", label: "Carga de vacantes de Instrumento" },
      { id: "cursos_planillas_all", label: "Descarga de planillas (Asistencia, Cuatrimestrales)" },
      { id: "cursos_correlatividades", label: "Ver correlatividades de estudiantes" },
      { id: "cursos_matricula", label: "Matricula de estudiantes" },
      { id: "cursos_nombres", label: "Crear/Eliminar nombres de Curso" },
    ],
  },
  {
    title: "Menu Mesas de examen:",
    items: [
      { id: "mesas_all", label: "Todos los permisos" },
      { id: "mesas_ver_editar", label: "Ver/Editar Mesas de examen" },
      { id: "mesas_solicitud", label: "Ver/Editar solicitudes de mesa" },
    ],
  },
  {
    title: "Menu Calificaciones:",
    items: [
      { id: "calificaciones_all", label: "Todos los permisos" },
      { id: "calificaciones_cursadas", label: "Calificaciones de cursada" },
      { id: "calificaciones_mesas", label: "Calificaciones de mesas de examen" },
      { id: "calificaciones_libros", label: "Ver datos de libros de examen" },
    ],
  },
  {
    title: "Menu Reserva:",
    items: [{ id: "reservas_all", label: "Todos los permisos" }],
  },
  {
    title: "Menu Preinscripciones:",
    items: [
      { id: "preinscripciones_all", label: "Todos los permisos" },
      { id: "preinscripciones_ver", label: "Ver preinscripciones" },
      { id: "preinscripciones_documentacion", label: "Acreditacion de documentacion" },
    ],
  },
  {
    title: "Menu Configuracion:",
    items: [
      { id: "configuracion_all", label: "Todos los permisos" },
      { id: "configuracion_carreras", label: "Ver/Editar carreras y materias" },
      { id: "configuracion_instrumentos", label: "Ver/Editar lista de instrumentos" },
      { id: "configuracion_editar", label: "Configuracion de Estudiantes e Ingresantes" },
      { id: "configuracion_vacantes_ingresantes", label: "Vacantes para ingresantes" },
      { id: "configuracion_usuarios", label: "Usuarios y permisos administrativos" },
      { id: "configuracion_carrusel", label: "Carrusel de pagina Web" },
      { id: "configuracion_novedades", label: "Entradas de Blog" },
    ],
  },
  {
    title: "Menu Novedades:",
    items: [
      { id: "novedades_all", label: "Todos los permisos" },
      { id: "novedades_ausentes", label: "Ausentes y notificaciones" },
    ],
  },
]

const allPermissionIds = computed(() =>
  permissionSections.flatMap((section) => section.items.map((item) => item.id)),
)

const resetPermisos = () => {
  const next = {}
  for (const id of allPermissionIds.value) next[id] = false
  permisos.value = next
}

const copyInsertStatements = async (codigoUsuario) => {
  const sqlStatements = allPermissionIds.value.map(
    (id) =>
      `INSERT INTO permisos (codusuario, permiso, estado) VALUES (${codigoUsuario}, '${id}', 0);`,
  )
  if (navigator?.clipboard?.writeText) {
    await navigator.clipboard.writeText(sqlStatements.join("\n"))
  }
}

const listUsuarios = async () => {
  arrUsuarios.value = []
  datoUsuario.value = {}
  selectedUserIndex.value = ""
  resetPermisos()

  const { payload } = await api.get({
    entity: "usuarios",
    action: "getUsuarios",
  })

  arrUsuarios.value = payload ?? []
}

const listPermisos = async () => {
  const idx = Number(selectedUserIndex.value)
  const usuario = arrUsuarios.value[idx]
  if (!usuario) return

  resetPermisos()
  datoUsuario.value = usuario

  try {
    await copyInsertStatements(usuario.codigo)
  } catch (_) {
    // No bloquea el flujo si el navegador no permite acceso al portapapeles.
  }

  const { payload } = await api.get({
    entity: "usuarios",
    action: "getPermisosUsuario",
    payload: {
      codigo: usuario.codigo,
    },
  })

  for (const v of payload ?? []) {
    permisos.value[v.permiso] = v.estado === true || v.estado === 1 || v.estado === "1"
  }
}

const onTogglePermission = (id, checked) => {
  permisos.value[id] = checked
}

const saveConfig = async () => {
  if (!datoUsuario.value?.codigo) return
  const r = await api.post({
    entity: "usuarios",
    action: "savePermisosUsuario",
    payload: {
      codigo: datoUsuario.value.codigo,
      permisos: permisos.value,
    },
  })

  if (r.ok) {
    showModal("Datos actualizados")
  }
}

const delUser = async (codigo) => {
  const { ok } = await showModal("Desea borrar los datos de este usuario?", 1)
  if (!ok) return

  const r = await api.post({
    entity: "usuarios",
    action: "delUsuario",
    payload: { codigo },
  })

  if (r.ok) {
    showModal("Datos actualizados")
    await listUsuarios()
  }
}

onMounted(() => {
  listUsuarios()
})
</script>
