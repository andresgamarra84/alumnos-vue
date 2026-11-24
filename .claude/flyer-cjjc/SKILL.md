---
name: "flyer-cjjc"
description: Armar flyers de conciertos y eventos del Conservatorio Juan José Castro (cjjc.edu.ar/panel/admin/flyers). Circuito - generar el JSON del flyer, aplicarlo en el panel y después revisarlo y corregirlo visualmente con Claude in Chrome. Usar cuando el usuario pida un flyer, afiche o pieza gráfica de un concierto, audición, muestra o evento del CJJC.
---

# Flyers del CJJC

## Circuito de trabajo (por defecto)
Todo flyer se hace en tres etapas, precedidas de una revisión del panel.

0. **Antes de empezar, mirá el panel** (si hay herramientas de Chrome y una pestaña del panel abierta):
   - **Si el usuario ya cargó una imagen principal, se usa esa imagen.** No busques otra foto. Ver "Imagen cargada por el usuario", abajo.
   - **Si el pedido es "como el de…" o "reutilizá el flyer de…"**, o hay un flyer guardado parecido (mismo tipo de concierto), partí de ese: sección 9.

1. **JSON** (secciones 1, 2, 5, 6 y 8). Pedí los datos, elegí foto, plantilla, borde y paleta, calculá las posiciones y generá el JSON completo. Entregalo siempre (bloque de código y archivo `flyer.json`), aunque después lo apliques vos: es la fuente del flyer y sirve para rehacerlo o versionarlo.
2. **Aplicar el JSON en el panel.** Ofrecé las dos opciones en una línea al entregar el JSON:
   - **Lo pego yo** (si hay herramientas de Chrome y una pestaña del panel abierta): cargalo en el cuadro "Cargar desde JSON" y tocá "Aplicar JSON" (snippet en la sección 3). Si el flyer que está en el panel no es uno que vos aplicaste en esta conversación, preguntá antes, porque Aplicar reemplaza todo.
   - **Lo pega el usuario:** esperá a que avise que lo aplicó. Si pega errores de validación, corregí el campo y devolvé el JSON completo.
   Si el usuario ya dijo cuál prefiere, no vuelvas a preguntar.
3. **Revisión visual y ajustes** (secciones 3 y 7) con Claude in Chrome, viendo el resultado:
   - Confirmá que se aplicó (mensajes de la sección, cantidad de `.campo-texto` y `.bloque-logo`) y que la foto cargó.
   - Mirá el flyer entero (zoom 50%) y **medí** el lienzo: centrado de cada línea y de cada par ícono + texto, separaciones, que nada roce el borde ni se superponga, que el degradé no tape al sujeto.
   - Corregí sobre el lienzo (arrastrar, tamaños, colores, sliders). Si el cambio es grande o de estructura (otra foto, otra plantilla, reordenar bloques), corregí el JSON y volvé a aplicarlo, en vez de hacerlo a mano.
   - Al terminar, mostrá el resultado (captura ampliada) y contá qué ajustaste respecto del JSON. Reflejá los ajustes en el JSON y entregalo de nuevo, para que la fuente coincida con lo que se ve.    - Ofrecé guardarlo en la base con un título corto que diga el tipo de concierto y el mes (por ejemplo, "Audición de cátedras – Octubre"); guardalo solo si el usuario confirma (sección 9).
   - Pedí confirmación antes de "Descargar flyer".

### Imagen cargada por el usuario
- **Cómo detectarla:** hay un input por imagen del área (1 a 3, ver collage en la sección 3): `var fs=[...document.querySelectorAll('input[type=file][accept*="jpeg"]')]`. Los que tengan `files.length > 0` traen una imagen subida (`f.files[0].name`), en orden (Imagen 1, 2, 3). Confirmalo leyendo un píxel de cada celda en el lienzo: el placeholder vacío es gris `#d9d9d9` (217,217,217) con el texto "Imagen principal" (o "Imagen 1", "Imagen 2"…). Si la plantilla es Libre, esos inputs no existen y no hay imagen principal.
- **Guardalas enseguida:** `window.__userFiles = fs.map(f=>f.files[0]||null)`. Aplicar un JSON borra las imágenes subidas (aunque el JSON no traiga `imagenes`, y aunque el input siga mostrando el archivo), así que las vas a necesitar para volver a cargarlas.
- **Usalas para decidir:** leé sus proporciones (`createImageBitmap(...)`) para elegir la plantilla (sección 2, salvo que el usuario haya pedido una) y sacá la paleta de esos archivos (snippet de la sección 3). No agregues crédito salvo que el usuario diga de dónde es la foto y su licencia lo pida.
- **En el JSON:** poné en `imagenes` un ítem por imagen subida **con `url: null`** (así el panel arma la misma cantidad de celdas). Al aplicarlo, el panel muestra "La plantilla necesita todas sus imágenes: cargá las que falten desde "Plantilla".": es esperable.
- **Inmediatamente después de aplicar**, volvé a cargarlas (cada archivo en el input de su posición):
  ```js
  setTimeout(()=>{var fs=[...document.querySelectorAll('input[type=file][accept*="jpeg"]')];window.__userFiles.forEach((file,i)=>{if(!file||!fs[i])return;var dt=new DataTransfer();dt.items.add(file);fs[i].files=dt.files;fs[i].dispatchEvent(new Event('change',{bubbles:true}));});},0);
  ```
  Cada imagen vuelve centrada en su celda (el encuadre del JSON no se aplica): encuadralas arrastrando en la etapa 3. El aviso de "necesita todas sus imágenes" puede quedar visible aunque ya estén; no importa.
- **Al guardar el flyer** (sección 9), el panel sube al servidor las imágenes subidas desde archivo (las comprime a 2 MB como máximo) y les asigna una URL. Desde ahí ya están en el JSON exportado y no hace falta volver a cargarlas.
- **Al entregar el JSON**, aclará que no incluye la imagen porque es un archivo subido: si el usuario lo aplica por su cuenta, tiene que volver a subir la foto después de aplicarlo.
- **Sin Chrome** (variante solo JSON), si el usuario dice que ya cargó una foto (o varias): pedile que la describa o que la adjunte para sacar la paleta y la orientación, poné esos ítems con `url: null` y avisale que las vuelva a subir después de aplicar.

Variantes:
- **Solo JSON:** si no hay herramientas de Chrome, o el usuario pide solo el JSON, hacé la etapa 1 y explicá cómo aplicarlo (8.5). Sin Chrome no podés revisar el resultado: avisalo y ofrecé ajustarlo si el usuario te describe lo que ve o te pega un error.
- **Solo ajustes:** si el usuario ya tiene un flyer cargado y pide cambios, saltá a la etapa 3.
- **Armado manual en el panel** (agregar bloque por bloque, sección 3): solo si el JSON no alcanza para algo (por ejemplo, un PNG o SVG propio que hay que subir como archivo) o si el usuario lo pide.

Todas las etapas comparten las reglas de decisión (2), las fotos (5) y la tipografía (6).

## Panel: dónde se trabaja (etapas 2 y 3)
Se trabaja en la pestaña del usuario (`https://cjjc.edu.ar/panel/admin/flyers`, o el servidor local de desarrollo si el usuario lo tiene abierto) con las herramientas de Claude in Chrome. No hace falta abrir pestañas nuevas. Si el usuario no tiene la sesión iniciada, pedile que entre al panel; nunca pidas ni escribas su contraseña. Un flyer ya armado se puede guardar en el panel desde "Flyers guardados" (una imagen subida desde un archivo no tiene URL).

## 1. Datos a pedir (una sola ronda, con AskUserQuestion)
Fecha, hora, sede/sala, instrumento o tipo de concierto, intérpretes o cátedras (o "alumnos de la cátedra"), programa (opcional), entrada (libre y gratuita / con reserva / arancelada). No preguntes el formato: es 4:5 salvo que el usuario pida otro. Si quiere íconos de contacto (web, Instagram, teléfono, correo), pedí esos datos en la misma ronda.
- Si en "intérpretes" hay un profesor y varias cátedras ("Piano, Conjunto de Cámara y Repertorio del Prof. X"), confirmá si el profesor corresponde a todas o solo a la última: el flyer no debe atribuirle cátedras que no son suyas.

## 2. Reglas de decisión

### Formato e imagen
- **Formato:** 4:5 por defecto (1200×1500). También hay 16:9 (1200×675) y 1:1 (1200×1200).
- **Imagen:** siempre lleva imagen principal. Si el usuario ya cargó una en el panel, es esa (circuito, etapa 0). Si no, preferí una foto realista del instrumento o de la formación (sección 5). Usá una ilustración propia (sección 4) solo si no aparece una foto adecuada o si el usuario la pide.
- **Una foto o collage:** por defecto, una sola foto. Usá un **collage de 2 o 3** cuando el evento junta instrumentos o cátedras que ninguna foto sola representa (por ejemplo, Guitarra + Flauta + Canto) y no hay un instrumento que los una (sección 5), o si el usuario lo pide. Nunca más de 3.
  - Las imágenes se reparten a lo largo del corte: **columnas** en Imagen arriba e Imagen en esquina, **filas** en Imagen al costado. Por eso, para columnas buscá fotos verticales o con el sujeto angosto; para filas, fotos horizontales.
  - Que dialoguen entre sí: brillo y temperatura parecidos (medilos como en la sección 5), mismo tipo de toma (todas primer plano o todas de cuerpo entero). Una foto muy distinta rompe el conjunto. La paleta (fondo, texto, acento) se deriva de la imagen que domine.
  - Por defecto, porciones iguales. Si una foto es la protagonista, dale más lugar con los cortes (`cortesPct`; cada imagen conserva al menos 15 %).
  - Inclinación, curvatura, rasgado y difuminado se aplican sobre el conjunto, solo en el borde que da al área de información; no afectan las divisiones entre imágenes.
  - Con collage subí el Área (55–65 en Imagen arriba) para que cada celda no quede demasiado angosta, y compensá con textos un poco más chicos.
  - En Imagen en esquina, la columna más alejada de la esquina queda recortada por la diagonal: poné ahí la foto con el sujeto más chico o más cerca de la esquina, o usá cortes desparejos (más ancho para esa celda).
  - **Línea divisoria:** 6–12 px del color del fondo (valor por defecto, `color: null`) para un corte limpio; 0 px si las fotos se funden bien entre sí; un color propio (el acento) solo si el diseño lo pide.
- **Paleta clara u oscura:** si el usuario pide una, elegí la foto según eso (sección 5: medir el brillo) en lugar de forzar la paleta sobre una foto que no la acompaña.

### Plantilla según la imagen conseguida
Primero se elige la imagen y después la plantilla:
- **Vertical** (alto ≥ 1,2 × ancho, o el sujeto es alto y angosto: contrabajo parado, músico de cuerpo entero) → **Imagen al costado** (imagen a la izquierda, texto a la derecha).
- **Horizontal** (ancho ≥ 1,2 × alto, o el sujeto es ancho: ensamble, piano de cola, instrumento acostado, escenario) → **Imagen arriba**.
- **Casi cuadrada:** decidí hacia dónde se extiende el sujeto. Si dudás, probá las dos plantillas y quedate con la que recorte menos al sujeto.
- **Sujeto en una esquina o en diagonal** (un violín o una guitarra inclinados, un detalle en primer plano que ocupa una esquina de la foto, fondo liso en el resto) → **Imagen en esquina**, con la esquina en la que está el sujeto en la foto. Da un aire más dinámico que las otras dos; usala también si el usuario pide algo "menos clásico" o "con diagonal".
- La imagen manda: no fuerces una plantilla.
- **Libre** no reserva áreas ni muestra la imagen principal ni los sliders de borde; usala solo si el usuario la pide.

### Encuadre de la imagen
La imagen se recorta para llenar su área sin deformarse. Arrastrala sobre su área del lienzo (o usá `imagenes[i].offsetX/offsetY` en el JSON) para elegir qué parte se ve. En un collage, cada imagen se encuadra por separado dentro de su celda: el arrastre mueve la de la celda donde hacés click.
- Objetivo: el sujeto completo o su parte más reconocible (voluta, cuerpo, manos sobre el instrumento), sin cortes torpes.
- Agarrala lejos de textos e íconos: están por encima de la imagen y se moverían ellos.
- Combiná el encuadre con los sliders para que el corte acompañe la forma del sujeto y deje una columna o franja cómoda para el texto.

### Borde entre la imagen y el fondo
Cuatro parámetros que se combinan; decidí según el estilo:
- **Sobrio / institucional (por defecto):** Área 50–60, Borde 0–25, Inclinación 0, Curvatura 0, Difuminado 0. Corte recto y nítido.
- **Dinámico:** Inclinación ±20–40 o Curvatura ±30–60 que siga la línea del instrumento. No uses las dos al máximo.
- **Rasgado (papel):** Borde 40–70. Con valores altos el corte se vuelve muy irregular y puede comerse el texto. Si el dibujo corta mal al sujeto, tocá "Nuevo rasgado".
- **Fundido con el fondo:** Difuminado 30–70 cuando el borde de la foto tiene un tono parecido al fondo del flyer; queda feo si los tonos son muy distintos. Con Difuminado alto usá Borde 0.
- Revisá siempre que el degradé no tape al sujeto: si lo hace, subí el Área o bajá el Difuminado.
- **Ejemplos probados** (Imagen arriba, 7 bloques de texto, 4 íconos):
  - Foto oscura: Área 42, Borde 0, Difuminado 45, fondo = tono dominante de la foto (#142227).
  - Foto clara (sala luminosa): Área 42, Borde 0, Difuminado 60, fondo blanco cálido (#eeece9).
  - Con 7–8 bloques, Área 40–45 deja lugar para todo; con 50 o más, el texto no entra.
- **Imagen en esquina:** Área 35–45 (la imagen ocupa exactamente ese porcentaje del lienzo y el texto va en el resto, que es una forma en L/triángulo opuesta a la esquina). Inclinación y curvatura moderadas (±30): el corte ya es diagonal. El difuminado se aplica solo sobre la diagonal.

### Paleta derivada de la imagen
No hay paleta fija. El fondo y los colores de textos e íconos salen de la imagen elegida:
1. Extraé los colores dominantes (snippet de la sección 3) y el color promedio de la última fila de la foto (el borde que toca el área de información).
2. **Fondo de información:** un tono de la imagen llevado a muy claro (tinte casi blanco del color dominante) o a muy oscuro (el tono más profundo), lo que mejor dialogue con el borde de la foto. Con Difuminado, partí del tono del borde de la foto.
3. **Texto principal** (título, fecha, sala): el tono más oscuro sobre fondo claro, o el más claro sobre fondo oscuro.
4. **Acento** (nombre del conservatorio, hora, entrada, íconos): el color más saturado o característico de la imagen (la madera de un instrumento, un detalle de luz). Si la foto es casi neutra, tomá el tono más cálido (cortinas, piso) y oscurecelo hasta que cumpla contraste.
5. **Contraste:** texto mínimo 4,5:1 contra el fondo; íconos mínimo 3:1. Si el acento no llega, oscurecelo o aclaralo sin cambiar su tono.
6. **Tono secundario** (intérpretes/cátedras): un intermedio entre el texto principal y el fondo, que siga cumpliendo 4,5:1.

## 3. Cómo es la página

### Distribución
- Dos columnas: panel de opciones (`.controles`) a la izquierda, 1/3 del ancho, y lienzo (`.lienzo-panel > .lienzo-scroll > canvas`) a la derecha, 2/3. Solo en pantallas < 640 px el lienzo baja debajo de las opciones.
- **El lienzo no queda fijo:** al bajar por el panel sale de la vista. Antes de cada captura, zoom o arrastre, volvé arriba con `scrollTo(0,0)` y `document.scrollingElement.scrollLeft=0`.
- Secciones (se pliegan al hacer click en su título; si un control no aparece, desplegá su sección): Formato, Plantilla, Fondo, Logos e imágenes, Íconos, Contenido, Flyers guardados / JSON. Al final, "Descargar flyer".
- El panel tiene modo claro y oscuro (botón arriba a la derecha); no cambia el flyer.

### Controles
- **FORMATO:** botones 4:5, 16:9, 1:1.
- **PLANTILLA:** botones Libre, Imagen arriba, Imagen al costado, Imagen en esquina. Al elegir una distinta de Libre aparecen "Imagen principal (PNG o JPG)" y los sliders de borde. Con Imagen en esquina aparece además "Esquina" con cuatro botones: "↖ Sup. izq.", "↗ Sup. der.", "↙ Inf. izq.", "↘ Inf. der." (no agregan `range`).
- **Imágenes del área:** botones "1 imagen", "2 imágenes", "3 imágenes". Al cambiar la cantidad, los cortes vuelven a porciones iguales; las imágenes ya cargadas en las primeras posiciones se conservan.
- **Inputs de imagen:** uno por imagen, `input[type=file][accept*="jpeg"]`, rotulados "Imagen principal (PNG o JPG)" con 1 imagen, o "Imagen 1 (PNG o JPG)", "Imagen 2…" con collage. No aceptan SVG. No los busques por posición global: con Libre no existen y los demás `input[type=file]` (logos PNG, SVG propio, `.json`) quedan primeros; usá `querySelectorAll` con ese selector y el índice de la imagen.
- **Collage** (solo con 2 o 3 imágenes), antes de "Área de imagen":
  - "Tamaño de cada imagen": un slider "Corte 1" (y "Corte 2" con 3 imágenes), en % del largo del área; cada imagen ocupa al menos 15 %. Debajo, el texto "Reparto (…): 50% / 50%".
  - "Línea divisoria": slider "Grosor" (0–30 px, por defecto 8) y botones "Color del fondo" / "Otro color" (este último muestra `input[type=color][title="Color de la línea divisoria"]`). Con fondo de imagen, "Color del fondo" usa blanco.
- **Sliders de la plantilla** (solo con plantilla distinta de Libre). **Con collage, los sliders de Corte y Grosor aparecen antes y corren los índices**, así que buscalos por su etiqueta (helper `sliderPor` de abajo), no por posición:
  - **Área de imagen** (etiqueta "Área de imagen") (35–75, por defecto 60). Porcentaje del alto (arriba), del ancho (costado) o del lienzo entero (esquina).
  - **Borde** (etiqueta "Recto"), de Recto a Rasgado (0–100, por defecto 40). "Nuevo rasgado" sortea otra forma (deshabilitado en 0).
  - **Inclinación** (etiqueta "Inclinación") (−100 a 100, por defecto 0). Costado: positivo = el corte se corre a la derecha al bajar. Arriba: positivo = el corte baja hacia la derecha. Esquina: gira la diagonal (un signo da más imagen sobre el lado horizontal; el otro, sobre el vertical; el sentido se espeja según la esquina).
  - **Curvatura** (etiqueta "Curvatura") (−100 a 100, por defecto 0). Costado: negativo se curva a la izquierda. Arriba: negativo se curva hacia arriba. Esquina: negativo se curva hacia la esquina; positivo, hacia el centro del flyer.
  - **Difuminado** (etiqueta "Definido"), de Definido a Difuminado (0–100, por defecto 0).
  - Doble click en Inclinación o Curvatura los vuelve a 0.
  - Sin collage son los 5 primeros `range`; con collage, los 5 que siguen a Corte y Grosor. Los `range` posteriores son de logos e íconos (opacidad, fondo), no de la plantilla.
- **FONDO:** "Color" / "Imagen propia". En Color: swatches y `input[type=color][title="Color de fondo personalizado"]`. El área de información usa este fondo.
- **LOGOS E IMÁGENES:** "+ Agregar imagen PNG" (`input[type=file]` oculto, varios a la vez). En producción su `accept` es solo `image/png`: los SVG van por "+ Agregar SVG propio".
- **ÍCONOS:** botones `.btn-icono` con `title="Agregar <nombre>"` (sin aria-label): Ubicación, Fecha, Horario, Teléfono, Correo, Web, Entradas, Instagram, Música. Más "+ Agregar SVG propio" (`input[type=file][accept*=svg]`).
- **CONTENIDO:** botón "+ Agregar texto".
- **FLYERS GUARDADOS / JSON:** un `<select>` "Elegí un flyer para cargarlo" (los flyers guardados en la base; al elegir uno se carga en pantalla), un campo "Título del flyer" con "Guardar" (si hay uno cargado: "Guardar como nuevo", "Actualizar" y "Eliminar"; ver sección 9), y "Cargar desde JSON": un `textarea` (placeholder "Pegá acá la especificación del flyer en JSON..."), "Aplicar JSON" y "Abrir archivo .json" (`input[type=file][accept*=json]`). Aplicar reemplaza todo el flyer, incluidos los logos subidos y la imagen principal subida desde un archivo (ver "Imagen cargada por el usuario"). Cargar un flyer guardado también reemplaza el actual: preguntá antes si hay algo sin guardar. Los errores de validación aparecen en esa misma sección, uno por campo (por ejemplo `iconos[1].tamano: debe estar entre 0.05 y 3 (recibido 3.5)`), y si la foto es CC BY muestra la línea "Crédito de la foto: …" (solo en el panel, no en el flyer).
- **Zoom** (encima del lienzo): − (Alejar), valor, + (Acercar), "Ajustar". Pasos de 10, entre 25% y 200%.

### Bloques de logo e ícono (`.bloque-logo`)
Cada PNG, ícono o SVG agregado crea un bloque en "Logos e imágenes", titulado con su nombre (o el del archivo sin extensión):
- casilla de visibilidad y 🗑 (`.btn-quitar-texto`, title "Quitar imagen");
- Color: "Original" / "Recolorear", swatches y `input[type=color]` (title "Color personalizado de la imagen"). Los íconos entran en Recolorear, azul `#1b2452`;
- Opacidad (5–100);
- Tamaño: −, + y ↔ (centra horizontalmente). Rango 0,05–3. Cada click **multiplica o divide por 1,2** (0,15 → 0,18 → 0,216 → 0,259…), así que los pasos son proporcionales al tamaño. Al cambiar el tamaño quedan fijos el centro horizontal y el borde superior del cuadrado. Desde el botón "Agregar …" los íconos entran en 0,15 (~34 px de dibujo): para el tamaño recomendado de ~0,25, dales 3 clicks en +;
- Fondo: "Transparente" / "Color" (Circular / Rectangular, swatches, color, opacidad y difuminado del borde).

### Bloques de texto (`.campo-texto`)
- un `textarea` (saltos de línea con \n);
- 🔤 (`.btn-fuente`), que abre un `<select>` con las fuentes del sistema (Garamond, Book Antiqua, Franklin Gothic, Bahnschrift, Georgia, etc.; si no se pueden leer: Arial, Georgia, Times New Roman, Verdana, Courier New, Impact, Comic Sans MS);
- 🗑 (`.btn-quitar-texto`, title "Quitar texto");
- swatches y `input[type=color]`;
- Tamaño: −, + y ↔. Cada click cambia 0,1 (rango 0,4–3; base 1,0 = 48 px);
- alineación: Izq, Centro, Der.

### Particularidades
- El flyer se dibuja en un único `<canvas>` (1200 de ancho en todos los formatos). Imagen, textos e íconos no están en el DOM: se mueven arrastrando sobre el lienzo (`left_click_drag`). Capas: textos arriba, logos/íconos en el medio, imagen abajo.
- **Dónde aparecen los elementos nuevos:** los textos, centrados en el área de información y superpuestos (en Imagen en esquina, en la mitad vertical opuesta a la esquina y corridos 216 px hacia el lado libre). Los íconos, PNG y SVG, arriba al centro del flyer (sobre la foto), cada uno nuevo ~40 px más abajo.
- **Cómo se mueven los textos al cambiarlos:** el tamaño crece o se achica alrededor del centro del bloque. Al pasar a "Izq", el borde izquierdo queda donde estaba el centro.
- **Arrastrar elementos superpuestos:** se agarra el de capa superior (texto antes que ícono; entre textos, el agregado último). Agarrá el de abajo por una parte que el otro no tape.
- **Ver el flyer entero:** con la página arriba, bajá el zoom a 50% (5 clicks en − desde 100%; los botones de zoom no responden a `.click()` por JS, usá clicks reales). "Ajustar" vuelve al 100%, no encaja.
- **Ubicar el flyer en pantalla:** `document.querySelector('canvas').getBoundingClientRect()` es el flyer completo. Usalo para la acción zoom y para convertir coordenadas: `x_pantalla = rect.x + x_flyer × rect.width / 1200` (igual en y con el alto del formato).
- **Medir en vez de mirar:** el canvas se puede leer con `getContext('2d').getImageData(0,0,1200,H)`. Comparando cada píxel con el color de fondo se obtienen los bordes reales de cada línea o ícono (snippet abajo). Es la forma confiable de verificar centrados y separaciones.
- "Descargar flyer" queda deshabilitado si falta alguna de las imágenes del área (plantilla distinta de Libre; con collage, todas) o la imagen de fondo (modo Imagen propia).
- Es una app Vue sin devtools: no toques su estado interno, usá eventos. Si la página se recarga, se pierden el flyer y los helpers guardados en `window`.

### Atajos por JavaScript (javascript_tool)
**Importante:** cuando el código dispara algo que hace re-renderizar a Vue (un click, el `change` de un file input), javascript_tool suele responder "failed in the extension", y el cambio a veces se aplica y a veces no. Por eso:
- envolvé esas acciones en `setTimeout(()=>{…},0)` y devolvé un string simple ('ok'); verificá el resultado en una llamada aparte;
- no declares `const`/`let` al nivel superior (chocan entre llamadas): usá `var` con nombres nuevos o una IIFE; guardá helpers y blobs en `window.__…`;
- no mezcles `await` con clicks; un `await fetch(...)` sí funciona. Si una tarea larga (muchos fetch) falla, lanzala en una `async` IIFE que escriba en `window.__…` y leé el resultado en otra llamada;
- si la respuesta sale `[BLOCKED: Cookie/query string data]`, el texto devuelto tenía algo parecido a una URL con parámetros (títulos de Commons, descripciones): limpialo con `.replace(/[^A-Za-z0-9 ,.()-]/g,'_')` antes de devolverlo;
- en browser_batch, para sacar el cursor del lienzo usá `hover` (`mouse_move` no existe y hace fallar el batch).

```js
var setVal=(el,v)=>{Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el),'value').set.call(el,v);el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));};
window.__setVal=setVal;
// Slider por su etiqueta: "Área de imagen", "Recto", "Inclinación", "Curvatura", "Definido", "Corte 1", "Corte 2", "Grosor".
// Toma el primero: los de la plantilla están antes que los de logos (que también usan "Opacidad", "Difuminado del borde"…).
var sliderPor=t=>[...document.querySelectorAll('.campo-slider')].find(d=>d.querySelector('label')?.innerText.trim()===t)?.querySelector('input[type=range]');
window.__sliderPor=sliderPor;
var txtBlock=t=>t.closest('.campo-texto');
var logoBlock=n=>[...document.querySelectorAll('.bloque-logo')].find(b=>b.innerText.startsWith(n));
var btnIn=(blk,txt)=>[...blk.querySelectorAll('button')].find(b=>b.innerText.trim()===txt);
var clickN=(btn,n)=>{for(let k=0;k<n;k++)setTimeout(()=>btn.click(),k*60);};
```
- **Buscá siempre dentro del bloque:** las listas globales de `range` y `color` crecen con cada logo o ícono. Globales seguros: los sliders de la plantilla por su etiqueta (`sliderPor`), el color de fondo y el de la línea divisoria por su title.
- **Aplicar un JSON (etapa 2):**
  ```js
  var TA=[...document.querySelectorAll('textarea')].find(t=>/JSON/.test(t.placeholder));
  setTimeout(()=>{window.__setVal(TA,JSON.stringify(window.__spec));
    setTimeout(()=>[...document.querySelectorAll('button')].find(b=>b.innerText.trim()==='Aplicar JSON').click(),100);},0);
  ```
  Si el JSON tiene un error de validación, no se aplica nada y el flyer anterior queda intacto. La imagen tarda ~2–3 s en bajar. Después leé los mensajes de la sección (`TA.closest('.seccion-body').innerText`) por si hubo errores, y contá `.campo-texto` y `.bloque-logo` para confirmar.
- **Agregar todos los textos de una vez** (armado manual):
  ```js
  window.__specs=[['CONSERVATORIO\nJUAN JOSÉ CASTRO','Franklin Gothic','#hex'], ['Título\nen dos líneas','Garamond','#hex'] /* … */];
  window.__log=[];
  window.__addOne=i=>{if(i>=window.__specs.length){window.__log.push('done');return;} var sp=window.__specs[i];
    [...document.querySelectorAll('button')].find(b=>b.innerText.includes('Agregar texto')).click();
    setTimeout(()=>{var ta=[...document.querySelectorAll('.campo-texto textarea')].pop(), blk=ta.closest('.campo-texto');
      window.__setVal(ta,sp[0]); window.__setVal(blk.querySelector('input[type=color]'),sp[2]);
      blk.querySelector('.btn-fuente').click();
      setTimeout(()=>{var sel=blk.querySelector('select'), o=sel&&[...sel.options].find(o=>o.text.includes(sp[1]));
        if(o) window.__setVal(sel,o.value); window.__log.push(i+':'+(o?o.value:'sin fuente'));
        setTimeout(()=>window.__addOne(i+1),150);},200);},250);};
  setTimeout(()=>window.__addOne(0),0);
  ```
  (Usá `.campo-texto textarea`: el cuadro del JSON también es un `textarea`.) Tamaños de referencia para 4:5 con 7 bloques: encabezado 0,6, título 1,7, cátedras 0,8, fecha 0,9, hora 1,6, sala 0,8, entrada 0,8.
- **Agregar un ícono:** `window.__addIcon=n=>{document.querySelector('.btn-icono[title="Agregar '+n+'"]').click(); setTimeout(()=>{var b=logoBlock(n); setVal(b.querySelector('input[type=color]'),'#hex'); clickN(btnIn(b,'+'),3);},250);};` (entra en 0,15; con 3 clicks queda en ~0,26). Agregá **un ícono por vez** y arrastralo a su lugar antes del siguiente.
- **Medir un elemento que está sobre la foto:** sacá una copia de `getImageData`, ocultalo con la casilla de su bloque (o agregalo), sacá otra copia y compará píxel a píxel. Los píxeles que cambian son el elemento. Volvé a marcar la casilla.
- **Cambiar la paleta de un flyer ya armado:** recorré `.campo-texto` y `.bloque-logo` en orden y hacé `setVal` sobre el `input[type=color]` de cada uno, más el color de fondo. Las posiciones no cambian.
- **Imagen desde un Blob:** `new File([blob],'img.jpg',{type})`, `DataTransfer`, `input.files=dt.files` y `setTimeout(()=>input.dispatchEvent(new Event('change',{bubbles:true})),0)`.
- **Paleta de una imagen:** dibujá el blob en un canvas de 64×64, leé `getImageData`, cuantizá cada canal en pasos de 32, contá, ordená por frecuencia y devolvé los 6–8 principales con luminancia y saturación, más el promedio de la última fila.
- **Medir líneas del flyer:** recorré las filas de `getImageData` desde el inicio del área de información; una fila tiene "tinta" si algún píxel difiere del fondo en más de ~90–120 (suma de |ΔR|+|ΔG|+|ΔB|). Agrupá filas consecutivas en líneas y devolvé `[y0, y1, xIzq, xDer, centro]`. Para separar ícono y texto en la misma línea, buscá el hueco de columnas sin tinta entre ellos (uniendo tramos separados por menos de ~14 px, que son letras de la misma palabra).
- **Con Difuminado, la comparación contra el fondo se contamina:** el degradé de la foto cuenta como tinta y las líneas aparecen empezando en el borde del área (por ejemplo, todas en x = 640). Si el texto es oscuro sobre fondo claro, contá solo los píxeles oscuros (`(R+G+B)/3 < 150`). Si el texto es claro sobre fondo oscuro, contá solo los claros (`> 110`). Medí por franjas horizontales, una por par ícono + texto, y verificá que el centro del par caiga en el eje del área de información: x = 600 en Imagen arriba, o el centro de la columna en Imagen al costado.
- **Ajustes finos arrastrando:** a zoom 50% cada píxel de pantalla son ~3 px del flyer, así que un arrastre de 2–4 px de pantalla corrige 6–12 px. Mové el ícono y el texto del par por separado (el texto se agarra por su centro, el ícono por su centro).

## 4. Ilustración propia y SVG

### Imagen principal ilustrada (alternativa a la foto)
La imagen principal no acepta SVG. Armá el SVG y dibujalo en un canvas: 960×2000 para el costado, o 2000×1100 aprox. para arriba. Después cargalo como PNG con el método de imagen desde un Blob. (El JSON no la admite: en la etapa 3 subila por JavaScript, o avisá que hay que subirla a mano.)

### Detalles con "+ Agregar SVG propio"
Para adornos que no están entre los íconos: un separador con un punto o una clave de sol, un pentagrama fino, una silueta chica del instrumento.
- Dibujalo **en un solo color** (fill o stroke negro), así "Recolorear" lo lleva al color de la paleta.
- Poné `xmlns`, `viewBox` y además `width`/`height` explícitos: sin ellos entra diminuto. Aun así entra chico; un separador de ancho medio lleva ~10 clicks en +.
- Nada de fuentes, imágenes ni referencias externas dentro del SVG.

## 5. Fotos realistas (Wikimedia Commons)
Si hay una pestaña del panel abierta, buscá desde la página con `fetch` (la API acepta `origin=*`): así podés medir el brillo y la paleta de las candidatas antes de escribir el JSON. Si no, usá tus herramientas de búsqueda web.
```js
var u='https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrnamespace=6&gsrlimit=30&gsrsearch='+encodeURIComponent('grand piano filetype:bitmap')+'&prop=imageinfo&iiprop=size|extmetadata|url&iiurlwidth=200';
```
- Probá varias búsquedas: el instrumento en inglés, italiano o alemán ("Konzertflügel", "pianoforte a coda"), marcas ("Steinway", "Bösendorfer", "Yamaha grand piano"), "player", "orchestra", "close-up", "concert hall", "stage". Sumar "Unsplash" trae fotos contemporáneas en CC0.
- Filtrá por `.jpg`, licencia (CC0 / Public domain primero; CC BY y BY-SA si no hay otra), ancho ≥ 1600 y orientación (ancho ≥ 1,15 × alto para Imagen arriba).
- **Medí el brillo** de las miniaturas (promedio de un canvas de 32×32, y aparte el de las últimas filas) y ordená: para una paleta clara elegí promedio ≥ 150 y borde inferior claro; para una oscura, ≤ 100.
- **Que el instrumento sea inconfundible:**
  - Descartá teclados electrónicos (perillas, LEDs) y fotos con la marca muy visible.
  - Cuidado con los **instrumentos de época**: la serie "Grand Piano MET …" del Metropolitan Museum (CC0, fondo neutro) son pianos antiguos (Cristofori 1720, fortepianos) que a simple vista se leen como clavecines. No los uses para "piano" salvo que el evento sea de música antigua. Revisá `extmetadata.ObjectName` y `DateTimeOriginal`.
  - Para "piano", buscá un piano de cola moderno negro (tapa abierta) o un primer plano de teclado acústico.
- Si el evento junta varias cátedras, elegí el instrumento que las une (por ejemplo, el piano para Piano + Conjunto de Cámara + Repertorio). Una partitura sobre un piano acústico funciona para audiciones.
- Para usarla, pedí `iiprop=url&iiurlwidth=1200` y usá `thumburl`. Hoy la API devuelve miniaturas en `thumb.wikimedia.org` y redondea el ancho a un tamaño estándar (1200 → 1280); el panel las acepta igual.
- **Limpiá la URL:** `thumburl` viene con parámetros de seguimiento (`?utm_source=…&utm_campaign=…`). Quitales todo desde `?` (`url.split('?')[0]`) antes de ponerla en el JSON. Esos parámetros son además los que hacen que javascript_tool devuelva `[BLOCKED: Cookie/query string data]`. Los caracteres codificados del nombre (por ejemplo `%26` por `&`) se dejan como están.
- **Para Imagen al costado** buscá fotos con alto ≥ 1,2 × ancho y alto ≥ 1500, y medí el brillo del **borde derecho** (las últimas columnas), que es el que toca el área de información. Las verticales de piano en CC0 son escasas (salen sobre todo tapas de partituras): es normal terminar en CC BY / BY-SA. Probado: "Kissingen Steinway & Sons piano 0417RM0613.jpg" (Ermell, CC BY-SA 4.0), piano de frente con banqueta sobre madera clara.
- **Mirá el borde del corte:** revisá con zoom la franja donde la foto se funde o se corta. Las personas en la foto están bien (un pianista, un ensamble), pero evitá que el corte o el degradé dejen **fragmentos** que distraigan: un reflejo de alguien en la tapa del piano, media cara, una mano suelta, un cartel con texto. Si aparece, corré el encuadre (`imagenes[i].offsetX/offsetY` o arrastrando), ajustá el Área o subí un poco el Difuminado hasta que quede entero o desaparezca.
- Antes de decidir, previsualizá la foto cargándola en el panel y revisá la captura.
- **Crédito:** si la licencia es CC BY o BY-SA, leé el autor (`extmetadata.Artist`, sin HTML), avisá al usuario y agregá al flyer una línea chica abajo a la derecha: "Foto: <autor> · <licencia>" (Franklin Gothic, tamaño 0,4, gris medio, `align: right`, `offsetX: 580`, `yBase` ≈ 0,993 en 4:5). Si el usuario la quita, el crédito tiene que ir en el texto de la publicación.

## 6. Tipografía, jerarquía e íconos
Orden de los bloques en el área de información:
1. CONSERVATORIO / JUAN JOSÉ CASTRO (o los conservatorios que organizan): sans (Franklin Gothic), acento, chico (0,6).
2. Título: serif (Garamond), texto principal, grande (1,6–1,8), en 2 líneas.
3. Intérpretes / cátedras: serif, tono secundario (0,8).
4. DÍA / FECHA: sans, texto principal (0,9).
5. HORA: serif, acento, grande (1,6).
6. Sala · Sede (y dirección en una segunda línea): sans (0,8).
7. Condición de entrada: sans, acento (0,8).
8. Contacto (si lo hay): web, Instagram, teléfono o correo, sans, chico, en una fila al pie.
9. Crédito de la foto, si hace falta (sección 5).

Con la plantilla **Imagen arriba**, la franja de texto queda abajo y es más ancha que alta: se puede agrupar en dos columnas o filas, o usar la composición recomendada de abajo.

### Íconos como acompañamiento (opcionales, pero recomendados)
- **Cuáles:** Ubicación junto a Sala · Sede; Fecha (calendario) junto al día; Horario (reloj) junto a la hora; Entradas junto a la condición de entrada; Instagram / Web / Teléfono / Correo en la fila de contacto. Música o un SVG propio, como único adorno.
- **Cuántos:** 3–4 íconos de datos, más a lo sumo un adorno. Si ponés ícono a un dato de un grupo (fecha, hora, sala), ponéselo a todos.
- **Color:** el acento o el del texto que acompañan, todos iguales; nunca el azul por defecto salvo que coincida con la paleta. Opacidad 100% para los de datos; 40–70% para un adorno.
- **Tamaño:** todos los de datos iguales. **0,25** (≈ 55 px de dibujo) es el tamaño probado junto a textos de datos de 0,8–1,6: un poco más alto que las mayúsculas, se lee como ícono y no como adorno. Rango útil 0,2–0,3. `fs/300` (≈ 0,15 con texto de 0,9) da un ícono del alto exacto de las mayúsculas: correcto, pero se ve chico.
- **Composición recomendada (probada):** encabezado, título y cátedras centrados; abajo, una línea por dato (fecha, hora, sala, entrada), cada una formada por **ícono + separación + texto alineado a la izquierda**.
  - **Centrá cada par como unidad:** el centro del conjunto (desde el borde izquierdo del dibujo del ícono hasta el borde derecho del texto) va en x = 600. Si solo alineás los textos a una columna común, las líneas cortas (la hora) quedan corridas a la izquierda y el bloque se ve descentrado.
  - Separación ícono–texto: ~15–20 px de hueco visible. Ícono centrado en la altura de su línea (o del par de líneas, en la sala).
  - En la etapa 3, verificá midiendo el lienzo (sección 3): el centro de cada línea tiene que quedar a ±3 px de 600.
- **Texto centrado con ícono encima:** alternativa válida si no querés pares; el ícono va centrado sobre su dato.
- **Fondo del ícono:** Transparente en el área de información. Color Circular solo si queda sobre la foto o le falta contraste.

Además:
- Partí en dos líneas cualquier texto que roce el borde.
- Cada vez que cambies área, inclinación, curvatura o difuminado, revisá y reacomodá textos e íconos.

## 7. Cierre (etapa 3)
- Volvé arriba (`scrollTo(0,0)`, `scrollLeft=0`), sacá el cursor del lienzo (`hover` afuera) y verificá con la acción zoom sobre el rect del canvas; para el centrado, medí (sección 3).
- Revisá que no quede ningún ícono o SVG olvidado arriba al centro ni bloques de prueba en "Logos e imágenes".
- Antes de tocar "Descargar flyer", pedí confirmación al usuario, porque baja un archivo. Si después de la confirmación cambiás algo importante (por ejemplo, la foto), mencionalo al entregar.
- Cambiar foto o paleta reemplaza la versión anterior en el panel: si el usuario puede querer ambas, ofrecé descargar o exportar el JSON antes de cambiar.
- En la respuesta, mencioná la fuente, el autor y la licencia de la foto.

---

# Modo JSON

Generás la especificación del flyer; el panel la valida, descarga la imagen y arma todo. Sin herramientas de Chrome no ves el resultado: las posiciones se calculan con las fórmulas de la sección 8.3 (verificadas midiendo el lienzo) y el usuario puede retocar a mano después. Seguí las reglas de decisión de la sección 2 y la jerarquía de la sección 6.

## 8.1 Esquema
```json
{
  "version": 1,
  "formato": "4:5",
  "plantilla": "horizontal",
  "esquina": "superior-izquierda",
  "imagenes": [
    {
      "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Archivo.jpg/1280px-Archivo.jpg",
      "offsetX": 0, "offsetY": 0,
      "autor": "Nombre", "licencia": "CC BY-SA 4.0", "fuente": "https://commons.wikimedia.org/wiki/File:Archivo.jpg"
    }
  ],
  "collage": { "cortesPct": [], "divisor": { "grosorPx": 8, "color": null } },
  "borde": { "areaPct": 55, "rasgadoPct": 0, "inclinacionPct": 0, "curvaturaPct": 0, "difuminadoPct": 0 },
  "fondo": { "tipo": "color", "color": "#f4ecd8" },
  "textos": [
    { "valor": "Título", "fuente": "Garamond", "color": "#1b2452", "tamano": 1.6, "align": "center", "yBase": 0.7, "offsetX": 0, "offsetY": 0 }
  ],
  "iconos": [
    { "icono": "reloj", "color": "#8a6d3b", "tamano": 0.25, "opacidadPct": 100, "offsetX": -250, "offsetY": 700 }
  ]
}
```
Todos los campos son opcionales salvo lo que se quiera mostrar; los que falten toman el valor por defecto. Rangos (el panel rechaza lo que se salga, con un mensaje por campo):
- `formato`: "4:5" | "16:9" | "1:1". `plantilla`: "libre" | "horizontal" (imagen arriba) | "vertical" (imagen al costado) | "esquina" (imagen en una esquina, corte diagonal).
- `esquina` (solo con plantilla "esquina"; se ignora con las demás): "superior-izquierda" (por defecto) | "superior-derecha" | "inferior-izquierda" | "inferior-derecha". Al exportar, el panel solo lo incluye si la plantilla es "esquina".
- `borde.areaPct` 35–75 (60); `rasgadoPct` 0–100 (40; ponelo en 0 para un corte recto); `inclinacionPct` y `curvaturaPct` −100 a 100 (0); `difuminadoPct` 0–100 (0).
- En "esquina", la foto se recorta para cubrir el rectángulo que contiene la región de la esquina (no el lienzo entero): el sujeto tiene que estar en la parte de la foto que cae en la esquina, y con `offsetX/offsetY` se corre dentro de ese rectángulo.
- `imagenes`: lista de **1 a 3** imágenes, en orden (izquierda → derecha en Imagen arriba y en esquina; arriba → abajo en Imagen al costado). Con 1 ocupa toda el área; con 2 o 3 es un collage. Cada ítem:
  - `url`: **https** obligatoria para la plantilla no libre (con `null` el usuario tiene que subir esa imagen a mano). Sirven `upload.wikimedia.org`, `thumb.wikimedia.org` y las URLs que devuelve el panel al guardar.
  - `offsetX/offsetY`: encuadre en px dentro de su celda (−5000 a 5000); se limita solo a lo que sobresale de la imagen, así que ante la duda dejá 0.
  - `autor`, `licencia`, `fuente`: crédito (texto; opcionales).
  - Formato anterior, todavía válido: `"imagen": { …un ítem… }` equivale a `"imagenes": [ … ]` con una sola. Si vienen los dos, manda `imagenes`. El panel exporta siempre `imagenes`.
- `collage` (solo se usa con 2 o 3 imágenes; opcional):
  - `cortesPct`: posición de cada corte en % del largo del área, ascendente: 1 valor con 2 imágenes, 2 con 3 (con 1 imagen, `[]` u omitido). Cada imagen tiene que ocupar al menos 15 % (por ejemplo, con 3: `[30, 70]` sirve, `[10, 50]` no). Por defecto, porciones iguales (`[50]` o `[33, 67]`).
  - `divisor.grosorPx` 0–30 (8); `divisor.color` `null` (el color del fondo; blanco si el fondo es imagen) o `#rrggbb`.
- `fondo`: `{ "tipo": "color", "color": "#rrggbb" }` o `{ "tipo": "imagen", "url": "https://..." }`.
- Textos: `color` `#rrggbb` (6 dígitos), `tamano` 0.4–3, `align` "left" | "center" | "right", `yBase` 0–1, `offsetX/offsetY` en px (−3000 a 3000). Saltos de línea con `\n`.
- Íconos: `icono` ∈ ubicacion, calendario, reloj, telefono, mail, web, entradas, instagram, musica. `color` `#rrggbb`, `tamano` 0.05–3 (recomendado 0.25 para íconos de datos; sección 6), `opacidadPct` 5–100. Si omitís `offsetX/offsetY` el ícono queda arriba y centrado (apilado): siempre indicalos.
- Fuentes: nombres de fuentes instaladas en la computadora de quien abre el panel (Garamond, Franklin Gothic, Georgia, Arial...). Usá los de la sección 6; si falta una, el navegador usa otra.

## 8.2 Imagen y paleta sin ver la página
- **Foto:** sección 5. La URL tiene que ser un archivo directo de Wikimedia (miniatura `/thumb/.../1280px-Archivo.jpg` para no pesar de más). Verificá la licencia; completá `autor`, `licencia` y `fuente`. Si es CC BY o BY-SA, agregá el texto de crédito (sección 5) y avisá al usuario.
- **Collage:** una foto por instrumento o cátedra, con crédito propio cada una. Si hay varias CC BY / BY-SA, juntá los créditos en una sola línea ("Fotos: A · CC BY-SA 4.0; B · CC BY 4.0").
- **Si no podés buscar o abrir imágenes:** pedile una URL al usuario, o dejá `url: null` en el ítem y decile que suba la foto desde "Imagen principal" (o "Imagen N") después de aplicar el JSON.
- **Paleta:** si podés ver la foto, elegí los colores como en la sección 2. Si no, usá una paleta sobria según el instrumento y la sala (madera cálida, metales; sala clara u oscura) y avisá que revise el contraste.
- **Paletas probadas** (sirven de punto de partida):
  - Oscura (foto de piano con partitura en penumbra): fondo #142227, texto #f1e9de, secundario #cfc2b2, acento #c9a87e.
  - Clara (piano negro en sala blanca): fondo #eeece9, texto #1a1918, secundario #55504c, acento #6b5648, crédito #7a746f.

## 8.3 Cómo calcular posiciones (ancho 1200 px; alto H: 1500 en 4:5, 675 en 16:9, 1200 en 1:1)

**Tamaño de texto.** `fs = 48 × tamano`; altura de línea `lh = 1.2 × fs`. Referencias: 0.6 → 29 px, 0.8 → 38, 1.0 → 48, 1.6 → 77, 1.7 → 82, 3.0 → 144.

**Posición vertical de un texto.** `yBase` es la línea base de la **línea central** del bloque (con 2 líneas, el punto medio entre las dos líneas base), en fracción de `H`. Para un bloque de `n` líneas cuyo borde superior querés en `Y` px:
`yBase = (Y + 0.8·fs + lh·(n−1)/2) / H`
y el bloque ocupa hasta `Y + 0.8·fs + lh·(n−1) + 0.2·fs`. El siguiente bloque empieza a `0.5·fs` (o más) por debajo.
(Verificado: título 1.7 en 2 líneas con `yBase` 0.628 → líneas base en 893 y 991, como predice la fórmula.)

**Posición horizontal.** El ancla es x = 600 + `offsetX`; con `align: "center"` el texto se centra ahí, con `"left"` es el borde izquierdo y con `"right"` el derecho (verificado: `left` con `offsetX` −190 empieza en x ≈ 412).
- Plantilla **horizontal**: textos centrados con `offsetX: 0`.
- Plantilla **vertical**: el panel de información empieza en x = `areaPct/100 × 1200`; su centro es `((areaPct/100 + 1) / 2) × 1200`. Usá `offsetX = centro − 600`.
- Plantilla **esquina**: el ancho libre cambia con la altura (ver "Zona de información"). Para cada bloque, calculá el tramo libre `[xIni, 1200 − 50]` a la altura del bloque (la del extremo del bloque más cercano a la esquina) y centralo ahí: `offsetX = (xIni + 1150)/2 − 600`. Para esquinas derechas es el espejo: tramo `[50, xFin]` y `offsetX = (50 + xFin)/2 − 600`. Alternativa más prolija: alinear todo a la izquierda (esquinas izquierdas) o a la derecha (esquinas derechas) sobre una columna que quede libre en todo el alto del texto.

**Zona de información.**
- Horizontal: de `y = areaPct/100 × H` hasta `H`. Margen superior de 50 px más el corrimiento del corte: inclinación ≈ `|inclinacionPct|/100 × 0.15 × H / 2`, curvatura hacia abajo ≈ `max(curvaturaPct, 0)/100 × 0.12 × H`, rasgado ≈ `rasgadoPct/100 × 0.03 × min(1200, H) × 1.5`, difuminado ≈ `difuminadoPct/100 × 0.08 × H × 3`.
- Vertical: de `x = areaPct/100 × 1200` hasta 1200; el margen se calcula igual pero sobre el ancho (inclinación `|inclinacionPct|/100 × 0.25 × 1200 / 2`, curvatura `max(curvaturaPct,0)/100 × 0.2 × 1200`, difuminado `difuminadoPct/100 × 0.08 × 1200 × 3`).
- Esquina: con `p = areaPct/100`, el corte es la recta `x/1200 + y/H = s`, con `s = √(2p)` si `p ≤ 0,5` y `s = 2 − √(2(1−p))` si no (para superior izquierda; en las demás, reemplazá `x` por `1200 − x` y/o `y` por `H − y`). A la altura `y`, la imagen llega hasta `x = 1200·(s − y/H)` y el texto empieza después. El margen `e` (las mismas sumas que en horizontal, pero con `min(1200, H)` en lugar de `H`: inclinación × 0,25 / 2, curvatura × 0,2, rasgado, difuminado × 0,08 × 3) más 50 px se suma en x como `e·D/H`, con `D = √(1200² + H²)` (en 4:5, `D/H ≈ 1,28`). Ejemplo 4:5, Área 40, sin borde: `s ≈ 0,894`; a y = 750 la imagen llega a x ≈ 473, así que el tramo libre arranca en ≈ 540; a y = 1100 la imagen llega a x ≈ 193 y el tramo libre arranca en ≈ 257.
- El margen del difuminado es conservador: con una foto cuyo borde inferior ya es parecido al fondo, el texto puede empezar antes (en el ejemplo probado de Área 42 / Difuminado 60, el encabezado arranca en y ≈ 760).
- Dejá 50 px de margen contra los demás bordes (30 px para la línea de crédito).

**Ancho de línea.** Ancho aproximado = `caracteres × 0.5 × fs` (sans, mayúsculas; verificado: 19 caracteres a 0.9 → 428 px reales vs 410 estimados) o `× 0.45 × fs` (serif; tiende a sobrestimar ~10%). Debe entrar en el ancho útil. Si no entra, partí con `\n` o bajá `tamano`. Para el título en 2 líneas, repartí las palabras en mitades parejas.

**Íconos.** Cada ícono ocupa un cuadrado de `300 × tamano` px; su esquina superior izquierda queda en `x = 600 − 150·tamano + offsetX`, `y = 0.05·H + offsetY` (verificado de 0,05 a 1). El dibujo visible es más chico que el cuadrado y depende del ícono: calendario ≈ `225·t` de ancho × `252·t` de alto; reloj ≈ `250·t` de ancho. Por ejemplo, a 0.25 el calendario mide ~56 × 63 px.
- Centro del ícono en (`cx`, `cy`): `offsetX = cx − 600`, `offsetY = cy − 150·tamano − 0.05·H`.
- Para acompañar un texto de línea base `B` y tamaño `fs`: `cy = B − 0.32·fs` (mitad de la altura de mayúsculas o de los números; medido: Franklin Gothic 0,9 → 0,32·fs, números de Garamond 1,6 → 0,31·fs). Calculalo siempre con la fórmula, no a ojo: en la hora, 7 px de diferencia ya se notan. En la etapa 3, compará el centro vertical del dibujo del ícono con el de los números o mayúsculas del texto (sin contar acentos ni descendentes); tienen que coincidir a ±2 px.
- **Par ícono + texto centrado como unidad** (composición recomendada, sección 6). Con `wI ≈ 235·tamano` (ancho promedio del dibujo), separación `g = 18`, `wT` = ancho estimado del texto y `W = wI + g + wT`:
  - borde izquierdo del ícono: `xI = 600 − W/2`, así que `cx = xI + wI/2`;
  - texto con `align: "left"` y `offsetX = (xI + wI + g) − 600`.
  - Como `wT` es estimado, avisá que los pares pueden quedar ±20 px corridos y se corrigen en la etapa 3 (midiendo y arrastrando, o ajustando los `offsetX` y re-aplicando). La hora en serif es la que más se desvía: "18.30 h" a 1,6 mide ~211 px, menos que la estimación (~240).
- **Imagen al costado (probado, Área 45, Difuminado 30–42):** la zona útil va de x ≈ 600 a 1150, con eje en x ≈ 870 (`offsetX: 270` para los textos centrados). Con ~550 px de ancho, partí en líneas cortas: encabezado en 3 líneas (CONSERVATORIOS / JUAN JOSÉ CASTRO / ALFREDO LUIS SCHIUMA), cátedras en 3 y sala en 3 (Salón de Actos / Sede Anchorena / dirección). Ubicá los bloques entre y ≈ 200 y 1330 para que el alto quede repartido.
  - Al terminar en el panel, volcá los ajustes al JSON entregado (o exportalo) para que la fuente coincida con lo que se ve.
- Columna alineada a la izquierda (alternativa, por ejemplo para la fila de contacto): todos los textos `align: "left"` con el mismo `offsetX`, íconos con el mismo `cx = xT − g − wI/2`.
- Si centrás un texto (`align: "center"`), no le pongas el ícono al lado: ponelo encima, o usá el par.

## 8.4 Receta paso a paso
1. Datos (sección 1) y decisión de imagen, plantilla, borde y paleta (sección 2).
2. Elegí `areaPct` (40–60) y los parámetros del borde. Si va collage (sección 2), definí cuántas imágenes, su orden, `cortesPct` y el divisor.
3. Calculá la zona de información y el espacio disponible (8.3).
4. Redactá los bloques de la jerarquía de la sección 6, calculando `fs`, líneas y alturas. Si no entra todo, bajá un poco los tamaños (nunca por debajo de 0.5 el chico ni 1.2 el título) o quitá el programa.
5. Apilá los bloques de arriba hacia abajo con la fórmula de `yBase` y revisá que el último termine antes de `H − 50`.
6. Agregá los íconos y, si hace falta, el crédito (8.3 y sección 5).
7. Verificá contraste y rangos y generá el JSON.

## 8.5 Entrega
- Devolvé el JSON completo en un único bloque de código (y como archivo `flyer.json` si podés crear archivos).
- Debajo, en pocas líneas: la foto usada (fuente, autor y licencia, con aviso de crédito si es CC BY o BY-SA), las decisiones de diseño y, si hubo supuestos (paleta sin ver la foto, anchos estimados, fuentes), qué revisar.
- Cómo cargarlo: en el panel de flyers, sección **Flyers guardados / JSON**, pegarlo en "Cargar desde JSON" y tocar "Aplicar JSON" (o "Abrir archivo .json"); revisar el resultado y ajustar arrastrando sobre el lienzo, o pedir un cambio puntual y volver a aplicar el JSON.
- Si el panel muestra errores de validación, el usuario puede pegártelos: corregí el campo indicado y devolvé el JSON completo de nuevo.
- Cerrá con la oferta de la etapa 2 del circuito: "¿Lo pego yo en el panel o lo pegás vos? Después lo reviso con la vista del resultado y ajusto lo que haga falta".
- En la variante solo JSON no descargues nada ni toques el panel.

---

# 9. Guardar y reutilizar flyers (base de datos)

El panel guarda los flyers en la base (sección **Flyers guardados / JSON**), así que se pueden retomar para otro concierto sin empezar de cero.

## Qué se guarda
Solo lo que entra en el JSON: textos, ajustes del borde y del collage, colores, **íconos del set**, las **imágenes del área** y la imagen de fondo. Las imágenes subidas desde un archivo se suben al servidor al guardar (comprimidas a 2 MB como máximo) y quedan con su URL, así que se conservan. No se conservan los logos, PNG o SVG propios. El panel avisa debajo del botón si algo quedó afuera: leé ese aviso y contáselo al usuario.

## Guardar (al cerrar la etapa 3)
- Proponé un **Título del flyer** corto, con el tipo de concierto y el mes (por ejemplo, "Audición de cátedras – Octubre"), y guardalo **solo si el usuario confirma**: escribe en la base, aunque se pueda deshacer.
- Flyer nuevo: completá el título (`setVal` sobre el input con placeholder "Ej: Concierto de cuerdas…") y tocá **Guardar**.
- Si el flyer se cargó desde la lista: **Guardar como nuevo** crea otro (es lo que corresponde al reutilizar) y **Actualizar** pisa el cargado (solo si el usuario quiere reemplazarlo). **Eliminar** lo saca de la lista (borrado lógico); usalo solo si el usuario lo pide.
- Después de guardar, comprobá que el título aparezca en el `<select>`.
- En la variante solo JSON, sugerí el título al entregar el archivo.

## Reutilizar para un nuevo concierto
1. **Cargarlo:** pedile al usuario que elija el flyer en el select, o elegilo vos (`setVal` sobre el `<select>` con el valor de la opción) y esperá a que cargue. Cargar reemplaza lo que hay en pantalla: si hay algo sin guardar, preguntá antes.
2. **Mantené el diseño** (plantilla, borde, paleta, tipografía, íconos y posiciones) y cambiá **solo el contenido**: título, intérpretes o cátedras, fecha, hora, sala y entrada. En el circuito, el cambio de contenido se hace en el JSON del flyer (el que entregaste, o uno armado leyendo los bloques del panel) y se vuelve a aplicar; los retoques finos van en la etapa 3.
3. **Si cambia el largo de un texto,** revisá que no roce los bordes y reacomodá la altura de los bloques siguientes. Si cambia el ancho de una línea con ícono, recalculá el par para que siga centrado (sección 6).
4. **Cambiá la foto solo si cambia el instrumento o la formación** (o si el usuario cargó otra imagen). En ese caso repetí la decisión de imagen, plantilla y paleta de la sección 2.
5. Guardá con **Guardar como nuevo** y un título propio; **Actualizar** solo si el usuario quiere reemplazar el anterior.

## JSON de un flyer guardado
Si el usuario te pega el JSON de un flyer guardado, tomalo como base: devolvé el JSON completo con el contenido actualizado, sin cambiar lo que no hace falta tocar.
