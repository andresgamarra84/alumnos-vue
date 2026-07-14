<template>
	<div id="nuevoProf">
		<div class="carousel-item" v-show="currentStep === 0" ref="step1El">
			<div class='col-12' style='padding-bottom:20px;'><h4>Datos personales del Profesor.</h4></div>
			<div class='row'>
				<div class='col-12 col-md-6' style='padding-bottom:2vw'>
					<label>Nombre(s)</label>
					<input type='text' class='form-control' v-model='form.nombre' tabindex=1 required>
				</div>
				<div class='col-12 col-md-6' style='padding-bottom:2vw'>
					<label>Apellido(s)</label>
					<input type='text' class='form-control' v-model='form.apellido' tabindex=2 required>
				</div>
			</div>
			<div class='row'>
				<div class='col-12 col-md-6' style='padding-bottom:2vw'>
					<label for='day'>Fecha de Nacimiento</label>
					<div class='input-group'>
						<select v-model="form.month" class='form-control' required>
							<option selected disabled value="">Mes</option>
							<option value="1">Enero</option>
							<option value="2">Febrero</option>
							<option value="3">Marzo</option>
							<option value="4">Abril</option>
							<option value="5">Mayo</option>
							<option value="6">Junio</option>
							<option value="7">Julio</option>
							<option value="8">Agosto</option>
							<option value="9">Septiembre</option>
							<option value="10">Octubre</option>
							<option value="11">Noviembre</option>
							<option value="12">Diciembre</option>
						</select>
						<select v-model="form.day" class='form-control' required>
							<option selected disabled value="">Dia</option>
							<option v-for='i in arrDias' :key='i' :value='i'>{{ i }}</option>
						</select>
						<select v-model="form.year" class='form-control' required>
							<option selected disabled value="">Año</option>
							<option v-for='i in arrAnios' :key='i' :value='i'>{{ i }}</option>
						</select>
					</div>
				</div>
				<div class='col-12 col-md-6' style='padding-bottom:2vw'>
					<label>Nacido en</label>
					<select v-model="form.pais" tabindex=4 class='form-control' required>
					<option disabled value="">Seleccione...</option>
					<option value="1">Afganistán</option>
					<option value="3">Albania</option>
					<option value="4">Alemania</option>
					<option value="5">Andorra</option>
					<option value="6">Angola</option>
					<option value="7">Anguilla</option>
					<option value="8">Antártida</option>
					<option value="9">Antigua y Barbuda</option>
					<option value="10">Antillas Holandesas</option>
					<option value="11">Arabia Saudí</option>
					<option value="12">Argelia</option>
					<option value="13">Argentina</option>
					<option value="14">Armenia</option>
					<option value="15">Aruba</option>
					<option value="131">ARY Macedonia</option>
					<option value="16">Australia</option>
					<option value="17">Austria</option>
					<option value="18">Azerbaiyán</option>
					<option value="19">Bahamas</option>
					<option value="20">Bahréin</option>
					<option value="21">Bangladesh</option>
					<option value="22">Barbados</option>
					<option value="24">Bélgica</option>
					<option value="25">Belice</option>
					<option value="26">Benin</option>
					<option value="27">Bermudas</option>
					<option value="28">Bhután</option>
					<option value="23">Bielorrusia</option>
					<option value="29">Bolivia</option>
					<option value="30">Bosnia y Herzegovina</option>
					<option value="31">Botsuana</option>
					<option value="33">Brasil</option>
					<option value="34">Brunéi</option>
					<option value="35">Bulgaria</option>
					<option value="36">Burkina Faso</option>
					<option value="37">Burundi</option>
					<option value="38">Cabo Verde</option>
					<option value="40">Camboya</option>
					<option value="41">Camerún</option>
					<option value="42">Canadá</option>
					<option value="44">Chad</option>
					<option value="46">Chile</option>
					<option value="47">China</option>
					<option value="48">Chipre</option>
					<option value="50">Ciudad del Vaticano</option>
					<option value="52">Colombia</option>
					<option value="53">Comoras</option>
					<option value="55">Congo</option>
					<option value="57">Corea del Norte</option>
					<option value="58">Corea del Sur</option>
					<option value="59">Costa de Marfil</option>
					<option value="60">Costa Rica</option>
					<option value="61">Croacia</option>
					<option value="62">Cuba</option>
					<option value="63">Dinamarca</option>
					<option value="64">Dominica</option>
					<option value="66">Ecuador</option>
					<option value="67">Egipto</option>
					<option value="68">El Salvador</option>
					<option value="69">Emiratos Árabes Unidos</option>
					<option value="70">Eritrea</option>
					<option value="71">Eslovaquia</option>
					<option value="72">Eslovenia</option>
					<option value="73">España</option>
					<option value="75">Estados Unidos</option>
					<option value="76">Estonia</option>
					<option value="77">Etiopía</option>
					<option value="79">Filipinas</option>
					<option value="80">Finlandia</option>
					<option value="81">Fiyi</option>
					<option value="82">Francia</option>
					<option value="83">Gabón</option>
					<option value="84">Gambia</option>
					<option value="85">Georgia</option>
					<option value="87">Ghana</option>
					<option value="88">Gibraltar</option>
					<option value="89">Granada</option>
					<option value="90">Grecia</option>
					<option value="91">Groenlandia</option>
					<option value="92">Guadalupe</option>
					<option value="93">Guam</option>
					<option value="94">Guatemala</option>
					<option value="95">Guayana Francesa</option>
					<option value="96">Guinea</option>
					<option value="97">Guinea Ecuatorial</option>
					<option value="98">Guinea-Bissau</option>
					<option value="99">Guyana</option>
					<option value="100">Haití</option>
					<option value="102">Honduras</option>
					<option value="103">Hong Kong</option>
					<option value="104">Hungría</option>
					<option value="105">India</option>
					<option value="106">Indonesia</option>
					<option value="107">Irán</option>
					<option value="108">Iraq</option>
					<option value="109">Irlanda</option>
					<option value="32">Isla Bouvet</option>
					<option value="49">Isla de Navidad</option>
					<option value="161">Isla Norfolk</option>
					<option value="110">Islandia</option>
					<option value="39">Islas Caimán</option>
					<option value="51">Islas Cocos</option>
					<option value="56">Islas Cook</option>
					<option value="78">Islas Feroe</option>
					<option value="86">Islas Georgias del Sur y Sandwich del Sur</option>
					<option value="2">Islas Gland</option>
					<option value="101">Islas Heard y McDonald</option>
					<option value="138">Islas Malvinas</option>
					<option value="139">Islas Marianas del Norte</option>
					<option value="141">Islas Marshall</option>
					<option value="174">Islas Pitcairn</option>
					<option value="186">Islas Salomón</option>
					<option value="223">Islas Turcas y Caicos</option>
					<option value="74">Islas ultramarinas de Estados Unidos</option>
					<option value="234">Islas Vírgenes Británicas</option>
					<option value="235">Islas Vírgenes de los Estados Unidos</option>
					<option value="111">Israel</option>
					<option value="112">Italia</option>
					<option value="113">Jamaica</option>
					<option value="114">Japón</option>
					<option value="115">Jordania</option>
					<option value="116">Kazajstán</option>
					<option value="117">Kenia</option>
					<option value="118">Kirguistán</option>
					<option value="119">Kiribati</option>
					<option value="120">Kuwait</option>
					<option value="121">Laos</option>
					<option value="122">Lesotho</option>
					<option value="123">Letonia</option>
					<option value="124">Líbano</option>
					<option value="125">Liberia</option>
					<option value="126">Libia</option>
					<option value="127">Liechtenstein</option>
					<option value="128">Lituania</option>
					<option value="129">Luxemburgo</option>
					<option value="130">Macao</option>
					<option value="132">Madagascar</option>
					<option value="133">Malasia</option>
					<option value="134">Malawi</option>
					<option value="135">Maldivas</option>
					<option value="136">Malí</option>
					<option value="137">Malta</option>
					<option value="140">Marruecos</option>
					<option value="142">Martinica</option>
					<option value="143">Mauricio</option>
					<option value="144">Mauritania</option>
					<option value="145">Mayotte</option>
					<option value="146">México</option>
					<option value="147">Micronesia</option>
					<option value="148">Moldavia</option>
					<option value="149">Mónaco</option>
					<option value="150">Mongolia</option>
					<option value="151">Montserrat</option>
					<option value="152">Mozambique</option>
					<option value="153">Myanmar</option>
					<option value="154">Namibia</option>
					<option value="155">Nauru</option>
					<option value="156">Nepal</option>
					<option value="157">Nicaragua</option>
					<option value="158">Níger</option>
					<option value="159">Nigeria</option>
					<option value="160">Niue</option>
					<option value="162">Noruega</option>
					<option value="163">Nueva Caledonia</option>
					<option value="164">Nueva Zelanda</option>
					<option value="165">Omán</option>
					<option value="166">Países Bajos</option>
					<option value="167">Pakistán</option>
					<option value="168">Palau</option>
					<option value="169">Palestina</option>
					<option value="170">Panamá</option>
					<option value="171">Papúa Nueva Guinea</option>
					<option value="172">Paraguay</option>
					<option value="173">Perú</option>
					<option value="175">Polinesia Francesa</option>
					<option value="176">Polonia</option>
					<option value="177">Portugal</option>
					<option value="178">Puerto Rico</option>
					<option value="179">Qatar</option>
					<option value="180">Reino Unido</option>
					<option value="43">República Centroafricana</option>
					<option value="45">República Checa</option>
					<option value="54">República Democrática del Congo</option>
					<option value="65">República Dominicana</option>
					<option value="181">Reunión</option>
					<option value="182">Ruanda</option>
					<option value="183">Rumania</option>
					<option value="184">Rusia</option>
					<option value="185">Sahara Occidental</option>
					<option value="187">Samoa</option>
					<option value="188">Samoa Americana</option>
					<option value="189">San Cristóbal y Nevis</option>
					<option value="190">San Marino</option>
					<option value="191">San Pedro y Miquelón</option>
					<option value="192">San Vicente y las Granadinas</option>
					<option value="193">Santa Helena</option>
					<option value="194">Santa Lucía</option>
					<option value="195">Santo Tomé y Príncipe</option>
					<option value="196">Senegal</option>
					<option value="197">Serbia y Montenegro</option>
					<option value="198">Seychelles</option>
					<option value="199">Sierra Leona</option>
					<option value="200">Singapur</option>
					<option value="201">Siria</option>
					<option value="202">Somalia</option>
					<option value="203">Sri Lanka</option>
					<option value="204">Suazilandia</option>
					<option value="205">Sudáfrica</option>
					<option value="206">Sudán</option>
					<option value="207">Suecia</option>
					<option value="208">Suiza</option>
					<option value="209">Surinam</option>
					<option value="210">Svalbard y Jan Mayen</option>
					<option value="211">Tailandia</option>
					<option value="212">Taiwán</option>
					<option value="213">Tanzania</option>
					<option value="214">Tayikistán</option>
					<option value="215">Territorio Británico del Océano Índico</option>
					<option value="216">Territorios Australes Franceses</option>
					<option value="217">Timor Oriental</option>
					<option value="218">Togo</option>
					<option value="219">Tokelau</option>
					<option value="220">Tonga</option>
					<option value="221">Trinidad y Tobago</option>
					<option value="222">Túnez</option>
					<option value="224">Turkmenistán</option>
					<option value="225">Turquía</option>
					<option value="226">Tuvalu</option>
					<option value="227">Ucrania</option>
					<option value="228">Uganda</option>
					<option value="229">Uruguay</option>
					<option value="230">Uzbekistán</option>
					<option value="231">Vanuatu</option>
					<option value="232">Venezuela</option>
					<option value="233">Vietnam</option>
					<option value="236">Wallis y Futuna</option>
					<option value="237">Yemen</option>
					<option value="238">Yibuti</option>
					<option value="239">Zambia</option>
					<option value="240">Zimbabue</option>
				</select>
				</div>
			</div>
			<div class='row'>
				<div class='col-12 col-md-6' style='padding-bottom:2vw'>
					<label for='tipodoc'>Tipo y Nº de Documento</label>
					<div class='input-group'>
						<select v-model='form.tipodoc' class='form-control' required>
							<option disabled value="">Seleccione...</option>
							<option value='1'>DNI Tarjeta</option>
							<option value='2'>DNI Libreta</option>
							<option value='3'>LE/LC</option>
							<option value='4'>Pasaporte</option>
							<option value='5'>Otro</option>
						</select>
						<input type='text' class='form-control' style='margin-left:10px' v-model='form.nrodoc' tabindex=5 placeholder='Ingrese sólo números' required>
					</div>
				</div>
				<div class='col-12 col-md-6' style='padding-bottom:2vw'>
					<label for='nrocuil'>Nro de CUIT/CUIL</label>
					<div class='input-group'>
						<input type='text' class='form-control' v-model='form.nrocuil' tabindex=6 placeholder='XX-XXXXXXXX-X' required>
					</div>
				</div>
			</div>
			<div class='row'>
				<div class='col-12' style='padding-bottom:2vw'>
					<label>Dirección:</label>
					<input type='text' class='form-control' required v-model='form.direccion' placeholder='Calle/Altura/Piso/Depto'>
				</div>
				<div class='col-12 col-lg-6' style='padding-bottom:2vw'>
					<label>Provincia:</label>
					<select v-model='form.provincia' class='form-control' required>
						<option selected disabled value="">Seleccione</option>
						<option v-for='item in arrProv' :key='item.id' :value='item.id'>{{ item.nombre }}</option>
					</select>
				</div>
				<div class='col-12 col-lg-6' style='padding-bottom:2vw'>
					<label>Localidad:</label>
					<select v-model='form.localidad' class='form-control' required>
						<option selected disabled value="">Seleccione</option>
						<option v-for='item in arrLocalidad' :key='item.id' :value='item.id'>{{ item.nombre }}</option>
					</select>
				</div>
			</div>
			<div class='row'>
				<div class='col-6'><input value='Atrás' type='button' class='btn btn-primary' disabled></div>
				<div class='col-6'><input value='Continuar' type='button' class='btn' @click='goNext()'></div>
			</div>
		</div>

		<div class='carousel-item' v-show="currentStep === 1" ref="step2El">
			<div class='row' style='margin-top:20px;border-top:1px solid white;text-align:center'>
				<h4>Datos de contacto</h4>
			</div>
			<div class='row'>
				<div class='col-12 col-md-6' style='padding-bottom:2vw'>
					<label>Telefono Fijo</label>
					<input type='text' v-model='form.telfijo' class='form-control' tabindex=13>
				</div>
				<div class='col-12 col-md-6' style='padding-bottom:2vw'>
					<label>Teléfono Celular</label>
					<input type='text' v-model='form.telcelular' class='form-control' tabindex=14>
				</div>
			</div>
			<div class='row'>
				<div class='col-12 col-md-6' style='padding-bottom:2vw'>
					<label>Dirección de e-mail</label>
					<input type='text' v-model='form.email' tabindex=17 class='form-control' placeholder='Ingrese su e-mail' required>
				</div>
				<div class='col-12 col-md-6' style='padding-bottom:2vw'>
					<label>Re-ingresar e-mail</label>
					<input type='text' v-model='form.email2' tabindex=18 class='form-control' placeholder='Reingrese su e-mail' required>
				</div>
			</div>
			<div class='row'>
				<div class='col-6'><input value='Atrás' class='btn btn-primary' type='button' @click='goBack()'></div>
				<div class='col-6'><input value='Continuar' class='btn' type='button' @click='goNext()'></div>
			</div>
		</div>

		<div class='carousel-item' v-show="currentStep === 2" ref="step3El">
			<div class='row' style='margin-top:20px;border-top:1px solid white;text-align:center'>
				<h4>Información docente</h4>
			</div>
			<div class='row'>
				<div class='col-12 col-md-4' style='padding-bottom:2vw'>
					<label>Fecha de ingreso a la docencia</label>
					<input type='date' required v-model='form.fechaDocencia' class='form-control'>
				</div>
				<div class='col-12 col-md-4' style='padding-bottom:2vw'>
					<label>Fecha de ingreso a la rama</label>
					<input type='date' required v-model='form.fechaRama' class='form-control'>
				</div>
				<div class='col-12 col-md-4' style='padding-bottom:2vw'>
					<label>Fecha de ingreso a la Institución</label>
					<input type='date' required v-model='form.fechaInstitucion' class='form-control'>
				</div>
			</div>
			<div class='row'>
				<div class='col-6'><input value='Atrás' class='btn btn-primary' type='button' @click='goBack()'></div>
				<div class='col-6'><input value='Guardar' class='btn btn-danger' type='button' @click='submitForm()'></div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { reactive, ref, onMounted, watch } from 'vue'
import { api } from '@/api/api'
import { showModal } from '@/services/uiBus'

const initialForm = () => ({
	nombre: '',
	apellido: '',
	fNac: '',
	month: '',
	day: '',
	year: '',
	pais: '13',
	tipodoc: '1',
	nrodoc: '',
	nrocuil: '',
	direccion: '',
	provincia: '',
	localidad: '',
	telfijo: '',
	telcelular: '',
	email: '',
	email2: '',
	fechaDocencia: '',
	fechaRama: '',
	fechaInstitucion: '',
})

const form = reactive(initialForm())

const currentStep = ref(0)
const step1El = ref(null)
const step2El = ref(null)
const step3El = ref(null)

const arrDias = ref([])
const arrAnios = ref([])
const arrProv = ref([])
const arrLocalidad = ref([])

const numDiasPorMes = {
	'1': 31, '2': 28, '3': 31, '4': 30, '5': 31, '6': 30,
	'7': 31, '8': 31, '9': 30, '10': 31, '11': 30, '12': 31,
}

watch(() => [form.month, form.year], () => {
	if (!form.month) return
	let nDias = numDiasPorMes[form.month]
	if (form.month === '2' && form.year && form.year % 4 === 0) nDias++
	if (arrDias.value.length !== nDias) {
		arrDias.value = Array.from({ length: nDias }, (_, i) => i + 1)
		if (form.day && form.day > nDias) form.day = ''
	}
})

watch(() => [form.day, form.month, form.year], () => {
	if (form.day && form.month && form.year) {
		form.fNac = `${form.year}-${form.month}-${form.day}`
	}
})

watch(() => form.provincia, async (val) => {
	form.localidad = ''
	arrLocalidad.value = []
	if (!val) return
	const r = await api.get({
		entity: 'localidades',
		action: 'getLocalidades',
		payload: { codigo: val },
	})
	arrLocalidad.value = r.payload ?? []
})

const checkRequired = (container) => {
	if (!container) return true
	const campos = container.querySelectorAll('[required]')
	let valido = true
	campos.forEach((el) => {
		const vacio = el.value === '' || (el.nodeName === 'SELECT' && el.selectedIndex === -1)
		if (vacio) {
			el.classList.add('invalido')
			valido = false
		} else {
			el.classList.remove('invalido')
		}
	})
	return valido
}

const goNext = async () => {
	if (currentStep.value === 0) {
		if (!checkRequired(step1El.value)) {
			await showModal('Complete correctamente todos los campos requeridos')
			return
		}
		currentStep.value = 1
	} else if (currentStep.value === 1) {
		if (!checkRequired(step2El.value)) {
			await showModal('Complete los campos requeridos')
			return
		}
		if (form.email !== form.email2) {
			await showModal('Las direcciones de e-mail no coinciden')
			return
		}
		currentStep.value = 2
	}
}

const goBack = () => {
	if (currentStep.value > 0) currentStep.value--
}

const submitForm = async () => {
	if (!checkRequired(step3El.value)) {
		await showModal('Complete todos los campos requeridos')
		return
	}
	const { ok: confirmado } = await showModal('¿Confirma que desea guardar los datos del nuevo docente?', 1)
	if (!confirmado) return

	const { email2, ...payload } = form
	const r = await api.post({
		entity: 'docentes',
		action: 'nuevoDocente',
		payload,
	})
	if (r.ok) {
		await showModal('Docente creado correctamente')
		Object.assign(form, initialForm())
		arrLocalidad.value = []
		currentStep.value = 0
	}
}

onMounted(async () => {
	const maxAnio = new Date().getFullYear() - 7
	for (let y = 1930; y < maxAnio; y++) arrAnios.value.push(y)
	for (let d = 1; d <= 31; d++) arrDias.value.push(d)

	const prov = await api.get({ 
		entity: 'localidades', 
		action: 'getProvincias' 
	})
	arrProv.value = prov.payload ?? []
})
</script>

<style scoped>
label {
	font-size: 20px;
}

:deep(.invalido) {
	border: 1px solid red;
	background-color: antiquewhite;
}
</style>
