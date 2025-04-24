// frontend/src/features/dashboard/dashboardFilterSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'; // Importa createAsyncThunk
// Importar la función API directamente aquí
import { Parent as fetchParentClassifications } from '../../api/clasificacion.api';

// Definir el Async Thunk para cargar las clasificaciones principales
export const fetchParentClassificationsAsync = createAsyncThunk(
  'dashboardFilter/fetchParentClassifications', // Tipo de acción base
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchParentClassifications(); // Llamada a la API
      return data; // Los datos obtenidos serán el payload en el estado fulfilled
    } catch (error) {
      console.error("Error en fetchParentClassificationsAsync:", error.message);
      // Retornar el error con rejectWithValue para que esté disponible en el estado rejected
      return rejectWithValue(error.message || 'Error al obtener clasificaciones principales');
    }
  }
);


const initialState = {
  selectedParentClasificacionId: null,

  // Nuevos estados para la lista de clasificaciones principales
  parentClassificationsList: [],
  isLoadingParentClassifications: false,
  parentClassificationsError: null,
};

export const dashboardFilterSlice = createSlice({
  name: 'dashboardFilter',
  initialState,
  reducers: {
    setParentClasificacionFilter: (state, action) => {
      state.selectedParentClasificacionId = action.payload;
    },
    // Otros reducers de filtro/UI...
  },
  extraReducers: (builder) => {
    builder
      // Manejar el ciclo de vida del thunk fetchParentClassificationsAsync
      .addCase(fetchParentClassificationsAsync.pending, (state) => {
        state.isLoadingParentClassifications = true;
        state.parentClassificationsError = null; // Limpiar errores previos
      })
      .addCase(fetchParentClassificationsAsync.fulfilled, (state, action) => {
        state.isLoadingParentClassifications = false;
        state.parentClassificationsList = action.payload; // Guardar la lista obtenida
      })
      .addCase(fetchParentClassificationsAsync.rejected, (state, action) => {
        state.isLoadingParentClassifications = false;
        // Guardar el error del thunk (payload de rejectWithValue o error.message)
        state.parentClassificationsError = action.payload || action.error.message;
        state.parentClassificationsList = []; // Limpiar lista en caso de error
      });
      // Otros extraReducers para otros thunks si los tienes...
  },
});

export const { setParentClasificacionFilter } = dashboardFilterSlice.actions;

export default dashboardFilterSlice.reducer;