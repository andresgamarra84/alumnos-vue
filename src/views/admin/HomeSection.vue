<template>
  <div class="home-topbar">
    <button type="button" class="dark-toggle" @click="toggleDarkMode" :title="isDark ? 'Modo claro' : 'Modo oscuro'">
      {{ isDark ? '☀️' : '🌙' }}
    </button>
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
      <span v-for="tramite in tramitesHabilitados" :key="tramite.label" class="tramite-chip">
        <span class="tramite-chip__icon" aria-hidden="true">{{ tramite.icon }}</span>
        {{ tramite.label }}
      </span>
    </div>
  </div>

  <!-- Docentes ausentes próximos -->
  <div v-if="puedeVerAusentes" class="margen-bottom">
    <SectionHeader
      title="Docentes ausentes próximos"
      :count="proximosAusentes.length"
      :collapsed="collapsedAusentes"
      @update:collapsed="collapsedAusentes = $event"
    />
    <div v-show="!collapsedAusentes">
      <div v-if="proximosAusentes.length === 0" class="text-muted"><i>- No hay ausencias próximas -</i></div>
      <InfoCardGrid v-else min-width="300px">
        <InfoCard
          v-for="item in proximosAusentes"
          :key="item.codigo"
          :title="item.nombreProfesor"
          variant="warning"
        >
          <InfoMeta icon="📅">{{ formatRangoAusente(item.desde, item.hasta) }}</InfoMeta>
        </InfoCard>
      </InfoCardGrid>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed} from 'vue';
import { api } from '@/api/api'; // Ajusta path a tu api.js
import { showModal } from '@/services/uiBus'
import { usePermisos } from '@/composables/usePermisos'
import InfoCard from '@/components/card/InfoCard.vue';
import InfoCardGrid from '@/components/card/InfoCardGrid.vue';
import InfoMeta from '@/components/card/InfoMeta.vue';
import SectionHeader from '@/components/card/SectionHeader.vue';

//import { showModal } from '@/services/uiBus'
const { tienePermiso } = usePermisos()
const arrNotif = ref([]);
const arrInscrMaterias = ref([]);
const arrConfig = ref({});
const arrAusentes = ref([]);
const collapsedAusentes = ref(false);

const puedeVerAusentes = computed(() => tienePermiso('novedades_ausentes', 'novedades_all'))

const hoyStr = new Date().toISOString().slice(0, 10)
const proximosAusentes = computed(() =>
  arrAusentes.value
    .filter(item => (item.hasta || item.desde) >= hoyStr)
    .sort((a, b) => a.desde.localeCompare(b.desde))
    .slice(0, 5)
)

// Trámites habilitados por configuración (informativo, no son links del admin)
const tramitesHabilitados = computed(() => {
  const todos = [
    { key: 'inscrMaterias', icon: '📚', label: 'Inscripción a Materias' },
    { key: 'inscrExamenes', icon: '📝', label: 'Inscripción a Mesas de examen' },
    { key: 'reserva', icon: '🎯', label: 'Reserva de vacante' },
    { key: 'solicitudConstancia', icon: '📄', label: 'Solicitud de Constancia de estudiante regular' },
    { key: 'solicitudAnalitico', icon: '🎓', label: 'Solicitud de Analítico' },
  ];
  return todos.filter(t => arrConfig.value[t.key]);
});

const formatRangoAusente = (desde, hasta) => {
  const fmt = (f) => {
    const [y, m, d] = f.split('-')
    return `${d}/${m}/${y}`
  }
  if (!hasta || hasta === desde) return fmt(desde)
  return `${fmt(desde)} - ${fmt(hasta)}`
}

const listAusentes = async () => {
  const { payload } = await api.get({ entity: 'calendario', action: 'getAusentes' })
  arrAusentes.value = payload ?? []
}
// Dark Mode Toggle
const isDark = ref(document.body.classList.contains('dark-mode'));
const toggleDarkMode = () => {
  document.body.classList.toggle('dark-mode');
  isDark.value = document.body.classList.contains('dark-mode');
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


onMounted(async () => {
  listNotificaciones()
  listAusentes()
  const { payload } = await api.get({
    entity: 'config',
    action: 'getConfig'
  })
  arrConfig.value = payload

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
.tramite-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  color: var(--color-texto-principal);
  background: var(--color-fondo-secundario);
  border: 1px solid var(--color-borde);
  border-radius: 8px;
  font-weight: 600;
}
.tramite-chip__icon { font-size: 1.1rem; }
</style>
