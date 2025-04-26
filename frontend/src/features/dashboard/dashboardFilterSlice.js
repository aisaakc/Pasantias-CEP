import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    getParentClassifications,
    createClasificacion,
    getSubclasificacionesByTypeId
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

            return rejectWithValue(error.message || 'Error al crear clasificación');
        }
    }
);
export const fetchSubclasificacionesByTypeIdAsync = createAsyncThunk(
    'dashboardFilter/fetchSubclasificacionesByTypeId',
    async (typeId, { rejectWithValue }) => {
        try {
            const data = await getSubclasificacionesByTypeId(typeId);
            return { typeId, data };
        } catch (error) {
            console.error("Error en fetchSubclasificacionesByTypeIdAsync:", error);
            return rejectWithValue(error.message || 'Error al obtener subclasificaciones');
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
    subclasificacionesPorPadre: {}
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

    },
    extraReducers: (builder) => {
        builder
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

                console.log('Clasificación creada con éxito:', action.payload);
            })
            .addCase(createClasificacionAsync.rejected, (state, action) => {
                state.isLoadingCreateClasificacion = false;

                state.createClasificacionError = action.payload;
                console.error('Error de creación capturado en slice:', action.payload);
                
            }).addCase(fetchSubclasificacionesByTypeIdAsync.fulfilled, (state, action) => {
                const { typeId, data } = action.payload;
                state.subclasificacionesPorPadre[typeId] = data;
            });
    },
});

export const { setParentClasificacionFilter, clearCreateClasificacionError } = dashboardFilterSlice.actions;
export default dashboardFilterSlice.reducer;