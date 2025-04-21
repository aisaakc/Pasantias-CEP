import axios from 'axios';

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

export const fetchPreguntasSeguridad = async () => { 
    try {
        const response = await axios.get(`${API_BASE_URL}/preguntas`);
        return response;
    } catch (error) {
        console.error("Error fetching preguntas:", error);
        throw error;
    }
};

