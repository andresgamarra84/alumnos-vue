---
name: flyer-cjjc
description: Armar flyers de conciertos y eventos del Conservatorio Juan José Castro (cjjc.edu.ar/panel/admin/flyers). Dos modos - manejar el panel con Claude in Chrome, o generar el JSON del flyer para que el usuario lo cargue en el panel. Usar cuando el usuario pida un flyer, afiche o pieza gráfica de un concierto, audición, muestra o evento del CJJC.
---

# Flyers del CJJC

## Modos de trabajo
Elegí el modo según el pedido:
- **Modo JSON** (secciones 1, 2, 6 y 8): el usuario pide "el JSON", "la especificación", o no hay extensión de Chrome disponible. Generás un archivo JSON que el usuario carga en el panel con **Flyers guardados / JSON**. No tocás la página. Es el modo más rápido.
- **Modo panel** (secciones 1 a 7): el usuario quiere que armes el flyer directamente en la página con Claude in Chrome, o que ajustes uno ya cargado.
- Si no está claro, preguntá cuál prefiere en la misma ronda de datos de la sección 1 (por defecto: modo JSON si no hay herramientas de Chrome, modo panel si las hay).
- Los dos modos comparten las reglas de decisión (2) y de tipografía (6).

## Modo panel: dónde se trabaja
Se trabaja en la pestaña del usuario `https://cjjc.edu.ar/panel/admin/flyers` con las herramientas de Claude in Chrome. No hace falta abrir pestañas nuevas. Si el usuario no tiene la sesión iniciada, pedile que entre al panel; nunca pidas ni escribas su contraseña. Un flyer armado se puede guardar con título en la base (sección "Flyers guardados / JSON": "Guardar") y recuperarlo después desde el select para reutilizarlo; solo se guardan los íconos del set y las imágenes con URL (una subida desde un archivo no se conserva).

## 1. Datos a pedir (una sola ronda, con AskUserQuestion)
Fecha, hora, sede/sala, instrumento o tipo de concierto, intérpretes (o "alumnos de la cátedra"), programa (opcional), entrada (libre y gratuita / con reserva / arancelada). No preguntar el formato: es 4:5 salvo que el usuario pida otro. Si quiere íconos de contacto (web, Instagram, teléfono), preguntar los datos.

## 2. Reglas de decisión

### Formato e imagen
- **Formato:** 4:5 por defecto (1200×1500). También hay 16:9 (1200×675) y 1:1 (1200×1200).
- **Imagen:** siempre lleva imagen principal. Preferir una foto realista del instrumento o de la formación (sección 5). Usar una ilustración propia (sección 4) solo si no aparece una foto adecuada o si el usuario la pide.

### Plantilla según la imagen conseguida
Primero se elige la imagen y después la plantilla:
- **Vertical** (alto ≥ 1,2 × ancho, o el sujeto es alto y angosto: contrabajo parado, músico de cuerpo entero) → **Imagen al costado**.
- **Horizontal** (ancho ≥ 1,2 × alto, o el sujeto es ancho: ensamble, piano de cola, instrumento acostado, escenario) → **Imagen arriba**.
- **Casi cuadrada:** decide hacia dónde se extiende el sujeto. Si dudás, probá las dos plantillas y quedate con la que recorte menos al sujeto.
- La imagen manda: no fuerces una plantilla.
- **Libre** no reserva áreas ni muestra los sliders de borde; usarla solo si el usuario lo pide.

### Encuadre de la imagen
La imagen se recorta para llenar su área sin deformarse. Arrastrala sobre su área del lienzo para elegir qué parte se ve.
- Objetivo: el sujeto completo o su parte más reconocible (voluta, cuerpo, manos sobre el instrumento), sin cortes torpes.
- Agarrala lejos de los textos y de los íconos, para no mover uno por error.
- Combiná el encuadre con los sliders (sección 3) para que el corte acompañe la forma del sujeto y deje una columna o franja cómoda para el texto.

### Borde entre la imagen y el fondo
Hay cuatro parámetros que se combinan; decidí según el estilo:
- **Sobrio / institucional (por defecto):** Área 50–60, Borde 0–25, Inclinación 0, Curvatura 0, Difuminado 0. Corte recto y nítido.
- **Dinámico:** una Inclinación de ±20–40 o una Curvatura de ±30–60 que siga la línea del instrumento. No usar ambas al máximo.
- **Rasgado (papel):** Borde 40–70. Con valores altos el corte se vuelve muy irregular y puede comerse el texto.
- **Fundido con el fondo:** Difuminado 30–70 cuando la foto tiene fondo oscuro o neutro y el fondo del flyer es del mismo tono; el fundido queda feo si los tonos son muy distintos. Con Difuminado alto conviene Borde bajo (el rasgado casi no se nota).
- Revisá siempre que el degradé no tape al sujeto: si lo hace, subí el Área o bajá el Difuminado.

### Paleta derivada de la imagen
No hay paleta fija. El fondo y los colores salen de la imagen elegida:
1. Extraé los colores dominantes con el snippet de la sección 3.
2. **Fondo de información:** un tono de la imagen llevado a muy claro (tinte casi blanco del color dominante) o a muy oscuro (el tono más profundo de la imagen), lo que mejor dialogue con el borde de la foto. Con Difuminado, usar el tono del fondo de la propia foto.
3. **Texto principal** (título, fecha, sala): el tono más oscuro sobre fondo claro, o el más claro sobre fondo oscuro.
4. **Acento** (nombre del conservatorio, hora, entrada, íconos): el color más saturado o característico de la imagen (la madera de un instrumento, un detalle de luz).
5. **Contraste:** mínimo 4,5:1 contra el fondo. Si el acento no llega, oscurecelo o aclaralo sin cambiar su tono.

## 3. Cómo es la página

### Distribución
Dos columnas fijas: panel de opciones a la izquierda (1/3 del ancho) y lienzo a la derecha (2/3). El lienzo nunca baja debajo de las opciones salvo en pantallas muy angostas (< 640 px). Las secciones del panel (Formato, Plantilla, Fondo, Logos e imágenes, Íconos, Contenido) se pliegan al hacer click en su título; si un control no está visible, desplegá su sección. Al final del panel está el botón "Descargar flyer".

### Controles
- **FORMATO:** botones 4:5, 16:9, 1:1.
- **PLANTILLA:** botones Libre, Imagen arriba, Imagen al costado. Al elegir una distinta de Libre aparecen "Imagen principal (PNG o JPG)" y los sliders de borde.
- **Imagen principal:** es el primer `input[type=file]` de la página. Acepta PNG o JPG.
- **Sliders de la plantilla** (solo existen si la plantilla no es Libre), `input[type=range]` en este orden:
  - [0] **Área de imagen** (35–75, por defecto 60). Porcentaje del alto (arriba) o del ancho (costado).
  - [1] **Borde**, de Recto a Rasgado (0–100, por defecto 40). Botón "Nuevo rasgado" sortea otra forma (deshabilitado en 0).
  - [2] **Inclinación** (−100 a 100, por defecto 0). Costado: positivo = el corte se corre a la derecha al bajar. Arriba: positivo = el corte baja hacia la derecha. Doble click lo vuelve a 0.
  - [3] **Curvatura** (−100 a 100, por defecto 0). Costado: negativo se curva a la izquierda. Arriba: negativo se curva hacia arriba. Doble click lo vuelve a 0.
  - [4] **Difuminado**, de Definido a Difuminado (0–100, por defecto 0). Funde la imagen con el fondo a lo largo del corte.
  - Los sliders que siguen en el DOM (opacidad, difuminado del fondo de logo) son de los logos, no de la plantilla.
- **FONDO:** botones "Color" / "Imagen propia". En Color: swatches y un `input[type=color]` con title "Color de fondo personalizado".
- **FLYERS GUARDADOS / JSON:** al final del panel, antes de "Descargar flyer". Un select con los flyers guardados (al elegir uno se carga en pantalla), un campo "Título del flyer" con los botones "Guardar" (o "Guardar como nuevo"), "Actualizar" y "Eliminar", y debajo un cuadro de texto con "Aplicar JSON" y "Abrir archivo .json". En modo panel se puede usar para cargar de una vez un JSON ya armado (`setVal` sobre ese `textarea` y click en "Aplicar JSON"); reemplaza todo el flyer, incluidos los logos subidos.
- **LOGOS E IMÁGENES:** "+ Agregar imagen PNG" (`input[type=file]` oculto, acepta PNG y SVG, varios a la vez). Cada imagen agregada tiene: casilla de visibilidad, 🗑, Color (Original / Recolorear + swatches), Opacidad, Tamaño (−, +, ↔), y Fondo (Transparente / Color; Circular / Rectangular; opacidad y difuminado del fondo).
- **ÍCONOS:** grilla de botones con title "Agregar <nombre>": Ubicación, Fecha, Horario, Teléfono, Correo, Web, Entradas, Instagram, Música. Más "+ Agregar SVG propio". Un ícono agregado aparece como un logo más en "Logos e imágenes", ya en modo Recolorear (azul `#1b2452`) y chico (tamaño 0,15); desde ahí se cambia su color, tamaño y opacidad. Arrastralo sobre el lienzo para ubicarlo.
- **CONTENIDO:** botón "+ Agregar texto".
- **Zoom** (encima del lienzo): −, valor, +, "Ajustar" (pasos de 10, entre 25% y 200%).

### Bloques de texto
Cada bloque tiene:
- un `textarea` (los saltos de línea con \n);
- el botón 🔤 (`.btn-fuente`), que abre un `<select>` con las fuentes del sistema (Garamond, Book Antiqua, Franklin Gothic, Bahnschrift, Georgia, etc.; si no se pueden leer, Arial, Georgia, Times New Roman, Verdana, Courier New, Impact, Comic Sans MS);
- swatches de color más un `input[type=color]`;
- Tamaño: botones −, + y ↔ (centra horizontalmente). Cada click cambia 0,1 sobre un rango de 0,4 a 3 (en logos e íconos, un 20 % por click, de 0,05 a 3); el tamaño base es 4 % del ancho (48 px). Un título grande lleva ~8–10 clicks; la hora "muy grande", ~12–15;
- alineación: Izq, Centro, Der.
El texto nuevo aparece dentro del área de información cuando hay plantilla.

### Particularidades
- El flyer se dibuja en un único `<canvas>`. La imagen, los textos y los íconos no están en el DOM: solo se mueven arrastrando sobre el lienzo (`left_click_drag`). Los textos están encima de los logos/íconos, y estos encima de la imagen principal.
- **Zoom:** "Ajustar" vuelve al 100%, no encaja el flyer. Para ver el flyer entero, bajá el zoom (30–40%) y ejecutá `document.querySelector('canvas').scrollIntoView({block:'center'}); document.scrollingElement.scrollLeft=0`. Para revisarlo, usá la acción zoom sobre el rect del canvas.
- Poné `scrollLeft=0` antes de cada captura.
- Es una app Vue de producción sin devtools: no toques su estado interno, usá eventos.
- El botón "Descargar flyer" queda deshabilitado si falta la imagen principal (plantilla distinta de Libre) o la imagen de fondo (modo Imagen propia).

### Atajos por JavaScript (javascript_tool)
```js
const setVal=(el,v)=>{Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el),'value').set.call(el,v);el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));};
const block=t=>{let p=t;while(p&&!p.innerText.includes('Tamaño'))p=p.parentElement;return p;};
const slider=i=>document.querySelectorAll('input[type=range]')[i];
```
- **Agregar texto:**
  1. Click en "+ Agregar texto" y tomar el último `textarea`.
  2. `setVal(textarea,'...')`.
  3. Click en su `.btn-fuente` y luego `setVal(select,'Garamond')`.
  4. `setVal(input[type=color],'#hex')` (el del bloque).
  5. Tamaño con clicks en + o − del bloque (`block(textarea)`).
- **Sliders de la plantilla:** `setVal(slider(i), v)` con i = 0..4 (ver orden arriba). Doble click para resetear inclinación y curvatura.
- **Agregar un ícono:** `[...document.querySelectorAll('.btn-icono')].find(b=>b.title==='Agregar Instagram').click()`. Cambiar su color: en su bloque de "Logos e imágenes", `setVal(input[type=color],'#hex')`.
- **Imagen desde un Blob:** `new File([blob],'img.jpg',{type})`, luego un `DataTransfer`, luego `input.files=dt.files` y dispatch de `change`.
- **Paleta de una imagen:** dibujá el blob en un canvas de 64×64, leé `getImageData`, cuantizá cada canal en pasos de 32, contá los colores, ordená por frecuencia y devolvé los 6–8 principales con luminancia y saturación. Con eso elegí fondo, texto y acento según la sección 2.

## 4. Ilustración propia (alternativa)
Armá un SVG y dibujalo en un canvas: 960×2000 para el costado, o 2000×1100 aprox. para arriba. Después cargalo como PNG con el mismo método que una imagen desde un Blob.

## 5. Fotos realistas (Wikimedia Commons, desde la página)
```js
const u='https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrnamespace=6&gsrlimit=20&gsrsearch='+encodeURIComponent('double bass filetype:bitmap')+'&prop=imageinfo&iiprop=size|extmetadata';
```
- Probá varias búsquedas: el instrumento en inglés, italiano o alemán, "player", "orchestra", "close-up".
- Preferí licencia CC0 o dominio público. La serie "... MET DP..." del Metropolitan Museum es CC0, con instrumentos completos sobre fondo neutro.
- Para descargar, pedí `iiprop=url&iiurlwidth=1000` (o 1400) y usá `thumburl`.
- Antes de decidir, previsualizá la foto cargándola en el panel y revisá la captura.
- Si la licencia es CC BY o BY-SA, avisá al usuario que hay que dar crédito al autor.

## 6. Tipografía, jerarquía e íconos
Orden de los bloques, todos centrados en el área de información:
1. CONSERVATORIO / JUAN JOSÉ CASTRO: sans (Franklin Gothic), acento, chico.
2. Título: serif (Garamond), texto principal, grande, en 2 líneas.
3. Intérpretes: serif, texto principal o un tono intermedio.
4. DÍA / FECHA: sans, texto principal.
5. HORA: serif, acento, muy grande.
6. Sala · Sede: sans.
7. Condición de entrada: sans, acento.

Con la plantilla **Imagen arriba**, la franja de texto queda abajo y es más ancha que alta: agrupá en dos columnas o filas (título a todo el ancho; fecha/hora a un lado, sala/entrada al otro).

**Íconos como acompañamiento** (opcionales, pero recomendados): un ícono chico a la izquierda de la línea que ilustra.
- Ubicación junto a Sala · Sede; Fecha junto al día; Horario junto a la hora; Entradas junto a la condición de entrada; Instagram / Web / Teléfono / Correo en una fila al pie con el dato al lado.
- Recolorealos con el color del texto al que acompañan (o el acento), tamaño ~0,25–0,4 de modo que su alto sea similar a la altura de letra del texto. Un ícono por línea, todos alineados verticalmente en la misma columna.
- Si el texto va centrado, alinear el ícono a la izquierda del texto exige moverlo a mano: arrastralos y revisá con zoom que no se superpongan. Si queda desprolijo, es mejor prescindir de los íconos.

Además:
- Partí en dos líneas cualquier texto que roce el borde.
- Cada vez que cambies área, inclinación, curvatura o difuminado, volvé a revisar y centrar textos e íconos arrastrándolos.

## 7. Cierre (modo panel)
- Verificá el resultado con una captura ampliada del canvas.
- Antes de tocar "Descargar flyer", pedí confirmación al usuario, porque baja un archivo.
- En la respuesta, mencioná la fuente y la licencia de la foto usada.

---

# Modo JSON

Generás la especificación del flyer; el panel la valida, descarga la imagen y arma todo. No ves el resultado, así que las posiciones se calculan con las fórmulas de la sección 8.3 y el usuario puede retocar a mano después (arrastrando sobre el lienzo). Seguí las reglas de decisión de la sección 2 y la jerarquía de la sección 6.

## 8.1 Esquema
```json
{
  "version": 1,
  "formato": "4:5",
  "plantilla": "horizontal",
  "imagen": {
    "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Archivo.jpg/1200px-Archivo.jpg",
    "offsetX": 0, "offsetY": 0,
    "autor": "Nombre", "licencia": "CC BY-SA 4.0", "fuente": "https://commons.wikimedia.org/wiki/File:Archivo.jpg"
  },
  "borde": { "areaPct": 55, "rasgadoPct": 0, "inclinacionPct": 0, "curvaturaPct": 0, "difuminadoPct": 0 },
  "fondo": { "tipo": "color", "color": "#f4ecd8" },
  "textos": [
    { "valor": "Título", "fuente": "Garamond", "color": "#1b2452", "tamano": 1.6, "align": "center", "yBase": 0.7, "offsetX": 0, "offsetY": 0 }
  ],
  "iconos": [
    { "icono": "reloj", "color": "#8a6d3b", "tamano": 0.15, "opacidadPct": 100, "offsetX": -250, "offsetY": 700 }
  ]
}
```
Todos los campos son opcionales salvo lo que se quiera mostrar; los que falten toman el valor por defecto. Rangos (el panel rechaza lo que se salga, con un mensaje por campo):
- `formato`: "4:5" | "16:9" | "1:1". `plantilla`: "libre" | "horizontal" (imagen arriba) | "vertical" (imagen al costado).
- `borde.areaPct` 35–75 (60); `rasgadoPct` 0–100 (40; ponelo en 0 para un corte recto); `inclinacionPct` y `curvaturaPct` −100 a 100 (0); `difuminadoPct` 0–100 (0). Los signos y criterios son los de la sección 3 y los estilos de la sección 2.
- `imagen.url`: **https** obligatoria para la plantilla no libre (sin URL el usuario tiene que subir la imagen a mano). `offsetX/offsetY`: encuadre en px; se limita solo a lo que sobresale de la imagen, así que ante la duda dejá 0.
- `fondo`: `{ "tipo": "color", "color": "#rrggbb" }` o `{ "tipo": "imagen", "url": "https://..." }`.
- Textos: `color` en `#rrggbb` (6 dígitos), `tamano` 0.4–3, `align` "left" | "center" | "right", `yBase` 0–1, `offsetX/offsetY` en px (−3000 a 3000). Los saltos de línea van como `\n`.
- Íconos: `icono` ∈ ubicacion, calendario, reloj, telefono, mail, web, entradas, instagram, musica. `color` `#rrggbb`, `tamano` 0.05–3 (0.15 por defecto = 45 px, ver 8.3), `opacidadPct` 5–100. Si omitís `offsetX/offsetY` el ícono queda arriba y centrado (apilado): siempre indicalos.
- Fuentes: nombres de fuentes instaladas en la computadora de quien abre el panel (Garamond, Franklin Gothic, Georgia, Arial...). Usá exactamente los de la sección 6; si falta una, el navegador usa otra.

## 8.2 Imagen y paleta sin ver la página
- **Foto:** buscala en Wikimedia Commons (sección 5; en modo JSON usá tus herramientas de búsqueda web, no el javascript de la página). La URL tiene que ser un archivo directo de `upload.wikimedia.org` (con miniatura `/thumb/.../1200px-Archivo.jpg` para no pesar de más). Verificá la licencia; completá `autor`, `licencia` y `fuente`. Si la licencia es CC BY o BY-SA, avisá al usuario que el panel mostrará el crédito y que hay que darlo al publicar.
- **Si no podés buscar o abrir imágenes:** pedile al usuario una URL, o dejá `imagen.url` en `null` y decile que suba la foto desde "Imagen principal" después de aplicar el JSON.
- **Paleta:** si podés ver la foto, elegí los colores como en la sección 2 (fondo muy claro o muy oscuro del tono dominante, texto del tono opuesto, acento el más saturado) y verificá el contraste 4,5:1. Si no podés verla, usá una paleta sobria según el instrumento (madera cálida, metales, etc.) y avisalo para que el usuario revise el contraste.

## 8.3 Cómo calcular posiciones (el lienzo mide 1200 px de ancho; alto: 1500 en 4:5, 675 en 16:9, 1200 en 1:1)

**Tamaño de texto.** Tamaño en px `fs = 48 × tamano`. Altura de línea `lh = 1.2 × fs`. Referencias: 0.6 → 29 px (chico), 1.0 → 48, 1.6 → 77 (título), 2.4 → 115, 3.0 → 144 (máximo).

**Posición vertical de un texto.** `yBase` es la línea base de la **línea central** del bloque, en fracción del alto `H`. Para un bloque de `n` líneas cuyo borde superior querés en `Y` px:
`yBase = (Y + 0.8·fs + lh·(n−1)/2) / H`
y el bloque ocupa hasta `Y + 0.8·fs + lh·(n−1) + 0.2·fs`. El siguiente bloque empieza a `0.5·fs` (o más) por debajo.

**Posición horizontal.** El ancla es el centro del lienzo (x = 600) más `offsetX`; con `align: "center"` el texto se centra en ese punto, con `"left"` el ancla es el borde izquierdo y con `"right"` el derecho.
- Plantilla **horizontal** (imagen arriba): los textos van centrados con `offsetX: 0`.
- Plantilla **vertical** (imagen al costado): el panel de información empieza en x = `areaPct/100 × 1200`; su centro es `((areaPct/100 + 1) / 2) × 1200`. Usá `offsetX = centro − 600`.

**Zona de información.**
- Horizontal: de `y = areaPct/100 × H` hasta `H`. Dejá un margen superior de 50 px más el corrimiento del corte: inclinación ≈ `|inclinacionPct|/100 × 0.15 × H / 2`, curvatura hacia abajo ≈ `max(curvaturaPct, 0)/100 × 0.12 × H`, rasgado ≈ `rasgadoPct/100 × 0.03 × min(1200, H) × 1.5`, difuminado ≈ `difuminadoPct/100 × 0.08 × H × 3`.
- Vertical: de `x = areaPct/100 × 1200` hasta 1200; el margen se calcula igual pero sobre el ancho (inclinación `|inclinacionPct|/100 × 0.25 × 1200 / 2`, curvatura `max(curvaturaPct,0)/100 × 0.2 × 1200`, difuminado `difuminadoPct/100 × 0.08 × 1200 × 3`).
- Dejá 50 px de margen contra los demás bordes.

**Ancho de línea.** Ancho aproximado de una línea = `caracteres × 0.5 × fs` (sans) o `× 0.45 × fs` (serif). Debe entrar en el ancho útil (1200 menos márgenes en horizontal; el ancho del panel menos márgenes en vertical). Si no entra, partí con `\n` o bajá `tamano`. Para el título en 2 líneas, repartí las palabras en mitades parejas.

**Íconos.** Cada ícono es cuadrado: ancho = alto = `300 × tamano` px; su esquina superior izquierda queda en `x = 600 − 150·tamano + offsetX`, `y = 0.05·H + offsetY`.
- Para acompañar un texto de tamaño `fs` con línea base en `B`, elegí `tamano = fs / 300` (ícono del alto de la letra, ~1.0×) y poné:
  `offsetY = (B − 0.85·fs) − 0.05·H`.
- Para colocarlo con su centro horizontal en `cx`: `offsetX = cx − 600`.
- Ícono a la izquierda de un texto alineado a la izquierda cuyo borde izquierdo está en `xT`: `cx = xT − 0.8·fs − 0.5·fs` (ícono + separación). El texto con `align: "left"` y `offsetX = xT − 600`.
- Para filas de contacto al pie (instagram / web / teléfono / correo): un ícono por línea, con los textos `align: "left"` en la misma columna `xT`, e íconos en la columna `cx` común.
- Si centrás un texto, no le pongas ícono al lado (quedaría torcido): usá texto `align: "left"` para las líneas con ícono.

## 8.4 Receta paso a paso
1. Datos (sección 1) y decisión de imagen, plantilla, borde y paleta (sección 2).
2. Elegí `areaPct` (45–60) y los parámetros del borde.
3. Calculá la zona de información y el espacio disponible (8.3).
4. Redactá los bloques de la jerarquía de la sección 6, calculando `fs`, líneas y alturas. Si no entra todo, bajá un poco los tamaños (nunca por debajo de 0.5 el chico ni 1.2 el título) o quitá el programa.
5. Apilá los bloques de arriba hacia abajo con la fórmula de `yBase` y revisá que el último termine antes de `H − 50`.
6. Agregá los íconos si corresponde (8.3).
7. Verificá mentalmente contraste y rangos y generá el JSON.

## 8.5 Entrega
- Devolvé el JSON completo en un único bloque de código (y como archivo `flyer.json` si podés crear archivos).
- Debajo, indicá en pocas líneas: la foto usada (fuente y licencia, con aviso de crédito si es CC BY o BY-SA), las decisiones de diseño y, si hubo supuestos (paleta sin ver la foto, fuentes), qué revisar.
- Explicá cómo cargarlo: en `cjjc.edu.ar/panel/admin/flyers`, sección **Flyers guardados / JSON**, pegar y tocar "Aplicar JSON" (o "Abrir archivo .json"); revisar el resultado y, si algo no queda bien, ajustar arrastrando sobre el lienzo o pedir un cambio puntual y volver a aplicar el JSON.
- Si el panel muestra errores de validación, el usuario puede pegártelos: corregí el campo indicado y devolvé el JSON completo de nuevo.
- No descargues nada ni toques el panel en este modo.
