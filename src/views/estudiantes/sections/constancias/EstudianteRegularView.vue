<template>
	<h3 class='h3cabecera'>Solicitud de constancia de estudiante regular</h3>
	<div class='col-12'>
		<select v-model='indiceOpcion' @change='verificar'>
			<option v-for="(opcion, k) in opciones" :value="k">{{ opcion }}</option>
		</select>
	</div>
	<div v-show="showDiv" class='col-12 my-2'>
		<label >{{ leyenda }}</label>
		<input type='text' :disabled="inputDisabled" v-model="info">
	</div>
	<div class='col-12 text-end'>
        <input type='button' class='btn btn-primary' value='Confirmar solicitud' @click='revisar'>
    </div>
</template>
<script setup>
    import { ref } from 'vue'
    import { api } from "@/api/api"
    import { showModal } from "@/services/uiBus";
    const opciones = [
        "Seleccione un destinatario",
        "S.A.D.",
        "Consejo escolar",
        "I.O.M.A.",
        "Línea de colectivo",
        "Línea de tren",
        "A quien corresponda"
    ]
    const indiceOpcion = ref(0)
    const leyenda = ref('')
    const inputDisabled = ref(true)
    const showDiv = ref(false)
    const info = ref('')
    const verificar = () => {
        leyenda.value = ""
        inputDisabled.value = true
        showDiv.value = false
        info.value = ''
        switch(indiceOpcion.value) {
            case 1:
                leyenda.value = "Distrito de S.A.D. al cual va dirigido: "
                inputDisabled.value = false
                showDiv.value = true
                break;
            case 2:
                leyenda.value = "Distrito del Consejo Escolar al cual va dirigido: ";
                inputDisabled.value = false
                showDiv.value = true
                break;
            case 3:
                break;
            case 4:
                leyenda.value = "Nro. de la línea: ";
                inputDisabled.value = false
                showDiv.value = true
                break;
            case 5:
                leyenda.value = "Nombre de la línea: ";
                inputDisabled.value = false
                showDiv.value = true
                break;
            case 6:
                break;
        }
    }

    const revisar = async () => {	
        if ( indiceOpcion.value == 0 || ((indiceOpcion.value != 3 && indiceOpcion.value != 6) && info.value == "")) {
            showModal("Complete la información requerida");
            return
        }
        const c = await showModal("¿Confirma solicitud?",1)
        if (!c.ok) return 
        const r = await api.post({
            entity:"constancias",
            action:"addConstanciaEstudiante",
            payload:{
                "opcion" : indiceOpcion.value,
                "info" : info.value
            }
        })
        if (r.ok) {
            showModal("La solicitud ha sido ingresada. Recibirá un email cuando la misma esté disponible para ser retirada")
        }
    }

</script>