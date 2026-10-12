<template>
  <div v-show="!showRegulares || item.inscriptoEnMaterias">
    <InfoCard
      :title="item.nombre"
      :subtitle="`${item.email} · DNI ${item.nroDoc}`"
      :badge="!item.validado ? 'Sin validar' : ''"
      badge-variant="warning"
      variant="primary"
    >
      <template #actions>
        <button type="button" class="card-link" @click="togglePersonalData">
          {{ showData ? 'Ocultar detalles' : 'Detalles' }}
        </button>
        <button type="button" class="card-link" @click="emit('open-panel', item.codigo)">
          Ingresar
        </button>
        <button
          v-if="!item.validado"
          type="button"
          class="card-link"
          @click="emit('send-key', index)"
        >
          Enviar clave
        </button>
        <button type="button" class="card-link" @click="emit('show-message', index)">
          Mensaje
        </button>
      </template>
    </InfoCard>

    <transition name="personal-data">
      <PersonalData
        v-if="showData"
        :item="item"
        :area="area"
        @delete="emit('del-user')"
      />
    </transition>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import InfoCard from '@/components/card/InfoCard.vue'
import PersonalData from '@/views/admin/components/PersonalData.vue'
const showData = ref(false)
defineProps({
  item: Object,
  index: Number,
  area: String,
  showRegulares: Boolean
})

const emit = defineEmits([
  'del-user',
  'open-panel',
  'send-key',
  'show-message'
])
const togglePersonalData = () => {
    showData.value = !showData.value;
}
</script>
<style scoped>
/* Clase para la transición de entrada */
.personal-data-enter-active, .personal-data-leave-active {
    transition: all 0.3s ease-in-out;
}
.personal-data-enter-from {
    opacity: 0;
    max-height: 0;
    transform: scaleY(0.8);
    overflow: hidden;
}
.personal-data-leave-to {
    opacity: 0;
    max-height: 0;
    transform: scaleY(0.8);
    overflow: hidden;
}
</style>
