import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Formik, Form, Field } from 'formik';

export default function Registro() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [generos, setGeneros] = useState([]);
  const [roles, setRoles] = useState([]);
  const [preguntas, setPreguntas] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const [gen, rol, preg] = await Promise.all([
        axios.get('http://localhost:3001/api/auth/generos'),
        axios.get('http://localhost:3001/api/auth/roles'),
        axios.get('http://localhost:3001/api/auth/preguntas'),
      ]);
      setGeneros(gen.data);
      setRoles(rol.data);
      setPreguntas(preg.data);
    };
    fetchData();
  }, []);

  const initialValues = {
    nombre: '',
    apellido: '',
    telefono: '',
    cedula: '',
    gmail: '',
    id_genero: '',
    id_rol: '',
    id_pregunta_seguridad: '',
    respuesta_seguridad: '',
    contraseña: ''
  };

  const validateFields = (values) => {
    const requiredFields = step === 1
      ? ['nombre', 'apellido', 'telefono', 'cedula', 'gmail', 'id_genero']
      : ['id_rol', 'id_pregunta_seguridad', 'respuesta_seguridad', 'contraseña'];

    for (let field of requiredFields) {
      if (!values[field]) {
        setError('Por favor completa todos los campos requeridos.');
        return false;
      }
    }
    setError('');
    return true;
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    if (!validateFields(values)) {
      setSubmitting(false);
      return;
    }

    try {
      await register(values);
      navigate('/login');
    } catch (error) {
      console.error(error);
      setError('Ocurrió un error al registrar. Intenta nuevamente.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 shadow rounded-lg border">
      <h2 className="text-2xl font-bold mb-4">Registro</h2>
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}

      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ isSubmitting, values }) => (
          <Form className="space-y-4">
            {step === 1 && (
              <>
                <Field name="nombre" placeholder="Nombre" className="w-full p-2 border rounded" />
                <Field name="apellido" placeholder="Apellido" className="w-full p-2 border rounded" />
                <Field name="telefono" placeholder="Teléfono" className="w-full p-2 border rounded" />
                <Field name="cedula" placeholder="Cédula" className="w-full p-2 border rounded" />
                <Field name="gmail" type="email" placeholder="Correo electrónico" className="w-full p-2 border rounded" />

                <Field as="select" name="id_genero" className="w-full p-2 border rounded">
                  <option value="">Selecciona un género</option>
                  {generos.map((g) => (
                    <option key={g.id} value={g.id}>{g.nombre}</option>
                  ))}
                </Field>

                <button
                  type="button"
                  onClick={() => {
                    if (validateFields(values)) setStep(2);
                  }}
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  Siguiente
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <Field as="select" name="id_rol" className="w-full p-2 border rounded">
  <option value="">Selecciona un tipo de participante</option>
  {roles
    .filter((r) =>
      ['Participante Externo', 'Estudiante IUJO', 'Personal IUJO'].includes(r.nombre)
    )
    .map((r) => (
      <option key={r.id} value={r.id}>{r.nombre}</option>
    ))}
</Field>


                <Field as="select" name="id_pregunta_seguridad" className="w-full p-2 border rounded">
                  <option value="">Selecciona una pregunta de seguridad</option>
                  {preguntas.map((p) => (
                    <option key={p.id} value={p.id}>{p.nombre}</option>
                  ))}
                </Field>

                <Field name="respuesta_seguridad" placeholder="Respuesta" className="w-full p-2 border rounded" />
                <Field name="contraseña" type="password" placeholder="Contraseña" className="w-full p-2 border rounded" />

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                  >
                    Atrás
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Registrarse
                  </button>
                </div>
              </>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
}
