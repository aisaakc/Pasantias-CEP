// frontend/src/pages/auth/Login.jsx

import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Section from '../../components/Section';
import '../../css/login.css';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { loginAsync } from '../../features/auth/authSlice';

export default function Login() {

  const dispatch = useDispatch();

  // isLoggingIn y loginError se leen del estado de Redux
  const { isLoggingIn, loginError } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const togglePassword = () => setShowPassword(!showPassword);

  const handleChange = (e) => {
    // No necesitas limpiar el error local aquí, Redux se encarga al iniciar el thunk
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => { // async es necesario porque .unwrap() devuelve una Promise
    e.preventDefault();
    // No necesitas setLocalError('') ni setLoading(true) aquí, Redux maneja el estado isLoggingIn/loginError

    if (!formData.email || !formData.password) {
        alert('Por favor, ingresa tu correo/cédula y contraseña.');
        return;
    }

    const credentialsToSend = {
        // Asegúrate de que esto coincida con lo que loginAsync espera y envía a tu API
        gmail: formData.email.includes('@') ? formData.email : undefined,
        cedula: !formData.email.includes('@') ? formData.email : undefined,
        contraseña: formData.password,
    };

    // --- CAMBIOS AQUÍ ---
    // Disparar el thunk loginAsync y encadenar .unwrap(), .then() y .catch()
    try { // Usamos try/catch para manejar errores que podrían ocurrir ANTES del dispatch o en el .unwrap()
         await dispatch(loginAsync(credentialsToSend))
            .unwrap() // Esto expone la promesa del thunk para poder usar .then() y .catch()
            .then(() => {
              // Este bloque se ejecuta si el thunk loginAsync se completa exitosamente (fulfilled)
              console.log("Login successful via Redux thunk, navigating...");
              navigate('/dashboard'); // <-- ¡Navegación aquí!
            })
            .catch((error) => {
              // Este bloque se ejecuta si el thunk loginAsync es rechazado (rejected)
              console.error("Login failed via Redux thunk. Error handled by slice state:", error);
              // El error ya está en el estado de Redux (loginError) y se muestra en el UI.
              // El toast de error también se dispara desde el extraReducer.
              // No necesitas hacer nada más aquí para mostrar el error.
            });

    } catch (unexpectedError) {
        // Este catch manejará errores que no sean rechazos del thunk (ej. error síncrono)
        console.error("An unexpected error occurred:", unexpectedError);
        // Opcional: mostrar un toast o actualizar un estado local para errores inesperados
         toast.error("Ocurrió un error inesperado durante el proceso.");
    }
    // El estado isLoggingIn en Redux se pondrá automáticamente a false cuando el thunk termine (fulfilled o rejected),
    // lo cual habilitará el botón nuevamente.

  };


  return (
    <div className="login-page flex h-screen">
      <Section />

      <div className="flex w-1/2 justify-center items-center bg-white p-10">
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6">

          <motion.h2
             className="text-3xl font-bold text-gray-800"
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ duration: 0.8 }}
           >
             Iniciar Sesión
           </motion.h2>

           {/* Mostrar el error de login del estado de Redux */}
           {loginError && <div className="text-red-600 text-sm text-center mb-4">{loginError}</div>}


           <div className="flex items-center border-2 border-gray-300 rounded-xl px-4 py-3">
            <Mail className="text-gray-400 mr-3" />
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

           <div className="flex items-center border-2 border-gray-300 rounded-xl px-4 py-3">
            <Lock className="text-gray-400 mr-3" />
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
              {showPassword ? <Eye className="text-gray-400" /> : <EyeOff className="text-gray-400" />}
            </div>
           </div>


          <motion.button
             type="submit"
             className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
             whileTap={{ scale: 0.95 }}
             whileHover={{ scale: 1.02 }}
             disabled={isLoggingIn} // Deshabilitar usando el estado de carga de Redux
           >
             {isLoggingIn ? 'Iniciando sesión...' : 'Ingresar'} {/* Texto usando el estado de carga de Redux */}
           </motion.button>

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