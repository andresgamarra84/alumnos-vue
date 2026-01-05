<template>
  <div class="container mt-5">

    <!-- ===== LOGIN ===== -->
    <form
      v-if="step === 'login'"
      @submit.prevent="login"
      class="col-md-4 mx-auto"
    >
      <div class="mb-3">
        <label>DNI</label>
        <input v-model="dni" class="form-control" required />
      </div>

      <div class="mb-3">
        <label>Contraseña</label>
        <input
          v-model="password"
          type="password"
          class="form-control"
          required
        />
      </div>

      <button class="btn btn-primary w-100">
        Ingresar
      </button>
    </form>

    <!-- ===== CAMBIO DE PASSWORD ===== -->
    <form
      v-else
      @submit.prevent="changePassword"
      class="col-md-4 mx-auto"
    >
      <h5 class="mb-3">Debe cambiar su contraseña</h5>

      <div class="mb-3">
        <label>Nueva contraseña</label>
        <input
          v-model="newPwd"
          type="password"
          class="form-control"
          required
        />
      </div>

      <div class="mb-3">
        <label>Repetir contraseña</label>
        <input
          v-model="newPwdRepeat"
          type="password"
          class="form-control"
          required
        />
      </div>

      <button class="btn btn-primary w-100">
        Guardar contraseña
      </button>
    </form>

  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/api/api'
import { showModal } from '@/services/uiBus'

const router = useRouter()

const step = ref('login')
const id = ref('')
const dni = ref('')
const password = ref('')

const newPwd = ref('')
const newPwdRepeat = ref('')

const login = async () => {
  const r = await api.post({
    entity: 'login',
    action: 'login',
    type: 1,
    payload: {
      nrodoc: dni.value,
      pwd: password.value
    }
  })

  if (r.payload.state === 'updPwd') {
    step.value = 'changePwd'
    id.value = r.payload.id
    return
  }

  if (r.payload.state === "OK") {
    router.replace('/estudiantes')
  }
}

const changePassword = async () => {
  if (newPwd.value !== newPwdRepeat.value) {
    await showModal('Las contraseñas no coinciden', 0, 'Error')
    return
  }
  const r = await api.post({
    entity: 'login',
    action: 'updatePwd',
    payload: {
      pwd: newPwd.value,
      token: id.value,
    },
    type:1,
  })

  if (r.payload === "Updated") {
    await showModal('Contraseña actualizada correctamente')
    router.replace('/estudiantes')
  }
}
</script>

