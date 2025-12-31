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
  <!-- Cursos disponibles -->
  <div v-if="cursosDisponibles.length">
    <div
      v-for="curso in cursosDisponibles"
      :key="curso.codigo"
      class="lista"
      style="border:1px solid white; margin:10px; padding:10px; cursor:pointer"
      @click="onSelectCurso(curso)"
    >
      <div class="col-12 col-md-6 col-lg-4">
        {{ curso.titulo }}
        <span v-if="curso.comision != 0">
          "{{ curso.comision }}"
        </span>
      </div>

      <div class="col-12 col-md-6 col-lg-4">
        <div v-for="(dia, key) in curso.dia" :key="key">
          {{ dia }} de {{ curso.horario[key][0] }} a {{ curso.horario[key][1] }},
          Sede: {{ curso.sede[key] }}
        </div>
      </div>

      <div class="col-12 col-md-6 col-lg-4">
        Prof. {{ curso.nombreProf }}
      </div>

      <div class="col-12" v-if="curso.cupoCompleto">
        (CUPO COMPLETO)
      </div>
    </div>
  </div>
  <div class="col-12 text-end">
    <button class="btn btn-primary" @click="confirmarInscripcion">
      Confirmar inscripción
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { api } from '@/api/api.js';
import { useModal } from '@/composables/useModal'
import CarrerasSelect from '../../../components/CarrerasSelect.vue';
import MateriasSelect from '../../../components/MateriasSelect.vue';
const carreras = ref([]);
const materias = ref([]);
const selectedCarrera = ref('');
const selectedMateria = ref('');
const esCondicional = ref(false);
const selectedCurso = ref('');
const cursosDisponibles = ref([]);

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
  materias.value = [];
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
  const modal = useModal()
  try {
    const r = await api.get({
      entity: 'cursos',
      action: 'listCursos',
      payload: {
        codAlC: selectedCarrera.value,
        codMC: selectedMateria.value,
      },
    });
    cursosDisponibles.value = r.payload.cursos ?? [];
    esCondicional.value = r.payload.esCondicional ?? false;
    if (esCondicional.value) modal.show({
      title: "Información",
      message: "La inscripción a esta materia se tomará como Condicional por no tener acreditadas las correlativas necesarias."
    });
  } catch (e) {
    console.log(e);
  }
};
const onSelectCurso = async () => {
  const modal = useModal()
  const ok = await modal.show('¿Confirma inscripción?', 1);
  if (!ok) return;

  const success = await api.post({
    codAlCarrera: selectedCarrera.value,
    codMC: selectedMateria.value,
    codCurso: selectedCurso.value,
    esCondicional: esCondicional.value,
  });

  if (success) {
    modal.show(
      'La inscripción ha sido realizada y ya puede visualizarse en la página de inicio'
    );
  }
}
</script>
