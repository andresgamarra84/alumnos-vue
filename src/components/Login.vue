<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { api } from '../api/api';
import Modal from './Modal.vue';

//const { post } = useApiClient();
const router = useRouter();
const nrodoc = ref('');
const pass = ref('');
const newPwd = ref('');
const renewPwd = ref('');
const isUpdatingPassword = ref(false);
const modal = ref({
  isVisible: false,
  title: '',
  message: '',
  type: 2,
});

const login = async (nrodocValue = nrodoc.value, isNewPassword = false) => {
  try {
    const payload = {
      entity: "login",
      action: isNewPassword ? "update" : "login",
      type: 0,
      payload : isNewPassword ? { nrodoc: nrodocValue, newPwd: newPwd.value } : { nrodoc: nrodocValue, pwd: pass.value },
    }
    const response = await api.post('/', payload);
    switch (response.payload.stat) {
      case 'wrongPwd':
        showModal('Error', 'Contraseña incorrecta', 2);
        break;
      case 'noUser':
        showModal('Error', 'El Nro. de DNI no corresponde con un alumno', 2);
        break;
      case 'OK':
        router.push('/userpanel');
        break;
      case 'Updated':
        router.push('/');
        break;
      case 'updPwd':
        isUpdatingPassword.value = true;
        nrodoc.value = response.payload.id;
        break;
    }
  } catch (error) {
    showModal('Error', 'Error de conexión con el servidor', 2);
  }
};

const handlePasswordUpdate = () => {
  if (newPwd.value.length < 6) {
    showModal('Error', 'La contraseña debe contener al menos 6 caracteres', 2);
  } else if (newPwd.value.length > 15) {
    showModal('Error', 'La contraseña debe contener menos de 15 caracteres', 2);
  } else if (newPwd.value !== renewPwd.value) {
    showModal('Error', 'Las claves no coinciden', 2);
  } else {
    login(nrodoc.value, true);
  }
};

const showModal = (title, message, type) => {
  modal.value = { isVisible: true, title, message, type };
};
</script>

<template>
  <div class="container mt-4">
    <div id="log" class="col-12 col-md-6 offset-md-3 row" style="border: 1px solid beige; margin: 3vw auto;">
      <div class="col-12">
        <h3 class="h3cabecera">Ingreso al Panel de Estudiantes</h3>
      </div>
      <div v-if="!isUpdatingPassword" class="col-12 form-group">
        <label>Nro. de Documento:</label>
        <input v-model="nrodoc" type="text" id="nrodoc" class="form-control" required />
      </div>
      <div v-if="!isUpdatingPassword" class="col-12 form-group">
        <label>Clave:</label>
        <input v-model="pass" type="password" id="pass" class="form-control" required />
      </div>
      <div v-if="isUpdatingPassword" class="col-12 form-group">
        <label>Ingrese una nueva clave (entre 6 y 15 caracteres):</label>
        <input v-model="newPwd" type="password" id="new" class="form-control" required />
      </div>
      <div v-if="isUpdatingPassword" class="col-12 form-group">
        <label>Re-ingrese la clave:</label>
        <input v-model="renewPwd" type="password" id="renew" class="form-control" required />
      </div>
      <div class="col-12">
        <input
          v-if="!isUpdatingPassword"
          type="button"
          value="Ingresar"
          class="btn btn-primary"
          @click="login()"
        />
        <input
          v-else
          type="button"
          value="Aceptar"
          class="btn btn-primary"
          @click="handlePasswordUpdate()"
        />
      </div>
      <div class="col-12 text-center" style="padding: 20px">
        <router-link to="/lostpwd">¿Olvidó su contraseña?</router-link>
      </div>
    </div>
    <Modal
      :isVisible="modal.isVisible"
      :title="modal.title"
      :message="modal.message"
      :type="modal.type"
      @resolve="modal.isVisible = false"
    />
  </div>
</template>

<style scoped>
.h3cabecera {
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
}
</style>