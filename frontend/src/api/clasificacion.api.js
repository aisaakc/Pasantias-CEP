import axios from 'axios';

// Función para obtener los elementos de clasificación por typeId
export const All = async (select) => {
    try {
        // Aquí 'select' debe ser un objeto con el 'typeId' que quieres enviar como parámetro
        const response = await axios.get(`http://localhost:3001/api/clasificaciones/${select}/items`);
        return response.data;
    } catch (error) {
        console.error('Error obteniendo los elementos de clasificación:', error.message);
        throw error;
    }
};

// Función para obtener las clasificaciones principales
export const Parent = async () => {
    try {
        const response = await axios.get('http://localhost:3001/api/clasificaciones/parent');
        return response.data;
    } catch (error) {
        console.error('Error obteniendo clasificaciones principales:', error.message);
        throw error;
    }
};
