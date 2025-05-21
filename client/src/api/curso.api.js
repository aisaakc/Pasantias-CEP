import axios from 'axios';

export const getAllCursos = (name = '') => {
  return axios.get('http://localhost:3001/api/cursos', {
    params: name ? { name } : {},
  });
};
