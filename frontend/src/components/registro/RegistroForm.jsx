import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import InputField from './InputField';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const RegistroForm = () => {
  const initialValues = {
    nombre: '',
    apellido: '',
    cedula: '',
    tipoParticipante: '',
    password: '',
    confirmPassword: '',
    email: '',
    telefono: '',
  };

  const validationSchema = Yup.object({
    nombre: Yup.string().required('Nombre requerido'),
    apellido: Yup.string().required('Apellido requerido'),
    cedula: Yup.string()
      .matches(/^\d+$/, 'Solo se permiten números')
      .required('Cédula requerida'),
    tipoParticipante: Yup.string().required('Selecciona una opción'),
    password: Yup.string().min(6, 'Mínimo 6 caracteres').required('Contraseña requerida'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Las contraseñas no coinciden')
      .required('Confirmación requerida'),
      telefono: Yup.string()
  .matches(/^[0-9]{11}$/, 'Debe tener 11 dígitos')
  .required('Teléfono requerido'),
  

  });

  const handleSubmit = (values) => {
    console.log('Datos de registro:', values);
  };

  return (
    <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-lg">
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ errors, touched, values, handleChange }) => (
          <Form>
            <motion.h1
              className="text-3xl font-bold text-gray-800 mb-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              Registro de Usuario
            </motion.h1>

            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Nombre"
                name="nombre"
                type="text"
                placeholder="Ej: Juan"
                value={values.nombre}
                onChange={handleChange}
                error={errors.nombre}
                touched={touched.nombre}
              />

              <InputField
                label="Apellido"
                name="apellido"
                type="text"
                placeholder="Ej: Pérez"
                value={values.apellido}
                onChange={handleChange}
                error={errors.apellido}
                touched={touched.apellido}
              />

              <InputField
                label="Cédula"
                name="cedula"
                type="text"
                placeholder="Ej: 12345678"
                value={values.cedula}
                onChange={handleChange}
                error={errors.cedula}
                touched={touched.cedula}
              />

              <div className="mb-4">
                <label htmlFor="tipoParticipante" className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Participante
                </label>
                <select
                  name="tipoParticipante"
                  id="tipoParticipante"
                  value={values.tipoParticipante}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.tipoParticipante && touched.tipoParticipante ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Selecciona una opción</option>
                  <option value="Estudiante IUJO">Estudiante IUJO</option>
                  <option value="Participante Externo">Participante Externo</option>
                  <option value="Personal IUJO">Personal IUJO</option>
                </select>
                {errors.tipoParticipante && touched.tipoParticipante && (
                  <div className="text-red-500 text-xs mt-1">{errors.tipoParticipante}</div>
                )}
              </div>

              <InputField
                label="Contraseña"
                name="password"
                type="password"
                placeholder="••••••••"
                value={values.password}
                onChange={handleChange}
                error={errors.password}
                touched={touched.password}
              />

              <InputField
                label="Confirmar Contraseña"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={values.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                touched={touched.confirmPassword}
              />

            <InputField
            label="Correo electrónico"
            name="email"
            type="email"
            placeholder="ejemplo@correo.com"
            value={values.email}
            onChange={handleChange}
            error={errors.email}
            touched={touched.email}
            />

            <InputField
            label="Teléfono"
            name="telefono"
            type="tel"
            placeholder="04121234567"
            value={values.telefono}
            onChange={handleChange}
            error={errors.telefono}
            touched={touched.telefono}
            />

            </div>

            <motion.button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold mt-6 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Registrarse
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
