<script setup>
import { useModal } from '@/composables/useModal'

const {
  isVisible,
  title,
  message,
  type,
  inputValue,
  resolve
} = useModal()
</script>

<template>
  <div
    class="modal-overlay"
    :class="{ 'd-none': !isVisible }"
    style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000;
    "
  >
    <div
      class="modal-content"
      style="
        background: var(--color-fondo-secundario);
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 4px 8px var(--sombra-suave);
        max-width: 400px;
        width: 90%;
      "
    >
      <h2>{{ title }}</h2>
      <p>{{ message }}</p>

      <input
        v-if="type === 2"
        v-model="inputValue"
        class="form-control mb-3"
        type="text"
      />

      <div class="modal-buttons text-end">
        <template v-if="type === 1">
          <button class="btn btn-success me-2" @click="resolve(true)">Sí</button>
          <button class="btn btn-danger" @click="resolve(false)">No</button>
        </template>

        <template v-else>
          <button class="btn btn-primary" @click="resolve(true)">Aceptar</button>
        </template>
      </div>
    </div>
  </div>
</template>
