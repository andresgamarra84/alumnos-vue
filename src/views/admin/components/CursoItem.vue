<template>
<div
  ref="el"
  class="curso-item shadow-sm transition-all"
  :style="style"
  draggable="true"
  @dragstart="onDragStart"
>
  <div ref="content" class="curso-content">
    <div class="text-truncate">
      {{ curso.contenido }}
    </div>
    <div class="text-truncate">
      Prof. {{ curso.nombreProf }}
    </div>
  </div>
</div>

</template>
<script setup>
import { computed, ref, onMounted, useTemplateRef } from 'vue'
/*import interact from 'interactjs'
const interactable = ref(null)
const emit = defineEmits(['drag-end', 'resize-end'])*/
const el = useTemplateRef("el")
const props = defineProps({
  curso: Object,
  config: Object
})
//const el = ref(null)
let initialWidth = 0
let observer = null
onMounted(() => {
  initialWidth = el.value.offsetWidth
  observer = new ResizeObserver(entries =>{
    for (const entry of entries) {
      const newWidth = entry.contentRect.width
      handleResizeEnd(newWidth)
    }
  })
  observer.observe(el.value)
})
const handleResizeEnd = async (newWidth) => {
  const newW = newWidth
  emit ("resize-end", {
    codHorario: props.curso.codHorario,
    newW: newW
  })
  //initialWidth = newW * unit
}
const emit = defineEmits(['drag-start', 'drag-end', 'resize-end'])
const pointerStartX = ref(0)
const pointerStartY = ref(0)
const draggedEl = ref(null)

function onDragStart(event) {
  event.preventDefault()
  // Identificamos qué curso se arrastra
  /*
  event.dataTransfer.setData(
    'text/plain',
    props.curso.codHorario
  )
  */
  draggedEl.value = event.currentTarget

  pointerStartX.value = event.clientX
  pointerStartY.value = event.clientY

  emit('drag-start', {
    codHorario: props.curso.codHorario,
    startX: pointerStartX.value,
    startY: pointerStartY.value,
    oldL: props.curso.posicion.l,
    oldT: props.curso.posicion.t
  })

  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}

function onMouseMove(event) {
  if (!draggedEl.value) return

  const dx = event.clientX - pointerStartX.value
  const dy = event.clientY - pointerStartY.value

  draggedEl.value.style.transform =
    `translate(${dx}px, ${dy}px)`
}

function onMouseUp(event) {
  if (!draggedEl.value) return

  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)

  const pointerEndX = event.clientX
  const pointerEndY = event.clientY

  emit('drag-end', {
    codHorario: props.curso.codHorario,
    endX: pointerEndX,
    endY: pointerEndY
  })

  // reset visual
  draggedEl.value.style.transform = 'translate(0,0)'
  draggedEl.value = null
}


const style = computed(() => {
  const { l, t, w } = props.curso.posicion
  const { unitWidth, unitHeight, padding } = props.config

  return {
    left: padding + l * unitWidth + 'px',
    top: padding + t * unitHeight + 'px',
    width: w * unitWidth - padding + 'px',
    resize: "horizontal",
    overflow: "hidden",
    minWidth: "43px",
    maxWidth: "100%",
    height: unitHeight - padding + 'px',
    backgroundColor: props.curso.bgColor,
  }
})

</script>
<style>
  .curso-item {
  overflow: hidden;
  transition:
    height 0.2s ease,
    transform 0.15s ease,
    box-shadow 0.15s ease;
}
.curso-item {
  cursor: grab;
}

.curso-item:active {
  cursor: grabbing;
  z-index: 100;
  box-shadow: 0 10px 20px rgba(0,0,0,0.4);
}

.curso-item:hover {
  transform: translateY(-3px) scale(1.02);
  z-index: 20;
}

</style>