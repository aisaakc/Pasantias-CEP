import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import Section from '../../components/Section';
import '../../css/login.css';
import { motion } from 'framer-motion';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const togglePassword = () => setShowPassword(!showPassword);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Intentando login con:", formData);
    // Aquí va la lógica real para autenticar
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

          {/* Email */}
          <div className="flex items-center border-2 border-gray-300 rounded-xl px-4 py-3">
            <Mail className="text-gray-400 mr-3" />
            <input
              type="email"
              name="email"
              placeholder="Correo de Gmail"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full outline-none text-gray-700"
            />
          </div>

          {/* Password */}
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

          {/* Submit */}
          <motion.button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition duration-200"
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
          >
            Ingresar
          </motion.button>

          {/* Link a registro */}
          <p className="text-center text-sm text-gray-600">
            ¿No tienes cuenta?{' '}
            <Link to="/registro" className="text-blue-600 hover:underline font-medium">
              Regístrate
            </Link>
          </p>

          {/* Link a recuperar contraseña */}
          <p className="text-right text-sm text-blue-600 hover:underline cursor-pointer">
            ¿Olvidaste tu contraseña?
          </p>
        </form>
      </div>
    </div>
  );
}
