<?
function getNavBar($i=0) {
	$query = "select * 
	from landing_menu 
	where deleted = 0
	and pertenecea = $i
	order by orden;";
	$resource = Database::$conn->query($query);
	$m = [];
	while ($dato = $resource->fetch_row()) {
		if ($dato[2]==0) { //No es cabecera de submenu
			$m[] = "<li>";
			if ($dato[3]=="" or $dato[3] == "#")$m[] = "<a class='dropdown-item' aria-current='page' href='#' data-cjjc-seccion='$dato[4]'>$dato[1]</a>";
			else $m[] = "<a class='dropdown-item' aria-current='page' href='$dato[3]' target='_blank'>$dato[1]</a>";
			$m[] = "</li>";
		}
		else if ($dato[2]==2) $m[] = "<li><hr class='dropdown-divider'></li>";
		else {
			$m[] = "<li class='dropend'>";
			$m[] = "<a class='dropdown-item' href='#' id='menu_".$dato[0]."' data-bs-toggle='dropdown' data-bs-auto-close='outside' aria-expanded='false'>$dato[1]</a>";
			$m[] = "<ul class='dropdown-menu ulSize' aria-labelledby='menu_".$dato[0]."'>";
			$m[] = getNavBar($dato[0]);
			$m[] = "</ul>";
			$m[] = "</li>";
		}
	}
	return implode("",$m);
}
?>