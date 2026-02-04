<template>
    <div
      :key="item.codHilo"
      class="row carrera-item"
      style="margin: 20px 0; cursor:pointer"
    >
      <div class="col-6">{{ item.asunto }}</div>
      <div class="col-6 text-end">{{ item.fechaIngreso }}</div>
      <slot />   
    </div>
</template>
<script setup>
  import { defineProps } from 'vue';
  const props = defineProps({
    item : {
      type: Object,
      required: true
    }
  })
</script>