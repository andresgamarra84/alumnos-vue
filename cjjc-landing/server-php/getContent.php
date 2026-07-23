<?php
header('Access-Control-Allow-Origin: https://www.cjjc.edu.ar');
$method = $_SERVER["REQUEST_METHOD"];
if($method=="GET"){
	require __DIR__ ."/./../api/vars-db.php";
	require __DIR__ ."/./../api/constants.php";
	Database::initialize();
	$section = $_GET["s"] ?? "";
	$contenido = [
		"html"=>"La sección solicitada no existe.",
		"js"=>"",
		"css"=>"",
	];
	if ($section== "navBar"){
		require __DIR__ . "/secciones/navbar.php";
		$contenido["html"] = getNavBar();
		echo json_encode($contenido);
	}
	else if ($section== "carrusel"){
		require __DIR__ . "/secciones/carrusel.php";
		$contenido["html"] = getCarrousel();
		echo json_encode($contenido);
	}
	else {
		require __DIR__ . "/arrDirs.php";
		$s = $arrDirs[$section] ?? false;
		if ($s && file_exists("./secciones/$s/index.php")) $contenido["html"] = file_get_contents("./secciones/$s/index.php");
		if ($s && file_exists("./secciones/$s/index.js")) $contenido["js"] = file_get_contents("./secciones/$s/index.js");
		if ($s && file_exists("./secciones/$s/index.css")) $contenido["css"] = file_get_contents("./secciones/$s/index.css");
		//echo file_exists("./secciones/$s");
		echo json_encode($contenido);
	}	
}
?>