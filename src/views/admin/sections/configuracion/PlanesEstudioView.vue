<template>
    <h3 class="mb-4">Planes de Estudio y Correlativas</h3>

    <CarrerasSelect
      :carreras="carreras"
      :show-label="false"
      @change="getCarreraInfo"
      />
      <!-- LISTADO DE MATERIAS -->
     <div class="text-end" v-if="materiasCarrera.length > 0">
      <a @click="showNewMateria">+ Agregar materia a la carrera</a>
     </div>
    <div class="card mt-4" v-if="materiasCarrera.length > 0">
      <div class="card-header">
        <h5 class="mb-0">Materias de la carrera</h5>
        <div class="card-body">

          <div
            v-for="m in materiasCarrera"
            :key="m.codigo"
            class="row border rounded p-3 mb-3"
          >
            <!-- IZQUIERDA -->
            <div class="col-12 col-md-6">
              <!-- Orden + nombre -->
              <div class="fw-bold mb-2">
                <select
                  class="form-select d-inline-block w-auto me-2"
                  v-model.number="m.nroOrden"
                  @change="updateMateriaCarrera(m)"
                >
                  <option v-for="n in 50" :key="n" :value="n">
                    {{ n }}
                  </option>
                </select>
                {{ m.nombres.nombreTitulo }}
              </div>

              <!-- Programa -->
              <div class="small">
                <a
                  v-if="m.linkPrograma"
                  :href="m.linkPrograma"
                  target="_blank"
                  class="me-3"
                >
                  Ver programa
                </a>
                <a
                  v-if="m.linkPrograma"
                  href="#"
                  class="text-danger"
                  @click.prevent="delPrograma(m)"
                >
                  Borrar link
                </a>
                <a
                  v-else
                  href="#"
                  @click.prevent="addPrograma(m)"
                >
                  + Cargar link de programa
                </a>
              </div>
            </div>

            <!-- DERECHA -->
            <div class="col-12 col-md-6">
              <!-- Correlativas -->
              <b v-if="m.correlativas.length>0">Correlativas:</b>
              <div v-if="m.correlativas.length === 0" class="text-muted">
                <i>(Sin correlativas)</i>
              </div>
              <div
                v-else
                v-for="c in m.correlativas"
                :key="c.codigo"
                class="d-flex justify-content-between align-items-center border rounded px-2 py-1 mb-1"
              >
                <span>{{ c.nombre }}</span>
                <a
                  @click="delCorrelativa(m, c)"
                >
                  X
                </a>
              </div>
              <a
                href="#"
                class="d-block mt-2"
                @click.prevent="showMateriasParaCorrelativa(m)"
              >
                + Agregar correlativa
              </a>
            </div>

            <!-- ABAJO -->
            <div class="col-6 mt-3">
              <div>
                <label class="form-label small">Tipo de materia:</label>
                <select v-model="m.tipoMateriaDesc" class="form-select" @change="updateMateriaCarrera(m)">
                  <option value="normal">Normal</option>
                  <option value="instrumento">Instrumento</option>
                  <option value="instrumentoArmonico">Instrumento Armónico</option>
                  <option value="espacioInstitucional">Espacio Institucional</option>
                  <option value="espacioAlternativo">Espacio Inst. Alternativo</option>
                </select>
              </div>
              <div>
              <div v-if="['instrumento','instrumentoArmonico'].includes(m.tipoMateriaDesc)">
                <label>Cupo:</label>
                <select v-model="m.cupo" @change="updateMateriaCarrera(m)">
                  <option disabled>Seleccione el cupo (en min.)</option>
                  <option v-for="v in arrCupos" :value="v">{{ v }} minutos</option>
                </select>
              </div>
                <!-- Año editable -->
                <label class="form-label small">Año</label>
                <input
                  type="number"
                  min="1"
                  max="6"
                  class="form-control"
                  v-model.number="m.anioCarrera"
                  @change="updateMateriaCarrera(m)"
                />
              </div>
              <input type="checkbox" v-model="m.esConceptual" @change="updateMateriaCarrera(m)"> Es conceptual
              <input type="checkbox" v-model="m.esPromocional" @change="updateMateriaCarrera(m)"> Es promocional
            </div>
            <div class="col-6 mt-3 text-end">
              <button
                class="btn btn-sm bg-danger"
                @click="delMateriaCarrera(m)"
              >
                Quitar de la carrera
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL AGREGAR MATERIA -->
    <div v-if="showModalNuevaMateria" class="modal-backdrop-custom">

      <div class="modal-card">

        <h5 class="mb-3">
          Agregar materia a la carrera
        </h5>

        <!-- Selección de materia -->
        <div class="mb-3">
          <label class="form-label fw-bold">Materia</label>

          <select
            class="form-select"
            v-model="newMateria.codmateria"
          >
            <option disabled value="">
              Lista de materias de {{ materiasFiltered.ciclo }}
            </option>
            <option
              v-for="m in materiasFiltered.materias"
              :key="m.codigo"
              :value="m.codigo"
            >
              {{ m.nombre }}
            </option>
          </select>
        </div>

        <!-- Año -->
        <div class="mb-3">
          <label class="form-label fw-bold">Año de la carrera</label>

          <input
            type="number"
            min="1"
            max="6"
            class="form-control"
            v-model.number="newMateria.aniocarrera"
          />
        </div>

        <!-- Orden -->
        <div class="mb-3">
          <label class="form-label fw-bold">Número de orden</label>

          <input
            type="number"
            min="1"
            class="form-control"
            v-model.number="newMateria.nroorden"
          />
        </div>
        <div class="mb-3">
            <label>Tipo de materia:</label>
            <select v-model="newMateria.tipoMateriaDesc" class="form-select">
              <option value="normal">Normal</option>
              <option value="instrumento">Instrumento</option>
              <option value="instrumentoArmonico">Instrumento Armónico</option>
              <option value="espacioInstitucional">Espacio Institucional</option>
              <option value="espacioAlternativo">Espacio Inst. Alternativo</option>
            </select>
        </div>
        <div v-if="tieneCupo">
          <label>Cupo de la materia de Instrumento/Armónico:</label>
          <select v-model="cupo">
            <option disabled>Seleccione el cupo (en min.)</option>
            <option v-for="v in arrCupos" :value="v">{{ v }} minutos</option>
          </select>
        </div>
        <!-- Checkboxes -->
        <div class="mb-3">
          <div class="form-check">
            <input
              class="form-check-input"
              type="checkbox"
              v-model="newMateria.promocional"
              id="chkPromo"
            />
            <label class="form-check-label" for="chkPromo">
              Materia promocional
            </label>
          </div>

          <div class="form-check">
            <input
              class="form-check-input"
              type="checkbox"
              v-model="newMateria.esnotaconceptual"
              id="chkConceptual"
            />
            <label class="form-check-label" for="chkConceptual">
              Nota conceptual (Aprobado/No aprobado)
            </label>
          </div>

        </div>

        <!-- Botones -->
        <div class="d-flex justify-content-end gap-2 mt-4">

          <button
            class="btn btn-primary"
            @click="closeNewMateria"
          >
            Cancelar
          </button>

          <button
            class="btn"
            @click="addMateriaACarrera"
            :disabled="!newMateria.codmateria"
          >
            Agregar
          </button>

        </div>

      </div>
    </div>

</template>
<script setup>
import CarrerasSelect from '@/components/CarrerasSelect.vue';
import { ref, onMounted, computed } from 'vue';
import { api } from '@/api/api'
import { showModal } from '@/services/uiBus';
const carreras = ref([])
const materias = ref([])
const materiasFiltered = computed(() => {
    console.log(materias.value[carreras.value[selectedCarreraIndex.value].tipo])
    return materias.value[carreras.value[selectedCarreraIndex.value]?.tipo] || []
})
const newMateria = ref({
    cupo: 0,
    codmateria: '',
    aniocarrera: 1,
    nroorden: 1,
    tipoMateriaDesc: 'normal',
    promocional: false,
    esnotaconceptual: false
})
const arrCupos = [15,20,30,60]
const tieneCupo = ref(false)
const materiasCarrera = ref([])
const showModalNuevaMateria = ref(false)
const selectedMateriaParaAgregar = ref('')
const selectedCarreraIndex = ref(null)
onMounted(async() => {
    carreras.value = await getCarreras()
    materias.value = await getMaterias()
});

const getCarreras = async () => {
    const {payload} = await api.get({
        entity: "carreras",
        action: "getCarreras"
    })
    return payload
}
const getCarreraInfo = async (k) => {
    selectedCarreraIndex.value = k
    const codCarrera = carreras.value[k].codigo
    const {payload} = await api.get({
        entity: "materiascarreras",
        action: "getMateriasByCarreraId",
        payload: {
            codCarrera
        }
    })
    materiasCarrera.value = payload
}
const getMaterias = async () => {
    const {payload} = await api.get({
        entity: "materias",
        action: "getMateriasByCiclo",
    })
    return payload
}
const showNewMateria = () => {
    selectedMateriaParaAgregar.value = ''
    showModalNuevaMateria.value = true
}
const closeNewMateria = () => {
    showModalNuevaMateria.value = false
}
const addMateriaACarrera = async () => {
    const {ok} = await showModal("¿Confirma agregar esta materia a la carrera?",1)
    if (!ok) return
    const r = await api.post({
        entity: "materiascarreras",
        action: "addMateriaToCarrera",
        payload: {
          ...newMateria.value,
          codCarrera: carreras.value[selectedCarreraIndex.value].codigo,
        }
    })
    getCarreraInfo(selectedCarreraIndex.value)

}
const delMateriaCarrera = async (m) => {
    const {ok} = await showModal("¿Confirma que desea quitar esta materia de la carrera?",1)
    if (!ok) return
    const r = await api.post({
        entity: "materiascarreras",
        action: "delMateriaFromCarrera",
        payload: {
          codMC: m.codigo,
          codCarrera: carreras.value[selectedCarreraIndex.value].codigo,
        }
    })
    getCarreraInfo(selectedCarreraIndex.value)
}
const addPrograma = async (m) => {
    let input = await showModal("Ingrese el link al programa de la materia",2)
    if (!input.value) return
    const linkPrograma = input.value
    const {ok} = await api.post({
        entity: "materias",
        action: "updPrograma",
        payload: {
            action:"add",
            codMateria: m.codMateria,
            linkPrograma
        }
    })
    if (ok) {
        m.linkPrograma = linkPrograma
    }
}
const delPrograma = async (m) => {
    const {ok} = await showModal("¿Confirma que desea borrar el link del programa?",1)
    if (!ok) return
    await api.post({
        entity: "materias",
        action: "updPrograma",
        payload: {
            action: "delete",
            codMateria: m.codMateria
        }
    })
    m.linkPrograma = null
}
const addCorrelativa = async (m, c) => {
    await api.post({
        entity: "materias",
        action: "addCorrelativa",
        payload: {
            codMC: m.codigo,
            codCorrelativa: c.codigo
        }
    })
    m.correlativas.push(c)
}
const delCorrelativa = async (m, c) => {
    const {ok} = await showModal("¿Confirma que desea borrar esta correlativa?",1)
    if (!ok) return
    await api.post({
        entity: "materias",
        action: "delCorrelativa",
        payload: {
            codMC: m.codigo,
            codCorrelativa: c.codigo
        }
    })
    const index = m.correlativas.findIndex(x => x.codigo === c.codigo)
    if (index > -1) {
        m.correlativas.splice(index, 1)
    }
}
const updateMateriaCarrera = async (m) => {
    tieneCupo.value = ["instrumento", "instrumentoArmonico"].includes(m.tipoMateriaDesc)
    if (tieneCupo.value) m.cupo = tieneCupo.value ? m.cupo : 0
    await api.post({
        entity: "materiascarreras",
        action: "updMateriaCarrera",
        payload: m,
    })
}
</script>


