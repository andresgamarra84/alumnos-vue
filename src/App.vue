<script setup>
import { uiState, closeModal } from '@/services/uiBus'
import GlobalModal from '@/components/GlobalModal.vue'
</script>

<template>
  <router-view />

  <GlobalModal
    :isVisible="uiState.modal.visible"
    :title="uiState.modal.title"
    :message="uiState.modal.message"
    :type="uiState.modal.type"
    @resolve="closeModal"
  />
</template>
