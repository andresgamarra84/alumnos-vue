<template>
  <div class="container">

    <h3 class="h3cabecera">Datos personales</h3>

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
        <select v-model="dPers.dia" class="form-control" required>
          <option disabled value="">Día</option>
          <option v-for="d in arrDays" :key="d" :value="d">
            {{ d }}
          </option>
        </select>
      </div>

      <div class="col-md-4 mb-3">
        <label>Mes</label>
        <select v-model="dPers.mes" class="form-control" required>
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
        <select v-model="dPers.anio" class="form-control" required>
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
      <div class='col-12 col-md-6 align-self-end'>
        <input 
          type="button"
          class="btn btn-primary" 
          v-if='dPers.puedeBlanquear' 
          @click='keyBlank()'
          value="Blanquear clave"
        />
      </div>
			<div class='col-12'>
				<label>Dirección:</label>
				<input type='text' 
          class='form-control' 
          required 
          placeholder='Calle/Altura/Piso/Depto' 
          v-model="dPers.direccion"
        >
			</div>
      <div class="col-md-6 mb-3">
        <label>Provincia</label>
        <select
          v-model="dPers.idProvincia"
          class="form-control"
          required
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
          required
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
    <div v-if="dPers.esMenor18" class="row recuadro mt-3">
			<div class='col-12 col-md-6 form-group'>
				<label>Nombre del padre:</label>
				<input 
          required type='text' 
          class='form-control' 
          v-model="dPers.nombrePadre"
        >
			</div>
			<div class='col-12 col-md-6 form-group'>
				<label>Nº de DNI: </label>
				<input 
          required 
          type='text'
          placeholder='Ingrese sólo números' 
          class='form-control' 
          v-model="dPers.dniPadre"
        >
			</div>
			<div class='col-12 col-md-6 form-group'>
				<label>Nombre de la madre:</label>
				<input 
          required 
          type='text'
          class='form-control'  
          v-model="dPers.nombreMadre"
        >
			</div>
			<div class='col-12 col-md-6 form-group'>
				<label>Nº de DNI: </label>
				<input 
          required 
          type='text'
          placeholder='Ingrese sólo números' 
          class='form-control' 
          v-model="dPers.dniMadre"
        >
			</div>
    </div>
    <!-- ================= SALUD ================= -->
    <div class="row recuadro mt-3">

      <div class="col-12">
        <label>
          <input type="checkbox" v-model="dPers.alergias" />
          ¿Tiene alergias?
        </label>
      </div>
      <div v-if="dPers.alergias" class="col-12 mt-2">
        <textarea
          v-model="dPers.detalleAlergias"
          class="form-control"
          placeholder="Detalle alergias"
        />
      </div>
      <div class="col-12">
        <label>
          <input type="checkbox" v-model="dPers.problemaParto" />
          ¿Problemas en el parto?
        </label>
      </div>
      <div v-if="dPers.problemaParto" class="col-12 mt-2">
        <textarea
          v-model="dPers.detalleParto"
          class="form-control"
          placeholder="Detalle problemas en el parto"
        />
      </div>

    </div>

    <!-- ================= ACCIONES ================= -->
    <div class="row mt-4">
      <div class="col-12 text-end">
        <button class="btn btn-primary me-2" @click="postData">
          Guardar datos
        </button>

        <button
          v-if="admitBlank"
          class="btn btn-secondary"
          @click="keyBlank"
        >
          Enviar blanqueo
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { api } from '@/api/api'
import { showModal } from '@/services/uiBus'

/* ================= STATE ================= */
const dPers = reactive({})

const admitBlank = ref(false)

const arrProv = ref([])
const arrLocalidad = ref([])

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
const arrDays = ref(31)

const day = ref('')
const month = ref('')
const year = ref('')

/* ================= WATCHERS ================= */
watch([day, month, year], () => {
  if (day.value && month.value && year.value) {
    dPers.fechaNac = `${year.value}-${month.value}-${day.value}`
  }
})

watch(() => dPers.idProvincia, async (val) => {
  if (!val) return
  //dPers.idLocalidad = ''
  const r = await api.get({
    entity: 'localidades',
    action: 'getLocalidades',
    payload: { codigo: val }
  })
  arrLocalidad.value = r.payload ?? []
})

/* ================= METHODS ================= */
const getUsrData = async () => {
  const r = await api.get({ 
    entity: 'datospersonales',
    action: 'getDatos',
  })
  Object.assign(dPers, r.payload)

  const prov = await api.get({ entity: 'localidades', action: 'getProvincias' })
  arrProv.value = prov.payload ?? []
}

const postData = async () => {
  const ok = await showModal(
    'Confirmación',
    '¿Confirma que desea guardar la información?',
    1
  )
  if (!ok) return

  await api.post({
    entity: 'datospersonales',
    action: 'updateDatos',
    payload: dPers
  })

  await showModal('Información', 'Datos actualizados', 0)
}

const keyBlank = async () => {
  const ok = await showModal(
    '¿Confirma que desea enviar el correo de blanqueo?',
    1,
    'Confirmación',
  )
  if (!ok) return

  const r = await showModal(
    'Correo electrónico',
    2,
    'Ingrese la dirección',
    dPers.email
  )
  if (!r.ok) return
  const email = r.value
  const response = await api.post({
    entity: 'auth',
    action: 'keyBlank',
    payload: { email }
  })
  if (response.ok)  await showModal('Correo enviado')
}

/* ================= LIFECYCLE ================= */
onMounted(() => {
  const maxYear = new Date().getFullYear() - 7
  for (let i = 1930; i < maxYear; i++) arrYears.value.push(i)
  getUsrData()
})
</script>
