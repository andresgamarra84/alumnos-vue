<template>

  <!-- ========================= -->
  <!-- NUEVA MESA -->
  <!-- ========================= -->

  <h3 class="mb-3">Nueva mesa de examen</h3>

  <!-- Curso -->
  <div class="mb-3">
    <CursosSelect
      :cursos="arrCursos"
      :show-label="true"
      @change="getProfesoresCurso"
      />
  </div>

  <!-- Profesor + Fecha/Hora -->
  <div v-if="arrProfCurso.length > 0" class="row g-3 mb-4">

    <!-- Profesor -->
    <div class="col-12 col-md-6">
      <label class="form-label fw-bold">Profesor:</label>

      <select class="form-select" v-model="formMesa.codProfesor">
        <option disabled value="">
          -- Seleccione el docente --
        </option>
        <option
          v-for="p in arrProfCurso"
          :key="p.codigo"
          :value="p.codigo"
        >
          {{ p.nombre }}
        </option>
      </select>
    </div>

    <!-- Fecha y hora -->
    <div class="col-12 col-md-6">
      <label class="form-label fw-bold">Fecha:</label>
      <input
        type="date"
        class="form-control mb-2"
        v-model="formMesa.fecha"
      />

      <label class="form-label fw-bold">Hora:</label>
      <input
        type="time"
        class="form-control"
        v-model="formMesa.hora"
      />
    </div>

    <!-- Botón -->
    <div class="col-12 text-end">
      <button class="btn btn-primary" @click="addMesa">
        Agregar mesa
      </button>
    </div>
  </div>

  <hr class="my-4" />

  <!-- ========================= -->
  <!-- LISTADO -->
  <!-- ========================= -->

  <h3 class="mb-3">Listado de mesas de examen</h3>

  <!-- Filtros -->
  <div class="row g-3 mb-3">

    <div class="col-12 col-md-6">
      <label>Desde:</label>
      <input
        type="date"
        class="form-control"
        v-model="filtro.desde"
      />
    </div>

    <div class="col-12 col-md-6">
      <label>Hasta:</label>
      <input
        type="date"
        class="form-control"
        v-model="filtro.hasta"
      />
    </div>

    <div class="col-12 text-end">
      <button class="btn btn-primary" @click="listMesas(0)">
        Buscar
      </button>
    </div>
  </div>

  <!-- Encabezado -->
  <div v-if="arrMesas.length > 0" class="row fw-bold text-center border-bottom py-2">
    <div class="col-md-1" @click="listMesas(0)">Mesa</div>
    <div class="col-md-2" @click="listMesas(2)">Fecha</div>
    <div class="col-md-2" @click="listMesas(1)">Curso</div>
    <div class="col-md-3" @click="listMesas(3)">Presidente</div>
    <div class="col-md-2">Vocales</div>
    <div class="col-md-2">Suplentes/Pianistas</div>
  </div>

  <!-- Mesas -->
  <div
    v-for="(mesa, key) in arrMesas"
    :key="mesa.codigo"
    class="row text-center border rounded py-3 my-2"
  >
    <!-- Código -->
    <div class="col-md-1">
      <a href="#" @click.prevent="downloadActa(key)">
        {{ mesa.codigo }}
      </a>

      <div class="small mt-1">
        <span v-if="mesa.cantAlumnos > 0">
          {{ mesa.cantAlumnos }} inscriptos
        </span>

        <a
          v-else
          href="#"
          class="text-danger"
          @click.prevent="borrarMesa(key)"
        >
          Borrar
        </a>
      </div>
    </div>

    <!-- Fecha -->
    <div class="col-md-2">
      <div v-if="editingMesaKey === key" class="edit-fecha">
        <input type="date" v-model="editFecha" class="form-control form-control-sm" />
        <input type="time" v-model="editHora"  class="form-control form-control-sm" />
        <button class="btn btn-sm btn-primary" @click="saveEditDate(key)">
          OK
        </button>
        <button class="btn btn-sm btn-secondary" @click="cancelEditDate">
          X
        </button>
      </div>
      <a v-else href="#" @click.prevent="openEditDate(key)">
        {{ mesa.fecha }} {{ mesa.hora }}
      </a>
    </div>

    <!-- Curso -->
    <div class="col-md-2">
      {{ mesa.nombre }}
    </div>

    <!-- Presidente -->
    <div class="col-md-3">
      <div
        v-for="a in mesa.autoridades.filter(x => x.tipoAutoridad === 'Presidente')"
        :key="a.codigo"
      >
        {{ a.nombreProf }}
        <a href="#" @click.prevent="borrarProfesor(key, a)">
          (X)
        </a>
      </div>

      <a
        v-if="!mesa.autoridades.some(x => x.tipoAutoridad === 'Presidente')"
        @click="showListProf(key, 'Presidente')"
      >
        Elegir Presidente
      </a>
    </div>

    <!-- Vocales -->
    <div class="col-md-2">
      <div
        v-for="a in mesa.autoridades.filter(x => x.tipoAutoridad === 'Vocal')"
        :key="a.codigo"
      >
        {{ a.nombreProf }}
        <a href="#" @click.prevent="borrarProfesor(key, a)">
          (X)
        </a>
      </div>

      <a href="#" @click.prevent="showListProf(key, 'Vocal')">
        Agregar vocal
      </a>
    </div>

    <!-- Suplentes -->
    <div class="col-md-2">
      <div
        v-for="a in mesa.autoridades.filter(x => ['Suplente', 'Pianista'].includes(x.tipoAutoridad))"
        :key="a.codigo"
      >
        {{ a.nombreProf }}
        <a href="#" @click.prevent="borrarProfesor(key, a)">
          (X)
        </a>
      </div>

      <a href="#" @click.prevent="showListProf(key, 'Suplente')">
        Agregar suplente
      </a>
      <a href="#" @click.prevent="showListProf(key, 'Pianista')">
        Agregar pianista
      </a>
    </div>

    <!-- Tipos materia (bitmask) -->
    <div class="col-12 mt-3 text-start tipo-materia-linea">
      <label class="me-3">
        <input
          type="checkbox"
          :checked="mesa.tipoMateria & 1"
          @change="toggleTipoMateria(key, 1)"
        />
        Normal
      </label>

      <label class="me-3">
        <input
          type="checkbox"
          :checked="mesa.tipoMateria & 2"
          @change="toggleTipoMateria(key, 2)"
        />
        Instrumento
      </label>

      <label class="me-3">
        <input
          type="checkbox"
          :checked="mesa.tipoMateria & 4"
          @change="toggleTipoMateria(key, 4)"
        />
        Armónico
      </label>

      <label class="me-3">
        <input
          type="checkbox"
          :checked="mesa.tipoMateria & 8"
          @change="toggleTipoMateria(key, 8)"
        />
        Espacio Institucional
      </label>

      <label class="me-3">
        <input
          type="checkbox"
          :checked="mesa.tipoMateria & 16"
          @change="toggleTipoMateria(key, 16)"
        />
        Espacio Inst. Alternativo
      </label>
    </div>
  </div>

  <!-- Descargar todas -->
  <div v-if="arrMesas.length > 0" class="text-end mt-3">
    <button class="btn btn-outline-primary" @click="downloadActaAll">
      Descargar actas
    </button>
  </div>
  <!-- MODAL DE SELECCION DE PROFESOR PARA MESA -->
  <div v-if="showModalProf" class="modal-backdrop-custom">
    <div class="modal-card">
      <label>Docente:</label>
      <select v-model="selectedProf">
        <option :value="null" disabled>Seleccione un docente...</option>
        <option v-for="profesor in arrProf" :value="profesor.codigo">{{ profesor.nombre }}</option>
      </select>
      <button class='btn btn-primary' @click="closeModalProf">Cancelar</button>
      <button class='btn' @click="addProf">Agregar docente</button>
    </div>
    
  </div>
</template>
<script setup>
import CursosSelect from "@/components/CursosSelect.vue"
import { ref, onMounted } from "vue"
import { api } from "@/api/api"
import { showModal } from "@/services/uiBus"
import { useFileDownload } from "@/composables/useFileDownload"
const { downloadPDF } = useFileDownload()

/* ARRAYS */
const arrCursos = ref([])
const arrProf = ref([])
const arrProfCurso = ref([])
const arrMesas = ref([])
const showModalProf = ref(false)
const selectedProf = ref("")
const arrMesaKey = ref(null)
const tipoAutoridadProf = ref(null)
const editingMesaKey = ref(null)
const editFecha = ref("")
const editHora = ref("")
/* FORM NUEVA MESA */
const formMesa = ref({
  codCurso: "",
  codProfesor: "",
  fecha: "",
  hora: "",
})

/* FILTRO */
const filtro = ref({
  criterio: 0,
  desde: "",
  hasta: "",
})

/* FUNCIONES */
onMounted(() => {
    getProfesores()
    getCursos()
})
const getCursos = async () => {
    const { payload } = await api.get({
        entity: "planillahorarios",
        action: "getCursosVigentes",
    })
    arrCursos.value = payload
}
const getProfesores = async () => {
    const { payload } = await api.get({
        entity: "profesores",
        action: "getProfesores",
    })
    arrProf.value = payload
}
const getProfesoresCurso = async (codCurso) => {
  const curso = arrCursos.value.find(c => c.codigo == codCurso)
  formMesa.value.codCurso = curso.codigo
  formMesa.value.nombreCurso = curso.nombre
  const { payload } = await api.get({
      entity: "planillahorarios",
      action: "getProfesoresByCurso",
      payload: { codCurso },
  })
  arrProfCurso.value = payload
}
const  addMesa = async () => {

  const {ok} = await showModal("¿Confirma que desea incorporar esta mesa?",1)
  if (!ok) return
  const r = await api.post({
    entity: "mesasexamen",
    action: "addMesa",
    payload: formMesa.value,
  })
}

const listMesas = async (criterio=0) => {
  filtro.value.criterio = criterio
  const {payload} = await api.get({
    entity: "mesasexamen",
    action: "getMesasFromDates",
    payload: filtro.value,
  })
  arrMesas.value = payload
}

const borrarMesa = async (key) => {
  console.log("Borrar mesa:", key)
  const {ok} = await showModal("¿Confirma que desea borrar esta mesa de exámen?",1)
  if (!ok) return
  const r = await api.post({
    entity: "mesasexamen",
    action: "delMesa",
    payload: {
      codMesa:arrMesas.value[key].codigo,
    }
  })
  if (r.ok) arrMesas.value.splice(key,1)
}

const downloadActa = async (key) => {
  console.log("Descargar acta:", key)
  if (this.arrMesas[k].datosMesa.cantAlumnos==0){
    showModal("No se puede descargar el acta porque no posee alumnos inscriptos");
    return
  }
	const blob = await api.getPDF({
    entity: "mesasexamen",
    action: "getActaMesa",
    payload: {
      codMesa: arrMesas.value[key].datosMesa.codigo,
    }
  })
  downloadPDF(blob, "ActaMesa - "+this.arrMesas[k].datosMesa.codigo+".pdf")
}

const downloadActaAll = async () => {
  console.log("Descargar todas")
  const blob = await api.getPDF({
    entity: "mesasexamen",
    action: "getActasMesas",
    payload: {
      fechaInicio: filtro.value.desde,
      fechaFin: filtro.value.hasta,
    }
  })
  downloadPDF(blob, "ActasMesas.pdf")
}

const showListProf = (key, tipo) =>{
  showModalProf.value = true
  arrMesaKey.value = key
  tipoAutoridadProf.value = tipo
}

const addProf = async () => {
    const mesa = arrMesas.value[arrMesaKey.value]
		const r = await api.post({
      entity:"mesasexamen",
      action:"addProfesor",
      payload: {
        codMesa:mesa.codigo,
        codProfesor:selectedProf.value,
        tipoAutoridadProf:tipoAutoridadProf.value,
      }
    })
    if (r.ok) mesa.autoridades = r.payload
    closeModalProf()
}
const closeModalProf = () => {
  arrMesaKey.value = null
  tipoAutoridadProf.value = null
  selectedProf.value = null
  showModalProf.value = false
}
const toInputDate = (ddmmyyyy) => {
  if (!ddmmyyyy) return ""
  const parts = ddmmyyyy.split("/")
  if (parts.length !== 3) return ddmmyyyy
  const [dd, mm, yyyy] = parts
  return `${yyyy}-${mm.padStart(2,"0")}-${dd.padStart(2,"0")}`
}
const toDisplayDate = (yyyymmdd) => {
  if (!yyyymmdd) return ""
  const parts = yyyymmdd.split("-")
  if (parts.length !== 3) return yyyymmdd
  const [yyyy, mm, dd] = parts
  return `${dd}/${mm}/${yyyy}`
}
const openEditDate = (key) => {
  editingMesaKey.value = key
  editFecha.value = toInputDate(arrMesas.value[key].fecha || "")
  editHora.value = (arrMesas.value[key].hora || "").slice(0,5)
}
const cancelEditDate = () => {
  editingMesaKey.value = null
  editFecha.value = ""
  editHora.value = ""
}
const saveEditDate = async (key) => {
  if (!editFecha.value || !editHora.value) {
    showModal("Complete fecha y hora")
    return
  }
  const r = await api.post({
    entity: "mesasexamen",
    action: "updFechaMesa",
    payload: {
      codMesa: arrMesas.value[key].codigo,
      fecha: editFecha.value,
      hora: editHora.value,
    }
  })
  if (r.ok) {
    arrMesas.value[key].fecha = toDisplayDate(editFecha.value)
    arrMesas.value[key].hora = editHora.value
    cancelEditDate()
  }
}
const borrarProfesor= async (key, autoridad) => {
  console.log("Borrar profesor:", key, autoridad)
  const mesa = arrMesas.value[key]
  const {ok} = await showModal("¿Confirma que desea borrar este profesor de la mesa de examen?",1)
  if (ok) {
    const r = await api.post({
      entity:"mesasexamen",
      action:"borrarProfesor",
      payload:{
        codMesa:mesa.codigo,
        codMesaAutoridad: autoridad.codigo
      }
    })
    mesa.autoridades = r.payload
  }
}
/*
const openEditDate = async (key) => {
  console.log("Editar fecha mesa:", key)
  if (document.getElementById("newDate").value == "" || document.getElementById("newTime").value == ""){
				modal.show("Complete los campos de fecha y hora");
				return;
			}
			modal.show("¿Confirma cambio de fecha en la mesa?",1).then(r=>{
				if (r){
					let d = {
						"codMesa":this.arrMesas[this.indexArr].datosMesa.codigo,
						"fecha":document.getElementById("newDate").value,
						"hora":document.getElementById("newTime").value,
					};
					apiData.setData("mesas",3,d);
					api.post().then(r=>{
						if (api.r.ok) this.arrMesas[this.indexArr].datosMesa.fecha = d.fecha+" "+d.hora;
						else modal.show("No se pudo actualizar la fecha");
						this.showDate = false;
					});
				}
				this.indexId.style.visibility='visible';
				this.indexId = false;	
			});
}

const  toggleTipoMateria = async (key, bit) => {
  console.log("Toggle bit:", key, bit)
  let tipoMateria = this.arrMesas[key].datosMesa.tipoMateria;
			if (!event.target.checked) tipoMateria = tipoMateria - bit;
			else tipoMateria = tipoMateria + bit;
			Vue.set(this.arrMesas[key].datosMesa, "tipoMateria", tipoMateria);
			let d = {
				"codMesa":this.arrMesas[key].datosMesa.codigo,
				"tipoMateria":tipoMateria,
			};
			apiData.setData("mesas",6,d);
			api.post().then(r=>{
				if (!api.r.ok) modal.show(r.errMsg);
			});
}


		*/
</script>

<style scoped>
.tipo-materia-linea {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}
.tipo-materia-linea label {
  margin-right: 0;
}
</style>
