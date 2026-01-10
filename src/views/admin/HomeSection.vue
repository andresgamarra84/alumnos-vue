<template>  
  <div class="text-end">
    <input type="button" class="btn" @click="toggleDarkMode" value="Modo oscuro" />
  </div>
  <h3 class="h3cabecera">Notificaciones</h3>
  <div>
    <p v-for="item in arrNotif" :key="item.id" v-html="item.texto"></p>
  </div>
  <h3 class="h3cabecera">Trámites habilitados</h3>
  <div>
    <p v-if="arrConfig.inscrMaterias">-Inscripción a Materias.</p>
    <p v-if="arrConfig.inscrExamenes">-Inscripción a Mesas de examen.</p>
    <p v-if="arrConfig.reserva">-Reserva de vacante.</p>
    <p v-if="arrConfig.solicitudConstancia">-Solicitud de Constancia de estudiante regular.</p>
    <p v-if="arrConfig.solicitudAnalitico">-Solicitud de Analítico.</p>
  </div>
</template>

<script setup>
import { ref, onMounted, computed} from 'vue';
import { api } from '@/api/api'; // Ajusta path a tu api.js
import { showModal } from '@/services/uiBus'

//import { showModal } from '@/services/uiBus'
const arrNotif = ref([]);
const arrInscrMaterias = ref([]);
const arrConfig = ref({});
// Dark Mode Toggle
const toggleDarkMode = () => {
  document.body.classList.toggle('dark-mode');
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



onMounted(async () => {
  //const configRes = await api.get({ entity: 'config', action: 'getConfig' }); // Action 0 default
  //arrConfig.value = configRes.payload || {};
  /*await Promise.all([
    //listNotif()
  ]);*/
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