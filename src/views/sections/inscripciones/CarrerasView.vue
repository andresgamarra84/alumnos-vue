<template>
  <!-- Título Principal -->
  <div class="col-12">
    <h3 class="h3cabecera">Inscripción a Carreras</h3>
  </div>

  <!-- Selector de Carrera -->
  <div class="col-12 col-md-6">
    <div class="col-12 p-3">
      <CarrerasSelect
        v-model="selectedIndexCarrera"
        :carreras="carreras"
      />
    </div>
  </div>

  <!-- Selector de Instrumento -->
  <div class="col-12 col-md-6">
    <InstrumentosSelect
        v-model="selectedInstrumento"
        :instrumentos="arrInstrumentos"
    />
  </div>

  <!-- Opciones y Botón de Confirmar -->
  <div class="col-12 d-flex flex-row justify-content-around align-items-center">
    <div>
        <input 
            type="checkbox" 
            v-model="esEspera" 
            :true-value="1"
            :false-value="0"
        />
        <label for="espera">Lista de Espera</label>
    </div>
    <div>
        <input 
            type="checkbox" 
            v-model="esCondicional"
            :true-value="1"
            :false-value="0"
        />
        <label for="condicional">Condicional</label>
    </div>
    <input
      type="button"
      class="btn btn-accent"
      @click="addCarrera()"
      value="Confirmar Inscripción"
    />
  </div>

  <!-- Título de Lista -->
  <div class="col-12">
    <h3 class="h3cabecera">Lista de carreras</h3>
  </div>

  <!-- Lista de Carreras -->
  <div
    v-for="(item, k) in carrerasAlumno"
    class="col-12 row carrera-item"
    style="margin: 20px 0;"
  >
    <div class="col-6 col-md-4 titulo">{{ item.nombre }}</div>
    <div class="col-6 col-md-4" @click="update(3, k)">
      {{ item.fechaIngreso }}
    </div>
    <div class="col-12 col-md-4 d-flex justify-content-around">
      <a v-if="item.estado == 0" @click="update(2, k)">Bloquear</a>
      <a v-else v-on:click="update(0, k)">Desbloquear</a>
      <a v-on:click="update(1, k)">Borrar</a>
    </div>

    <!-- Opciones Adicionales -->
    <div class="col-12">
      <input
        type="checkbox"
        v-model ="item.esEspera"
        v-on:click="update(7, k)"
      />
      <label>Lista de Espera</label>
    </div>
    <div class="col-12">
      <input
        type="checkbox"
        v-model="item.esCondicional"
        v-on:click="update(8, k)"
      />
      <label>Condicional</label>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { api } from '@/api/api.js';
import CarrerasSelect from '@/components/CarrerasSelect.vue';
import InstrumentosSelect from '@/components/InstrumentosSelect.vue';
import { showModal } from '@/services/uiBus'
const carreras = ref([]);
const arrInstrumentos = ref([]);
const carrerasAlumno = ref([]);
const esEspera = ref(false);
const esCondicional = ref(false);
const selectedIndexCarrera = ref(null);
const selectedInstrumento = ref(null);
onMounted(() => {
    listCarrerasAlumno();
    listCarreras();
    listInstrumentos();
});
const listCarrerasAlumno = async () => {
    const r = await api.get({
        entity:"carreras",
        action: "getCarrerasAlumno"
    })
    carrerasAlumno.value = r.payload;
};
const listCarreras = async () => {
    const r = await api.get({
        entity:"carreras",
        action: "getCarreras"
    })
    carreras.value = r.payload;
};
const listInstrumentos = async () => {
    const r = await api.get({
        entity:"instrumentos",
        action: "getInstrumentos"
    })
    arrInstrumentos.value = r.payload;
};
const addCarrera = async () => {
    const r = api.post({
        entity: "carreras",
        action: "addCarrera",
        payload: {
            codCarrera: carreras.value[selectedIndexCarrera.value].codigo,
            codInstrumento: selectedInstrumento.value,
            esEspera: esEspera.value,
            esCondicional: esCondicional.value
        }
    });
    if (r.ok) {
        showModal("Datos actualizados");
        listCarrerasAlumno();
    }
}
const update = async (tipo, k) => {
    let mensaje;
    let respuesta = "No se pudo actualizar la fecha";
    let tipoModal = 1;
    
    switch (tipo) {
        case 0:
            mensaje = "¿Confirma que desea rehabilitar esta carrera?";
            respuesta = "No se pudo rehabilitar la carrera";
            break;
        case 1:
            mensaje = "¿Confirma que desea borrar esta carrera?";
            respuesta = "No se pudo borrar la carrera";
            break;
        case 2:
            mensaje = "¿Confirma que desea bloquear esta carrera?";
            respuesta = "No se pudo bloquear la carrera";
            break;
        case 3:
            tipoModal = 2;
            mensaje = "Ingrese la nueva fecha con formato DD/MM/YYYY";
        break;
        case 7:
        case 8:
            mensaje = "¿Confirma que desea actualizar los datos?";
            respuesta = "No se pudo actualizar la información";
            break;
    }
    const r = await showModal(mensaje, tipoModal)
    
    if (r.ok) {
        let v = null;
        if (tipo==3 && r == "") {
            showModal("El campo no puede quedar vacío");
            return;
        }
        if (tipo === 7) v = carrerasAlumno.value[k].esEspera
        if (tipo === 8) v = carrerasAlumno.value[k].esCondicional
        if (tipo === 3) v = r.value;
        const d = {tipo:tipo, codAlC:carrerasAlumno.value[k].codigo, valor:v};
        const response = await api.post({
            entity: "carreras",
            action: "updateCarreraAlumno",
            payload: d,
        });
        if (response.ok) {
            showModal("Datos actualizados");
        }
        listCarrerasAlumno();
    }
}
</script>