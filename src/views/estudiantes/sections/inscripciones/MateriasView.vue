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

    <InfoCardGrid min-width="420px">
      <InfoCard
        v-for="(grupo, k) in cursosDelDiaPorDocente"
        :key="`${grupo.nombreProf}-${k}`"
        :title="grupo.nombreProf"
        variant="primary"
      >
        <div class="franjas">
          <InfoChip
            v-for="(curso, j) in grupo.franjas"
            :key="`${curso.codPlHorarios}-${curso.inicio}-${j}`"
            clickable
            @click="onSelectCursoFranja(curso)"
          >
            {{ curso.horario?.[0]?.[0] ?? curso.inicio }}
            <template #secondary>{{ curso.sede?.[0] ?? 'Sin sede' }}</template>
          </InfoChip>
        </div>
      </InfoCard>
    </InfoCardGrid>
  </div>

  <!-- Cursos disponibles -->
  <InfoCardGrid v-if="!ocupaFranja && cursosDisponibles.length">
    <InfoCard
      v-for="(curso, k) in cursosDisponibles"
      :key="curso.codPlHorarios"
      :title="curso.comision != 0 ? `${curso.titulo} &quot;${curso.comision}&quot;` : curso.titulo"
      :badge="curso.cupoCompleto ? 'Cupo completo' : ''"
      badge-variant="danger"
      variant="primary"
      interactive
      :disabled="curso.cupoCompleto"
      @select="onSelectCurso(k)"
    >
      <InfoMeta><template #icon><User /></template>Prof. {{ curso.nombreProf }}</InfoMeta>
      <div class="franjas">
        <InfoChip v-for="(dia, key) in curso.dia" :key="key">
          {{ dia }} {{ curso.horario[key][0] }} a {{ curso.horario[key][1] }}
          <template #secondary>Sede {{ curso.sede[key] }}</template>
        </InfoChip>
      </div>
    </InfoCard>
  </InfoCardGrid>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { api } from '@/api/api.js';
import CarrerasSelect from '@/components/CarrerasSelect.vue';
import MateriasSelect from '@/components/MateriasSelect.vue';
import { showModal, showToast } from '@/services/uiBus';
import InfoCard from '@/components/card/InfoCard.vue';
import InfoCardGrid from '@/components/card/InfoCardGrid.vue';
import InfoChip from '@/components/card/InfoChip.vue';
import InfoMeta from '@/components/card/InfoMeta.vue';
import { User } from '@lucide/vue';
import { useCicloLectivo } from '@/composables/useCicloLectivo';

const { cargarCiclos, payloadCiclo } = useCicloLectivo();

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
  cargarCiclos(); // el admin ($master) inscribe sobre el ciclo elegido en el inicio
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
      payload: { codigo: codAlC, ...payloadCiclo() },
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
        ...payloadCiclo(),
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
      showToast('La inscripcion a esta materia se tomara como Condicional por no tener acreditadas las correlativas necesarias.', 'info');
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
      ...payloadCiclo(),
    },
  });

  if (response.ok) {
    showToast(
      'La inscripcion ha sido realizada y ya puede visualizarse en la pagina de inicio',
      'success'
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
      ...payloadCiclo(),
    },
  });

  if (response.ok) {
    showToast(
      'La inscripcion ha sido realizada y ya puede visualizarse en la pagina de inicio',
      'success'
    );
  }
};
</script>

<style scoped>
.franjas { display: flex; flex-wrap: wrap; gap: 8px; }
</style>
