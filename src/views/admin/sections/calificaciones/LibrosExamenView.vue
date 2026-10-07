<template>
  <div class="row g-4">
    <h3 class="h3cabecera">Libros de examen</h3>

    <div class="row recuadro">
      <div class="col-12 col-md-4">
        <label>Libro</label>
        <select class="form-control" v-model="libroLetra" @change="listNumeros">
          <option disabled value="">Seleccione</option>
          <option v-for="(nombre, letra) in arrLetras" :key="letra" :value="letra">{{ nombre }}</option>
        </select>
      </div>
      <div class="col-12 col-md-4">
        <label>N°</label>
        <select class="form-control" v-model="libroNumero" @change="listActas">
          <option disabled value="">Seleccione</option>
          <option v-for="item in arrNumeros" :key="item" :value="item">{{ item }}</option>
        </select>
      </div>
      <div class="col-12 col-md-4">
        <label>Acta</label>
        <select class="form-control" v-model="actaNumero" @change="listDatosActa">
          <option disabled value="">Seleccione</option>
          <option v-for="item in arrActas" :key="item" :value="item">{{ item }}</option>
        </select>
      </div>
    </div>

    <div v-if="nombreMateria" class="col-12 text-center">
      <h4>{{ nombreMateria }}</h4>
    </div>

    <div v-if="arrDatosActa.length > 0" class="col-12">
      <div class="row fw-bold">
        <div class="col-md-2">N° de DNI</div>
        <div class="col-md-3">Nombre</div>
        <div class="col-md-2">Nota numérica</div>
        <div class="col-md-2">Nota conceptual</div>
        <div class="col-md-2">Foja</div>
      </div>
      <div v-for="(item, k) in arrDatosActa" :key="k" class="row lista recuadro" style="padding:10px 0; margin-bottom:10px;">
        <div class="col-md-2">{{ item.nroDoc }}</div>
        <div class="col-md-3">{{ item.apellido }}, {{ item.nombre }}</div>
        <div class="col-md-2">{{ item.notaNumerica ?? '-' }}</div>
        <div class="col-md-2">{{ item.notaConceptual ?? '-' }}</div>
        <div class="col-md-2">{{ item.foja }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { api } from "@/api/api"

const arrLetras = {
  I: "Inicial",
  CM: "Ciclo Medio",
  FMP: "FOBA promocionales",
  F: "FOBA",
  L: "FOBA Libres",
  PMP: "Profesorado promocionales",
  P: "Profesorado",
  LP: "Profesorado Libres",
  E: "Equivalencias",
  M: "Ed. Musical",
  AOL: "Acta Omitida Libres",
  AOE: "Acta Omitida Equiv",
}

const libroLetra = ref('')
const libroNumero = ref('')
const actaNumero = ref('')
const arrNumeros = ref([])
const arrActas = ref([])
const arrDatosActa = ref([])
const nombreMateria = ref('')

const listNumeros = async () => {
  libroNumero.value = ''
  actaNumero.value = ''
  arrActas.value = []
  arrDatosActa.value = []
  nombreMateria.value = ''
  const { payload } = await api.get({
    entity: 'libros',
    action: 'getNumeros',
    payload: { libroLetra: libroLetra.value }
  })
  arrNumeros.value = payload ?? []
}

const listActas = async () => {
  actaNumero.value = ''
  arrDatosActa.value = []
  nombreMateria.value = ''
  const { payload } = await api.get({
    entity: 'libros',
    action: 'getActas',
    payload: { libroLetra: libroLetra.value, libroNumero: libroNumero.value }
  })
  arrActas.value = payload ?? []
}

const listDatosActa = async () => {
  const { payload } = await api.get({
    entity: 'libros',
    action: 'getDatosActa',
    payload: {
      libroLetra: libroLetra.value,
      libroNumero: libroNumero.value,
      actaNumero: actaNumero.value,
    }
  })
  nombreMateria.value = payload?.nombreMateria ?? ''
  arrDatosActa.value = payload?.listadoAlumnos ?? []
}
</script>
