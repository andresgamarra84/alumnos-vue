<template>
  <div id="inicioPanel">
    <div class="text-end">
      <input type="button" class="btn" @click="toggleDarkMode" value="Modo oscuro" />
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
    <div v-if="arrInscrMaterias.length > 0" class="margen-bottom">
      <!-- Inscripciones a Materias -->
      <h3 class="h3cabecera">Inscripciones a Materias</h3>
      <template v-for="(item, key) in arrInscrMaterias">
        <div :key="item.infoCurso.codigo" v-if="!item.infoCurso.deleted" class="row lista recuadro" style="padding:20px 10px;">
          <div class="col-6 col-md-3">
            <div class="titulo">{{ item.infoCurso.nombreCurso }} {{ item.infoInscripcion.esCondicional ? '(Condicional)' : '' }}</div>
            <div>({{ item.infoInscripcion.nombreCarrera }})</div>
          </div>
          <div class="col-6 col-md-2">Prof. {{ item.infoCurso.nombreProf.apellido }}</div>
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
          <div class="col-12 text-end" v-if="arrConfig.inscrMaterias || esAutoridad">
            <a @click="updMateria(key)" style="color:var(--bs-danger);">Borrar inscripción</a>
          </div>
        </div>

        <!-- Eliminadas (solo autoridad) -->
        <div class="mt-4" v-if="esAutoridad">
          <div class="text-end">
            <a @click="toggleDeleted(0)">{{ showDeleted[0] ? 'Ocultar eliminadas' : 'Mostrar eliminadas' }}</a>
          </div>
          <div v-show="showDeleted[0]">
            <div v-for="(item, key) in arrInscrMaterias" :key="key" v-if="item.infoCurso.deleted" class="row lista recuadro" style="padding:20px 10px;opacity:0.5;">
              <!-- Similar estructura arriba, con Recuperar -->
              <div class="col-6 col-md-3">
                <div class="titulo">{{ item.infoCurso.nombreCurso }} {{ item.infoInscripcion.esCondicional ? '(Condicional)' : '' }}</div>
                <div>({{ item.infoInscripcion.nombreCarrera }})</div>
              </div>
              <div class="col-6 col-md-2">Prof. {{ item.infoCurso.nombreProf }}</div>
              <div class="col-12 col-md-5">
                <div v-for="it in item.infoCurso.horarios" :key="it.dia">{{ it.dia }} {{ it.horario }} Aula {{ it.aula }} - Sede {{ it.sede }}</div>
              </div>
              <!-- Notas similares -->
              <div class="col-12 text-end">
                <a @click="updMateria(key)">Recuperar inscripción</a>
              </div>
            </div>
          </div>
        </div>
    </template>
  </div>
    <!-- Mesas de Examen (similar patrón) -->
    <div v-if="arrMesas.length > 0" class="margen-bottom">
      <h3 class="h3cabecera">Inscripciones a Mesas de Examen</h3>
      <div v-for="(item, key) in arrMesas" :key="key" v-if="!item.deleted" class="row lista recuadro" style="padding:20px 10px;">
        <div class="col-6 col-md-3"><span class="titulo">{{ item.nombre }} {{ item.instrumento }}</span><br>({{ item.carrera }})</div>
        <div class="col-6 col-md-4">Prof. {{ item.nombreProf }}</div>
        <div class="col-12 col-md-5">{{ item.fecha }}</div>
        <div class="col-12 text-end">
          <a @click="updMesa(key)" style="color:var(--bs-danger);">Borrar inscripción</a>
        </div>
      </div>
      <div class="mt-4" v-if="esAutoridad">
        <div class="text-end">
          <a @click="toggleDeleted(1)">{{ showDeleted[1] ? 'Ocultar inscripciones eliminadas' : 'Mostrar inscripciones eliminadas' }}</a>
        </div>
        <div v-show="showDeleted[1]">
          <div v-for="(item, key) in arrMesas" :key="key" v-if="item.deleted" class="row lista recuadro" style="padding:20px 10px;opacity:0.5">
            <!-- Estructura similar con Recuperar -->
            <div class="col-12 text-end">
              <a @click="updMesa(key)">Recuperar inscripción</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if='arrReservas.length>0' class='margen-bottom'>
      <h3 class='h3cabecera'>Reservas de vacante</h3>
      <div v-for='(item, key) in arrReservas' v-if='!item.deleted' class='lista row recuadro' style="padding:20px 10px;">
        <div class='col-12 col-md-3 titulo'>
          <template v-if='item.materia'>{{item.materia}}</template></div>
        <div class='col-12 col-md-4'>
          <template v-if='item.nombreProf'> (Prof. {{item.nombreProf}})</template>
          
        </div>
        <div class='col-12 col-md-5'>
          {{item.carrera}} ({{item.instrumento}})<template v-if='item.cambio'>- ({{item.cambio}})</template>
        </div>
        <div class='col-12 text-end'>
          <a @click='updReserva(key)'  style='color:var(--bs-danger);'>Borrar reserva</a>
        </div>
      </div>
      <div class="mt-4" v-if='esAutoridad'>
        <div class='text-end'>
          <a @click="toggleDeleted(2)">{{ showDeleted[2] ? 'Ocultar eliminadas' : 'Mostrar eliminadas' }}</a>
        </div>
        <div v-show="showDeleted[2]">
          <div v-for='(item, key) in arrReservas' v-if='item.deleted' class='lista row recuadro' style="padding:20px 10px;opacity:0.5">
            <div class='col-12 col-md-3 titulo'>
              <template v-if='item.materia'>{{item.materia}}</template></div>
            <div class='col-12 col-md-4'>
              <template v-if='item.nombreProf'> (Prof. {{item.nombreProf}})</template>
              
            </div>
            <div class='col-12 col-md-5'>
              {{item.carrera}} ({{item.instrumento}})<template v-if='item.cambio'>- ({{item.cambio}})</template>
            </div>
            <div class='col-12 text-end'>
              <a @click='updReserva(key)'>Recuperar reserva</a>
            </div>
          </div>
        </div>
      </div>	
    </div>
    <div v-if='arrSolicitudes.length>0' class='margen-bottom'>
      <h3 class='h3cabecera'>Solicitudes de mesa de examen</h3>
      <div v-for='(item, key) in arrSolicitudes' v-if='!item.deleted' class='lista row recuadro' style="padding:20px 10px;">
        <div class='col-12 col-md-5 titulo'>{{item.nombre}} ({{item.carrera}})</div>
        <div class='col-12 col-md-5'>Prof. {{item.nombreProf}}</div>
        <div class='col-12 col-md-2 text-end'>
          <a @click='updSolicitud(key)'  style='color:var(--bs-danger);'>Borrar solicitud</a>
        </div>
      </div>
      <div class="mt-4" v-if='esAutoridad'>
        <div class='text-end'>
          <a @click="toggleDeleted(3)">{{ showDeleted[3] ? 'Ocultar eliminadas' : 'Mostrar eliminadas' }}</a>
        </div>
        <div v-show="showDeleted[3]">
          <div v-for='(item, key) in arrSolicitudes'  v-if='item.deleted' class='lista row recuadro' style="padding:20px 10px;opacity:0.5;">
            <div class='col-12 col-md-5 titulo'>{{item.nombre}} ({{item.carrera}})</div>
            <div class='col-12 col-md-5'>Prof. {{item.nombreProf}}</div>
            <div class='col-12 col-md-2 text-end'>
              <a @click='updSolicitud(key)'>Recuperar solicitud</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if='arrConstancias.length>0' class='margen-bottom'>
      <h3 class='h3cabecera'>Solicitudes de constancia</h3>
      <div v-for='(item, key) in arrConstancias' class='lista row recuadro' style='opacity:1;padding:20px 10px;'>
        <div class='col-12 col-md-5 titulo'>{{item.destino}} {{item.dato}}</div>
        <div class='col-12 col-md-2 text-end'><a v-on:click='updSolicitud(key, true)'  style='color:var(--bs-danger);'>Borrar solicitud</a></div>
      </div>
    </div>
      <!-- Reservas, Solicitudes, Constancias: Similar, abreviado por espacio -->
      <!-- ... (copia el resto del template original, ajustando @click y v-models) -->
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { api } from '../../api/api.js'; // Ajusta path a tu api.js

const arrNotif = ref([]);
const arrInscrMaterias = ref([]);
const arrCambios = ref([]);
const arrMesas = ref([]);
const arrConfig = ref({});
const arrReservas = ref([]);
const arrSolicitudes = ref([]);
const arrConstancias = ref([]);
const showDeleted = ref([false, false, false, false]);
const esAutoridad = ref(false);

// Modal placeholder (integra con Dashboard's showModal si compartido)
const showModal = (message, type = 0) => {
  // Ej: Usa parent prop o Pinia; aquí confirm simple
  return Promise.resolve(window.confirm(message));
};

// Dark Mode Toggle
const toggleDarkMode = () => {
  document.body.classList.toggle('dark-mode');
};

// Métodos adaptados con nueva API
const listMaterias = async () => {
  arrInscrMaterias.value = [];
  try {
    const r = await api.get({ entity: 'materias', action: 'getMateriasInscripto' });
    if (r.ok) {
      arrInscrMaterias.value = r.payload;
    }
  } catch (err) {
    console.error('Error listMaterias:', err);
  }
};

const listNotif = async () => {
  arrNotif.value = [];
  try {
    const r = await api.get({ entity: 'notificaciones', action: 'getAll' });
    if (r.ok) {
      r.payload.forEach(v => arrNotif.value.push(v));
    }
  } catch (err) {
    console.error('Error listNotif:', err);
  }
};

const toggleDeleted = (k = 0) => {
  showDeleted.value[k] = !showDeleted.value[k];
};

const updMateria = async (k) => {
  const item = arrInscrMaterias.value[k];
  const accion = item.infoCurso.deleted ? 'recuperar' : 'borrar';
  const confirm = await showModal(`¿Confirma que desea ${accion} esta inscripción?`, 1);
  if (confirm) {
    const d = {
      codigo: item.infoCurso.codigo,
      vLibresAl: item.infoCurso.codVlibre ?? false,
      deleted: item.infoCurso.deleted,
    };
    try {
      const r = await api.post({ entity: 'materias', action: 1, payload: d });
      if (r.ok) {
        item.infoCurso.deleted = !item.infoCurso.deleted;
      }
    } catch (err) {
      console.error('Error updMateria:', err);
    }
  }
};

const listCambios = async () => {
  arrCambios.value = [];
  try {
    const r = await api.get({ entity: 'inicio', action: 1 });
    if (r.ok) {
      r.payload.forEach(value => arrCambios.value.push(value));
    }
  } catch (err) {
    console.error('Error listCambios:', err);
  }
};

const updCambio = async (k) => {
  const confirm = await showModal('¿Confirma que desea borrar esta solicitud?', 1);
  if (confirm) {
    const otherData = arrCambios.value[k][0];
    try {
      const r = await api.post({ entity: 'cambiocatedra', action: 1, payload: otherData });
      if (r.ok) {
        arrCambios.value.splice(k, 1);
      }
    } catch (err) {
      console.error('Error updCambio:', err);
    }
  }
};

const listMesas = async () => {
  arrMesas.value = [];
  try {
    const r = await api.get({ entity: 'inicio', action: 2 });
    if (r.ok) {
      r.payload.forEach(value => arrMesas.value.push(value));
    }
  } catch (err) {
    console.error('Error listMesas:', err);
  }
};

const updMesa = async (k) => {
  const item = arrMesas.value[k];
  const accion = item.deleted ? 'recuperar' : 'borrar';
  const confirm = await showModal(`¿Confirma que desea ${accion} esta inscripción?`, 1);
  if (confirm) {
    const d = { codigo: item.codigo, deleted: item.deleted };
    try {
      const r = await api.post({ entity: 'examenes', action: 1, payload: d });
      if (r.ok) {
        item.deleted = !item.deleted;
      }
    } catch (err) {
      console.error('Error updMesa:', err);
    }
  }
};

const listReservas = async () => {
  arrReservas.value = [];
  try {
    const r = await api.get({ entity: 'inicio', action: 3 });
    if (r.ok) {
      r.payload.forEach(value => arrReservas.value.push(value));
    }
  } catch (err) {
    console.error('Error listReservas:', err);
  }
};

const updReserva = async (k) => {
  const item = arrReservas.value[k];
  const accion = item.deleted ? 'recuperar' : 'borrar';
  const confirm = await showModal(`¿Confirma que desea ${accion} esta reserva?`, 1);
  if (confirm) {
    const d = { codigo: item.codigo, deleted: item.deleted };
    try {
      const r = await api.post({ entity: 'reserva', action: 1, payload: d });
      if (r.ok) {
        item.deleted = !item.deleted;
      }
    } catch (err) {
      console.error('Error updReserva:', err);
    }
  }
};

const listSolicitudes = async () => {
  arrSolicitudes.value = [];
  arrConstancias.value = [];
  try {
    const r = await api.get({ entity: 'inicio', action: 5 });
    if (r.ok) {
      r.payload.mesa.forEach(value => arrSolicitudes.value.push(value));
      r.payload.constancia.forEach(value => arrConstancias.value.push(value));
    }
  } catch (err) {
    console.error('Error listSolicitudes:', err);
  }
};

const updSolicitud = async (k, i = false) => {
  const confirm = await showModal('¿Confirma que desea borrar esta solicitud?', 1);
  if (confirm) {
    let d;
    if (i) {
      d = { codigo: arrConstancias.value[k].codigo, deleted: false };
    } else {
      d = { codigo: arrSolicitudes.value[k].codigo, deleted: arrSolicitudes.value[k].deleted };
    }
    const entity = i ? 'constancias' : 'mesas';
    const action = i ? 8 : 1;
    try {
      const r = await api.post({ entity, action, payload: d });
      if (r.ok) {
        if (i) {
          arrConstancias.value.splice(k, 1);
        } else {
          arrSolicitudes.value[k].deleted = !arrSolicitudes.value[k].deleted;
        }
      }
    } catch (err) {
      console.error('Error updSolicitud:', err);
    }
  }
};

// setActividades (si lo necesitas, ajusta 'cargar' función)
const setActividades = (k) => {
  localStorage.setItem('actividad', arrInscrMaterias.value[k].codigo); // Asume arrMaterias = arrInscrMaterias
  // cargar('./actividades/'); // Implementa navegación o emitter
};

onMounted(async () => {
  try {
    const configRes = await api.get({ entity: 'config', action: 'getConfig' }); // Action 0 default
    arrConfig.value = configRes.payload || {};

    const authRes = await api.get({ entity: 'config', action: 'authCheck' });
    esAutoridad.value = authRes.payload || false;

    await Promise.all([
      listMaterias(),
      //listCambios(),
      //listMesas(),
      //listReservas(),
      //listSolicitudes(),
      //listNotif()
    ]);
  } catch (err) {
    console.error('Error en mounted:', err);
    // Opcional: await showModal('Error cargando datos iniciales');
  }
});
</script>

<style scoped>
.h3cabecera {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 20px;
  padding: 10px;
  text-transform: uppercase;
  border-bottom: 2px solid var(--color-acento);
  color: var(--color-texto-principal);
}
</style>