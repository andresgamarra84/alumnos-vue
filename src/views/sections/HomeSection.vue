<template>
  <div class="card">
    <div class="card-body">
      <h5>Bienvenido a Home</h5>
      <p>Contenido cargado dinámicamente.</p>
      <button @click="fetchData" class="btn btn-info">Cargar Datos</button>
      <pre>{{ data }}</pre>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { api } from '../../api/api.js';



const data = ref(null);
const fetchData = async () => {
    data.value = await api.get('data.php', 'getHomeData');
};

onMounted(() => {
    console.log('HomeSection mounted');
    // Lógica inicial aquí
});



//return { data, fetchData };

</script>