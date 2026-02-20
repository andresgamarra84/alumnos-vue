<template>
  <div class="row">
    <h3>Carga de vacantes de Instrumento / Instrumento Armónico</h3>

    <div class="d-flex justify-content-around">
      <label>
        <input type="radio" v-model="tipoMateria" value="instrumento" />
        Instrumento
      </label>

      <label>
        <input type="radio" v-model="tipoMateria" value="armonico" />
        Instrumento Armónico
      </label>
    </div>

    <!-- Docente -->
    <div class="col-12 d-md-inline-flex gap-md-3">
      <div class="col">
        <label>Docente:</label>
        <select v-model="selectedProf" @change="getCursos">
          <option disabled value="">Seleccione...</option>
          <option
            v-for="prof in arrProfesores"
            :key="prof.codprofesor"
            :value="prof.codprofesor"
          >
            {{ prof.nombre }}
          </option>
        </select>
      </div>

      <!-- Curso -->
      <div>
        <label>Curso:</label>
        <select v-model="selectedCursoIndex" @change="setCurso">
          <option disabled value="">Seleccione un horario</option>
          <option
            v-for="(curso, index) in arrCursos"
            :key="curso.codigo"
            :value="index"
          >
            {{ curso.nombreCurso }}: {{ curso.horarios[0].dia }} -
            {{ curso.horarios[0].desde }} a {{ curso.horarios[0].hasta }}
          </option>
        </select>
      </div>
    </div>

    <!-- Desde / Hasta -->
    <div class="col-12 d-md-inline-flex gap-md-3">
      <div class="col">
        <label>Desde:</label>
        <select v-model="desde">
          <option v-for="(h, i) in arrHoras" :key="i" :value="i">
            {{ h }}
          </option>
        </select>
      </div>

      <div class="col">
        <label>Hasta:</label>
        <select v-model="hasta">
          <option v-for="(h, i) in arrHoras" :key="i" :value="i">
            {{ h }}
          </option>
        </select>
      </div>
    </div>

    <!-- Cupo / Destino -->
    <div class="col-12 d-md-inline-flex gap-md-3">
      <div class="col">
        <label>Cupo:</label>
        <select v-model="cupo">
          <option
            v-if="tipoMateria === 'instrumento'"
            v-for="n in 4"
            :key="n"
            :value="n * 3"
          >
            {{ n * 15 }} minutos
          </option>

          <option
            v-if="tipoMateria === 'instrumentoArmonico'"
            v-for="n in 3"
            :key="n"
            :value="n * 4"
          >
            {{ n }} alumnos
          </option>
        </select>
      </div>

      <div class="col">
        <label>Destino:</label>
        <select v-model="destino">
          <option value="0">Todos</option>
          <option value="1">FOBA Adultos</option>
          <option value="2">FOBA Niños</option>
          <option value="3">Superior</option>
          <option value="4">Ingresantes</option>
        </select>
      </div>
    </div>

    <div class="col-12 text-end">
      <button class="btn btn-primary" @click="addHorario">
        Agregar
      </button>
    </div>
  </div>

  <!-- LISTADO -->
  <div class="row mt-4">
    <h3>Listado de vacantes publicadas del docente</h3>

    <div v-if="!selectedProf" class="infoitalica">
      Seleccione un docente del listado para ver las vacantes publicadas
    </div>

    <div v-else-if="arrHorarios.length === 0" class="infoitalica">
      El docente aún no tiene vacantes publicadas
    </div>

    <div
      v-for="(horarioDocente, key) in arrHorarios"
      :key="key"
      class="row recuadro-borde"
    >
      <div
        v-for="(inst, k) in horarioDocente.instrumentos"
        :key="k"
        class="col-12"
      >
        <div class="col-12 fw-bold">{{ inst.nombre }}</div>

        <div v-for="(franja, clave) in inst.franja" :key="clave">
          <div v-for="(bloque, j) in franja[2]" :key="j" class="row lista">

            <div class="col-2">{{ franja[0] }}</div>
            <div class="col-3">
              {{ bloque.franja[0] }} a {{ bloque.franja[1] }}
            </div>
            <div class="col-2">{{ franja[1] }}</div>

            <div class="col-3">
              <select @change="updHorario(key, k, clave, j, $event)">
                <option
                  v-for="(span, idx) in arrSpans"
                  :key="idx"
                  :value="idx"
                  :selected="span[0] === bloque.cupo[0]"
                >
                  {{ span[1] }} minutos
                </option>
              </select>
            </div>

            <div class="col-2">
              <a
                v-if="bloque.inscriptos.length === 0"
                href="#"
                @click.prevent="delHorario(key, k, clave, j)"
              >
                Borrar
              </a>

              <span
                v-else
                @click="showNames(key, k, clave, j)"
                style="cursor:pointer"
              >
                {{ bloque.inscriptos[1] }} inscripto/s
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, watch, onMounted } from "vue"
import { api } from "@/api/api"
import { showModal } from "@/services/uiBus"

/* ===============================
   STATE
================================= */

const tipoMateria = ref(2)

const selectedProf = ref("")
const selectedCursoIndex = ref("")

const codPlHorarios = ref(0)

const arrProfesores = ref([])
const arrCursos = ref([])
const arrHorarios = ref([])

const arrHoras = ref([])
const arrSpans = ref([])

const desde = ref(0)
const hasta = ref(0)

const cupo = ref("")
const destino = ref("0")

/* ===============================
   HELPERS
================================= */

const getHoras = (fromTo) => {
  arrHoras.value = []

  const inicio = fromTo[0]
  const bloques = fromTo[1]

  let i = inicio
  while (i <= inicio + bloques) {
    const segundos = i * 1800 + 8 * 3600

    const h = Math.floor(segundos / 3600)
    const m = Math.floor(((segundos / 3600) - h) * 60)

    arrHoras.value.push(`${h}:${m < 10 ? "0" + m : m}`)
    i += 1
  }
}

/* ===============================
   API CALLS
================================= */

const getProfesores = async () => {
  const r = await api.get({
    entity: "planillahorarios",
    action: "getProfesoresByTipoMateria",
    payload: {
      tipoMateria: tipoMateria.value,
    },
  })
  arrProfesores.value = r.payload
}

const getCursos = async () => {
  arrCursos.value = []
  arrHorarios.value = []

  arrSpans.value =
    tipoMateria.value === "instrumento"
      ? [[1, 15], [2, 30], [3, 45], [4, 60]]
      : [[1, 20], [2, 40], [3, 60]]

  const r = await api.get({
    entity: "planillahorarios",
    action: "getCursosByTipoMateria",
    payload: {
      tipoMateria: tipoMateria.value,
      codProfesor: selectedProf.value,
    },
  })

  arrCursos.value = r.payload
}

const setCurso = () => {
  const curso = arrCursos.value[selectedCursoIndex.value]

  codPlHorarios.value = curso.codigo
  getHoras(curso.fromTo)
}

/* ===============================
   CRUD HORARIOS
================================= */

const addHorario = async () => {
  const curso = arrCursos.value[selectedCursoIndex.value]

  const inicio = curso.fromTo[0] * 2

  const posicion = {
    l: desde.value * 2 + inicio,
    w: hasta.value * 2 + inicio,
  }

  const r = await api.post({
    entity: "",
    action: "",
    payload: {
      codPlHorarios: codPlHorarios.value,
      posicion,
      cupo: cupo.value,
      destino: destino.value,
    },
  })

  if (r.ok) showModal("Datos actualizados", 0)
}

const updHorario = async (key, k, clave, j, ev) => {
  const idx = ev.target.value
  const span = arrSpans.value[idx]

  const codigo =
    arrHorarios.value[key].instrumentos[k].franja[clave][2][j].codigo

  const r = await api.post({
    entity: "",
    action: "",
    payload: {
      nuevoCupo: span[0],
      codigo,
    },
  })

  if (r.ok) {
    arrHorarios.value[key].instrumentos[k].franja[clave][2][j].cupo = span
  }
}

const delHorario = async (key, k, clave, j) => {
  const confirm = await showModal("¿Confirma que desea borrar este horario?", 1)
  if (!confirm) return

  const codigo =
    arrHorarios.value[key].instrumentos[k].franja[clave][2][j].codigo

  const r = await api.post({
    entity: "",
    action: "",
    payload: { codigo },
  })

  if (r.ok) {
    arrHorarios.value[key].instrumentos[k].franja[clave][2].splice(j, 1)
  }
}

const showNames = (key, k, clave, j) => {
  console.log(arrHorarios.value[key].instrumentos[k].franja[clave][2][j])
}

/* ===============================
   WATCHERS
================================= */

watch(tipoMateria, () => {
  selectedProf.value = ""
  getProfesores()
})

</script>


