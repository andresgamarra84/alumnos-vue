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

      <button class="btn w-100">
        Ingresar
      </button>
      <div class="forgot-password">
        <button
          type="button"
          class="btn btn-primary w-100"
          @click="showRecovery = true"
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>
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
  <!-- MODAL RECUPERAR CONTRASEÑA -->
    <div v-if="showRecovery" class="recovery-backdrop">
      <div class="recovery-modal">
        <h3>Recuperar contraseña</h3>

        <p>
          Ingresá tu Nº de DNI y te enviaremos las instrucciones.
        </p>

        <input
          type="text"
          class="form-control"
          placeholder="Nº de DNI"
          v-model="recoveryUsr"
        />

        <div class="modal-actions">
          <button
            class="btn btn-secondary"
            @click="showRecovery = false"
          >
            Cancelar
          </button>

          <button @click='askRecover' class="btn btn-primary">
            Enviar
          </button>
        </div>
      </div>
    </div>
  </div>
  
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/api/api'
import { showModal } from '@/services/uiBus'
const showRecovery = ref(false)
const router = useRouter()
const recoveryUsr = ref('')
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
    sessionStorage.setItem("CJJC_USER", r.payload.token)
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
const askRecover = async () =>{
  if (!recoveryUsr.value) {
    showModal("El campo no puede estar vacío")
    return
  }
  const r = await api.post({
    entity:"login",
    action:"recoverUsr",
    type:1,
    payload:{
      nrodoc: recoveryUsr.value,
    }
  })
  showRecovery.value = false
  if (r.ok) showModal("Se ha enviado un correo al email registrado con la información necesaria para acceder.")
}
</script>
<style>
  .recovery-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1050;

  display: flex;
  align-items: center;
  justify-content: center;
}

.recovery-modal {
  background: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  z-index: 1060;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
}

</style>

