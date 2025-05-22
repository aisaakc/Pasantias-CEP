import axios from 'axios';

export const getAllCursos = async () => 
   axios.get('http://localhost:3001/api/date/cursos');

export const getAllCursosById = async (id) =>
   axios.get(`http://localhost:3001/api/date/cursos/${id}`);

export const createCurso = async (curso) =>
   axios.post('http://localhost:3001/api/date/cursos', curso);

