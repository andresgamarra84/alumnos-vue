<template>
  <h3 class="h3cabecera">Inscripcion a Materias</h3>

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
    <label class="form-label">Dia disponible</label>
    <select v-model="selectedDia" class="form-select">
      <option disabled value="">Seleccione un dia</option>
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
      v-for="(grupo, k) in cursosDelDiaPorDocente"
      :key="`${grupo.nombreProf}-${k}`"
      class="lista curso-item curso-item--franjas"
    >
      <div class="col-12 col-lg-4">
        <strong>{{ grupo.nombreProf }}</strong>
      </div>

      <div class="col-12 col-lg-8"> 
        <div class="franjas-grid">
          <button
            v-for="(curso, j) in grupo.franjas"
            :key="`${curso.codPlHorarios}-${curso.inicio}-${j}`"
            type="button"
            class="franja-chip"
            @click="onSelectCursoFranja(curso)"
          >
            <span class="franja-chip__hora">
              {{ curso.horario?.[0]?.[0] ?? curso.inicio }}
            </span>
            <span class="franja-chip__sede">
              {{ curso.sede?.[0] ?? 'Sin sede' }}
            </span>
          </button>
        </div>
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

const cursosDelDiaPorDocente = computed(() => {
  return cursosDelDia.value.reduce((acc, curso) => {
    const nombreProf = curso.nombreProf ?? 'Docente sin asignar';
    const grupoExistente = acc.find(item => item.nombreProf === nombreProf);

    if (grupoExistente) {
      grupoExistente.franjas.push(curso);
      return acc;
    }

    acc.push({
      nombreProf,
      franjas: [curso],
    });

    return acc;
  }, []);
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
      payload: { codigo: codAlC },
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
        codAlC,
        codMC: selectedMateria.value,
        test: true,
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
    if (esCondicional.value) {
      showModal('La inscripcion a esta materia se tomara como Condicional por no tener acreditadas las correlativas necesarias.');
    }
  } catch (e) {
    console.log(e);
  }
};

const onSelectCurso = async (k) => {
  const curso = cursosDisponibles.value[k];
  const ok = await showModal('Confirma inscripcion?', 1);
  if (!ok.ok) return;
  const codAlC = carreras.value[selectedCarrera.value].codigo;
  const response = await api.post({
    entity: 'materias',
    action: 'confirmarInscripcion',
    payload: {
      codAlCarrera: codAlC,
      codMC: selectedMateria.value,
      codPlHorarios: curso.codPlHorarios,
      //codVLibres: curso.codVLibres ?? null,
      ocupaFranja: ocupaFranja.value,
      esCondicional: esCondicional.value,
    },
  });

  if (response.ok) {
    showModal(
      'La inscripcion ha sido realizada y ya puede visualizarse en la pagina de inicio'
    );
  }
};

const onSelectCursoFranja = async (curso) => {
  const ok = await showModal('Confirma inscripcion?', 1);
  if (!ok.ok) return;
  const codAlC = carreras.value[selectedCarrera.value].codigo;
  const response = await api.post({
    entity: 'materias',
    action: 'confirmarInscripcion',
    payload: {
      codAlCarrera: codAlC,
      codMC: selectedMateria.value,
      codPlHorarios: curso.codPlHorarios,
      //codVLibres: curso.codVLibres ?? null,
      ocupaFranja: ocupaFranja.value,
      esCondicional: esCondicional.value,
      inicio: curso.inicio,
    },
  });

  if (response.ok) {
    showModal(
      'La inscripcion ha sido realizada y ya puede visualizarse en la pagina de inicio'
    );
  }
};
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

.curso-item--franjas {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  flex-wrap: wrap;
}

.franjas-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  width: 100%;
  min-width: 0;
}

.franja-chip {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  min-width: 130px;
  padding: 8px 10px;
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.08);
  color: inherit;
  cursor: pointer;
  text-align: left;
  max-width: 100%;
  transition: background-color 0.18s ease, border-color 0.18s ease, transform 0.18s ease, box-shadow 0.18s ease;
}

.franja-chip:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.75);
  transform: translateY(-1px);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.18);
}

.franja-chip:focus-visible {
  outline: none;
  background: rgba(255, 255, 255, 0.22);
  border-color: rgba(255, 255, 255, 0.85);
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.18);
}

.franja-chip__hora {
  font-weight: 600;
}

.franja-chip__sede {
  font-size: 0.9rem;
  opacity: 0.8;
}

@media (max-width: 767px) {
  .curso-item--franjas {
    gap: 10px;
  }

  .franja-chip {
    min-width: calc(50% - 4px);
    flex: 1 1 calc(50% - 4px);
  }
}

@media (max-width: 480px) {
  .franja-chip {
    min-width: 100%;
    flex-basis: 100%;
  }
}
</style>
