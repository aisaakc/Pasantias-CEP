import axios from 'axios';

export const getParentClassifications = async () => {
    try {
  
        const response = await axios.get('http://localhost:3001/api/clasificaciones/parent');
        return response.data;
    } catch (error) {
        console.error('Error obteniendo clasificaciones principales:', error.message);
        throw error;
    }
};


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

export const getAllSubclasificacionesByType = async (typeId) => {
    try {
        const response = await axios.get(`http://localhost:3001/api/clasificaciones/tipo/${typeId}`);
        return response.data;
    } catch (error) {
        console.error(`Error obteniendo subclasificaciones para typeId ${typeId} (API):`, error.message);
         // Propagar el error para que pueda ser manejado por el thunk/componente
        throw error;
    }
};

