import { createContext, useContext, useState, useEffect } from 'react';
import { register as registerRequest, login as loginRequest } from '../api/auth.api';
import { toast } from 'react-toastify';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const TOKEN_STORAGE_KEY = 'token';
const USER_STORAGE_KEY = 'user';

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (token && storedUser) {
        try {

          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);

        } catch (error) {
          console.error("Error verificando sesión:", error);
          logout();
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }

      setLoading(false);
    };

    checkLogin();
  }, []);

  const register = async (data) => {
    try {
      const res = await registerRequest(data);
      toast.success('Registro exitoso');

      return res.data;
    } catch (error) {
      console.error("Error en AuthContext.register:", error.response?.data || error.message);
      const errorMessage = error.response?.data?.error || 'Error en el registro';
      toast.error(errorMessage);
      throw error;
    }
  };

  const login = async (credentials) => {
    try {

      const res = await loginRequest(credentials);

      const { token, user } = res.data;

      localStorage.setItem(TOKEN_STORAGE_KEY, token);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));

      setUser(user);
      setIsAuthenticated(true);

      toast.success(`¡Bienvenido ${user.nombre} ${user.apellido}!`);

      return user;

    } catch (error) {

      console.error("Error en AuthContext.login:", error.response?.data || error.message);

      const errorMessage = error.response?.data?.error || 'Error al iniciar sesión';
      toast.error(errorMessage);

      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);


      throw error;
    }
  };

  const logout = () => {

    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);

    setUser(null);
    setIsAuthenticated(false);

    toast.info('Sesión cerrada.');

  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      loading,
      register,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};