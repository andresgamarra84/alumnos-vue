import { ref } from 'vue'
import { api } from '@/api/api'

const permisos = ref({})
const master = ref(false)
let cargado = false
let cargaEnCurso = null

const cargarPermisos = async () => {
  if (cargado) return
  if (cargaEnCurso) return cargaEnCurso

  cargaEnCurso = api
    .get({ entity: 'menu', action: 'getMisPermisos' })
    .then(({ payload }) => {
      permisos.value = payload?.permisos ?? {}
      master.value = Boolean(payload?.master)
      cargado = true
    })
    .finally(() => {
      cargaEnCurso = null
    })

  return cargaEnCurso
}

const tienePermiso = (...ids) => {
  if (master.value) return true
  return ids.some((id) => Boolean(permisos.value[id]))
}

export function usePermisos() {
  return { permisos, master, cargarPermisos, tienePermiso }
}
