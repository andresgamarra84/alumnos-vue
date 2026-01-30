<template>
  <div
    class="col-12 col-md-6 col-lg-4 mb-4"
    v-show="!showRegulares || item.inscriptoEnMaterias"
  >
    <div class="card border-0 shadow-sm">
      <div class="card-body text-center">
        <h5 class="card-title text-truncate">{{ item.nombre }}</h5>

        <p class="card-text text-muted">
          {{ item.email }} | {{ item.nroDoc }}
        </p>

        <div class="d-flex justify-content-around">
          <button
            class="btn btn-outline-primary btn-sm"
            @click="togglePersonalData"
          >
            Detalles
          </button>

          <button
            class="btn btn-outline-info btn-sm"
            @click="emit('open-panel', item.codigo)"
          >
            Ingresar
          </button>

          <button
            v-if="!item.validado"
            class="btn btn-outline-warning btn-sm"
            @click="emit('send-key', index)"
          >
            Enviar clave
          </button>

          <span v-else></span>

          <button
            class="btn btn-outline-secondary btn-sm"
            @click="emit('show-message', index)"
          >
            Mensaje
          </button>
        </div>
      </div>
        <transition name="personal-data">
            <PersonalData
            v-if="showData"
            :item="item"
            :area="area"
            @delete="emit('del-user', item.codigo)"
            />
        </transition>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import PersonalData from '@/views/admin/components/PersonalData.vue'
const showData = ref(false)
defineProps({
  item: Object,
  index: Number,
  area: String,
  showRegulares: Boolean
})

const emit = defineEmits([
  //'show-data',
  'del-user',
  'open-panel',
  'send-key',
  'show-message'
])
const togglePersonalData = () => {
    showData.value = !showData.value;
}
</script>
<style>
.ontop {
	z-index: 999;
	bottom: 0;
	right: 0;
	position: fixed;
}
.boton:hover{
	background-color:#3d6e9c;
	text-decoration:underline;
}
#personalData {
    transition: all 0.3s ease-in-out; /* Suaviza cambios dinámicos */
    width: 100%;                     /* Asegurar que respete el ancho del padre */
    max-width: 100%;
}

#personalData div {
    overflow-wrap: break-word;  /* Permitir saltos de línea en palabras largas */
    word-break: break-word;     /* Romper palabras largas si es necesario */
    white-space: normal;        /* Permitir saltos de línea normales */
    overflow: visible;          /* Asegurar que todo el contenido sea visible */
    padding: 0.5rem 0;          /* Añadir un poco de espacio vertical entre divs */
}
/* Clase para la transición de entrada */
.personal-data-enter-active, .personal-data-leave-active {
    transition: all 0.3s ease-in-out; /* Suavidad en la animación (0.5 segundos) */
}

/* Estado inicial al mostrar (antes de que el elemento aparezca visualmente) */
.personal-data-enter {
    opacity: 0;                     /* Empieza invisible */
    max-height: 0;                  /* La altura empieza en 0 */
    transform: scaleY(0.8);         /* Opción: Puede iniciar encogido verticalmente */
    overflow: hidden;               /* Evitar desbordamiento inicial */
}

/* Estado final al ocultar (después de que el elemento se haya ocultado) */
.personal-data-leave-to {
    opacity: 0;                     /* Se desvanece hacia invisible */
    max-height: 0;                  /* La altura vuelve a 0 */
    transform: scaleY(0.8);         /* Termina "encogido" */
    overflow: hidden;
}
/* Restaurar estilos de Bootstrap para botones dentro de cards */
.card .btn {
    /* Restaurar estilos base de Bootstrap */
    display: inline-block;
    font-weight: 400;
    text-align: center;
    vertical-align: middle;
    user-select: none;
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
    line-height: 1.5;
	border: 1px solid;
    border-radius: 0.2rem;
	background-color: var(--color-fondo-principal);
    transition: color 0.15s ease-in-out, 
                background-color 0.15s ease-in-out,
                border-color 0.15s ease-in-out, 
                box-shadow 0.15s ease-in-out;
}

/* Restaurar estilos específicos para cada variante */
.card .btn-outline-primary {
    color: #007bff;
    border-color: #007bff;
}
.card .btn-outline-primary:hover {
    color: #fff;
    background-color: #007bff;
    border-color: #007bff;
}

.card .btn-outline-info {
    color: #17a2b8;
    border-color: #17a2b8;
}
.card .btn-outline-info:hover {
    color: #fff;
    background-color: #17a2b8;
    border-color: #17a2b8;
}

.card .btn-outline-secondary {
    color: #6c757d;
    border-color: #6c757d;
}
.card .btn-outline-secondary:hover {
    color: #fff;
    background-color: #6c757d;
    border-color: #6c757d;
}

.card .btn-outline-warning {
    color: #ffc107;
    border-color: #ffc107;
}
.card .btn-outline-warning:hover {
    color: #212529;
    background-color: #ffc107;
    border-color: #ffc107;
}
/* DARK MODE */
.dark-mode {
    --color-boton-hover: #284b70; /* Azul profundo para hover */
    --color-personal-data-bg: #1e1e1e; /* Fondo oscuro para personalData */
    --color-card-bg: #2a2a2a; /* Fondo de las cards */
    --color-boton-bg: #333; /* Fondo base para botones */
    --color-texto-base: #e0e0e0; /* Texto claro */
    --color-texto-secundario: #a9a9a9; /* Texto más suave */
    --color-borde: #444; /* Bordes oscuros */

    --color-outline-primary: #4a90e2;
    --color-outline-info: #5bc0de;
    --color-outline-secondary: #868e96;
    --color-outline-warning: #f0ad4e;

    --color-outline-primary-hover-bg: #357abd;
    --color-outline-info-hover-bg: #31b0d5;
    --color-outline-secondary-hover-bg: #4c5258;
    --color-outline-warning-hover-bg: #ec971f;
}

/* Posiciones y Fondo */
.dark-mode .ontop {
    z-index: 999;
    bottom: 0;
    right: 0;
    position: fixed;
}

/* Botones */
.dark-mode .boton:hover {
    background-color: var(--color-boton-hover);
    text-decoration: underline;
}

/* Personal data */
.dark-mode #personalData {
    transition: all 0.3s ease-in-out;
    background: var(--color-personal-data-bg);
    color: var(--color-texto-base);
    width: 100%;
    max-width: 100%;
}
.dark-mode #personalData div {
    overflow-wrap: break-word;
    word-break: break-word;
    white-space: normal;
    overflow: visible;
    padding: 0.5rem 0;
    background: var(--color-personal-data-bg);
    color: var(--color-texto-base);
}

/* Para Transiciones */
.dark-mode .personal-data-enter-active, .dark-mode .personal-data-leave-active {
    transition: all 0.3s ease-in-out;
}
.dark-mode .personal-data-enter {
    opacity: 0;
    max-height: 0;
    transform: scaleY(0.8);
    overflow: hidden;
}
.dark-mode .personal-data-leave-to {
    opacity: 0;
    max-height: 0;
    transform: scaleY(0.8);
    overflow: hidden;
}

/* Cards */
.dark-mode .card .btn {
    display: inline-block;
    font-weight: 400;
    text-align: center;
    vertical-align: middle;
    user-select: none;
    background-color: var(--color-boton-bg);
    color: var(--color-texto-base);
}
</style>