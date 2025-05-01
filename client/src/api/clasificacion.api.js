import axios from 'axios';

export const getParentClassifications = async () => 
    axios.get('http://localhost:3001/api/clasificaciones/parent');

export const create = async (clasificacionData) =>
    axios.post('http://localhost:3001/api/clasificaciones/create', clasificacionData);

export const getSubclasificaciones = async (id) => 
    axios.get(`http://localhost:3001/api/clasificaciones/tipo/${id}`);