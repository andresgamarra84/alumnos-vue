import { reactive } from 'vue'

export const uiState = reactive({
  modal: {
    visible: false,
    title: '',
    message: '',
    type: 0,
    resolver: null,
    inputValue: '',
  }
})

export function showModal(message, type = 0, title = 'Información', inputValue='') {
  return new Promise((resolve) => {
    uiState.modal.visible = true
    uiState.modal.title = title
    uiState.modal.message = message
    uiState.modal.type = type
    uiState.modal.resolver = resolve
    uiState.modal.inputValue = inputValue
  })
}

export function closeModal(result) {
  uiState.modal.visible = false
  uiState.modal.resolver?.(result)
  uiState.modal.resolver = null
}
