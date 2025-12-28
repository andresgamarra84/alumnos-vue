<template>
  <div id="mesasExamen">
    <h3 class="h3cabecera">Inscripción a Exámenes</h3>

    <!-- Carrera -->
    <div v-if="carreras.length">
      <label>Carrera:</label>
      <select v-model="selectedCarrera" @change="onSelectCarrera">
        <option disabled value="">Seleccione una carrera</option>
        <option
          v-for="item in carreras"
          :key="item.codigo"
          :value="item.codigo"
          :disabled="item.esFinalizada"
        >
          {{ item.carrera.nombre }} - {{ item.instrumento.nombre }}
        </option>
      </select>
    </div>

    <!-- Materia -->
    <div v-if="materias.length">
      <label>Materia:</label>
      <select v-model="selectedMateria" @change="onSelectMateria">
        <option disabled value="">Seleccione una materia</option>
        <option
          v-for="item in materias"
          :key="item.codigo"
          :value="item.codigo"
          :disabled="item.disabled"
        >
          {{ item.nombre }}
        </option>
      </select>
    </div>

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

    <!-- Estados -->
    <div v-if="loading" class="mt-3">
      Cargando…
    </div>

    <div v-if="error" class="mt-3 text-danger">
      Ocurrió un error al cargar los datos
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useMesasExamen } from '@/composables/useMesas';

/* ---------- composable ---------- */

const {
  carreras,
  materias,
  mesasDisponibles,
  condiciones,
  loading,
  error,
  loadInicial,
  loadMaterias,
  loadMesas,
  inscribirse,
} = useMesasExamen();

/* ---------- UI state ---------- */

const selectedCarrera = ref('');
const selectedMateria = ref('');
const selectedCondicion = ref(4);
const codMesa = ref(null);
const condicionShow = ref(false);

/* ---------- lifecycle ---------- */

onMounted(() => {
  loadInicial();
});

/* ---------- handlers ---------- */

const onSelectCarrera = () => {
  selectedMateria.value = '';
  codMesa.value = null;
  condicionShow.value = false;

  loadMaterias(selectedCarrera.value);
};

const onSelectMateria = () => {
  codMesa.value = null;
  condicionShow.value = false;

  loadMesas(selectedCarrera.value, selectedMateria.value);
};

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
    selectedCarrera.value = '';
    selectedMateria.value = '';
    selectedCondicion.value = 4;
    codMesa.value = null;
    condicionShow.value = false;
  }
};
</script>
