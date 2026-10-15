import { ref } from 'vue'
import { api } from '@/api/api'
import { usePermisos } from '@/composables/usePermisos'

const CLAVE = 'cicloLectivoSeleccionado'

const leerGuardado = () => {
  try {
    return sessionStorage.getItem(CLAVE) ?? ''
  } catch {
    return ''
  }
}

const ciclos = ref([])
// Solo el admin ($master) elige ciclo; para el resto queda vacio y el backend usa el vigente
const codCicloLectivo = ref(leerGuardado())
let cargaEnCurso = null

const seleccionar = (cod) => {
  codCicloLectivo.value = cod
  try {
    sessionStorage.setItem(CLAVE, cod)
  } catch {
    // sin storage: el valor vive solo en memoria
  }
}

const cargarCiclos = async () => {
  if (cargaEnCurso) return cargaEnCurso
  const { cargarPermisos, master } = usePermisos()
  cargaEnCurso = (async () => {
    await cargarPermisos()
    if (!master.value) {
      ciclos.value = []
      codCicloLectivo.value = ''
      return
    }
    const r = await api.get({ entity: 'cicloslectivos', action: 'getCiclosLectivos' })
    ciclos.value = r.payload ?? []
    const existe = ciclos.value.some((c) => String(c.codigo) === String(codCicloLectivo.value))
    if (!existe && ciclos.value.length) {
      // Por defecto, el ciclo del año en curso o, si no está, el más reciente
      const anioActual = String(new Date().getFullYear())
      const vigente = ciclos.value.find((c) => String(c.anio) === anioActual)
      const mayor = [...ciclos.value].sort((a, b) => Number(b.anio) - Number(a.anio))[0]
      seleccionar((vigente ?? mayor).codigo)
    }
  })().finally(() => {
    cargaEnCurso = null
  })
  return cargaEnCurso
}

// Payload parcial para mezclar en las llamadas; vacío si no corresponde (no es admin)
const payloadCiclo = () => {
  const { master } = usePermisos()
  return master.value && codCicloLectivo.value ? { codciclolectivo: codCicloLectivo.value } : {}
}

export function useCicloLectivo() {
  return { ciclos, codCicloLectivo, seleccionar, cargarCiclos, payloadCiclo }
}
