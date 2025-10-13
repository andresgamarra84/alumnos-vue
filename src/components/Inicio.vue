<script setup>
import { ref, onMounted } from 'vue';
import { useApiClient } from '../composables/useApiClient';
import Modal from './Modal.vue';

const { get, post } = useApiClient();

// Estado para datos
const arrNotif = ref([]);
const arrConfig = ref({});
const arrInscrMaterias = ref([]);
const arrMesas = ref([]);
const arrReservas = ref([]);
const arrSolicitudes = ref([]);
const arrConstancias = ref([]);
const esAutoridad = ref(false);
const showDeleted = ref([false, false, false, false]);

// Estado para modal
const modal = ref({
  isVisible: false,
  title: '',
  message: '',
  type: 2,
});

// Mostrar modal
const showModal = (title, message, type = 2) => {
  modal.value = { isVisible: true, title, message, type };
};

// Resolver modal
const resolveModal = (result) => {
  modal.value.isVisible = false;
};

// Cargar datos iniciales
const loadData = async () => {
  try {
    // Cargar notificaciones
    const notifResponse = await get('notificaciones', 0, {});
    arrNotif.value = notifResponse.payload || [];

    // Cargar config
    const configResponse = await get('config', 0, {});
    arrConfig.value = configResponse.payload || {};

    // Cargar inscripciones a materias
    const inscrMateriasResponse = await get('inscrMaterias', 0, {});
    arrInscrMaterias.value = inscrMateriasResponse.payload || [];

    // Cargar mesas de examen
    const mesasResponse = await get('mesas', 0, {});
    arrMesas.value = mesasResponse.payload || [];

    // Cargar reservas
    const reservasResponse = await get('reservas', 0, {});
    arrReservas.value = reservasResponse.payload || [];

    // Cargar solicitudes
    const solicitudesResponse = await get('solicitudes', 0, {});
    arrSolicitudes.value = solicitudesResponse.payload || [];

    // Cargar constancias
    const constanciasResponse = await get('constancias', 0, {});
    arrConstancias.value = constanciasResponse.payload || [];

    // Determinar si es autoridad (ej. desde JWT o backend)
    const userResponse = await get('user', 0, {});
    esAutoridad.value = userResponse.payload.role === 'autoridad' || false;
  } catch (error) {
    showModal('Error', 'No se pudieron cargar los datos', 2);
  }
};

// Actualizar materia (borrar o recuperar)
const updMateria = async (key) => {
  try {
    const item = arrInscrMaterias.value[key];
    const action = item.infoCurso.deleted ? 'recuperar' : 'borrar';
    await post('updMateria', key, { action });
    await loadData(); // Recargar datos
  } catch (error) {
    showModal('Error', 'Error al actualizar inscripción', 2);
  }
};

// Actualizar mesa
const updMesa = async (key) => {
  try {
    const item = arrMesas.value[key];
    const action = item.deleted ? 'recuperar' : 'borrar';
    await post('updMesa', key, { action });
    await loadData();
  } catch (error) {
    showModal('Error', 'Error al actualizar mesa', 2);
  }
};

// Actualizar reserva
const updReserva = async (key) => {
  try {
    const item = arrReservas.value[key];
    const action = item.deleted ? 'recuperar' : 'borrar';
    await post('updReserva', key, { action });
    await loadData();
  } catch (error) {
    showModal('Error', 'Error al actualizar reserva', 2);
  }
};

// Actualizar solicitud
const updSolicitud = async (key, isConstancia = false) => {
  try {
    const action = 'borrar';
    await post(isConstancia ? 'updConstancia' : 'updSolicitud', key, { action });
    await loadData();
  } catch (error) {
    showModal('Error', 'Error al actualizar solicitud', 2);
  }
};

// Toggle deleted
const toggleDeleted = (index) => {
  showDeleted.value[index] = !showDeleted.value[index];
};

// Modo oscuro (simple implementación)
const toggleDarkMode = () => {
  document.body.classList.toggle('dark-mode');
};

// Inicializar
onMounted(() => {
  loadData();
});
</script>

<template>
  <div id="inicioPanel">
    <div class="text-end">
      <input type="button" class="btn" @click="toggleDarkMode" value="Modo oscuro">
    </div>
    <h3 class="h3cabecera">Notificaciones</h3>
    <div>
      <p v-for="item in arrNotif" :key="item.id" v-html="item.texto"></p>
    </div>
    <h3 class="h3cabecera">Trámites habilitados</h3>
    <div>
      <p v-if="arrConfig.inscrMaterias">-Para realizar inscripción a Materias ingrese en la sección "Inscripciones" -> "Materias".</p>
      <p v-if="arrConfig.inscrExamenes">-Para realizar inscripción a Examenes ingrese en la sección "Inscripciones" -> "Exámenes".</p>
      <p v-if="arrConfig.reserva">-Para realizar su Reserva de vacante ingrese en la sección "Trámites online" -> "Reserva de vacante".</p>
      <p v-if="arrConfig.solicitudConstancia">-Para realizar su solicitud de Constancia de alumno regular ingrese en la sección "Trámites online" -> "Constancia de alumno regular".</p>
      <p v-if="arrConfig.solicitudAnalitico">-Para realizar su solicitud de Analítico ingrese en la sección "Trámites online" -> "Solicitud de analítico".</p>
    </div>

    <!-- Inscripciones a Materias -->
    <div v-if="arrInscrMaterias.length > 0" class="margen-bottom">
      <h3 class="h3cabecera">Inscripciones a Materias</h3>
      <div v-for="(item, key) in arrInscrMaterias" v-if="!item.infoCurso.deleted" :key="key" class="row lista recuadro" style="padding:20px 10px;">
        <div class="col-6 col-md-3">
          <div class="titulo">{{ item.infoCurso.nombreCurso }} {{ item.infoInscripcion.esCondicional ? '(Condicional)' : '' }}</div>
          <div>({{ item.infoInscripcion.nombreCarrera }})</div>
        </div>
        <div class="col-6 col-md-2">Prof. {{ item.infoCurso.nombreProf }}</div>
        <div class="col-12 col-md-5">
          <div v-for="it in item.infoCurso.horarios" :key="it.dia">{{ it.dia }} {{ it.hora }} Aula {{ it.aula }} - Sede {{ it.sede }}</div>
        </div>
        <div class="col-6">
          Calif. 1º cuatrimestre: 
          <template v-if="item.infoInscripcion.esConceptual">{{ item.infoInscripcion.notaConceptual1 }}</template>
          <template v-else>{{ item.infoInscripcion.notaNumerica1[0] }} ({{ item.infoInscripcion.notaNumerica1[1] }})</template>
        </div>
        <div class="col-6">
          Calif. 2º cuatrimestre: 
          <template v-if="item.infoInscripcion.esConceptual">{{ item.infoInscripcion.notaConceptual2 }}</template>
          <template v-else>{{ item.infoInscripcion.notaNumerica2[0] }} ({{ item.infoInscripcion.notaNumerica2[1] }})</template>
        </div>
        <div class="col-12 text-end" v-if="arrConfig.inscrMaterias || esAutoridad">
          <a @click="updMateria(key)" style="color:var(--bs-danger);">Borrar inscripción</a>
        </div>
      </div>

      <!-- Eliminadas (para autoridad) -->
      <div class="mt-4" v-if="esAutoridad">
        <div class="text-end">
          <a @click="toggleDeleted(0)">{{ showDeleted[0] ? 'Ocultar eliminadas' : 'Mostrar eliminadas' }}</a>
        </div>
        <div v-show="showDeleted[0]">
          <div v-for="(item, key) in arrInscrMaterias" v-if="item.infoCurso.deleted" :key="key" class="row lista recuadro" style="padding:20px 10px; opacity:0.5;">
            <div class="col-6 col-md-3">
              <div class="titulo">{{ item.infoCurso.nombreCurso }} {{ item.infoInscripcion.esCondicional ? '(Condicional)' : '' }}</div>
              <div>({{ item.infoInscripcion.nombreCarrera }})</div>
            </div>
            <div class="col-6 col-md-2">Prof. {{ item.infoCurso.nombreProf }}</div>
            <div class="col-12 col-md-5">
              <div v-for="it in item.infoCurso.horarios" :key="it.dia">{{ it.dia }} {{ it.horario }} Aula {{ it.aula }} - Sede {{ it.sede }}</div>
            </div>
            <div class="col-6">
              Calif. 1º cuatrimestre: 
              <template v-if="item.infoInscripcion.esConceptual">{{ item.infoInscripcion.notaConceptual1 }}</template>
              <template v-else>{{ item.infoInscripcion.notaNumerica1[0] }} ({{ item.infoInscripcion.notaNumerica1[1] }})</template>
            </div>
            <div class="col-6">
              Calif. 2º cuatrimestre: 
              <template v-if="item.infoInscripcion.esConceptual">{{ item.infoInscripcion.notaConceptual2 }}</template>
              <template v-else>{{ item.infoInscripcion.notaNumerica2[0] }} ({{ item.infoInscripcion.notaNumerica2[1] }})</template>
            </div>
            <div class="col-12 text-end">
              <a @click="updMateria(key)">Recuperar inscripción</a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Inscripciones a Mesas de Examen -->
    <div v-if="arrMesas.length > 0" class="margen-bottom">
      <h3 class="h3cabecera">Inscripciones a Mesas de Examen</h3>
      <div v-for="(item, key) in arrMesas" v-if="!item.deleted" :key="key" class="row lista recuadro" style="padding:20px 10px;">
        <div class="col-6 col-md-3"><span class="titulo">{{ item.nombre }} {{ item.instrumento }}</span><br>({{ item.carrera }})</div>
        <div class="col-6 col-md-4">Prof. {{ item.nombreProf }}</div>
        <div class="col-12 col-md-5">{{ item.fecha }}</div>
        <div class="col-12 text-end">
          <a v-if="!item.deleted" @click="updMesa(key)" style="color:var(--bs-danger);">Borrar inscripción</a>
        </div>
      </div>
      <div class="mt-4" v-if="esAutoridad">
        <div class="text-end">
          <a @click="toggleDeleted(1)">{{ showDeleted[1] ? 'Ocultar inscripciones eliminadas' : 'Mostrar inscripciones eliminadas' }}</a>
        </div>
        <div v-show="showDeleted[1]">
          <div v-for="(item, key) in arrMesas" v-if="item.deleted" :key="key" class="row lista recuadro" style="padding:20px 10px; opacity:0.5">
            <div class="col-6 col-md-3 titulo">{{ item.nombre }} {{ item.instrumento }}</div>
            <div class="col-6 col-md-4">Prof. {{ item.nombreProf }}</div>
            <div class="col-12 col-md-5">{{ item.fecha }}</div>
            <div class="col-12 text-end">
              <a @click="updMesa(key)">Recuperar inscripción</a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Reservas de vacante -->
    <div v-if="arrReservas.length > 0" class="margen-bottom">
      <h3 class="h3cabecera">Reservas de vacante</h3>
      <div v-for="(item, key) in arrReservas" v-if="!item.deleted" :key="key" class="lista row recuadro" style="padding:20px 10px;">
        <div class="col-12 col-md-3 titulo">
          <template v-if="item.materia">{{ item.materia }}</template>
        </div>
        <div class="col-12 col-md-4">
          <template v-if="item.nombreProf"> (Prof. {{ item.nombreProf }})</template>
        </div>
        <div class="col-12 col-md-5">
          {{ item.carrera }} ({{ item.instrumento }})<template v-if="item.cambio">- ({{ item.cambio }})</template>
        </div>
        <div class="col-12 text-end">
          <a @click="updReserva(key)" style="color:var(--bs-danger);">Borrar reserva</a>
        </div>
      </div>
      <div class="mt-4" v-if="esAutoridad">
        <div class="text-end">
          <a @click="toggleDeleted(2)">{{ showDeleted[2] ? 'Ocultar eliminadas' : 'Mostrar eliminadas' }}</a>
        </div>
        <div v-show="showDeleted[2]">
          <div v-for="(item, key) in arrReservas" v-if="item.deleted" :key="key" class="lista row recuadro" style="padding:20px 10px; opacity:0.5">
            <div class="col-12 col-md-3 titulo">
              <template v-if="item.materia">{{ item.materia }}</template>
            </div>
            <div class="col-12 col-md-4">
              <template v-if="item.nombreProf"> (Prof. {{ item.nombreProf }})</template>
            </div>
            <div class="col-12 col-md-5">
              {{ item.carrera }} ({{ item.instrumento }})<template v-if="item.cambio">- ({{ item.cambio }})</template>
            </div>
            <div class="col-12 text-end">
              <a @click="updReserva(key)">Recuperar reserva</a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Solicitudes de mesa de examen -->
    <div v-if="arrSolicitudes.length > 0" class="margen-bottom">
      <h3 class="h3cabecera">Solicitudes de mesa de examen</h3>
      <div v-for="(item, key) in arrSolicitudes" v-if="!item.deleted" :key="key" class="lista row recuadro" style="padding:20px 10px;">
        <div class="col-12 col-md-5 titulo">{{ item.nombre }} ({{ item.carrera }})</div>
        <div class="col-12 col-md-5">Prof. {{ item.nombreProf }}</div>
        <div class="col-12 col-md-2 text-end">
          <a @click="updSolicitud(key)" style="color:var(--bs-danger);">Borrar solicitud</a>
        </div>
      </div>
      <div class="mt-4" v-if="esAutoridad">
        <div class="text-end">
          <a @click="toggleDeleted(3)">{{ showDeleted[3] ? 'Ocultar eliminadas' : 'Mostrar eliminadas' }}</a>
        </div>
        <div v-show="showDeleted[3]">
          <div v-for="(item, key) in arrSolicitudes" v-if="item.deleted" :key="key" class="lista row recuadro" style="padding:20px 10px; opacity:0.5;">
            <div class="col-12 col-md-5 titulo">{{ item.nombre }} ({{ item.carrera }})</div>
            <div class="col-12 col-md-5">Prof. {{ item.nombreProf }}</div>
            <div class="col-12 col-md-2 text-end">
              <a @click="updSolicitud(key)">Recuperar solicitud</a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Solicitudes de constancia -->
    <div v-if="arrConstancias.length > 0" class="margen-bottom">
      <h3 class="h3cabecera">Solicitudes de constancia</h3>
      <div v-for="(item, key) in arrConstancias" :key="key" class="lista row recuadro" style="opacity:1; padding:20px 10px;">
        <div class="col-12 col-md-5 titulo">{{ item.destino }} {{ item.dato }}</div>
        <div class="col-12 col-md-2 text-end">
          <a @click="updSolicitud(key, true)" style="color:var(--bs-danger);">Borrar solicitud</a>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <Modal
      :isVisible="modal.isVisible"
      :title="modal.title"
      :message="modal.message"
      :type="modal.type"
      @resolve="resolveModal"
    />
  </div>
</template>

<style scoped>
.h3cabecera {
  font-size: 1.5rem;
  font-weight: bold;
}
.margen-bottom {
  margin-bottom: 2rem;
}
.recuadro {
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
}
.lista {
  background-color: #f8f9fa;
}
.titulo {
  font-weight: bold;
}
.dark-mode {
  background-color: #333;
  color: #fff;
}
</style>