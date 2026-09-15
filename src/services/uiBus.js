import { reactive } from 'vue'

export const uiState = reactive({
  modal: {
    visible: false,
    title: '',
    message: '',
    type: 0,
    resolver: null,
    inputValue: '',
  },
  toasts: []
})

let toastSeq = 0

// type: 'success' | 'error' | 'info'
export function showToast(message, type = 'info', duration = 4000) {
  const id = ++toastSeq
  uiState.toasts.push({ id, message, type })
  if (duration > 0) {
    setTimeout(() => removeToast(id), duration)
  }
  return id
}

export function removeToast(id) {
  const index = uiState.toasts.findIndex(t => t.id === id)
  if (index !== -1) uiState.toasts.splice(index, 1)
}

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
