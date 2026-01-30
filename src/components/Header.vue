<template>
    <header>
        <h2 class="text-center">{{props.titulo}}</h2>
    </header>
</template>
<script setup>
const props = defineProps({
    titulo : {
        type: String,
        required: true
    }
})
</script>
