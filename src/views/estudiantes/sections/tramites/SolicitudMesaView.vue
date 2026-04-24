<template>
    <h3 class='h3cabecera'>Solicitud de mesa de examen</h3>

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
    <div class='col-12 col-md-6'>
        <label>Condición:</label>
        <select id='exCondicion'>
            <option selected disabled>Seleccione una condición</option>
            <option value='0'>Regular/Previo</option>
            <option value='1'>Libre</option>
            <option value='2'>Equivalencia</option>
        </select>
    </div>
	<div v-show='arrProf.length>0'>
		<div style='text-align:center;font-size:18px'>Seleccione el profesor para el cual solicita la mesa. Los horarios de la misma serán informados más adelante.</div>
		<div v-for='(item,key) in arrProf' v-on:click='selProf(key)' class='lista' style='border:1px solid white; margin:10px;padding:10px;'>{{item.contenido}}<br>Prof: {{item.nombreProf}}</div>
	</div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { api } from '@/api/api.js';
import { showModal } from '@/services/uiBus';
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
      payload: {
        codigo : codAlC,
        inscripcionMesa: true
      },
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
  const codAlC = carreras.value[selectedCarrera.value].codigo;
  console.log(selectedCondicion.value)
  if (selectedCondicion.value === null) {
    showModal('Debe seleccionar una condición de examen');
    return;
  }

  const c = await showModal('¿Confirma inscripción?', 1);
  if (!c.ok) return;

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
    showModal(
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
