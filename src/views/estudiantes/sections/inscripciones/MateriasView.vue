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

  <div v-if="ocupaFranja" class="mt-3">
    <label class="form-label">Día disponible</label>
    <select v-model="selectedDia" class="form-select">
      <option disabled value="">Seleccione un día</option>
      <option
        v-for="dia in diasDisponibles"
        :key="dia.value ?? dia"
        :value="dia.value ?? dia"
      >
        {{ dia.label ?? dia }}
      </option>
    </select>
  </div>

  <div v-if="ocupaFranja && selectedDia && cursosDelDia.length" class="mt-4">
    <h4 class="mb-3">Horarios disponibles para {{ selectedDia }}</h4>

    <div
      v-for="(curso, k) in cursosDelDia"
      :key="`${curso.codPlHorarios}-${curso.inicio}-${k}`"
      class="lista curso-item"
      @click="onSelectCursoFranja(k)"
    >
      <div class="col-12 col-md-4">
        {{ curso.nombreProf }}
      </div>

      <div class="col-12 col-md-4">
        {{ curso.sede?.[0] ?? 'Sin sede' }}
      </div>

      <div class="col-12 col-md-4">
        Inicio: {{ curso.horario?.[0]?.[0] ?? curso.inicio }}
      </div>
    </div>
  </div>

  <!-- Cursos disponibles -->
  <div v-if="!ocupaFranja && cursosDisponibles.length">
    <div
      v-for="(curso, k) in cursosDisponibles"
      :key="curso.codPlHorarios"
      :class="['lista', 'curso-item', { 'curso-item--disabled': curso.cupoCompleto }]"
      @click="!curso.cupoCompleto && onSelectCurso(k)"
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
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { api } from '@/api/api.js';
import CarrerasSelect from '@/components/CarrerasSelect.vue';
import MateriasSelect from '@/components/MateriasSelect.vue';
import { showModal } from '@/services/uiBus';
const carreras = ref([]);
const materias = ref([]);
const selectedCarrera = ref('');
const selectedMateria = ref('');
const selectedDia = ref('');
const esCondicional = ref(false);
const ocupaFranja = ref(false);
const cursosDisponibles = ref([]);
const diasDisponibles = ref([]);
const cursosAgrupados = ref([]);

const cursosDelDia = computed(() => {
  if (!selectedDia.value) return [];

  const grupo = cursosAgrupados.value.find(
    item => item.dia === selectedDia.value
  );

  return grupo?.cursos ?? [];
});

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
  selectedDia.value = '';
  materias.value = [];
  cursosDisponibles.value = [];
  diasDisponibles.value = [];
  cursosAgrupados.value = [];
  ocupaFranja.value = false;
  const codAlC = carreras.value[selectedCarrera.value].codigo;
  try {
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
  selectedDia.value = '';
  cursosDisponibles.value = [];
  diasDisponibles.value = [];
  cursosAgrupados.value = [];
  ocupaFranja.value = false;
  const codAlC = carreras.value[selectedCarrera.value].codigo;
  try {
    const r = await api.get({
      entity: 'cursos',
      action: 'listCursosForMateria',
      payload: {
        codAlC: codAlC,
        codMC: selectedMateria.value,
        test: true
      },
    });
    ocupaFranja.value = r.payload.ocupaFranja ?? false;
    esCondicional.value = r.payload.esCondicional ?? false;

    if (ocupaFranja.value) {
      diasDisponibles.value = r.payload.diasDisponibles ?? [];
      cursosAgrupados.value = r.payload.cursosAgrupados ?? [];
      return;
    }

    cursosDisponibles.value = r.payload.cursos ?? [];
    if (esCondicional.value) showModal("La inscripción a esta materia se tomará como Condicional por no tener acreditadas las correlativas necesarias.");
  } catch (e) {
    console.log(e);
  }
};
const onSelectCurso = async (k) => {
  const curso = cursosDisponibles.value[k]
  const ok = await showModal('¿Confirma inscripción?', 1);
  if (!ok.ok) return;
  const codAlC = carreras.value[selectedCarrera.value].codigo;
  const response = await api.post({
    entity: "materias",
    action: "confirmarInscripcion",
    payload: {
      codAlCarrera: codAlC,
      codMC: selectedMateria.value,
      codPlHorarios: curso.codPlHorarios,
      //codVLibres: curso.codVLibres ?? null,
      ocupaFranja: ocupaFranja.value,
      esCondicional: esCondicional.value,
    }
  });

  if (response.ok) {
    showModal(
      'La inscripción ha sido realizada y ya puede visualizarse en la página de inicio'
    );
  }
}

const onSelectCursoFranja = async (k) => {
  const curso = cursosDelDia.value[k]
  const ok = await showModal('¿Confirma inscripción?', 1);
  if (!ok.ok) return;
  const codAlC = carreras.value[selectedCarrera.value].codigo;
  const response = await api.post({
    entity: "materias",
    action: "confirmarInscripcion",
    payload: {
      codAlCarrera: codAlC,
      codMC: selectedMateria.value,
      codPlHorarios: curso.codPlHorarios,
      //codVLibres: curso.codVLibres ?? null,
      ocupaFranja: ocupaFranja.value,
      esCondicional: esCondicional.value,
      inicio: curso.inicio,
    }
  });

  if (response.ok) {
    showModal(
      'La inscripción ha sido realizada y ya puede visualizarse en la página de inicio'
    );
  }
}
</script>

<style scoped>
.curso-item {
  border: 1px solid white;
  margin: 10px;
  padding: 10px;
  cursor: pointer;
}

.curso-item--disabled {
  cursor: not-allowed;
  opacity: 0.6;
  pointer-events: none;
}
</style>
