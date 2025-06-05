import { create } from 'zustand';
import { CLASSIFICATION_IDS } from '../config/classificationIds';
import { 
  getAllCursos,
  getAllCursosById,
  createCurso,
  updateCurso as updateCursoAPI
} from '../api/curso.api';

export const useCursoStore = create((set, get) => ({
  // Estado inicial
  cursos: [],
  modalidades: [],
  status: [],
  cursoActual: null,
  loading: false,
  error: null,

  // Cargar opciones del formulario
  fetchOpcionesCurso: async () => {
    const state = get();
    if (state.loading || (state.cursos.length > 0 && state.modalidades.length > 0)) {
      return;
    }
  
    try {
      set({ loading: true });
  
      const [cursosResponse, modalidadesResponse, statusResponse] = await Promise.all([
        getAllCursosById(CLASSIFICATION_IDS.CURSOS),
        getAllCursosById(CLASSIFICATION_IDS.MODALIDAD),
        getAllCursosById(CLASSIFICATION_IDS.STATUS)
      ]);
  
      const cursos = Array.isArray(cursosResponse?.data?.data) ? cursosResponse.data.data : [];
      const modalidades = Array.isArray(modalidadesResponse?.data?.data) ? modalidadesResponse.data.data : [];
      const status = Array.isArray(statusResponse?.data?.data) ? statusResponse.data.data : [];
  
      set({
        cursos,
        modalidades,
        status,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error("Error en fetchOpcionesCurso:", error);
      set({
        loading: false,
        error: 'Error al cargar las opciones del curso.',
        cursos: [],
        modalidades: [],
        status: [],
      });
    }
  },
  

  // Utilidades
  clearError: () => set({ error: null }),

  // Operaciones de lectura
  fetchCursos: async () => {
    set({ loading: true, error: null });
    try {
      const response = await getAllCursos();
      const cursos = Array.isArray(response.data?.data) ? response.data.data : [];
      set({
        cursos,
        loading: false,
      });
      return response;
    } catch (error) {
      console.error("Error en fetchCursos:", error);
      set({
        loading: false,
        error: 'Error al obtener los cursos.',
        cursos: []
      });
      throw error;
    }
  },

  fetchCursoById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await getAllCursosById(id);
      const curso = response.data?.data || null;
      set({
        cursoActual: curso,
        loading: false,
      });
    } catch (error) {
      console.error("Error en fetchCursoById:", error);
      set({
        loading: false,
        error: 'Error al obtener el curso.',
        cursoActual: null
      });
    }
  },

  // Operaciones de escritura
  createCurso: async (cursoData) => {
    set({ loading: true, error: null });
    try {
      const response = await createCurso(cursoData);
      const nuevoCurso = response.data?.data;
      set(state => ({
        cursos: Array.isArray(state.cursos) ? [...state.cursos, nuevoCurso] : [nuevoCurso],
        loading: false,
      }));
      return nuevoCurso;
    } catch (error) {
      console.error("Error en createCurso:", error);
      set({
        loading: false,
        error: 'Error al crear el curso.'
      });
      throw error;
    }
  },

  updateCurso: async (cursoData) => {
    set({ loading: true, error: null });
    try {
      const response = await updateCursoAPI(cursoData.id_curso, cursoData);
      const cursoActualizado = response.data?.data;
      set(state => ({
        cursos: state.cursos.map(curso => 
          curso.id_curso === cursoData.id_curso ? cursoActualizado : curso
        ),
        loading: false,
      }));
      return cursoActualizado;
    } catch (error) {
      console.error("Error en updateCurso:", error);
      set({
        loading: false,
        error: 'Error al actualizar el curso.'
      });
      throw error;
    }
  },

}));
