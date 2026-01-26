<template>
<h3 class="h3cabecera">Reserva de vacante</h3>
  <div class="row">
    <div class="col-12 p-3">
        <CarrerasSelect
            v-model="selectedIndexCarrera"
            :carreras="carreras"
            @change="onSelectCarrera"
        />
    </div>
    <div class="col-12">
      <div v-show="Object.keys(opciones).length>0">
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
                <label>Solicito cambio de Instrumento</label>
            </div>
            <div v-if="setCambioInstr">
                <InstrumentosSelect
                  v-model="selectedInstrumento"
                  :instrumentos="arrInstrumentos"
                  @change="onSelectInstrumento"
                />
            </div>  
        </div>
        <div class='col-12 text-end'>
          <input type="button" class="btn btn-primary" v-on:click="confirmReserva" value="Confirmar Reserva" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { api } from '@/api/api.js';
import { useModal } from '@/composables/useModal'
import CarrerasSelect from '@/components/CarrerasSelect.vue';
import InstrumentosSelect from '@/components/InstrumentosSelect.vue';
import { showModal } from '@/services/uiBus';
const selectedIndexCarrera = ref(null);
const carreras = ref([]);
const opciones = ref({});
const setCambioProf = ref(false);
const setCambioInstr = ref(false);
const arrInstrumentos = ref([]);
const nuevoInstr = ref(null);
onMounted(() => {
  getCarrerasAlumno();
})

const getCarrerasAlumno = async () => {
  try {
    const r = await api.get({
      entity: 'reservas',
      action: 'getCarrerasParaReserva',
    });
    carreras.value = r.payload ?? [];
  } catch (e) {
    console.log(e);
  } 
}

const onSelectCarrera = async () => {
  try {
    const carrera = carreras.value[selectedIndexCarrera.value];
    const r = await api.get({
      entity: 'reservas',
      action: 'getOpcionesDeReserva',
      payload: {
        codAlC: carrera.codigo,
        codInstrumento: carrera.codInstrumento
      },
    });
    opciones.value =  {
      datosPrevios : r.payload.datosPrevios,
      cambioProfDisponible : r.payload.profDisponibles,
    };
  } catch (e) {
    console.log(e);
  }
}
const onChangeCambioProf = async () => {
  if (setCambioProf.value) {
    const modal = useModal()
    const ok = await modal.show('¿Confirma reserva?', 1);
  }
}
const onChangeCambioInstr = async () => {
    if (setCambioInstr.value) {
      const carrera = carreras.value[selectedIndexCarrera.value].n
      const ok = modal.show("Al solicitar cambio de instrumento pierde la inscripción a , reemplazándola por el instrumento que seleccione a continuación. ¿Desea continuar?", 1)
      const r = await api.get({
        entity: "instrumentos",
        action: "listInstrumentos",
      });
      arrInstrumentos.value = r.payload ?? [];
    }
    else {
      nuevoInstr.value = '';
      arrInstrumentos.value = [];
    }
}
const confirmReserva = async () => {
  const c = await showModal('¿Confirma reserva?', 1);
  if (c.ok) {
    const carrera = carreras.value[selectedIndexCarrera.value];
    try {
      const r = await api.post({
        entity: 'reservas',
        action: 'confirmReserva',
        payload: {
          codAlC : carrera.codigo,
          nuevoInstr: nuevoInstr.value,
          codProfesor: opciones.value.datosPrevios.codProfesor ?? null,
          cambioProf: setCambioProf.value,
          cambioInstr: setCambioInstr.value,
        },
      });
      if (r.ok) showModal("La reserva ha sido ingresada y puede visualizarse en la página de inicio.")
    } catch (e) {
      console.log(e);
    }
  }
  nuevoInstr.value = '';
  selectedIndexCarrera.value = null;
  opciones.value = [];
  setCambioProf.value = false;
}


</script>