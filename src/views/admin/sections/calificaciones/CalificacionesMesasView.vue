<template>
  <div class="row g-3">
    <h3 class="h3cabecera">Calificaciones de mesas de examen</h3>

    <div class="row recuadro">
      <div class="col-12 col-md-6">
        <label>Año</label>
        <select class="form-control" v-model="anio" @change="listProfesores">
          <option disabled value="">Seleccione</option>
          <option v-for="y in arrAnios" :key="y" :value="y">{{ y }}</option>
        </select>
      </div>
      <div class="col-12 col-md-6" v-if="arrProf.length > 0">
        <label>Profesor</label>
        <select class="form-control" v-model="codProfesor" @change="listMesas">
          <option disabled value="">Seleccione</option>
          <option v-for="p in arrProf" :key="p.codigo" :value="p.codigo">{{ p.nombre }}</option>
        </select>
      </div>
    </div>

    <div v-if="mostrarTodo" class="col-12 text-end">
      <a @click="showAll">Mostrar todo</a>
    </div>

    <div
      v-for="(item, k) in arrMesas"
      v-show="item.show"
      :key="item.codigo + '-' + item.condicion"
      class="col-12 lista recuadro"
      style="cursor:pointer"
      @click="selMesa(k)"
    >
      <div>{{ item.nombre }} - {{ arrCondicion[item.condicion] }}</div>
      <div>{{ item.fecha }}</div>
      <div>({{ item.cantidad }} alumnos)</div>
    </div>

    <div v-for="(item, k) in arrAlumnos" :key="item.codigo" class="row lista recuadro align-items-center">
      <div class="col-12 col-md-3">
        <div>{{ item.nroDoc }}</div>
        <div>{{ item.apellido }}, {{ item.nombre }}</div>
      </div>
      <div class="col-12 col-md-3">{{ item.carrera }}</div>
      <div class="col-12 col-md-3">
        <label>Calificación:</label>
        <select class="form-control" :disabled="item.codNotaConceptual === AUSENTE" @change="updNota(k, $event.target.value)">
          <template v-if="item.esTaller">
            <option :selected="item.codNotaConceptual == null" disabled value="">Seleccione</option>
            <option value="1" :selected="item.codNotaConceptual == 1">Aprobado</option>
            <option value="2" :selected="item.codNotaConceptual == 2">Desaprobado</option>
          </template>
          <template v-else>
            <option :selected="item.notaNumerica == null" disabled value="">Seleccione</option>
            <option v-for="n in 10" :key="n" :value="n" :selected="item.notaNumerica == n">{{ n }}</option>
          </template>
        </select>
        <div class="mt-1">
          <label>
            <input type="checkbox" :checked="item.codNotaConceptual === AUSENTE" @click="toggleAusente(k, $event.target.checked)">
            Ausente
          </label>
        </div>
      </div>
      <div class="col-12 col-md-3 d-flex gap-3">
        <div><label>Libro</label><input class="form-control" style="width:60px" type="text" :value="item.libro[0]" @change="updLibro(k, 0, $event.target.value)"></div>
        <div><label>Nº</label><input class="form-control" style="width:60px" type="text" :value="item.libro[1]" @change="updLibro(k, 1, $event.target.value)"></div>
        <div><label>Acta</label><input class="form-control" style="width:60px" type="text" :value="item.libro[2]" @change="updLibro(k, 2, $event.target.value)"></div>
      </div>
    </div>

    <div v-if="arrAlumnos.length > 0" class="col-12 text-end">
      <button class="btn btn-primary" @click="postNotas">Guardar cambios</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { api } from "@/api/api"
import { showModal, showToast } from "@/services/uiBus"

const AUSENTE = 11827200

const anioActual = new Date().getFullYear()
const arrAnios = Array.from({ length: 5 }, (_, i) => anioActual - 4 + i)

const anio = ref('')
const codProfesor = ref('')
const arrProf = ref([])
const arrMesas = ref([])
const arrAlumnos = ref([])
const mostrarTodo = ref(false)
const dataMesa = ref([])
const arrCondicion = ["Regular", "Libre", "Equivalencia"]

const listProfesores = async () => {
  codProfesor.value = ''
  arrMesas.value = []
  arrAlumnos.value = []
  mostrarTodo.value = false
  const { payload } = await api.get({
    entity: 'notasmesas',
    action: 'getProfesores',
    payload: { anio: anio.value }
  })
  arrProf.value = payload ?? []
}

const listMesas = async () => {
  arrMesas.value = []
  arrAlumnos.value = []
  mostrarTodo.value = false
  const { payload } = await api.get({
    entity: 'notasmesas',
    action: 'getMesas',
    payload: { anio: anio.value, codProfesor: codProfesor.value }
  })
  arrMesas.value = (payload ?? []).map(m => ({ ...m, show: true }))
}

const selMesa = async (k) => {
  if (mostrarTodo.value) {
    showAll()
    return
  }
  const mesa = arrMesas.value[k]
  dataMesa.value = [mesa.codigo, mesa.condicion, codProfesor.value]
  mostrarTodo.value = true
  arrAlumnos.value = []
  arrMesas.value.forEach((m, i) => { m.show = i === k })
  const { payload } = await api.get({
    entity: 'notasmesas',
    action: 'getAlumnosMesa',
    payload: { codMesa: mesa.codigo, condicion: mesa.condicion }
  })
  arrAlumnos.value = payload ?? []
}

const showAll = () => {
  mostrarTodo.value = false
  arrMesas.value.forEach(m => { m.show = true })
  arrAlumnos.value = []
}

const updNota = (k, valor) => {
  const alumno = arrAlumnos.value[k]
  if (alumno.esTaller) {
    alumno.codNotaConceptual = valor ? Number(valor) : null
  } else {
    alumno.notaNumerica = valor ? Number(valor) : null
    alumno.codNotaConceptual = null
  }
}

const toggleAusente = (k, checked) => {
  const alumno = arrAlumnos.value[k]
  alumno.codNotaConceptual = checked ? AUSENTE : null
  if (!alumno.esTaller) alumno.notaNumerica = null
}

const updLibro = (k, i, valor) => {
  arrAlumnos.value[k].libro[i] = valor
}

const postNotas = async () => {
  const arrNotasAlumnos = arrAlumnos.value.filter(v =>
    (v.esTaller && v.codNotaConceptual != null) ||
    (!v.esTaller && (v.notaNumerica != null || v.codNotaConceptual != null))
  )
  if (arrNotasAlumnos.length === 0) {
    showToast('No hay ninguna calificación ingresada', 'error')
    return
  }
  const { ok } = await showModal('¿Confirma que desea guardar los cambios?', 1, 'Confirmación')
  if (!ok) return
  const r = await api.post({
    entity: 'notasmesas',
    action: 'guardarNotas',
    payload: { arrNotasAlumnos, dataMesa: dataMesa.value }
  })
  if (r.ok) {
    showToast('Datos actualizados', 'success')
    arrAlumnos.value = []
    mostrarTodo.value = true
  } else {
    showToast('No se pudieron actualizar los datos', 'error')
  }
}
</script>
