// frontend/src/api/lookup.api.js
import axios from 'axios'; // Importa directamente el paquete instalado

// URL base para las rutas de autenticación/lookups
const API_BASE_URL = 'http://localhost:3001/api/auth'; // Usa tu URL base completa si prefieres

// Exporta las funciones con tus nombres originales
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

export const fetchPreguntasSeguridad = async () => { // Mantienes tu nombre original
    try {
        const response = await axios.get(`${API_BASE_URL}/preguntas`);
        return response;
    } catch (error) {
        console.error("Error fetching preguntas:", error);
        throw error;
    }
};

export const getClasificacionItemsApi = (typeId) => {
      if (!typeId) {
        throw new Error("Se requiere un typeId para obtener los elementos hijos de clasificación.");
      }
      return axios.get(`${API_BASE_URL}/clasificaciones/${typeId}/items`);
    };

// Mantén la nueva función para las clasificaciones principales
export const getParentClassificationsApi = () => axios.get(`${API_BASE_URL}/clasificaciones/parents`); // Puedes mantener este nombre o cambiarlo también si quieres