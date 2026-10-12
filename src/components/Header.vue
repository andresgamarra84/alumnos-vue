<template>
    <header class="header-row">
        <h2 class="text-center flex-grow-1 mb-0">{{props.titulo}}</h2>
        <button
            type="button"
            class="dark-toggle"
            @click="toggleDarkMode"
            :title="isDark ? 'Modo claro' : 'Modo oscuro'"
        >
            {{ isDark ? '☀️' : '🌙' }}
        </button>
    </header>
</template>
<script setup>
import { useDarkMode } from '@/composables/useDarkMode'
const props = defineProps({
    titulo : {
        type: String,
        required: true
    }
})
const { isDark, toggleDarkMode } = useDarkMode()
</script>
<style scoped>
.header-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 0;
}

.dark-toggle {
    flex: 0 0 auto;
    width: 42px;
    height: 42px;
    font-size: 1.2rem;
    line-height: 1;
    background: var(--color-fondo-secundario);
    border: 1px solid var(--color-borde);
    border-radius: 50%;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.dark-toggle:hover {
    transform: scale(1.05);
    box-shadow: 0 2px 6px var(--sombra-hover);
}
</style>
