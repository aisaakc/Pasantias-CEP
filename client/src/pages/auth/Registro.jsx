import React, { useState , useEffect } from 'react';
import { Formik, Form, Field } from 'formik'; 
import { useNavigate, Link } from 'react-router-dom';
import { registroSchema } from '../../schemas/registro.shema'; 
import { toast } from 'sonner';
import Section from '../../components/Section'; 
import useAuthStore from '../../store/authStore';

export default function Registro() {

  const {
    generos,
    roles,
    preguntas,
    getSubclassificationsById,
    loading,
    error,
    successMessage,
    fetchOpcionesRegistro,
    registerUser,
    clearMessages,
  } = useAuthStore();
  useEffect(() => {
    fetchOpcionesRegistro();
    return () => clearMessages(); 
  }, []);
  
  
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const initialValues = {
    nombre: '',
    apellido: '',
    telefono: '',
    cedula: '',
    gmail: '',
    id_genero: '',
    id_rol: '',
    id_pregunta: '',
    respuesta: '',
    contraseña: '',
    confirmarContraseña: '',
  };

  const validateWithZod = (values) => {
    try {
      registroSchema.parse(values);
      return {}; 
    } catch (error) {
      const formErrors = {};
      error.errors.forEach((err) => {
        const field = err.path[0];
        
        if (!formErrors[field]) {
          formErrors[field] = err.message;
        }
      });
      return formErrors;
    }
  };

  // Manejador de envío del formulario
  const handleSubmit = async (values, { setSubmitting }) => {
    // Verificar que las contraseñas coincidan
    if (values.contraseña !== values.confirmarContraseña) {
      toast.error("Las contraseñas no coinciden");
      setSubmitting(false);
      return;
    }

    // Preparar los datos para el backend
    const userData = {
      ...values,
      id_roles: [values.id_rol], // Convertir id_rol en un array como espera el backend
      contrasena: values.contraseña, // Cambiar el nombre del campo
    };
    
    // Eliminar campos que no necesita el backend
    delete userData.confirmarContraseña;
    delete userData.contraseña;
    delete userData.id_rol;

    await registerUser(userData);
  
    if (successMessage) {
      toast.success(successMessage);
      navigate('/login');
    } else if (error) {
      toast.error(error);
    }
  
    setSubmitting(false);
  };
  

  // Esta función se activa cuando se hace clic en el botón "Siguiente"
  const handleNextStep = (values, errors) => {
   
    const currentStepFields = step === 1
      ? ['nombre', 'apellido', 'telefono', 'cedula', 'gmail', 'id_genero']
      : ['id_rol', 'id_pregunta', 'respuesta', 'contraseña', 'confirmarContraseña'];

    // Filtra los errores para considerar solo los campos en el paso actual
    const currentStepErrors = Object.keys(errors).filter(field => currentStepFields.includes(field));

    if (currentStepErrors.length > 0) {
    
      toast.error("Por favor, corrija los errores en el paso actual antes de continuar.");
      
    } else {
      setStep(2); // Si no hay errores en el paso actual, procede al paso 2
    }
  };

  const handleBlurAndShowToast = (e, field, form) => {
   
    form.handleBlur(e);
    
    if (form.touched[field.name] && form.errors[field.name]) {
     
       const fieldLabelMap = {
          nombre: 'Nombre',
          apellido: 'Apellido',
          telefono: 'Teléfono',
          cedula: 'Cédula',
          gmail: 'Correo electrónico',
          id_genero: 'Género',
          id_rol: 'Tipo de participante',
          id_pregunta: 'Pregunta de seguridad',
          respuesta: 'Respuesta',
          contraseña: 'Contraseña',
          confirmarContraseña: 'Confirmar Contraseña',
       };
       const label = fieldLabelMap[field.name] || field.name;
      toast.error(`Error en ${label}: ${form.errors[field.name]}`);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Section /> 
      <div className="flex w-1/2 justify-center items-center p-10">
        {loading ? (
          <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-2xl shadow-2xl">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-800 mb-2">Cargando...</h2>
              <p className="text-gray-600">Por favor espere mientras cargamos los datos</p>
            </div>
          </div>
        ) : error ? (
          <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-2xl shadow-2xl">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-red-600 mb-2">Error</h2>
              <p className="text-gray-600">{error}</p>
              <button
                onClick={() => fetchOpcionesRegistro()}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Reintentar
              </button>
            </div>
          </div>
        ) : (
          <Formik
            initialValues={initialValues}
            validate={validateWithZod} 
            onSubmit={handleSubmit}
            validateOnChange={false} 
            validateOnBlur={true}   
          >
            {({ isSubmitting, errors, touched, values }) => ( 
              <Form className="w-full max-w-md space-y-8 bg-white p-10 rounded-2xl shadow-2xl transform transition-all duration-300 hover:shadow-3xl">
                <div className="text-center">
                  <h2 className="text-4xl font-bold text-gray-800 mb-2">Crear Cuenta</h2>
                  <p className="text-gray-600">Únete a nuestra comunidad</p>
                </div>

                <div className="flex justify-center space-x-3 mb-8">
                  <div className={`w-12 h-2 rounded-full transition-all duration-300 ${step === 1 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                  <div className={`w-12 h-2 rounded-full transition-all duration-300 ${step === 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                </div>

                {step === 1 ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="nombre" className="block text-sm font-semibold text-gray-700 mb-2">Nombre</label>
                        <Field name="nombre">
                          {({ field, form }) => ( 
                            <input
                              {...field} 
                              id="nombre"
                              placeholder="Tu nombre"
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                              onBlur={(e) => handleBlurAndShowToast(e, field, form)} 
                            />
                          )}
                        </Field>
                        {touched.nombre && errors.nombre && <div className="text-red-500 text-sm mt-1">{errors.nombre}</div>}
                      </div>

                      <div>
                        <label htmlFor="apellido" className="block text-sm font-semibold text-gray-700 mb-2">Apellido</label>
                        <Field name="apellido">
                          {({ field, form }) => (
                            <input
                              {...field}
                              id="apellido"
                              placeholder="Tu apellido"
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                              onBlur={(e) => handleBlurAndShowToast(e, field, form)}
                            />
                          )}
                        </Field>
                        {touched.apellido && errors.apellido && <div className="text-red-500 text-sm mt-1">{errors.apellido}</div>}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="telefono" className="block text-sm font-semibold text-gray-700 mb-2">Teléfono</label>
                      <Field name="telefono">
                        {({ field, form }) => (
                          <input
                            {...field}
                            id="telefono"
                            placeholder="Tu número de teléfono"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            onBlur={(e) => handleBlurAndShowToast(e, field, form)}
                          />
                        )}
                      </Field>
                      {touched.telefono && errors.telefono && <div className="text-red-500 text-sm mt-1">{errors.telefono}</div>}
                    </div>

                    <div>
                      <label htmlFor="cedula" className="block text-sm font-semibold text-gray-700 mb-2">Cédula</label>
                      <Field name="cedula">
                        {({ field, form }) => (
                          <input
                            {...field}
                            id="cedula"
                            placeholder="Tu número de cédula"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            onBlur={(e) => handleBlurAndShowToast(e, field, form)}
                          />
                        )}
                      </Field>
                      {touched.cedula && errors.cedula && <div className="text-red-500 text-sm mt-1">{errors.cedula}</div>}
                    </div>

                    <div>
                      <label htmlFor="gmail" className="block text-sm font-semibold text-gray-700 mb-2">Correo electrónico</label>
                      <Field name="gmail">
                        {({ field, form }) => (
                          <input
                            {...field}
                            id="gmail"
                            type="email"
                            placeholder="tu@email.com"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            onBlur={(e) => handleBlurAndShowToast(e, field, form)}
                          />
                        )}
                      </Field>
                      {touched.gmail && errors.gmail && <div className="text-red-500 text-sm mt-1">{errors.gmail}</div>}
                    </div>

                    <div>
                      <label htmlFor="id_genero" className="block text-sm font-semibold text-gray-700 mb-2">Género</label>
                      <Field name="id_genero">
                        {({ field, form }) => (
                          <select
                            {...field}
                            id="id_genero"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            onBlur={(e) => handleBlurAndShowToast(e, field, form)}
                          >
                            <option value="">Seleccionar género</option>
                            {generos && generos.length > 0 ? (
                              generos.map((g) => (
                                <option key={g.id} value={g.id}>{g.nombre}</option>
                              ))
                            ) : (
                              <option value="" disabled>No hay géneros disponibles</option>
                            )}
                          </select>
                        )}
                      </Field>
                      {touched.id_genero && errors.id_genero && <div className="text-red-500 text-sm mt-1">{errors.id_genero}</div>}
                    </div>

                    <button
                      type="button" 
                      onClick={() => handleNextStep(values, errors)}
                      className="w-full py-3.5 mt-6 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transform transition-all duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Continuar
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="id_rol" className="block text-sm font-semibold text-gray-700 mb-2">Tipo de participante</label>
                      <Field name="id_rol">
                        {({ field, form }) => (
                          <select
                            {...field}
                            id="id_rol"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            onBlur={(e) => handleBlurAndShowToast(e, field, form)}
                          >
                            <option value="">Seleccionar tipo</option>
                            {Array.isArray(roles) && roles.filter((r) => [13, 14].includes(r.id)).map((r) => (
                              <option key={r.id} value={r.id}>{r.nombre}</option>
                            ))}
                          </select>
                        )}
                      </Field>
                      {touched.id_rol && errors.id_rol && <div className="text-red-500 text-sm mt-1">{errors.id_rol}</div>}
                    </div>

                    <div>
                      <label htmlFor="id_pregunta" className="block text-sm font-semibold text-gray-700 mb-2">Pregunta de seguridad</label>
                      <Field name="id_pregunta">
                        {({ field, form }) => (
                          <select
                            {...field}
                            id="id_pregunta"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            onBlur={(e) => handleBlurAndShowToast(e, field, form)}
                          >
                            <option value="">Selecciona una pregunta</option>
                            {Array.isArray(preguntas) && preguntas.map((p) => (
                              <option key={p.id} value={p.id}>{p.nombre}</option>
                            ))}
                          </select>
                        )}
                      </Field>
                      {touched.id_pregunta && errors.id_pregunta && <div className="text-red-500 text-sm mt-1">{errors.id_pregunta}</div>}
                    </div>

                    <div>
                      <label htmlFor="respuesta" className="block text-sm font-semibold text-gray-700 mb-2">Respuesta</label>
                      <Field name="respuesta">
                        {({ field, form }) => (
                          <input
                            {...field}
                            id="respuesta"
                            placeholder="Tu respuesta"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            onBlur={(e) => handleBlurAndShowToast(e, field, form)}
                          />
                        )}
                      </Field>
                      {touched.respuesta && errors.respuesta && <div className="text-red-500 text-sm mt-1">{errors.respuesta}</div>}
                    </div>

                    <div>
                      <label htmlFor="contraseña" className="block text-sm font-semibold text-gray-700 mb-2">Contraseña</label>
                      <Field name="contraseña">
                        {({ field, form }) => (
                          <input
                            {...field}
                            id="contraseña"
                            type="password"
                            placeholder="Tu contraseña"
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                              touched.contraseña && errors.contraseña 
                                ? 'border-red-500 bg-red-50 focus:ring-red-500 focus:border-red-500' 
                                : 'border-gray-300'
                            }`}
                            onBlur={(e) => handleBlurAndShowToast(e, field, form)}
                            onChange={(e) => {
                              field.onChange(e);
                              if (form.values.confirmarContraseña) {
                                if (e.target.value !== form.values.confirmarContraseña) {
                                  form.setFieldError('confirmarContraseña', 'Las contraseñas no coinciden');
                                } else {
                                  form.setFieldError('confirmarContraseña', undefined);
                                }
                              }
                            }}
                          />
                        )}
                      </Field>
                      {touched.contraseña && errors.contraseña && <div className="text-red-500 text-sm mt-1">{errors.contraseña}</div>}
                    </div>

                    <div>
                      <label htmlFor="confirmarContraseña" className="block text-sm font-semibold text-gray-700 mb-2">Confirmar Contraseña</label>
                      <Field name="confirmarContraseña">
                        {({ field, form }) => (
                          <input
                            {...field}
                            id="confirmarContraseña"
                            type="password"
                            placeholder="Confirma tu contraseña"
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                              touched.confirmarContraseña && errors.confirmarContraseña 
                                ? 'border-red-500 bg-red-50 focus:ring-red-500 focus:border-red-500' 
                                : 'border-gray-300'
                            }`}
                            onBlur={(e) => handleBlurAndShowToast(e, field, form)}
                            onChange={(e) => {
                              field.onChange(e);
                              if (form.values.contraseña !== e.target.value) {
                                form.setFieldError('confirmarContraseña', 'Las contraseñas no coinciden');
                              } else {
                                form.setFieldError('confirmarContraseña', undefined);
                              }
                            }}
                          />
                        )}
                      </Field>
                      {touched.confirmarContraseña && errors.confirmarContraseña && (
                        <div className="text-red-500 text-sm mt-1">{errors.confirmarContraseña}</div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-3.5 text-white bg-blue-600 rounded-lg transform transition-all duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                          isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                        }`}
                      >
                        {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="w-full py-3.5 text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transform transition-all duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        Volver
                      </button>
                    </div>
                  </div>
                )}

                <p className="text-center text-sm text-gray-600 mt-8">
                  ¿Ya tienes cuenta?{' '}
                  <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200">Inicia Sesión</Link>
                </p>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </div>
  );
}