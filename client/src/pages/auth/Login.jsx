import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Section from '../../components/Section';
import useAuthStore from '../../store/authStore';
import { toast } from 'sonner';
import { EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { loginSchema } from '../../schemas/login.shema';

export default function Login({ redirectTo }) {
  const navigate = useNavigate();

  const { loginUser, loading, error, successMessage, clearMessages } = useAuthStore();
  

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [validationError, setValidationError] = useState('');

  const togglePassword = () => setShowPassword(!showPassword);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setValidationError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    try {
      // Validar el formulario
      loginSchema.parse(formData);

      const credentialsToSend = {
        gmail: formData.email.includes('@') ? formData.email : undefined,
        cedula: !formData.email.includes('@') ? formData.email : undefined,
        contraseña: formData.password,
      };

      await loginUser(credentialsToSend);
    } catch (error) {
      if (error.errors) {
        setValidationError(error.errors[0].message);
        toast.error(error.errors[0].message);
      }
      return;
    }
  };

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage); // ✅ Mostrar mensaje de éxito
      setTimeout(() => {
        clearMessages();
        navigate(redirectTo || '/dashboard');
      }, 1200);
    }

    if (error) {
      toast.error(error); // ✅ Mostrar mensaje de error
      clearMessages();
    }
  }, [successMessage, error, clearMessages, navigate, redirectTo]);

  return (
    <div className="login-page flex h-screen bg-gray-50">
      <Section />
      <div className="flex w-1/2 justify-center items-center p-10">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Bienvenido</h2>
             
            </div>

            <div className="space-y-4">
              <div className="flex items-center border-2 border-gray-200 rounded-xl px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all duration-200">
                <EnvelopeIcon className="h-5 w-5 text-gray-500 mr-3" />
                <input
                  type="text"
                  name="email"
                  placeholder="Correo o Cédula"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full outline-none text-gray-700 placeholder-gray-400"
                />
              </div>

              <div className="flex items-center border-2 border-gray-200 rounded-xl px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all duration-200">
                <LockClosedIcon className="h-5 w-5 text-gray-500 mr-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Contraseña"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full outline-none text-gray-700 placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={togglePassword}
                  className="ml-3 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Ingresando...
                </span>
              ) : 'Ingresar'}
            </button>

            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600">
                ¿No tienes cuenta?{' '}
                <Link to="/registro" className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200">
                  Regístrate aquí
                </Link>
              </p>

              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
