<script setup>
import { uiState, removeToast } from '@/services/uiBus'
</script>

<template>
  <div class="toast-stack">
    <transition-group name="toast-fade" tag="div">
      <div
        v-for="t in uiState.toasts"
        :key="t.id"
        class="toast-item"
        :class="`toast-${t.type}`"
        role="alert"
        @click="removeToast(t.id)"
      >
        {{ t.message }}
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
.toast-stack {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 10500;
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: min(360px, calc(100vw - 32px));
}
.toast-item {
  padding: 12px 16px;
  border-radius: 8px;
  color: #fff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
  cursor: pointer;
  font-size: 0.95rem;
  white-space: pre-line;
}
.toast-success {
  background: #2e7d32;
}
.toast-error {
  background: #c62828;
}
.toast-info {
  background: #33638d;
}
.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.25s ease;
}
.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
