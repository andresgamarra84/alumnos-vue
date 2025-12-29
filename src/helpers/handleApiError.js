import { useModal } from '@/composables/useModal'

export function handleApiError(error) {
  const modal = useModal()

  if (error?.type === 'API_ERROR') {
    modal.show({
      title: 'Atención',
      message: error.message || 'Ocurrió un error',
      type: 0
    })
  }
}