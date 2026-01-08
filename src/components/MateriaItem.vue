<template>
  <div class="row lista delimitador">

    <div class="col-md-3">
      {{ materia.nombres?.nombre }}
    </div>

    <template v-if="materia.esAprobada">
      <div class="col-md-2">
        Nota:
        {{ materia.infoExamen.notanumerica || 'Aprobado' }}
      </div>

      <div class="col-md-2">
        {{ materia.infoExamen.fechaexamen }}
      </div>

      <div class="col-md-3">
        {{ materia.infoExamen.nombreinstitucion }}
      </div>

      <div class="col-md-2">
        <a @click="del(materia.infoExamen.codigo)">Borrar examen</a>
      </div>
    </template>

    <template v-else>
      <div class="col-md-9">
        <a @click="modo = 'nuevo'">Agregar examen</a>
      </div>
    </template>

    <ExamenForm
      v-if="modo === 'nuevo'"
      :materia="materia"
      :codAlC="codAlC"
      @cancel="modo = null"
      @saved="saved"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ExamenForm from './ExamenForm.vue'
import { showModal } from '@/services/uiBus'
import { api } from '@/api/api'
const props = defineProps({
  materia: Object,
  codAlC: Number,
});

const emit = defineEmits(['reload']);

const modo = ref(null);
const del = async (codigo) => {
  const ok = await showModal("¿Confirma que desea borrar este examen?", 1, "Atención")
  if (!ok) return
  const r = await api.post({
    entity: "examenes",
    action: "deleteExamen",
    payload: {
      codExamen: codigo,
    }
  })
  if (r.ok) saved();
}
const saved = () => {
  modo.value = null;
  emit('reload');
};
</script>
