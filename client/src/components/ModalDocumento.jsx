import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { FaFileAlt, FaTimes, FaSave } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt } from '@fortawesome/free-solid-svg-icons';
import * as iconos from '@fortawesome/free-solid-svg-icons';
import useDocumentoStore from '../store/documentoStrore';
import { getAllSubclasificaciones } from '../api/clasificacion.api';
import { CLASSIFICATION_IDS } from '../config/classificationIds';
import { toast } from 'sonner';
import useClasificacionStore from '../store/clasificacionStore';
import { getAllCursos, asociarDocumentoACurso } from '../api/curso.api';
import { getUsuarios, asociarDocumentoAPersona } from '../api/persona.api';


const ModalDocumento = ({ isOpen, onClose, onSuccess, editData }) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [animationClass, setAnimationClass] = useState('');
  const [tipos, setTipos] = useState([]);
  const [loadingTipos, setLoadingTipos] = useState(false);
  const { parentClasifications, allClasificaciones } = useClasificacionStore();
  const [cursos, setCursos] = useState([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState('');
  const [asociarACohorte, setAsociarACohorte] = useState(false);
  const [personas, setPersonas] = useState([]);
  const [personaSeleccionada, setPersonaSeleccionada] = useState('');
  const [mostrarSelectPersona, setMostrarSelectPersona] = useState(false);

  // Usar el store Zustand
  const {
    uploadDocumento,
    updateDocumento,
    updateDocumentoWithFile
  } = useDocumentoStore();

  // Determinar si es edición
  const isEdit = !!editData;

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      document.body.style.overflow = 'hidden';
      setTimeout(() => setAnimationClass('animate-modal-in'), 10);
      // Cargar tipos de documento
      setLoadingTipos(true);
      getAllSubclasificaciones(CLASSIFICATION_IDS.DOCUMENTOS)
        .then(res => {
          setTipos(res.data);
        })
        .catch(() => setTipos([]))
        .finally(() => setLoadingTipos(false));
      // Cargar cursos
      getAllCursos()
        .then(res => setCursos(res.data?.data || []))
        .catch(() => setCursos([]));
      // Cargar personas
      getUsuarios()
        .then(res => setPersonas(res.data?.data || []))
        .catch(() => setPersonas([]));
    } else {
      setAnimationClass('animate-modal-out');
      document.body.style.overflow = 'unset';
      const timeout = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  // Valores iniciales del formulario
  const initialValues = {
    nombre: isEdit ? editData.nombre || '' : '',
    descripcion: isEdit ? editData.descripcion || '' : '',
    tipo: isEdit ? editData.id_tipo?.toString() || '' : '',
    archivo: null
  };

  // Obtener info de la clasificación de documentos (ID 100094)
  const getDocumentosClasificacionInfo = () => {
    let clasif = parentClasifications?.find(c => Number(c.id_clasificacion) === CLASSIFICATION_IDS.DOCUMENTOS);
    if (!clasif && allClasificaciones && allClasificaciones.length > 0) {
      clasif = allClasificaciones.find(c => Number(c.id_clasificacion) === CLASSIFICATION_IDS.DOCUMENTOS);
    }
    if (clasif) {
      return {
        nombre: clasif.nombre,
        icono: clasif.nicono ? iconos[clasif.nicono] : faFileAlt
      };
    }
    return null;
  };
  const documentosClasificacionInfo = getDocumentosClasificacionInfo();

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center perspective-1000">
      <div 
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-all duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`} 
        onClick={onClose}
      />
      <div className={`relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl transform transition-all duration-500 ${animationClass} flex flex-col max-h-[90vh]`}>
        {/* Header fijo */}
        <div className="relative overflow-hidden p-6 border-b border-gray-100 flex-shrink-0">
          <div className="animate-shine absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent flex items-center gap-2">
              <FaFileAlt className="text-blue-600" />
              {isEdit ? 'Editar Documento' : 'Agregar Documento'}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full transform hover:rotate-90 duration-300">
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>
        {/* Contenido con scroll */}
        <Formik
          initialValues={initialValues}
          enableReinitialize
          validate={values => {
            const errors = {};
            if (!values.nombre.trim()) {
              errors.nombre = 'El nombre es requerido';
            } else if (values.nombre.length < 3) {
              errors.nombre = 'Debe tener al menos 3 caracteres';
            }
            if (!values.tipo) {
              errors.tipo = 'Selecciona el tipo de documento';
            }
            if (!isEdit && !values.archivo) {
              errors.archivo = 'Debes seleccionar un archivo';
            }
            return errors;
          }}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            setSubmitting(true);
            try {
              const now = new Date();
              const fecha_hora = now.toISOString();
              const documentoData = {
                id_tipo: values.tipo,
                fecha_hora,
                descripcion: values.descripcion || '',
                nombre: values.nombre
              };
              let nuevoDocumento;
              if (isEdit) {
                if (values.archivo) {
                  await updateDocumentoWithFile(editData.id_documento, values.archivo, documentoData);
                } else {
                  await updateDocumento(editData.id_documento, documentoData);
                }
                // Asociar a persona si corresponde (también en edición)
                if (mostrarSelectPersona && personaSeleccionada) {
                  await asociarDocumentoAPersona(personaSeleccionada, editData.id_documento);
                }
                toast.success('Documento actualizado exitosamente');
              } else {
                nuevoDocumento = await uploadDocumento(values.archivo, documentoData);
                console.log('[FRONT] Respuesta de uploadDocumento:', nuevoDocumento);
                const idDocumento = nuevoDocumento?.data?.data?.id_documento || nuevoDocumento?.data?.id_documento || nuevoDocumento?.id_documento;
                if (!isEdit && asociarACohorte && cursoSeleccionado && idDocumento) {
                  console.log('[FRONT] Asociar documento:', idDocumento, 'al curso:', cursoSeleccionado);
                  await asociarDocumentoACurso(cursoSeleccionado, idDocumento);
                }
                if (!isEdit && mostrarSelectPersona && personaSeleccionada && idDocumento) {
                  console.log('[FRONT] Asociar documento:', idDocumento, 'a la persona:', personaSeleccionada);
                  await asociarDocumentoAPersona(personaSeleccionada, idDocumento);
                }
                toast.success('Documento subido exitosamente');
              }
              resetForm();
              onClose();
              if (onSuccess) onSuccess(mostrarSelectPersona && personaSeleccionada ? personaSeleccionada : null);
            } catch (error) {
              console.error('Error al guardar el documento:', error);
              toast.error('Error al guardar el documento');
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="transform transition-all duration-300 animate-fade-slide-up" style={{ animationDelay: '0ms' }}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FontAwesomeIcon icon={faFileAlt} className="mr-2 text-blue-500" />
                  Nombre del documento
                </label>
                <Field
                  type="text"
                  name="nombre"
                  placeholder="Ej: Manual de Usuario"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-300"
                />
                <ErrorMessage name="nombre" component="div" className="mt-1 text-sm text-red-600" />
              </div>
              <div className="transform transition-all duration-300 animate-fade-slide-up" style={{ animationDelay: '100ms' }}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FontAwesomeIcon icon={faFileAlt} className="mr-2 text-blue-500" />
                  Descripción
                </label>
                <Field
                  as="textarea"
                  name="descripcion"
                  placeholder="Breve descripción del documento..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-300 min-h-[80px] resize-none"
                />
              </div>
              <div className="transform transition-all duration-300 animate-fade-slide-up" style={{ animationDelay: '200ms' }}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FontAwesomeIcon icon={documentosClasificacionInfo ? documentosClasificacionInfo.icono : faFileAlt} className="mr-2 text-blue-500" />
                  {documentosClasificacionInfo ? documentosClasificacionInfo.nombre : 'Tipo de documento'}
                </label>
                <Field
                  as="select"
                  name="tipo"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-300 bg-white"
                  disabled={loadingTipos}
                >
                  <option value="">Seleccionar tipo</option>
                  {tipos.map(tipo => (
                    <option key={tipo.id_clasificacion} value={tipo.id_clasificacion}>{tipo.nombre}</option>
                  ))}
                </Field>
                <ErrorMessage name="tipo" component="div" className="mt-1 text-sm text-red-600" />
              </div>
              <div className="transform transition-all duration-300 animate-fade-slide-up" style={{ animationDelay: '300ms' }}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FontAwesomeIcon icon={faFileAlt} className="mr-2 text-blue-500" />
                  Archivo
                </label>
                <input
                  type="file"
                  name="archivo"
                  onChange={e => setFieldValue('archivo', e.currentTarget.files[0])}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-300 bg-white"
                />
                <ErrorMessage name="archivo" component="div" className="mt-1 text-sm text-red-600" />
              </div>
              <div className="flex items-center gap-3 mb-2">
                <input
                  type="checkbox"
                  id="asociarACohorte"
                  checked={asociarACohorte}
                  onChange={e => setAsociarACohorte(e.target.checked)}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <label htmlFor="asociarACohorte" className="text-sm font-medium text-gray-700">
                  ¿Documento para una cohorte?
                </label>
              </div>
              {asociarACohorte && (
                <div className="transform transition-all duration-300 animate-fade-slide-up" style={{ animationDelay: '400ms' }}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selecciona la cohorte
                  </label>
                  <select
                    value={cursoSeleccionado}
                    onChange={e => setCursoSeleccionado(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-300 bg-white"
                  >
                    <option value="">Seleccionar cohorte</option>
                    {/* Agrupar por codigo_cohorte */}
                    {Object.entries(
                      cursos.reduce((acc, curso) => {
                        const grupo = curso.codigo_cohorte || 'Sin cohorte';
                        if (!acc[grupo]) acc[grupo] = [];
                        acc[grupo].push(curso);
                        return acc;
                      }, {})
                    ).map(([codigoCohorte, cursosGrupo]) => (
                      <optgroup key={codigoCohorte} label={codigoCohorte}>
                        {cursosGrupo.map(curso => (
                          <option key={curso.id_curso} value={curso.id_curso}>{curso.nombre_curso}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
              )}
              {/* Checkbox para mostrar select de persona */}
              <div className="flex items-center gap-3 mb-2">
                <input
                  type="checkbox"
                  id="mostrarSelectPersona"
                  checked={mostrarSelectPersona}
                  onChange={e => setMostrarSelectPersona(e.target.checked)}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <label htmlFor="mostrarSelectPersona" className="text-sm font-medium text-gray-700">
                  ¿Documento de una persona?
                </label>
              </div>
              {/* Select de persona solo si el checkbox está activo */}
              {mostrarSelectPersona && (
                <div className="transform transition-all duration-300 animate-fade-slide-up" style={{ animationDelay: '400ms' }}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selecciona la persona
                  </label>
                  <select
                    value={personaSeleccionada}
                    onChange={e => setPersonaSeleccionada(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-300 bg-white"
                  >
                    <option value="">Seleccionar persona</option>
                    {/* Agrupar personas por rol, solo mostrar si tienen rol */}
                    {Object.entries(personas.reduce((acc, persona) => {
                      const rol = persona.rol_nombre;
                      if (!rol) return acc; // Omitir personas sin rol
                      if (!acc[rol]) acc[rol] = [];
                      acc[rol].push(persona);
                      return acc;
                    }, {})).map(([rol, personasGrupo]) => (
                      <optgroup key={rol} label={rol}>
                        {personasGrupo.map(persona => (
                          <option key={persona.id_persona} value={persona.id_persona}>
                            {persona.persona_nombre} {persona.apellido}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
              )}
              {/* Footer fijo */}
              <div className="relative overflow-hidden border-t border-gray-100 p-6 bg-gray-50 rounded-b-2xl flex-shrink-0 mt-6">
                <div className="animate-shine absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex items-center justify-center px-8 py-2.5 rounded-lg text-gray-700 hover:text-gray-900 bg-white border border-gray-200 hover:bg-gray-50 transition-all duration-300 shadow-sm hover:shadow transform hover:scale-105"
                    disabled={isSubmitting}
                  >
                    <FaTimes className="mr-2" />Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex items-center justify-center px-8 py-2.5 rounded-lg text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-sm hover:shadow-lg transform hover:scale-105 disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    <FaSave className={`mr-2 ${isSubmitting ? 'animate-spin' : ''}`} />
                    {isSubmitting ? 'Guardando...' : isEdit ? 'Editar Documento' : 'Guardar Documento' }
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
        {/* Animaciones y estilos extra */}
        <style jsx>{`
          @keyframes modal-in {
            from { opacity: 0; transform: scale(0.95) translateY(10px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
          }
          @keyframes modal-out {
            from { opacity: 1; transform: scale(1) translateY(0); }
            to { opacity: 0; transform: scale(0.95) translateY(10px); }
          }
          @keyframes shine {
            from { transform: translateX(-100%); }
            to { transform: translateX(100%); }
          }
          @keyframes fadeSlideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .perspective-1000 { perspective: 1000px; }
          .animate-modal-in { animation: modal-in 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
          .animate-modal-out { animation: modal-out 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
          .animate-shine { animation: shine 2s infinite; }
          .animate-fade-slide-up { animation: fadeSlideUp 0.5s ease-out forwards; }
        `}</style>
      </div>
    </div>,
    document.body
  );
};

export default ModalDocumento; 