import { useLoading } from '@/composables/useLoading'
import { showToast } from '@/services/uiBus'
const { start, stop } = useLoading()
import { BASE_URL, SESSION_NAME } from '@/config/app.config'

const request = async (options = {}) => {
    // options.spinner === false: no muestra el spinner de pantalla completa (el llamador maneja la espera)
    const spinner = options.spinner !== false
    try {
        let url = BASE_URL;
        const token = sessionStorage.getItem(SESSION_NAME)
        if (token) {
            options.headers.Authorization = `Bearer ${token}`
        }
        if (options.method === "GET" || !options.method) {
            // Convierte body a query params automáticamente para GET
            if (options.body && typeof options.body === 'object') {
                options.body.payload = JSON.stringify(options.body.payload) ?? {};
                const params = new URLSearchParams(options.body);
                url += `?${params.toString()}`;
            }
        }
        start(spinner);
        const response = await fetch(url, {
            method: options.method || 'GET',
            headers: {
                'Content-Type': 'application/' + options.type,
                ...options.headers,
            },
            body: options.method !== 'GET' ? JSON.stringify(options.body) : null,
           // credentials: 'include', // Incluir cookies
        });

        // Manejo inteligente de response type
        let data;
        //const contentType = response.headers.get('Content-Type');
        if (options.type == 'json'){//(contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            data = await response.blob();
            if (data.size) {
                return data
            }
        }
        if (response.status == 401 && token) {
            window.dispatchEvent(new CustomEvent('session-expired'))
            throw new Error('SESSION_EXPIRED')
        }
        if (!data.ok) {
            if (!options.silent) showToast(data.message, 'error')
        }
        else if (!response.ok){
            throw new Error(data.message || 'Error en la solicitud');
        }
        return {
            ...data,
            serverOk:response.ok,
            serverStatus:response.status
        }
    } catch (error) {
        throw new Error(error.message || 'Error de conexión. Intenta de nuevo.');
    }
    finally {
        stop(spinner);
    }
};

// opts (segundo parámetro, opcional en todos los métodos):
//   silent:  false por defecto. Con true no muestra el toast de error automático (el llamador maneja el error)
//   spinner: true por defecto. Con false no muestra el spinner de pantalla completa (el llamador maneja la espera)
//   headers: encabezados HTTP extra (el Authorization y el Content-Type los arma request)
// Ej.: api.get({ entity, action, payload }, { spinner: false })
// `headers` se crea nuevo en cada llamada porque request le agrega el Authorization.
export const api = {
    post: (body, opts = {}) => request({ type: 'json', method: 'POST', body, ...opts, headers: { ...opts.headers } }),
    get: (params, opts = {}) => request({ type: 'json', method: 'GET', body: params, ...opts, headers: { ...opts.headers } }),
    getPDF: (params, opts = {}) => request({ type: 'pdf', method: 'GET', body: params, ...opts, headers: { ...opts.headers } }),
};