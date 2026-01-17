<template>
<div
  ref="el"
  class="curso-item shadow-sm transition-all"
  :style="style"
  draggable="true"
  @dragstart="onDragStart"
  @mousedown="onMouseDown"
  @click.stop="onClick"
>
  <div ref="content" class="curso-content">
    <div class="text-truncate">
      {{ curso.nombreCurso }}
    </div>
    <div class="text-truncate">
      Prof. {{ curso.nombreProf }}
    </div>
  </div>
</div>

</template>
<script setup>
import { computed, ref, useTemplateRef } from 'vue'

const el = useTemplateRef("el")
const props = defineProps({
  curso: Object,
  config: Object
})
let isDragging = false
let isResizing = false
let startX = 0
let startWidthPx = 0
function isOnResizeHandle(e) {
  const rect = el.value.getBoundingClientRect()
  return e.clientX >= rect.right - 10
}

function onMouseDown(e) {
  if (isOnResizeHandle(e)) {
    isResizing = true
    startX = e.clientX
    startWidthPx = el.value.offsetWidth

    e.preventDefault()
    e.stopPropagation()

    document.addEventListener('mousemove', onResizeMove)
    document.addEventListener('mouseup', onResizeUp)
    return
  }

  // si NO es resize, dejamos que fluya el drag
}
function onResizeMove(e) {
  if (!isResizing) return

  const dx = e.clientX - startX
  const newWidth = startWidthPx + dx

  el.value.style.width = `${newWidth}px`
}

function onResizeUp() {
  if (!isResizing) return

  document.removeEventListener('mousemove', onResizeMove)
  document.removeEventListener('mouseup', onResizeUp)

  const { unitWidth, padding } = props.config
  const widthPx = el.value.offsetWidth

  const newW = Math.max(
    1,
    Math.round((widthPx + padding) / unitWidth)
  )
  el.value.style.width = newW * unitWidth - padding
  emit('resize-end', {
    codPlHorarios: props.curso.codPlHorarios,
    newW
  })

  isResizing = false
}
function onClick(e) {
  if (isOnResizeHandle(e)) return
  console.log(isResizing)
  emit('select', props.curso.codPlHorarios)
}
const emit = defineEmits(['drag-start', 'drag-end', 'resize-end', 'select'])
const pointerStartX = ref(0)
const pointerStartY = ref(0)
const draggedEl = ref(null)

function onDragStart(event) {
  if (isResizing) return
  isDragging = true
  event.preventDefault()
  draggedEl.value = event.currentTarget

  pointerStartX.value = event.clientX
  pointerStartY.value = event.clientY

  emit('drag-start', {
    codPlHorarios: props.curso.codPlHorarios,
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
  isDragging = false
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)

  const pointerEndX = event.clientX
  const pointerEndY = event.clientY

  emit('drag-end', {
    codPlHorarios: props.curso.codPlHorarios,
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
  position:absolute;
  border-radius: 6px;
  padding:6px;
  font-size: 12px;
  font-weight: normal;
  box-sizing: border-box;
  cursor:grab;
  overflow: hidden;
  transition:
    height 0.2s ease,
    transform 0.25s ease,
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
  font-weight: bold;
  z-index: 20;
}
.curso-item {
  position: absolute;
  cursor: grab;
}

.curso-item::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: 10px;
  height: 100%;
  cursor: ew-resize;
  background: transparent;
}

</style>