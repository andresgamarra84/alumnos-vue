# Control de llamados a la API (FE ↔ routes.php)

Registro de todos los llamados que hace este frontend a la API (`api.get`, `api.post`, `api.getPDF`, subidas Resumable y `fetch` directo) y de si están declarados en `routes.php` del backend (`CJJC-Backend/routes/routes.php`, solo el bloque activo, sin el bloque comentado de abajo).

## Reglas de mantenimiento

1. **Cada llamado nuevo del FE se agrega a este archivo en el mismo cambio** (rol, entity, action, método y vista).
2. **Cada ruta nueva en `routes.php` actualiza la columna "routes.php"** de la fila correspondiente (FALTA pasa a OK).
3. Si un llamado se elimina del FE, se saca de acá. Si se mueve de rol, se corrige la fila.
4. El método debe coincidir: `api.get`/`api.getPDF` = GET, `api.post` = POST.
5. Las filas con FALTA son deuda: o se declara la ruta, o se implementa el handler, o se quita el llamado (ver "Pendientes").

> **Estado del chequeo en backend:** el chequeo de ruta y método en `index.php` (~líneas 165-173, `exitScript('Ruta no encontrada')` / `'Método no permitido'`) está **comentado**, por lo que hoy `routes.php` no se hace cumplir. Los FALTA no rompen en runtime hasta que se reactive. Reactivarlo es una decisión posterior, **no habilitado todavía**.

Rol: lo decide el backend por el token (`api.js` solo manda `Authorization: Bearer`). Rol inferido por carpeta del FE (`views/admin`, `views/docentes`, `views/estudiantes`); lo compartido (`views/shared/PlanesProgramasView.vue` → docentes y estudiantes; `composables/useCicloLectivo.js` → admin y estudiantes) se asignó a mano. Las acciones numéricas (`inicio/1`, `cambiocatedra/1`, `mesas/2`, `mesas/3`) son claves numéricas de `routes.php`.

Auditoría base: 2026-11-03, 247 puntos de llamada en `src` (excluye `composables/useApiClient.js` y `useMesas.js`, sin importadores, y `MateriasView_old.vue`, sin ruta).

## Rol: admin (136 llamados)

| entity | action | método | routes.php | vistas |
|---|---|---|---|---|
| aulas | getAulas | GET | OK | GrillaHorariosView |
| auth | logout | POST | OK | Dashboard |
| busqueda | getSearchResults | GET | OK | BusquedaView |
| calendario | addAusente | POST | OK | DocentesAusentesView |
| calendario | delAusente | POST | OK | DocentesAusentesView |
| calendario | getAusentes | GET | OK | HomeSection |
| calendario | getAusentesAgrupados | GET | OK | DocentesAusentesView |
| calendario | notificarAusentes | POST | OK | DocentesAusentesView |
| calendario | updAusente | POST | OK | DocentesAusentesView |
| carreras | addCarrera | POST | OK | CarrerasView |
| carreras | delCarrera | POST | OK | CarrerasView |
| carreras | getCarreraInfo | GET | OK | CarrerasView |
| carreras | getCarreras | GET | OK | CarrerasView, PlanesEstudioView |
| carreras | getCarrerasAlumno | GET | OK | ReservasVacanteView |
| carreras | updCarrera | POST | OK | CarrerasView |
| cicloslectivos | getCiclosLectivos | GET | OK | useCicloLectivo, ReservasVacanteView |
| config | getConfig | GET | OK | ConfiguracionView, HomeSection |
| config | setConfig | POST | OK | ConfiguracionView |
| correlativas | corregirCorrelativas | GET | OK | CorrelatividadesView |
| correlativas | getCorrelativas | GET | FALTA | CorrelatividadesView |
| correlativas | getFobaIncompleto | GET | OK | FobaIncompletoView |
| cursos | addCurso | POST | OK | CursosView |
| cursos | delCurso | POST | OK | CursosView |
| cursos | getCursos | GET | OK | GrillaHorariosView, CursosView, ResumenInscriptosView |
| cursos | getInfoCurso | GET | OK | CursosView |
| cursos | updCurso | POST | OK | CursosView |
| cursoshorarios | addCHToPlHorarios | POST | OK | GrillaHorariosView |
| cursoshorarios | addMateriaAsociada | POST | OK | GrillaHorariosView |
| cursoshorarios | delCHFromPlHorarios | POST | OK | GrillaHorariosView |
| cursoshorarios | delMateriaAsociada | POST | OK | GrillaHorariosView |
| cursoshorarios | enviarMensajeCurso | POST | OK | ResumenInscriptosView |
| cursoshorarios | getGrilla | GET | OK | GrillaHorariosView |
| cursoshorarios | getHorariosByCurso | GET | OK | ResumenInscriptosView |
| cursoshorarios | getInfoCursoHorario | GET | OK | GrillaHorariosView |
| cursoshorarios | updPositionCH | POST | OK | GrillaHorariosView |
| cursoshorarios | updWidthCH | POST | OK | GrillaHorariosView |
| correo | delMensaje | POST | OK | PreinscripcionesCorreoView |
| correo | getAdjunto (getPDF) | GET | OK | PreinscripcionesCorreoView |
| correo | getMensaje | GET | OK | PreinscripcionesCorreoView |
| correo | getMensajes | GET | OK | PreinscripcionesCorreoView |
| correo | marcarLeido | POST | OK | PreinscripcionesCorreoView |
| correo | responder | POST | OK | PreinscripcionesCorreoView |
| correo | sincronizar | POST | OK | PreinscripcionesCorreoView |
| data | getCiclos | GET | OK | MateriasView |
| data | getComisiones | GET | OK | GrillaHorariosView |
| data | getDias | GET | OK | GrillaHorariosView |
| docentes | nuevoDocente | POST | FALTA | NuevoDocenteView |
| docingresantes | enviarClave | POST | OK | PreinscripcionesDocumentacionView |
| docingresantes | getFichaPDF | GET | OK | PreinscripcionesDocumentacionView |
| docingresantes | getList | GET | OK | PreinscripcionesDocumentacionView |
| docingresantes | updDocumentacion | POST | OK | PreinscripcionesDocumentacionView |
| estudiantes | addEstudiante | POST | OK | NuevoEstudianteView |
| flyers | delFlyer | POST | OK | FlyersView |
| flyers | getFlyer | GET | OK | FlyersView |
| flyers | getFlyers | GET | OK | FlyersView |
| flyers | saveFlyer | POST | OK | FlyersView |
| horarios | getPDFHorarios | GET | OK | DescargarHorariosView |
| inscripciones | getInscripcionesAlumno | GET | FALTA | SolicitudesConstanciasView |
| instrumentos | getInstrumentos | GET | OK | GrillaHorariosView, ReservasVacanteView |
| libros | getActas | GET | OK | LibrosExamenView |
| libros | getDatosActa | GET | OK | LibrosExamenView |
| libros | getNumeros | GET | OK | LibrosExamenView |
| localidades | getLocalidades | GET | FALTA | NuevoDocenteView, NuevoEstudianteView |
| localidades | getProvincias | GET | FALTA | NuevoDocenteView, NuevoEstudianteView |
| materias | addCorrelativa | POST | OK | PlanesEstudioView |
| materias | addMateria | POST | OK | MateriasView |
| materias | delCorrelativa | POST | OK | PlanesEstudioView |
| materias | delMateria | POST | OK | MateriasView |
| materias | getInfoMateria | GET | OK | MateriasView |
| materias | getMaterias | GET | OK | GrillaHorariosView, MateriasView |
| materias | getMateriasByCiclo | GET | OK | PlanesEstudioView |
| materias | updMateria | POST | OK | MateriasView |
| materias | updPrograma | POST | OK | PlanesEstudioView |
| materiascarreras | addMateriaToCarrera | POST | OK | PlanesEstudioView |
| materiascarreras | delMateriaFromCarrera | POST | OK | PlanesEstudioView |
| materiascarreras | getMateriasByCarreraId | GET | OK | PlanesEstudioView |
| materiascarreras | updMateriaCarrera | POST | OK | PlanesEstudioView |
| mensajes | addMessageToThread | POST | OK | MensajesView |
| mensajes | closeThread | POST | OK | MensajesView |
| mensajes | createGlobalMsg | POST | OK | MensajesView |
| mensajes | createThread | POST | OK | BusquedaView |
| mensajes | getAllThreads | GET | OK | MensajesView |
| mensajes | getGlobalMsgs | GET | OK | MensajesView |
| mensajes | getMessageFromThread | GET | OK | MensajesView |
| mensajes | queueGlobalMsgMail | POST | OK | MensajesView |
| menu | getMenu | GET | OK | Dashboard |
| mesasexamen | addMesa | POST | OK | MesasExamenView |
| mesasexamen | addProfesor | POST | OK | MesasExamenView |
| mesasexamen | borrarProfesor | POST | OK | MesasExamenView |
| mesasexamen | delMesa | POST | OK | MesasExamenView |
| mesasexamen | descargarCitaciones | GET | OK | MesasExamenView |
| mesasexamen | getActaMesa | GET | OK | MesasExamenView |
| mesasexamen | getActasMesas | GET | OK | MesasExamenView |
| mesasexamen | getMesasFromDates | GET | OK | MesasExamenView |
| mesasexamen | updFechaMesa | POST | OK | MesasExamenView |
| mesasexamen | updTipoMateria | POST | OK | MesasExamenView |
| notasmesas | getAlumnosMesa | GET | OK | CalificacionesMesasView |
| notasmesas | getMesas | GET | OK | CalificacionesMesasView |
| notasmesas | getProfesores | GET | OK | CalificacionesMesasView |
| notasmesas | guardarNotas | POST | OK | CalificacionesMesasView |
| notificaciones | addNotificacion | POST | OK | NotificacionesPanelView |
| notificaciones | delNotificacion | POST | OK | NotificacionesPanelView |
| notificaciones | getAll | GET | OK | HomeSection, NotificacionesPanelView |
| novedades | addNovedad | POST | OK | NovedadesView |
| novedades | delNovedad | POST | OK | NovedadesView |
| novedades | getNovedades | GET | OK | NovedadesView |
| planillahorarios | delCurso | POST | OK | GrillaHorariosView |
| planillahorarios | getCursosByTipoMateria | GET | OK | HorariosInstrumentoView |
| planillahorarios | getCursosVigentes | GET | OK | MesasExamenView |
| planillahorarios | getHistorialProfesores | GET | OK | GrillaHorariosView |
| planillahorarios | getProfesoresByCurso | GET | OK | MesasExamenView |
| planillahorarios | getProfesoresByTipoMateria | GET | OK | HorariosInstrumentoView |
| planillahorarios | updPlHorarios | POST | OK | GrillaHorariosView |
| planillas | getPadronEstudiantil | GET | OK | PlanillasView |
| planillas | getPlanillaCuatrimestral | GET | OK | PlanillasView, ResumenInscriptosView |
| planillas | getPlanillaDocentes | GET | OK | PlanillasView |
| planillas | getPlanillaEstudiantes | GET | OK | ResumenInscriptosView |
| planillas | getPlanillaMesas | GET | OK | PlanillasView |
| preinscripciones | delSolicitud | POST | OK | PreinscripcionesVerView |
| preinscripciones | enviarClave | POST | OK | PreinscripcionesVerView |
| preinscripciones | getInscripciones | GET | OK | PreinscripcionesVerView |
| preinscripciones | getResumen | GET | OK | PreinscripcionesVerView |
| profesores | getProfesores | GET | OK | GrillaHorariosView, MesasExamenView, DocentesAusentesView, ReservasVacanteView |
| reservas | delReserva | POST | OK | ReservasVacanteView |
| reservas | getReservas | GET | OK | ReservasVacanteView |
| reservas | updProfesor | POST | OK | ReservasVacanteView |
| reservas | updReserva | POST | OK | ReservasVacanteView |
| solicitudes | getPDFConstancia | GET | OK | SolicitudesConstanciasView |
| solicitudes | listSolicitudesConstancia | GET | OK | SolicitudesConstanciasView |
| usuarios | delUsuario | POST | OK | UsuariosView |
| usuarios | getPermisosUsuario | GET | OK | UsuariosView |
| usuarios | getUsuarios | GET | OK | UsuariosView |
| usuarios | savePermisosUsuario | POST | OK | UsuariosView |
| vacantes | getVacantes | GET | FALTA | HorariosInstrumentoView |
| vacantesingresantes | getVacantes | GET | OK | VacantesIngresantesView |
| vacantesingresantes | updVacante | POST | OK | VacantesIngresantesView |

## Rol: docentes (16 llamados)

| entity | action | método | routes.php | vistas |
|---|---|---|---|---|
| carreras | getCarreras | GET | FALTA | PlanesProgramasView |
| cursos | agregarEstudianteExterno | POST | FALTA | CursoItem |
| cursos | buscarEstudiantePorDni | GET | FALTA | CursoItem |
| cursos | getCursos | GET | OK | HomeSection, ListaEstudiantesView, NotasCursadaView |
| cursos | getEstudiantesInscriptos | GET | OK | ListaEstudiantesView |
| cursos | getEstudiantesParaCalificar | GET | OK | NotasCursadaView |
| cursos | getParametrosCalificacion | GET | OK | NotasCursadaView |
| cursos | puedeAgregarExternos | GET | OK | ListaEstudiantesView |
| cursos | updateFranjaInscripcion | POST | FALTA | ListaEstudiantesView |
| cursos | updCalificacionCursada | POST | OK | NotasCursadaView |
| mesas | 2 | POST | OK | MesasExamenView |
| mesas | 3 | GET | OK | MesasExamenView |
| mesasexamen | getMesasByDocente | GET | OK | MesasExamenView |
| mesasexamen | verDatosMesa | GET | OK | MesasExamenView |
| planesprogramas | getMaterias | GET | FALTA | PlanesProgramasView |
| reservas | getReservas | GET | OK | HomeSection |

## Rol: estudiantes (62 llamados)

| entity | action | método | routes.php | vistas |
|---|---|---|---|---|
| analiticos | getAnaliticoEstudiante | GET | OK | MateriasAprobadasView |
| analiticos | getAnaliticoIntermedia | GET | OK | MateriasAprobadasView |
| analiticos | getIntermediasFinalizadas | GET | OK | MateriasAprobadasView |
| auth | keyBlank | POST | OK | DatosPersonalesView |
| calificaciones | borrarCursada | POST | OK | CursadasAprobadasView |
| calificaciones | getAniosCursados | GET | OK | HistorialCursadasView |
| calificaciones | getCursadasForCarrera | GET | OK | CursadasAprobadasView |
| calificaciones | getHistoricoCursadas | GET | OK | HistorialCursadasView |
| calificaciones | getTrayectoriaExamenes | GET | OK | TrayectoriaAcademicaView |
| cambiocatedra | 1 | POST | OK | HomeSection |
| carreras | addCarrera | POST | OK | CarrerasView |
| carreras | getCarreras | GET | OK | CarrerasView, PlanesProgramasView |
| carreras | getCarrerasAlumno | GET | OK | CursadasAprobadasView, MateriasAprobadasView, CarrerasView, MateriasView, MesasView, SolicitudMesaView, HomeSection |
| carreras | updateCarreraAlumno | POST | OK | CarrerasView |
| cicloslectivos | getCiclosLectivos | GET | OK | useCicloLectivo |
| config | getConfig | GET | OK | HomeSection |
| constancias | addConstanciaEstudiante | POST | OK | EstudianteRegularView |
| constancias | getSolicitudes | GET | OK | HomeSection |
| cursos | listCursosForMateria | GET | OK | MateriasView |
| datospersonales | getDatos | GET | OK | DatosPersonalesView |
| datospersonales | updateDatos | POST | OK | DatosPersonalesView |
| docs | getDocs | GET | OK | DocumentacionView |
| docs | prepareUpload | POST | OK | DocumentacionView |
| examenes | addExamen | POST | OK | MateriasAprobadasView |
| examenes | deleteExamen | POST | OK | MateriasAprobadasView |
| examenes | getCondicionesExamen | GET | OK | MesasView, SolicitudMesaView |
| examenes | getMateriasAprobadas | GET | OK | MateriasAprobadasView |
| examenes | updEspacioExamen | POST | OK | MateriasAprobadasView |
| inicio | 1 | GET | OK | HomeSection |
| instituciones | getInstituciones | GET | OK | ExamenForm |
| instrumentos | getInstrumentos | GET | OK | CarrerasView, HomeSection |
| instrumentos | listInstrumentos | GET | OK | ReservasView |
| localidades | getLocalidades | GET | OK | DatosPersonalesView |
| localidades | getProvincias | GET | OK | DatosPersonalesView |
| materias | confirmarInscripcion | POST | OK | MateriasView |
| materias | getInscripcionesMaterias | GET | OK | HomeSection |
| materias | getMateriasAll | GET | OK | MateriasAprobadasView |
| materias | getMateriasCarrera | GET | OK | MateriasView, MesasView, SolicitudMesaView |
| materias | updateInscripcion | POST | OK | HomeSection |
| mensajes | addMessageToThread | POST | OK | MensajesView |
| mensajes | createThread | POST | OK | MensajesView |
| mensajes | getAllThreads | GET | OK | MensajesView |
| mensajes | getGlobalMsg | GET | OK | HomeSection |
| mensajes | getMessageFromThread | GET | OK | MensajesView |
| mesas | getInscripcionesMesas | GET | OK | HomeSection |
| mesas | inscribirEnMesa | POST | OK | MesasView, SolicitudMesaView |
| mesas | listarMesasDisponibles | GET | OK | MesasView, SolicitudMesaView |
| mesas | updateInscripcion | POST | OK | HomeSection |
| notificaciones | getAll | GET | OK | HomeSection |
| novedades | getNovedades | GET | OK | NovedadesDiariasView |
| planesprogramas | getMaterias | GET | FALTA | PlanesProgramasView |
| reservas | confirmReserva | POST | OK | ReservasView |
| reservas | editReserva | POST | OK | HomeSection |
| reservas | getCarrerasParaReserva | GET | OK | ReservasView |
| reservas | getOpcionesDeReserva | GET | OK | ReservasView |
| reservas | getProfesoresReserva | GET | OK | HomeSection |
| reservas | listReservas | GET | OK | HomeSection |
| reservas | updReserva | POST | OK | HomeSection |
| telegram | generateCode | POST | OK | TelegramView |
| telegram | getStatus | GET | OK | TelegramView |
| telegram | unlinkTelegram | POST | OK | TelegramView |

## Llamados no capturados por la extracción automática (cargados a mano)

| rol | entity | action | método | routes.php | vista |
|---|---|---|---|---|---|
| admin | planillas | getPlanillaEstudiantes / getPlanillaEstudiantesInstrumento | GET (PDF) | OK | PlanillasView |
| admin | estudiantes / profesores | deleteUser | POST | estudiantes OK, **profesores FALTA** | BusquedaView |
| estudiantes | constancias | updSolicitud | POST | **FALTA** | HomeSection |
| estudiantes | mesas | updSolicitud | POST | **FALTA (sin handler)** | HomeSection |
| estudiantes | docs | uploadFile (Resumable) | POST | **FALTA** | DocumentacionView |
| admin | novedades | uploadFile (Resumable) | POST | OK | NovedadesView |
| admin | docingresantes | uploadFile (Resumable) | POST | OK | PreinscripcionesDocumentacionView |
| admin | docingresantes | delFile | POST | OK | PreinscripcionesDocumentacionView |
| admin | flyers | uploadImagenFlyer (`fetch`) | POST | OK | FlyersView |
| todos | login | login, getUsers, updatePwd, recoverUsr | GET/POST | no aplica (whitelist, fuera de routes por diseño) | views/auth |

## Pendientes

### A. Existen en el backend, falta declarar en routes.php
| rol | entity / action | handler |
|---|---|---|
| docentes | cursos / buscarEstudiantePorDni (GET) | docentes/cursos.php |
| docentes | cursos / agregarEstudianteExterno (POST) | docentes/cursos.php |
| docentes | cursos / updateFranjaInscripcion (POST) | docentes/cursos.php |
| docentes | planesprogramas / getMaterias (GET) | docentes/planesprogramas.php |
| docentes | carreras / getCarreras (GET) | docentes/carreras.php |
| estudiantes | planesprogramas / getMaterias (GET) | estudiantes/planesprogramas.php |
| estudiantes | docs / uploadFile (POST) | estudiantes/docs.php |
| estudiantes | constancias / updSolicitud (POST) | estudiantes/constancias.php |
| admin | localidades / getLocalidades, getProvincias (GET) | admin/localidades.php |
| admin | correlativas / getCorrelativas (GET) | admin/correlativas.php |
| admin | inscripciones / getInscripcionesAlumno (GET) | admin/inscripciones.php |
| admin | profesores / deleteUser (POST) | admin/profesores.php |

Potencial (no se dispara hoy): `menu/getMisPermisos` para docentes (`usePermisos` solo se carga en admin y estudiantes).

### B. Falta implementar (ni ruta ni handler)
| rol | entity / action | vista | detalle |
|---|---|---|---|
| admin | docentes / nuevoDocente (POST) | NuevoDocenteView | No existe `admin/docentes.php`. La vista está ruteada y en el menú: el alta de docente no tiene backend. |
| admin | vacantes / getVacantes (GET) | HorariosInstrumentoView | `admin/vacantes.php` solo tiene `getVacantesByProf`. |
| admin | (entity y action vacíos) (POST) x3 | HorariosInstrumentoView | Tres POST sin entity ni action; siempre fallan. Definir qué acciones son o quitar los botones. |
| estudiantes | mesas / updSolicitud (POST) | HomeSection | `estudiantes/mesas.php` no tiene `updSolicitud`; se dispara desde los botones de las líneas ~233 y ~247. |

### C. Rutas declaradas que este FE no llama
- admin: `horarios/getGrilla`.
- docentes: `cursos/getEstudiantesInscriptosTest`.
- `public` e `ingresantes` completos (probablemente los usa otro frontend).
