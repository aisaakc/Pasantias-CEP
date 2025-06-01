import axios from "axios";

export const getUsuarios = async () => 
    axios.get('http://localhost:3001/api/usuarios');