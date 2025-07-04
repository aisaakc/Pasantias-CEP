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
   axios.get('http://localhost:3001/api/facilitadores');

export const asociarDocumentoACurso = async (id_curso, id_documento) =>
   axios.post('http://localhost:3001/api/cursos/asociar-documento', { id_curso, id_documento });

export const validateCohorteCode = async (codigo_cohorte, id_nombre) =>
   axios.get(`http://localhost:3001/api/cursos/validate-cohorte?codigo_cohorte=${codigo_cohorte}&id_nombre=${id_nombre}`);

export const addParticipanteToCohorte = async (cohorteId, participante) =>
   axios.post(`http://localhost:3001/api/cursos/${cohorteId}/participantes`, participante);

export const getConteoGeneroDesdeParticipantes = async (participantes) =>
   axios.post('http://localhost:3001/api/cursos/estadisticas/conteo-genero-participantes', { participantes });

export const getParticipantesPorCohorte = async (cohorteId) =>
   axios.get(`http://localhost:3001/api/cursos/${cohorteId}/participantes`);

export const getCohortesPorCurso = async () =>
   axios.get('http://localhost:3001/api/cursos/cohortes-por-curso');

export const getCursosByFacilitador = async (id_facilitador) =>
   axios.get(`http://localhost:3001/api/cursos/facilitador/${id_facilitador}`);

export const updateAsistenciaParticipante = async (cohorteId, idParticipante, idHorario, presente) =>
   axios.put(`http://localhost:3001/api/cursos/${cohorteId}/participantes/${idParticipante}/asistencia`, { idHorario, presente });

export const getHorariosByCohorte = async (cohorteId) =>
   axios.get(`http://localhost:3001/api/cursos/${cohorteId}/horarios`);
