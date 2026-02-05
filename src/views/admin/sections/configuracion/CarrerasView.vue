<template>
    <h3 class="h3cabecera">Configuración de Carreras</h3>
    <CarrerasSelect
    :carreras="carreras"
    :show-label="false"
    @change="getCarreraInfo"
    />
    <div class="text-end">
        <button class="btn btn-primary" @click="nuevaCarrera">
            Nueva carrera
        </button>
    </div>
    <div class="mt-4" v-if="carrera.codigo !== null">

        <h3 >Editar Carrera</h3>

        <!-- Código (solo lectura) -->
        <div class="mb-3">
        <label class="form-label">Código</label>
        <input
            type="text"
            class="form-control"
            v-model="carrera.codigo"
            disabled
        />
        </div>

        <!-- Nombre -->
        <div class="mb-3">
        <label class="form-label">Nombre</label>
        <input
            type="text"
            class="form-control"
            v-model="carrera.nombre"
        />
        </div>

        <!-- Nombre corto -->
        <div class="mb-3">
        <label class="form-label">Nombre corto</label>
        <input
            type="text"
            class="form-control"
            v-model="carrera.nombrecorto"
        />
        </div>

        <!-- Nombre del plan -->
        <div class="mb-3">
        <label class="form-label">Resolución del plan</label>
        <textarea
            class="form-control"
            rows="3"
            v-model="carrera.nombreplan"
        ></textarea>
        </div>

        <!-- Nombre del título -->
        <div class="mb-3">
        <label class="form-label">Nombre del título</label>
        <input
            type="text"
            class="form-control"
            v-model="carrera.nombretitulo"
        />
        </div>

        <hr class="my-4" />

        <!-- Checkboxes -->
        <h5 class="mb-3">Características</h5>

        <!-- De pregrado -->
        <div class="form-check mb-2">
        <select
            class="form-select mb-2"
            v-model="carrera.tipo"
        >
            <option value="pregrado">Pregrado</option>
            <option value="grado">Grado</option>
            <option value="extension">Extensión</option>
            <option value="postitulo">Postítulo</option>
        </select>
        </div>

        <!-- Para docencia -->
        <div class="form-check mb-2">
        <input
            class="form-check-input"
            type="checkbox"
            v-model="carrera.paradocencia"
            true-value="S"
            false-value="N"
            id="chkDocencia"
        />
        <label class="form-check-label" for="chkDocencia">
            Habilita para docencia
        </label>
        </div>

        <!-- Requiere título secundario -->
        <div class="form-check mb-4">
        <input
            class="form-check-input"
            type="checkbox"
            v-model="carrera.requieretitulosecundario"
            true-value="S"
            false-value="N"
            id="chkSecundario"
        />
        <label class="form-check-label" for="chkSecundario">
            Requiere título secundario
        </label>
        </div>

        <!-- Botones -->
        <div class="d-flex gap-2 justify-content-end">
          <button class="btn btn-primary" @click="closeMenu">
            Cancelar
          </button>
          <button class="btn btn-danger bg-danger" @click="borrarCarrera">
            Borrar carrera
          </button>
          <button class="btn btn-secondary" @click="updCarrera">
            Guardar
          </button>
        </div>

    </div>
</template>
<script setup>
import CarrerasSelect from '@/components/CarrerasSelect.vue';
import { ref, onMounted } from 'vue';
import { api } from '@/api/api'
import { showModal } from '@/services/uiBus';
const carreras = ref([])
const carrera = ref({
  codigo: null,
  nombre: "",
  nombreplan: "",
  nombrecorto: "",
  tipo: "0",
  nombretitulo: "",
  paradocencia: "N",
  requieretitulosecundario: "N",
})

onMounted(async() => {
    getCarreras()
});

const getCarreras = async () => {
    const {payload} = await api.get({
        entity: "carreras",
        action: "getCarreras"
    })
    carreras.value = payload
}

const getCarreraInfo = async(k) => {
    const {payload} = await api.get({
        entity: "carreras",
        action: "getCarreraInfo",
        payload: {
            codCarrera: carreras.value[k].codigo
        }
    })
    carrera.value = payload
}

const nuevaCarrera = async ()=> {
    let input = await showModal("Ingrese un nombre para la nueva carrera",2)
    const nombreCarrera = input.value
    const {ok} = await showModal("¿Confirma la creación de la nueva carrera?",1)
    if (!ok) return
    const {payload} = await api.post({
        entity: "carreras",
        action: "addCarrera",
        payload: {
            nombre: nombreCarrera,
            nombreCorto: "",
            nombrePlan:"",
            nombreTitulo: "",
            tipo: "",
            paraDocencia: "N",
            requiereTitulo: "N",
        }
    })
    getCarreras()
}
const updCarrera = async () => {
    const {ok} = await showModal("¿Confirma guardar los cambios en la carrera?",1)
    if (!ok) return
    const {payload} = await api.post({
        entity: "carreras",
        action: "updCarrera",
        payload: {
            codCarrera: carrera.value.codigo,
            nombre: carrera.value.nombre,
            nombreCorto: carrera.value.nombrecorto,
            nombrePlan:carrera.value.nombreplan,
            nombreTitulo: carrera.value.nombretitulo,
            tipo: carrera.value.tipo,
            paraDocencia: carrera.value.paradocencia,
            requiereTitulo: carrera.value.requieretitulosecundario,
        }
    })
}

const borrarCarrera = async () => {
  const {ok} = await showModal("¿Confirma borrar la carrera seleccionada? Esta acción no se puede deshacer.",1)
  if (!ok) return
  const {payload} = await api.post({
      entity: "carreras",
      action: "delCarrera",
      payload: {
          codCarrera: carrera.value.codigo,
      }
  })
  closeMenu()
  getCarreras()
}
const closeMenu = () => {
  carrera.value = null
}
</script>