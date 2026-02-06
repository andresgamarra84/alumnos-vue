<template>
    <!-- CABECERA -->
      <h3 class="h3cabecera">Administración de Materias</h3>
    <!-- SELECT MATERIAS -->
    <div class="card p-3 shadow-sm mb-4">
      <MateriasSelect
        :materias="arrMaterias"
        :show-ciclo="true"
        :show-label="false"
        v-model="codMateriaSeleccionada"
        @change="getInfoMateria"
        />
    </div>
    <div class="text-end">
      <button class="btn btn-primary" @click="openNewMateriaModal">
        + Nueva materia
      </button>
    </div>
    <!-- FORMULARIO EDICIÓN -->
    <div v-if="materia" class="card p-4 shadow-sm">

      <h5 class="mb-3">Editar Materia</h5>

      <!-- Nombre -->
      <div class="mb-3">
        <label class="form-label">Nombre *</label>
        <input
          type="text"
          class="form-control"
          v-model="materia.nombre"
          required
        />
      </div>

      <!-- Nombre título -->
      <div class="mb-3">
        <label class="form-label">Nombre del título/analítico *</label>
        <input
          type="text"
          class="form-control"
          v-model="materia.nombretitulo"
          required
        />
      </div>

      <!-- Nombre corto -->
      <div class="mb-3">
        <label class="form-label">Nombre corto *</label>
        <input
          type="text"
          class="form-control"
          v-model="materia.nombrecorto"
          required
        />
      </div>

      <!-- Ciclo -->
      <div class="mb-3">
        <label class="form-label">Ciclo *</label>
        <select class="form-select" v-model="materia.codciclo" required>
          <option v-for="ciclo in ciclos" :key="ciclo.codigo" :value="ciclo.codigo">
            {{ ciclo.codigoasignado }}
          </option>
        </select>
      </div>

      <!-- Cantidad asociadas -->
      <div class="mb-3">
        <label class="form-label">Cantidad de materias asociadas *</label>
        <input
          type="number"
          min="1"
          class="form-control"
          v-model.number="materia.cantmatsasociadas"
          required
        />
      </div>

      <!-- Link programa -->
      <div class="mb-3">
        <label class="form-label">Link del programa (opcional)</label>
        <input
          type="text"
          class="form-control"
          v-model="materia.linkprograma"
          placeholder="https://..."
        />
      </div>

      <!-- BOTONES -->
      <div class="d-flex gap-2 mt-4">
        <button class="btn btn-primary" @click="updMateria">
          Guardar cambios
        </button>
          <button class="btn bg-danger" @click="delMateria">
            Eliminar materia
          </button>
        <button class="btn btn-secondary" @click="resetForm">
          Cancelar
        </button>
      </div>
    </div>

    <!-- SI NO HAY SELECCIÓN -->
    <div v-else class="text-muted text-center">
      Seleccioná una materia para editarla.
    </div>

    <!-- MODAL NUEVA MATERIA -->
    <div v-if="showNewModal" class="modal-backdrop-custom">
      <div class="modal-card">

        <h5 class="mb-3">Crear nueva materia</h5>

        <!-- Nombre -->
        <div class="mb-3">
          <label class="form-label">Nombre *</label>
          <input
            type="text"
            class="form-control"
            v-model="newMateria.nombre"
            required
          />
        </div>

        <!-- Nombre título -->
        <div class="mb-3">
          <label class="form-label">Nombre del título/analítico *</label>
          <input
            type="text"
            class="form-control"
            v-model="newMateria.nombretitulo"
            required
          />
        </div>

        <!-- Nombre corto -->
        <div class="mb-3">
          <label class="form-label">Nombre corto *</label>
          <input
            type="text"
            class="form-control"
            v-model="newMateria.nombrecorto"
            required
          />
        </div>

        <!-- Ciclo -->
        <div class="mb-3">
          <label class="form-label">Ciclo *</label>
          <select class="form-select" v-model="newMateria.codciclo" required>
            <option disabled value="">-- Seleccionar --</option>
            <option v-for="ciclo in ciclos" :key="ciclo.codigo" :value="ciclo.codigo">
              {{ ciclo.codigoasignado }}
            </option>
          </select>
        </div>

        <!-- Cantidad asociadas -->
        <div class="mb-3">
          <label class="form-label">Materias asociadas *</label>
          <input
            type="number"
            min="1"
            class="form-control"
            v-model.number="newMateria.cantmatsasociadas"
            required
          />
        </div>

        <!-- Link programa -->
        <div class="mb-3">
          <label class="form-label">Link del programa (opcional)</label>
          <input
            type="text"
            class="form-control"
            v-model="newMateria.linkprograma"
            placeholder="https://..."
          />
        </div>

        <!-- BOTONES -->
        <div class="d-flex justify-content-end gap-2 mt-4">
          <button class="btn btn-secondary" @click="closeNewMateriaModal">
            Cancelar
          </button>
          <button
            class="btn btn-primary"
            @click="createMateria"
            :disabled="!isNewMateriaValid"
          >
            Crear materia
          </button>
        </div>

      </div>
    </div>
</template>
<script setup>
import { ref, computed, onMounted } from "vue"
import { api } from "@/api/api"
import MateriasSelect from "@/components/MateriasSelect.vue"
import { showModal } from "@/services/uiBus";
const arrMaterias = ref([])
const selectedMateriaId = ref("")
const materia = ref(null)
const codMateriaSeleccionada = ref("")
const ciclos = ref([])
const showNewModal = ref(false)

const newMateria = ref({
  nombre: "",
  nombretitulo: "",
  nombrecorto: "",
  codciclo: "",
  cantmatsasociadas: 1,
  linkprograma: "",
})
onMounted(() => {
  getMaterias()
  getCiclos()
})
const getMaterias = async () => {
  const { payload } = await api.get({
    entity: "materias",
    action: "getMaterias",
  })
  arrMaterias.value = payload
}
const getCiclos = async () => {
  const { payload } = await api.get({
    entity: "data",
    action: "getCiclos",
  })
  ciclos.value = payload
}
/* VALIDACIÓN MODAL */
const isNewMateriaValid = computed(() => {
  return (
    newMateria.value.nombre.trim() &&
    newMateria.value.nombretitulo.trim() &&
    newMateria.value.nombrecorto.trim() &&
    newMateria.value.codciclo &&
    newMateria.value.cantmatsasociadas >= 1
  )
})

/* CARGAR MATERIA SELECCIONADA */
const getInfoMateria = async (codMateria) => {
    const { payload } = await api.get({
        entity: "materias",
        action: "getInfoMateria",
        payload: {
            codMateria
        }
    })
    materia.value = payload
}


/* GUARDAR CAMBIOS */
const updMateria = async () => {
  console.log("Guardando:", materia.value)
  const {ok} = await showModal("¿Confirma que desea guardar los cambios?", 1)
  if (!ok) return
  const r = await api.post({
    entity: "materias",
    action: "updMateria",
    payload: materia.value
  })
  // await api.post({ action:"updateMateria", payload: materia.value })
}
const delMateria = async () => {
  const {ok} = await showModal("¿Confirma que desea eliminar esta materia? Esta acción no se puede deshacer.", 1)
  if (!ok) return
  const r = await api.post({
    entity: "materias",
    action: "delMateria",
    payload: {
      codMateria: materia.value.codigo
    }
  })
  if (r.ok) {
    resetForm()
    getMaterias()
  }
} 
/* CANCELAR */
function resetForm() {
  materia.value = null
  selectedMateriaId.value = ""
}

/* MODAL NUEVA */
function openNewMateriaModal() {
  newMateria.value = {
    nombre: "",
    nombretitulo: "",
    nombrecorto: "",
    codciclo: "",
    cantmatsasociadas: 1,
    linkprograma: "",
  }
  showNewModal.value = true
}

function closeNewMateriaModal() {
  showNewModal.value = false
}

/* CREAR */
async function createMateria() {
  console.log("Creando materia:", newMateria.value)
  const {ok} = await showModal("¿Confirma que desea crear esta materia?", 1)
  if (!ok) return
  const r = await api.post({
    entity: "materias",
    action: "addMateria",
    payload: newMateria.value
  })
  closeNewMateriaModal()
}
</script>
<style>
.modal-backdrop-custom {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);

  display: flex;
  justify-content: center;
  align-items: center;

  z-index: 3000;
}

.modal-card {
  background: white;
  padding: 25px;
  border-radius: 15px;
  width: 520px;
  max-width: 95%;
}
</style>
