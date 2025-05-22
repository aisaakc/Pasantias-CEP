import { create } from 'zustand';
import { 
  getAllCursos,
  getAllCursosById
} from '../api/curso.api';

const CLASSIFICATION_IDS = {
  CURSOS: 5,
  MODALIDAD: 100050,
  STATUS: 100059
};

export const useCursoStore = create((set, get) => ({
  // Estado inicial
  cursos: [],
  cursoActual: null,
  modalidades: [],
  status: [],
  loading: false,
  error: null,

  // Cargar opciones del formulario
  fetchOpcionesCurso: async () => {
    try {
      set({ loading: true });
      const [cursosResponse, modalidadesResponse, statusResponse] = await Promise.all([
        getSubclassificationsById(CLASSIFICATION_IDS.CURSOS),
        getSubclassificationsById(CLASSIFICATION_IDS.MODALIDAD),
        getSubclassificationsById(CLASSIFICATION_IDS.STATUS)
      ]);

      set({
        cursos: cursosResponse.data,
        modalidades: modalidadesResponse.data,
        status: statusResponse.data,
        loading: false
      });
    } catch (error) {
      console.error("Error en fetchOpcionesCurso:", error);
      set({
        loading: false,
        error: 'Error al cargar las opciones del curso.'
      });
    }
  },

  // Utilidades
  clearError: () => set({ error: null }),
  getCursoById: (id) => {
    const { cursos } = get();
    return cursos.find(c => c.id_curso === id) || null;
  },

  // Operaciones de lectura
  fetchCursos: async () => {
    set({ loading: true, error: null });
    try {
      const response = await getAllCursos();
      set({
        cursos: response.data,
        loading: false,
      });
    } catch (error) {
      console.error("Error en fetchCursos:", error);
      set({
        loading: false,
        error: 'Error al obtener los cursos.',
      });
    }
  },

  fetchCursoById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await getAllCursosById(id);
      set({
        cursoActual: response.data,
        loading: false,
      });
    } catch (error) {
      console.error("Error en fetchCursoById:", error);
      set({
        loading: false,
        error: 'Error al obtener el curso.',
      });
    }
  },

  // Operaciones de escritura
  createCurso: async (cursoData) => {
    set({ loading: true, error: null });
    try {
      // TODO: Implementar la API de creación
      // const response = await createCursoAPI(cursoData);
      // set(state => ({
      //   cursos: [...state.cursos, response.data],
      //   loading: false,
      // }));
      set({ loading: false });
    } catch (error) {
      console.error("Error en createCurso:", error);
      set({
        loading: false,
        error: 'Error al crear el curso.',
      });
    }
  },

  updateCurso: async (id, cursoData) => {
    set({ loading: true, error: null });
    try {
      // TODO: Implementar la API de actualización
      // const response = await updateCursoAPI(id, cursoData);
      // set(state => ({
      //   cursos: state.cursos.map(curso => 
      //     curso.id_curso === id ? response.data : curso
      //   ),
      //   loading: false,
      // }));
      set({ loading: false });
    } catch (error) {
      console.error("Error en updateCurso:", error);
      set({
        loading: false,
        error: 'Error al actualizar el curso.',
      });
    }
  },

  
}));
