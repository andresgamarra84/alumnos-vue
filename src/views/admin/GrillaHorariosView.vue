<template>
  <div
    v-if="showModalCurso"
    class="modal-backdrop-custom d-flex justify-content-center align-items-center"
    @click.self="closeModal"
  >
    <div class="modal-card-bootstrap">

      <!-- Header -->
      <div class="modal-header-custom">
        <div>
          <h5 class="mb-0">Editar curso</h5>
          <span class="text-muted small">Código #{{ cursoForm.codPlHorarios }}</span>
        </div>
        <button type="button" class="btn-close" aria-label="Cerrar" @click="closeModal"></button>
      </div>

      <!-- Body -->
      <div class="modal-body-custom">

        <!-- Datos generales -->
        <section class="form-section">
          <h6 class="section-title">Datos generales</h6>
          <div class="row g-3">
            <div class="col-12">
              <label class="form-label">Curso</label>
              <select class="form-select" v-model="cursoForm.codCurso">
                <option :value="null">Seleccionar</option>
                <option v-for="c in cursos" :key="c.codigo" :value="c.codigo">
                  {{ c.nombre }}
                </option>
              </select>
            </div>

            <div class="col-12">
              <label class="form-label">Profesor</label>
              <select class="form-select" v-model="cursoForm.codProfesor">
                <option :value="null">Seleccionar</option>
                <option v-for="p in profesores" :key="p.codigo" :value="p.codigo">
                  {{ p.nombre }}
                </option>
              </select>
            </div>

            <div class="col-6">
              <label class="form-label">Comisión</label>
              <select class="form-select" v-model="cursoForm.comision">
                <option :value="0">Sin comisión</option>
                <option v-for="c in arrComision" :key="c" :value="c">{{ c }}</option>
              </select>
            </div>

            <div class="col-6">
              <label class="form-label">Cupo</label>
              <input type="number" class="form-control" v-model="cursoForm.cupo" />
            </div>
          </div>
        </section>

        <!-- Horarios -->
        <section class="form-section" v-if="!cursoForm.tipos.instrumento && !cursoForm.tipos.armonico">
          <h6 class="section-title">Horarios</h6>

          <ul class="list-group mb-3" v-if="cursoForm.horarios?.length">
            <li
              class="list-group-item d-flex justify-content-between align-items-center"
              v-for="(h, i) in cursoForm.horarios"
              :key="i"
            >
              <span>
                <strong>{{ h.dia }}</strong> de {{ h.horario[0] }} a {{ h.horario[1] }}
                <span class="text-muted"> — Aula {{ h.aula }} ({{ h.sede }})</span>
              </span>
              <button type="button" class="btn btn-sm btn-outline-danger" @click="delCHFromPlHorarios(i)">
                Quitar
              </button>
            </li>
          </ul>
          <p class="text-muted small mb-3" v-else>Sin horarios asignados.</p>

          <label class="form-label">Agregar día</label>
          <select class="form-select" v-model="nuevoDia" @change="addCHToPlHorarios">
            <option disabled value="">Seleccione</option>
            <option v-for="(d, i) in arrDias" :key="i" :value="i">
              {{ d }}
            </option>
          </select>
        </section>

        <!-- Configuración -->
        <section class="form-section">
          <h6 class="section-title">Configuración</h6>
          <div class="form-check form-switch mb-2">
            <input class="form-check-input" type="checkbox" role="switch" id="chkInscrAbierta" v-model="cursoForm.inscrAbierta" />
            <label class="form-check-label" for="chkInscrAbierta">Inscripción abierta</label>
          </div>
          <div class="form-check form-switch mb-2">
            <input class="form-check-input" type="checkbox" role="switch" id="chkMostrar" v-model="cursoForm.mostrar" />
            <label class="form-check-label" for="chkMostrar">Mostrar en planilla</label>
          </div>
          <div class="form-check form-switch mb-2">
            <input class="form-check-input" type="checkbox" role="switch" id="chkSemiPresencial" v-model="cursoForm.semiPresencial" />
            <label class="form-check-label" for="chkSemiPresencial">Semipresencial</label>
          </div>
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" role="switch" id="chkActividades" v-model="cursoForm.actividades" />
            <label class="form-check-label" for="chkActividades">Actividades online</label>
          </div>
        </section>

        <!-- Tipo de materia -->
        <section class="form-section">
          <h6 class="section-title">Tipo de materia</h6>
          <div class="d-flex flex-wrap gap-3 mb-3">
            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="tipoNormal" v-model="cursoForm.tipos.normal" />
              <label class="form-check-label" for="tipoNormal">Materia normal</label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="tipoEspInst" v-model="cursoForm.tipos.espacioInstitucional" />
              <label class="form-check-label" for="tipoEspInst">Esp. institucional</label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="tipoEspAlt" v-model="cursoForm.tipos.espacioAlternativo" />
              <label class="form-check-label" for="tipoEspAlt">Esp. alternativo</label>
            </div>
          </div>

          <div class="d-flex flex-wrap gap-3">
            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="tipoInstrumento" v-model="cursoForm.tipos.instrumento" />
              <label class="form-check-label" for="tipoInstrumento">Instrumento / Canto</label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="tipoArmonico" v-model="cursoForm.tipos.armonico" />
              <label class="form-check-label" for="tipoArmonico">Instrumento armónico</label>
            </div>
          </div>

          <template v-if="cursoForm.tipos.instrumento || cursoForm.tipos.armonico">
            <label class="form-label mt-3">Instrumento asociado</label>
            <select class="form-select" v-model="cursoForm.codInstrumento">
              <option :value="null">(Ninguno)</option>
              <option v-for="i in instrumentos" :key="i.codigo" :value="i.codigo">
                {{ i.nombre }}
              </option>
            </select>
          </template>
        </section>

        <!-- Materias asociadas -->
        <section class="form-section" v-if="(cursoForm.materias.tipo & 6) === 0">
          <h6 class="section-title">Materias asociadas</h6>
          <select class="form-select mb-2" @change="addMateriaAsociada">
            <option disabled value="">Seleccione</option>
            <option v-for="m in materiasDisponibles" :key="m.codigo" :value="m.codigo">
              {{ m.nombre }} ({{ m.codigo }})
            </option>
          </select>

          <ul class="list-group" v-if="materiasAsociadas.length">
            <li
              class="list-group-item d-flex justify-content-between align-items-center"
              v-for="m in materiasAsociadas"
              :key="m.codigo"
            >
              {{ m.nombre }} ({{ m.codigo }})
              <button type="button" class="btn btn-sm btn-outline-danger" @click="delMateriaAsociada(m.codigo)">
                Quitar
              </button>
            </li>
          </ul>
          <p class="text-muted small mb-0" v-else>Sin materias asociadas.</p>
        </section>

        <!-- Apariencia -->
        <section class="form-section">
          <h6 class="section-title">Apariencia</h6>
          <div class="d-flex align-items-center gap-3">
            <label class="form-label mb-0" for="colorFondo">Color de fondo</label>
            <input id="colorFondo" class="form-control form-control-color" type="color" v-model="cursoForm.bgColor" title="Elegir color" />
          </div>
        </section>

        <!-- Observaciones -->
        <section class="form-section form-section--last">
          <h6 class="section-title">Observaciones</h6>
          <textarea class="form-control" v-model="cursoForm.obs" rows="3" placeholder="Notas adicionales sobre el curso..."></textarea>
        </section>

      </div>

      <!-- Footer -->
      <div class="modal-footer-custom">
        <button type="button" class="btn btn-outline-danger me-auto" @click="borrarCurso">Borrar curso</button>
        <button type="button" class="btn btn-outline-secondary" @click="closeModal">Cancelar</button>
        <button type="button" class="btn btn-primary" @click="saveCurso">Guardar cambios</button>
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
    action: "getGrilla",
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
      entity: "planillahorarios",
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

const materiasAsociadas = computed(() => {
  const codigos = cursoForm.value.materias?.matAsociadas || []
  return codigos
    .map(codMateria => materias.value.find(m => m.codigo === codMateria))
    .filter(Boolean)
})

const materiasDisponibles = computed(() => {
  const codigos = cursoForm.value.materias?.matAsociadas || []
  return materias.value.filter(m => !codigos.includes(m.codigo))
})

const addMateriaAsociada = async (event) => {
  const codMateria = Number(event.target.value)
  event.target.value = ''
  if (!codMateria) return
  const ok = await showModal("¿Confirma que desea asociar esta materia al curso?", 1)
  if (!ok.ok) return
  const r = await api.post({
    entity: "cursoshorarios",
    action: "addMateriaAsociada",
    payload: {
      codPlHorarios: cursoForm.value.codPlHorarios,
      codMateria
    }
  })
  if (r.ok) {
    cursoForm.value.materias.matAsociadas.push(codMateria)
  }
}

const delMateriaAsociada = async (codMateria) => {
  const ok = await showModal("¿Confirma que desea quitar esta materia asociada?", 1)
  if (!ok.ok) return
  const r = await api.post({
    entity: "cursoshorarios",
    action: "delMateriaAsociada",
    payload: {
      codPlHorarios: cursoForm.value.codPlHorarios,
      codMateria
    }
  })
  if (r.ok) {
    cursoForm.value.materias.matAsociadas = cursoForm.value.materias.matAsociadas.filter(
      c => c !== codMateria
    )
  }
}

const borrarCurso = async () => {
  const ok = await showModal(
    "¿Confirma que desea borrar este curso? También se eliminarán sus horarios y materias asociadas.",
    1
  )
  if (!ok.ok) return
  const r = await api.post({
    entity: "planillahorarios",
    action: "delCurso",
    payload: {
      codPlHorarios: cursoForm.value.codPlHorarios
    }
  })
  if (r.ok) {
    grillaHorarios.value = grillaHorarios.value.filter(
      c => c.codPlHorarios !== cursoForm.value.codPlHorarios
    )
    closeModal()
  }
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
  background: rgba(20, 20, 25, 0.55);
  z-index: 1050;
  padding: 1rem;
}

.modal-card-bootstrap {
  background: #fcfcfc;
  border-radius: 12px;
  width: 100%;
  max-width: 640px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.35);
  overflow: hidden;
}

.modal-header-custom {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem 1.5rem 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.modal-body-custom {
  padding: 1.25rem 1.5rem;
  overflow-y: auto;
}

.modal-footer-custom {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  background: #f8f9fa;
}

.form-section {
  padding-bottom: 1.25rem;
  margin-bottom: 1.25rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.07);
}

.form-section--last,
.form-section:last-child {
  padding-bottom: 0;
  margin-bottom: 0;
  border-bottom: none;
}

.section-title {
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 0.72rem;
  font-weight: 700;
  color: #6c757d;
  margin-bottom: 0.75rem;
}

</style>
