import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import useClasificacionStore from '../store/clasificacionStore';
import { getAllClasificaciones } from '../api/clasificacion.api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faXmark, 
  faSave, 
  faTimes, 
  faFolder, 
  faImage, 
  faLayerGroup,
  
} from '@fortawesome/free-solid-svg-icons';
import * as iconos from '@fortawesome/free-solid-svg-icons';
import { toast } from 'sonner';

const Modal = ({ isOpen, onClose, editData = null, parentId = null, parentInfo = null }) => {
  const { 
    createClasificacion, 
    updateClasificacion, 
    loading, 
    error, 
    clearError,
    fetchParentClasifications,
    getClasificacion
  } = useClasificacionStore();

  const [clasificaciones, setClasificaciones] = useState([]);
  const [parentClasificacion, setParentClasificacion] = useState(null);
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [animationClass, setAnimationClass] = useState('');
  const [nombreClasificacion, setNombreClasificacion] = useState('');

  // Valores iniciales del formulario
  const initialValues = {
    nombre: editData?.nombre || '',
    descripcion: editData?.descripcion || '',
    id_icono: editData?.id_icono || '',
    type_id: editData?.type_id || parentInfo?.type_id || '',
    parent_id: editData?.parent_id || parentId || '',
    orden: editData?.orden || ""
  };

  // Función de validación personalizada
  const validateForm = (values) => {
    const errors = {};
    if (!values.nombre.trim()) {
      errors.nombre = 'El nombre es requerido';
    } else if (values.nombre.length < 3) {
      errors.nombre = 'El nombre debe tener al menos 3 caracteres';
    }
    if (values.orden !== '' && (isNaN(values.orden) || parseInt(values.orden) < 0)) {
      errors.orden = 'El orden debe ser un número positivo';
    }
    return errors;
  };

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      document.body.style.overflow = 'hidden';
      setTimeout(() => setAnimationClass('animate-modal-in'), 10);
      fetchClasificaciones();
    } else {
      setAnimationClass('animate-modal-out');
      document.body.style.overflow = 'unset';
      const timeout = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      clearError();
    }
  }, [isOpen, clearError]);

  useEffect(() => {
    // Encontrar el nombre de la clasificación actual basado en el type_id
    if (clasificaciones.length > 0) {
      const clasificacionActual = clasificaciones.find(c => c.id_clasificacion === parseInt(parentInfo?.type_id));
      if (clasificacionActual) {
        setNombreClasificacion(clasificacionActual.nombre);
      }
    }
  }, [clasificaciones, parentInfo?.type_id]);

 

  const fetchClasificaciones = async () => {
    try {
      const response = await getAllClasificaciones();
      console.log('Datos recibidos de getAllClasificaciones:', response.data);
      setClasificaciones(response.data);
    } catch (err) {
      console.error('Error al cargar clasificaciones:', err);
      toast.error('Error al cargar las clasificaciones');
    }
  };

  useEffect(() => {
    console.log('Estado actual de clasificaciones:', clasificaciones);
  }, [clasificaciones]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const dataToSend = {
        ...values,
        id_icono: values.id_icono !== '' ? parseInt(values.id_icono) : null,
        type_id: values.type_id ? parseInt(values.type_id) : null,
        parent_id: editData ? (values.parent_id ? parseInt(values.parent_id) : null) : null,
        orden: values.orden !== '' ? parseInt(values.orden) : 0
      };

      if (editData) {
        await updateClasificacion(editData.id_clasificacion, dataToSend);
        toast.success(`Subclasificación "${dataToSend.nombre}" actualizada correctamente`);
      } else {
        await createClasificacion(dataToSend);
        toast.success(`Subclasificación "${dataToSend.nombre}" creada correctamente`);
      }

      onClose();
      await fetchParentClasifications();
    } catch (err) {
      console.error("Error al guardar:", err);
      const errorMessage = err.response?.data?.error || err.message || 'Ha ocurrido un error al procesar la solicitud';
      toast.error('Error al guardar la subclasificación', {
        description: errorMessage,
        duration: 4000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!shouldRender) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center perspective-1000">
      <div 
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-all duration-500 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`} 
        onClick={onClose}
      />
      
      <div 
        className={`relative w-full max-w-xl bg-white rounded-2xl shadow-2xl transform transition-all duration-500 ${
          animationClass
        } flex flex-col max-h-[90vh]`}
      >
        {/* Header fijo */}
        <div className="relative overflow-hidden p-6 border-b border-gray-100 flex-shrink-0">
          <div className="animate-shine absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              {editData ? `Editar ${editData.nombre}` : `Agregar ${parentInfo?.nombre || 'Clasificación'}`}
              {editData?.nicono && (
                <FontAwesomeIcon
                  icon={iconos[editData.nicono] || iconos.faFile}
                  className="inline-block ml-2 text-blue-600"
                  size="lg"
                />
              )}
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full transform hover:rotate-90 duration-300"
            >
              <FontAwesomeIcon icon={faXmark} className="text-xl" />
            </button>
          </div>
        </div>

        {/* Contenido con scroll */}
        <div className="flex-1 overflow-y-auto">
          <Formik
            initialValues={initialValues}
            validate={validateForm}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
              <Form className="p-6 space-y-5">
                {[
                  { name: 'nombre', icon: faFolder, label: 'Nombre', type: 'text' },
                  { name: 'descripcion', icon: faLayerGroup, label: 'Descripción', type: 'textarea' },
                  { name: 'orden', icon: faLayerGroup, label: 'Orden', type: 'number', className: 'appearance-none' },
                  { name: 'id_icono', icon: faImage, label: 'Icono', type: 'select' },
               
                ].map((field, index) => (
                  <div 
                    key={field.name}
                    className={`transform transition-all duration-300 animate-fade-slide-up`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FontAwesomeIcon icon={field.icon} className="mr-2 text-blue-500" />
                      {field.label}
                      {field.name === 'parent_id' && parentClasificacion && (
                        <span className="ml-2 text-sm text-gray-500">
                          (Actual: {parentClasificacion.nombre})
                        </span>
                      )}
                    </label>
                    {field.type === 'textarea' ? (
                      <Field
                        as="textarea"
                        name={field.name}
                        placeholder={`${field.label} detallado...`}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          touched[field.name] && errors[field.name] 
                            ? 'border-red-300 focus:ring-red-500' 
                            : 'border-gray-200 focus:ring-blue-500'
                        } focus:ring-2 focus:border-transparent transition-all duration-300 hover:border-blue-300 min-h-[100px] resize-none`}
                      />
                    ) : field.type === 'select' ? (
                      <div className="relative">
                        <Field
                          as="select"
                          name={field.name}
                          disabled={field.disabled}
                          className={`w-full px-4 py-3 rounded-lg border ${
                            touched[field.name] && errors[field.name] 
                              ? 'border-red-300 focus:ring-red-500' 
                              : 'border-gray-200 focus:ring-blue-500'
                          } focus:ring-2 focus:border-transparent transition-all duration-300 hover:border-blue-300 appearance-none bg-white ${
                            field.disabled ? 'bg-gray-100 cursor-not-allowed' : ''
                          }`}
                        >
                          {field.name === 'id_icono' && (
                            <>
                              <option value="">Seleccionar ícono</option>
                              {clasificaciones.map((c) => (
                                <option key={c.id_clasificacion} value={c.id_clasificacion}>
                                  {c.nombre}
                                </option>
                              ))}
                            </>
                          )}
                            
                        </Field>
                        {field.name === 'id_icono' && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <FontAwesomeIcon 
                              icon={iconos[clasificaciones.find(c => c.id_clasificacion === parseInt(values[field.name]))?.nombre] || iconos.faFile} 
                              className="text-blue-600"
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      <Field
                        type={field.type}
                        name={field.name}
                        placeholder={`${field.label}...`}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          touched[field.name] && errors[field.name] 
                            ? 'border-red-300 focus:ring-red-500' 
                            : 'border-gray-200 focus:ring-blue-500'
                        } focus:ring-2 focus:border-transparent transition-all duration-300 hover:border-blue-300 ${field.className || ''}`}
                      />
                    )}
                    <ErrorMessage
                      name={field.name}
                      component="div"
                      className="mt-1 text-sm text-red-600"
                    />
                  </div>
                ))}

                {error && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center space-x-2 animate-shake">
                    <FontAwesomeIcon icon={faTimes} className="text-red-500" />
                    <p>{error}</p>
                  </div>
                )}

                {/* Footer fijo */}
                <div className="relative overflow-hidden border-t border-gray-100 p-6 bg-gray-50 rounded-b-2xl flex-shrink-0 mt-6">
                  <div className="animate-shine absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-6 py-2.5 rounded-lg text-gray-700 hover:text-gray-900 bg-white border border-gray-200 hover:bg-gray-50 transition-all duration-300 shadow-sm hover:shadow transform hover:scale-105"
                      disabled={isSubmitting}
                    >
                      <FontAwesomeIcon icon={faTimes} className="mr-2" />
                      <span>Cancelar</span>
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-lg text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-sm hover:shadow-lg transform hover:scale-105 disabled:opacity-50"
                      disabled={isSubmitting}
                    >
                      <FontAwesomeIcon 
                        icon={faSave} 
                        className={`mr-2 ${isSubmitting ? 'animate-spin' : ''}`} 
                      />
                      <span>{isSubmitting ? 'Guardando...' : editData ? 'Actualizar' : 'Guardar'}</span>
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>,
    document.body
  );
};

// Añadir estilos necesarios en tu archivo CSS global
const style = document.createElement('style');
style.textContent = `
  @keyframes modalIn {
    from {
      opacity: 0;
      transform: scale(0.95) translateY(10px) rotateX(-10deg);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0) rotateX(0);
    }
  }

  @keyframes modalOut {
    from {
      opacity: 1;
      transform: scale(1) translateY(0) rotateX(0);
    }
    to {
      opacity: 0;
      transform: scale(0.95) translateY(10px) rotateX(10deg);
    }
  }

  @keyframes shine {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(100%);
    }
  }

  @keyframes fadeSlideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .perspective-1000 {
    perspective: 1000px;
  }

  .animate-modal-in {
    animation: modalIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .animate-modal-out {
    animation: modalOut 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .animate-shine {
    animation: shine 2s infinite;
  }

  .animate-fade-slide-up {
    animation: fadeSlideUp 0.5s ease-out forwards;
  }

  /* Ocultar flechas del input number */
  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type="number"] {
    -moz-appearance: textfield;
  }
`;
document.head.appendChild(style);

export default Modal;
