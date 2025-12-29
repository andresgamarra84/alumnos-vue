// src/composables/useMesasExamen.js
import { ref } from 'vue';
import { api } from '@/api/api';

export function useMesasExamen() {
  /* ---------- state ---------- */
  const materias = ref([]);
  const mesasDisponibles = ref([]);
  const mesasInscriptas = ref([]);
  const condiciones = ref([]);

  const loading = ref(false);
  const error = ref(null);

  /* ---------- api calls ---------- */

   const loadMesas = async (codAlCarrera, codMC) => {
 

    
  };

  const loadMesasInscriptas = async () => {
    loading.value = true;
    resetError();

    try {
      const r = await api.get({
        entity: 'examenes',
        action: 3,
      });

      mesasInscriptas.value = assertOk(r) ?? [];
    } catch (e) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  };

  const inscribirse = async payload => {
    loading.value = true;
    resetError();

    try {
      const r = await api.post({
        entity: 'examenes',
        action: 4,
        ...payload,
      });

      assertOk(r);
      return true;
    } catch (e) {
      error.value = e;
      return false;
    } finally {
      loading.value = false;
    }
  };

  /* ---------- FUTURO: cancelar inscripción ---------- */
  /*
  const cancelarInscripcion = async codMesa => {
    loading.value = true;
    resetError();

    try {
      const r = await api.post({
        entity: 'examenes',
        action: 5,
        codMesa,
      });

      assertOk(r);

      mesasInscriptas.value = mesasInscriptas.value.filter(
        m => m.codigo !== codMesa
      );

      return true;
    } catch (e) {
      error.value = e;
      return false;
    } finally {
      loading.value = false;
    }
  };
  */

  return {
    /* state */
    carreras,
    materias,
    mesasDisponibles,
    mesasInscriptas,
    condiciones,
    loading,
    error,

    /* actions */
    loadInicial,
    loadMaterias,
    loadMesas,
    loadMesasInscriptas,
    inscribirse,
    // cancelarInscripcion
  };
}
