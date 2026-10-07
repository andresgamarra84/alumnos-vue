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
    <p v-if="arrConfig.inscrMaterias">-Inscripción a Materias.</p>
    <p v-if="arrConfig.inscrExamenes">-Inscripción a Mesas de examen.</p>
    <p v-if="arrConfig.reserva">-Reserva de vacante.</p>
    <p v-if="arrConfig.solicitudConstancia">-Solicitud de Constancia de estudiante regular.</p>
    <p v-if="arrConfig.solicitudAnalitico">-Solicitud de Analítico.</p>
  </div>

  <template v-if="puedeVerAusentes">
    <h3 class="h3cabecera">Docentes ausentes próximos</h3>
    <div v-if="proximosAusentes.length === 0" class="text-muted"><i>- No hay ausencias próximas -</i></div>
    <div v-else>
      <p v-for="item in proximosAusentes" :key="item.codigo">
        <strong>{{ item.nombreProfesor }}</strong> — {{ formatRangoAusente(item.desde, item.hasta) }}
      </p>
    </div>
  </template>
</template>

<script setup>
import { ref, onMounted, computed} from 'vue';
import { api } from '@/api/api'; // Ajusta path a tu api.js
import { showModal } from '@/services/uiBus'
import { usePermisos } from '@/composables/usePermisos'

//import { showModal } from '@/services/uiBus'
const { tienePermiso } = usePermisos()
const arrNotif = ref([]);
const arrInscrMaterias = ref([]);
const arrConfig = ref({});
const arrAusentes = ref([]);

const puedeVerAusentes = computed(() => tienePermiso('novedades_ausentes', 'novedades_all'))

const hoyStr = new Date().toISOString().slice(0, 10)
const proximosAusentes = computed(() =>
  arrAusentes.value
    .filter(item => (item.hasta || item.desde) >= hoyStr)
    .sort((a, b) => a.desde.localeCompare(b.desde))
    .slice(0, 5)
)

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
const toggleDarkMode = () => {
  document.body.classList.toggle('dark-mode');
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
</style>