<template>
  <div class="container mt-4">

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
      <div class="col-md-2">Suplentes</div>
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
        <a href="#" @click.prevent="openEditDate(key)">
          {{ mesa.fecha }}
        </a>
      </div>

      <!-- Curso -->
      <div class="col-md-2">
        {{ mesa.nombre }}
      </div>

      <!-- Presidente -->
      <div class="col-md-3">
        <div
          v-for="a in mesa.autoridades.filter(x => x.codCondicion === 1)"
          :key="a.codigo"
        >
          {{ a.nombreProf }}
          <a href="#" @click.prevent="borrarProfesor(key, a)">
            (X)
          </a>
        </div>

        <a href="#" @click.prevent="showListProf(key, 1)">
          Elegir Presidente
        </a>
      </div>

      <!-- Vocales -->
      <div class="col-md-2">
        <div
          v-for="a in mesa.autoridades.filter(x => x.codCondicion === 2)"
          :key="a.codigo"
        >
          {{ a.nombreProf }}
          <a href="#" @click.prevent="borrarProfesor(key, a)">
            (X)
          </a>
        </div>

        <a href="#" @click.prevent="showListProf(key, 2)">
          Agregar vocal
        </a>
      </div>

      <!-- Suplentes -->
      <div class="col-md-2">
        <div
          v-for="a in mesa.autoridades.filter(x => x.codCondicion >= 3)"
          :key="a.codigo"
        >
          {{ a.nombreProf }}
          <a href="#" @click.prevent="borrarProfesor(key, a)">
            (X)
          </a>
        </div>

        <a href="#" @click.prevent="showListProf(key, 3)">
          Agregar suplente
        </a>
      </div>

      <!-- Tipos materia (bitmask) -->
      <div class="col-12 mt-3 text-start">
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
      </div>
    </div>

    <!-- Descargar todas -->
    <div v-if="arrMesas.length > 0" class="text-end mt-3">
      <button class="btn btn-outline-primary" @click="downloadActaAll">
        Descargar actas
      </button>
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
        entity: "cursoshorarios",
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
    const { payload } = await api.get({
        entity: "cursoshorarios",
        action: "getProfesoresCurso",
        payload: { codCurso },
    })
    arrProfCurso.value = payload
}
const  addMesa = async () => {
  const {ok} = showModal("¿Confirma que desea incorporar esta mesa?",1)
  if (!ok) return
  const r = await api.post({
    entity: "mesasexamen",
    action: "addMesa",
    payload: formMesa.value,
  })
}

const listMesas = async (criterio=0) => {
  console.log(criterio)
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
  const {ok} = showModal("¿Confirma que desea borrar esta mesa de exámen?",1)
  if (!ok) return
  const r = await api.post({
    entity: "mesasexamen",
    action: "delMesa",
    payload: {
      codMesa:arrMesas.value[key].datosMesa.codigo,
    }
  })
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
/*
function showListProf(key, condicion) {
  console.log("Elegir prof:", key, condicion)
  this.indexArr=key;
			this.condicionProf=i;
			if (this.indexId) this.indexId.style.visibility = "visible";
			this.indexId = event.target;
			this.indexId.style.visibility='hidden';
			document.getElementById("selProf").selectedIndex = 0;
			this.indexId.parentElement.appendChild(document.getElementById("selProf"));
			this.showList=true;
}

function borrarProfesor(key, autoridad) {
  console.log("Borrar profesor:", key, autoridad)
  modal.show("¿Confirma que desea borrar este profesor de la mesa de exámen?",1).then(r=>{
				if (r) {
					let d={
						codMesaAutoridad:this.arrMesas[key].autoridades[i].codigo,
					};
					apiData.setData("mesas",1,d);
					api.post().then(r=>{
						if (api.r.ok) this.arrMesas[key].autoridades.splice(i, 1);
					});
				}	
			});
}

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


		addProf:function(){
			select = event.target;
			let d = {
				"codMesa":this.arrMesas[this.indexArr].datosMesa.codigo,
				"codProfesor":select.value,
				"condicion":this.condicionProf,
			};
			apiData.setData("mesas",2,d);
			api.post().then(r=>{
				if (api.r.ok) {
					let i = this.condicionProf - 1;
					this.arrMesas[this.indexArr].autoridades.push({
						"codigo":r.payload, 
						"nombreProf":select.options[select.selectedIndex].text,
						"codCondicion":this.condicionProf,
					});
					this.showList = false;
					select.selectedIndex = 0;
				}
				else modal.show("No se pudo incorporar el docente a la mesa");
				this.indexId.style.visibility = 'visible';
				this.indexId = false;
			});
		},*/
</script>
