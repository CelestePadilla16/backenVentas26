const API_URL = "http://api.ventaabarrotes/";

export const api = {
    // Función para obtener datos del API
    get: async (endpoint) => {
       try { 
        const baseUrl = API_URL.replace(/\/$/, '');
        const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
        const response = await fetch(`${baseUrl}${path}`);
        if (!response.ok){
            throw new Error(`error! status: ${response.status}`);
                        }
        return response.json();
        } catch (error) {
        console.error('Error al obtener los datos:', error);
        throw error;
        }
    },
};
