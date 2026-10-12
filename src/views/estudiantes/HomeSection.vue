<template>  
  <div class="text-end">
    <input type="button" class="btn" @click="toggleDarkMode" value="Modo oscuro" />
  </div>
  
  <div v-if="arrNotif.length>0">
    <h3 class="h3cabecera">Notificaciones</h3>
    <p v-for="item in arrNotif" :key="item.codigo">
      {{ item.before }}
      <a v-if="item.linkText" :href="item.link" target="_blank">{{ item.linkText }}</a>
      {{ item.after }}
    </p>
  </div>
  <h3 class="h3cabecera">Trámites habilitados</h3>
  <div>
    <p v-if="arrConfig.inscrMaterias">-Para realizar inscripción a Materias ingrese en la sección "Inscripciones" -> "Materias".</p>
    <p v-if="arrConfig.inscrExamenes">-Para realizar inscripción a Examenes ingrese en la sección "Inscripciones" -> "Exámenes".</p>
    <p v-if="arrConfig.reserva">-Para realizar su Reserva de vacante ingrese en la sección "Trámites online" -> "Reserva de vacante".</p>
    <p v-if="arrConfig.solicitudConstancia">-Para realizar su solicitud de Constancia de estudiante regular ingrese en la sección "Trámites online" -> "Constancia de estudiante regular".</p>
    <p v-if="arrConfig.solicitudAnalitico">-Para realizar su solicitud de Analítico ingrese en la sección "Trámites online" -> "Solicitud de analítico".</p>
  </div>
  <!-- Inscripciones a Materias -->
  <div v-if="arrInscrMaterias.length > 0" class="margen-bottom">
    <h3 class="h3cabecera">Inscripciones a Materias</h3>
    <InfoCardGrid>
      <InfoCard
        v-for="(item, key) in materiasVigentes"
        :key="key"
        :title="item.infoCurso.nombreCurso"
        :subtitle="item.infoInscripcion.nombreCarrera"
        :badge="item.infoInscripcion.esCondicional ? 'Condicional' : ''"
        badge-variant="warning"
        variant="primary"
      >
        <InfoMeta icon="👤">Prof. {{ item.infoCurso.nombreProf.apellido }}</InfoMeta>
        <div class="chips">
          <InfoChip v-for="it in item.infoCurso.horarios" :key="it.dia">
            {{ it.dia }} {{ it.horario }}
            <template #secondary>Aula {{ it.aula }} · Sede {{ it.sede }}</template>
          </InfoChip>
        </div>
        <div class="stats">
          <InfoStat v-for="n in [1, 2]" :key="n" :label="`${n}º cuatrimestre`" :empty="!nota(item, n).valor">
            {{ nota(item, n).valor }}
            <template #caption v-if="nota(item, n).detalle">{{ nota(item, n).detalle }}</template>
          </InfoStat>
        </div>
        <template #actions v-if="arrConfig.inscrMaterias || esAutoridad">
          <button type="button" class="card-link card-link--danger" @click="updMateria(item)">Borrar inscripción</button>
        </template>
      </InfoCard>
    </InfoCardGrid>

    <!-- Eliminadas (solo autoridad) -->
    <div v-if="materiasBorradas.length > 0">
      <div class="text-end">
        <a @click="toggleDeleted(0)">{{ showDeleted[0] ? 'Ocultar eliminadas' : 'Mostrar eliminadas' }}</a>
      </div>
      <InfoCardGrid v-show="showDeleted[0]">
        <InfoCard
          v-for="(item, key) in materiasBorradas"
          :key="key"
          :title="item.infoCurso.nombreCurso"
          :subtitle="item.infoInscripcion.nombreCarrera"
          :badge="item.infoInscripcion.esCondicional ? 'Condicional' : ''"
          badge-variant="warning"
          variant="neutral"
          muted
        >
          <InfoMeta icon="👤">Prof. {{ item.infoCurso.nombreProf.apellido }}</InfoMeta>
          <template #actions>
            <button type="button" class="card-link" @click="updMateria(item)">Recuperar inscripción</button>
          </template>
        </InfoCard>
      </InfoCardGrid>
    </div>
  </div>

  <!-- Mesas de Examen -->
  <div v-if="arrMesas.length > 0" class="margen-bottom">
    <h3 class="h3cabecera">Inscripciones a Mesas de Examen</h3>
    <InfoCardGrid>
      <InfoCard
        v-for="item in mesasVigentes"
        :key="item.codigo"
        :title="`${item.Curso} ${item.nombreInstr}`"
        :subtitle="item.nombreCarrera"
        variant="success"
      >
        <InfoMeta icon="📅">{{ item.fecha }}</InfoMeta>
        <InfoMeta icon="👤">Prof. {{ item.nombreProf }}</InfoMeta>
        <template #actions>
          <button type="button" class="card-link card-link--danger" @click="updMesa(item)">Borrar inscripción</button>
        </template>
      </InfoCard>
    </InfoCardGrid>
    <div v-if="mesasBorradas.length > 0">
      <div class="text-end">
        <a @click="toggleDeleted(1)">{{ showDeleted[1] ? 'Ocultar inscripciones eliminadas' : 'Mostrar inscripciones eliminadas' }}</a>
      </div>
      <InfoCardGrid v-show="showDeleted[1]">
        <InfoCard
          v-for="item in mesasBorradas"
          :key="item.codigo"
          :title="`${item.Curso} ${item.nombreInstr}`"
          :subtitle="item.nombreCarrera"
          variant="neutral"
          muted
        >
          <InfoMeta icon="📅">{{ item.fecha }}</InfoMeta>
          <InfoMeta icon="👤">Prof. {{ item.nombreProf }}</InfoMeta>
          <template #actions>
            <button type="button" class="card-link" @click="updMesa(item)">Recuperar inscripción</button>
          </template>
        </InfoCard>
      </InfoCardGrid>
    </div>
  </div>

  <!-- Reservas de vacante -->
  <div v-if="arrReservas.length > 0" class="margen-bottom">
    <h3 class="h3cabecera">Reservas de vacante</h3>
    <InfoCardGrid>
      <InfoCard
        v-for="item in reservasVigentes"
        :key="item.codigo"
        :title="item.materia"
        :subtitle="`${item.carrera} (${item.instrumento})`"
        :badge="item.leyenda"
        variant="info"
      >
        <InfoMeta v-if="item.nombreProf" icon="👤">{{ item.nombreProf }}</InfoMeta>
        <template #actions>
          <button type="button" class="card-link card-link--danger" @click="updReserva(item)">Borrar reserva</button>
        </template>
      </InfoCard>
    </InfoCardGrid>
    <div v-if="reservasBorradas.length > 0">
      <div class="text-end">
        <a @click="toggleDeleted(2)">{{ showDeleted[2] ? 'Ocultar eliminadas' : 'Mostrar eliminadas' }}</a>
      </div>
      <InfoCardGrid v-show="showDeleted[2]">
        <InfoCard
          v-for="item in reservasBorradas"
          :key="item.codigo"
          :title="item.materia"
          :subtitle="`${item.carrera} (${item.instrumento})`"
          :badge="item.cambio"
          variant="neutral"
          muted
        >
          <InfoMeta v-if="item.nombreProf" icon="👤">{{ item.nombreProf }}</InfoMeta>
          <template #actions>
            <button type="button" class="card-link" @click="updReserva(item)">Recuperar reserva</button>
          </template>
        </InfoCard>
      </InfoCardGrid>
    </div>
  </div>

  <!-- Solicitudes de mesa de examen -->
  <div v-if="arrSolicitudes.length > 0" class="margen-bottom">
    <h3 class="h3cabecera">Solicitudes de mesa de examen</h3>
    <InfoCardGrid>
      <template v-for="(item, key) in arrSolicitudes" :key="item.codigo ?? key">
        <InfoCard v-if="!item.deleted" :title="item.nombre" :subtitle="item.carrera" variant="warning">
          <InfoMeta icon="👤">Prof. {{ item.nombreProf }}</InfoMeta>
          <template #actions>
            <button type="button" class="card-link card-link--danger" @click="updSolicitud(key)">Borrar solicitud</button>
          </template>
        </InfoCard>
      </template>
    </InfoCardGrid>
    <div v-if="esAutoridad">
      <div class="text-end">
        <a @click="toggleDeleted(3)">{{ showDeleted[3] ? 'Ocultar eliminadas' : 'Mostrar eliminadas' }}</a>
      </div>
      <InfoCardGrid v-show="showDeleted[3]">
        <template v-for="(item, key) in arrSolicitudes" :key="item.codigo ?? key">
          <InfoCard v-if="item.deleted" :title="item.nombre" :subtitle="item.carrera" variant="neutral" muted>
            <InfoMeta icon="👤">Prof. {{ item.nombreProf }}</InfoMeta>
            <template #actions>
              <button type="button" class="card-link" @click="updSolicitud(key)">Recuperar solicitud</button>
            </template>
          </InfoCard>
        </template>
      </InfoCardGrid>
    </div>
  </div>

  <!-- Solicitudes de constancia -->
  <div v-if="arrSolicConstancias.length > 0" class="margen-bottom">
    <h3 class="h3cabecera">Solicitudes de constancia</h3>
    <InfoCardGrid>
      <InfoCard
        v-for="(item, key) in arrSolicConstancias"
        :key="item.codigo ?? key"
        :title="`${item.destino} ${item.info ?? ''}`"
        variant="info"
      >
        <template #actions>
          <button type="button" class="card-link card-link--danger" @click="updSolicitud(key, true)">Borrar solicitud</button>
        </template>
      </InfoCard>
    </InfoCardGrid>
  </div>
</template>

<script setup>
import { ref, onMounted, computed} from 'vue';
import { api } from '../../api/api.js'; // Ajusta path a tu api.js
import { showModal, showToast } from '@/services/uiBus'
import InfoCard from '@/components/card/InfoCard.vue';
import InfoCardGrid from '@/components/card/InfoCardGrid.vue';
import InfoMeta from '@/components/card/InfoMeta.vue';
import InfoChip from '@/components/card/InfoChip.vue';
import InfoStat from '@/components/card/InfoStat.vue';
const arrNotif = ref([]);
const arrInscrMaterias = ref([]);
const arrCambios = ref([]);
const arrMesas = ref([]);
const arrConfig = ref({});
const arrReservas = ref([]);
const arrSolicitudes = ref([]);
const arrSolicConstancias = ref([]);
const showDeleted = ref([false, false, false, false]);
const esAutoridad = ref(true);
// Dark Mode Toggle
const toggleDarkMode = () => {
  document.body.classList.toggle('dark-mode');
};

// Métodos adaptados con nueva API
const getInscripcionesMaterias = async () => {
  arrInscrMaterias.value = [];
  try {
    const r = await api.get({ entity: 'materias', action: 'getInscripcionesMaterias' });
    if (r.ok) {
      arrInscrMaterias.value = r.payload;
    }
  } catch (err) {
    console.error('Error listMaterias:', err);
  }
};
const materiasVigentes = computed(() =>
  arrInscrMaterias.value.filter(i => !i.infoCurso.deleted)
)

const materiasBorradas = computed(() =>
  arrInscrMaterias.value.filter(i => i.infoCurso.deleted)
)
const mesasVigentes = computed(() =>
  arrMesas.value.filter(i => !i.deleted)
)
const mesasBorradas = computed(() =>
  arrMesas.value.filter(i => i.deleted)
)
const reservasVigentes = computed(() =>
  arrReservas.value.filter(i => !i.deleted)
)
const reservasBorradas = computed(() =>
  arrReservas.value.filter(i => i.deleted)
)
const listNotificaciones = async () => {
  const r = await api.get({ entity: 'notificaciones', action: 'getAll' });
  let notif = r.payload
  arrNotif.value = notif.map(a => {
    const match = a.texto.match(/\{\{(.*?)\}\}/)
    if (!match) return { ...a, before: a.texto }
    const [full, linkText] = match
    const [before, after] = a.texto.split(full)
    return {
      ...a,
      before,
      linkText,
      after,
    }
  })
  console.log(arrNotif.value)
};

const showGlobalMessages = async () => {
  const r = await api.get({ entity: 'mensajes', action: 'getGlobalMsg' });
  for (const item of r.payload) {
    if (!item?.mensaje) continue;
    showToast(item.mensaje, 'info');
  }
};

// Nota de un cuatrimestre: { valor, detalle } según sea conceptual o numérica
const nota = (item, n) => {
  const insc = item.infoInscripcion;
  if (insc.esConceptual) return { valor: insc[`notaConceptual${n}`], detalle: '' };
  const [valor, detalle] = insc[`notaNumerica${n}`] ?? [];
  return { valor, detalle };
};

const toggleDeleted = (k = 0) => {
  showDeleted.value[k] = !showDeleted.value[k];
};

const updMateria = async (item) => {
  const accion = item.infoCurso.deleted ? 'recuperar' : 'borrar';
  const confirm = await showModal(`¿Confirma que desea ${accion} esta inscripción?`, 1);
  if (confirm.ok) {
    const d = {
      codigo: item.infoCurso.codigo,
      vLibresAl: item.infoCurso.codVlibre ?? false,
      deleted: item.infoCurso.deleted,
    };
    
    const r = await api.post({ entity: 'materias', action: "updateInscripcion", payload: d });
    if (r.ok) {
      item.infoCurso.deleted = !item.infoCurso.deleted;
    }
  }
};

const listCambios = async () => {
  arrCambios.value = [];
  const r = await api.get({ entity: 'inicio', action: 1 });
  if (r.ok) {
    r.payload.forEach(value => arrCambios.value.push(value));
  }
};

const updCambio = async (k) => {
  const { ok: confirm } = await showModal('¿Confirma que desea borrar esta solicitud?', 1);
  if (confirm) {
    const otherData = arrCambios.value[k][0];
    const r = await api.post({ entity: 'cambiocatedra', action: 1, payload: otherData });
    if (r.ok) {
      arrCambios.value.splice(k, 1);
    }
  }
};

const getInscripcionesMesas = async () => {
  const r = await api.get({ entity: 'mesas', action: 'getInscripcionesMesas' });
  arrMesas.value = r.payload;
};

const updMesa = async (item) => {
  const accion = item.deleted ? 'recuperar' : 'borrar';
  const { ok: confirm } = await showModal(`¿Confirma que desea ${accion} esta inscripción?`, 1);
  if (confirm) {
    const d = { codigo: item.codigo, deleted: item.deleted };
    const r = await api.post({ entity: 'mesas', action: 'updateInscripcion', payload: d });
    if (r.ok) {
      item.deleted = !item.deleted;
    }
  }
};

const listReservas = async () => {
  arrReservas.value = [];
  const r = await api.get({ entity: 'reservas', action: 'listReservas' });
  if (r.ok) {
    r.payload.forEach(value => arrReservas.value.push(value));
  }
};

const updReserva = async (item) => {
  const accion = item.deleted ? 'recuperar' : 'borrar';
  const { ok: confirm } = await showModal(`¿Confirma que desea ${accion} esta reserva?`, 1);
  if (confirm) {
    const d = { codigo: item.codigo, deleted: item.deleted };
    const r = await api.post({ 
      entity: 'reservas', 
      action: 'updReserva', 
      payload: d 
    });
    if (r.ok) {
      item.deleted = !item.deleted;
    }
  }
};

const listSolicitudes = async () => {
  //arrSolicitudes.value = [];
  arrSolicConstancias.value = [];
  const r = await api.get({ 
    entity: 'constancias', 
    action: 'getSolicitudes', 
  });
  arrSolicConstancias.value = r.payload
};

const updSolicitud = async (k, i = false) => {
  const c = await showModal('¿Confirma que desea borrar esta solicitud?', 1);
  if (c.ok) {
    let d = {}
    if (i) {
      d = { codigo: arrSolicConstancias.value[k].codigo, deleted: false };
    } else {
      d = { codigo: arrSolicitudes.value[k].codigo, deleted: arrSolicitudes.value[k].deleted };
    }
    const entity = i ? 'constancias' : 'mesas'
    const action = "updSolicitud"
    
    const r = await api.post({ entity: entity, action: action, payload: d });
    if (r.ok) {
      if (i) {
        arrSolicConstancias.value.splice(k, 1);
      } else {
        arrSolicitudes.value[k].deleted = !arrSolicitudes.value[k].deleted;
      }
    }
  }
}

onMounted(async () => {
  const configRes = await api.get({ entity: 'config', action: 'getConfig' }); // Action 0 default
  arrConfig.value = configRes.payload || {};
  /*const authRes = await api.get({ entity: 'config', action: 'authCheck' });
  esAutoridad.value = authRes.payload || false;*/ 
  await Promise.all([
    getInscripcionesMaterias(),
    //listCambios(),
    getInscripcionesMesas(),
    listReservas(),
    listSolicitudes(),
    listNotificaciones()
  ]);
  await showGlobalMessages();
});
</script>

<style scoped>
.chips { display: flex; flex-wrap: wrap; gap: 6px; }
.stats { display: flex; gap: 10px; }
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
