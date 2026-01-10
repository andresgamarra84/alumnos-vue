<template>
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
        v-for="(aula, i) in aulas"
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
          width: TOTAL_COLUMNS * gridConfig.unitWidth + gridConfig.padding * 2 + 'px',
          height: gridHeight + 'px'
      }"
    >
      <CursoItem
        v-for="curso in cursos"
        :key="curso.codHorario"
        :curso="curso"
        :config="gridConfig"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, inject } from 'vue'
import CursoItem from '@/views/admin/components/CursoItem.vue'
import { api } from '@/api/api'
import { showModal } from '@/services/uiBus'
const TOTAL_COLUMNS = 27

const containerWidth = ref(0)
const layoutContainer = inject('layoutContainer')
const hoverCol = ref(null) // índice horario
const hoverRow = ref(null) // índice aula
const aulas = ref([])     // regla vertical (array del server)

const cursos = ref([])
//const cursosRaw = ref([])
/*computed(() =>
  //detectOverlaps(cursosRaw.value)
  cursosRaw.value
)*/

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
//const gridWidth = horarios.value.length * gridConfig.unitWidth + gridConfig.padding * 2

const gridHeight = computed(() => {
  const rows = aulas.value.length
  return rows * gridConfig.unitHeight + gridConfig.padding * 2
})


const getGrilla = async (sede = "S", dia = 2) => {
  const r = await api.get({
    entity:"horarios",
    action: "getGrilla",
    payload: {
      dia: dia,
      sede: sede
    }
  })
  return r.payload
}

const getAulas = async (sede = "S") => {
  const r = await api.get({
    entity: "aulas",
    action: "getAulas",
    payload: {
      sede: sede
    }
  })
  return r.payload
}
onMounted(async () => {
  cursos.value = await getGrilla()
  aulas.value = await getAulas()
  const observer = new ResizeObserver(entries => {
    containerWidth.value = entries[0].contentRect.width
  })
  observer.observe(layoutContainer.value)
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
/*
function detectOverlaps(cursos) {
  // Clonar para no mutar el original
  const result = cursos.map(c => ({
    ...c,
    overlapIndex: 0,
    overlapCount: 1
  }))

  // Agrupar por aula (t)
  const porAula = {}

  result.forEach(curso => {
    const aula = curso.posicion.t
    if (!porAula[aula]) porAula[aula] = []
    porAula[aula].push(curso)
  })

  // Procesar cada aula
  Object.values(porAula).forEach(cursosAula => {
    // Ordenar por inicio
    cursosAula.sort(
      (a, b) => a.posicion.l - b.posicion.l
    )

    // Comparar overlaps
    for (let i = 0; i < cursosAula.length; i++) {
      const a = cursosAula[i]
      const aStart = a.posicion.l
      const aEnd = a.posicion.l + a.posicion.w

      let overlaps = [a]

      for (let j = i + 1; j < cursosAula.length; j++) {
        const b = cursosAula[j]
        const bStart = b.posicion.l
        const bEnd = b.posicion.l + b.posicion.w

        if (bStart < aEnd && bEnd > aStart) {
          overlaps.push(b)
        }
      }

      // Si hay superposición real
      if (overlaps.length > 1) {
        overlaps.forEach((curso, idx) => {
          curso.overlapIndex = idx
          curso.overlapCount = overlaps.length
        })
      }
    }
  })
  return result
}
*/
/*
const onDragEnd = async ({ codHorario, newL, newT }) => {
  const curso = cursosRaw.value.find(
    c => c.codHorario === codHorario
  )
  const ok = showModal('¿Guardar nueva ubicación?', 1)
  if (ok) {
    curso.posicion.l = newL
    curso.posicion.t = newT
    postDrag(codHorario)
  }
}
const onResizeEnd = async ({ codHorario, newW }) => {
  const curso = cursosRaw.value.find(
    c => c.codHorario === codHorario
  )
  const ok = await showModal('¿Guardar nueva duración?', 1)
  if (ok) {
    curso.posicion.w = newW
    postDrag(codHorario)
  }
}
*/
</script>
<style>

.horarios-layout {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto 1fr;
}
.corner {
  background: #111;
}
.regla-horarios {
  display: flex;
  background: #111;
  position: sticky;
  top: 0;
  z-index: 2;
}
.hora.active,
.aula.active {
  background-color: rgba(255, 255, 255, 0.15);
}

.hora,
.aula {
  transition: background-color 0.1s ease;
}

.hora {
  text-align: center;
  font-size: 11px;
  color: #aaa;
  border-left: 1px solid rgba(255,255,255,0.05);
  line-height: 32px;
}
.regla-aulas {
  background: #111;
}

.aula {
  display: flex;
  align-items: center;
  padding-left: 6px;
  font-size: 12px;
  color: #aaa;
  border-top: 1px solid rgba(255,255,255,0.05);
}

.grilla-horarios {
  position: relative;          /* 👈 FUNDAMENTAL */
  background-color: #1e1e1e;   /* fondo oscuro */
/*  border-radius: 6px;*/

  /* referencia visual */
  /*box-shadow: inset 0 0 0 1px rgba(255,255,255,0.08);*/
}

.grilla {
  position: relative;
}


.curso-item {
  position: absolute;
  border-radius: 6px;
  padding: 6px;
  /*color: #fff;*/
  font-size: 12px;
  box-sizing: border-box;

  /* transición suave */
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;

  /* estado base */
  box-shadow: 0 1px 2px rgba(0,0,0,0.25);
  transform: translateZ(0); /* fuerza capa GPU */
}
.curso-item:hover {
  z-index: 10; /* se eleva sobre los demás */
  transform: translateY(-3px) scale(1.02);
  box-shadow:
    0 6px 14px rgba(0,0,0,0.35),
    0 2px 4px rgba(0,0,0,0.25);
}

</style>
