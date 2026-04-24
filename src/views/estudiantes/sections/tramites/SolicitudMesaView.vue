<template>
    <h3 class='h3cabecera'>Solicitud de mesa de examen</h3>

    <CarrerasSelect
        v-model="selectedCarrera"
        :carreras="carreras"
        @change="onSelectCarrera"
    />
    <MateriasSelect
        v-model="selectedMateria"
        :materias="materias"
        @change="onSelectMateria"
    />
    <div class='col-12 col-md-6'>
        <label>Condición:</label>
        <select id='exCondicion'>
            <option selected disabled>Seleccione una condición</option>
            <option value='0'>Regular/Previo</option>
            <option value='1'>Libre</option>
            <option value='2'>Equivalencia</option>
        </select>
    </div>
	<div v-show='arrProf.length>0'>
		<div style='text-align:center;font-size:18px'>Seleccione el profesor para el cual solicita la mesa. Los horarios de la misma serán informados más adelante.</div>
		<div v-for='(item,key) in arrProf' v-on:click='selProf(key)' class='lista' style='border:1px solid white; margin:10px;padding:10px;'>{{item.contenido}}<br>Prof: {{item.nombreProf}}</div>
	</div>
</template>