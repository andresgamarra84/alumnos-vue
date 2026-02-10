<script setup>
import { computed } from 'vue'
import { showModal } from '@/services/uiBus'
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
    ? 'Se borrarán TODOS los datos del alumno. ¿Continuar?'
    : '¿Confirma que desea borrar este profesor del listado?'
  const {ok} = await showModal(msg,1)
  if (ok) {
    emit('delete')
  }
}
</script>

<template>
  <div
    id="personalData"
    class="shadow-sm p-3 rounded mb-4"
  >
    <!-- ESTUDIANTES -->
    <template v-if="isEstudiante">
      <div><strong>Código:</strong> {{ item.codigo }}</div>
      <div><strong>Tipo y Nº de DNI:</strong> {{ item.tipoDoc }} {{ item.nroDoc }}</div>
      <div><strong>Nacionalidad:</strong> {{ item.pais }}</div>
      <div><strong>E-mail:</strong> {{ item.email }}</div>
      <div><strong>Fecha de nac.:</strong> {{ item.fechaNac }}</div>
      <div><strong>Fecha de ingreso:</strong> {{ item.fechaIngreso }}</div>
      <div><strong>Dirección:</strong> {{ item.direccion }}</div>
      <div><strong>Localidad:</strong> {{ item.localidad }}</div>
      <div><strong>Teléfono:</strong> {{ item.telefono }}</div>
      <div><strong>Celular:</strong> {{ item.telCelular }}</div>
      <div><strong>Último ingreso:</strong> {{ item.lastLog }}</div>

      <div>
        <a
          href="#"
          class="text-danger"
          @click.prevent="confirmDelete"
        >
          Borrar alumno
        </a>
      </div>
    </template>

    <!-- DOCENTES -->
    <template v-else>
      <div><strong>Código:</strong> {{ item.codigo }}</div>
      <div><strong>Usuario:</strong> {{ item.userName }}</div>
      <div><strong>Nº de DNI:</strong> {{ item.nroDoc }}</div>
      <div><strong>E-mail:</strong> {{ item.email }}</div>

      <div>
        <a
          href="#"
          class="text-danger"
          @click.prevent="confirmDelete"
        >
          Borrar profesor
        </a>
      </div>
    </template>
  </div>
</template>
