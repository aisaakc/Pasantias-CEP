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
    await registerUser(values);
  
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
      toast.error(`Error en el campo ${label}: ${form.errors[field.name]}`);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Section /> 
      <div className="flex w-1/2 justify-center items-center bg-gray-50 p-10">
        <Formik
          initialValues={initialValues}
          validate={validateWithZod} 
          onSubmit={handleSubmit}
          validateOnChange={false} 
          validateOnBlur={true}   
        >
          {({ isSubmitting, errors, touched, values }) => ( 
            <Form className="w-full max-w-md space-y-6 bg-white p-8 rounded-lg shadow-xl">
              <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Crear Cuenta</h2>

              <div className="flex justify-center space-x-2 mb-6">
                <div className={`w-8 h-2 rounded-full ${step === 1 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                <div className={`w-8 h-2 rounded-full ${step === 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
              </div>

              {step === 1 ? (
                <>
                
                  <div>
                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
                    <Field name="nombre">
                      {({ field, form }) => ( 
                        <input
                          {...field} 
                          id="nombre"
                          placeholder="Nombre"
                          className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          onBlur={(e) => handleBlurAndShowToast(e, field, form)} 
                        />
                      )}
                    </Field>
            
                    {touched.nombre && errors.nombre && <div className="text-red-500 text-sm">{errors.nombre}</div>}
                  </div>

                  <div>
                    <label htmlFor="apellido" className="block text-sm font-medium text-gray-700">Apellido</label>
                    <Field name="apellido">
                       {({ field, form }) => (
                         <input
                            {...field}
                            id="apellido"
                            placeholder="Apellido"
                            className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            onBlur={(e) => handleBlurAndShowToast(e, field, form)}
                         />
                       )}
                    </Field>
                    {touched.apellido && errors.apellido && <div className="text-red-500 text-sm">{errors.apellido}</div>}
                  </div>

                   <div>
                    <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">Teléfono</label>
                    <Field name="telefono">
                       {({ field, form }) => (
                         <input
                            {...field}
                            id="telefono"
                            placeholder="Teléfono"
                            className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            onBlur={(e) => handleBlurAndShowToast(e, field, form)}
                         />
                       )}
                    </Field>
                    {touched.telefono && errors.telefono && <div className="text-red-500 text-sm">{errors.telefono}</div>}
                  </div>

                   <div>
                    <label htmlFor="cedula" className="block text-sm font-medium text-gray-700">Cédula</label>
                    <Field name="cedula">
                       {({ field, form }) => (
                         <input
                            {...field}
                            id="cedula"
                            placeholder="Cédula"
                            className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            onBlur={(e) => handleBlurAndShowToast(e, field, form)}
                         />
                       )}
                    </Field>
                    {touched.cedula && errors.cedula && <div className="text-red-500 text-sm">{errors.cedula}</div>}
                  </div>

                   <div>
                    <label htmlFor="gmail" className="block text-sm font-medium text-gray-700">Correo electrónico</label>
                    <Field name="gmail">
                       {({ field, form }) => (
                         <input
                            {...field}
                            id="gmail"
                            type="email"
                            placeholder="Correo electrónico"
                            className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            onBlur={(e) => handleBlurAndShowToast(e, field, form)}
                         />
                       )}
                    </Field>
                    {touched.gmail && errors.gmail && <div className="text-red-500 text-sm">{errors.gmail}</div>}
                  </div>

                  <div>
                    <label htmlFor="id_genero" className="block text-sm font-medium text-gray-700">Género</label>
                     <Field name="id_genero">
                       {({ field, form }) => (
                         <select
                            {...field}
                            id="id_genero"
                            className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                             onBlur={(e) => handleBlurAndShowToast(e, field, form)}
                         >
                           <option value="">Seleccionar...</option>
                            {generos.map((g) => (
                              <option key={g.id} value={g.id}>{g.nombre}</option>
                            ))}
                          </select>
                       )}
                     </Field>
                    {touched.genero && errors.genero && <div className="text-red-500 text-sm">{errors.genero}</div>}
                  </div>

                  <button
                    type="button" 
                    onClick={() => handleNextStep(values, errors)}
                    className="w-full py-3 mt-4 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition duration-200"
                  >
                    Siguiente
                  </button>
                </>
              ) : (
                // Paso 2 del formulario
                <>
                  {/* Campo Tipo de participante (Select) */}
                   <div>
                    <label htmlFor="id_rol" className="block text-sm font-medium text-gray-700">Tipo de participante</label>
                    <Field name="id_rol">
                       {({ field, form }) => (
                         <select
                            {...field}
                            id="id_rol"
                            className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                             onBlur={(e) => handleBlurAndShowToast(e, field, form)}
                         >
                            {roles.filter((r) => [12, 13, 14].includes(r.id)).map((r) => (
                    <option key={r.id} value={r.id}>{r.nombre}</option>
                  ))}
                         </select>
                       )}
                     </Field>
                    {touched.id_rol && errors.id_rol && <div className="text-red-500 text-sm">{errors.id_rol}</div>}
                  </div>

                   <div>
                    <label htmlFor="id_pregunta" className="block text-sm font-medium text-gray-700">Pregunta de seguridad</label>
                     <Field name="id_pregunta">
                       {({ field, form }) => (
                         <select
                            {...field}
                            id="id_pregunta"
                            className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                             onBlur={(e) => handleBlurAndShowToast(e, field, form)}
                         >
                           <option value="">Selecciona una pregunta</option>
                  {preguntas.map((p) => (
                    <option key={p.id} value={p.id}>{p.nombre}</option>
                  ))}
                         </select>
                       )}
                     </Field>
                    {touched.id_pregunta && errors.id_pregunta && <div className="text-red-500 text-sm">{errors.id_pregunta}</div>}
                  </div>

                   <div>
                    <label htmlFor="respuesta" className="block text-sm font-medium text-gray-700">Respuesta</label>
                     <Field name="respuesta">
                       {({ field, form }) => (
                         <input
                            {...field}
                            id="respuesta"
                            placeholder="Respuesta"
                            className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                             onBlur={(e) => handleBlurAndShowToast(e, field, form)}
                         />
                       )}
                     </Field>
                    {touched.respuesta && errors.respuesta && <div className="text-red-500 text-sm">{errors.respuesta}</div>}
                  </div>

                   <div>
                    <label htmlFor="contraseña" className="block text-sm font-medium text-gray-700">Contraseña</label>
                     <Field name="contraseña">
                       {({ field, form }) => (
                         <input
                            {...field}
                            id="contraseña"
                            type="password"
                            placeholder="Contraseña"
                            className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                             onBlur={(e) => handleBlurAndShowToast(e, field, form)}
                         />
                       )}
                     </Field>
                    {touched.contraseña && errors.contraseña && <div className="text-red-500 text-sm">{errors.contraseña}</div>}
                  </div>

                  {/* Campo Confirmar Contraseña */}
                  <div>
                    <label htmlFor="confirmarContraseña" className="block text-sm font-medium text-gray-700">Confirmar Contraseña</label>
                     <Field name="confirmarContraseña">
                       {({ field, form }) => (
                         <input
                            {...field}
                            id="confirmarContraseña"
                            type="password"
                            placeholder="Confirmar Contraseña"
                            className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                             onBlur={(e) => handleBlurAndShowToast(e, field, form)}
                         />
                       )}
                     </Field>
                    {touched.confirmarContraseña && errors.confirmarContraseña && <div className="text-red-500 text-sm">{errors.confirmarContraseña}</div>}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3 mt-4 text-white bg-blue-600 rounded-md ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 transition duration-200'}`}
                  >
                    {isSubmitting ? 'Cargando...' : 'Registrarme'}
                  </button>
                   
                   <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-full py-3 mt-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition duration-200"
                  >
                    Atrás
                  </button>
                </>
              )}

              <p className="text-center text-sm text-gray-600 mt-6">
                ¿Ya tienes cuenta?{' '}
                <Link to="/login" className="text-blue-600 hover:underline font-medium">Inicia Sesión</Link>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}