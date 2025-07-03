import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Formik, Form } from 'formik';
import useClasificacionStore from '../store/clasificacionStore';
import { getAllClasificaciones } from '../api/clasificacion.api';
import { getSubclassificationsById } from '../api/auth.api';
import { CLASSIFICATION_IDS, MASK_DEFAULT } from '../config/classificationIds';
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
    createSubclasificacionSilent,
    updateClasificacionSilent,
    error, 
    clearError,
    fetchParentClasifications,
    refreshSubClasificaciones,
    getSubclasificaciones,
    allClasificaciones
  } = useClasificacionStore();

  const { isSupervisor } = useAuthStore();
  const { icons } = useIcons();

  const [shouldRender, setShouldRender] = useState(isOpen);
  const [animationClass, setAnimationClass] = useState('');
  const [permisos, setPermisos] = useState([]);
  const [clasificacionesPrincipales, setClasificacionesPrincipales] = useState([]);
  const [institutos, setInstitutos] = useState([]);
  const [carreras, setCarreras] = useState([]);
  const [programas, setProgramas] = useState([]); 
  const [adicionalRaw, setAdicionalRaw] = useState(editData?.adicional ? JSON.stringify(editData.adicional, null, 2) : '');
  const [protectedValue, setProtectedValue] = useState(editData?.protected === 1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [codigoGenerado, setCodigoGenerado] = useState('');

  // Refs para inputs de texto - máxima velocidad (no controlados)
  const inputRefs = useRef({});

  // Estados locales para inputs optimizados - usando useMemo para evitar re-creaciones
  const initialFormValues = useMemo(() => {
    if (editData) {
      return ({
        nombre: editData.nombre || '',
        descripcion: editData.descripcion || '',
        id_icono: editData.id_icono || '',
        type_id: editData.type_id || '',
        parent_id: editData.parent_id || '',
        orden: editData.orden || '',
        permisos: editData.adicional?.id_objeto ? editData.adicional.id_objeto.join(',') : '',
        clasificaciones: editData.adicional?.id_clasificacion ? editData.adicional.id_clasificacion.join(',') : '',
        isMobile: editData.adicional?.mobile || false,
        codigo: (editData.adicional && typeof editData.adicional === 'object' && 'id' in editData.adicional) ? editData.adicional.id : '',
        costo: (editData.adicional && typeof editData.adicional === 'object' && 'costo' in editData.adicional) ? editData.adicional.costo : ''
      });
    }
    // Si estamos agregando, usar SIEMPRE el type_id y parent_id que vienen de parentInfo
    let type_id = parentInfo?.type_id || '';
    let parent_id = parentInfo?.parent_id || parentId || '';
    return ({
      nombre: '',
      descripcion: '',
      id_icono: '',
      type_id,
      parent_id,
      orden: '',
      permisos: '',
      clasificaciones: '',
      isMobile: false,
      codigo: '',
      costo: ''
    });
  }, [editData, parentInfo, parentId]);

  const [formValues, setFormValues] = useState(initialFormValues);

  // Determinar si es una clasificación principal o subclasificación
  const isMainClassification = useMemo(() => {
    return !parentInfo && !editData?.type_id;
  }, [parentInfo, editData?.type_id]);

  // Función para obtener valores de los inputs - híbrida para máximo rendimiento
  const getFormValues = useCallback(() => {
    const values = { ...formValues };
    
    // Obtener valores de inputs de texto no controlados (máxima velocidad)
    Object.keys(inputRefs.current).forEach(key => {
      if (inputRefs.current[key] && inputRefs.current[key].value !== undefined) {
        values[key] = inputRefs.current[key].value;
      }
    });

    return values;
  }, [formValues]);

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

  // Función para obtener el siguiente código desde el backend
  const fetchNextCourseCode = async (mask) => {
    console.log('[GEN-COD] Llamando a fetchNextCourseCode con mask:', mask);
    if (!mask || typeof mask !== 'string' || !mask.includes('9')) {
      console.warn('[GEN-COD] Máscara inválida, no se hace petición:', mask);
      return '';
    }
    try {
      const response = await fetch(`http://localhost:3001/api/clasificaciones/next-code?mask=${encodeURIComponent(mask)}`);
      if (!response.ok) throw new Error('Error al obtener el siguiente código');
      const data = await response.json();
      console.log('[GEN-COD] Respuesta de next-code:', data);
      return data.nextCode || '';
    } catch (e) {
      console.error('[GEN-COD] Error al obtener siguiente código:', e);
      return '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Por favor, corrige los errores en el formulario');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const formValues = getFormValues();
      console.log('[FRONTEND] Valores en submit:', formValues);
      let typeIdValue = formValues.type_id ? parseInt(formValues.type_id) : null;
      let parentIdValue = formValues.parent_id && formValues.parent_id !== '' ? Number(formValues.parent_id) : null;

      // --- CAMBIO: Si estamos creando (NO editando), forzar type_id al id_clasificacion actual y parent_id a null SIEMPRE ---
      if (!editData && parentInfo && parentInfo.type_id) {
        typeIdValue = parentInfo.type_id;
        parentIdValue = parentInfo.parent_id || parentId || null;
      }
      // Si parent_id es igual a type_id, forzar parent_id a null
      if (parentIdValue === typeIdValue) {
        parentIdValue = null;
      }

      const dataToSend = {
        ...formValues,
        id_icono: formValues.id_icono !== '' ? parseInt(formValues.id_icono) : null,
        type_id: typeIdValue,
        parent_id: parentIdValue,
        orden: formValues.orden !== '' ? parseInt(formValues.orden) : 0
      };
      // LOGS DETALLADOS PARA DEPURACIÓN
      console.log('[FRONTEND] Enviando datos para crear:', dataToSend);
      console.log('[FRONTEND] parentInfo recibido:', parentInfo);
      console.log('[FRONTEND] parent_id usado:', dataToSend.parent_id);
      console.log('[FRONTEND] type_id usado:', dataToSend.type_id);
      // FIN LOGS
      console.log('Objeto enviado:', dataToSend);
      console.log('Depuración adicional (typeof):', typeof dataToSend.adicional);
      console.log('Depuración adicional (valor):', dataToSend.adicional);
      try {
        console.log('Depuración adicional (JSON.stringify):', JSON.stringify(dataToSend.adicional));
      } catch (e) {
        console.log('No se pudo serializar adicional:', e);
      }

      // Guardar código y costo en adicional si es curso
      if (Number(dataToSend.type_id) === CLASSIFICATION_IDS.CURSOS) {
        const codigoFinal = dataToSend.codigo || codigoGenerado || '';
        console.log('Código final a guardar:', codigoFinal);
        console.log('Costo a guardar:', dataToSend.costo);
        
        dataToSend.adicional = {
          id: codigoFinal,
          costo: dataToSend.costo !== '' ? Number(dataToSend.costo) : null
        };
        
        console.log('Objeto adicional final para curso:', dataToSend.adicional);
      }

      // Format permissions as an object with id_objeto array and id_clasificacion array for roles
      if (Number(dataToSend.type_id) === CLASSIFICATION_IDS.ROLES) {
        const permisosArray = dataToSend.permisos ? dataToSend.permisos.split(',').map(p => parseInt(p.trim())) : [];
        const clasificacionesArray = dataToSend.clasificaciones ? dataToSend.clasificaciones.split(',').map(c => parseInt(c.trim())) : [];
        
        dataToSend.adicional = { 
          id_objeto: permisosArray,
          id_clasificacion: clasificacionesArray
        };
        
        console.log('Objeto adicional final:', dataToSend.adicional);
      }

      // Handle mobile field for PREFIJOS_TLF
      if (Number(dataToSend.type_id) === CLASSIFICATION_IDS.PREFIJOS_TLF) {
        dataToSend.adicional = { 
          mobile: dataToSend.isMobile 
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

      // Guardar máscara en adicional si corresponde (Instituto, Carrera, Programa, pero NO curso)
      if ((Number(dataToSend.type_id) === CLASSIFICATION_IDS.CARRERAS || Number(dataToSend.type_id) === CLASSIFICATION_IDS.PROGRAMAS) && Number(dataToSend.type_id) !== CLASSIFICATION_IDS.CURSOS) {
        let adicionalObj = {};
        // Si ya hay un objeto adicional, lo fusionamos
        if (dataToSend.adicional && typeof dataToSend.adicional === 'object') {
          adicionalObj = { ...dataToSend.adicional };
        }
        // Si es supervisor y hay JSON en adicionalRaw, fusionar
        if (isSupervisor && adicionalRaw) {
          try {
            adicionalObj = { ...adicionalObj, ...JSON.parse(adicionalRaw) };
          } catch {
            toast.error('El campo adicional no es un JSON válido');
            setIsSubmitting(false);
            return;
          }
        }
        // Agregar/actualizar la clave mask
        if (maskValue) {
          adicionalObj.mask = maskValue;
        }
        dataToSend.adicional = Object.keys(adicionalObj).length > 0 ? adicionalObj : null;
      }

      if (editData) {
        await updateClasificacionSilent(editData.id_clasificacion, dataToSend);
        toast.success(`Clasificación "${dataToSend.nombre}" actualizada correctamente`);
      } else {
        if (isMainClassification) {
          await createClasificacion(dataToSend);
        } else {
          await createSubclasificacionSilent(dataToSend);
        }
        const message = isMainClassification 
          ? `Clasificación principal "${dataToSend.nombre}" creada correctamente`
          : `Subclasificación "${dataToSend.nombre}" creada correctamente`;
        toast.success(message);
      }

      handleClose();
      
      // Solo actualizar las clasificaciones principales si es una clasificación principal
      if (isMainClassification) {
        await fetchParentClasifications();
      } else if (dataToSend.type_id) {
        // Si es una subclasificación, actualizar todas las subclasificaciones del mismo type_id
        // sin filtrar por parent_id para mostrar todas las subclasificaciones del tipo
        await refreshSubClasificaciones(dataToSend.type_id, null);
      }
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

          // Cargar opciones de padre según el tipo a crear
          const typeId = Number(editData?.type_id || formValues.type_id);
          if (typeId === CLASSIFICATION_IDS.CARRERAS) {
            // Carrera: cargar institutos
            const institutosResponse = await getSubclassificationsById(CLASSIFICATION_IDS.INSTITUTOS);
            console.log('[GEN-COD-LOAD] Institutos cargados:', institutosResponse.data.data, 'parent_id esperado:', formValues.parent_id || parentInfo?.parent_id);
            setInstitutos(institutosResponse.data.data || []);
          }
          if (typeId === CLASSIFICATION_IDS.PROGRAMAS) {
            // Programa: cargar carreras
            const carrerasResponse = await getSubclassificationsById(CLASSIFICATION_IDS.CARRERAS);
            console.log('[GEN-COD-LOAD] Carreras cargadas:', carrerasResponse.data.data, 'parent_id esperado:', formValues.parent_id || parentInfo?.parent_id);
            setCarreras(carrerasResponse.data.data || []);
          }
          if (typeId === CLASSIFICATION_IDS.CURSOS) {
            // Curso: cargar programas
            const programasResponse = await getSubclassificationsById(CLASSIFICATION_IDS.PROGRAMAS);
            console.log('[GEN-COD-LOAD] Programas cargados:', programasResponse.data.data, 'parent_id esperado:', formValues.parent_id || parentInfo?.parent_id);
            setProgramas(programasResponse.data.data || []);

            let idCarrera = null;
            // // Si parentInfo es un PROGRAMA, su parent_id es la carrera
            // if (parentInfo && Number(parentInfo.type_id) === CLASSIFICATION_IDS.PROGRAMAS && parentInfo.parent_id) {
            //   idCarrera = parentInfo.parent_id;
            // }
            // // Si parentInfo es una CARRERA
            // else if (parentInfo && Number(parentInfo.type_id) === CLASSIFICATION_IDS.CARRERAS && parentInfo.id_clasificacion) {
            //   idCarrera = parentInfo.id_clasificacion;
            // }
            // // Si parentInfo es un CURSO, buscar la jerarquía ascendente para encontrar la carrera
            // else if (parentInfo && Number(parentInfo.type_id) === CLASSIFICATION_IDS.CURSOS && parentInfo.id_clasificacion) {
            //   // Buscar la jerarquía ascendente para encontrar la carrera
            //   try {
            //     if (useClasificacionStore.getState().getParentHierarchy) {
            //       const jerarquia = await useClasificacionStore.getState().getParentHierarchy(parentInfo.id_clasificacion);
            //       const carrera = jerarquia.find(j => Number(j.type_id) === CLASSIFICATION_IDS.CARRERAS);
            //       if (carrera) {
            //         idCarrera = carrera.id_clasificacion;
            //       }
            //     }
            //   } catch (e) {
            //     console.error('[GEN-COD-LOAD] Error obteniendo jerarquía ascendente para curso:', e);
            //   }
            // }
            // Fallbacks
            // else if (parentInfo && parentInfo.parent_id) {
            //   idCarrera = parentInfo.parent_id;
            // } else if (editData && editData.parent_id) {
            //   idCarrera = editData.parent_id;
            // }
            console.log('[GEN-COD-LOAD] idCarrera para cargar programas:', idCarrera);
            if (idCarrera) {
              const programasResponse = await getSubclasificaciones(CLASSIFICATION_IDS.PROGRAMAS, idCarrera);
              console.log('[GEN-COD-LOAD] Programas hijos de la carrera:', programasResponse.data);
            } else {
              // Fallback: cargar todos los programas raíz
              const programasResponse = await getSubclasificaciones(CLASSIFICATION_IDS.PROGRAMAS, null);
              console.log('[GEN-COD-LOAD] Fallback: todos los programas raíz:', programasResponse.data);
            }
          }
          
          // Cargar programas también cuando estamos en la vista de cursos directamente (parentInfo.type_id === CURSOS)
          if (Number(parentInfo?.type_id) === CLASSIFICATION_IDS.CURSOS && !editData) {
            // Curso: cargar programas
            const programasResponse = await getSubclassificationsById(CLASSIFICATION_IDS.PROGRAMAS);
            console.log('[GEN-COD-LOAD] Programas cargados para vista de cursos:', programasResponse.data.data);
            setProgramas(programasResponse.data.data || []);
          }

          // Roles y otros tipos especiales
          if (typeId === CLASSIFICATION_IDS.ROLES) {
            const permisosResponse = await getSubclassificationsById(CLASSIFICATION_IDS.OBJETOS);
            setPermisos(permisosResponse.data.data || []);
            const principalesResponse = await getAllClasificaciones();
            const principales = principalesResponse.data.filter(c => c.type_id === null);
            setClasificacionesPrincipales(principales);
          }
        } catch (err) {
          console.error('Error al cargar datos:', err);
          toast.error('Error al cargar los datos');
        }
      };
      loadData();
    }
  }, [isOpen, editData, formValues.type_id, formValues.parent_id, parentInfo?.type_id, parentInfo?.parent_id]);

  // Precarga el parent_id desde el contexto de navegación si no está seteado
  useEffect(() => {
    if (isOpen && !editData && parentInfo?.parent_id && !formValues.parent_id) {
      setFormValues(prev => ({ ...prev, parent_id: parentInfo.parent_id }));
    }
  }, [isOpen, editData, parentInfo?.parent_id, formValues.parent_id]);

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
  }, [isOpen, isSupervisor]);

  // Efecto separado para actualizar valores del formulario cuando cambian los datos de edición
  useEffect(() => {
    if (isOpen && editData) {
      setFormValues(initialFormValues);
      if (isSupervisor) {
        setAdicionalRaw(editData?.adicional ? JSON.stringify(editData.adicional, null, 2) : '');
        setProtectedValue(editData?.protected === 1);
      }
    }
  }, [editData?.id_clasificacion, isOpen, isSupervisor, initialFormValues]);

  // Efecto para limpiar errores cuando se cierra el modal
  useEffect(() => {
    if (!isOpen) {
      clearError();
    }
  }, [isOpen, clearError]);

  // Efecto para generar código automático cuando se seleccione el programa o al abrir el modal para agregar un curso
  useEffect(() => {
    const generarCodigo = async () => {
      const isCursoNuevo = Number(formValues.type_id) === CLASSIFICATION_IDS.CURSOS && !editData;
      if ((formValues.parent_id || parentInfo?.parent_id) && isCursoNuevo) {
        // Determinar la máscara a usar (de la jerarquía o MASK_DEFAULT)
        let mask = '';
        if (useClasificacionStore.getState().getParentHierarchy && formValues.parent_id) {
          const parentHierarchy = await useClasificacionStore.getState().getParentHierarchy(formValues.parent_id);
          for (const parent of parentHierarchy) {
            if (parent.adicional && typeof parent.adicional === 'object' && parent.adicional.mask) {
              mask = parent.adicional.mask;
              break;
            }
          }
        }
        if (!mask) mask = MASK_DEFAULT;
        console.log('[GEN-COD] Máscara final usada para next-code:', mask);
        // Llamar al backend para obtener el siguiente código
        const codigo = await fetchNextCourseCode(mask);
        console.log('[GEN-COD] Código sugerido recibido:', codigo);
        if (codigo) {
          setCodigoGenerado(codigo);
          setFormValues(prev => ({ ...prev, codigo }));
          if (inputRefs.current['codigo']) {
            inputRefs.current['codigo'].value = codigo;
          }
        }
      } else {
        console.log('[GEN-COD] No se genera código automático: parent_id o isCursoNuevo no cumplen condición.', formValues.parent_id, isCursoNuevo);
      }
    };
    generarCodigo();
  }, [formValues.parent_id, formValues.type_id, parentInfo?.parent_id, editData]);

  // Memoizar la función onClose para evitar re-renders
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // Obtener info de la clasificación de iconos (ID 27) buscando en ambas fuentes
  const getIconosClasificacionInfo = () => {
    let clasif = clasificacionesPrincipales.find(c => Number(c.id_clasificacion) === CLASSIFICATION_IDS.ICONOS);
    if (!clasif && allClasificaciones && allClasificaciones.length > 0) {
      clasif = allClasificaciones.find(c => Number(c.id_clasificacion) === CLASSIFICATION_IDS.ICONOS);
    }
    if (clasif) {
      return {
        nombre: clasif.nombre,
        icono: clasif.nicono ? iconos[clasif.nicono] : faFolder
      };
    }
    return null;
  };
  const iconosClasificacionInfo = getIconosClasificacionInfo();

  // Obtener info de la clasificación de institutos (ID 200) buscando en ambas fuentes
  const getInstitutosClasificacionInfo = () => {
    let clasif = clasificacionesPrincipales.find(c => Number(c.id_clasificacion) === CLASSIFICATION_IDS.INSTITUTOS);
    if (!clasif && allClasificaciones && allClasificaciones.length > 0) {
      clasif = allClasificaciones.find(c => Number(c.id_clasificacion) === CLASSIFICATION_IDS.INSTITUTOS);
    }
    if (clasif) {
      return {
        nombre: clasif.nombre,
        icono: clasif.nicono ? iconos[clasif.nicono] : faFolder
      };
    }
    return null;
  };
  const institutosClasificacionInfo = getInstitutosClasificacionInfo();

  // Obtener info de la clasificación de carreras (ID 110) buscando en ambas fuentes
  const getCarrerasClasificacionInfo = () => {
    let clasif = clasificacionesPrincipales.find(c => Number(c.id_clasificacion) === CLASSIFICATION_IDS.CARRERAS);
    if (!clasif && allClasificaciones && allClasificaciones.length > 0) {
      clasif = allClasificaciones.find(c => Number(c.id_clasificacion) === CLASSIFICATION_IDS.CARRERAS);
    }
    if (clasif) {
      return {
        nombre: clasif.nombre,
        icono: clasif.nicono ? iconos[clasif.nicono] : faFolder
      };
    }
    return null;
  };
  const carrerasClasificacionInfo = getCarrerasClasificacionInfo();

  // Obtener info de la clasificación de programas (ID 4) buscando en ambas fuentes
  const getProgramasClasificacionInfo = () => {
    let clasif = clasificacionesPrincipales.find(c => Number(c.id_clasificacion) === CLASSIFICATION_IDS.PROGRAMAS);
    if (!clasif && allClasificaciones && allClasificaciones.length > 0) {
      clasif = allClasificaciones.find(c => Number(c.id_clasificacion) === CLASSIFICATION_IDS.PROGRAMAS);
    }
    if (clasif) {
      return {
        nombre: clasif.nombre,
        icono: clasif.nicono ? iconos[clasif.nicono] : faFolder
      };
    }
    return null;
  };
  const programasClasificacionInfo = getProgramasClasificacionInfo();

  // Obtener info de la clasificación de objetos (ID 73) buscando en ambas fuentes
  const getObjetosClasificacionInfo = () => {
    let clasif = clasificacionesPrincipales.find(c => Number(c.id_clasificacion) === CLASSIFICATION_IDS.OBJETOS);
    if (!clasif && allClasificaciones && allClasificaciones.length > 0) {
      clasif = allClasificaciones.find(c => Number(c.id_clasificacion) === CLASSIFICATION_IDS.OBJETOS);
    }
    if (clasif) {
      return {
        nombre: clasif.nombre,
        icono: clasif.nicono ? iconos[clasif.nicono] : faFolder
      };
    }
    return null;
  };
  const objetosClasificacionInfo = getObjetosClasificacionInfo();

  // Refuerzo: calcular el tipo de hijo a crear usando el type_id del formulario
  let isInstituto = Number(formValues.type_id) === CLASSIFICATION_IDS.INSTITUTOS;
  let isCarrera = Number(formValues.type_id) === CLASSIFICATION_IDS.CARRERAS;
  let isPrograma = Number(formValues.type_id) === CLASSIFICATION_IDS.PROGRAMAS;
  let isCurso = Number(formValues.type_id) === CLASSIFICATION_IDS.CURSOS;

  // Refuerzo: si el parentInfo es un Instituto y estamos agregando, forzar isCarrera true
  if (!editData && parentInfo && parentInfo.type_id === CLASSIFICATION_IDS.INSTITUTOS) {
    if (Number(formValues.type_id) === parentInfo.type_id) {
      // Si el type_id es igual al del instituto, forzar Carrera
      isCarrera = true;
    }
  }
  // Si el parentInfo es una Carrera y estamos agregando, forzar isPrograma true
  if (!editData && parentInfo && parentInfo.type_id === CLASSIFICATION_IDS.CARRERAS) {
    if (Number(formValues.type_id) === parentInfo.type_id) {
      isPrograma = true;
    }
  }

  // Estado local para la máscara
  const [maskValue, setMaskValue] = useState(() => {
    // Si estamos editando y hay mask en adicional, lo precargamos
    if (editData?.adicional && typeof editData.adicional === 'object' && editData.adicional.mask) {
      return editData.adicional.mask;
    }
    return '';
  });

  // Actualizar maskValue si cambia editData
  useEffect(() => {
    if (editData?.adicional && typeof editData.adicional === 'object' && editData.adicional.mask) {
      setMaskValue(editData.adicional.mask);
    } else {
      setMaskValue('');
    }
  }, [editData]);

  // Refuerzo tipoPadre para ocultar select si es Instituto o si type_id es vacío/nulo
  const tipoPadre = useMemo(() => {
    if (!parentInfo?.type_id) return null;
    if (Number(parentInfo.type_id) === CLASSIFICATION_IDS.INSTITUTOS) return 'instituto';
    if (Number(parentInfo.type_id) === CLASSIFICATION_IDS.CARRERAS) return 'carrera';
    if (Number(parentInfo.type_id) === CLASSIFICATION_IDS.PROGRAMAS) return 'programa';
    if (Number(parentInfo.type_id) === CLASSIFICATION_IDS.CURSOS) return 'programa'; // Para cursos, mostrar select de programas
    return null;
  }, [parentInfo?.type_id]);

  const opcionesPadre = useMemo(() => {
    if (Number(parentInfo?.type_id) === CLASSIFICATION_IDS.INSTITUTOS) return institutos;
    if (Number(parentInfo?.type_id) === CLASSIFICATION_IDS.CARRERAS) return carreras;
    if (Number(parentInfo?.type_id) === CLASSIFICATION_IDS.PROGRAMAS) return programas;
    if (Number(parentInfo?.type_id) === CLASSIFICATION_IDS.CURSOS) return programas; // Para cursos, mostrar programas
    return [];
  }, [parentInfo?.type_id, institutos, carreras, programas]);

  if (!shouldRender) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center perspective-1000">
      <div 
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-all duration-500 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`} 
        onClick={handleClose}
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
              onClick={handleClose}
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
                icon: iconosClasificacionInfo ? iconosClasificacionInfo.icono : faFolder, 
                label: iconosClasificacionInfo ? iconosClasificacionInfo.nombre : 'Ícono', 
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
                    onBlur={(e) => {
                      if (field.name === 'descripcion') {
                        setFormValues(prev => ({ ...prev, descripcion: e.target.value }));
                      }
                    }}
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
                    onBlur={(e) => {
                      if (field.name === 'nombre') {
                        setFormValues(prev => ({ ...prev, nombre: e.target.value }));
                      }
                    }}
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
                  name="type_id"
                  value={formValues.type_id}
                  onChange={(e) => setFormValues(prev => ({ ...prev, type_id: e.target.value }))}
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
            {tipoPadre && (
              console.log('[GEN-COD-RENDER] Opciones padre:', opcionesPadre, 'parent_id seleccionado:', formValues.parent_id),
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FontAwesomeIcon icon={faFolder} className="mr-2 text-blue-500" />
                  {tipoPadre === 'instituto' && (institutosClasificacionInfo ? institutosClasificacionInfo.nombre : 'Instituto')}
                  {tipoPadre === 'carrera' && (carrerasClasificacionInfo ? carrerasClasificacionInfo.nombre : 'Carrera')}
                  {tipoPadre === 'programa' && (programasClasificacionInfo ? programasClasificacionInfo.nombre : 'Programa')}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  name="parent_id"
                  value={formValues.parent_id}
                  onChange={e => setFormValues(prev => ({ ...prev, parent_id: e.target.value }))}
                  className={`w-full px-4 py-3 rounded-lg border ${errors.parent_id ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'} focus:ring-2 focus:border-transparent transition-all duration-300 hover:border-blue-300`}
                >
                  <option value="">Seleccionar {tipoPadre}</option>
                  {opcionesPadre.map((op) => (
                    <option key={op.id} value={op.id}>{op.nombre}</option>
                  ))}
                </select>
                {errors.parent_id && (
                  <div className="mt-1 text-sm text-red-600">
                    {errors.parent_id}
                  </div>
                )}
              </div>
            )}

            {/* Mostrar los campos de código y costo SIEMPRE que sea curso (crear o editar) */}
            {isCurso && (
              <>
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FontAwesomeIcon icon={faLayerGroup} className="mr-2 text-blue-500" />
                    Código
                  </label>
                  <input
                    ref={el => inputRefs.current['codigo'] = el}
                    type="text"
                    name="codigo"
                    value={editData ? formValues.codigo : codigoGenerado || formValues.codigo}
                    onChange={(e) => setFormValues(prev => ({ ...prev, codigo: e.target.value }))}
                    placeholder="Código generado automáticamente"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      !editData && codigoGenerado 
                        ? 'border-green-300 bg-green-50 focus:ring-green-500' 
                        : 'border-gray-200 focus:ring-blue-500'
                    } focus:ring-2 focus:border-transparent transition-all duration-300 hover:border-blue-300`}
                  />
                  {!editData && codigoGenerado && (
                    <p className="mt-1 text-sm text-green-600 flex items-center">
                      <span className="mr-2">✓</span>
                      Código generado automáticamente
                    </p>
                  )}
                </div>
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FontAwesomeIcon icon={faLayerGroup} className="mr-2 text-blue-500" />
                    Costo
                  </label>
                  <input
                    ref={el => inputRefs.current['costo'] = el}
                    type="number"
                    name="costo"
                    value={editData ? formValues.costo : formValues.costo || ''}
                    onChange={(e) => setFormValues(prev => ({ ...prev, costo: e.target.value }))}
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
                ref={el => inputRefs.current['orden'] = el}
                type="number"
                name="orden"
                defaultValue={formValues.orden}
                onBlur={(e) => setFormValues(prev => ({ ...prev, orden: e.target.value }))}
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
                  <FontAwesomeIcon icon={objetosClasificacionInfo ? objetosClasificacionInfo.icono : faLayerGroup} className="mr-2 text-blue-500" />
                  {objetosClasificacionInfo ? objetosClasificacionInfo.nombre : 'Permisos de Objetos'}
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
                          type="checkbox"
                          name="isMobile"
                    checked={formValues.isMobile || false}
                    onChange={(e) => setFormValues(prev => ({ ...prev, isMobile: e.target.checked }))}
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

            {/* Mostrar el input de máscara solo si es Instituto, Carrera o Programa y NO es curso */}
            {(isInstituto || isCarrera || isPrograma) && !isCurso && (
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FontAwesomeIcon icon={faLayerGroup} className="mr-2 text-blue-500" />
                  Máscara
                </label>
                <input
                  type="text"
                  name="mask"
                  value={maskValue}
                  onChange={e => setMaskValue(e.target.value)}
                  placeholder="Ej: CEP-9999, IUSF-INF-99, CEP-CISCO-999"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-300"
                />
                <p className="mt-1 text-xs text-gray-500">Máscara de generación automática de Códigos. Usar: 999 para indicar dígitos consecutivos.</p>
              </div>
            )}

            {/* Footer */}
            <div className="border-t border-gray-100 p-6 bg-gray-50 rounded-b-2xl flex-shrink-0 mt-6">
                    <div className="flex justify-end space-x-4">
                      <button
                        type="button"
                        onClick={handleClose}
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