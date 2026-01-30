<template>
  <div
    v-if="showModalCurso"
    class="modal-backdrop-custom d-flex justify-content-center align-items-center"
    @click.self="closeModal"
  >
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-md-10 col-lg-6">
          <div class="modal-card-bootstrap">

            <h4>Editar curso</h4>

            <!-- Código -->
            <div><strong>Código:</strong> {{ cursoForm.codPlHorarios }}</div>

            <!-- Curso -->
            <label>Curso</label>
            <select v-model="cursoForm.codCurso">
              <option :value="null">Seleccionar</option>
              <option v-for="c in cursos" :key="c.codigo" :value="c.codigo">
                {{ c.nombre }}
              </option>
            </select>

            <!-- Profesor -->
            <label>Profesor</label>
            <select v-model="cursoForm.codProfesor">
              <option :value="null">Seleccionar</option>
              <option v-for="p in profesores" :key="p.codigo" :value="p.codigo">
                {{ p.nombre }}
              </option>
            </select>

            <!-- Comisión / Cupo -->
            <div class="row">
              <div>
                <label>Comisión</label>
                <select v-model="cursoForm.comision">
                  <option :value="0">Sin comisión</option>
                  <option v-for="c in arrComision" :key="c" :value="c">{{ c }}</option>
                </select>
              </div>

              <div>
                <label>Cupo</label>
                <input type="number" class='form-control' v-model="cursoForm.cupo" />
              </div>
            </div>

            <!-- Horarios -->
            <template v-if="!cursoForm.tipos.instrumento && !cursoForm.tipos.armonico">
              <div v-for="(h, i) in cursoForm.horarios" :key="i">
                {{ h.dia }} de {{ h.horario[0] }} a {{ h.horario[1] }}
                – Aula {{ h.aula }} ({{ h.sede }})
                <button @click="delCHFromPlHorarios(i)">X</button>
              </div>

              <label>Agregar día</label>
              <select v-model="nuevoDia" @change="addCHToPlHorarios">
                <option disabled value="">Seleccione</option>
                <option v-for="(d, i) in arrDias" :key="i" :value="i">
                  {{ d }}
                </option>
              </select>
            </template>

            <!-- Flags -->
            <div class="checks">
              <label><input type="checkbox" v-model="cursoForm.inscrAbierta" /> Inscripción abierta</label>
              <label><input type="checkbox" v-model="cursoForm.mostrar" /> Mostrar en planilla</label>
              <label><input type="checkbox" v-model="cursoForm.semiPresencial" /> Semipresencial</label>
            </div>

            <div class="checks">
              <label><input type="checkbox" v-model="cursoForm.tipos.normal" /> Materia normal</label>
              <label><input type="checkbox" v-model="cursoForm.tipos.espacioInstitucional" /> Esp. Inst.</label>
              <label><input type="checkbox" v-model="cursoForm.tipos.espacioAlternativo" /> Esp. Altern.</label>
            </div>

            <label>
              <input type="checkbox" v-model="cursoForm.actividades" />
              Actividades online
            </label>

            <!-- Materias asociadas -->
            <div v-if="(cursoForm.materias.tipo & 6) === 0">
              <label>Materia asociada</label>
              <select @change="addMateriaAsociada">
                <option disabled selected>Seleccione</option>
                <option v-for="m in materias" :key="m.codigo" :value="m.codigo">
                  {{ m.nombre }}
                </option>
              </select>

              <div>
                <div v-for="(m, i) in cursoForm.materiasAsociadas" :key="i">
                  {{ m.nombre }}
                  <button @click="delMateriaAsociada(i)">X</button>
                </div>
              </div>
            </div>
            <!-- Instrumento -->
            <div>
              <label>
                <input type="checkbox" v-model="cursoForm.tipos.instrumento"/> Instrumento / Canto
              </label>
              <label>
                <input type="checkbox" v-model="cursoForm.tipos.armonico"/> Instrumento armónico
              </label>
            </div>
            <template v-if="cursoForm.tipos.instrumento || cursoForm.tipos.armonico">
            <label>Instrumento asociado</label>
            <select v-model="cursoForm.codInstrumento">
              <option :value="null">(Ninguno)</option>
              <option v-for="i in instrumentos" :key="i.codigo" :value="i.codigo">
                {{ i.nombre }}
              </option>
            </select>
            </template>
            <!-- Color -->
            <label>Color de fondo</label>
            <input class='form-control w-100' type="color" v-model="cursoForm.bgColor" />

            <!-- Observaciones -->
            <label>Observaciones</label>
            <textarea class='form-control w-100' v-model="cursoForm.obs" rows="4"></textarea>

            <!-- Acciones -->
            <div class="modal-actions">
              <button @click="saveCurso">Guardar</button>
              <button @click="closeModal">Cerrar</button>
              <button class="danger" @click="borrarCurso">Borrar curso</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <h3 class="cabecera">Grilla de horarios de cursos</h3>
  <div class="row">
    <div class="col-4">
      <label>Dia:</label>
      <select v-model="diaSeleccionado">
        <option
          v-for="(dia, index) in arrDias"
          :key="index"
          :value="index"
        >
          {{ dia }}
        </option>
      </select>
    </div>  
    <div class="col-4">
      <label>Sede:</label>
      <select v-model="sedeSeleccionada">
        <option value="S">Santa Fe</option>
        <option value="A">Anchorena</option>
      </select>
    </div>
    <div class="col-4">
      <label>Profesor:</label>
      <select v-model="profesorSeleccionado">
        <option :value="null">(Todos)</option>
        <option v-for="p in profesores" :key="p.codigo" :value="p.codigo">
          {{ p.nombre }}
        </option>
      </select>
    </div>
  </div>
  

  <div 
    ref='gridWrapper' 
    class="horarios-layout m-2"
   
    :style="{
      maxWidth: gridConfig.maxWidth + 'px'
    }"
  >
        <!-- esquina vacía -->
    <div class="corner"></div>

  <div class="regla-horarios">
    <div
      v-for="(hora, i) in horarios"
      :key="i"
      class="hora"
      :class="{ active: hoverCol === i }"
      :style="{ width: gridConfig.unitWidth + 'px' }"
    >
      {{ hora }}
    </div>
  </div>



    <!-- regla vertical (aulas) -->
    <div class="regla-aulas">
      <div
        v-for="(aula, i) in aulas[sedeSeleccionada]"
        :key="i"
        class="aula"
        :class="{ active: hoverRow === i }"
        :style="{ height: gridConfig.unitHeight + 'px' }"
      >
        {{ aula }}
      </div>
    </div>
    <div
      class="grilla-horarios"
      @mousemove="onMouseMove"
      @mouseleave="clearHover"
      :style="{
          width: TOTAL_COLUMNS * gridConfig.unitWidth + (gridConfig.padding * 2) + 'px',
          height: gridHeight + 'px'
      }"
    >
      <CursoItem
        v-for="curso in grillaHorarios"
        :key="curso.codPlHorarios"
        :curso="curso"
        :config="gridConfig"
        v-show="curso.show"
        @drag-start="onDragStart"
        @drag-end="onDragEnd"
        @resize-end="onResizeEnd"
        @select="openCursoModal"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed, inject } from 'vue'
import CursoItem from '@/views/admin/components/CursoItem.vue'
import { api } from '@/api/api'
import { showModal } from '@/services/uiBus'
/* estados */
const diaSeleccionado = ref(2)   // Lunes
const sedeSeleccionada = ref('S') // Santa Fe
const profesorSeleccionado = ref(null)
onMounted(async () => {
  cursos.value = await getCursos()
  aulas.value = await getAulas()
  materias.value = await getMaterias()
  profesores.value = await getProfesores()
  instrumentos.value = await getInstrumentos()
  updGrilla()
  //Observer para el resize de la página principal  
  const observer = new ResizeObserver(entries => {
    containerWidth.value = entries[0].contentRect.width - unitWidth.value
  })
  observer.observe(layoutContainer.value)
})
//Obtener datos de materias, profesores, cursos y aulas
const grillaHorarios = ref([])
const aulas = ref([])     // regla vertical (array del server)
const cursos = ref([])
const profesores = ref([])
const materias = ref([])
const instrumentos = ref([])

watch(
  [diaSeleccionado, sedeSeleccionada],
  () => {
    updGrilla()
  }
)
watch(
  profesorSeleccionado,
  (nuevoProfesor) => {
    grillaHorarios.value.forEach(v=>{
      v.show = (nuevoProfesor === v.codProfesor || nuevoProfesor === null)
    })
  }
)

const updGrilla = async () => {
  const dia = diaSeleccionado.value
  const sede = sedeSeleccionada.value
  grillaHorarios.value = await getGrilla(dia, sede)
}
const getGrilla = async () => {
  const r = await api.get({
    entity:"cursoshorarios",
    action: "getCursosHorarios",
    payload: {
      dia: diaSeleccionado.value,
      sede: sedeSeleccionada.value
    }
  })
  return r.payload
}

const getInstrumentos = async ()=>{
  const r = await api.get({
    entity: "instrumentos",
    action: 'getInstrumentos',
  })
  return r.payload
}
const getMaterias = async () => {
  const r = await api.get({
    entity: "materias",
    action: "getMaterias"
  })
  return r.payload
}
const getProfesores = async () => {
  const r = await api.get({
    entity: 'profesores',
    action: 'getProfesores'
  })
  return r.payload
}
const getAulas = async () => {
  const r = await api.get({
    entity: "aulas",
    action: "getAulas",
    payload: {
      sede: sedeSeleccionada.value
    }
  })
  return r.payload
}
const getCursos = async () => {
  const r = await api.get({
    entity: "cursos",
    action: "getCursos"
  })
  return r.payload
}

//-----------------MODAL DE EDICION DE CURSO--------------------//
import { CURSO_TIPOS } from '@/domain/cursotipos'
const hydrateTiposFromMask = (mask) => ({
  normal: Boolean(mask & CURSO_TIPOS.normal),
  instrumento: Boolean(mask & CURSO_TIPOS.instrumento),
  armonico: Boolean(mask & CURSO_TIPOS.armonico),
  espacioInstitucional: Boolean(mask & CURSO_TIPOS.espacioInstitucional),
  espacioAlternativo: Boolean(mask & CURSO_TIPOS.espacioAlternativo)
})

const showModalCurso = ref(false)
const cursoForm = ref({})
const arrComision = ref([])
const arrDias = ref([])
const nuevoDia = ref(null)
const openCursoModal = async (codPlHorarios) => {
  if (dragContext.value) return
  const r = await api.get({
    entity: "cursoshorarios",
    action: "getInfoCursoHorario",
    payload: {codigo: codPlHorarios}
  })
  cursoForm.value = r.payload
  cursoForm.value.tipos = hydrateTiposFromMask(cursoForm.value.materias.tipo)
  showModalCurso.value = true
}

const addCHToPlHorarios = async () => {
  const curso = grillaHorarios.value.find(ch=>ch.codPlHorarios === cursoForm.value.codPlHorarios)
  const ok = await showModal("¿Confirma que desea agregar el día al curso?", 1)
  if (ok.ok) {
    const r = api.post({
      entity: "cursoshorarios",
      action: "addCHToPlHorarios",
      payload: {
        codPlHorarios: curso.codPlHorarios,
        posicion: curso.posicion,
        dia: nuevoDia.value,
        sede: sedeSeleccionada.value
      },
    })
  }
  nuevoDia.value = null;
}
const delCHFromPlHorarios = async (i) => {
  let horario = cursoForm.value.horarios[i];
  const c = await showModal("¿Confirma que desea borrar este horario del curso?", 1)
  if (c.ok) {
    const r = await api.post({
      entity: "cursoshorarios",
      action: "delCHFromPlHorarios",
      payload: {
        codCH: horario.codCH
      }
    })
    if (r.ok) {
      cursoForm.value.horarios.splice(i, 1)
    }
  }

}
const saveCurso = async () => {
  const ok = await showModal('¿Confirma que desea guardar los cambios?', 1)
  if (ok) {
    const tipos = cursoForm.value.tipos
    const c = cursoForm.value
    const tipoMateria = (tipos.normal ? 1: 0) + (tipos.instrumento ? 2 : 0) + (tipos.armonico ? 4 : 0) + (tipos.espacioInstitucional ? 8 : 0) + (tipos.espacioAlternativo ? 16 : 0)
    if (!tipos.instrumento && !tipos.armonico) c.codInstrumento = null;
    const curso = grillaHorarios.value.find(ch=>ch.codPlHorarios === c.codPlHorarios)
    const profesor = profesores.value.find(p=>p.codigo === c.codProfesor)
    c.materias.tipo = tipoMateria
    c.nombreProf = profesor.nombre
    c.codCH = curso.codCH 
    const r = await api.post({
      entity: "cursoshorarios",
      action: "updPlHorarios",
      payload: c
    })
    if (r.ok) {
      if (curso) {
        const newCurso = {
          bgColor: c.bgColor,
          codCH: curso.codCH,
          codCurso: c.codCurso,
          codPlHorarios: c.codPlHorarios,
          nombreCurso: c.nombreCurso,
          nombreProf: profesor.nombre,
          posicion: curso.posicion,
          tipoMateria: tipoMateria
        }
        Object.assign(curso, newCurso)
      }
    }
  }
  closeModal()
}

const closeModal = () => {
  showModalCurso.value = false
}
const getDias = async () => {
  const r = await api.get({
    entity: "data",
    action: 'getDias'
  })
  return r.payload
}
const getComisiones = async () => {
  const r = await api.get({
    entity: "data",
    action: 'getComisiones'
  })
  return r.payload
}

onMounted(async () => {
  arrDias.value = await getDias()
  arrComision.value = await getComisiones()
  window.addEventListener('keydown', onKey)
})

const onKey = (e) => {
  if (e.key === 'Escape') closeModal()
}

//-----------------CODIGO DE DRAG-DROP-------------------------------------//

const dragContext = ref(null)
function onDragStart(payload) {
  dragContext.value = payload
}
const onDragEnd = async ({ codPlHorarios, endX, endY }) => {
  if (!dragContext.value) return
  const curso = grillaHorarios.value.find(
    c => c.codPlHorarios === codPlHorarios
  )
  if (!curso) return   
  const startX = dragContext.value.startX
  const startY = dragContext.value.startY
  const oldL = dragContext.value.oldL
  const oldT = dragContext.value.oldT
  dragContext.value = null
  const dx = endX - startX
  const dy = endY - startY
  const deltaL = Math.round(dx / gridConfig.value.unitWidth)
  const deltaT = Math.round(dy / gridConfig.value.unitHeight)
  const newL = oldL + deltaL
  const newT = oldT + deltaT
  let l = newL < 0 ? 0 : newL
  let t = newT < 0 ? 0 : newT
  curso.posicion.l = l
  curso.posicion.t = t
  const ok = await showModal("¿Confirma la nueva ubicación del curso?", 1)
  if (ok.ok) {
    const r = await api.post({
      entity: "cursoshorarios",
      action: "updPositionCH",
      payload: {
        codCH: curso.codCH,
        newL: l,
        newT: t,
      }
    })
    if (r.ok) {
      return
    }
  }
  curso.posicion.l = oldL
  curso.posicion.t = oldT
}


//--------------CODIGO DE RESIZE----------------------//

const onResizeEnd = async (v) => { 
  const curso = grillaHorarios.value.find(c=>c.codPlHorarios === v.codPlHorarios)
  if (!curso) return
  let oldW = curso.posicion.w
  if (oldW === v.newW) return
  curso.posicion.w = v.newW
  const ok = await showModal("¿Confirma la nueva duración del curso?", 1)
  if (ok.ok) {
    const r = await api.post({
      entity: "cursoshorarios",
      action: "updWidthCH",
      payload: {
        codCH: curso.codCH,
        newW: v.newW,
      }
    })
    if (r.ok) {
      return
    }
  }
  curso.posicion.w = oldW
}

//-----------------------------------------------------------------------------


const containerWidth = ref(0)
const layoutContainer = inject('layoutContainer')
const hoverCol = ref(null) // índice horario
const hoverRow = ref(null) // índice aula
const TOTAL_COLUMNS = 27
const BASE_CONFIG = {
  startHour: 8,
  endHour: 21.5,
  blocksPerHour: 2,
  unitHeight: 56,
  padding: 8,
  minUnitWidth: 43
}
const unitWidth = computed(() => {
  if (!containerWidth.value) return BASE_CONFIG.minUnitWidth
  const availableWidth =
    containerWidth.value - BASE_CONFIG.padding * 2
  const calculated = Math.floor(
    availableWidth / TOTAL_COLUMNS
  )
  return Math.max(calculated, BASE_CONFIG.minUnitWidth)
})

const maxWidth = computed(() => {
  return containerWidth.value - 30
})

const gridConfig = computed(() => ({
  ...BASE_CONFIG,
  unitWidth: unitWidth.value,
  maxWidth: maxWidth.value
}))

const generarHorarios = (config) => {
  const bloques = []
  const totalBlocks =
    (config.endHour - config.startHour) * config.blocksPerHour

  let hour = config.startHour
  let minutes = 0

  for (let i = 0; i < totalBlocks; i++) {
    const h = Math.floor(hour)
    const m = minutes === 0 ? '00' : '30'

    bloques.push(`${h}:${m}`)

    minutes += 30
    if (minutes === 60) {
      minutes = 0
      hour++
    }
  }

  return bloques
}

const horarios = ref(generarHorarios(BASE_CONFIG))

const gridHeight = computed(() => {
  const rows = aulas.value.length
  return rows * gridConfig.unitHeight + gridConfig.padding * 2
})







const onMouseMove = (event) => {
  const rect = event.currentTarget.getBoundingClientRect()
  const x = event.clientX - rect.left - gridConfig.value.padding
  const y = event.clientY - rect.top - gridConfig.value.padding
  const col = Math.floor(x / gridConfig.value.unitWidth)
  const row = Math.floor(y / gridConfig.value.unitHeight)
  hoverCol.value = col >= 0 ? col : null
  hoverRow.value = row >= 0 ? row : null
}

const clearHover = () => {
  hoverCol.value = null
  hoverRow.value = null
}
</script>

<style>
.horarios-layout {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto 1fr;
}
.corner {
 /* background: #111;*/
}
.regla-horarios {
  display: flex;
 /*background: #111;*/
  position: sticky;
  top: 0;
  z-index: 2;
}
.hora.active,
.aula.active {
 background-color: rgba(10, 169, 222, 0.347);
}

.hora,
.aula {
  transition: background-color 0.1s ease;
}

.hora {
  text-align: center;
  font-size: 11px;
  /*color: #aaa;*/
  border-left: 1px solid rgba(255,255,255,0.05);
  line-height: 32px;
}
.regla-aulas {
 /* background: #111;*/
}

.aula {
  display: flex;
  align-items: center;
  padding-left: 6px;
  font-size: 12px;
 /* color: #aaa;*/
  border-top: 1px solid rgba(255,255,255,0.05);
}

.grilla-horarios {
  position: relative;          /* 👈 FUNDAMENTAL */
  /*background-color: #1e1e1e;   /* fondo oscuro */
}

.grilla {
  position: relative;
}


.modal-backdrop-custom {
  position: fixed;
  inset: 0;
  background: rgba(247, 246, 246, 0.65);
  z-index: 1050;
}

.modal-card-bootstrap {
  background: #fcfcfc; /* o blanco si preferís */
  border-radius: 10px;
  padding: 1.5rem;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0,0,0,0.5);
}

</style>
