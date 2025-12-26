<template>
  <section>
    <h3 class="h3cabecera">Solicitud de mesa de examen</h3>

    <!-- Carrera -->
    <div v-if="carreras.length">
      <label>Carrera:</label>
      <select v-model="idxCarrera" @change="onCarreraChange">
        <option disabled value="">Seleccione una carrera</option>
        <option
          v-for="(item, k) in carreras"
          :key="item.codigo"
          :value="k"
          :disabled="item.esFinalizada"
        >
          {{ item.carrera.nombre }}
          <span v-if="item.instrumento.codigo">
            ({{ item.instrumento.nombre }})
          </span>
        </option>
      </select>
    </div>

    <!-- Materia -->
    <div v-if="materias.length" class="row">
      <div class="col-12 col-md-6">
        <label>Materia:</label>
        <select v-model="codMateria" @change="onMateriaChange">
          <option disabled value="">Seleccione una materia</option>
          <option
            v-for="m in materias"
            :key="m.codigo"
            :value="m.codigo"
            :disabled="m.disabled"
          >
            {{ m.nombre }}
          </option>
        </select>
      </div>

      <div class="col-12 col-md-6">
        <label>Condición:</label>
        <select v-model="condicion">
          <option disabled value="">Seleccione una condición</option>
          <option value="0">Regular/Previo</option>
          <option value="1" v-if="permitLibre">Libre</option>
          <option value="2">Equivalencia</option>
        </select>
      </div>
    </div>

    <!-- Profesores -->
    <div v-if="profesores.length">
      <div class="info">
        Seleccione el profesor para el cual solicita la mesa.
        Los horarios serán informados más adelante.
      </div>

      <div
        v-for="(p, k) in profesores"
        :key="p.codPlHorarios"
        class="lista"
        @click="seleccionarProfesor(k)"
      >
        {{ p.contenido }}<br />
        Prof: {{ p.nombreProf }}
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useMesas } from '@/composables/useMesas'

// estado
const idxCarrera = ref('')
const codMateria = ref('')
const condicion = ref('')

const {
  carreras,
  materias,
  profesores,
  permitLibre,
  cargarCarreras,
  cargarMaterias,
  cargarProfesores,
  solicitarMesa
} = useMesas()

const carreraSeleccionada = computed(
  () => carreras.value[idxCarrera.value]
)

const onCarreraChange = () => {
  codMateria.value = ''
  condicion.value = ''
  cargarMaterias(carreraSeleccionada.value)
}

const onMateriaChange = () => {
  cargarProfesores(carreraSeleccionada.value, codMateria.value)
}

const seleccionarProfesor = async (k) => {
  if (!condicion.value) {
    alert('Seleccione una condición de examen')
    return
  }

  if (!confirm('¿Confirma que desea seleccionar esta mesa de examen?')) return

  await solicitarMesa({
    carrera: carreraSeleccionada.value,
    codMateria: codMateria.value,
    profesor: profesores.value[k],
    condicion: condicion.value
  })

  idxCarrera.value = ''
}

onMounted(cargarCarreras)
</script>
