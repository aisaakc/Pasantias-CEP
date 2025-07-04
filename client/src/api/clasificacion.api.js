import axios from 'axios';
import { encodeId, decodeId } from '../utils/hashUtils';

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

export const getAllIcons = async () => 
    axios.get('http://localhost:3001/api/clasificaciones/icons');

export const deleteClasificacion = async (id) =>
    axios.delete(`http://localhost:3001/api/clasificaciones/delete/${id}`);

export const getParentHierarchy = async (id_clasificacion) => {
  // Usar el id tal cual, sin decodificar ni codificar
  return axios.get(`http://localhost:3001/api/clasificaciones/parents/${id_clasificacion}`);
};

export const getJerarquiaDesde = async (id_raiz) => 
    axios.get(`http://localhost:3001/api/clasificaciones/jerarquia/${id_raiz}`);


