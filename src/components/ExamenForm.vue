<template>
  <fieldset class="form-container">
    <legend>Nuevo examen</legend>

    <input v-model="form.nota" type="number" placeholder="Nota" />
    <label>Nota conceptual:</label>
    <select id="concepto" class="select-field" v-model="form.concepto">
      <option disabled selected>Seleccione</option>
      <option value="aprobado">Aprobado</option>
      <option value="desaprobado">Desaprobado</option>
      <option value="ausente">Ausente</option>
    </select>
    
    <label>Condición:</label>
    <select v-model='form.condicion' class="select-field">
      <option v-for="item in arrCond" :value="item[0]">
        {{ item[1] }}
      </option>
    </select>
    <label>Fecha de examen:</label>
    <input v-model="form.fecha" type="date" />
    <label>Institución:</label>
    <select v-model="form.inst">
      <option v-for="i in arrInst" :key="i.codigo" :value="i.codigo">
        {{ i.nombre }}
      </option>
    </select>

    <input v-model="form.letra" placeholder="Libro letra" />
    <input v-model="form.num" type="number" placeholder="Libro nº" />

    <button @click="save">Ingresar</button>
    <button @click="$emit('cancel')">Cancelar</button>
  </fieldset>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { showModal} from '@/services/uiBus.js'
import { api } from '@/api/api'
const props = defineProps({
    materia: {
        type: Object,
        required: true
    },
    codAlC: {
        type: Number,
        required: true,
    }
})
const arrInst = ref([])
const arrCond = ref([
    ["PD", "Promocion Directa"],
    ["L", "Libre"],
    ["EQ", "Equivalencia"],
    ["R", "Regular"]
])
const emit = defineEmits(['saved', 'cancel']);
const form = reactive({
  nota: null,
  condicion:'',
  concepto:'',
  fecha: '',
  inst: null,
  letra: '',
  num: null
});

onMounted(async () => {
    const r = await api.get({
        entity: "instituciones",
        action: "getInstituciones"
    })
    arrInst.value = r.payload
    form.inst = 11396700
})

const save = async () => {
  const ok = await showModal("¿Confirma el ingreso?", 1, "Confirmación");
  if (!ok) return;
  const r = await api.post({
    entity: "examenes",
    action: "addExamen",
    payload: {
        infoExamen: form,
        infoMateria: props.materia,
        codAlC: props.codAlC
    }
  })
  if (r.ok) {
    showModal("Examen ingresado")
    emit('saved');
  }
}
</script>
