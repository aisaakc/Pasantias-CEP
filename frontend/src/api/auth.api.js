import axios from 'axios';
export const register = async (userData) =>
    axios.post('http://localhost:3001/api/auth/register', userData)