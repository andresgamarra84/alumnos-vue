<template>
  <h3 class="h3cabecera">Inscripción a Materias</h3>

    <CarrerasSelect
    v-model="selectedCarrera"
    :carreras="carreras"
    @change="onSelectCarrera"
  />
    <MateriasSelect
    v-model="selectedMateria"
    :materias="materias"
    @change="onSelectMateria"
  />
  <!-- Mesas disponibles -->
  <div v-if="mesasDisponibles.length">
    <div
      v-for="mesa in mesasDisponibles"
      :key="mesa.codigo"
      class="lista"
      style="border:1px solid white; margin:10px; padding:10px; cursor:pointer"
      @click="onSelectMesa(mesa)"
    >
      {{ mesa.nombre }}<br />
      {{ mesa.fecha }}<br />
      Prof: {{ mesa.nombreProf }}
    </div>
  </div>

  <!-- Condición -->
  <div v-if="condicionShow" class="row" id="condicion">
    <div class="d-flex align-items-center col-12">
      <label>Seleccione la condición:</label>
      <select v-model="selectedCondicion">
        <option
          v-for="item in condiciones"
          :key="item[0]"
          :value="item[0]"
          :disabled="item[1]"
        >
          {{ item[2] }}
        </option>
      </select>
    </div>

    <div class="col-12 text-end">
      <button class="btn btn-primary" @click="confirmarInscripcion">
        Confirmar inscripción
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { api } from '@/api/api.js';
import CarrerasSelect from '../../../components/CarrerasSelect.vue';
import MateriasSelect from '../../../components/MateriasSelect.vue';
const carreras = ref([]);
const materias = ref([]);
const mesasDisponibles = ref([]);
const selectedCarrera = ref('');
const selectedMateria = ref('');
const selectedCondicion = ref(4);
const codMesa = ref(null);
const condicionShow = ref(false);

/* ---------- lifecycle ---------- */

onMounted(() => {
  getCarrerasAlumno();
});

/* ---------- handlers ---------- */
const getCarrerasAlumno = async () => {
  try {
    const r = await api.get({
      entity: 'carreras',
      action: 'getCarrerasAlumno',
    });
    carreras.value = r.payload ?? [];
  } catch (e) {
    console.log(e);
  } 
};
const onSelectCarrera = async () => {
  selectedMateria.value = '';
  codMesa.value = null;
  condicionShow.value = false;
  materias.value = [];
  mesasDisponibles.value = [];
  try {
    const r = await api.get({
      entity: 'materias',
      action: 'getMateriasCarrera',
      payload: {codigo : selectedCarrera.value},
    });
    materias.value = r.payload ?? [];
  } catch (e) {
    console.log(e);
  }
};
const onSelectMateria = async () => {
  codMesa.value = null;
  condicionShow.value = false;
  mesasDisponibles.value = [];
  try {
    const r = await api.get({
      entity: 'mesas',
      action: 'listarMesas',
      payload: {
        codAlCarrera: selectedCarrera.value,
        codMC: selectedMateria.value,
      },
    });
    mesasDisponibles.value = r.payload ?? [];
  } catch (e) {
    console.log(e);
  }
};
/*
const onSelectMesa = mesa => {
  codMesa.value = mesa.codigo;
  condicionShow.value = true;
};

const confirmarInscripcion = async () => {
  if (selectedCondicion.value === 4) {
    modal.show('Debe seleccionar una condición de examen');
    return;
  }

  const ok = await modal.show('¿Confirma inscripción?', 1);
  if (!ok) return;

  const success = await inscribirse({
    codAlCarrera: selectedCarrera.value,
    codMC: selectedMateria.value,
    codMesa: codMesa.value,
    condicion: selectedCondicion.value,
  });

  if (success) {
    modal.show(
      'La inscripción ha sido realizada y ya puede visualizarse en la página de inicio'
    );

    /* reset UI */
    /*
    selectedCarrera.value = '';
    selectedMateria.value = '';
    selectedCondicion.value = 4;
    codMesa.value = null;
    condicionShow.value = false;
    */
//  }
//;
</script>
