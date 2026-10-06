<template>
  <div class="container">

    <h3 class="h3cabecera">Nuevo estudiante</h3>

    <!-- ================= DATOS BÁSICOS ================= -->
    <div class="row recuadro">

      <div class="col-md-6 mb-3">
        <label>Apellido</label>
        <input
          v-model="dPers.apellido"
          type="text"
          class="form-control"
          required
        />
      </div>

      <div class="col-md-6 mb-3">
        <label>Nombre</label>
        <input
          v-model="dPers.nombre"
          type="text"
          class="form-control"
          required
        />
      </div>

      <div class="col-md-4 mb-3">
        <label>Tipo de documento</label>
        <select v-model="dPers.codTipoDoc" class="form-control" required>
          <option disabled value="">Seleccione</option>
          <option
            v-for="(t, i) in arrTipoDoc"
            :key="i"
            :value="i"
          >
            {{ t }}
          </option>
        </select>
      </div>

      <div class="col-md-4 mb-3">
        <label>N° Documento</label>
        <input
          v-model="dPers.nroDoc"
          type="text"
          class="form-control"
          required
        />
      </div>

      <div class="col-md-4 mb-3">
        <label>Sexo</label>
        <select v-model="dPers.sexo" class="form-control" required>
          <option disabled value="">Seleccione</option>
          <option value="0">Masculino</option>
          <option value="1">Femenino</option>
          <option value="2">Otro</option>
        </select>
      </div>
    <!-- ================= FECHA NACIMIENTO ================= -->
      <div class="col-md-4 mb-3">
        <label>Día</label>
        <select v-model="day" class="form-control" required>
          <option disabled value="">Día</option>
          <option v-for="d in arrDays" :key="d" :value="d">
            {{ d }}
          </option>
        </select>
      </div>

      <div class="col-md-4 mb-3">
        <label>Mes</label>
        <select v-model="month" class="form-control" required>
          <option disabled value="">Mes</option>
          <option
            v-for="(m, i) in arrMonths"
            :key="i"
            :value="i + 1"
          >
            {{ m }}
          </option>
        </select>
      </div>

      <div class="col-md-4 mb-3">
        <label>Año</label>
        <select v-model="year" class="form-control" required>
          <option disabled value="">Año</option>
          <option v-for="y in arrYears" :key="y" :value="y">
            {{ y }}
          </option>
        </select>
      </div>

    </div>

    <!-- ================= DOMICILIO ================= -->
    <div class="row recuadro mt-3">
      <div class='col-12 col-md-6'>
        <label>Teléfono:</label>
        <input
          type='text'
          class='form-control'
          v-model="dPers.telefono"
        >
      </div>
      <div class='col-12 col-md-6'>
        <label>Celular:</label>
        <input
          type='text'
          class="form-control"
          v-model="dPers.telCelular"
        >
      </div>
      <div class='col-12 col-md-6'>
        <label>Tel. alternativo:</label>
        <input
          type='text'
          class='form-control'
          v-model='dPers.telAlternativo'
        >
      </div>
      <div class="col-12 col-md-6">
        <label>Pertenece a:</label>
        <input
          type='text'
          class='form-control'
          v-model='dPers.pertenecea'
        >
      </div>
      <div class='col-12 col-md-6'>
        <label>E-mail:</label>
        <input
          type='text'
          class='form-control'
          v-model="dPers.email"
        >
      </div>
      <div class='col-12'>
        <label>Dirección:</label>
        <input type='text'
          class='form-control'
          placeholder='Calle/Altura/Piso/Depto'
          v-model="dPers.direccion"
        >
      </div>
      <div class="col-md-6 mb-3">
        <label>Provincia</label>
        <select
          v-model="idProvincia"
          class="form-control"
        >
          <option disabled value="">Seleccione</option>
          <option
            v-for="p in arrProv"
            :key="p.id"
            :value="p.id"
          >
            {{ p.nombre }}
          </option>
        </select>
      </div>

      <div class="col-md-6 mb-3">
        <label>Localidad</label>
        <select
          v-model="dPers.idLocalidad"
          class="form-control"
        >
          <option disabled value="">Seleccione</option>
          <option
            v-for="l in arrLocalidad"
            :key="l.id"
            :value="l.id"
          >
            {{ l.nombre }}
          </option>
        </select>
      </div>

    </div>

    <!-- ================= DATOS DE LOS PADRES (menores de edad) ================= -->
    <div v-if="esMenor18" class="row recuadro mt-3">
      <div class='col-12 col-md-6 form-group'>
        <label>Nombre del padre:</label>
        <input
          type='text'
          class='form-control'
          v-model="dPers.nombrePadre"
        >
      </div>
      <div class='col-12 col-md-6 form-group'>
        <label>Nº de DNI: </label>
        <input
          type='text'
          placeholder='Ingrese sólo números'
          class='form-control'
          v-model="dPers.dniPadre"
        >
      </div>
      <div class='col-12 col-md-6 form-group'>
        <label>Nombre de la madre:</label>
        <input
          type='text'
          class='form-control'
          v-model="dPers.nombreMadre"
        >
      </div>
      <div class='col-12 col-md-6 form-group'>
        <label>Nº de DNI: </label>
        <input
          type='text'
          placeholder='Ingrese sólo números'
          class='form-control'
          v-model="dPers.dniMadre"
        >
      </div>
    </div>

    <!-- ================= ESTUDIOS ================= -->
    <div class="row recuadro mt-3">
      <div class="col-12">
        <label>
          <input type="checkbox" v-model="dPers.tieneTituloSecundario" />
          ¿Tiene título secundario?
        </label>
      </div>
      <div v-if="dPers.tieneTituloSecundario" class="col-md-6 mb-3">
        <label>Título cursado</label>
        <input type="text" class="form-control" v-model="dPers.tituloCursado">
      </div>
      <div v-if="dPers.tieneTituloSecundario" class="col-md-6 mb-3">
        <label>Año de egreso</label>
        <input type="number" class="form-control" v-model="dPers.anioEgreso">
      </div>
      <div class="col-md-6 mb-3">
        <label>Escuela</label>
        <input type="text" class="form-control" v-model="dPers.escuela">
      </div>
      <div class="col-md-6 mb-3">
        <label>Distrito escolar</label>
        <input type="text" class="form-control" v-model="dPers.distritoEscolar">
      </div>
    </div>

    <!-- ================= SALUD ================= -->
    <div class="row recuadro mt-3">
      <div class="col-md-6 mb-3">
        <label>Obra social:</label>
        <input type="text" class="form-control" v-model="dPers.obraSocial">
      </div>
      <div class="col-md-6 mb-3">
        <label>N° de obra social:</label>
        <input type="text" class="form-control" v-model="dPers.nroObraSocial">
      </div>
    </div>

    <!-- ================= FICHA DE SALUD ================= -->
    <div class="row recuadro mt-3">
      <div class="col-12 mb-2"><h5>Ficha de salud</h5></div>

      <div class="col-12 mb-3">
        <label class="me-3">Enfermedades / antecedentes:</label>
        <div class="row">
          <div
            v-for="ant in arrAntecedentes"
            :key="ant.key"
            class="col-6 col-md-4 col-lg-3 mb-2"
          >
            <label>
              <input type="checkbox" v-model="dPers[ant.key]" />
              {{ ant.label }}
            </label>
          </div>
        </div>
      </div>

      <div class="col-12 mb-2">
        <label>
          <input type="checkbox" v-model="dPers.alergias" />
          ¿Tiene alergias?
        </label>
      </div>
      <div v-if="dPers.alergias" class="col-12 mb-3">
        <textarea
          v-model="dPers.aque"
          class="form-control"
          placeholder="Detalle a qué es alérgico"
        />
      </div>

      <div class="col-md-6 mb-3">
        <label>Grupo sanguíneo</label>
        <input type="text" class="form-control" v-model="dPers.gsanguineo" placeholder="Ej: O+">
      </div>

      <div class="col-12 mb-2">
        <label>
          <input type="checkbox" v-model="dPers.partonormal" />
          Parto normal
        </label>
      </div>
      <div class="col-12 mb-3">
        <label>Problemas en el parto (si los hubo):</label>
        <textarea v-model="dPers.problemaparto" class="form-control" />
      </div>

      <div class="col-12">
        <label>Observaciones:</label>
        <textarea v-model="dPers.observaciones" class="form-control" rows="3" />
      </div>
    </div>

    <!-- ================= ACCIONES ================= -->
    <div class="row mt-4">
      <div class="col-12 text-end">
        <button class="btn btn-primary me-2" @click="postData">
          Crear estudiante
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import { api } from '@/api/api'
import { showModal, showToast } from '@/services/uiBus'

/* ================= STATE ================= */
const initialForm = () => ({
  nombre: '',
  apellido: '',
  codTipoDoc: '',
  nroDoc: '',
  sexo: '',
  fechaNac: '',
  telefono: '',
  telCelular: '',
  telAlternativo: '',
  pertenecea: '',
  email: '',
  direccion: '',
  idLocalidad: '',
  nombrePadre: '',
  dniPadre: '',
  nombreMadre: '',
  dniMadre: '',
  tieneTituloSecundario: false,
  tituloCursado: '',
  anioEgreso: '',
  escuela: '',
  distritoEscolar: '',
  obraSocial: '',
  nroObraSocial: '',
  sarampion: false,
  varicela: false,
  rubeola: false,
  escarlatina: false,
  tosconvulsa: false,
  paperas: false,
  asma: false,
  epilepsia: false,
  hepatitis: false,
  celiaquia: false,
  diabetes: false,
  congenitas: false,
  infecciosas: false,
  metabolicas: false,
  psiquicos: false,
  hernias: false,
  musculares: false,
  fracturas: false,
  intervenciones: false,
  traumatismo: false,
  alergias: false,
  aque: '',
  gsanguineo: '',
  partonormal: false,
  problemaparto: '',
  observaciones: '',
})

const arrAntecedentes = [
  { key: 'sarampion', label: 'Sarampión' },
  { key: 'varicela', label: 'Varicela' },
  { key: 'rubeola', label: 'Rubeola' },
  { key: 'escarlatina', label: 'Escarlatina' },
  { key: 'tosconvulsa', label: 'Tos convulsa' },
  { key: 'paperas', label: 'Paperas' },
  { key: 'asma', label: 'Asma' },
  { key: 'epilepsia', label: 'Epilepsia' },
  { key: 'hepatitis', label: 'Hepatitis' },
  { key: 'celiaquia', label: 'Celiaquía' },
  { key: 'diabetes', label: 'Diabetes' },
  { key: 'congenitas', label: 'Enfermedades congénitas' },
  { key: 'infecciosas', label: 'Enfermedades infecciosas' },
  { key: 'metabolicas', label: 'Enfermedades metabólicas' },
  { key: 'psiquicos', label: 'Trastornos psíquicos' },
  { key: 'hernias', label: 'Hernias' },
  { key: 'musculares', label: 'Afecciones musculares' },
  { key: 'fracturas', label: 'Fracturas' },
  { key: 'intervenciones', label: 'Intervenciones quirúrgicas' },
  { key: 'traumatismo', label: 'Traumatismos' },
]

const dPers = reactive(initialForm())

const arrProv = ref([])
const arrLocalidad = ref([])
const idProvincia = ref('')

const arrTipoDoc = [
  '',
  'DNI Tarjeta',
  'DNI Libreta',
  'LE/LC',
  'Pasaporte',
  'Otro'
]

const arrYears = ref([])
const arrMonths = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
]
const arrDays = Array.from({ length: 31 }, (_, i) => i + 1)

const day = ref('')
const month = ref('')
const year = ref('')

const esMenor18 = ref(false)

/* ================= WATCHERS ================= */
watch([day, month, year], () => {
  if (day.value && month.value && year.value) {
    dPers.fechaNac = `${year.value}-${month.value}-${day.value}`
    const edad = new Date().getFullYear() - year.value
    esMenor18.value = edad < 18
  }
})

watch(idProvincia, async (val) => {
  dPers.idLocalidad = ''
  arrLocalidad.value = []
  if (!val) return
  const r = await api.get({
    entity: 'localidades',
    action: 'getLocalidades',
    payload: { codigo: val }
  })
  arrLocalidad.value = r.payload ?? []
})

/* ================= METHODS ================= */
const postData = async () => {
  if (!dPers.nombre || !dPers.apellido || !dPers.nroDoc) {
    showToast('Complete nombre, apellido y número de documento', 'error')
    return
  }

  const { ok } = await showModal(
    '¿Confirma que desea crear este estudiante?',
    1,
    'Confirmación'
  )
  if (!ok) return

  const r = await api.post({
    entity: 'estudiantes',
    action: 'addEstudiante',
    payload: dPers
  })
  if (!r.ok) return

  showToast('Estudiante creado correctamente', 'success')
  Object.assign(dPers, initialForm())
  day.value = ''
  month.value = ''
  year.value = ''
  idProvincia.value = ''
  arrLocalidad.value = []
  esMenor18.value = false
}

/* ================= LIFECYCLE ================= */
const maxYear = new Date().getFullYear() - 7
for (let i = 1930; i < maxYear; i++) arrYears.value.push(i)

api.get({ entity: 'localidades', action: 'getProvincias' }).then((r) => {
  arrProv.value = r.payload ?? []
})
</script>
