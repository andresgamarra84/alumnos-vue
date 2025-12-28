// src/composables/useMesasExamen.js
import { ref } from 'vue';
import { api } from '@/api/api';

export function useMesasExamen() {
  /* ---------- state ---------- */
  const carreras = ref([]);
  const materias = ref([]);
  const mesasDisponibles = ref([]);
  const mesasInscriptas = ref([]);
  const condiciones = ref([]);

  const loading = ref(false);
  const error = ref(null);

  /* ---------- helpers ---------- */

  const resetError = () => {
    error.value = null;
  };

  const assertOk = r => {
    if (!r || r.ok !== true) {
      throw new Error(r?.message || 'Error en la solicitud');
    }
    return r.payload;
  };

  /* ---------- api calls ---------- */

  const loadInicial = async () => {
    loading.value = true;
    resetError();

    try {
      const r = await api.get({
        entity: 'examenes',
        action: 0,
      });

      const payload = assertOk(r);

      carreras.value = payload.carreras ?? [];
      condiciones.value = payload.condiciones ?? [];
    } catch (e) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  };

  const loadMaterias = async codAlCarrera => {
    loading.value = true;
    resetError();

    materias.value = [];
    mesasDisponibles.value = [];

    try {
      const r = await api.get({
        entity: 'examenes',
        action: 1,
        codAlCarrera,
      });

      materias.value = assertOk(r) ?? [];
    } catch (e) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  };

  const loadMesas = async (codAlCarrera, codMC) => {
    loading.value = true;
    resetError();

    mesasDisponibles.value = [];

    try {
      const r = await api.get({
        entity: 'examenes',
        action: 2,
        codAlCarrera,
        codMC,
      });

      mesasDisponibles.value = assertOk(r) ?? [];
    } catch (e) {
      error.value = e;
    } finally {
      loading.value = false;
    }
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
