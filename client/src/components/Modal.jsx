import React, { useEffect, useState, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import useClasificacionStore from '../store/clasificacionStore';
import { getAllClasificaciones, getAllIcons, getAllSubclasificaciones } from '../api/clasificacion.api';
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
  const [permisos, setPermisos] = useState([]);
  const [clasificacionesPrincipales, setClasificacionesPrincipales] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [institutos, setInstitutos] = useState([]);
  const [carreras, setCarreras] = useState([]);
  const [adicionalRaw, setAdicionalRaw] = useState(editData?.adicional ? JSON.stringify(editData.adicional, null, 2) : '');
  const [protectedValue, setProtectedValue] = useState(editData?.protected === 1);
  // const [setAutoCodigo] = useState(() => () => {}); // Dummy setter para mantener la función generarCodigoCurso igual
  const [formikSetFieldValue, setFormikSetFieldValue] = useState(null);
  const [formikValues, setFormikValues] = useState(null);

  // Valores iniciales del formulario
  const initialValues = {
    nombre: editData?.nombre || '',
    descripcion: editData?.descripcion || '',
    id_icono: editData?.id_icono || '',
    type_id: editData?.type_id || parentInfo?.type_id || '',
    parent_id: editData?.parent_id || parentInfo?.parent_id || parentId || '',
    orden: editData?.orden || "",
    permisos: editData?.adicional?.id_objeto ? editData.adicional.id_objeto.join(',') : '',
    clasificaciones: editData?.adicional?.id_clasificacion ? editData.adicional.id_clasificacion.join(',') : '',
    isMobile: editData?.adicional?.mobile || false,
    codigo: (editData?.adicional && typeof editData.adicional === 'object' && 'id' in editData.adicional) ? editData.adicional.id : '',
    costo: (editData?.adicional && typeof editData.adicional === 'object' && 'costo' in editData.adicional) ? editData.adicional.costo : ''
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
    if (Number(values.type_id) === CLASSIFICATION_IDS.CURSOS && !values.parent_id) {
      errors.parent_id = 'Debe seleccionar un programa';
    }
    
    // Validar que se seleccione un instituto para carreras
    if (Number(values.type_id) === CLASSIFICATION_IDS.CARRERAS && !values.parent_id) {
      errors.parent_id = 'Debe seleccionar un instituto';
    }

    // Validar que se seleccione una carrera para programas
    if (Number(values.type_id) === CLASSIFICATION_IDS.PROGRAMAS && !values.parent_id) {
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
      const isCursos = Number(values.type_id) === CLASSIFICATION_IDS.CURSOS;
      const isCarrera = Number(values.type_id) === CLASSIFICATION_IDS.CARRERAS;
      const isPrograma = Number(values.type_id) === CLASSIFICATION_IDS.PROGRAMAS;
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

      // Guardar código y costo en adicional si es curso
      if (isCursos) {
        dataToSend.adicional = {
          id: values.codigo || '',
          costo: values.costo !== '' ? Number(values.costo) : null
        };
      }

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
      if (Number(values.type_id) === CLASSIFICATION_IDS.PREFIJOS_TLF) {
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

  // Función para autogenerar el código del curso
  const generarCodigoCurso = async (parentId, setFieldValue) => {
    if (!parentId) return;
    try {
      // Obtener todos los cursos de ese programa
      const response = await getAllSubclasificaciones(CLASSIFICATION_IDS.CURSOS, parentId);
      const cursos = response.data;
      // Buscar el mayor código existente
      let maxNum = 0;
      let prefijo = 'CEP';
      // Detectar prefijo especial para Cisco
      const programa = programas.find(p => p.id === Number(parentId));
      if (programa && programa.nombre && programa.nombre.toLowerCase().includes('cisco')) {
        prefijo = 'CEP-CISCO';
      }
      cursos.forEach(curso => {
        if (curso.adicional && typeof curso.adicional === 'object' && curso.adicional.id) {
          const match = curso.adicional.id.match(/(CEP(?:-CISCO)?)-(\d+)/i);
          if (match && match[1] === prefijo) {
            const num = parseInt(match[2], 10);
            if (num > maxNum) maxNum = num;
          }
        }
      });
      const nuevoNum = (maxNum + 1).toString().padStart(2, '0');
      const nuevoCodigo = `${prefijo}-${nuevoNum}`;
      setFieldValue('codigo', nuevoCodigo);
    } catch {
      setFieldValue('codigo', '');
    }
  };

  // Definir los campos del formulario
  const formFields = [
    { name: 'nombre', icon: faFolder, label: 'Nombre', type: 'text' },
    { name: 'descripcion', icon: faLayerGroup, label: 'Descripción', type: 'textarea' },
    { name: 'id_icono', icon: faImage, label: 'Ícono', type: 'select' },
  ];

  // Agregar campo type_id si no es una edición o si no tiene type_id
  if (!editData && !parentInfo?.type_id) {
    formFields.push({
      name: 'type_id',
      icon: faFolder,
      label: 'Tipo',
      type: 'select',
      options: clasificacionesPrincipales.map(c => ({ value: c.id_clasificacion, label: c.nombre }))
    });
  }

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

  // Agregar inputs de código y costo si es para agregar o editar curso
  if (
    Number(parentInfo?.type_id) === CLASSIFICATION_IDS.CURSOS ||
    Number(initialValues.type_id) === CLASSIFICATION_IDS.CURSOS ||
    Number(editData?.type_id) === CLASSIFICATION_IDS.CURSOS
  ) {
    formFields.push({
      name: 'codigo',
      icon: faLayerGroup,
      label: 'Código',
      type: 'text',
      placeholder: 'Ingrese el código del curso'
    });
    formFields.push({
      name: 'costo',
      icon: faLayerGroup,
      label: 'Costo',
      type: 'number',
      placeholder: 'Ingrese el costo del curso',
      step: '0.01',
      min: '0'
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
            
            // Cargar clasificaciones principales siempre (necesarias para el campo type_id)
            const principalesResponse = await getAllClasificaciones();
            const principales = principalesResponse.data.filter(c => c.type_id === null);
            setClasificacionesPrincipales(principales);
            
            // Solo cargar permisos si es necesario
            if (parentInfo || editData?.type_id) {
              const permisosResponse = await getSubclassificationsById(CLASSIFICATION_IDS.OBJETOS);
              setPermisos(permisosResponse.data.data || []);
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
            
            // Cargar opciones de parent_id basadas en el type_id
            if (parentInfo?.type_id) {
              if (Number(parentInfo.type_id) === CLASSIFICATION_IDS.CURSOS) {
                // Para cursos, cargar programas que pertenezcan al instituto padre
                fetchProgramas();
              } else if (Number(parentInfo.type_id) === CLASSIFICATION_IDS.CARRERAS) {
                const institutosResponse = await getSubclassificationsById(CLASSIFICATION_IDS.INSTITUTOS);
                setInstitutos(institutosResponse.data.data || []);
              } else if (Number(parentInfo.type_id) === CLASSIFICATION_IDS.PROGRAMAS) {
                const carrerasResponse = await getSubclassificationsById(CLASSIFICATION_IDS.CARRERAS);
                setCarreras(carrerasResponse.data.data || []);
              }
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

  // useEffect para autoincrementar el código cuando cambie el programa
  useEffect(() => {
    if (
      formikSetFieldValue &&
      formikValues &&
      (Number(formikValues.type_id) === CLASSIFICATION_IDS.CURSOS || Number(parentInfo?.type_id) === CLASSIFICATION_IDS.CURSOS) &&
      formikValues.parent_id && !editData
    ) {
      generarCodigoCurso(formikValues.parent_id, formikSetFieldValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formikValues?.parent_id, formikValues?.type_id]);

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

        {/* Contenido con scroll */}
        <div className="flex-1 overflow-y-auto">
          <Formik
            initialValues={initialValues}
            validate={validateForm}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ values, errors, touched, handleChange, isSubmitting, setFieldValue }) => {
              // En vez de useEffect, actualizamos los estados en los onChange de los campos relevantes
              const customHandleChange = (e) => {
                handleChange(e);
                const { name, value } = e.target;
                if (name === 'type_id' || name === 'parent_id') {
                  setFormikSetFieldValue(() => setFieldValue);
                  setFormikValues({ ...values, [name]: value });
                }
              };
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
                        <Field
                          as="select"
                          name={field.name}
                          onChange={customHandleChange}
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
                      ) : (
                        <Field
                          type={field.type}
                          name={field.name}
                          placeholder={field.placeholder || `${field.label}...`}
                          disabled={field.disabled}
                          step={field.step}
                          min={field.min}
                          onChange={customHandleChange}
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