// frontend/src/pages/auth/Registro.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
// axios ya no es necesario si las llamadas se mueven a los archivos api
// import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
// toast es necesario si sigues usándolo aquí para errores generales/locales
import { toast } from 'react-toastify';
import * as Yup from 'yup'; // Importar yup
import Section from '../../components/Section';

// --- Importar las funciones de la nueva API de lookups ---
// Ajusta la ruta si tu estructura es diferente
import { fetchGeneros, fetchRoles, fetchPreguntasSeguridad } from '../../api/lookup.api';


// NOTA: La función de validación manual SÍ se queda aquí, ya que es lógica de UI/formulario específica de este componente.
const validateFormFields = (values, step) => {
    const errors = {};
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    const phoneCedulaRegex = /^[0-9]+$/;

    // Validación para campos del Step 1
    if (step >= 1) {
        if (!values.nombre) errors.nombre = 'El nombre es obligatorio';
        if (!values.apellido) errors.apellido = 'El apellido es obligatorio';
        if (!values.telefono) errors.telefono = 'El teléfono es obligatorio';
        else if (!phoneCedulaRegex.test(values.telefono)) errors.telefono = 'Solo se permiten dígitos';
        else if (values.telefono.length < 7) errors.telefono = 'Teléfono muy corto';

        if (!values.cedula) errors.cedula = 'La cédula es obligatoria';
        else if (!phoneCedulaRegex.test(values.cedula)) errors.cedula = 'Solo se permiten dígitos';
        else if (values.cedula.length < 6) errors.cedula = 'Cédula muy corta';

        if (!values.gmail) errors.gmail = 'El correo es obligatorio';
        else if (!emailRegex.test(values.gmail)) errors.gmail = 'Formato de correo inválido';

        // Importante: Validar que el ID no sea un string vacío, ya que el backend espera un número
        if (!values.id_genero) errors.id_genero = 'Selecciona un género';
    }

    // Validación para campos del Step 2
    if (step >= 2) {
        // Importante: Validar que el ID no sea un string vacío
        if (!values.id_rol) errors.id_rol = 'Selecciona un tipo de participante';
        if (!values.id_pregunta) errors.id_pregunta = 'Selecciona una pregunta';
        if (!values.respuesta) errors.respuesta = 'La respuesta es obligatoria';

        // Validaciones para Contraseña y Confirmación de Contraseña
        if (!values.contraseña) errors.contraseña = 'La contraseña es obligatoria';
        else if (values.contraseña.length < 6) errors.contraseña = 'Debe tener al menos 6 caracteres';

         if (!values.confirmarContraseña) { // Simplificar la primera verificación
            errors.confirmarContraseña = 'Confirma la contraseña';
         } else if (values.contraseña && values.contraseña !== values.confirmarContraseña) { // Solo comparar si ambas existen
             errors.confirmarContraseña = 'Las contraseñas no coinciden';
         }
        // La validación duplicada de confirmarContraseña fue eliminada
    }

    return errors;
};

export default function Registro() {
    // Obtenemos la función de registro del contexto
    const { register } = useAuth();
    const navigate = useNavigate();

    // Estados para el formulario multi-paso y los datos de lookup
    const [step, setStep] = useState(1);
    const [generos, setGeneros] = useState([]);
    const [roles, setRoles] = useState([]);
    const [preguntas, setPreguntas] = useState([]);
    // Estado para errores generales del formulario (no asociados a un campo específico)
    const [generalError, setGeneralError] = useState('');

    // Efecto para cargar los datos de lookup al montar el componente
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Usar las funciones importadas de la API de lookups
                const [genRes, rolRes, pregRes] = await Promise.all([
                    fetchGeneros(),
                    fetchRoles(),
                    // Usar el nuevo nombre de la función si la cambiaste
                    fetchPreguntasSeguridad(),
                ]);
                setGeneros(genRes.data);
                setRoles(rolRes.data);
                setPreguntas(pregRes.data);
            } catch (fetchError) {
                console.error("[EFFECT] Error fetching lookup data:", fetchError);
                setGeneralError("Error al cargar datos necesarios para el registro.");
                toast.error("Error al cargar datos necesarios.");
            }
        };
        fetchData();
    }, []); // El array vacío asegura que este efecto se ejecute solo una vez al montar

    // Valores iniciales para Formik
    const initialValues = {
        nombre: '',
        apellido: '',
        telefono: '',
        cedula: '',
        gmail: '',
        id_genero: '', // Usar string vacío para selects sin valor inicial
        id_rol: '',
        id_pregunta: '',
        respuesta: '',
        contraseña: '',
        confirmarContraseña: '' // Campo para confirmación (no se envía al backend)
    };

    // Función que se ejecuta al enviar el formulario final (Paso 2)
    const handleSubmit = async (values, { setSubmitting, setErrors, setFieldTouched }) => {
        setGeneralError(''); // Limpiar errores generales previos

        // Validar TODOS los campos antes de enviar al backend
        const errors = validateFormFields(values, 2);

         // Marcar todos los campos como tocados para mostrar errores si existen
         Object.keys(values).forEach(field => {
             setFieldTouched(field, true);
         });


        if (Object.keys(errors).length > 0) {
            console.log("[SUBMIT] Errores de validación en submit:", errors);
            setErrors(errors); // Mostrar errores de validación en los campos
            setGeneralError('Por favor corrige los errores en el formulario.');
            toast.error('Por favor corrige los errores en el formulario.');
            setSubmitting(false); // Deshabilitar el estado de submitting
            return; // Detener el proceso si hay errores de validación
        }

        // Prepara los datos para enviar, excluyendo 'confirmarContraseña'
        const { confirmarContraseña, ...dataToSend } = values;

        // Asegúrate de parsear los IDs a números si tu backend lo requiere
        // (Tu backend con pg espera números para los FK)
        const finalDataToSend = {
            ...dataToSend,
            id_genero: parseInt(dataToSend.id_genero, 10),
            id_rol: parseInt(dataToSend.id_rol, 10),
            id_pregunta: parseInt(dataToSend.id_pregunta, 10),
        };


        try {
            // Llama a la función de registro del contexto (la cual llama a la API)
            await register(finalDataToSend);
            console.log("[SUBMIT] Registro exitoso. Navegando a /login");
            // El toast de éxito se maneja dentro del AuthContext ahora
            navigate('/login'); // Navegar al login después de un registro exitoso
        } catch (error) {
            // El toast de error se maneja dentro del AuthContext, pero aquí puedes
            // establecer un error general si necesitas mostrarlo de otra forma además del toast
            console.error("[SUBMIT] Error al registrar usuario:", error);
             // Intenta obtener el error del backend o usa un mensaje genérico
            if (error.response?.data?.error) {
                 // Mostrar el error específico del backend
                 setGeneralError(error.response.data.error);
            } else {
                 // Mostrar un mensaje genérico para errores inesperados
                 setGeneralError('Ocurrió un error inesperado al registrar. Intenta nuevamente.');
            }
        } finally {
             // Asegurarse de que el estado de submitting se desactive siempre
            console.log("[SUBMIT] Proceso de submit finalizado.");
            setSubmitting(false);
        }
    };

    // Función para manejar el paso al siguiente formulario
    const handleNextStep = (values, setErrors, setFieldTouched) => {
        setGeneralError(''); // Limpiar errores generales previos

        // Validar solo los campos del paso 1
        const errors = validateFormFields(values, 1);
        const step1Fields = ['nombre', 'apellido', 'telefono', 'cedula', 'gmail', 'id_genero'];

        // Marcar solo los campos del paso 1 como tocados para mostrar sus errores
        step1Fields.forEach(field => {
            setFieldTouched(field, true);
        });

        // Filtrar solo los errores relevantes para el paso 1
        const step1Errors = Object.keys(errors)
            .filter(key => step1Fields.includes(key)); // Si el campo tiene un error Y está en step1Fields

        if (step1Errors.length > 0) { // Si hay algún error en los campos del paso 1
            console.log("[NEXT] Errores de validación en paso 1:", errors); // Mostrar todos los errores encontrados por validateFormFields (para debug)
            // Crear un objeto de errores solo con los campos del paso 1 para pasárselo a Formik
            const errorsForFormik = step1Fields.reduce((obj, field) => {
                 if (errors[field]) {
                     obj[field] = errors[field];
                 }
                 return obj;
            }, {});
            setErrors(errorsForFormik); // Mostrar solo los errores del paso 1
            setGeneralError('Por favor completa todos los campos requeridos y válidos del paso 1.');
            toast.error('Por favor completa el paso 1 correctamente.');
        } else {
            // Si no hay errores en el paso 1, pasar al paso 2
            console.log("[NEXT] Validación paso 1 exitosa. Llamando setStep(2).");
            setErrors({}); // Limpiar cualquier error visible de Formik antes de pasar de paso
            setGeneralError(''); // Limpiar cualquier error general
            setStep(2); // Avanzar al siguiente paso
        }
    }


    // Renderizado del componente
    return (
        // La estructura JXS parece usar clases de Tailwind CSS
        <div className="flex min-h-screen">
             {/* Puedes mantener tu componente Section aquí */}
            <Section />
             {/* Contenedor principal del formulario */}
            <div className="flex w-1/2 justify-center items-center bg-gray-50 p-10">
                 {/* Formulario manejado por Formik */}
                <Formik initialValues={initialValues} onSubmit={handleSubmit} validate={() => { /* Validación manejada por validateFormFields */ }}>
                     {/* Render Prop de Formik que provee el estado y helpers */}
                    {({ isSubmitting, values, errors, touched, setErrors, setFieldTouched }) => (
                        <Form className="w-full max-w-md space-y-6 bg-white p-8 rounded-lg shadow-xl">
                             {/* Título del formulario */}
                            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Crear Cuenta</h2>
                             {/* Mostrar errores generales si existen */}
                            {generalError && <div className="text-red-600 text-sm text-center mb-4">{generalError}</div>}
                             {/* Indicador de pasos */}
                            <div className="flex justify-center space-x-2 mb-6">
                                <div className={`w-8 h-2 rounded-full ${step === 1 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                                <div className={`w-8 h-2 rounded-full ${step === 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                            </div>

                             {/* Contenido condicional basado en el paso actual */}
                            {step === 1 ? (
                                <>
                                    {/* Campos del paso 1 */}
                                    <div>
                                        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
                                        <Field name="nombre" placeholder="Nombre" className={`w-full p-3 mt-1 border ${errors.nombre && touched.nombre ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`} />
                                        <ErrorMessage name="nombre" component="div" className="text-red-500 text-xs mt-1" />
                                    </div>
                                    <div>
                                        <label htmlFor="apellido" className="block text-sm font-medium text-gray-700">Apellido</label>
                                        <Field name="apellido" placeholder="Apellido" className={`w-full p-3 mt-1 border ${errors.apellido && touched.apellido ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`} />
                                        <ErrorMessage name="apellido" component="div" className="text-red-500 text-xs mt-1" />
                                    </div>
                                    <div>
                                        <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">Teléfono</label>
                                        <Field name="telefono" placeholder="Teléfono" className={`w-full p-3 mt-1 border ${errors.telefono && touched.telefono ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`} />
                                        <ErrorMessage name="telefono" component="div" className="text-red-500 text-xs mt-1" />
                                    </div>
                                    <div>
                                        <label htmlFor="cedula" className="block text-sm font-medium text-gray-700">Cédula</label>
                                        <Field name="cedula" placeholder="Cédula" className={`w-full p-3 mt-1 border ${errors.cedula && touched.cedula ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`} />
                                        <ErrorMessage name="cedula" component="div" className="text-red-500 text-xs mt-1" />
                                    </div>
                                    <div>
                                        <label htmlFor="gmail" className="block text-sm font-medium text-gray-700">Correo electrónico</label>
                                        <Field name="gmail" type="email" placeholder="Correo electrónico" className={`w-full p-3 mt-1 border ${errors.gmail && touched.gmail ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`} />
                                        <ErrorMessage name="gmail" component="div" className="text-red-500 text-xs mt-1" />
                                    </div>
                                    <div>
                                        <label htmlFor="id_genero" className="block text-sm font-medium text-gray-700">Género</label>
                                        <Field as="select" name="id_genero" className={`w-full p-3 mt-1 border ${errors.id_genero && touched.id_genero ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}>
                                            <option value="">Selecciona un género</option>
                                            {/* Renderiza las opciones de género cargadas */}
                                            {generos.map((g) => (
                                                <option key={g.id} value={g.id}>{g.nombre}</option>
                                            ))}
                                        </Field>
                                        <ErrorMessage name="id_genero" component="div" className="text-red-500 text-xs mt-1" />
                                    </div>
                                     {/* Botón para avanzar al siguiente paso */}
                                    <button type="button" onClick={() => handleNextStep(values, setErrors, setFieldTouched)} className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition duration-200">Siguiente</button>
                                </>
                            ) : step === 2 ? (
                                <>
                                    {/* Campos del paso 2 */}
                                    <div>
                                        <label htmlFor="id_rol" className="block text-sm font-medium text-gray-700">Tipo de Participante</label>
                                        <Field as="select" name="id_rol" className={`w-full p-3 mt-1 border ${errors.id_rol && touched.id_rol ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}>
                                            <option value="">Selecciona un tipo de participante</option>
                                            {/* Renderiza las opciones de rol cargadas, filtrando si es necesario */}
                                             {/* Nota: Este filtro [11, 12, 13, 14] filtra roles específicos */}
                                            {roles.filter((r) => [12, 13, 14].includes(r.id)).map((r) => (
                                                <option key={r.id} value={r.id}>{r.nombre}</option>
                                            ))}
                                        </Field>
                                        <ErrorMessage name="id_rol" component="div" className="text-red-500 text-xs mt-1" />
                                    </div>
                                    <div>
                                        <label htmlFor="id_pregunta" className="block text-sm font-medium text-gray-700">Pregunta de Seguridad</label>
                                        <Field as="select" name="id_pregunta" className={`w-full p-3 mt-1 border ${errors.id_pregunta && touched.id_pregunta ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}>
                                            <option value="">Selecciona una pregunta de seguridad</option>
                                            {/* Renderiza las opciones de pregunta cargadas */}
                                            {preguntas.map((p) => (
                                                <option key={p.id} value={p.id}>{p.nombre}</option>
                                            ))}
                                        </Field>
                                        <ErrorMessage name="id_pregunta" component="div" className="text-red-500 text-xs mt-1" />
                                    </div>
                                    <div>
                                        <label htmlFor="respuesta" className="block text-sm font-medium text-gray-700">Respuesta de Seguridad</label>
                                        <Field name="respuesta" placeholder="Respuesta de Seguridad" className={`w-full p-3 mt-1 border ${errors.respuesta && touched.respuesta ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`} />
                                        <ErrorMessage name="respuesta" component="div" className="text-red-500 text-xs mt-1" />
                                    </div>
                                    <div>
                                        <label htmlFor="contraseña" className="block text-sm font-medium text-gray-700">Contraseña</label>
                                        <Field name="contraseña" type="password" placeholder="Contraseña" className={`w-full p-3 mt-1 border ${errors.contraseña && touched.contraseña ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`} />
                                        <ErrorMessage name="contraseña" component="div" className="text-red-500 text-xs mt-1" />
                                    </div>
                                    <div> {/* Campo Confirmar Contraseña */}
                                        <label htmlFor="confirmarContraseña" className="block text-sm font-medium text-gray-700">Confirmar Contraseña</label>
                                        <Field
                                            name="confirmarContraseña"
                                            type="password"
                                            placeholder="Confirmar Contraseña"
                                            className={`w-full p-3 mt-1 border ${errors.confirmarContraseña && touched.confirmarContraseña ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}
                                        />
                                        <ErrorMessage name="confirmarContraseña" component="div" className="text-red-500 text-xs mt-1" />
                                    </div>

                                     {/* Botones de navegación y envío */}
                                    <div className="flex justify-between gap-4 mt-6">
                                        <button type="button" onClick={() => setStep(1)} className="flex-1 bg-gray-400 text-white py-3 rounded-md font-semibold hover:bg-gray-500 transition duration-200">Atrás</button>
                                        <button type="submit" disabled={isSubmitting} className="flex-1 bg-green-600 text-white py-3 rounded-md font-semibold hover:bg-green-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                                             {/* Cambiar texto del botón según el estado de submitting */}
                                            {isSubmitting ? 'Registrando...' : 'Registrarse'}
                                        </button>
                                    </div>
                                     {/* Enlace a la página de Login */}
                                    <p className="text-center text-sm text-gray-600 mt-6">
                                        ¿Ya tienes cuenta?{' '}
                                        <Link to="/login" className="text-blue-600 hover:underline font-medium">Inicia Sesión</Link>
                                    </p>
                                </>
                            ) : null } {/* Si el paso no es 1 ni 2, no renderiza nada */}
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}