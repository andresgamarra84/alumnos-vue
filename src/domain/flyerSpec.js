// Especificación de un flyer en JSON: formato de intercambio entre el editor (FlyersView) y quien arma el flyer
// (por ejemplo, Claude). Cada campo mapea 1:1 a un control o estado del editor.
//
// {
//   "version": 1,
//   "formato": "4:5",                      // "4:5" | "16:9" | "1:1"
//   "plantilla": "horizontal",             // "libre" | "horizontal" (imagen arriba) | "vertical" (imagen al costado)
//   "imagen": {                            // imagen principal (obligatoria si la plantilla no es "libre" para poder descargar)
//     "url": "https://upload.wikimedia.org/...jpg",
//     "offsetX": 0, "offsetY": 0,          // encuadre en px dentro del área (se limita a lo que sobresale)
//     "autor": "...", "licencia": "CC BY-SA 4.0", "fuente": "https://commons.wikimedia.org/..."
//   },
//   "borde": { "areaPct": 60, "rasgadoPct": 40, "inclinacionPct": 0, "curvaturaPct": 0, "difuminadoPct": 0 },
//   "fondo": { "tipo": "color", "color": "#ffffff" },   // o { "tipo": "imagen", "url": "..." }
//   "textos": [{ "valor": "Título", "fuente": "Garamond", "color": "#1b2452", "tamano": 1.5, "align": "center",
//                "yBase": 0.7, "offsetX": 0, "offsetY": 0 }],
//   "iconos": [{ "icono": "reloj", "color": "#1b2452", "tamano": 0.15, "opacidadPct": 100, "offsetX": 0, "offsetY": 0 }]
// }

export const VERSION_SPEC = 1

export const FORMATOS_VALIDOS = ['4:5', '16:9', '1:1']
export const PLANTILLAS_VALIDAS = ['libre', 'horizontal', 'vertical']
export const ALINEACIONES_VALIDAS = ['left', 'center', 'right']

// Íconos de uso común (trazados en una grilla de 24 × 24, estilo Material). Se rasterizan como SVG
// negro y se recolorean con la opción "Recolorear" del logo.
export const ICONOS = [
  { clave: 'ubicacion', etiqueta: 'Ubicación', d: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z' },
  { clave: 'calendario', etiqueta: 'Fecha', d: 'M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 16H5V10h14v10zM5 8V6h14v2H5zm2 4h5v5H7z' },
  { clave: 'reloj', etiqueta: 'Horario', d: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z' },
  { clave: 'telefono', etiqueta: 'Teléfono', d: 'M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2z' },
  { clave: 'mail', etiqueta: 'Correo', d: 'M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z' },
  { clave: 'web', etiqueta: 'Web', d: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm6.93 6h-2.95a15.65 15.65 0 0 0-1.38-3.56A8.03 8.03 0 0 1 18.93 8zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14a8.2 8.2 0 0 1 0-4h3.38a16.5 16.5 0 0 0 0 4H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56A7.99 7.99 0 0 1 5.08 16zm2.95-8H5.08a7.99 7.99 0 0 1 4.33-3.56A15.65 15.65 0 0 0 8.03 8zM12 19.96A14.7 14.7 0 0 1 10.09 16h3.82A14.7 14.7 0 0 1 12 19.96zM14.34 14H9.66a14.6 14.6 0 0 1 0-4h4.68a14.6 14.6 0 0 1 0 4zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.03 8.03 0 0 1-4.33 3.56zM16.36 14a16.5 16.5 0 0 0 0-4h3.38a8.2 8.2 0 0 1 0 4h-3.38z' },
  { clave: 'entradas', etiqueta: 'Entradas', d: 'M22 10V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v4a2 2 0 0 1 0 4v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 1 0-4zm-9 7.5h-2v-2h2v2zm0-4h-2v-3h2v3zm0-5h-2v-2h2v2z' },
  { clave: 'instagram', etiqueta: 'Instagram', d: 'M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2zM7.5 4A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4zM12 7.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 1 1 0-9zM12 9.2a2.8 2.8 0 1 0 0 5.6 2.8 2.8 0 1 0 0-5.6zM17.2 5.6a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 1 1 0-2.4z' },
  { clave: 'musica', etiqueta: 'Música', d: 'M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z' },
]

const CLAVES_ICONOS = ICONOS.map((i) => i.clave)
const REGEX_HEX = /^#[0-9a-fA-F]{6}$/

// Rangos de los sliders de borde (mismos que los input[type=range] del editor)
const RANGOS_BORDE = {
  areaPct: { min: 35, max: 75, defecto: 60 },
  rasgadoPct: { min: 0, max: 100, defecto: 40 },
  inclinacionPct: { min: -100, max: 100, defecto: 0 },
  curvaturaPct: { min: -100, max: 100, defecto: 0 },
  difuminadoPct: { min: 0, max: 100, defecto: 0 },
}

// Mismos límites que cambiarTamano() del editor
const TAMANO_MIN = 0.4
const TAMANO_MIN_ICONO = 0.05 // mismo mínimo que los botones −/+ de logos e íconos
const TAMANO_MAX = 3

// Valida y normaliza una especificación (objeto ya parseado). Devuelve { ok, errores, spec }:
// spec trae todos los campos con sus valores por defecto; errores es un listado legible en español.
export function validarEspecificacion(raw) {
  const errores = []
  const err = (ruta, msg) => errores.push(`${ruta}: ${msg}`)

  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { ok: false, errores: ['La especificación debe ser un objeto JSON.'], spec: null }
  }
  if (raw.version !== undefined && raw.version !== VERSION_SPEC) {
    err('version', `se esperaba ${VERSION_SPEC}`)
  }

  const esNumero = (v) => typeof v === 'number' && Number.isFinite(v)
  const numero = (ruta, v, { min, max, defecto }) => {
    if (v === undefined || v === null) return defecto
    if (!esNumero(v)) {
      err(ruta, 'debe ser un número')
      return defecto
    }
    if (v < min || v > max) {
      err(ruta, `debe estar entre ${min} y ${max} (recibido ${v})`)
      return defecto
    }
    return v
  }
  const opcion = (ruta, v, validos, defecto) => {
    if (v === undefined || v === null) return defecto
    if (!validos.includes(v)) {
      err(ruta, `valores válidos: ${validos.join(', ')} (recibido ${JSON.stringify(v)})`)
      return defecto
    }
    return v
  }
  const color = (ruta, v, defecto) => {
    if (v === undefined || v === null) return defecto
    if (typeof v !== 'string' || !REGEX_HEX.test(v)) {
      err(ruta, `debe ser un color hexadecimal #rrggbb (recibido ${JSON.stringify(v)})`)
      return defecto
    }
    return v.toLowerCase()
  }
  const urlHttps = (ruta, v) => {
    if (v === undefined || v === null || v === '') return null
    if (typeof v !== 'string' || !/^https:\/\//i.test(v)) {
      err(ruta, 'debe ser una URL https')
      return null
    }
    return v
  }
  const texto = (ruta, v, defecto = '') => {
    if (v === undefined || v === null) return defecto
    if (typeof v !== 'string') {
      err(ruta, 'debe ser texto')
      return defecto
    }
    return v
  }
  const objeto = (ruta, v) => {
    if (v === undefined || v === null) return {}
    if (typeof v !== 'object' || Array.isArray(v)) {
      err(ruta, 'debe ser un objeto')
      return {}
    }
    return v
  }
  const lista = (ruta, v) => {
    if (v === undefined || v === null) return []
    if (!Array.isArray(v)) {
      err(ruta, 'debe ser una lista')
      return []
    }
    return v
  }

  const formato = opcion('formato', raw.formato, FORMATOS_VALIDOS, '4:5')
  const plantilla = opcion('plantilla', raw.plantilla, PLANTILLAS_VALIDAS, 'libre')

  const img = objeto('imagen', raw.imagen)
  const imagen = {
    url: urlHttps('imagen.url', img.url),
    offsetX: numero('imagen.offsetX', img.offsetX, { min: -5000, max: 5000, defecto: 0 }),
    offsetY: numero('imagen.offsetY', img.offsetY, { min: -5000, max: 5000, defecto: 0 }),
    autor: texto('imagen.autor', img.autor),
    licencia: texto('imagen.licencia', img.licencia),
    fuente: texto('imagen.fuente', img.fuente),
  }

  const b = objeto('borde', raw.borde)
  const borde = {}
  for (const [clave, rango] of Object.entries(RANGOS_BORDE)) borde[clave] = numero(`borde.${clave}`, b[clave], rango)

  const f = objeto('fondo', raw.fondo)
  const tipoFondo = opcion('fondo.tipo', f.tipo, ['color', 'imagen'], 'color')
  const fondo = {
    tipo: tipoFondo,
    color: color('fondo.color', f.color, '#ffffff'),
    url: urlHttps('fondo.url', f.url),
  }
  if (tipoFondo === 'imagen' && !fondo.url) err('fondo.url', 'es obligatoria cuando el fondo es una imagen')

  const textos = lista('textos', raw.textos).map((t, i) => {
    const r = `textos[${i}]`
    const o = objeto(r, t)
    return {
      valor: texto(`${r}.valor`, o.valor),
      fuente: texto(`${r}.fuente`, o.fuente, 'Arial') || 'Arial',
      color: color(`${r}.color`, o.color, '#1b2452'),
      tamano: numero(`${r}.tamano`, o.tamano, { min: TAMANO_MIN, max: TAMANO_MAX, defecto: 1 }),
      align: opcion(`${r}.align`, o.align, ALINEACIONES_VALIDAS, 'center'),
      yBase: numero(`${r}.yBase`, o.yBase, { min: 0, max: 1, defecto: 0.3 }),
      offsetX: numero(`${r}.offsetX`, o.offsetX, { min: -3000, max: 3000, defecto: 0 }),
      offsetY: numero(`${r}.offsetY`, o.offsetY, { min: -3000, max: 3000, defecto: 0 }),
    }
  })

  const iconos = lista('iconos', raw.iconos).map((ic, i) => {
    const r = `iconos[${i}]`
    const o = objeto(r, ic)
    return {
      icono: opcion(`${r}.icono`, o.icono, CLAVES_ICONOS, CLAVES_ICONOS[0]),
      color: color(`${r}.color`, o.color, '#1b2452'),
      tamano: numero(`${r}.tamano`, o.tamano, { min: TAMANO_MIN_ICONO, max: TAMANO_MAX, defecto: 0.15 }),
      opacidadPct: numero(`${r}.opacidadPct`, o.opacidadPct, { min: 5, max: 100, defecto: 100 }),
      // null = conservar la posición escalonada por defecto del editor
      offsetX: o.offsetX === undefined ? null : numero(`${r}.offsetX`, o.offsetX, { min: -3000, max: 3000, defecto: 0 }),
      offsetY: o.offsetY === undefined ? null : numero(`${r}.offsetY`, o.offsetY, { min: -3000, max: 3000, defecto: 0 }),
    }
  })

  return {
    ok: errores.length === 0,
    errores,
    spec: { version: VERSION_SPEC, formato, plantilla, imagen, borde, fondo, textos, iconos },
  }
}

// SVG (como data URI) de un ícono del set, en negro para poder recolorearlo después
export function urlSvgIcono(icono) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="256" height="256"><path d="${icono.d}" fill="#000"/></svg>`
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg)
}
