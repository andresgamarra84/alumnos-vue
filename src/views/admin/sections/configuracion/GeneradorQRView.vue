<template>
  <div class="row g-3">
    <h3 class="h3cabecera">Generador de QR</h3>

    <div class="col-12 recuadro">
      <label for="qrUrl" class="form-label fw-bold">URL</label>
      <div class="input-group">
        <input
          id="qrUrl"
          v-model="url"
          class="form-control"
          type="url"
          placeholder="https://ejemplo.com"
          @keyup.enter="generar"
        >
        <button class="btn btn-primary" :disabled="!url.trim()" @click="generar">
          Generar QR
        </button>
      </div>
    </div>

    <div v-if="qrDataUrl" class="col-12 recuadro text-center">
      <img :src="qrDataUrl" alt="Código QR" class="img-fluid" style="max-width: 320px">
      <div class="text-muted small text-break my-2">{{ urlGenerada }}</div>
      <button class="btn btn-success" @click="descargar">Descargar PNG</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import QRCode from "qrcode"
import { showToast } from "@/services/uiBus"

const url = ref("")
const urlGenerada = ref("")
const qrDataUrl = ref("")

const generar = async () => {
  const valor = url.value.trim()
  if (!valor) return
  try {
    qrDataUrl.value = await QRCode.toDataURL(valor, {
      width: 1024,
      margin: 2,
      errorCorrectionLevel: "M",
    })
    urlGenerada.value = valor
  } catch (err) {
    qrDataUrl.value = ""
    showToast("No se pudo generar el QR. El texto puede ser demasiado largo.", "error")
  }
}

const descargar = () => {
  const a = document.createElement("a")
  a.href = qrDataUrl.value
  a.download = "qr.png"
  a.click()
}
</script>
