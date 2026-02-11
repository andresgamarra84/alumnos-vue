import { useLoading } from '@/composables/useLoading'
import { showModal } from '@/services/uiBus'
const { start, stop } = useLoading()
import { BASE_URL, SESSION_NAME } from '@/config/app.config'

const request = async (options = {}) => {
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
        start();
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
        if (!data.ok) {
            showModal(data.message)
        }
        else if (!response.ok){
            if (response.status == 401) {
                window.dispatchEvent(new CustomEvent('session-expired'))
                throw new Error('SESSION_EXPIRED')
            }
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
        stop();
    }
};

export const api = {
    post: (body, headers = {}) => request({ type:'json', method: 'POST', body, headers }),
    get: (params, headers = {}) => request({ type:'json', method: 'GET', body: params, headers }),
    getPDF: (params, headers = {}) => request({ type: 'pdf', method: 'GET', body: params, headers }),
};