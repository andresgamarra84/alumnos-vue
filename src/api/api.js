const BASE_URL = "https://cjjc.edu.ar/api-v2/";

const request = async (endpoint, options = {}) => {
    try {
        if (options.method === "GET") {
            let e = {}
            if (endpoint) {
                e = new URLSearchParams(endpoint)
                endpoint = "?"+e.toString()
            }
        }
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: options.method || 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            body: options.body ? JSON.stringify(options.body) : null,
            credentials: 'include', // Incluir cookies
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error en la solicitud');
        }

        return data;
    } catch (error) {
        throw new Error(error.message || 'Error de conexión. Intenta de nuevo.');
    }
};

export const api = {
    post: (endpoint, body, headers = {}) => request(endpoint, { method: 'POST', body, headers }),
    get: (endpoint, headers = {}) => request(endpoint, { method:'GET', headers }),
    put: (endpoint, body, headers = {}) => request(endpoint, { method: 'PUT', body, headers }),
    delete: (endpoint, headers = {}) => request(endpoint, { method: 'DELETE', headers }),
};