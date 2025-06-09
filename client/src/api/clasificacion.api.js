import axios from 'axios';

export const getParentClassifications = async () => 
    axios.get('http://localhost:3001/api/clasificaciones/parent');

export const create = async (clasificacionData) =>
    axios.post('http://localhost:3001/api/clasificaciones/create', clasificacionData);

export const update = async (id, clasificacionData) =>
    axios.put(`http://localhost:3001/api/clasificaciones/update/${id}`, clasificacionData);

export const getAllSubclasificaciones = async (id, id_parent) => 
    axios.get(`http://localhost:3001/api/clasificaciones/tipo/${id}/${id_parent}`);

export const getAllClasificaciones = async () =>
    axios.get('http://localhost:3001/api/clasificaciones/all');

export const deleteClasificacion = async (id) =>
    axios.delete(`http://localhost:3001/api/clasificaciones/delete/${id}`);

export const getParentHierarchy = async (id_clasificacion) => 
    axios.get(`http://localhost:3001/api/clasificaciones/parents/${id_clasificacion}`);



