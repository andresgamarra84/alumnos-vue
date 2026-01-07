import { useLoading } from '@/composables/useLoading'
import { showModal } from '@/services/uiBus'
const { start, stop } = useLoading()
const BASE_URL = "https://cjjc.edu.ar/api-v2/";

const request = async (options = {}) => {
    try {
        let url = BASE_URL;
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
                'Content-Type': 'application/json',
                ...options.headers,
            },
            body: options.method !== 'GET' ? JSON.stringify(options.body) : null,
            credentials: 'include', // Incluir cookies
        });

        // Manejo inteligente de response type
        let data;
        const contentType = response.headers.get('Content-Type');
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            data = await response.blob();
        }
        if (!data.ok) {
            showModal(data.message)
        }
        else if (!response.ok){
            throw new Error(data.message || 'Error en la solicitud');
        }
        return {
            ...data,
            serverOk:response.ok,
            serverStatus:response.status
        };
    } catch (error) {
        throw new Error(error.message || 'Error de conexión. Intenta de nuevo.');
    }
    finally {
        stop();
    }
};

export const api = {
    post: (body, headers = {}) => request({ method: 'POST', body, headers }),
    get: (params, headers = {}) => request({ method: 'GET', body: params, headers }),
};