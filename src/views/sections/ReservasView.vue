<script setup lang="ts">
import CarrerasSelect from '../../components/CarrerasSelect.vue';
import InstrumentosSelect from '../../components/InstrumentosSelect.vue';

</script>

<template>
<h3 class="h3cabecera">Reserva de vacante</h3>
  <div class="row">
    <div class="col-12 p-3">
        <CarrerasSelect
            v-model="selectedCarrera"
            :carreras="carreras"
            @change="onSelectCarrera"
        />
    </div>
    <div class="col-12">
      <div id="divNivelReserva" v-if="opciones.length>0">
        <div v-if="opciones.nombreProf">Profesor: {{ opciones.nombreProf }}</div>
        <div v-else>Profesor: A designar</div>
        <div v-show="opciones.cambioProfDisponible" class="m-2 d-flex align-items-baseline">
          <input
            type="checkbox"
            v-model="setCambioProf"
            @click="onChangeCambioProf()"
          />
          <label>Solicito cambio de Profesor</label>
        </div>

        <div>
            <div  class="m-2 d-flex align-items-baseline">
                <input
                    type="checkbox"
                    id="cambioInstr"
                    v-model="setCambioInstr"
                    @click="onChangeCambioInstr()"
                />
                <label>Solicito cambio de Instrumento a:</label>
            </div>
            <div v-if="arrInstrumentos.length>0">
                <InstrumentosSelect/>
            </div>  
        </div>
        <div class='col-12 text-end'>
          <input type="button" class="btn btn-primary" v-on:click="addReserva()" value="Confirmar Reserva" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { api } from '@/api/api.js';
import { useModal } from '@/composables/useModal'
import CarrerasSelect from '../../../components/CarrerasSelect.vue';

const carreras = ref([]);
const opciones = ref([]);
const setCambioProf = ref(false);

onMounted(() => {
  getCarrerasAlumno();
});

const getCarrerasAlumno = async () => {
  try {
    const r = await api.get({
      entity: 'reservas',
      action: 'getCarrerasAlumno',
    });
    carreras.value = r.payload ?? [];
  } catch (e) {
    console.log(e);
  } 
};

const onSelectCarrera = async () => {
  selectedMateria.value = '';
  materias.value = [];
  try {
    const r = await api.get({
      entity: 'reservas',
      action: 'getOpciones',
      payload: {codigo : selectedCarrera.value},
    });
    opciones.value = r.payload ?? [];
  } catch (e) {
    console.log(e);
  }
};

const onChangeCambioProf = async () => {

}

const onChangeCambioInstr = async () => {
    
}
</script>