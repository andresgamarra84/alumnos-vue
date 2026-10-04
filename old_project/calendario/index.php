<?php
require __DIR__ ."/../../vars-fn.php";
echo CJJCtags("/adm/calendario/calendario.js");
?>
<div id='calendario' class='row'>
	<div class='row'>
		<div class='col-12'><h3 class='h3cabecera'>Notificaciones</h3></div>
		<div class='col-12 offset-1' v-if='showAddMenu'>
			<div class='col-12'><h4>Nueva notificación</h4></div>
			<div class='col-12 col-md-6'>
				<label for='comentariosN'>Comentarios:</label>
				<textarea class='form-control' id='comentariosN'></textarea>
				<div class='row'>
					<div class='col'><label for='desdeN'>Desde:</label><input class='form-control' type='date' id='desdeN'></div>
					<div class='col'><label for='hastaN'>Hasta:</label><input class='form-control' type='date' id='hastaN'></div>
				</div>
				<div class='row' style='padding:10px'>
					<div class='col'><input id='chkNotif' type='checkbox'><label for='chkNotif'>Incluir con fecha en listado docente</label></div>
				</div>
				<input type='button' v-on:click='add(true)' value='Ingresar'>
			</div>
		</div>
		<div v-for='(item,key) in arrNotificaciones' class='col-12 row' style='margin: 20px 0;'>
			<div class='col-12'>{{item.fecha}}</div>
			<div class='row'>
				<div class='col-12' v-for='(i,k) in item.notificaciones'>{{i.comentarios}} <i><a v-on:click='del(key,k,true)'>(Borrar)</a></i></div>
			</div>
		</div>
	</div>
	<div class='row'>
		<div class='col-12'><h3 class='h3cabecera'>Docentes ausentes</h3></div>
		<div class='col-12 offset-1'>
			<div class='col-12' v-if='showAddMenu'>
				<div class='col'><h4>Agregar ausente</h4></div>
				<div class='col-12 col-md-6'>
					<label for='docentes'>Docente:</label>
					<select class='form-control' id='docentes'>
						<option disabled selected>Seleccione...</option>
						<option v-for='item in arrDocentes' :value='item.codigo'>{{item.nombre}}</option>
					</select>
					<div class='row'>
						<div class='col'>
							<label for='desde'>Desde:</label>
							<input class='form-control' type='date' id='desde'>
						</div>
						<div class='col'>
							<label for='hasta'>Hasta:</label>
							<input class='form-control' type='date' id='hasta'>
						</div>
					</div>
				</div>
				<input type='button' v-on:click='add()' value='Ingresar'>
			</div>
			<div v-for='(item,key) in arrAusentes' class='col-12 row' style='margin: 20px 0;'>
				<div class='col-12'>{{item.fecha}}</div>
				<div class='row'>
					<div class='col-12' v-for='(i,k) in item.ausentes'>
						<template v-if="i.nombre">{{i.nombre}}</template>
						<template v-else>{{i.comentarios}}</template>
						<i><a v-on:click='del(key,k)'>(Borrar)</a></i></div>
				</div>
			</div>
		</div>
	</div>
</div>