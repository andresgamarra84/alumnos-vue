import { showModal } from "@/services/uiBus"
import { BASE_URL, ADMIN_FOLDER, SESSION_NAME } from '@/config/app.config'
export function useImpersonation() {
  const openUserPanel = ({ area, codigo }) => {
    if (!area || !codigo) return

    // Token actual del admin
    const token = sessionStorage.getItem(SESSION_NAME)

    if (!token) {
      showModal('Sesión inválida')
      return
    }

    // Query params mínimos
    const params = new URLSearchParams({
        area: area,
        codigo: codigo,
        token: token,
    })
    const url = `${BASE_URL}/${ADMIN_FOLDER}/impersonate.php?${params.toString()}`
    window.open(
      url,
      '_blank',
      'noopener,noreferrer'
    )
  }

  return {
    openUserPanel
  }
}
