import React, { useEffect, useState, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import useClasificacionStore from '../store/clasificacionStore';
import { getAllClasificaciones, getAllIcons } from '../api/clasificacion.api';
import { getSubclassificationsById } from '../api/auth.api';
import { CLASSIFICATION_IDS } from '../config/classificationIds';
import useAuthStore from '../store/authStore';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faXmark, 
  faSave, 
  faTimes, 
  faFolder, 
  faImage, 
  faLayerGroup,
  faChevronDown,
  faMobile
} from '@fortawesome/free-solid-svg-icons';
import * as iconos from '@fortawesome/free-solid-svg-icons';
import { toast } from 'sonner';

const Modal = ({ isOpen, onClose, editData = null, parentId = null, parentInfo = null }) => {
  const { 
    createClasificacion, 
    updateClasificacion, 
    error, 
    clearError,
    fetchParentClasifications,
    fetchProgramas,
    programas
  } = useClasificacionStore();

  const { tienePermiso, isSupervisor } = useAuthStore();

  const [icons, setIcons] = useState([]);
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [animationClass, setAnimationClass] = useState('');
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [selectPosition, setSelectPosition] = useState({ top: 0, left: 0, width: 0 });
  const [permisos, setPermisos] = useState([]);
  const [clasificacionesPrincipales, setClasificacionesPrincipales] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [institutos, setInstitutos] = useState([]);
  const [carreras, setCarreras] = useState([]);
  const [adicionalRaw, setAdicionalRaw] = useState(editData?.adicional ? JSON.stringify(editData.adicional, null, 2) : '');
  const [protectedValue, setProtectedValue] = useState(editData?.protected === 1);

  // Valores iniciales del formulario
  const initialValues = {
    nombre: editData?.nombre || '',
    descripcion: editData?.descripcion || '',
    id_icono: editData?.id_icono || '',
    type_id: editData?.type_id || parentInfo?.type_id || '',
    parent_id: (Number(parentInfo?.type_id) === CLASSIFICATION_IDS.CURSOS
      ? (editData?.parent_id || parentId || '')
      : Number(parentInfo?.type_id) === CLASSIFICATION_IDS.CARRERAS || Number(editData?.type_id) === CLASSIFICATION_IDS.CARRERAS
        ? (editData?.parent_id || parentId || '')
        : Number(parentInfo?.type_id) === CLASSIFICATION_IDS.PROGRAMAS || Number(editData?.type_id) === CLASSIFICATION_IDS.PROGRAMAS
          ? (editData?.parent_id || parentId || '')
          : ''),
    orden: editData?.orden || "",
    permisos: editData?.adicional?.id_objeto ? editData.adicional.id_objeto.join(',') : '',
    clasificaciones: editData?.adicional?.id_clasificacion ? editData.adicional.id_clasificacion.join(',') : '',
    isMobile: editData?.adicional?.mobile || false
  };

  // Determinar si es una clasificación principal o subclasificación
  const isMainClassification = !parentInfo && !editData?.type_id;

  // Función de validación personalizada
  const validateForm = (values) => {
    const errors = {};
    if (!values.nombre.trim()) {
      errors.nombre = 'El nombre es requerido';
    } else if (values.nombre.length < 3) {
      errors.nombre = 'El nombre debe tener al menos 3 caracteres';
    }
    
    // Validar que se seleccione un programa para cursos
    if (Number(parentInfo?.type_id) === CLASSIFICATION_IDS.CURSOS && !values.parent_id) {
      errors.parent_id = 'Debe seleccionar un programa';
    }
    
    // Validar que se seleccione un instituto para carreras
    if ((Number(parentInfo?.type_id) === CLASSIFICATION_IDS.CARRERAS || Number(values.type_id) === CLASSIFICATION_IDS.CARRERAS) && !values.parent_id) {
      errors.parent_id = 'Debe seleccionar un instituto';
    }

    // Validar que se seleccione una carrera para programas
    if ((Number(parentInfo?.type_id) === CLASSIFICATION_IDS.PROGRAMAS || Number(values.type_id) === CLASSIFICATION_IDS.PROGRAMAS) && !values.parent_id) {
      errors.parent_id = 'Debe seleccionar una carrera';
    }
    
    if (values.orden !== '' && (isNaN(values.orden) || parseInt(values.orden) < 0)) {
      errors.orden = 'El orden debe ser un número positivo';
    }
    return errors;
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      console.log('Valores en submit:', values);
      const isCursos = Number(values.type_id) === CLASSIFICATION_IDS.CURSOS || Number(parentInfo?.type_id) === CLASSIFICATION_IDS.CURSOS;
      const isCarrera = Number(values.type_id) === CLASSIFICATION_IDS.CARRERAS || Number(parentInfo?.type_id) === CLASSIFICATION_IDS.CARRERAS;
      const isPrograma = Number(values.type_id) === CLASSIFICATION_IDS.PROGRAMAS || Number(parentInfo?.type_id) === CLASSIFICATION_IDS.PROGRAMAS;
      let parentIdValue = null;
      if (isCursos || isCarrera || isPrograma) {
        parentIdValue = values.parent_id && values.parent_id !== '' ? Number(values.parent_id) : null;
      }
      const dataToSend = {
        ...values,
        id_icono: values.id_icono !== '' ? parseInt(values.id_icono) : null,
        type_id: values.type_id ? parseInt(values.type_id) : null,
        parent_id: parentIdValue,
        orden: values.orden !== '' ? parseInt(values.orden) : 0
      };
      console.log('Objeto enviado:', dataToSend);

      // Format permissions as an object with id_objeto array and id_clasificacion array for roles
      if (Number(values.type_id) === CLASSIFICATION_IDS.ROLES) {
        const permisosArray = values.permisos ? values.permisos.split(',').map(p => parseInt(p.trim())) : [];
        const clasificacionesArray = values.clasificaciones ? values.clasificaciones.split(',').map(c => parseInt(c.trim())) : [];
        
       
        
        dataToSend.adicional = { 
          id_objeto: permisosArray,
          id_clasificacion: clasificacionesArray
        };
        
        console.log('Objeto adicional final:', dataToSend.adicional);
      }

      // Handle mobile field for PREFIJOS_TLF
      if (Number(values.type_id) === CLASSIFICATION_IDS.PREFIJOS_TLF || Number(parentInfo?.type_id) === CLASSIFICATION_IDS.PREFIJOS_TLF) {
        dataToSend.adicional = { 
          mobile: values.isMobile 
        };
        console.log('Objeto adicional para PREFIJOS_TLF:', dataToSend.adicional);
      }

      // Si es supervisor, incluir adicional y protected
      if (isSupervisor) {
        try {
          dataToSend.adicional = adicionalRaw ? JSON.parse(adicionalRaw) : null;
        } catch {
          toast.error('El campo adicional no es un JSON válido');
          setSubmitting(false);
          return;
        }
        dataToSend.protected = protectedValue ? 1 : 0;
      }

      if (editData) {
        await updateClasificacion(editData.id_clasificacion, dataToSend);
        toast.success(`Clasificación "${dataToSend.nombre}" actualizada correctamente`);
      } else {
        await createClasificacion(dataToSend);
        const message = isMainClassification 
          ? `Clasificación principal "${dataToSend.nombre}" creada correctamente`
          : `Subclasificación "${dataToSend.nombre}" creada correctamente`;
        toast.success(message);
      }

      onClose();
      await fetchParentClasifications();
    } catch (err) {
      console.error("Error al guardar:", err);
      // Extraer los mensajes de error del backend
      const errorData = err.response?.data;
      const errorMessage = errorData?.error || err.message || 'Ha ocurrido un error al procesar la solicitud';
      const dbError = errorData?.dbError;
      const detail = errorData?.detail;
      let description = '';
      if (dbError && dbError !== errorMessage) description += dbError + '\n';
      if (detail && detail !== dbError && detail !== errorMessage) description += detail;
      toast.error('Error al guardar la subclasificación', {
        description: description || errorMessage,
        duration: 6000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSelectClick = (e, field) => {
    if (!field.disabled) {
      const rect = e.currentTarget.getBoundingClientRect();
      setSelectPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      });
      setIsSelectOpen(!isSelectOpen);
    }
  };

  // Definir los campos del formulario
  const formFields = [
    { name: 'nombre', icon: faFolder, label: 'Nombre', type: 'text' },
    { name: 'descripcion', icon: faLayerGroup, label: 'Descripción', type: 'textarea' },
    { name: 'id_icono', icon: faImage, label: 'Ícono', type: 'select' },
  ];

  // Solo uno de los dos: programa para cursos, instituto para carreras
  if (Number(parentInfo?.type_id) === CLASSIFICATION_IDS.CURSOS || Number(editData?.type_id) === CLASSIFICATION_IDS.CURSOS) {
    formFields.push({
      name: 'parent_id',
      icon: faFolder,
      label: 'Programa',
      type: 'select',
      options: programas.map(p => ({ value: p.id, label: p.nombre }))
    });
  } else if (Number(parentInfo?.type_id) === CLASSIFICATION_IDS.CARRERAS || Number(editData?.type_id) === CLASSIFICATION_IDS.CARRERAS) {
    formFields.push({
      name: 'parent_id',
      icon: faFolder,
      label: 'Instituto',
      type: 'select',
      options: institutos.map(i => ({ value: i.id, label: i.nombre }))
    });
  } else if (Number(parentInfo?.type_id) === CLASSIFICATION_IDS.PROGRAMAS || Number(editData?.type_id) === CLASSIFICATION_IDS.PROGRAMAS) {
    formFields.push({
      name: 'parent_id',
      icon: faFolder,
      label: 'Carrera',
      type: 'select',
      options: carreras.map(c => ({ value: c.id, label: c.nombre }))
    });
  }

  // Agregar el campo orden solo si el usuario NO tiene el permiso CMP_ORDEN
  if (!tienePermiso(CLASSIFICATION_IDS.CMP_ORDEN)) {
    formFields.push({ 
      name: 'orden', 
      icon: faLayerGroup, 
      label: 'Orden', 
      type: 'number', 
      className: 'appearance-none'
    });
  }

  // Función para limpiar el estado del modal
  const clearModalState = useCallback(() => {
    setIcons([]);
    setPermisos([]);
    setClasificacionesPrincipales([]);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      document.body.style.overflow = 'hidden';
      setTimeout(() => setAnimationClass('animate-modal-in'), 10);
      // Precargar campos especiales para supervisor
      if (isSupervisor) {
        setAdicionalRaw(editData?.adicional ? JSON.stringify(editData.adicional, null, 2) : '');
        setProtectedValue(editData?.protected === 1);
      }
      
      // Solo cargar datos una vez cuando se abre el modal
      if (!dataLoaded) {
        // Cargar datos de forma asíncrona
        const loadData = async () => {
          try {
            // Cargar íconos directamente desde la API
            const iconsResponse = await getAllIcons();
            setIcons(iconsResponse.data);
            
            // Solo cargar permisos y clasificaciones principales si es necesario
            if (parentInfo || editData?.type_id) {
              const permisosResponse = await getSubclassificationsById(CLASSIFICATION_IDS.OBJETOS);
              setPermisos(permisosResponse.data.data || []);
              
              const principalesResponse = await getAllClasificaciones();
              const principales = principalesResponse.data.filter(c => c.type_id === null);
              setClasificacionesPrincipales(principales);
            }
            
            // Si es una clasificación de cursos, obtener los programas
            if (Number(parentInfo?.type_id) === CLASSIFICATION_IDS.CURSOS) {
              fetchProgramas();
            }
            
            // Si es una carrera, obtener los institutos
            if (Number(parentInfo?.type_id) === CLASSIFICATION_IDS.CARRERAS || Number(editData?.type_id) === CLASSIFICATION_IDS.CARRERAS) {
              const institutosResponse = await getSubclassificationsById(CLASSIFICATION_IDS.INSTITUTOS);
              setInstitutos(institutosResponse.data.data || []);
            }
            
            // Si es un programa, obtener las carreras
            if (Number(parentInfo?.type_id) === CLASSIFICATION_IDS.PROGRAMAS || Number(editData?.type_id) === CLASSIFICATION_IDS.PROGRAMAS) {
              const carrerasResponse = await getSubclassificationsById(CLASSIFICATION_IDS.CARRERAS);
              setCarreras(carrerasResponse.data.data || []);
            }
            
            setDataLoaded(true);
          } catch (err) {
            console.error('Error al cargar datos:', err);
            toast.error('Error al cargar los datos');
          }
        };
        
        loadData();
      }
    } else {
      // Limpiar estado inmediatamente cuando se cierra
      clearModalState();
      setDataLoaded(false);
      setAnimationClass('animate-modal-out');
      document.body.style.overflow = 'unset';
      const timeout = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpen, dataLoaded, parentInfo?.type_id, editData?.type_id, editData?.adicional]);

  useEffect(() => {
    if (!isOpen) {
      clearError();
    }
  }, [isOpen, clearError]);

  // Resetear dataLoaded cuando cambian los props importantes
  useEffect(() => {
    if (isOpen) {
      setDataLoaded(false);
    }
  }, [editData?.id_clasificacion, parentInfo?.type_id]);

  // Efecto para mostrar el programa seleccionado en la consola
  useEffect(() => {
    if (editData && Number(parentInfo?.type_id) === CLASSIFICATION_IDS.CURSOS) {
      // Log silencioso para debugging si es necesario
    }
  }, [editData, programas, parentInfo?.type_id]);

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
        className={`relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl transform transition-all duration-500 ${
          animationClass
        } flex flex-col max-h-[90vh]`}
      >
        {/* Header fijo */}
        <div className="relative overflow-hidden p-6 border-b border-gray-100 flex-shrink-0">
          <div className="animate-shine absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              {editData ? `Editar ${editData.nombre}` : isMainClassification ? 'Crear Clasificación Principal' : `Agregar ${parentInfo?.nombre || 'Clasificación'}`}
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
            {({ values, errors, touched, handleChange, isSubmitting, setFieldValue }) => {
              console.log('Valores actuales del formulario:', values);
              return (
                <Form className="p-6 space-y-5">
                  {formFields.map((field, index) => (
                    <div 
                      key={field.name}
                      className={`transform transition-all duration-300 animate-fade-slide-up`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FontAwesomeIcon icon={field.icon} className="mr-2 text-blue-500" />
                        {field.label}
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
                        field.name === 'id_icono' ? (
                          <div className="relative">
                            <div 
                              className={`w-full px-4 py-3 rounded-lg border ${
                                touched[field.name] && errors[field.name] 
                                  ? 'border-red-300 focus:ring-red-500' 
                                  : 'border-gray-200 focus:ring-blue-500'
                              } focus:ring-2 focus:border-transparent transition-all duration-300 hover:border-blue-300 bg-white cursor-pointer flex items-center justify-between`}
                              onClick={(e) => handleSelectClick(e, field)}
                            >
                              <span className="flex items-center">
                                {values[field.name] && icons && (
                                  <FontAwesomeIcon 
                                    icon={iconos[icons.find(i => i.id_clasificacion === parseInt(values[field.name]))?.nombre] || iconos.faFile} 
                                    className="text-blue-600 mr-2"
                                  />
                                )}
                                <span>
                                  {values[field.name] && icons
                                    ? icons.find(i => i.id_clasificacion === parseInt(values[field.name]))?.nombre 
                                    : 'Seleccionar ícono'}
                                </span>
                              </span>
                              <FontAwesomeIcon 
                                icon={faChevronDown} 
                                className={`text-gray-400 transition-transform duration-200 ${isSelectOpen ? 'transform rotate-180' : ''}`}
                              />
                            </div>
                            <Field
                              as="select"
                              name={field.name}
                              className="hidden"
                            >
                              <option value="">Seleccionar ícono</option>
                              {icons && icons.map((i) => (
                                <option key={i.id_clasificacion} value={i.id_clasificacion}>
                                  {i.nombre}
                                </option>
                              ))}
                            </Field>
                            {isSelectOpen && icons && ReactDOM.createPortal(
                              <div 
                                className="fixed bg-white border border-gray-200 rounded-lg shadow-lg z-[9999]"
                                style={{
                                  top: `${selectPosition.top}px`,
                                  left: `${selectPosition.left}px`,
                                  width: `${selectPosition.width}px`
                                }}
                              >
                                <div className="max-h-60 overflow-y-auto">
                                  {[...icons]
                                    .sort((a, b) => a.nombre.localeCompare(b.nombre))
                                    .map((i) => (
                                      <div
                                        key={i.id_clasificacion}
                                        className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          const event = { target: { name: field.name, value: i.id_clasificacion } };
                                          handleChange(event);
                                          setIsSelectOpen(false);
                                        }}
                                      >
                                        <FontAwesomeIcon 
                                          icon={iconos[i.nombre] || iconos.faFile} 
                                          className="text-blue-600 mr-2"
                                        />
                                        <span>{i.nombre}</span>
                                      </div>
                                    ))}
                                </div>
                              </div>,
                              document.body
                            )}
                          </div>
                        ) : (
                          <Field
                            as="select"
                            name={field.name}
                            className={`w-full px-4 py-3 rounded-lg border ${
                              touched[field.name] && errors[field.name] 
                                ? 'border-red-300 focus:ring-red-500' 
                                : 'border-gray-200 focus:ring-blue-500'
                            } focus:ring-2 focus:border-transparent transition-all duration-300 hover:border-blue-300`}
                          >
                            <option value="">Seleccionar {field.label.toLowerCase()}</option>
                            {field.options && field.options.map((opt) => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </Field>
                        )
                      ) : (
                        <Field
                          type={field.type}
                          name={field.name}
                          placeholder={`${field.label}...`}
                          disabled={field.disabled}
                          className={`w-full px-4 py-3 rounded-lg border ${
                            touched[field.name] && errors[field.name] 
                              ? 'border-red-300 focus:ring-red-500' 
                              : 'border-gray-200 focus:ring-blue-500'
                          } focus:ring-2 focus:border-transparent transition-all duration-300 hover:border-blue-300 ${
                            field.disabled ? 'bg-gray-100 cursor-not-allowed' : ''
                          } ${field.className || ''}`}
                        />
                      )}
                      <ErrorMessage
                        name={field.name}
                        component="div"
                        className="mt-1 text-sm text-red-600"
                      />
                    </div>
                  ))}

                  {Number(values.type_id) === CLASSIFICATION_IDS.ROLES && !isMainClassification && (
                    <div 
                      className="transform transition-all duration-300 animate-fade-slide-up"
                      style={{ animationDelay: '400ms' }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FontAwesomeIcon icon={faLayerGroup} className="mr-2 text-blue-500" />
                        Permisos de Objetos
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {permisos.map((permiso) => (
                          <label 
                            key={permiso.id}
                            className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-blue-50 cursor-pointer transition-colors duration-200 min-h-[52px]"
                          >
                            <input
                              type="checkbox"
                              checked={values.permisos ? values.permisos.split(',').includes(permiso.id.toString()) : false}
                              onChange={() => {
                                const currentPermisos = values.permisos ? values.permisos.split(',').map(p => p.trim()) : [];
                                const newPermisos = currentPermisos.includes(permiso.id.toString())
                                  ? currentPermisos.filter(id => id !== permiso.id.toString())
                                  : [...currentPermisos, permiso.id.toString()];
                                setFieldValue('permisos', newPermisos.join(','));
                              }}
                              className="form-checkbox h-4 w-4 text-blue-600 mt-1 flex-shrink-0"
                            />
                            <span className="text-gray-700 text-sm leading-tight">
                              {permiso.nombre}
                            </span>
                          </label>
                        ))}
                      </div>
                      <ErrorMessage
                        name="permisos"
                        component="div"
                        className="mt-1 text-sm text-red-600"
                      />
                    </div>
                  )}

                  {Number(values.type_id) === CLASSIFICATION_IDS.ROLES && !isMainClassification && (
                    <div 
                      className="transform transition-all duration-300 animate-fade-slide-up"
                      style={{ animationDelay: '500ms' }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FontAwesomeIcon icon={faFolder} className="mr-2 text-blue-500" />
                        Configuraciones Accesibles
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {clasificacionesPrincipales.map((clasificacion) => (
                          <label 
                            key={clasificacion.id_clasificacion}
                            className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-green-50 cursor-pointer transition-colors duration-200 min-h-[52px]"
                          >
                            <input
                              type="checkbox"
                              checked={values.clasificaciones ? values.clasificaciones.split(',').includes(clasificacion.id_clasificacion.toString()) : false}
                              onChange={() => {
                                const currentClasificaciones = values.clasificaciones ? values.clasificaciones.split(',').map(c => c.trim()) : [];
                                const newClasificaciones = currentClasificaciones.includes(clasificacion.id_clasificacion.toString())
                                  ? currentClasificaciones.filter(id => id !== clasificacion.id_clasificacion.toString())
                                  : [...currentClasificaciones, clasificacion.id_clasificacion.toString()];
                                setFieldValue('clasificaciones', newClasificaciones.join(','));
                              }}
                              className="form-checkbox h-4 w-4 text-green-600 mt-1 flex-shrink-0"
                            />
                            <span className="text-gray-700 text-sm leading-tight">
                              Configuración de {clasificacion.nombre}
                            </span>
                          </label>
                        ))}
                      </div>
                      <ErrorMessage
                        name="clasificaciones"
                        component="div"
                        className="mt-1 text-sm text-red-600"
                      />
                    </div>
                  )}

                  {/* Campo checkbox para PREFIJOS_TLF */}
                  {(Number(values.type_id) === CLASSIFICATION_IDS.PREFIJOS_TLF || Number(parentInfo?.type_id) === CLASSIFICATION_IDS.PREFIJOS_TLF) && (
                    <div 
                      className="transform transition-all duration-300 animate-fade-slide-up"
                      style={{ animationDelay: '600ms' }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FontAwesomeIcon icon={faMobile} className="mr-2 text-blue-500" />
                        Tipo de Teléfono
                      </label>
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-blue-50 cursor-pointer transition-colors duration-200">
                        <input
                          type="checkbox"
                          name="isMobile"
                          checked={values.isMobile}
                          onChange={(e) => setFieldValue('isMobile', e.target.checked)}
                          className="form-checkbox h-5 w-5 text-blue-600"
                        />
                        <span className="text-gray-700 text-sm font-medium">
                          Es un número móvil
                        </span>
                        <span className="text-gray-500 text-xs ml-2">
                          (Marcar si es un prefijo de telefonía móvil)
                        </span>
                      </div>
                      <ErrorMessage
                        name="isMobile"
                        component="div"
                        className="mt-1 text-sm text-red-600"
                      />
                    </div>
                  )}

                  {/* SOLO SUPERVISOR: Campo JSON adicional y protected */}
                  {isSupervisor && (
                    <div className="space-y-4 p-4 border-2 border-red-400 rounded-lg bg-red-50">
                      <label className="block text-sm font-bold text-red-700 mb-2">JSON adicional (solo supervisor)</label>
                      <textarea
                        value={adicionalRaw}
                        onChange={e => setAdicionalRaw(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-2 rounded-lg border border-red-300 focus:ring-2 focus:ring-red-400 focus:border-transparent bg-white text-red-900 font-mono"
                        placeholder={'{\n  "clave": "valor"\n}'}
                      />
                      <div className="flex items-center space-x-3 mt-2">
                        <input
                          type="checkbox"
                          checked={protectedValue}
                          onChange={e => setProtectedValue(e.target.checked)}
                          className="form-checkbox h-5 w-5 text-red-600"
                        />
                        <span className="text-red-700 text-sm font-bold">Protected (solo supervisor)</span>
                      </div>
                    </div>
                  )}

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
              );
            }}
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