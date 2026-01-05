<template>
  <h3 class="h3cabecera">Inscripción a Exámenes</h3>

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
  <div v-if="condicionShow" class="row">
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
import { useModal } from '@/composables/useModal.js';
import CarrerasSelect from '@/components/CarrerasSelect.vue';
import MateriasSelect from '@/components/MateriasSelect.vue';
const carreras = ref([]);
const materias = ref([]);
const mesasDisponibles = ref([]);
const selectedCarrera = ref(null);
const selectedMateria = ref('');
const selectedCondicion = ref(null);
const codMesa = ref(null);
const condicionShow = ref(false);
const condiciones = ref([]);
/* ---------- lifecycle ---------- */

onMounted(() => {
  getCarrerasAlumno();
  getCondiciones();
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
const getCondiciones = async () => {
  const r = await api.get({
    entity: "examenes",
    action: "getCondicionesExamen",
  });
  condiciones.value = r.payload ?? [];
}
const onSelectCarrera = async () => {
  selectedMateria.value = '';
  codMesa.value = null;
  condicionShow.value = false;
  materias.value = [];
  mesasDisponibles.value = [];
  try {
    const codAlC = carreras.value[selectedCarrera.value].codigo;
    const r = await api.get({
      entity: 'materias',
      action: 'getMateriasCarrera',
      payload: {codigo : codAlC},
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
    const codAlC = carreras.value[selectedCarrera.value].codigo;
    const r = await api.get({
      entity: 'mesas',
      action: 'listarMesasDisponibles',
      payload: {
        codAlCarrera: codAlC,
        codMC: selectedMateria.value,
      },
    });
    mesasDisponibles.value = r.payload ?? [];
  } catch (e) {
    console.log(e);
  }
};
const onSelectMesa = mesa => {
  codMesa.value = mesa.codigo;
  condicionShow.value = true;
};
const confirmarInscripcion = async () => {
  const modal = new useModal();
  const codAlC = carreras.value[selectedCarrera.value].codigo;
  if (!selectedCondicion.value) {
    modal.show('Debe seleccionar una condición de examen');
    return;
  }

  const ok = await modal.show('¿Confirma inscripción?', 1);
  if (!ok) return;

  const r = await api.post({
    entity: "mesas",
    action: "inscribirEnMesa",
    payload: {
      codAlC: codAlC,
      codMC: selectedMateria.value,
      codMesa: codMesa.value,
      condicion: selectedCondicion.value,
    },
  });

  if (r.ok) {
    modal.show(
      'La inscripción ha sido realizada y ya puede visualizarse en la página de inicio'
    );
  }
  selectedCarrera.value = '';
  selectedMateria.value = '';
  selectedCondicion.value = null;
  codMesa.value = null;
  condicionShow.value = false;

};
</script>
