<template>
  <fieldset class="form-container">
    <legend>Nuevo examen</legend>
    <label>Nota numérica:</label>
    <input class='form-control' v-model="form.nota" type="number" placeholder="Nota numérica" />
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
    <div>
      <label>Libro letra:</label>
      <input class='form-control' v-model="form.letra" placeholder="Libro letra" />
      <label>Nº de libro:</label>
      <input class='form-control' v-model="form.num" type="number" placeholder="Libro nº" />
      <label>N° de acta:</label>
      <input class='form-control' v-model="form.acta" type="number" placeholder="Acta nº" />
      <label>N° de foja:</label>
      <input class='form-control' v-model="form.foja" type="number" placeholder="Foja nº" />

    </div>
    <div>
      <button class='btn' @click="save">Ingresar</button>
      <button class='btn btn-primary' @click="emit('close')">Cancelar</button>
    </div>

    
  </fieldset>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { showModal} from '@/services/uiBus.js'
import { api } from '@/api/api'
const arrInst = ref([])
const arrCond = ref([
    ["PD", "Promocion Directa"],
    ["L", "Libre"],
    ["EQ", "Equivalencia"],
    ["R", "Regular"]
])
const emit = defineEmits(['save-examen', 'close']);
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
  emit('save-examen', form)
}
</script>
