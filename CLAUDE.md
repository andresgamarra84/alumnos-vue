# CLAUDE.md

## Control de llamados a la API

`API_CALLS.md` (raíz de este repo) registra todos los llamados del FE a la API y si están declarados en `routes.php` del backend (`CJJC-Backend/routes/routes.php`, solo el bloque activo).

- Cada vez que se agregue, cambie o elimine un llamado a la API (`api.get`, `api.post`, `api.getPDF`, Resumable o `fetch` directo), actualizar `API_CALLS.md` en el mismo cambio: rol, entity, action, método, vista y estado en `routes.php`.
- Cada ruta nueva en `routes.php` actualiza la columna "routes.php" de su fila y la sección "Pendientes".
- No habilitar el chequeo de rutas en `index.php` del backend (hoy comentado) salvo pedido expreso.
- Detalle de las reglas y del criterio de roles: ver el encabezado de `API_CALLS.md`.
