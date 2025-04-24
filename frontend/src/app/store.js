// frontend/src/app/store.js (ejemplo)
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import dashboardFilterReducer from '../features/dashboard/dashboardFilterSlice'; // Importa el nuevo reducer

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboardFilter: dashboardFilterReducer, // Añade el nuevo reducer aquí
    // Otros reducers...
  },
});