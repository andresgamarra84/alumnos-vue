<?php
require __DIR__ . "/../../../vars-fn.php";
echo CJJCtags("/cssjs/resumable.js");
echo CJJCtags("/adm/web/carrusel/carrusel.js");
?> 
<div id="app" class='row'>
	<div class='row'>
		<div class='col-12'>
			<label for="imgPath">Cargar imagen:</label>
			<input type="button" id="imgPath" value='Seleccione...' @click='prepareUpload'>
		</div>
		<div class='col-12 m-3'>
			<label for="link">Link:</label>
			<input type="text" id="link" v-model="formData.link">
		</div>
		<div class='row m-3'>
			<div class='col-12 col-md-6'>
				<label for="descripcion">Descripción:</label>
				<input type="text" id="descripcion" v-model="formData.descripcion">
			</div>
			<div class='col-6 col-md-3'>
				<label for="fechaInicio">Fecha de inicio:</label>
				<input type="date" id="fechaInicio" v-model="formData.fechaInicio">
			</div>
			<div class='col-6 col-md-3'>
				<label for="fechaFin">Fecha de fin:</label>
				<input type="date" id="fechaFin" v-model="formData.fechaFin">
			</div>
		</div>
		<div class='row m-3'>
			<div class='col-3'>
				<label>
					<input type="checkbox" v-model="formData.indefinido">
					Indefinido
				</label>
			</div>
			<div class='col-3'>
				<label>
					<input type="checkbox" v-model="formData.oculto">
					Oculto
				</label>
			</div>
			<div class='col-3'>
				<label for="duracion">Duración (en segundos):</label>
				<select id="duracion" v-model="formData.duracion">
					<option v-for="n in [3,4,5,6,7]" :value="n" :selected='n==3'>{{n}}</option>
				</select>
			</div>
		</div>
		<div>
			<button type="button" @click='enviar'>Agregar</button>
			<button type="button" @click="limpiar">Cancelar</button>
		</div>
	</div>
	<div class='row'>
		<div class='row p-3' v-for='item, key in arrListaCarrusel'>
			<div class='col-6' :style="{ opacity: item.oculto==1 ? 0.3 : 1 }">
				<img :src="'https://cjjc.edu.ar/api/uploads/carrusel/'+item.imgPath" class='img-fluid'>
			</div>
			<div class='col-6'>
				<div>Descripción: <input type='text' :value='item.descripcion' @change="uplData(key,'descripcion')"></div>
				<div>Link: <input type='text' :value='item.link' @change="uplData(key, 'link')"></div>
				<div>Desde el <input type='date' :value='item.fechaInicio' @change="uplData(key, 'fechaInicio')"> hasta el <input type='date' :value='item.fechaFin' @change="uplData(key,'fechaFin')"></div>
				<div><input type='checkbox' :checked='item.indefinido==1' @click="uplData(key,'indefinido')">Mostrar indefinidamente</div>
				<div><input type='checkbox' :checked='item.oculto==1' @click="uplData(key,'oculto')">Mantener oculto</div>
				<div>Mostrar durante <input type='number' :value='item.duracion' @change="uplData(key, 'duracion')"> segundos</div>
				<div>N° de orden: <input type='number' :value='item.orden' @change="uplData(key,'orden')"></div>
				<div><a v-on:click='borrarItem(key)'>Borrar del Carrusel</a></div>
			</div>
		</div>
	</div>
</div>