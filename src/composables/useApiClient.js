import { ref } from 'vue';
import { useRouter } from 'vue-router';

export function useApiClient(apiData) {
  const router = useRouter();
  const baseURL = 'https://cjjc.edu.ar/api-v2/';
  const fetchCount = ref(0); // Contador reactivo para loading
  const r = ref({ ok: false, status: 0, errMsg: '' }); // Estado de respuesta

  class ApiClient {
    constructor(apiData) {
      this.apiData = apiData;
      //this.destFolder = this.setDestinationFolder();
    }
/*
    // Calcula destFolder basado en router.currentRoute.path
    setDestinationFolder() {
      const path = router.currentRoute.value.path.toLowerCase();
      if (path.includes('adm')) return 'adm';
      if (path.includes('profesores')) return 'profesores';
      if (path.includes('alumnos')) return 'alumnos';
      if (path.includes('preinscripciones') || path.includes('inscripcion') || path.includes('pi-pye')) return 'preinscripciones';
      return 'public'; // Default
    }
*/
    // Mostrar spinner (usa un elemento #loading o un componente global)
    showSpinner() {
      const loadingDiv = document.getElementById('loading');
      if (loadingDiv) loadingDiv.classList.remove('d-none');
      // O usa un store Pinia para loading global
    }

    // Ocultar spinner si no hay fetchs pendientes
    hideSpinner() {
      if (fetchCount.value === 0) {
        const loadingDiv = document.getElementById('loading');
        if (loadingDiv) loadingDiv.classList.add('d-none');
      }
    }

    // Método genérico para peticiones
    async request(method = 'POST', data = this.apiData, responseType = 'json') {
      if (!data) {
        console.warn('No data provided for the request. Aborting fetch.');
        return Promise.reject(new Error('No data provided'));
      }

      fetchCount.value++;
      this.showSpinner();

      const headers = { 'Content-Type': 'application/json' };
      const options = {
        method,
        headers,
        credentials: 'include', // Incluye cookies HttpOnly automáticamente
      };

      let url = '';

      if (method === 'GET') {
        const queryString = new URLSearchParams({
          //dirName: this.destFolder,
          resource: data.resource,
          id: data.id,
          payload: JSON.stringify(data.payload),
        }).toString();
        url = `${baseURL}?${queryString}`;
      } else {
        url = baseURL;
        options.body = JSON.stringify({
          dirName: this.destFolder,
          resource: data.resource,
          id: data.id,
          payload: data.payload,
        });
      }

      try {
        const response = await fetch(url, options);
        r.value.ok = response.ok;
        r.value.status = response.status;

        if (!r.value.ok) {
          const errorResponse = await response.text();
          r.value.errMsg = errorResponse;
          if (r.value.errMsg) showModal('Error', r.value.errMsg, 2); // Usa tu modal
          throw new Error(`HTTP Error: ${response.status} - ${errorResponse}`);
        }

        return responseType === 'blob' ? await response.blob() : await response.json();
      } catch (error) {
        console.error('API Error:', error.message);
        throw error;
      } finally {
        fetchCount.value--;
        this.hideSpinner();
      }
    }

    // Métodos auxiliares
    get() {
      return this.request('GET');
    }

    post() {
      return this.request('POST');
    }

    getPDF(fileName = 'archivo.pdf') {
      return this.request('GET', this.apiData, 'blob').then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    }

    getFile(fileName = 'file.file') {
      return this.request('GET', this.apiData, 'blob').then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    }
  }

  // Instancia de ApiClient
  const api = new ApiClient(apiData);

  // Función adaptada para abrir panel (usa router)
  const openUsrPanel = (d) => {
    api.apiData.setData('login', d.area, { codUsuario: d.id });
    let area = d.area === 1 ? 'alumnos' : 'profesores';
    api.get().then((r) => {
      if (api.r.value.ok) {
        router.push(`/${area}/userpanel`);
      }
    });
  };

  return { api, r, openUsrPanel, fetchCount }; // Expone la instancia y estado
}