import axios from "axios";

export const All = async(select) =>
    axios.post('http://localhost:3001/clasificacion/clasificaciones/parent', select)