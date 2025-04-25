import axios from 'axios';

// ✅ Eliminada la constante API_BASE_URL

// Función para obtener los elementos de clasificación por typeId
export const getAllClasificacionItems = async (typeId) => {
    try {
        // ✅ Usando URL completa directamente
        const response = await axios.get(`http://localhost:3001/api/clasificaciones/${typeId}/items`);
        return response.data;
    } catch (error) {
        console.error(`Error obteniendo los elementos de clasificación por typeId (${typeId}):`, error.message);
        throw error;
    }
};

// Función para obtener las clasificaciones principales
export const getParentClassifications = async () => {
    try {
        // ✅ Usando URL completa directamente
        const response = await axios.get('http://localhost:3001/api/clasificaciones/parent');
        return response.data;
    } catch (error) {
        console.error('Error obteniendo clasificaciones principales:', error.message);
        throw error;
    }
};

// --- Función para crear una clasificación ---
// ✅ Usando la URL solicitada: http://localhost:3001/api/clasificaciones/create
export const createClasificacion = async (clasificacionData) => {
    try {
        // Realiza una solicitud POST a la URL especificada por el usuario
        const response = await axios.post('http://localhost:3001/api/clasificaciones/create', clasificacionData);
        return response.data;
    } catch (error) {
        console.error('Error al crear clasificación (API):', error);
        if (error.response && error.response.data && error.response.data.error) {
            throw new Error(error.response.data.error);
        } else {
            throw new Error('Error al crear clasificación. Inténtalo de nuevo.');
        }
    }
};

// Opcional: Mantener exportaciones con nombres originales si es necesario
// export { getAllClasificacionItems as All, getParentClassifications as Parent, createClasificacion as create };