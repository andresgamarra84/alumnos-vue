<script setup>
import { computed } from 'vue'
import { showModal } from '@/services/uiBus'
import InfoMeta from '@/components/card/InfoMeta.vue'
const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  area: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['delete'])

const isEstudiante = computed(() => props.area === 'estudiantes')

const confirmDelete = async () => {
  const msg = isEstudiante.value
    ? 'Se borrarán TODOS los datos del estudiante. ¿Continuar?'
    : '¿Confirma que desea borrar este profesor del listado?'
  const {ok} = await showModal(msg,1)
  if (ok) {
    emit('delete')
  }
}
</script>

<template>
  <div id="personalData" class="personal-data-card">
    <!-- ESTUDIANTES -->
    <template v-if="isEstudiante">
      <InfoMeta label="Código:">{{ item.codigo }}</InfoMeta>
      <InfoMeta label="Tipo y Nº de DNI:">{{ item.tipoDoc }} {{ item.nroDoc }}</InfoMeta>
      <InfoMeta label="Nacionalidad:">{{ item.pais }}</InfoMeta>
      <InfoMeta label="E-mail:">{{ item.email }}</InfoMeta>
      <InfoMeta label="Fecha de nac.:">{{ item.fechaNac }}</InfoMeta>
      <InfoMeta label="Fecha de ingreso:">{{ item.fechaIngreso }}</InfoMeta>
      <InfoMeta label="Dirección:">{{ item.direccion }}</InfoMeta>
      <InfoMeta label="Localidad:">{{ item.localidad }}</InfoMeta>
      <InfoMeta label="Teléfono:">{{ item.telefono }}</InfoMeta>
      <InfoMeta label="Celular:">{{ item.telCelular }}</InfoMeta>
      <InfoMeta label="Último ingreso:">{{ item.lastLog }}</InfoMeta>

      <div class="personal-data-card__footer">
        <button type="button" class="card-link card-link--danger" @click="confirmDelete">
          Borrar estudiante
        </button>
      </div>
    </template>

    <!-- DOCENTES -->
    <template v-else>
      <InfoMeta label="Código:">{{ item.codigo }}</InfoMeta>
      <InfoMeta label="Usuario:">{{ item.userName }}</InfoMeta>
      <InfoMeta label="Nº de DNI:">{{ item.nroDoc }}</InfoMeta>
      <InfoMeta label="E-mail:">{{ item.email }}</InfoMeta>

      <div class="personal-data-card__footer">
        <button type="button" class="card-link card-link--danger" @click="confirmDelete">
          Borrar profesor
        </button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.personal-data-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px 18px;
  margin-top: -4px;
  margin-bottom: 20px;
  background: var(--color-fondo-secundario);
  border: 1px solid var(--color-borde);
  border-top: none;
  border-radius: 0 0 10px 10px;
  box-shadow: 0 2px 4px var(--sombra-suave);
}

.personal-data-card__footer {
  padding-top: 8px;
  border-top: 1px dashed var(--color-borde);
  text-align: right;
}
</style>
