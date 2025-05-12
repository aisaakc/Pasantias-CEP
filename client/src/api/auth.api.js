import axios from "axios";

export const register = async (userData) =>
    axios.post('http://localhost:3001/api/auth/register', userData);

export const login = async (userAuth) => 
    axios.post('http://localhost:3001/api/auth/login' , userAuth);

export const getSubclassificationsById = async (id) =>
    axios.get(`http://localhost:3001/api/auth/SubC/${id}`);

