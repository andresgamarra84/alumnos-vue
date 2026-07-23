<div id="app" class='container mt-5'>
	<h1 class='mb-4 text-center'>Agenda de actividades</h1>
	<div v-for='entry in entries' :key='entry.codigo' class='col-12 mb-4 p-3 border rounded blog-entry'>
		<h2 class='h4'>{{ entry.titulo }}</h2>
		<img :src="'https://cjjc.edu.ar/api/uploads/novedades/'+entry.img_path" alt="Imagen del blog" v-if="entry.img_path" class="img-fluid">
		<p class='mt-3'>{{ entry.descripcion }}</p>
	</div>
</div>