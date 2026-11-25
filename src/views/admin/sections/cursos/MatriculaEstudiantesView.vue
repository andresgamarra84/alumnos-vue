<template>
  <div class="row g-4">
    <h3 class="h3cabecera">Matrícula de estudiantes</h3>
    <p class="col-12">
      Estudiantes con al menos una cursada en el ciclo lectivo, agrupados por carrera, instrumento,
      sexo, año de carrera y edad.
    </p>

    <div class="col-12">
      <div class="row g-3 align-items-end">
        <div class="col-12 col-md-3">
          <label class="form-label" for="anioMatricula">Año lectivo:</label>
          <input
            id="anioMatricula"
            v-model.number="anio"
            type="number"
            class="form-control"
            min="2000"
            :max="currentYear + 1"
          />
        </div>
        <div class="col-12 col-md-6">
          <div class="form-check">
            <input id="incluirNombres" v-model="incluirNombres" type="checkbox" class="form-check-input" />
            <label for="incluirNombres" class="form-check-label">Incluir nombres de estudiantes</label>
          </div>
          <div class="form-check">
            <input id="profTec" v-model="profesoradosTecnicaturas" type="checkbox" class="form-check-input" />
            <label for="profTec" class="form-check-label">Considerar Profesorados como Tecnicaturas</label>
          </div>
        </div>
        <div class="col-12 col-md-3 text-end">
          <button class="btn btn-primary" @click="descargar">Descargar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { api } from '@/api/api'
import { showToast } from '@/services/uiBus'
import { useFileDownload } from '@/composables/useFileDownload'

const { downloadBlob } = useFileDownload()
const currentYear = new Date().getFullYear()
const anio = ref(currentYear)
const incluirNombres = ref(false)
const profesoradosTecnicaturas = ref(false)

const descargar = async () => {
  if (!Number.isInteger(anio.value) || anio.value < 2000 || anio.value > currentYear + 1) {
    showToast('Ingrese un año lectivo válido', 'error')
    return
  }
  const blob = await api.getPDF({
    entity: 'reportes',
    action: 'getPDFMatricula',
    payload: {
      anio: anio.value,
      incluirNombres: incluirNombres.value,
      profesoradosTecnicaturas: profesoradosTecnicaturas.value,
    },
  })
  downloadBlob(blob, `Matricula ${anio.value}.pdf`, 'application/pdf')
}
</script>
