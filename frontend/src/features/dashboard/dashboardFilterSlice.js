import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    getParentClassifications,
    createClasificacion,
    getAllSubclasificacionesByType, // Importamos la nueva función API
} from '../../api/clasificacion.api';


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

export const createClasificacionAsync = createAsyncThunk(
    'dashboardFilter/createClasificacion',
    async (clasificacionData, { dispatch, rejectWithValue }) => {
        try {
            const responseData = await createClasificacion(clasificacionData);


            return responseData;
        } catch (error) {
            console.error("Error en createClasificacionAsync:", error);

            if (error.message.includes("Ya existe una clasificación con este nombre.")) {
                 return rejectWithValue(error.message); // Re-lanzar el mensaje de error específico del backend
            }
            return rejectWithValue(error.message || 'Error al crear clasificación');
        }
    }
);

// Nuevo Async Thunk para obtener subclasificaciones por typeId
export const fetchSubClassificationsByTypeAsync = createAsyncThunk(
    'dashboardFilter/fetchSubClassificationsByType',
    async (typeId, { rejectWithValue }) => {
        try {
            const data = await getAllSubclasificacionesByType(typeId);
            return data;
        } catch (error) {
            console.error(`Error en fetchSubClassificationsByTypeAsync para typeId ${typeId}:`, error);
            return rejectWithValue(error.message || `Error al obtener subclasificaciones para el tipo ${typeId}`);
        }
    }
);


const initialState = {
    selectedParentClasificacionId: null,
    parentClassificationsList: [],
    isLoadingParentClassifications: false,
    parentClassificationsError: null,

    isLoadingCreateClasificacion: false,
    createClasificacionError: null,

    // Nuevos estados para las subclasificaciones
    subClassificationsList: [], // Para almacenar la lista de subclasificaciones cargadas actualmente
    isLoadingSubClassifications: false,
    subClassificationsError: null,

    // subclasificacionesPorPadre: {} // Este podrías usarlo si quisieras cachear por padre, pero para mostrar en una página separada, una lista simple es más fácil. Lo comentaré por ahora.
};

export const dashboardFilterSlice = createSlice({
    name: 'dashboardFilter',
    initialState,
    reducers: {
        setParentClasificacionFilter: (state, action) => {
            state.selectedParentClasificacionId = action.payload;
        },
        clearCreateClasificacionError: (state) => {
            state.createClasificacionError = null;
        },
        // Opcional: Limpiar el estado de subclasificaciones al salir de la página
        clearSubClassifications: (state) => {
            state.subClassificationsList = [];
            state.isLoadingSubClassifications = false;
            state.subClassificationsError = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // ... (addCase para fetchParentClassificationsAsync y createClasificacionAsync se mantienen igual)
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

            .addCase(createClasificacionAsync.pending, (state) => {
                state.isLoadingCreateClasificacion = true;
                state.createClasificacionError = null;
            })
            .addCase(createClasificacionAsync.fulfilled, (state, action) => {
                state.isLoadingCreateClasificacion = false;
                 // Opcional: Si la creación fue exitosa y era un padre, podrías añadirlo a la lista de padres localmente
                 // state.parentClassificationsList.push(action.payload); // Asegúrate de que el backend devuelva el objeto creado
                console.log('Clasificación creada con éxito:', action.payload);
            })
            .addCase(createClasificacionAsync.rejected, (state, action) => {
                state.isLoadingCreateClasificacion = false;
                state.createClasificacionError = action.payload;
                console.error('Error de creación capturado en slice:', action.payload);
            })

            // Nuevos addCase para fetchSubClassificationsByTypeAsync
            .addCase(fetchSubClassificationsByTypeAsync.pending, (state) => {
                state.isLoadingSubClassifications = true;
                state.subClassificationsError = null;
                state.subClassificationsList = []; // Limpiar lista anterior al cargar
            })
            .addCase(fetchSubClassificationsByTypeAsync.fulfilled, (state, action) => {
                state.isLoadingSubClassifications = false;
                state.subClassificationsList = action.payload;
            })
            .addCase(fetchSubClassificationsByTypeAsync.rejected, (state, action) => {
                state.isLoadingSubClassifications = false;
                state.subClassificationsError = action.payload;
                state.subClassificationsList = [];
            });
    },
});

// Exportamos la nueva acción
export const { setParentClasificacionFilter, clearCreateClasificacionError, clearSubClassifications } = dashboardFilterSlice.actions;
export default dashboardFilterSlice.reducer;