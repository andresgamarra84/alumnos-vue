import { ref } from 'vue'

const isLoading = ref(false)
let pendingRequests = 0

export function useLoading() {
  // showSpinner (default true): con false el pedido no cuenta para el spinner y no bloquea la pantalla.
  // stop() debe recibir el mismo valor que recibió su start() para que el contador quede balanceado.
  const start = (showSpinner = true) => {
    if (!showSpinner) return
    pendingRequests++
    isLoading.value = true
  }

  const stop = (showSpinner = true) => {
    if (!showSpinner) return
    pendingRequests--
    if (pendingRequests <= 0) {
      pendingRequests = 0
      isLoading.value = false
    }
  }

  return {
    isLoading,
    start,
    stop
  }
}
