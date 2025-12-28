<template>
  <div class="container mt-5">
    <form @submit.prevent="login" class="col-md-4 mx-auto">
      <div class="mb-3">
        <label>Usuario</label>
        <input v-model="user" class="form-control" required />
      </div>
      <div class="mb-3">
        <label>Contraseña</label>
        <input v-model="pass" type="password" class="form-control" required />
      </div>
      <button type="submit" class="btn btn-primary">Login</button>
    </form>
  </div>
</template>

<script setup>
import { api } from '@/api/api.js';  // Ajusta path si es necesario
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const user = ref('');
const pass = ref('');

const login = async () => {
    try {
        await api.post({ 
            entity: 'login', 
            action: 'login',
            type: 0,
            payload: { nrodoc: user.value, pwd: pass.value } 
        });
        router.push('/dashboard');
    } catch (err) {
        alert('Error: ' + err.message);
    }
    //return { user, pass, login };
};
</script>