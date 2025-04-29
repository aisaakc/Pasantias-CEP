import axios from "axios";

export const register = async (userData) =>
    axios.post('http://localhost:3001/api/auth/register', userData);

export const login = async (userAuth) => 
    axios.post('http://localhost:30001/api/auth/login' , userAuth);

export const getGeneros = async () =>
    axios.get('http://localhost:3001/api/auth/generos');

export const getRoles = async () => 
    axios.get('http://localhost:3001/api/auth/roles');

export const getPreguntas = async () => 
    axios.get('http://localhost:3001/api/auth/preguntas');