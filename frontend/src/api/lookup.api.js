// frontend/src/api/lookup.api.js
import axios from 'axios';

// Puedes definir la URL base aquí o considerar una instancia de axios centralizada (ver nota abajo)
const API_BASE_URL = 'http://localhost:3001/api/auth';

export const fetchGeneros = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/generos`);
        return response;
    } catch (error) {
        console.error("Error fetching generos:", error);
        throw error;
    }
};

export const fetchRoles = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/roles`);
        return response;
    } catch (error) {
        console.error("Error fetching roles:", error);
        throw error;
    }
};

export const fetchPreguntasSeguridad = async () => { // Cambiado a 'Seguridad' para claridad
    try {
        const response = await axios.get(`${API_BASE_URL}/preguntas`);
        return response;
    } catch (error) {
        console.error("Error fetching preguntas:", error);
        throw error;
    }
};

// Nota: Para evitar repetir la URL base y configuraciones (como headers),
// podrías crear una instancia de axios centralizada (ej. en src/api/axiosInstance.js)
// y usar esa instancia en todos tus archivos *.api.js.
// Ejemplo:
// // src/api/axiosInstance.js
// import axios from 'axios';
// const instance = axios.create({ baseURL: 'http://localhost:3001/api' });
// export default instance;
//
// // Luego en lookup.api.js y auth.api.js:
// import api from './axiosInstance';
// export const fetchGeneros = async () => api.get('/auth/generos');
// export const register = async (userData) => api.post('/auth/register', userData);