import { ref } from 'vue'

const isLoading = ref(false)
let pendingRequests = 0

export function useLoading() {
  const start = () => {
    pendingRequests++
    isLoading.value = true
  }

  const stop = () => {
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
