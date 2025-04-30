import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Section from '../../components/Section';
import '../../css/login.css';
import useAuthStore from '../../store/authStore';
import { toast } from 'sonner';
import { shallow } from 'zustand/shallow';

export default function Login() {
  const navigate = useNavigate();

  // Extraer el estado y las acciones necesarias del store usando shallow comparison
  const { loginUser, loading, error, successMessage, clearMessages } = useAuthStore(
    state => ({
      loginUser: state.loginUser,
      loading: state.loading,
      error: state.error,
      successMessage: state.successMessage,
      clearMessages: state.clearMessages,
    }),
    shallow
  );

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [hasClearedMessages, setHasClearedMessages] = useState(false); // Nueva bandera

  useEffect(() => {
    // Solo actúa si hay un mensaje de éxito y no está en estado de carga
    if (successMessage && !loading) {
      toast.success(successMessage);

      const timer = setTimeout(() => {
        navigate('/dashboard');
      }, 1000);

      return () => clearTimeout(timer); // Limpiar el timer cuando el componente se desmonte
    }

    if (error && !loading) {
      toast.error(error);
    }

    // Ejecutar clearMessages solo una vez para evitar que se ejecute en cada render
    if (!hasClearedMessages) {
      clearMessages(); // Limpiar mensajes solo la primera vez
      setHasClearedMessages(true); // Marcar que se ha limpiado el mensaje
    }

    return () => {
      // Clean up: si se desmonta el componente, reiniciar la bandera
      setHasClearedMessages(false);
    };
  }, [successMessage, error, loading, navigate, clearMessages, hasClearedMessages]); // Dependencias controladas

  const togglePassword = () => setShowPassword(!showPassword);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setHasClearedMessages(false); // Resetear la bandera antes de iniciar sesión

    if (!formData.email || !formData.password) {
      toast.warning('Por favor, ingresa tu correo/cédula y contraseña.');
      return;
    }

    const credentialsToSend = {
      gmail: formData.email.includes('@') ? formData.email : undefined,
      cedula: !formData.email.includes('@') ? formData.email : undefined,
      contraseña: formData.password,
    };

    loginUser(credentialsToSend); // Llamada a la acción de login solo al enviar el formulario
  };

  return (
    <div className="login-page flex h-screen">
      <Section />
      <div className="flex w-1/2 justify-center items-center bg-white p-10">
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6">
          <h2 className="text-3xl font-bold text-gray-800 text-center">Iniciar Sesión</h2>

          {/* Campo Correo o Cédula */}
          <div className="flex items-center border-2 border-gray-300 rounded-xl px-4 py-3">
            <span className="mr-3 text-xl">📧</span>
            <input
              type="text"
              name="email"
              placeholder="Correo o Cédula"
              value={formData.email}
              onChange={handleChange}
              className="w-full outline-none text-gray-700 bg-transparent"
            />
          </div>

          {/* Campo Contraseña */}
          <div className="flex items-center border-2 border-gray-300 rounded-xl px-4 py-3">
            <span className="mr-3 text-xl">🔒</span>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              className="w-full outline-none text-gray-700 bg-transparent"
            />
            <div onClick={togglePassword} className="ml-3 cursor-pointer select-none">
              {showPassword ? '🙈' : '👁️'}
            </div>
          </div>

          {/* Botón de envío */}
          <button
            type="submit"
            className={`w-full bg-blue-600 text-white py-3 rounded-xl font-semibold transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
            disabled={loading}
          >
            {loading ? 'Cargando...' : 'Ingresar'}
          </button>

          {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}

          {/* Enlace a Registro */}
          <p className="text-center text-sm text-gray-600 mt-6">
            ¿No tienes cuenta?{' '}
            <Link to="/registro" className="text-blue-600 hover:underline font-medium">
              Regístrate
            </Link>
          </p>

          {/* Enlace a Olvidaste Contraseña */}
          <p className="text-right text-sm text-blue-600 hover:underline cursor-pointer">
            ¿Olvidaste tu contraseña?
          </p>
        </form>
      </div>
    </div>
  );
}
