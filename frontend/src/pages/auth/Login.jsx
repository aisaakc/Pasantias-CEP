import React, { useState } from 'react'; 
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'; 
import { Link, useNavigate } from 'react-router-dom'; 
import Section from '../../components/Section'; 
import '../../css/login.css';
import { motion } from 'framer-motion'; 
import { useAuth } from '../../context/AuthContext'; 


export default function Login() {
  
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate(); // Para navegar después del login

  
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '', 
    password: '', 
  });
 
  const [loading, setLoading] = useState(false);
 
  const [localError, setLocalError] = useState(''); 


  const togglePassword = () => setShowPassword(!showPassword);

  const handleChange = (e) => {
    setLocalError(''); 
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setLoading(true);

    if (!formData.email || !formData.password) {
      setLocalError('Por favor, ingresa tu correo/cédula y contraseña.');
      setLoading(false);
      return;
    }

    try {
       const credentialsToSend = {
           gmail: formData.email,
           cedula: formData.email,
           contraseña: formData.password,
       };

      const user = await login(credentialsToSend);

      console.log("Login exitoso, usuario:", user);
    
      navigate('/dashboard'); 
    
    } catch (error) {
      console.error("Login failed:", error);
       setLocalError(error.message === 'Error al iniciar sesión' ? 'Correo/Cédula o contraseña incorrectos.' : 'Ocurrió un error al iniciar sesión.');
    } finally {
      setLoading(false);
    }
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

          {localError && <div className="text-red-600 text-sm text-center mb-4">{localError}</div>}

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

          {/* Botón de envío */}
          <motion.button
            type="submit" // Tipo submit para enviar el formulario
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            whileTap={{ scale: 0.95 }} // Animación de framer-motion
            whileHover={{ scale: 1.02 }} // Animación de framer-motion
            disabled={loading} // Deshabilita el botón mientras está cargando
          >
            {loading ? 'Iniciando sesión...' : 'Ingresar'} {/* Cambia el texto si está cargando */}
          </motion.button>

          {/* Enlace a la página de registro */}
          <p className="text-center text-sm text-gray-600">
            ¿No tienes cuenta?{' '}
            <Link to="/registro" className="text-blue-600 hover:underline font-medium">
              Regístrate
            </Link>
          </p>

          {/* Enlace a recuperar contraseña (funcionalidad no implementada) */}
          <p className="text-right text-sm text-blue-600 hover:underline cursor-pointer">
            ¿Olvidaste tu contraseña?
          </p>
        </form>
      </div>
    </div>
  );
}