<?php
function getCarrousel() {
	$query = "select img_path, link, descripcion, duracion*1000 from carrusel where deleted = 0 and oculto = 0 and ((NOW() between fecha_inicio and fecha_fin) or indefinido = 1) order by orden;";
	$recurso = Database::$conn->query($query);
	$html = "";
	$i = 0;
	while ($data = $recurso->fetch_row()){
		$html.="<div class='carousel-item".($i==0?" active":"")."' data-bs-interval='$data[3]'>".($data[1]?"<a href='$data[1]' target='_blank'>":"").
					"<img src='https://cjjc.edu.ar/api/uploads/carrusel/$data[0]"."?version=".time()."' class='carousel-image d-block'>".
					($data[1]?"</a>":"").
					($data[2]?"<div class='carousel-caption d-none d-md-block'>
					<p>$data[2]</p></div>":"").
				"</div>";
		$i++;
	}
	return $html;
}
?>