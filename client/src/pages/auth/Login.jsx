import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Section from '../../components/Section';
import useAuthStore from '../../store/authStore'; // 👈 importa el store
import '../../css/login.css';

export default function Login({ redirectTo }) { // Aceptamos la prop redirectTo
  const navigate = useNavigate();

  const { loginUser, loading, error, successMessage, clearMessages } = useAuthStore();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const togglePassword = () => setShowPassword(!showPassword);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      alert('Por favor, ingresa tu correo/cédula y contraseña.');
      return;
    }

    const credentialsToSend = {
      gmail: formData.email.includes('@') ? formData.email : undefined,
      cedula: !formData.email.includes('@') ? formData.email : undefined,
      contraseña: formData.password,
    };

    await loginUser(credentialsToSend); // 👈 llama al contexto
  };

  useEffect(() => {
    if (successMessage) {
      setTimeout(() => {
        clearMessages();
        navigate(redirectTo || '/dashboard'); // Redirige usando la prop `redirectTo`
      }, 1000); // esperar un poco antes de redirigir
    }
  }, [successMessage, navigate, clearMessages, redirectTo]);

  return (
    <div className="login-page flex h-screen">
      <Section />

      <div className="flex w-1/2 justify-center items-center bg-white p-10">
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6">
          <h2 className="text-3xl font-bold text-gray-800">Iniciar Sesión</h2>

          {/* Mostrar errores */}
          {error && (
            <div className="text-red-500 bg-red-100 p-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Campo email/cedula */}
          <div className="flex items-center border-2 border-gray-300 rounded-xl px-4 py-3">
            <span className="mr-3">📧</span>
            <input
              type="text"
              name="email"
              placeholder="Correo o Cédula"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full outline-none text-gray-700"
            />
          </div>

          {/* Campo contraseña */}
          <div className="flex items-center border-2 border-gray-300 rounded-xl px-4 py-3">
            <span className="mr-3">🔒</span>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full outline-none text-gray-700"
            />
            <div onClick={togglePassword} className="ml-3 cursor-pointer">
              {showPassword ? '🙈' : '👁️'}
            </div>
          </div>

          {/* Botón login */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition duration-200"
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>

          <p className="text-center text-sm text-gray-600">
            ¿No tienes cuenta?{' '}
            <Link to="/registro" className="text-blue-600 hover:underline font-medium">
              Regístrate
            </Link>
          </p>

          <p className="text-right text-sm text-blue-600 hover:underline cursor-pointer">
            ¿Olvidaste tu contraseña?
          </p>
        </form>
      </div>
    </div>
  );
}
