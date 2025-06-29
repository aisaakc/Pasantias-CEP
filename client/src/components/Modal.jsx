import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Formik, Form } from 'formik';
import useClasificacionStore from '../store/clasificacionStore';
import { getAllClasificaciones } from '../api/clasificacion.api';
import { getSubclassificationsById } from '../api/auth.api';
import { CLASSIFICATION_IDS } from '../config/classificationIds';
import useAuthStore from '../store/authStore';
import useIcons from '../hooks/useIcons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faXmark, 
  faSave, 
  faTimes, 
  faFolder, 
  faLayerGroup,
  faMobile
} from '@fortawesome/free-solid-svg-icons';
import * as iconos from '@fortawesome/free-solid-svg-icons';
import { toast } from 'sonner';
import IconSelector from './IconSelector';

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

  const { isSupervisor } = useAuthStore();
  const { icons } = useIcons();

  const [shouldRender, setShouldRender] = useState(isOpen);
  const [animationClass, setAnimationClass] = useState('');
  const [permisos, setPermisos] = useState([]);
  const [clasificacionesPrincipales, setClasificacionesPrincipales] = useState([]);
  const [institutos, setInstitutos] = useState([]);
  const [carreras, setCarreras] = useState([]);
  const [adicionalRaw, setAdicionalRaw] = useState(editData?.adicional ? JSON.stringify(editData.adicional, null, 2) : '');
  const [protectedValue, setProtectedValue] = useState(editData?.protected === 1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Refs para inputs no controlados - máxima velocidad
  const inputRefs = useRef({});

  // Estados locales para inputs optimizados - usando useMemo para evitar re-creaciones
  const initialFormValues = useMemo(() => ({
    nombre: editData?.nombre || '',
    descripcion: editData?.descripcion || '',
    id_icono: editData?.id_icono || '',
    type_id: editData?.type_id || parentInfo?.type_id || '',
    parent_id: editData?.parent_id || parentInfo?.parent_id || parentId || '',
    orden: editData?.orden || '',
    permisos: editData?.adicional?.id_objeto ? editData.adicional.id_objeto.join(',') : '',
    clasificaciones: editData?.adicional?.id_clasificacion ? editData.adicional.id_clasificacion.join(',') : '',
    isMobile: editData?.adicional?.mobile || false,
    codigo: (editData?.adicional && typeof editData.adicional === 'object' && 'id' in editData.adicional) ? editData.adicional.id : '',
    costo: (editData?.adicional && typeof editData.adicional === 'object' && 'costo' in editData.adicional) ? editData.adicional.costo : ''
  }), [editData, parentInfo, parentId]);

  const [formValues, setFormValues] = useState(initialFormValues);

  // Determinar si es una clasificación principal o subclasificación
  const isMainClassification = !parentInfo && !editData?.type_id;

  // Función para obtener valores de los inputs no controlados
  const getFormValues = useCallback(() => {
    const values = { ...initialFormValues };
    
    // Obtener valores de inputs no controlados
    Object.keys(inputRefs.current).forEach(key => {
      if (inputRefs.current[key] && inputRefs.current[key].value !== undefined) {
        values[key] = inputRefs.current[key].value;
      }
    });

    // Obtener valores de selects
    const typeIdSelect = inputRefs.current.type_id;
    if (typeIdSelect) values.type_id = typeIdSelect.value;
    
    const parentIdSelect = inputRefs.current.parent_id;
    if (parentIdSelect) values.parent_id = parentIdSelect.value;

    // Obtener valores de checkboxes
    const isMobileCheckbox = inputRefs.current.isMobile;
    if (isMobileCheckbox) values.isMobile = isMobileCheckbox.checked;

    return values;
  }, [initialFormValues]);

  // Función de validación personalizada - optimizada
  const validateForm = useCallback(() => {
    const values = getFormValues();
    const newErrors = {};
    
    if (!values.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    } else if (values.nombre.length < 3) {
      newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
    }
    
    // Validar que se seleccione un programa para cursos
    if (Number(values.type_id) === CLASSIFICATION_IDS.CURSOS && !values.parent_id) {
      newErrors.parent_id = 'Debe seleccionar un programa';
    }
    
    // Validar que se seleccione un instituto para carreras
    if (Number(values.type_id) === CLASSIFICATION_IDS.CARRERAS && !values.parent_id) {
      newErrors.parent_id = 'Debe seleccionar un instituto';
    }

    // Validar que se seleccione una carrera para programas
    if (Number(values.type_id) === CLASSIFICATION_IDS.PROGRAMAS && !values.parent_id) {
      newErrors.parent_id = 'Debe seleccionar una carrera';
    }
    
    if (values.orden !== '' && (isNaN(values.orden) || parseInt(values.orden) < 0)) {
      newErrors.orden = 'El orden debe ser un número positivo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [getFormValues]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Por favor, corrige los errores en el formulario');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const formValues = getFormValues();
      console.log('Valores en submit:', formValues);
      const isCursos = Number(formValues.type_id) === CLASSIFICATION_IDS.CURSOS;
      const isCarrera = Number(formValues.type_id) === CLASSIFICATION_IDS.CARRERAS;
      const isPrograma = Number(formValues.type_id) === CLASSIFICATION_IDS.PROGRAMAS;
      let parentIdValue = null;
      if (isCursos || isCarrera || isPrograma) {
        parentIdValue = formValues.parent_id && formValues.parent_id !== '' ? Number(formValues.parent_id) : null;
      }
      const dataToSend = {
        ...formValues,
        id_icono: formValues.id_icono !== '' ? parseInt(formValues.id_icono) : null,
        type_id: formValues.type_id ? parseInt(formValues.type_id) : null,
        parent_id: parentIdValue,
        orden: formValues.orden !== '' ? parseInt(formValues.orden) : 0
      };
      console.log('Objeto enviado:', dataToSend);

      // Guardar código y costo en adicional si es curso
      if (isCursos) {
        dataToSend.adicional = {
          id: formValues.codigo || '',
          costo: formValues.costo !== '' ? Number(formValues.costo) : null
        };
      }

      // Format permissions as an object with id_objeto array and id_clasificacion array for roles
      if (Number(formValues.type_id) === CLASSIFICATION_IDS.ROLES) {
        const permisosArray = formValues.permisos ? formValues.permisos.split(',').map(p => parseInt(p.trim())) : [];
        const clasificacionesArray = formValues.clasificaciones ? formValues.clasificaciones.split(',').map(c => parseInt(c.trim())) : [];
        
        dataToSend.adicional = { 
          id_objeto: permisosArray,
          id_clasificacion: clasificacionesArray
        };
        
        console.log('Objeto adicional final:', dataToSend.adicional);
      }

      // Handle mobile field for PREFIJOS_TLF
      if (Number(formValues.type_id) === CLASSIFICATION_IDS.PREFIJOS_TLF) {
        dataToSend.adicional = { 
          mobile: formValues.isMobile 
        };
        console.log('Objeto adicional para PREFIJOS_TLF:', dataToSend.adicional);
      }

      // Si es supervisor, incluir adicional y protected
      if (isSupervisor) {
        try {
          dataToSend.adicional = adicionalRaw ? JSON.parse(adicionalRaw) : null;
        } catch {
          toast.error('El campo adicional no es un JSON válido');
          setIsSubmitting(false);
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
      setIsSubmitting(false);
    }
  };

  // Cargar datos necesarios
  useEffect(() => {
    if (isOpen) {
      const loadData = async () => {
        try {
          // Para crear clasificación principal, cargar clasificaciones principales
          if (!editData && !parentInfo?.type_id) {
            const principalesResponse = await getAllClasificaciones();
            const principales = principalesResponse.data.filter(c => c.type_id === null);
            setClasificacionesPrincipales(principales);
          }
          
          // Cargar otros datos según el tipo
          if (editData?.type_id || parentInfo?.type_id) {
            const typeId = Number(editData?.type_id || parentInfo?.type_id);
            
            if (typeId === CLASSIFICATION_IDS.ROLES) {
              const permisosResponse = await getSubclassificationsById(CLASSIFICATION_IDS.OBJETOS);
              setPermisos(permisosResponse.data.data || []);
              
              // Cargar clasificaciones principales para "Configuraciones Accesibles"
              const principalesResponse = await getAllClasificaciones();
              const principales = principalesResponse.data.filter(c => c.type_id === null);
              setClasificacionesPrincipales(principales);
            }
            
            if (typeId === CLASSIFICATION_IDS.CURSOS) {
              fetchProgramas();
            }
            
            if (typeId === CLASSIFICATION_IDS.CARRERAS) {
              const institutosResponse = await getSubclassificationsById(CLASSIFICATION_IDS.INSTITUTOS);
              setInstitutos(institutosResponse.data.data || []);
            }
            
            if (typeId === CLASSIFICATION_IDS.PROGRAMAS) {
              const carrerasResponse = await getSubclassificationsById(CLASSIFICATION_IDS.CARRERAS);
              setCarreras(carrerasResponse.data.data || []);
            }
          }
        } catch (err) {
          console.error('Error al cargar datos:', err);
          toast.error('Error al cargar los datos');
        }
      };
      
      loadData();
    }
  }, [isOpen, editData?.id_clasificacion, parentInfo?.type_id]);

  // Efecto para manejar la apertura y cierre del modal
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

      // Actualizar valores del formulario cuando se abre
      setFormValues(initialFormValues);
    } else {
      setAnimationClass('animate-modal-out');
      document.body.style.overflow = 'unset';
      const timeout = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpen, editData?.adicional, isSupervisor, editData, parentInfo, parentId, initialFormValues]);

  // Efecto para limpiar errores cuando se cierra el modal
  useEffect(() => {
    if (!isOpen) {
      clearError();
    }
  }, [isOpen, clearError]);

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
        {/* Header */}
        <div className="relative overflow-hidden p-6 border-b border-gray-100 flex-shrink-0">
          <div className="animate-shine absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent flex items-center gap-3">
              {/* Icono a la izquierda del título */}
              {(() => {
                if (editData?.nicono) {
                  return (
                    <FontAwesomeIcon
                      icon={iconos[editData.nicono] || iconos.faFile}
                      className="text-blue-600"
                      size="lg"
                    />
                  );
                } else if (parentInfo) {
                  // Buscar el nombre del icono por nicono o por id_icono en icons
                  let iconName = parentInfo.nicono;
                  if (!iconName && parentInfo.id_icono && icons && icons.length > 0) {
                    const foundIcon = icons.find(i => i.id_clasificacion === parentInfo.id_icono);
                    iconName = foundIcon?.nombre;
                  }
                  return (
                    <FontAwesomeIcon
                      icon={iconos[iconName] || iconos.faFile}
                      className="text-blue-600"
                      size="lg"
                    />
                  );
                } else {
                  return (
                    <FontAwesomeIcon
                      icon={iconos.faFile}
                      className="text-blue-600"
                      size="lg"
                    />
                  );
                }
              })()}
              {/* Título */}
              {editData ? `Editar ${editData.nombre}` : isMainClassification ? 'Crear Clasificación' : `Agregar ${parentInfo?.nombre || 'Clasificación'}`}
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full transform hover:rotate-90 duration-300"
            >
              <FontAwesomeIcon icon={faXmark} className="text-xl" />
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {[
              { 
                name: 'nombre', 
                icon: faFolder, 
                label: 'Nombre', 
                type: 'text',
                required: true
              },
              { 
                name: 'descripcion', 
                icon: faLayerGroup, 
                label: 'Descripción', 
                type: 'textarea'
              },
              { 
                name: 'id_icono', 
                icon: faFolder, 
                label: 'Ícono', 
                type: 'icon'
              },
            ].map((field) => (
              <div 
                key={field.name}
                className="mb-5"
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FontAwesomeIcon icon={field.icon} className="mr-2 text-blue-500" />
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    ref={el => inputRefs.current[field.name] = el}
                    name={field.name}
                    defaultValue={formValues[field.name] || ''}
                    placeholder={`${field.label} detallado...`}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors[field.name] 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-gray-200 focus:ring-blue-500'
                    } focus:ring-2 focus:border-transparent transition-all duration-300 hover:border-blue-300 min-h-[100px] resize-none`}
                  />
                ) : field.type === 'icon' ? (
                  <IconSelector
                    value={formValues[field.name] || ''}
                    onChange={(e) => {
                      // Para IconSelector mantenemos el estado controlado
                      setFormValues(prev => ({ ...prev, [field.name]: e.target.value }));
                    }}
                    name={field.name}
                  />
                ) : (
                  <input
                    ref={el => inputRefs.current[field.name] = el}
                    type={field.type}
                    name={field.name}
                    defaultValue={formValues[field.name] || ''}
                    placeholder={`${field.label}...`}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors[field.name] 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-gray-200 focus:ring-blue-500'
                    } focus:ring-2 focus:border-transparent transition-all duration-300 hover:border-blue-300`}
                  />
                )}
                {errors[field.name] && (
                  <div className="mt-1 text-sm text-red-600">
                    {errors[field.name]}
                  </div>
                )}
              </div>
            ))}

            {/* Campo type_id si no es una edición o si no tiene type_id */}
            {(!editData && !parentInfo?.type_id) && (
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FontAwesomeIcon icon={faFolder} className="mr-2 text-blue-500" />
                  Tipo <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  ref={el => inputRefs.current.type_id = el}
                  name="type_id"
                  defaultValue={formValues.type_id}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.type_id 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-200 focus:ring-blue-500'
                  } focus:ring-2 focus:border-transparent transition-all duration-300 hover:border-blue-300`}
                >
                  <option value="">Seleccionar tipo</option>
                  {clasificacionesPrincipales.map((c) => (
                    <option key={c.id_clasificacion} value={c.id_clasificacion}>{c.nombre}</option>
                  ))}
                </select>
                {errors.type_id && (
                  <div className="mt-1 text-sm text-red-600">
                    {errors.type_id}
                  </div>
                )}
              </div>
            )}

            {/* Campo parent_id según el tipo */}
            {(Number(parentInfo?.type_id) === CLASSIFICATION_IDS.CURSOS || Number(formValues.type_id) === CLASSIFICATION_IDS.CURSOS) && (
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FontAwesomeIcon icon={faFolder} className="mr-2 text-blue-500" />
                  Programa <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  ref={el => inputRefs.current.parent_id = el}
                  name="parent_id"
                  defaultValue={formValues.parent_id}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.parent_id 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-200 focus:ring-blue-500'
                  } focus:ring-2 focus:border-transparent transition-all duration-300 hover:border-blue-300`}
                >
                  <option value="">Seleccionar programa</option>
                  {programas.map((p) => (
                    <option key={p.id} value={p.id}>{p.nombre}</option>
                  ))}
                </select>
                {errors.parent_id && (
                  <div className="mt-1 text-sm text-red-600">
                    {errors.parent_id}
                  </div>
                )}
              </div>
            )}

            {(Number(parentInfo?.type_id) === CLASSIFICATION_IDS.CARRERAS || Number(formValues.type_id) === CLASSIFICATION_IDS.CARRERAS) && (
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FontAwesomeIcon icon={faFolder} className="mr-2 text-blue-500" />
                  Instituto <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  ref={el => inputRefs.current.parent_id = el}
                  name="parent_id"
                  defaultValue={formValues.parent_id}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.parent_id 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-200 focus:ring-blue-500'
                  } focus:ring-2 focus:border-transparent transition-all duration-300 hover:border-blue-300`}
                >
                  <option value="">Seleccionar instituto</option>
                  {institutos.map((i) => (
                    <option key={i.id} value={i.id}>{i.nombre}</option>
                  ))}
                </select>
                {errors.parent_id && (
                  <div className="mt-1 text-sm text-red-600">
                    {errors.parent_id}
                  </div>
                )}
              </div>
            )}

            {(Number(parentInfo?.type_id) === CLASSIFICATION_IDS.PROGRAMAS || Number(formValues.type_id) === CLASSIFICATION_IDS.PROGRAMAS) && (
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FontAwesomeIcon icon={faFolder} className="mr-2 text-blue-500" />
                  Carrera <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  ref={el => inputRefs.current.parent_id = el}
                  name="parent_id"
                  defaultValue={formValues.parent_id}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.parent_id 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-200 focus:ring-blue-500'
                  } focus:ring-2 focus:border-transparent transition-all duration-300 hover:border-blue-300`}
                >
                  <option value="">Seleccionar carrera</option>
                  {carreras.map((c) => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </select>
                {errors.parent_id && (
                  <div className="mt-1 text-sm text-red-600">
                    {errors.parent_id}
                  </div>
                )}
              </div>
            )}

            {/* Campos de código y costo para cursos */}
            {(Number(parentInfo?.type_id) === CLASSIFICATION_IDS.CURSOS || Number(formValues.type_id) === CLASSIFICATION_IDS.CURSOS || Number(editData?.type_id) === CLASSIFICATION_IDS.CURSOS) && (
              <>
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FontAwesomeIcon icon={faLayerGroup} className="mr-2 text-blue-500" />
                    Código
                  </label>
                  <input
                    ref={el => inputRefs.current.codigo = el}
                    type="text"
                    name="codigo"
                    defaultValue={formValues.codigo}
                    placeholder="Ingrese el código del curso"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-300"
                  />
                </div>
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FontAwesomeIcon icon={faLayerGroup} className="mr-2 text-blue-500" />
                    Costo
                  </label>
                  <input
                    ref={el => inputRefs.current.costo = el}
                    type="number"
                    name="costo"
                    defaultValue={formValues.costo}
                    placeholder="Ingrese el costo del curso"
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-300"
                  />
                </div>
              </>
            )}

            {/* Campo orden */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FontAwesomeIcon icon={faLayerGroup} className="mr-2 text-blue-500" />
                Orden
              </label>
              <input
                ref={el => inputRefs.current.orden = el}
                type="number"
                name="orden"
                defaultValue={formValues.orden}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-300 appearance-none"
              />
              {errors.orden && (
                <div className="mt-1 text-sm text-red-600">
                  {errors.orden}
                </div>
              )}
            </div>

            {/* Permisos de Objetos para roles */}
            {Number(formValues.type_id) === CLASSIFICATION_IDS.ROLES && !isMainClassification && (
              <div className="mb-5">
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
                        checked={formValues.permisos ? formValues.permisos.split(',').includes(permiso.id.toString()) : false}
                        onChange={() => {
                          const currentPermisos = formValues.permisos ? formValues.permisos.split(',').map(p => p.trim()) : [];
                          const newPermisos = currentPermisos.includes(permiso.id.toString())
                            ? currentPermisos.filter(id => id !== permiso.id.toString())
                            : [...currentPermisos, permiso.id.toString()];
                          setFormValues(prev => ({ ...prev, permisos: newPermisos.join(',') }));
                        }}
                        className="form-checkbox h-4 w-4 text-blue-600 mt-1 flex-shrink-0"
                      />
                      <span className="text-gray-700 text-sm leading-tight">
                        {permiso.nombre}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Configuraciones Accesibles para roles */}
            {Number(formValues.type_id) === CLASSIFICATION_IDS.ROLES && !isMainClassification && (
              <div className="mb-5">
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
                        checked={formValues.clasificaciones ? formValues.clasificaciones.split(',').includes(clasificacion.id_clasificacion.toString()) : false}
                        onChange={() => {
                          const currentClasificaciones = formValues.clasificaciones ? formValues.clasificaciones.split(',').map(c => c.trim()) : [];
                          const newClasificaciones = currentClasificaciones.includes(clasificacion.id_clasificacion.toString())
                            ? currentClasificaciones.filter(id => id !== clasificacion.id_clasificacion.toString())
                            : [...currentClasificaciones, clasificacion.id_clasificacion.toString()];
                          setFormValues(prev => ({ ...prev, clasificaciones: newClasificaciones.join(',') }));
                        }}
                        className="form-checkbox h-4 w-4 text-green-600 mt-1 flex-shrink-0"
                      />
                      <span className="text-gray-700 text-sm leading-tight">
                        Configuración de {clasificacion.nombre}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Campo checkbox para PREFIJOS_TLF */}
            {(Number(formValues.type_id) === CLASSIFICATION_IDS.PREFIJOS_TLF || Number(parentInfo?.type_id) === CLASSIFICATION_IDS.PREFIJOS_TLF) && (
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FontAwesomeIcon icon={faMobile} className="mr-2 text-blue-500" />
                  Tipo de Teléfono
                </label>
                <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-blue-50 cursor-pointer transition-colors duration-200">
                  <input
                    ref={el => inputRefs.current.isMobile = el}
                    type="checkbox"
                    name="isMobile"
                    defaultChecked={formValues.isMobile || false}
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <span className="text-gray-700 text-sm font-medium">
                    Es un número móvil
                  </span>
                  <span className="text-gray-500 text-xs ml-2">
                    (Marcar si es un prefijo de telefonía móvil)
                  </span>
                </div>
              </div>
            )}

            {/* SOLO SUPERVISOR: Campo JSON adicional y protected */}
            {isSupervisor && (
              <div className="mb-5 space-y-4 p-4 border-2 border-red-400 rounded-lg bg-red-50">
                <label className="block text-sm font-bold text-red-700 mb-2">JSON adicional (solo supervisor)</label>
                <textarea
                  value={adicionalRaw}
                  onChange={(e) => setAdicionalRaw(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-red-300 focus:ring-2 focus:ring-red-400 focus:border-transparent bg-white text-red-900 font-mono"
                  placeholder={'{\n  "clave": "valor"\n}'}
                />
                <div className="flex items-center space-x-3 mt-2">
                  <input
                    type="checkbox"
                    checked={protectedValue}
                    onChange={(e) => setProtectedValue(e.target.checked)}
                    className="form-checkbox h-5 w-5 text-red-600"
                  />
                  <span className="text-red-700 text-sm font-bold">Protected (solo supervisor)</span>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center space-x-2">
                <FontAwesomeIcon icon={faTimes} className="text-red-500" />
                <p>{error}</p>
              </div>
            )}

            {/* Footer */}
            <div className="border-t border-gray-100 p-6 bg-gray-50 rounded-b-2xl flex-shrink-0 mt-6">
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-lg text-gray-700 hover:text-gray-900 bg-white border border-gray-200 hover:bg-gray-50 transition-all duration-300 shadow-sm hover:shadow"
                  disabled={isSubmitting}
                >
                  <FontAwesomeIcon icon={faTimes} className="mr-2" />
                  <span>Cancelar</span>
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-sm hover:shadow-lg disabled:opacity-50"
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
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
};

// Estilos CSS simplificados
const style = document.createElement('style');
style.textContent = `
  @keyframes modalIn {
    from {
      opacity: 0;
      transform: scale(0.95) translateY(20px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  @keyframes modalOut {
    from {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
    to {
      opacity: 0;
      transform: scale(0.95) translateY(20px);
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

  .animate-modal-in {
    animation: modalIn 0.3s ease-out forwards;
  }

  .animate-modal-out {
    animation: modalOut 0.3s ease-out forwards;
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