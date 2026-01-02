import { reactive } from 'vue'

export const uiState = reactive({
  modal: {
    visible: false,
    title: '',
    message: '',
    type: 0,
    resolver: null
  }
})

export function showModal(message, type = 0, title = 'Información') {
  return new Promise((resolve) => {
    uiState.modal.visible = true
    uiState.modal.title = title
    uiState.modal.message = message
    uiState.modal.type = type
    uiState.modal.resolver = resolve
  })
}

export function closeModal(result) {
  uiState.modal.visible = false
  uiState.modal.resolver?.(result)
  uiState.modal.resolver = null
}
