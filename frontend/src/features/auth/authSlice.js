// frontend/src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'; 
import { register as registerRequest, login as loginRequest } from '../../api/auth.api';
import { toast } from 'react-toastify'; 

const TOKEN_STORAGE_KEY = 'token';
const USER_STORAGE_KEY = 'user';


export const checkAuthAsync = createAsyncThunk(
  'auth/checkAuth', 
  async (_, { dispatch }) => { 
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);

    if (token && storedUser) {
      try {
        
        const user = JSON.parse(storedUser);
       
        return user;
      } catch (error) {
        console.error("Error parsing stored user:", error);
       
        dispatch(logoutAsync()); 
        throw error; 
      }
    } else {
     
      return null;
    }
  }
);

export const loginAsync = createAsyncThunk(
    'auth/login', // Tipo de acción base
    async (credentials, { rejectWithValue, dispatch }) => { 
      try {
        const res = await loginRequest(credentials); 
        const { token, user } = res.data; 
  
  
        localStorage.setItem(TOKEN_STORAGE_KEY, token);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  
        return user;
  
      } catch (error) {
        console.error("Error en loginAsync:", error.response?.data || error.message);
       
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        localStorage.removeItem(USER_STORAGE_KEY);
  
  
        let errorMessageToDisplay = 'Ocurrió un error al iniciar sesión.'; 
  
        if (error.response) {
            if (error.response.status === 401 || error.response.status === 403) {
              
                 errorMessageToDisplay = 'Correo/Cédula o contraseña incorrectos.';
            } else if (error.response.data && error.response.data.error === 'Invalid credentials') {
                
                  errorMessageToDisplay = 'Correo/Cédula o contraseña incorrectos.';
            } else if (error.response.data && typeof error.response.data === 'string' && error.response.data.includes('Unauthorized')) {
             
                  errorMessageToDisplay = 'Correo/Cédula o contraseña incorrectos.';
            }
            
             else if (error.response.data && (error.response.data.message || error.response.data.error)) {
                
                errorMessageToDisplay = error.response.data.message || error.response.data.error;
            }
        } else if (error.message) {
            
             errorMessageToDisplay = error.message;
        }
    
        return rejectWithValue(errorMessageToDisplay);
      }
    }
  );

export const registerAsync = createAsyncThunk(
    'auth/register',
    async (userData, { rejectWithValue }) => {
        try {
            const res = await registerRequest(userData); 
          
            return res.data;
        } catch (error) {
            console.error("Error en registerAsync:", error.response?.data || error.message);
       
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const logoutAsync = createAsyncThunk(
  'auth/logout', 
  async () => {
  
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
   
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  isLoggingIn: false,
  isRegistering: false,
  loginError: null,
  registerError: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
  
  },
  // extraReducers maneja las acciones de los Thunks (pending, fulfilled, rejected)
  extraReducers: (builder) => {
    builder
      .addCase(checkAuthAsync.pending, (state) => {
        state.isLoading = true; // Empieza la carga inicial
      })
      .addCase(checkAuthAsync.fulfilled, (state, action) => {
        state.isLoading = false; // Termina la carga inicial
        const user = action.payload; // El usuario retornado por el thunk
        if (user) {
          state.isAuthenticated = true;
          state.user = user;
        } else {
          state.isAuthenticated = false;
          state.user = null;
        }
      })
      .addCase(checkAuthAsync.rejected, (state, action) => {
        state.isLoading = false; 
        state.isAuthenticated = false;
        state.user = null;
        console.error("Check auth failed:", action.error.message); // Log del error
        // No establecemos un error visible aquí a menos que quieras notificar al usuario que la verificación falló
      })

      // ---- loginAsync ----
      .addCase(loginAsync.pending, (state) => {
        state.isLoggingIn = true;
        state.loginError = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.isLoggingIn = false;
        state.isAuthenticated = true;
        state.user = action.payload; // action.payload contiene el objeto user completo
        state.loginError = null;

        const { nombre, apellido } = action.payload;
       
        const nombreCompleto = [nombre, apellido].filter(Boolean).join(' '); 

        toast.success(`¡Bienvenido ${nombreCompleto || 'usuario'}!`);
        // --- FIN CAMBIO ---
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.isLoggingIn = false;
        state.isAuthenticated = false;
        state.user = null;
        state.loginError = action.payload || action.error.message || 'Error al iniciar sesión.';

        toast.error(state.loginError);
      })

      // ---- registerAsync ----
       .addCase(registerAsync.pending, (state) => {
        state.isRegistering = true; 
        state.registerError = null; 
      })
      .addCase(registerAsync.fulfilled, (state, action) => {
        state.isRegistering = false; 
        state.registerError = null;

         toast.success('Registro exitoso');
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.isRegistering = false; 
        state.registerError = action.payload || action.error.message || 'Error en el registro.';
    
        toast.error(typeof state.registerError === 'string' ? state.registerError : (state.registerError.message || 'Error en el registro'));
      })

      .addCase(logoutAsync.fulfilled, (state) => {
        state.isAuthenticated = false; 
        state.user = null; 
         toast.info('Sesión cerrada.');
      });
  },
});

export default authSlice.reducer;