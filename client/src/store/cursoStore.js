import { create } from 'zustand';
import { CLASSIFICATION_IDS } from '../config/classificationIds';
import { 
  getAllCursos,
  getAllCursosById,
  createCurso,
  updateCurso as updateCursoAPI,
  getFacilitadores
} from '../api/curso.api';


export const useCursoStore = create((set, get) => ({
  // Estado inicial
  cursos: [],
  modalidades: [],
  status: [],
  roles_facilitador: [],
  cursoActual: null,
  loading: false,
  error: null,
  participantes: [],
  formasPago: [],
  bancos: [],

  // Cargar opciones del formulario
  fetchOpcionesCurso: async () => {
    const state = get();
    if (state.loading) {
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

  // Resetear estado para cargar datos frescos
  resetState: () => set({
    cursos: [],
    modalidades: [],
    status: [],
    roles_facilitador: [],
    loading: false,
    error: null
  }),

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

  // Obtener facilitadores
  fetchFacilitadores: async () => {
    set({ loading: true, error: null });
    try {
      const response = await getFacilitadores();
      const facilitadores = Array.isArray(response.data?.data) ? response.data.data : [];
      set({
        roles_facilitador: facilitadores,
        loading: false,
      });
      return facilitadores;
    } catch (error) {
      console.error("Error en fetchFacilitadores:", error);
      set({
        loading: false,
        error: 'Error al obtener los facilitadores.',
        roles_facilitador: []
      });
      throw error;
    }
  },

  // Obtener formas de pago y bancos
  fetchFormasPagoYBancos: async () => {
    set({ loading: true, error: null });
    try {
      const [formasPagoRes, bancosRes, cursosRes] = await Promise.all([
        getAllCursosById(CLASSIFICATION_IDS.FORMA_PAGO),
        getAllCursosById(CLASSIFICATION_IDS.BANCOS),
        getAllCursos(),
      ]);
      const formasPago = Array.isArray(formasPagoRes?.data?.data) ? formasPagoRes.data.data : [];
      const bancos = Array.isArray(bancosRes?.data?.data) ? bancosRes.data.data : [];
      const cursos = Array.isArray(cursosRes?.data?.data) ? cursosRes.data.data : [];
      set({
        formasPago,
        bancos,
        cursos,
        loading: false,
      });
    } catch (error) {
      console.error('Error al cargar formas de pago, bancos y cursos:', error);
      set({
        formasPago: [],
        bancos: [],
        cursos: [],
        loading: false,
        error: 'Error al cargar formas de pago, bancos y cursos.'
      });
    }
  },

  // Agregar participante al array global
  addParticipante: (participante) => set((state) => ({
    participantes: [...state.participantes, participante]
  })),

}));