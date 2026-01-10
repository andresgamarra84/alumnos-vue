<template>
<div
  class="curso-item shadow-sm transition-all"
  :style="style"
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
import { computed, ref } from 'vue'
import { onMounted, onBeforeUnmount } from 'vue'
/*import interact from 'interactjs'
const interactable = ref(null)
const emit = defineEmits(['drag-end', 'resize-end'])*/
const props = defineProps({
  curso: Object,
  config: Object
})


onMounted(() => {
 /* interactable.value = interact(el.value)
    .draggable({
      inertia: true,
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: 'parent',
          endOnly: true
        })
      ],
      listeners: {
        move (event) {
          const x = (parseFloat(event.target.dataset.x) || 0) + event.dx
          const y = (parseFloat(event.target.dataset.y) || 0) + event.dy

          event.target.style.transform =
            `translate(${x}px, ${y}px)`

          event.target.dataset.x = x
          event.target.dataset.y = y
        },
        end (event) {
          const dx = parseFloat(event.target.dataset.x) || 0
          const dy = parseFloat(event.target.dataset.y) || 0

          const newL =
            props.curso.posicion.l +
            Math.round(dx / props.config.unitWidth)

          const newT =
            props.curso.posicion.t +
            Math.round(dy / props.config.unitHeight)

          emit('drag-end', {
            codHorario: props.curso.codHorario,
            newL,
            newT
          })

          // reset visual
          event.target.style.transform = 'translate(0,0)'
          event.target.dataset.x = 0
          event.target.dataset.y = 0
        }
      }
    })
})

interactable.value.resizable({
  edges: { left: false, right: true, top: false, bottom: false },
  modifiers: [
    interact.modifiers.restrictEdges({
      outer: 'parent'
    }),
    interact.modifiers.restrictSize({
      min: { width: props.config.unitWidth }
    })
  ],
  listeners: {
    move (event) {
      const newWidth =
        Math.round(event.rect.width / props.config.unitWidth)

      event.target.style.width =
        newWidth * props.config.unitWidth + 'px'
    },
    end (event) {
      const newW =
        Math.round(event.rect.width / props.config.unitWidth)

      emit('resize-end', {
        codHorario: props.curso.codHorario,
        newW
      })
    }
  }*/
})

const style = computed(() => {
  const { l, t, w } = props.curso.posicion
  const { unitWidth, unitHeight, padding } = props.config

  return {
    left: padding + l * unitWidth + 'px',
    top: padding + t * unitHeight + 'px',
    width: w * unitWidth - padding + 'px',
    height: unitHeight - padding + 'px',
    backgroundColor: props.curso.bgColor,
    cursor: 'move'
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

.curso-item:hover {
  transform: translateY(-3px) scale(1.02);
  z-index: 20;
}

</style>