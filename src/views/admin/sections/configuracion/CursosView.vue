<template>
  <!-- CABECERA -->
  
  <h3>Administración de Cursos</h3>

  <button class="btn btn-primary" @click="openNewCursoModal">
    + Nuevo curso
  </button>

  <!-- SELECT CURSOS -->
  <div class="card p-3 shadow-sm mb-4">

    <CursosSelect
      :cursos="arrCursos"
      :show-label="false"
      @change="getInfoCurso"
    />
  </div>

  <!-- FORMULARIO EDICIÓN -->
  <div v-if="curso" class="card p-4 shadow-sm">

    <h5 class="mb-3">Editar Curso</h5>

    <!-- Nombre -->
    <div class="mb-3">
      <label class="form-label">Nombre *</label>
      <input
        type="text"
        class="form-control"
        v-model="curso.nombre"
        required
      />
    </div>

    <!-- Nombre corto -->
    <div class="mb-3">
      <label class="form-label">Nombre corto *</label>
      <input
        type="text"
        class="form-control"
        v-model="curso.nombrecorto"
        required
      />
    </div>

    <!-- BOTONES -->
    <div class="d-flex gap-2 mt-4">

      <button class="btn btn-success" @click="saveCurso">
        Guardar cambios
      </button>

      <button class="btn btn-danger" @click="deleteCurso">
        Eliminar curso
      </button>

      <button class="btn btn-secondary" @click="cancelEdit">
        Cancelar
      </button>

    </div>
  </div>

  <!-- SI NO HAY SELECCIÓN -->
  <div v-else class="text-muted text-center">
    Seleccioná un curso para editarlo.
  </div>

  <!-- MODAL NUEVO CURSO -->
  <div v-if="showNewModal" class="modal-backdrop-custom">
    <div class="modal-card">

      <h5 class="mb-3">Crear nuevo curso</h5>

      <!-- Nombre -->
      <div class="mb-3">
        <label class="form-label">Nombre *</label>
        <input
          type="text"
          class="form-control"
          v-model="newCurso.nombre"
          required
        />
      </div>

      <!-- Nombre corto -->
      <div class="mb-3">
        <label class="form-label">Nombre corto *</label>
        <input
          type="text"
          class="form-control"
          v-model="newCurso.nombrecorto"
          required
        />
      </div>

      <!-- BOTONES -->
      <div class="d-flex justify-content-end gap-2 mt-4">

        <button class="btn btn-secondary" @click="closeNewCursoModal">
          Cancelar
        </button>

        <button
          class="btn btn-primary"
          @click="createCurso"
          :disabled="!isNewCursoValid"
        >
          Crear curso
        </button>

      </div>

    </div>
  </div>
</template>
<script setup>
import CursosSelect from "@/components/CursosSelect.vue"
import { ref, computed, onMounted } from "vue"
import { api } from "@/api/api"
import { showModal } from "@/services/uiBus";

/* LISTA */
const arrCursos = ref([])
onMounted(async () => {
  getCursos()
})
const getCursos = async () => {
    const { payload } = await api.get({
        entity: "cursos",
        action: "getCursos",
    })
    arrCursos.value = payload
}
/* SELECCIÓN */
const curso = ref(null)
const getInfoCurso = async (codCurso) => {
    const { payload } = await api.get({
        entity: "cursos",
        action: "getInfoCurso",
        payload: {
          codCurso
        }
    })
    curso.value = payload
}
/* MODAL NUEVO */
const showNewModal = ref(false)

const newCurso = ref({
  nombre: "",
  nombrecorto: "",
})

/* VALIDACIÓN */
const isNewCursoValid = computed(() => {
  return (
    newCurso.value.nombre.trim() &&
    newCurso.value.nombrecorto.trim()
  )
})


/* GUARDAR */
async function saveCurso() {
  console.log("Guardar curso:", curso.value)

  const r = await api.post({
     entity: "cursos",
     action: "updCurso",
     payload: curso.value
  })
  getCursos()
}

/* ELIMINAR */
async function deleteCurso() {
  if (!confirm("¿Seguro que querés eliminar este curso?")) return

  console.log("Eliminar curso:", curso.value.codigo)

  await api.post({
    entity: "cursos",
    action: "delCurso",
    payload: { codCurso: curso.value.codigo }
  })
  getCursos()
  cancelEdit()
}

/* CANCELAR */
function cancelEdit() {
  curso.value = null
  selectedCursoId.value = ""
}

/* MODAL */
function openNewCursoModal() {
  newCurso.value = {
    nombre: "",
    nombrecorto: "",
  }
  showNewModal.value = true
}

function closeNewCursoModal() {
  showNewModal.value = false
}

/* CREAR */
async function createCurso() {
  console.log("Crear curso:", newCurso.value)

  await api.post({
     entity: "cursos",
     action: "addCurso",
     payload: newCurso.value
  })
  showNewModal.value = false
  getCursos()
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
  width: 450px;
  max-width: 95%;
}
</style>
