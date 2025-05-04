import axios from 'axios';

export const getParentClassifications = async () => 
    axios.get('http://localhost:3001/api/clasificaciones/parent');

export const create = async (clasificacionData) =>
    axios.post('http://localhost:3001/api/clasificaciones/create', clasificacionData);

export const update = async (id, clasificacionData) =>
    axios.put(`http://localhost:3001/api/clasificaciones/update/${id}`, clasificacionData);

export const getSubclasificaciones = async (id) => 
    axios.get(`http://localhost:3001/api/clasificaciones/tipo/${id}`);

export const getClasificacionHijos = async (id) =>
    axios.get(`http://localhost:3001/api/clasificaciones/parent/${id}`);

export const getAllClasificaciones = async () =>
    axios.get('http://localhost:3001/api/clasificaciones/all');

// export const getClasificacionById = async (id) =>
//     axios.get(`http://localhost:3001/api/clasificaciones/id/${id}`);    

  

