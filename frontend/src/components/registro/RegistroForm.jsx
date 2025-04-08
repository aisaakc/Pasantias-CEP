import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import InputField from './InputField';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../api/auth.api';
import { toast } from 'sonner';

const fields = [
  { label: 'Nombre', name: 'nombre', type: 'text', placeholder: 'Ej: Juan' },
  { label: 'Apellido', name: 'apellido', type: 'text', placeholder: 'Ej: Pérez' },
  { label: 'Cédula', name: 'cedula', type: 'text', placeholder: 'Ej: 12345678' },
  { label: 'Correo electrónico', name: 'email', type: 'email', placeholder: 'ejemplo@correo.com' },
  { label: 'Teléfono', name: 'telefono', type: 'tel', placeholder: '04121234567' },
  { label: 'Contraseña', name: 'contraseña', type: 'password', placeholder: '••••••••' },
  { label: 'Confirmar Contraseña', name: 'confirm_contraseña', type: 'password', placeholder: '••••••••' },
];

const RegistroForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  return (
    <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-lg">
      <Formik
        initialValues={{
          nombre: '', apellido: '', cedula: '', tipoParticipante: '', contraseña: '',
          confirm_contraseña: '', email: '', telefono: '', genero: ''
        }}
        onSubmit={async (values) => {
          const payload = {
            nombre: values.nombre,
            apellido: values.apellido,
            cedula: values.cedula,
            correo: values.email,
            telefono: values.telefono,
            tipoParticipante: values.tipoParticipante,
            genero: values.genero,
            contraseña: values.contraseña
          };

          try {
            setLoading(true); // Iniciar carga

            const response = await register(payload);
            console.log('Registro exitoso:', response.data);

            // Redirigir a la página de login con el estado de éxito
            navigate('/login', { state: { successMessage: '¡Registro exitoso! Ahora puedes iniciar sesión.' } });
          } catch (error) {
            console.error('Error al registrar:', error);

            toast.error(
              error.response?.status === 409
                ? 'Ya existe un usuario con ese correo o cédula'
                : `Hubo un error al registrar: ${error.response?.data?.message || 'Inténtalo más tarde.'}`,
              {
                duration: 5000,
                position: 'top-center',
                style: {
                  backgroundColor: '#DC2626', // Rojo vibrante para el error
                  color: '#FFFFFF',
                  borderRadius: '8px',
                  padding: '16px',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  boxShadow: '0 4px 10px rgba(255, 0, 0, 0.3)', // Sombra para hacer más notorio
                  border: '2px solid #F87171', // Borde más resaltado
                  animation: 'fadeIn 1s ease-out', // Animación de entrada
                },
              }
            );
          } finally {
            setLoading(false); // Detener carga
          }
        }}
      >
        {({ handleChange, handleSubmit, values }) => (
          <Form onSubmit={handleSubmit}>
            <motion.h1
              className="text-3xl font-bold text-gray-800 mb-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              Registro de Usuario
            </motion.h1>

            <div className="grid grid-cols-2 gap-4">
              {fields.map((field) => (
                <motion.div
                  key={field.name}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
                >
                  <InputField {...field} onChange={handleChange} />
                </motion.div>
              ))}

              {/* Tipo de Participante */}
              <motion.div
                className="mb-4 col-span-2"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <label htmlFor="tipoParticipante" className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Participante
                </label>
                <select
                  name="tipoParticipante"
                  id="tipoParticipante"
                  value={values.tipoParticipante}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                >
                  <option value="">Selecciona una opción</option>
                  <option value="Estudiante IUJO">Estudiante IUJO</option>
                  <option value="Participante Externo">Participante Externo</option>
                  <option value="Personal IUJO">Personal IUJO</option>
                </select>
              </motion.div>

              {/* Género */}
              <motion.div
                className="mb-4 col-span-2"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <label htmlFor="genero" className="block text-sm font-medium text-gray-700 mb-1">
                  Género
                </label>
                <select
                  name="genero"
                  id="genero"
                  value={values.genero}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                >
                  <option value="">Selecciona tu género</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                </select>
              </motion.div>
            </div>

            <motion.button
              type="submit"
              className={`w-full py-3 rounded-xl font-semibold mt-6 ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              disabled={loading}
            >
              {loading ? (
                <div className="flex justify-center items-center">
                  <div className="w-5 h-5 border-4 border-t-4 border-blue-600 border-solid rounded-full animate-spin"></div>
                </div>
              ) : (
                'Registrarse'
              )}
            </motion.button>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                ¿Ya tienes cuenta?{' '}
                <Link to="/login" className="text-blue-600 hover:underline font-medium">
                  Inicia sesión
                </Link>
              </p>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default RegistroForm;
