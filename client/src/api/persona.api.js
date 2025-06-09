import axios from "axios";

export const getUsuarios = async () => 
    axios.get('http://localhost:3001/api/usuarios');

export const getRoles = async () => 
    axios.get('http://localhost:3001/api/roles');

export const CreateUsers = async (userData) => 
    axios.post('http://localhost:3001/api/new', userData);

export const updateUser = async (id, userData) => 
    axios.put(`http://localhost:3001/api/usuarios/${id}`, userData);

