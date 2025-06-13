import axios from 'axios';

export const getAllCursos = async () => 
   axios.get('http://localhost:3001/api/cursos');

export const getAllCursosById = async (id) =>
   axios.get(`http://localhost:3001/api/cursos/${id}`);

export const createCurso = async (curso) =>
   axios.post('http://localhost:3001/api/cursos', curso);

export const updateCurso = async (id, curso) =>
   axios.put(`http://localhost:3001/api/cursos/${id}`, curso);

export const updateHorariosCurso = async (id, horarios) =>
   axios.put(`http://localhost:3001/api/cursos/${id}/horarios`, { horarios });

export const getFacilitadores = async () =>
   axios.get('http://localhost:3001/api/facilitadores')
