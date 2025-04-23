import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import Section from '../../components/Section';

import { fetchGeneros, fetchRoles, fetchPreguntasSeguridad } from '../../api/lookup.api';

const validateFormFields = (values, step) => {
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

    const { register } = useAuth();
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [generos, setGeneros] = useState([]);
    const [roles, setRoles] = useState([]);
    const [preguntas, setPreguntas] = useState([]);

    const [generalError, setGeneralError] = useState('');

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
        confirmarContraseña: '' // Campo para confirmación (no se envía al backend)
    };

    // Función que se ejecuta al enviar el formulario final (Paso 2)
    const handleSubmit = async (values, { setSubmitting, setErrors, setFieldTouched }) => {
        setGeneralError('');

        // Validar TODOS los campos antes de enviar al backend
        const errors = validateFormFields(values, 2);

        Object.keys(values).forEach(field => {
            setFieldTouched(field, true);
        });


        if (Object.keys(errors).length > 0) {
            console.log("[SUBMIT] Errores de validación en submit:", errors);
            setErrors(errors);
            setGeneralError('Por favor corrige los errores en el formulario.');

            // Mostrar un toast por cada error
            Object.values(errors).forEach((msg) => {
                toast.error(msg);
            });

            setSubmitting(false);
            return;
        }


        // Prepara los datos para enviar, excluyendo 'confirmarContraseña'
        const { confirmarContraseña, ...dataToSend } = values;

        const finalDataToSend = {
            ...dataToSend,
            id_genero: parseInt(dataToSend.id_genero, 10),
            id_rol: parseInt(dataToSend.id_rol, 10),
            id_pregunta: parseInt(dataToSend.id_pregunta, 10),
        };

        try {
            await register(finalDataToSend);
            console.log("[SUBMIT] Registro exitoso. Navegando a /login");
            navigate('/login');
        } catch (error) {

            console.error("[SUBMIT] Error al registrar usuario:", error);

            if (error.response?.data?.error) {
                setGeneralError(error.response.data.error);
            } else {
                setGeneralError('Ocurrió un error inesperado al registrar. Intenta nuevamente.');
            }
        } finally {
            // Asegurarse de que el estado de submitting se desactive siempre
            console.log("[SUBMIT] Proceso de submit finalizado.");
            setSubmitting(false);
        }
    };

    const handleNextStep = (values, setErrors, setFieldTouched) => {
        setGeneralError(''); // Limpiar errores generales previos

        // Validar solo los campos del paso 1
        const errors = validateFormFields(values, 1);
        const step1Fields = ['nombre', 'apellido', 'telefono', 'cedula', 'gmail', 'id_genero'];

        // Marcar solo los campos del paso 1 como tocados para mostrar sus errores
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
            setErrors(errorsForFormik);
            setGeneralError('Por favor completa todos los campos requeridos y válidos del paso 1.');
            Object.values(errorsForFormik).forEach((msg) => {
                toast.error(msg);
            });

        } else {

            console.log("[NEXT] Validación paso 1 exitosa. Llamando setStep(2).");
            setErrors({});
            setGeneralError('');
            setStep(2);
        }
    }

    return (

        <div className="flex min-h-screen">
            <Section />
            <div className="flex w-1/2 justify-center items-center bg-gray-50 p-10">
                <Formik initialValues={initialValues} onSubmit={handleSubmit} validate={() => {
                }}>
                    {({ isSubmitting, values, errors, touched, setErrors, setFieldTouched }) => (
                        <Form className="w-full max-w-md space-y-6 bg-white p-8 rounded-lg shadow-xl">
                            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Crear Cuenta</h2>
                            {generalError && <div className="text-red-600 text-sm text-center mb-4">{generalError}</div>}
                            <div className="flex justify-center space-x-2 mb-6">
                                <div className={`w-8 h-2 rounded-full ${step === 1 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                                <div className={`w-8 h-2 rounded-full ${step === 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                            </div>

                            {step === 1 ? (
                                <>
                                    {/* Campos del paso 1 */}
                                    <div>
                                        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
                                        <Field
                                            name="nombre"
                                            placeholder="Nombre"
                                            onInput={(e) => {
                                                e.target.value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
                                            }}
                                            className={`w-full p-3 mt-1 border ${errors.nombre && touched.nombre ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}
                                        />

                                    </div>
                                    <div>
                                        <label htmlFor="apellido" className="block text-sm font-medium text-gray-700">Apellido</label>
                                        <Field
                                            name="apellido"
                                            placeholder="Apellido"
                                            onInput={(e) => {
                                                e.target.value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
                                            }}
                                            className={`w-full p-3 mt-1 border ${errors.apellido && touched.apellido ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}
                                        />

                                    </div>
                                    <div>
                                        <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">Teléfono</label>
                                        <Field
                                            name="telefono"
                                            placeholder="Teléfono"
                                            onInput={(e) => {
                                                e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                            }}
                                            className={`w-full p-3 mt-1 border ${errors.telefono && touched.telefono ? 'border-red-500' : 'border-gray-300'
                                                } rounded-md focus:ring-blue-500 focus:border-blue-500`}
                                        />

                                    </div>
                                    <div>
                                        <label htmlFor="cedula" className="block text-sm font-medium text-gray-700">Cédula</label>
                                        <Field
                                            name="cedula"
                                            placeholder="Cédula"
                                            onInput={(e) => {
                                                e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                            }}
                                            className={`w-full p-3 mt-1 border ${errors.cedula && touched.cedula ? 'border-red-500' : 'border-gray-300'
                                                } rounded-md focus:ring-blue-500 focus:border-blue-500`}
                                        />

                                    </div>
                                    <div>
                                        <label htmlFor="gmail" className="block text-sm font-medium text-gray-700">Correo electrónico</label>
                                        <Field name="gmail" type="email" placeholder="Correo electrónico" className={`w-full p-3 mt-1 border ${errors.gmail && touched.gmail ? 'border-red-500' : 'border-gray-300'} 
                                        rounded-md focus:ring-blue-500 focus:border-blue-500`} />
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
                                        <Field
                                            as="select"
                                            name="id_rol"
                                            className={`w-full p-3 mt-1 border ${errors.id_rol && touched.id_rol ? 'border-red-500' : 'border-gray-300'} 
                                          rounded-md focus:ring-blue-500 focus:border-blue-500`}>
                                            <option value="">Selecciona un tipo de participante</option>
                                            {/* Nota: Este filtro [11, 12, 13, 14] filtra roles específicos */}
                                            {roles.filter((r) => [12, 13, 14].includes(r.id)).map((r) => (
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
                                            className={`w-full p-3 mt-1 border ${errors.id_pregunta && touched.id_pregunta ? 'border-red-500' : 'border-gray-300'} 
                                          rounded-md focus:ring-blue-500 focus:border-blue-500`}>
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
                                        <Field
                                            name="respuesta"
                                            placeholder="Respuesta de Seguridad"
                                            className={`w-full p-3 mt-1 border ${errors.respuesta && touched.respuesta ? 'border-red-500' : 'border-gray-300'} 
                                          rounded-md focus:ring-blue-500 focus:border-blue-500`} />
                                        <ErrorMessage name="respuesta" component="div" className="text-red-500 text-xs mt-1" />
                                    </div>
                                    <div>
                                        <label htmlFor="contraseña" className="block text-sm font-medium text-gray-700">Contraseña</label>
                                        <Field
                                            name="contraseña"
                                            type="password" placeholder="Contraseña"
                                            className={`w-full p-3 mt-1 border ${errors.contraseña && touched.contraseña ? 'border-red-500' : 'border-gray-300'} r
                                          ounded-md focus:ring-blue-500 focus:border-blue-500`} />
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

                                    <div className="flex justify-between gap-4 mt-6">
                                        <button
                                            type="button"
                                            onClick={() => setStep(1)}
                                            className="flex-1 bg-gray-400 text-white py-3 rounded-md font-semibold hover:bg-gray-500 transition duration-200">Atrás</button>
                                        <button type="submit" disabled={isSubmitting} className="flex-1 bg-green-600 text-white py-3 rounded-md font-semibold hover:bg-green-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                                            {/* Cambiar texto del botón según el estado de submitting */}
                                            {isSubmitting ? 'Registrando...' : 'Registrarse'}
                                        </button>
                                    </div>


                                </>
                            ) : null}
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