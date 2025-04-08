import React, { useEffect } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import InputField from './InputField'; // Importamos el InputField
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom'; // Para acceder al estado de la redirección
import { toast } from 'sonner'; // Importamos el toast

export default function LoginForm() {
  const initialValues = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Correo inválido').required('Requerido'),
    password: Yup.string().min(6, 'Mínimo 6 caracteres').required('Requerido'),
  });

  const handleLogin = (values) => {
    console.log('Logueando...', values);
  };

  // Obtener el estado de la redirección (cuando se redirige después del registro)
  const location = useLocation();
  const { state } = location;

  // Usamos sessionStorage para almacenar si ya se mostró el mensaje
  useEffect(() => {
    if (state?.successMessage && !sessionStorage.getItem('successMessageShown')) {
      // Mostrar el mensaje de éxito
      toast.success(state.successMessage, {
        duration: 5000,
        position: 'top-center',
        style: {
          backgroundColor: '#16A34A', // Verde vibrante
          color: '#FFFFFF',
          borderRadius: '8px',
          padding: '16px',
          fontWeight: 'bold',
          textAlign: 'center',
        },
      });

      // Marcar que el mensaje ya ha sido mostrado
      sessionStorage.setItem('successMessageShown', 'true');
    }
  }, [state]);

  return (
    <div className="flex w-1/2 justify-center items-center bg-white p-8">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleLogin}
      >
        {({ errors, touched, values, handleChange }) => (
          <Form className="w-full max-w-md">
            <motion.h1
              className="text-gray-800 font-bold text-3xl mb-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              Iniciar Sesión
            </motion.h1>
            <motion.p
              className="text-sm font-normal text-gray-600 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              Ingresa tus credenciales para continuar
            </motion.p>

            {/* Email Field */}
            <div className="mb-4">
              <InputField
                type="email"
                value={values.email} // Aseguramos que se pasa el valor del estado de Formik
                onChange={handleChange} // Aseguramos que se pasa la función handleChange de Formik
                placeholder="Correo electrónico"
                name="email" // Aseguramos que el campo tiene el nombre correcto
                error={errors.email} // Pasamos el error si hay uno
                touched={touched.email} // Pasamos si el campo ha sido tocado
              />
            </div>

            {/* Password Field */}
            <div className="mb-4">
              <InputField
                type="password"
                value={values.password} // Aseguramos que se pasa el valor del estado de Formik
                onChange={handleChange} // Aseguramos que se pasa la función handleChange de Formik
                placeholder="Contraseña"
                name="password" // Aseguramos que el campo tiene el nombre correcto
                error={errors.password} // Pasamos el error si hay uno
                touched={touched.password} // Pasamos si el campo ha sido tocado
              />
            </div>

            <motion.button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold mt-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 transform transition duration-200 ease-in-out shadow-md hover:shadow-lg active:scale-95"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              Ingresar
            </motion.button>

            <motion.div
              className="text-right mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              <span className="text-sm text-blue-600 cursor-pointer hover:underline">
                ¿Olvidaste tu contraseña?
              </span>
            </motion.div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
