import axios from "axios";

export const getUsuarios = async () => 
    axios.get('http://localhost:3001/api/usuarios');

export const getRoles = async () => 
    axios.get('http://localhost:3001/api/roles');