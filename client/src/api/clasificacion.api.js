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
  let id = id_clasificacion;
  // Si es base64 (no solo dígitos), decodifica primero
  if (typeof id === 'string' && !/^\d+$/.test(id)) {
    const decoded = decodeId(id);
    if (decoded) id = decoded;
  }
  return axios.get(`http://localhost:3001/api/clasificaciones/parents/${encodeId(id)}`);
};

export const getJerarquiaDesde = async (id_raiz) => 
    axios.get(`http://localhost:3001/api/clasificaciones/jerarquia/${id_raiz}`);


