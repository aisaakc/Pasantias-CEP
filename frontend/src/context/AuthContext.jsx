import { createContext, useContext, useState } from 'react';
import { register as registerRequest } from '../api/auth.api';
import { toast } from 'react-toastify';  // Importar toast

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const register = async (data) => {
    try {
      const res = await registerRequest(data);
      toast.success('Registro exitoso');
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error en el registro');
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, register }}>
      {children}
    </AuthContext.Provider>
  );
};
