import { ref } from 'vue'
import { api } from '@/api'

export function useMesas() {

  // =====================
  // Estado (antes: data)
  // =====================
  const carreras = ref([])
  const materias = ref([])
  const profesores = ref([])
  const permitLibre = ref(true)

  // =====================
  // Acciones (antes: methods)
  // =====================

  // Paso 0 – listar carreras
  const cargarCarreras = async () => {
    carreras.value = []
    materias.value = []
    profesores.value = []

    const r = await api.get({ recurso: 'mesas' })
    carreras.value = r.payload
  }

  // Paso 1 – listar materias
  const cargarMaterias = async (carrera) => {
    materias.value = []
    profesores.value = []

    const r = await api.get({
      recurso: 'mesas',
      paso: 1,
      codigo: carrera.codigo,
      codCarrera: carrera.carrera.codigo,
      codInstrumento: carrera.instrumento.codigo
    })

    materias.value = r.payload.materias
    permitLibre.value = r.payload.permitirLibre
  }

  // Paso 2 – listar profesores
  const cargarProfesores = async (carrera, codMateria) => {
    profesores.value = []

    const r = await api.get({
      recurso: 'mesas',
      paso: 2,
      codigo: carrera.codigo,
      codCarrera: carrera.carrera.codigo,
      codInstrumento: carrera.instrumento.codigo,
      codMC: codMateria
    })

    profesores.value = r.payload
  }

  // Paso 3 – solicitar mesa
  const solicitarMesa = async ({ carrera, codMateria, profesor, condicion }) => {
    const r = await api.post({
      recurso: 'mesas',
      paso: 0,
      codigo: carrera.codigo,
      codMC: codMateria,
      codPlHorarios: profesor.codPlHorarios,
      codProfesor: profesor.codProfesor,
      condicion
    })

    if (r.ok) {
      alert('La solicitud ha sido ingresada correctamente')
    }

    // reset visual
    materias.value = []
    profesores.value = []
  }

  // =====================
  // Lo que la View puede usar
  // =====================
  return {
    carreras,
    materias,
    profesores,
    permitLibre,
    cargarCarreras,
    cargarMaterias,
    cargarProfesores,
    solicitarMesa
  }
}
