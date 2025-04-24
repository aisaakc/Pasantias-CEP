// frontend/src/pages/auth/Registro.jsx
import React, { useEffect, useState } from 'react';
// --- CAMBIOS AQUÍ ---
// 1. ELIMINAR la importación del Contexto de Autenticación
// import { useAuth } from '../../context/AuthContext';

// 2. Importar hooks de react-redux
import { useDispatch, useSelector } from 'react-redux';
// 3. Importar el thunk registerAsync del slice de auth
import { registerAsync } from '../../features/auth/authSlice';
// --- FIN CAMBIOS ---

import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { toast } from 'react-toastify';
// --- CAMBIOS AQUÍ ---
// Ya no usas *Yup* según tu código actual, así que la importación podría no ser necesaria
// import * as Yup from 'yup';
// --- FIN CAMBIOS ---
import Section from '../../components/Section';

import { fetchGeneros, fetchRoles, fetchPreguntasSeguridad } from '../../api/lookup.api';

// La función de validación se mantiene igual, ya que valida los valores del formulario
const validateFormFields = (values, step) => {
    // ... tu lógica de validación existente ...
    const errors = {};
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    const phoneCedulaRegex = /^[0-9]+$/;

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

        if (!values.id_genero) errors.id_genero = 'Selecciona un género';
    }

    if (step >= 2) {

        if (!values.id_rol) errors.id_rol = 'Selecciona un tipo de participante';
        if (!values.id_pregunta) errors.id_pregunta = 'Selecciona una pregunta';
        if (!values.respuesta) errors.respuesta = 'La respuesta es obligatoria';

        if (!values.contraseña) errors.contraseña = 'La contraseña es obligatoria';
        else if (values.contraseña.length < 6) errors.contraseña = 'Debe tener al menos 6 caracteres';

        if (!values.confirmarContraseña) {
            errors.confirmarContraseña = 'Confirma la contraseña';
        } else if (values.contraseña && values.contraseña !== values.confirmarContraseña) {
            errors.confirmarContraseña = 'Las contraseñas no coinciden';
        }

    }

    return errors;
};


export default function Registro() {

    // --- CAMBIOS AQUÍ ---
    // 1. ELIMINAR el hook useAuth
    // const { register } = useAuth();
    // 2. Obtener la función dispatch de Redux
    const dispatch = useDispatch();
    // 3. Seleccionar el estado de carga y error del registro del slice de auth en Redux
    const { isRegistering, registerError } = useSelector((state) => state.auth);
    // --- FIN CAMBIOS ---

    const navigate = useNavigate(); // Se mantiene igual

    const [step, setStep] = useState(1); // Estado local se mantiene
    const [generos, setGeneros] = useState([]); // Estado local se mantiene
    const [roles, setRoles] = useState([]); // Estado local se mantiene
    const [preguntas, setPreguntas] = useState([]); // Estado local se mantiene

    // --- CAMBIOS AQUÍ ---
    // Puedes usar el estado registerError de Redux para errores de API,
    // y mantener generalError para errores de validación previa si lo deseas,
    // o consolidarlos y usar solo registerError para errores de API
    // y Formik.errors para validación. Vamos a usar registerError para API
    // y generalError para validación previa.
    const [generalError, setGeneralError] = useState(''); // Estado local se mantiene para validación previa
    // --- FIN CAMBIOS ---


    // Este useEffect para cargar datos lookup se mantiene igual
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [genRes, rolRes, pregRes] = await Promise.all([
                    fetchGeneros(),
                    fetchRoles(),
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
    }, []);


    const initialValues = {
        // ... valores iniciales se mantienen igual ...
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
        confirmarContraseña: ''
    };

    // Función que se ejecuta al enviar el formulario final (Paso 2)
    const handleSubmit = async (values, { setSubmitting, setErrors, setFieldTouched }) => {
        setGeneralError(''); // Limpiar errores generales locales

        // Validar TODOS los campos ANTES de disparar el thunk (validación del lado del cliente)
        const errors = validateFormFields(values, 2); // Tu función de validación

        // Marcar todos los campos como tocados para que Formik muestre errores de validación
        Object.keys(values).forEach(field => {
            setFieldTouched(field, true);
        });


        if (Object.keys(errors).length > 0) {
            console.log("[SUBMIT] Errores de validación en submit:", errors);
            setErrors(errors); // Mostrar errores en Formik
            setGeneralError('Por favor corrige los errores en el formulario.'); // Mensaje general para validación fallida

            // Mostrar un toast por cada error (opcional, ya que Formik los muestra)
            // Object.values(errors).forEach((msg) => {
            //     toast.error(msg);
            // });

            setSubmitting(false); // Formik ya no está 'submitting'
            return; // Detener el proceso si hay errores de validación
        }

        // Si la validación del lado del cliente es exitosa, prepara los datos
        const { confirmarContraseña, ...dataToSend } = values;

        const finalDataToSend = {
            ...dataToSend,
            id_genero: parseInt(dataToSend.id_genero, 10),
            id_rol: parseInt(dataToSend.id_rol, 10),
            id_pregunta: parseInt(dataToSend.id_pregunta, 10),
        };

        // --- CAMBIOS AQUÍ ---
        // 1. Disparar el thunk registerAsync
        // 2. Usar .unwrap() para manejar el éxito o fracaso asíncrono aquí mismo
        try {
            // registerAsync retornará una Promise. Con .unwrap() puedes usar .then()/.catch()
            await dispatch(registerAsync(finalDataToSend)).unwrap();

            console.log("[SUBMIT] Registro exitoso (Thunk Fulfilled). Navegando a /login");
            // La navegación ocurre aquí después de que el thunk es fulfilled
            navigate('/login');

        } catch (error) {
            // El error capturado aquí será lo que pasaste a rejectWithValue en el thunk
            console.error("[SUBMIT] Error al registrar usuario (Thunk Rejected):", error);

            // El mensaje de error de la API ya está en el estado de Redux (registerError)
            // y se mostrará automáticamente en el div {registerError && ...} más abajo.
            // Opcionalmente, puedes mostrar un toast aquí basado en el error si no lo haces en el thunk/extraReducer
            toast.error(typeof error === 'string' ? error : (error.message || 'Ocurrió un error inesperado al registrar. Intenta nuevamente.')); // Ajusta si el payload de error es complejo


            // No establecemos setGeneralError aquí si registerError de Redux se usa para API errors

        } finally {
            // Asegurarse de que el estado de submitting de Formik se desactive siempre
            console.log("[SUBMIT] Proceso de submit finalizado (llamada a API terminada).");
            setSubmitting(false); // Formik ya no está 'submitting'
        }
    };

    // La función para manejar el siguiente paso (validación del paso 1) se mantiene igual
    const handleNextStep = (values, setErrors, setFieldTouched) => {
        setGeneralError(''); // Limpiar errores generales locales

        const errors = validateFormFields(values, 1);
        const step1Fields = ['nombre', 'apellido', 'telefono', 'cedula', 'gmail', 'id_genero'];

        step1Fields.forEach(field => {
            setFieldTouched(field, true);
        });

        const step1Errors = Object.keys(errors)
            .filter(key => step1Fields.includes(key));

        if (step1Errors.length > 0) {
            console.log("[NEXT] Errores de validación en paso 1:", errors);
            const errorsForFormik = step1Fields.reduce((obj, field) => {
                if (errors[field]) {
                    obj[field] = errors[field];
                }
                return obj;
            }, {});
            setErrors(errorsForFormik); // Mostrar errores específicos del paso 1 en Formik
            setGeneralError('Por favor completa todos los campos requeridos y válidos del paso 1.'); // Mensaje general de validación
            Object.values(errorsForFormik).forEach((msg) => {
                toast.error(msg); // Mostrar toast por cada error de validación
            });


        } else {
            console.log("[NEXT] Validación paso 1 exitosa. Llamando setStep(2).");
            setErrors({}); // Limpiar errores de Formik
            setGeneralError(''); // Limpiar mensaje general
            setStep(2); // Avanzar al paso 2
        }
    }


    // El renderizado se mantiene en gran parte igual, con ajustes para mostrar
    // el estado de error de registro de Redux y deshabilitar el botón.
    return (
        <div className="flex min-h-screen">
            <Section />
            <div className="flex w-1/2 justify-center items-center bg-gray-50 p-10">
                <Formik initialValues={initialValues} onSubmit={handleSubmit} validate={() => {
                    // Formik validate prop is not needed if using manual validation like validateFormFields
                    // You can leave this empty or remove if validateFormFields is your only validation.
                    // If using Yup or complex validation, this is where it would go.
                }}>
                    {({ isSubmitting, values, errors, touched, setErrors, setFieldTouched }) => (
                        <Form className="w-full max-w-md space-y-6 bg-white p-8 rounded-lg shadow-xl">
                            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Crear Cuenta</h2>

                            {/* --- CAMBIOS AQUÍ --- */}
                            {/* Mostrar el error general (de validación previa) O el error de registro de Redux (de API) */}
                            {(generalError || registerError) && (
                                <div className="text-red-600 text-sm text-center mb-4">
                                    {generalError || (typeof registerError === 'string' ? registerError : 'Ocurrió un error al registrar.')}
                                </div>
                            )}
                            {/* --- FIN CAMBIOS --- */}


                            <div className="flex justify-center space-x-2 mb-6">
                                <div className={`w-8 h-2 rounded-full ${step === 1 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                                <div className={`w-8 h-2 rounded-full ${step === 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                            </div>

                            {step === 1 ? (
                                <>
                                    {/* Campos del paso 1 */}
                                    {/* ... nombre, apellido, telefono, cedula, gmail, id_genero fields ... */}
                                    <div>
                                        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
                                        <Field
                                            name="nombre"
                                            placeholder="Nombre"
                                            onInput={(e) => { e.target.value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, ''); }}
                                            className={`w-full p-3 mt-1 border ${errors.nombre && touched.nombre ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}
                                        />
                                        {/* ErrorMessage de Formik para errores de validación específicos */}
                                        <ErrorMessage name="nombre" component="div" className="text-red-500 text-xs mt-1" />
                                    </div>
                                    <div>
                                        <label htmlFor="apellido" className="block text-sm font-medium text-gray-700">Apellido</label>
                                        <Field
                                            name="apellido"
                                            placeholder="Apellido"
                                            onInput={(e) => { e.target.value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, ''); }}
                                            className={`w-full p-3 mt-1 border ${errors.apellido && touched.apellido ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}
                                        />
                                        <ErrorMessage name="apellido" component="div" className="text-red-500 text-xs mt-1" />
                                    </div>
                                    <div>
                                        <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">Teléfono</label>
                                        <Field
                                            name="telefono"
                                            placeholder="Teléfono"
                                            onInput={(e) => { e.target.value = e.target.value.replace(/[^0-9]/g, ''); }}
                                            className={`w-full p-3 mt-1 border ${errors.telefono && touched.telefono ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}
                                        />
                                        <ErrorMessage name="telefono" component="div" className="text-red-500 text-xs mt-1" />
                                    </div>
                                    <div>
                                        <label htmlFor="cedula" className="block text-sm font-medium text-gray-700">Cédula</label>
                                        <Field
                                            name="cedula"
                                            placeholder="Cédula"
                                            onInput={(e) => { e.target.value = e.target.value.replace(/[^0-9]/g, ''); }}
                                            className={`w-full p-3 mt-1 border ${errors.cedula && touched.cedula ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}
                                        />
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
                                    {/* ... id_rol, id_pregunta, respuesta, contraseña, confirmarContraseña fields ... */}
                                    <div>
                                        <label htmlFor="id_rol" className="block text-sm font-medium text-gray-700">Tipo de Participante</label>
                                        <Field
                                            as="select"
                                            name="id_rol"
                                            className={`w-full p-3 mt-1 border ${errors.id_rol && touched.id_rol ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}>
                                            <option value="">Selecciona un tipo de participante</option>
                                            {roles.filter((r) => [12, 13, 14].includes(r.id)).map((r) => ( // Tu filtro de roles
                                                <option key={r.id} value={r.id}>{r.nombre}</option>
                                            ))}
                                        </Field>
                                        <ErrorMessage name="id_rol" component="div" className="text-red-500 text-xs mt-1" />
                                    </div>
                                    <div>
                                        <label htmlFor="id_pregunta" className="block text-sm font-medium text-gray-700">Pregunta de Seguridad</label>
                                        <Field
                                            as="select"
                                            name="id_pregunta"
                                            className={`w-full p-3 mt-1 border ${errors.id_pregunta && touched.id_pregunta ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}>
                                            <option value="">Selecciona una pregunta de seguridad</option>
                                            {preguntas.map((p) => (
                                                <option key={p.id} value={p.id}>{p.nombre}</option>
                                            ))}
                                        </Field>
                                        <ErrorMessage name="id_pregunta" component="div" className="text-red-500 text-xs mt-1" />
                                    </div>
                                    <div>
                                        <label htmlFor="respuesta" className="block text-sm font-medium text-gray-700">Respuesta de Seguridad</label>
                                        <Field
                                            name="respuesta"
                                            placeholder="Respuesta de Seguridad"
                                            className={`w-full p-3 mt-1 border ${errors.respuesta && touched.respuesta ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`} />
                                        <ErrorMessage name="respuesta" component="div" className="text-red-500 text-xs mt-1" />
                                    </div>
                                    <div>
                                        <label htmlFor="contraseña" className="block text-sm font-medium text-gray-700">Contraseña</label>
                                        <Field
                                            name="contraseña"
                                            type="password" placeholder="Contraseña"
                                            className={`w-full p-3 mt-1 border ${errors.contraseña && touched.contraseña ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`} />
                                        <ErrorMessage name="contraseña" component="div" className="text-red-500 text-xs mt-1" />
                                    </div>
                                    <div> {/* Campo Confirmar Contraseña */}
                                        <label htmlFor="confirmarContraseña" className="block text-sm font-medium text-gray-700">Confirmar Contraseña</label>
                                        <Field
                                            name="confirmarContraseña"
                                            type="password"
                                            placeholder="Confirmar Contraseña"
                                            className={`w-full p-3 mt-1 border ${errors.confirmarContraseña && touched.confirmarContraseña ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`} />
                                        <ErrorMessage name="confirmarContraseña" component="div" className="text-red-500 text-xs mt-1" />
                                    </div>

                                    <div className="flex justify-between gap-4 mt-6">
                                        <button
                                            type="button"
                                            onClick={() => setStep(1)}
                                            className="flex-1 bg-gray-400 text-white py-3 rounded-md font-semibold hover:bg-gray-500 transition duration-200">Atrás</button>

                                        {/* --- CAMBIOS AQUÍ --- */}
                                        {/* Usar el estado de carga de Redux (isRegistering) para deshabilitar y cambiar texto */}
                                        <button type="submit" disabled={isSubmitting || isRegistering} className="flex-1 bg-green-600 text-white py-3 rounded-md font-semibold hover:bg-green-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                                            {isRegistering ? 'Registrando...' : 'Registrarse'}
                                            {/* ELIMINAR: {isSubmitting ? 'Registrando...' : 'Registrarse'} */} {/* isSubmitting de Formik también está bien, pero isRegistering de Redux es más específico del API call */}
                                        </button>
                                        {/* --- FIN CAMBIOS --- */}
                                    </div>
                                </>
                            ) : null}

                            {/* Enlace a Iniciar Sesión */}
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