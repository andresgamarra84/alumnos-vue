# FlyerEditor.vue

Componente Vue 3 (`<script setup>`) con el editor de flyers en vivo para el
Conservatorio Juan José Castro / Semana de las Artes.

## Instalación en tu repo

1. Copiá `FlyerEditor.vue` a tu carpeta de componentes, por ejemplo:
   `src/components/FlyerEditor.vue`

2. Copiá la carpeta `assets/` (con los dos PNG) **al lado** del componente,
   o ajustá las rutas de import si preferís ubicarlas en otro lugar:

   ```js
   import circuloSrc from './assets/circulo-60-aniversario.png'
   import semanaSrc from './assets/logo-semana-de-las-artes.png'
   ```

   Ambas imágenes ya vienen recortadas con fondo transparente (sin el
   degradé de color que tapaba la firma).

3. Usalo en cualquier vista:

   ```vue
   <template>
     <FlyerEditor />
   </template>

   <script setup>
   import FlyerEditor from '@/components/FlyerEditor.vue'
   </script>
   ```

## Tipografías

El diseño usa **Cormorant Garamond** (títulos) e **Inter** (UI y texto
informativo). Si tu proyecto no las carga globalmente, agregá esto a tu
`index.html` o a tu CSS global (no va dentro del componente porque son
recursos compartidos de la app):

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

Si no las cargás, el canvas cae a las fuentes serif/sans-serif del sistema
(sigue siendo legible, solo cambia la tipografía).

## Requisitos

- Vue 3 (usa Composition API con `<script setup>`).
- Un bundler que resuelva imports de imágenes como assets (Vite, Vue CLI /
  webpack). Si tu setup no lo soporta, reemplazá los `import ... from
  './assets/...'` por las rutas públicas correspondientes (por ejemplo,
  sirviendo los PNG desde `public/` y usando `/logos/archivo.png`).

## Notas

- Todo el renderizado ocurre en el navegador de quien usa el componente
  (nada se envía a un servidor).
- El botón **Color de los logos** recolorea ambos PNG preservando su forma
  (usa `globalCompositeOperation: 'source-atop'`), útil si elegís un fondo
  oscuro y necesitás los logos en blanco.
