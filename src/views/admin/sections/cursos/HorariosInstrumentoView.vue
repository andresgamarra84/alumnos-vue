<template>
    <div id="horariolibre">
  <div class="row">
    <h3>Carga de vacantes de Instrumento / Instrumento Armónico</h3>

    <div class="d-flex justify-content-around">
      <label>
        <input type="radio" v-model="tipoCurso" :value="2" />
        Instrumento
      </label>

      <label>
        <input type="radio" v-model="tipoCurso" :value="4" />
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
            :key="prof.codigo"
            :value="prof.codigo"
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
            {{ curso.instrumento }}: {{ curso.dia }} -
            {{ curso.horario[0] }} a {{ curso.horario[1] }}
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
            v-if="tipoCurso === 2"
            v-for="n in 4"
            :key="n"
            :value="n * 3"
          >
            {{ n * 15 }} minutos
          </option>

          <option
            v-if="tipoCurso === 4"
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
</div>
</template>
<script setup>
import { ref, watch, onMounted } from "vue";
import { api } from "@/api/api";
import { showModal } from "@/services/uiBus";

/* ===============================
   STATE
================================= */

const tipoCurso = ref(2);

const selectedProf = ref("");
const selectedCursoIndex = ref("");

const codPlHorarios = ref(0);

const arrProfesores = ref([]);
const arrCursos = ref([]);
const arrHorarios = ref([]);

const arrHoras = ref([]);
const arrSpans = ref([]);

const desde = ref(0);
const hasta = ref(0);

const cupo = ref("");
const destino = ref("0");

/* ===============================
   HELPERS
================================= */

function getHoras(fromTo) {
  arrHoras.value = [];

  let inicio = fromTo[0];
  let bloques = fromTo[1];

  for (let i = inicio; i <= inicio + bloques; i++) {
    let segundos = i * 1800 + 8 * 3600;

    let h = Math.floor(segundos / 3600);
    let m = Math.floor(((segundos / 3600) - h) * 60);

    arrHoras.value.push(`${h}:${m < 10 ? "0" + m : m}`);
  }
}

/* ===============================
   API CALLS
================================= */

function getProfesores() {
  arrProfesores.value = [];
  arrCursos.value = [];
  arrHorarios.value = [];
  const {payload} = api.get({
    entity: 'profesores',
    action: 'getProfesores',
  })
  apiData.setData("horarios", 9, {
    tipoMateria: tipoCurso.value,
  });

  api.get().then((r) => {
    r.payload.forEach((v) => arrProfesores.value.push(v));
  });
}

function getCursos() {
  arrCursos.value = [];
  arrHorarios.value = [];

  arrSpans.value =
    tipoCurso.value === 'instrumento'
      ? [[1, 15], [2, 30], [3, 45], [4, 60]]
      : [[1, 20], [2, 40], [3, 60]];

  apiData.setData("horarios", 5, {
    tipoMateria: tipoCurso.value,
    codProfesor: selectedProf.value,
  });

  api.get().then((r) => {
    arrCursos.value = r.payload.cursos;
    arrHorarios.value = r.payload.horarios;
  });
}

function setCurso() {
  const curso = arrCursos.value[selectedCursoIndex.value];

  codPlHorarios.value = curso.codigo;
  getHoras(curso.fromTo);
}

/* ===============================
   CRUD HORARIOS
================================= */

function addHorario() {
  const curso = arrCursos.value[selectedCursoIndex.value];

  let inicio = curso.fromTo[0] * 2;

  let posicion = {
    l: desde.value * 2 + inicio,
    w: hasta.value * 2 + inicio,
  };

  apiData.setData("horarios", 4, {
    codPlHorarios: codPlHorarios.value,
    posicion,
    cupo: cupo.value,
    destino: destino.value,
  });

  api.post().then(() => {
    if (api.r.ok) globalMsg("Datos actualizados", true);
  });
}

function updHorario(key, k, clave, j, ev) {
  const idx = ev.target.value;
  const span = arrSpans.value[idx];

  const codigo =
    arrHorarios.value[key].instrumentos[k].franja[clave][2][j].codigo;

  apiData.setData("horarios", 9, {
    nuevoCupo: span[0],
    codigo,
  });

  api.post().then(() => {
    if (api.r.ok) {
      arrHorarios.value[key].instrumentos[k].franja[clave][2][j].cupo = span;
    }
  });
}

function delHorario(key, k, clave, j) {
  if (!confirm("¿Confirma que desea borrar este horario?")) return;

  const codigo =
    arrHorarios.value[key].instrumentos[k].franja[clave][2][j].codigo;

  apiData.setData("horarios", 5, { codigo });

  api.post().then(() => {
    if (api.r.ok) {
      arrHorarios.value[key].instrumentos[k].franja[clave][2].splice(j, 1);
    }
  });
}

function showNames(key, k, clave, j) {
  console.log(arrHorarios.value[key].instrumentos[k].franja[clave][2][j]);
}

/* ===============================
   WATCHERS
================================= */

watch(tipoCurso, () => {
  selectedProf.value = "";
  getProfesores();
});

/* ===============================
   INIT
================================= */

onMounted(() => {
  getProfesores();
});
</script>
