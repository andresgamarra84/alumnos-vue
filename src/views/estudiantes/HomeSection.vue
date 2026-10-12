<template>
  <div class="home-topbar">
    <button type="button" class="dark-toggle" @click="toggleDarkMode" :title="isDark ? 'Modo claro' : 'Modo oscuro'">
      {{ isDark ? '☀️' : '🌙' }}
    </button>
  </div>

  <!-- Resumen -->
  <div v-if="hasAnyData" class="summary-row">
    <InfoStat label="Materias" :empty="materiasVigentes.length === 0">{{ materiasVigentes.length }}</InfoStat>
    <InfoStat label="Mesas de examen" :empty="mesasVigentes.length === 0">{{ mesasVigentes.length }}</InfoStat>
    <InfoStat label="Reservas" :empty="reservasVigentes.length === 0">{{ reservasVigentes.length }}</InfoStat>
    <InfoStat label="Trámites pendientes" :empty="tramitesPendientes === 0">{{ tramitesPendientes }}</InfoStat>
  </div>

  <!-- Notificaciones -->
  <div v-if="arrNotif.length > 0" class="margen-bottom">
    <h3 class="h3cabecera">Notificaciones</h3>
    <div class="notif-banner" v-for="item in arrNotif" :key="item.codigo">
      <span class="notif-banner__icon">🔔</span>
      <p class="notif-banner__text">
        {{ item.before }}
        <a v-if="item.linkText" :href="item.link" target="_blank">{{ item.linkText }}</a>
        {{ item.after }}
      </p>
    </div>
  </div>

  <!-- Trámites habilitados -->
  <div v-if="tramitesHabilitados.length > 0" class="margen-bottom">
    <h3 class="h3cabecera">Trámites habilitados</h3>
    <div class="tramites-grid">
      <RouterLink
        v-for="tramite in tramitesHabilitados"
        :key="tramite.to"
        :to="tramite.to"
        class="tramite-btn"
      >
        <span class="tramite-btn__icon" aria-hidden="true">{{ tramite.icon }}</span>
        {{ tramite.label }}
      </RouterLink>
    </div>
  </div>

  <!-- Inscripciones a Materias -->
  <div v-if="arrInscrMaterias.length > 0" class="margen-bottom">
    <SectionHeader
      title="Inscripciones a Materias"
      :count="materiasVigentes.length"
      :collapsed="collapsed.materias"
      @update:collapsed="collapsed.materias = $event"
    />
    <div v-show="!collapsed.materias">
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
  </div>

  <!-- Mesas de Examen -->
  <div v-if="arrMesas.length > 0" class="margen-bottom">
    <SectionHeader
      title="Inscripciones a Mesas de Examen"
      :count="mesasVigentes.length"
      :collapsed="collapsed.mesas"
      @update:collapsed="collapsed.mesas = $event"
    />
    <div v-show="!collapsed.mesas">
      <InfoCardGrid>
        <InfoCard
          v-for="item in mesasVigentes"
          :key="item.codigo"
          :title="`${item.Curso} ${item.nombreInstr}`"
          :subtitle="item.nombreCarrera"
          :badge="fechaMesa(item.fecha).proxima ? 'Próximamente' : ''"
          badge-variant="warning"
          variant="success"
        >
          <template #media v-if="fechaMesa(item.fecha).valida">
            <InfoDate :top="fechaMesa(item.fecha).mes" :big="fechaMesa(item.fecha).dia" />
          </template>
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
  </div>

  <!-- Reservas de vacante -->
  <div v-if="arrReservas.length > 0" class="margen-bottom">
    <SectionHeader
      title="Reservas de vacante"
      :count="reservasVigentes.length"
      :collapsed="collapsed.reservas"
      @update:collapsed="collapsed.reservas = $event"
    />
    <div v-show="!collapsed.reservas">
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
  </div>

  <!-- Solicitudes de mesa de examen -->
  <div v-if="arrSolicitudes.length > 0" class="margen-bottom">
    <SectionHeader
      title="Solicitudes de mesa de examen"
      :count="solicitudesVigentes.length"
      :collapsed="collapsed.solicitudes"
      @update:collapsed="collapsed.solicitudes = $event"
    />
    <div v-show="!collapsed.solicitudes">
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
  </div>

  <!-- Solicitudes de constancia -->
  <div v-if="arrSolicConstancias.length > 0" class="margen-bottom">
    <SectionHeader
      title="Solicitudes de constancia"
      :count="arrSolicConstancias.length"
      :collapsed="collapsed.constancias"
      @update:collapsed="collapsed.constancias = $event"
    />
    <InfoCardGrid v-show="!collapsed.constancias">
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
import InfoDate from '@/components/card/InfoDate.vue';
import SectionHeader from '@/components/card/SectionHeader.vue';

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
const collapsed = ref({ materias: false, mesas: false, reservas: false, solicitudes: false, constancias: false });

// Dark Mode Toggle
const isDark = ref(document.body.classList.contains('dark-mode'));
const toggleDarkMode = () => {
  document.body.classList.toggle('dark-mode');
  isDark.value = document.body.classList.contains('dark-mode');
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
const solicitudesVigentes = computed(() =>
  arrSolicitudes.value.filter(i => !i.deleted)
)

const hasAnyData = computed(() =>
  arrInscrMaterias.value.length || arrMesas.value.length || arrReservas.value.length
)

const tramitesPendientes = computed(() =>
  solicitudesVigentes.value.length + arrSolicConstancias.value.length
)

// Trámites habilitados por configuración, con su ruta de acceso directo
const tramitesHabilitados = computed(() => {
  const todos = [
    { key: 'inscrMaterias', icon: '📚', label: 'Inscripción a Materias', to: '/estudiantes/inscrMaterias' },
    { key: 'inscrExamenes', icon: '📝', label: 'Inscripción a Exámenes', to: '/estudiantes/inscrExamenes' },
    { key: 'reserva', icon: '🎯', label: 'Reserva de vacante', to: '/estudiantes/reservas' },
    { key: 'solicitudConstancia', icon: '📄', label: 'Constancia de estudiante regular', to: '/estudiantes/constanciaEstudianteRegular' },
    { key: 'solicitudAnalitico', icon: '🎓', label: 'Solicitud de analítico', to: '/estudiantes/materiasAprobadas' },
  ];
  return todos.filter(t => arrConfig.value[t.key]);
});

const MESES = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];

// Interpreta una fecha "DD/MM/YYYY" (con hora opcional) para el bloque InfoDate
// y marca si está a 7 días o menos de hoy.
const fechaMesa = (fecha) => {
  const match = typeof fecha === 'string' && fecha.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (!match) return { valida: false, proxima: false, dia: '', mes: '' };
  const [, d, m, y] = match;
  const fechaObj = new Date(Number(y), Number(m) - 1, Number(d));
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const diffDias = Math.round((fechaObj - hoy) / 86400000);
  return {
    valida: true,
    proxima: diffDias >= 0 && diffDias <= 7,
    dia: d,
    mes: MESES[Number(m) - 1] ?? '',
  };
};

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

.home-topbar { display: flex; justify-content: flex-end; margin-bottom: 10px; }
.dark-toggle {
  width: 42px;
  height: 42px;
  font-size: 1.2rem;
  line-height: 1;
  background: var(--color-fondo-secundario);
  border: 1px solid var(--color-borde);
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.dark-toggle:hover { transform: scale(1.05); box-shadow: 0 2px 6px var(--sombra-hover); }

.summary-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 30px;
}

.notif-banner {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 14px 16px;
  margin-bottom: 10px;
  border-left: 4px solid var(--color-acento);
  border-radius: 8px;
}
.notif-banner__icon { font-size: 1.1rem; line-height: 1.4; }
.notif-banner__text { margin: 0; flex: 1 1 auto; }

.tramites-grid { display: flex; flex-wrap: wrap; gap: 10px; }
.tramite-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  color: var(--color-texto-principal);
  background: var(--color-fondo-secundario);
  border: 1px solid var(--color-borde);
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
}
.tramite-btn:hover {
  color: #fff;
  background: var(--color-acento);
  border-color: var(--color-acento);
  transform: translateY(-1px);
  text-decoration: none;
}
.tramite-btn__icon { font-size: 1.1rem; }
</style>
