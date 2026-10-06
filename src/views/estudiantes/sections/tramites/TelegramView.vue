<template>
  <div class="container">
    <h3 class="h3cabecera">Vincular Telegram</h3>

    <div class="row recuadro">
      <template v-if="status.linked">
        <div class="col-12">
          <p>
            Tu cuenta está vinculada a Telegram
            <strong v-if="status.username">(@{{ status.username }})</strong>.
          </p>
          <p>Vas a recibir por esa cuenta las novedades y avisos del Conservatorio.</p>
        </div>
        <div class="col-12 text-end">
          <button class="btn btn-secondary" @click="unlinkAccount">
            Desvincular
          </button>
        </div>
      </template>

      <template v-else>
        <div class="col-12">
          <p>
            Vinculá tu cuenta de Telegram para recibir novedades y avisos del
            Conservatorio directamente en tu celular.
          </p>
        </div>

        <div v-if="!generated.code" class="col-12">
          <button class="btn btn-primary" @click="generateCode">
            Generar código de vinculación
          </button>
        </div>

        <div v-else class="col-12">
          <p>1. Tocá el botón para abrir el bot de Telegram:</p>
          <a
            v-if="generated.deepLink"
            :href="generated.deepLink"
            target="_blank"
            class="btn btn-primary mb-3"
          >
            Abrir Telegram
          </a>
          <p>
            Si el botón no funciona, abrí Telegram, buscá el bot del
            Conservatorio y enviale el mensaje:
          </p>
          <p class="codigo-vinculacion">/start {{ generated.code }}</p>
          <p>Este código vence en {{ generated.expiresInMinutes }} minutos.</p>

          <div class="text-end">
            <button class="btn btn-secondary me-2" @click="generateCode">
              Generar otro código
            </button>
            <button class="btn btn-primary" @click="checkLinked">
              Ya vinculé, verificar
            </button>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { api } from '@/api/api'
import { showModal, showToast } from '@/services/uiBus'

const status = reactive({ linked: false, username: null })
const generated = reactive({ code: null, deepLink: null, expiresInMinutes: null })

const fetchStatus = async () => {
  const r = await api.get({ entity: 'telegram', action: 'getStatus' })
  Object.assign(status, r.payload)
}

const generateCode = async () => {
  const r = await api.post({ entity: 'telegram', action: 'generateCode' })
  Object.assign(generated, r.payload)
}

const checkLinked = async () => {
  await fetchStatus()
  if (status.linked) {
    generated.code = null
    generated.deepLink = null
    showToast('¡Cuenta vinculada correctamente!', 'success')
  } else {
    showToast('Todavía no detectamos la vinculación. Probá de nuevo en unos segundos.', 'error')
  }
}

const unlinkAccount = async () => {
  const { ok } = await showModal(
    '¿Confirma que desea desvincular su cuenta de Telegram?',
    1,
    'Confirmación'
  )
  if (!ok) return

  await api.post({ entity: 'telegram', action: 'unlinkTelegram' })
  await fetchStatus()
  showToast('Cuenta de Telegram desvinculada', 'success')
}

onMounted(fetchStatus)
</script>

<style scoped>
.codigo-vinculacion {
  font-size: 1.4rem;
  font-weight: bold;
  letter-spacing: 0.1em;
  background: #f1f1f1;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  display: inline-block;
}
</style>
