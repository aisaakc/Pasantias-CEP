// frontend/src/features/dashboard/dashboardFilterSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Importar las funciones API necesarias
import {
    getParentClassifications,
    createClasificacion // ✅ Importamos la función de creación
} from '../../api/clasificacion.api'; // Asegúrate que la ruta sea correcta

// Thunk para cargar clasificaciones principales (sin cambios)
export const fetchParentClassificationsAsync = createAsyncThunk(
  'dashboardFilter/fetchParentClassifications',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getParentClassifications();
      return data;
    } catch (error) {
      console.error("Error en fetchParentClassificationsAsync:", error);
      return rejectWithValue(error.message || 'Error al obtener clasificaciones principales');
    }
  }
);

// --- ✅ Nuevo Async Thunk para crear una clasificación ---
export const createClasificacionAsync = createAsyncThunk(
    'dashboardFilter/createClasificacion', // Tipo de acción base
    async (clasificacionData, { dispatch, rejectWithValue }) => { // Añadimos 'dispatch' aquí
        try {
            // Llama a la función API
            const responseData = await createClasificacion(clasificacionData);

            // ✅ Opcional: Si la creación fue exitosa y quieres actualizar la lista sin recargar la página,
            //             puedes disparar el thunk de carga aquí.
            //             Esto solo funciona si la lista que muestras (parentClassificationsList)
            //             se ve afectada por la creación (es decir, si creaste una clasificación principal).
            // dispatch(fetchParentClassificationsAsync()); // <-- Descomenta si quieres recargar la lista principal

            // Retorna los datos de la clasificación creada
            return responseData;
        } catch (error) {
             console.error("Error en createClasificacionAsync:", error);
             // rejectWithValue propagará el mensaje de error lanzado por la función API
             return rejectWithValue(error.message || 'Error al crear clasificación');
        }
    }
);
// --- Fin Nuevo Async Thunk ---


const initialState = {
  selectedParentClasificacionId: null,

  // Estados para la lista de clasificaciones principales
  parentClassificationsList: [],
  isLoadingParentClassifications: false,
  parentClassificationsError: null,

  // --- ✅ Nuevos estados para el proceso de creación ---
  isLoadingCreateClasificacion: false,
  createClasificacionError: null,
  // Opcional: newClasificacion: null, // Para guardar la recién creada temporalmente
  // --- Fin Nuevos estados ---
};

export const dashboardFilterSlice = createSlice({
  name: 'dashboardFilter',
  initialState,
  reducers: {
    setParentClasificacionFilter: (state, action) => {
      state.selectedParentClasificacionId = action.payload;
    },
    // ✅ Opcional: Reducer para limpiar el error de creación
    clearCreateClasificacionError: (state) => {
        state.createClasificacionError = null;
    },
    // ✅ Opcional: Reducer para limpiar newClasificacion si lo usas
    // clearNewClasificacion: (state) => {
    //     state.newClasificacion = null;
    // }
  },
  extraReducers: (builder) => {
    builder
      // Manejar ciclo de vida fetchParentClassificationsAsync (sin cambios)
      .addCase(fetchParentClassificationsAsync.pending, (state) => {
        state.isLoadingParentClassifications = true;
        state.parentClassificationsError = null;
      })
      .addCase(fetchParentClassificationsAsync.fulfilled, (state, action) => {
        state.isLoadingParentClassifications = false;
        state.parentClassificationsList = action.payload;
      })
      .addCase(fetchParentClassificationsAsync.rejected, (state, action) => {
        state.isLoadingParentClassifications = false;
        state.parentClassificationsError = action.payload;
        state.parentClassificationsList = [];
      })
      // --- ✅ Manejar el ciclo de vida del thunk createClasificacionAsync ---
      .addCase(createClasificacionAsync.pending, (state) => {
          state.isLoadingCreateClasificacion = true;
          state.createClasificacionError = null; // Limpiar errores de creación
          // state.newClasificacion = null;
      })
      .addCase(createClasificacionAsync.fulfilled, (state, action) => {
          state.isLoadingCreateClasificacion = false;
          // Opcional: Añadir la clasificación creada a la lista *si* corresponde a esta lista
          // Si la clasificación creada es principal y estás mostrando las principales, puedes añadirla
          // state.parentClassificationsList.push(action.payload); // O usar unshift()
          // state.newClasificacion = action.payload; // Guardar la nueva clasificación temporalmente
          console.log('Clasificación creada con éxito:', action.payload); // Log en el slice
      })
      .addCase(createClasificacionAsync.rejected, (state, action) => {
          state.isLoadingCreateClasificacion = false;
          // action.payload contiene el mensaje de error de rejectWithValue
          state.createClasificacionError = action.payload;
           console.error('Error de creación capturado en slice:', action.payload); // Log en el slice
      });
      // --- Fin extraReducers de Creación ---
  },
});

// Exportar las acciones, incluyendo las nuevas
export const { setParentClasificacionFilter, clearCreateClasificacionError } = dashboardFilterSlice.actions;

// Exportar el reducer
export default dashboardFilterSlice.reducer;