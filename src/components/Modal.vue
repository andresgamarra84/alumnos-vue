<script setup>
import { defineProps, defineEmits } from 'vue';

defineProps({
  isVisible: Boolean,
  title: String,
  message: String,
  type: Number, // 1 para confirmación, 2 para info/input
});

const emit = defineEmits(['resolve']);
</script>

<template>
  <div v-if="isVisible" class="modal-overlay">
    <div class="modal-content">
      <h2>{{ title }}</h2>
      <p>{{ message }}</p>
      <input v-if="type === 2" type="text" class="form-control" />
      <div class="modal-buttons">
        <template v-if="type === 1">
          <button class="btn btn-success" @click="emit('resolve', true)">Sí</button>
          <button class="btn btn-danger" @click="emit('resolve', false)">No</button>
        </template>
        <template v-else>
          <button class="btn btn-primary" @click="emit('resolve', true)">Aceptar</button>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Importa estilos de modal.css */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 5px;
  max-width: 500px;
}
.modal-buttons {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}
</style>