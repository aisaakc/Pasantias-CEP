import React, { useState, useEffect } from 'react';
import { useCursoStore } from '../store/cursoStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark,
        faSave,
        faTimes,
        faBook,
        faChalkboardTeacher, 
        faCheckCircle, 
        faHashtag, 
        faClock, 
        faMoneyBill, 
        faCalendarAlt, 
        faAlignLeft, 
        faPalette,
        faUser,
        faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import * as iconos from '@fortawesome/free-solid-svg-icons';
import { toast } from 'sonner';
import { Editor } from '@tinymce/tinymce-react';

function ModalFecha({ fecha, curso, onClose=  [], onCursoSaved, feriados }) {
  const { modalidades, cursos, status, fetchOpcionesCurso, createCurso, updateCurso, loading, error, roles_facilitador, fetchFacilitadores, resetState } = useCursoStore();
  const [cursoSeleccionado, setCursoSeleccionado] = useState('');
  const [modalidadSeleccionada, setModalidadSeleccionada] = useState('');
  const [statusSeleccionado, setStatusSeleccionado] = useState('');
  const [facilitadorSeleccionado, setFacilitadorSeleccionado] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [descripcionHtml, setDescripcionHtml] = useState('');
  const [duracion, setDuracion] = useState('');
  const [codigo, setCodigo] = useState('');
  const [costo, setCosto] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [color, setColor] = useState('#4F46E5');
  const [animationClass, setAnimationClass] = useState('animate-modal-in');
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [holidayWarning, setHolidayWarning] = useState('');
  const [codigoCohorte, setCodigoCohorte] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsDataLoaded(false);
        console.log('Iniciando carga de datos del modal...');
        
        // Resetear el estado para asegurar datos frescos
        resetState();
        
        await Promise.all([
          fetchOpcionesCurso(),
          fetchFacilitadores()
        ]);
        console.log('Datos cargados exitosamente');
        setIsDataLoaded(true);
      } catch (error) {
        console.error('Error al cargar las opciones:', error);
        toast.error('Error al cargar las opciones del curso');
        setIsDataLoaded(true); // Marcar como cargado para evitar loops infinitos
      }
    }; 
    loadData();
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [fetchOpcionesCurso, fetchFacilitadores, resetState]);

  // Debug: Monitorear cuando los datos están disponibles
  useEffect(() => {
    if (isDataLoaded) {
      console.log('Estado de datos cargados:', {
        cursos: cursos?.length || 0,
        modalidades: modalidades?.length || 0,
        status: status?.length || 0,
        facilitadores: roles_facilitador?.length || 0
      });
    }
  }, [isDataLoaded, cursos, modalidades, status, roles_facilitador]);

  // Efecto para cargar datos del curso cuando se está editando
  useEffect(() => {
    if (curso && isDataLoaded) {
      setCursoSeleccionado(curso.id_nombre?.toString() || '');
      setModalidadSeleccionada(curso.id_modalidad?.toString() || '');
      setStatusSeleccionado(curso.id_status?.toString() || '');
      setFacilitadorSeleccionado(curso.id_facilitador?.toString() || '');
      setDescripcion(curso.descripcion_corto || '');
      setDescripcionHtml(curso.descripcion_html || '');
      setDuracion(curso.duracion?.toString() || '');
      setCodigo(curso.codigo || '');
      setCosto(curso.costo?.toString() || '');
      
      const fechaInicio = curso.fecha_hora_inicio ? new Date(curso.fecha_hora_inicio) : new Date(fecha);
      const fechaFin = curso.fecha_hora_fin ? new Date(curso.fecha_hora_fin) : new Date(fecha);

      // Formatear a YYYY-MM-DDTHH:mm para el input
      const pad = (num) => num.toString().padStart(2, '0');
      const formatForInput = (date) => 
        `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;

      setFechaInicio(formatForInput(fechaInicio));
      setFechaFin(formatForInput(fechaFin));
      
      setColor(curso.color || '#4F46E5');
    } else if (fecha && isDataLoaded) {
      // Asegurarnos de que fecha sea un objeto Date válido
      const fechaObj = new Date(fecha);
      
      if (isNaN(fechaObj.getTime())) {
        console.error('Fecha inválida:', fecha);
        return;
      }
      
      // Extraer los componentes de la fecha
      const year = fechaObj.getFullYear();
      const month = String(fechaObj.getMonth() + 1).padStart(2, '0');
      const day = String(fechaObj.getDate()).padStart(2, '0');
      
      // Crear la fecha formateada con hora 13:00
      const fechaFormateada = `${year}-${month}-${day}T13:00`;
      setFechaInicio(fechaFormateada);
      setFechaFin('');
    }
  }, [curso, fecha, isDataLoaded]);

  useEffect(() => {
    if (!fechaInicio || !feriados || feriados.length === 0) {
      setHolidayWarning('');
      return;
    }

    const start = new Date(fechaInicio);
    const end = fechaFin ? new Date(fechaFin) : null;

    // Validar que las fechas sean válidas
    if (isNaN(start.getTime()) || (end && isNaN(end.getTime()))) {
      setHolidayWarning('');
      return;
    }

    // Verificar si la fecha de fin es previa a la fecha de inicio
    if (end && start >= end) {
      setHolidayWarning('⚠️ Error: La fecha y hora de fin debe ser posterior a la fecha y hora de inicio.');
      return;
    }

    // Si no hay fecha de fin, no mostrar alerta de feriados
    if (!end) {
      setHolidayWarning('');
      return;
    }

    const holidaysInRange = [];

    const getDayOnly = (date) => {
      const newDate = new Date(date);
      newDate.setHours(0, 0, 0, 0);
      return newDate;
    };

    const startDate = getDayOnly(start);
    const endDate = getDayOnly(end);

    feriados.forEach(feriado => {
      if (feriado && feriado.descripcion) {
        const fechas = feriado.descripcion.split(',').map(f => f.trim());
        
        fechas.forEach(fechaStr => {
          const parts = fechaStr.split('/');
          if (parts.length < 2) return;

          const day = parseInt(parts[0], 10);
          const month = parseInt(parts[1], 10) - 1;

          if (parts.length === 3) {
            const year = 2000 + parseInt(parts[2], 10);
            const holidayDate = new Date(year, month, day);
            if (!isNaN(holidayDate.getTime())) {
              const holidayDayOnly = getDayOnly(holidayDate);
              if (holidayDayOnly >= startDate && holidayDayOnly <= endDate) {
                holidaysInRange.push({ name: feriado.nombre, date: holidayDate });
              }
            }
          } else {
            for (let year = startDate.getFullYear(); year <= endDate.getFullYear(); year++) {
              const holidayDate = new Date(year, month, day);
              if (!isNaN(holidayDate.getTime())) {
                const holidayDayOnly = getDayOnly(holidayDate);
                if (holidayDayOnly >= startDate && holidayDayOnly <= endDate) {
                  holidaysInRange.push({ name: feriado.nombre, date: holidayDate });
                }
              }
            }
          }
        });
      }
    });

    const uniqueHolidays = holidaysInRange.reduce((acc, current) => {
      if (!acc.find(item => item.date.getTime() === current.date.getTime())) {
        acc.push(current);
      }
      return acc;
    }, []).sort((a, b) => a.date - b.date);

    if (uniqueHolidays.length > 0) {
      const holidayNames = uniqueHolidays
        .map(h => `${h.name} (${h.date.toLocaleDateString('es-ES', { day: '2-digit', month: 'long' })})`)
        .join(', ');
      setHolidayWarning(`⚠️ Atención: El período seleccionado incluye los siguientes feriados: ${holidayNames}.`);
    } else {
      setHolidayWarning('');
    }
  }, [fechaInicio, fechaFin, feriados]);

  const handleClose = () => {
    setAnimationClass('animate-modal-out');
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 transform transition-all animate-scaleIn shadow-2xl">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
              <FontAwesomeIcon icon={faTimes} className="text-2xl text-red-500" />
            </div>
            <p className="text-red-500 text-lg mb-4">{error}</p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-all duration-300 hover:shadow-md"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      // Validaciones básicas
      if (!cursoSeleccionado || !modalidadSeleccionada || !statusSeleccionado) {
        setSubmitError('Por favor complete todos los campos requeridos (curso, modalidad y estado)');
        setIsSubmitting(false);
        return;
      }

      if (!fechaInicio) {
        setSubmitError('La fecha de inicio es requerida');
        setIsSubmitting(false);
        return;
      }

      // Validar que los valores sean números válidos
      const cursoId = parseInt(cursoSeleccionado);
      const modalidadId = parseInt(modalidadSeleccionada);
      const statusId = parseInt(statusSeleccionado);

      if (isNaN(cursoId) || isNaN(modalidadId) || isNaN(statusId)) {
        setSubmitError('Los IDs seleccionados no son válidos');
        setIsSubmitting(false);
        return;
      }

      // Validar duración si se proporciona
      let duracionValue = null;
      if (duracion) {
        duracionValue = parseInt(duracion);
        if (isNaN(duracionValue) || duracionValue < 0) {
          setSubmitError('La duración debe ser un número positivo');
          setIsSubmitting(false);
          return;
        }
      }

      // Validar costo si se proporciona
      let costoValue = null;
      if (costo) {
        costoValue = parseFloat(costo);
        if (isNaN(costoValue) || costoValue < 0) {
          setSubmitError('El costo debe ser un número positivo');
          setIsSubmitting(false);
          return;
        }
      }

      // Validar fechas si se proporciona fecha fin
      if (fechaFin) {
        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);
        if (inicio >= fin) {
          setSubmitError('La fecha de inicio debe ser anterior a la fecha de fin');
          setIsSubmitting(false);
          return;
        }
      }

      // Preparar datos del curso
      const cursoData = {
        id_nombre: cursoId,
        id_modalidad: modalidadId,
        id_status: statusId,
        fecha_hora_inicio: fechaInicio,
        fecha_hora_fin: fechaFin || null,
        costo: costoValue,
        descripcion_corto: descripcion || null,
        descripcion_html: descripcionHtml || null,
        codigo: codigo || null,
        color: color,
        duracion: duracionValue,
        codigo_cohorte: codigoCohorte || null
      };

      // Manejar el id_facilitador de manera segura
      if (facilitadorSeleccionado && facilitadorSeleccionado !== '') {
        const facilitadorId = parseInt(facilitadorSeleccionado);
        if (!isNaN(facilitadorId)) {
          cursoData.id_facilitador = facilitadorId;
          console.log('ID de facilitador asignado:', facilitadorId);
        } else {
          console.error('ID de facilitador inválido:', facilitadorSeleccionado);
          cursoData.id_facilitador = null;
        }
      } else {
        cursoData.id_facilitador = null;
      }

      console.log('Datos del curso a enviar:', cursoData);

      let response;
      if (curso) {
        // Si hay un curso seleccionado, actualizar
        cursoData.id_curso = curso.id_curso;
        console.log('Actualizando curso con datos:', cursoData);
        response = await updateCurso(cursoData);
      } else {
        // Si no hay curso seleccionado, crear nuevo
        console.log('Creando nuevo curso con datos:', cursoData);
        response = await createCurso(cursoData);
      }
      
      if (response) {
        // Mostrar mensaje de éxito con Sonner
        toast.success(`Curso ${curso ? 'actualizado' : 'registrado'} exitosamente`);
        
        // Notificar al componente padre que se guardó un curso
        if (typeof onCursoSaved === 'function') {
          onCursoSaved();
        }
        
        // Cerrar el modal
        handleClose();
      }
    } catch (error) {
      console.error('Error al procesar el curso:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          `Error al ${curso ? 'actualizar' : 'crear'} el curso. Por favor intente nuevamente.`;
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-all duration-300" 
        onClick={handleClose}
      />
      
      <div 
        className={`relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl transform transition-all duration-300 ${
          animationClass
        } flex flex-col max-h-[90vh]`}
      >
        {/* Header */}
        <div className="relative p-6 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent flex items-center gap-3">
              {curso ? (
                <>
                  <FontAwesomeIcon 
                    icon={curso.nombre_icono ? iconos[curso.nombre_icono] : faBook} 
                    className="text-blue-600" 
                  />
                  {`Editar Curso: ${curso.nombre_curso}`}
                </>
              ) : (
                'Asignar Cohorte'
              )}
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
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading || !isDataLoaded ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 text-lg">Cargando opciones del curso...</p>
                <p className="text-gray-500 text-sm mt-2">Por favor espere un momento</p>
              </div>
            </div>
          ) : (
            <>
              {/* Sección de información básica */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Información Básica</h3>
                
                {/* Selects principales */}
                <div className="grid grid-cols-1 gap-6">
                  {[
                    { 
                      name: 'curso', 
                      icon: faBook, 
                      label: 'Curso', 
                      value: cursoSeleccionado,
                      onChange: (e) => setCursoSeleccionado(e.target.value),
                      options: cursos || [],
                      disabled: loading || !isDataLoaded
                    },
                    { 
                      name: 'modalidad', 
                      icon: faChalkboardTeacher, 
                      label: 'Modalidad', 
                      value: modalidadSeleccionada,
                      onChange: (e) => setModalidadSeleccionada(e.target.value),
                      options: modalidades || [],
                      disabled: loading || !isDataLoaded
                    },
                    { 
                      name: 'status', 
                      icon: faCheckCircle, 
                      label: 'Status', 
                      value: statusSeleccionado,
                      onChange: (e) => setStatusSeleccionado(e.target.value),
                      options: status || [],
                      disabled: loading || !isDataLoaded
                    },
                    { 
                      name: 'facilitador', 
                      icon: faUser, 
                      label: 'Facilitador', 
                      value: facilitadorSeleccionado,
                      onChange: (e) => {
                        const selectedValue = e.target.value;
                        console.log('Facilitador seleccionado (valor):', selectedValue);
                        console.log('Facilitador seleccionado (opción):', e.target.options[e.target.selectedIndex].text);
                        setFacilitadorSeleccionado(selectedValue);
                      },
                      options: roles_facilitador.map(f => ({
                        id: f.id_persona,
                        nombre: `${f.nombre} ${f.apellido}`
                      })) || [],
                      disabled: loading || !isDataLoaded
                    }
                  ].map((field, index) => (
                    <div 
                      key={`select-field-${field.name}`}
                      className="transition-all duration-300"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FontAwesomeIcon icon={field.icon} className="mr-2 text-blue-500" />
                        {field.label}
                      </label>
                      <select
                        id={`${field.name}-select`}
                        value={field.value}
                        onChange={field.onChange}
                        disabled={field.disabled}
                        className="w-full h-11 px-4 py-2 text-sm border border-gray-200 rounded-lg bg-white transition-colors
                          focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                          hover:border-blue-300 disabled:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-500
                          appearance-none bg-no-repeat bg-right pr-10"
                        style={{
                          backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
                          backgroundSize: "1.5em 1.5em"
                        }}
                      >
                        {!isDataLoaded || loading ? (
                          <option value="" disabled>Cargando opciones...</option>
                        ) : field.options && field.options.length > 0 ? (
                          [<option key={`${field.name}-default`} value="">-- Selecciona {field.label.toLowerCase()} --</option>,
                          ...field.options.map((option, index) => (
                            <option 
                              key={`${field.name}-option-${option.id || option.nombre || index}`} 
                              value={option.id}
                            >
                              {option.nombre}
                            </option>
                          ))]
                        ) : (
                          <option value="" disabled>No hay opciones disponibles</option>
                        )}
                      </select>
                      {(!isDataLoaded || loading) && (
                        <p className="mt-1 text-sm text-gray-500">
                          Cargando opciones...
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Descripción */}
                <div className="transition-all duration-300">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FontAwesomeIcon icon={faAlignLeft} className="mr-2 text-blue-500" />
                    Descripción del Curso
                  </label>
                  <textarea
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    className="w-full min-h-[80px] px-4 py-2 text-sm border border-gray-200 rounded-lg bg-white transition-colors
                      focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                      hover:border-blue-300 resize-vertical mb-4"
                    placeholder="Ingrese la descripción corta del curso..."
                  />
                </div>
                <div className="transition-all duration-300">
                  <label className="block text-sm font-medium text-gray-700 mb-2 mt-4">
                    <FontAwesomeIcon icon={faAlignLeft} className="mr-2 text-blue-500" />
                    Contenido del Curso
                  </label>
                  <Editor
                    apiKey="6azagf27n3g1p9vmbwz7clfcg4a0ews7xyj2i5wmrulogory"
                    value={descripcionHtml}
                    onEditorChange={(content) => setDescripcionHtml(content)}
                    init={{
                      height: 300,
                      menubar: true,
                      plugins: [
                        'advlist autolink lists link charmap preview anchor',
                        'searchreplace visualblocks code fullscreen',
                        'insertdatetime table paste help wordcount',
                        'codesample code',
                        'emoticons',
                        'hr',
                        'image',
                        'media',
                        'pagebreak',
                        'quickbars',
                        'save',
                        'template',
                        'textpattern',
                        'visualchars'
                      ],
                      toolbar: [
                        'bullist numlist | outdent indent',
                        'undo redo | bold italic underline | forecolor',
                        'alignleft aligncenter alignright alignjustify',
                        'removeformat',
                        'link image media table | codesample code',
                        'preview fullscreen | help'
                      ].join(' | '),
                      content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                      // Configuración para permitir HTML personalizado
                      extended_valid_elements: 'span[*],div[*],p[*],h1[*],h2[*],h3[*],h4[*],h5[*],h6[*],strong[*],em[*],u[*],s[*],a[*],img[*],table[*],tr[*],td[*],th[*],ul[*],ol[*],li[*],blockquote[*],pre[*],code[*],br,hr',
                      custom_elements: '~span,~div',
                      // Permitir atributos personalizados
                      extended_valid_attributes: 'id,class,style,title,data-*',
                      // Configuración específica para listas anidadas
                      lists_indent_on_tab: true,
                      indent: true,
                      indent_before: 'ul,ol',
                      indent_after: 'ul,ol',
                      // Configuración para el modo de código fuente
                      codesample_languages: [
                        { text: 'HTML/XML', value: 'markup' },
                        { text: 'JavaScript', value: 'javascript' },
                        { text: 'CSS', value: 'css' },
                        { text: 'PHP', value: 'php' },
                        { text: 'Python', value: 'python' },
                        { text: 'Java', value: 'java' },
                        { text: 'C', value: 'c' },
                        { text: 'C++', value: 'cpp' },
                        { text: 'C#', value: 'csharp' },
                        { text: 'SQL', value: 'sql' }
                      ],
                      // Configuración para el editor de código
                      code_dialog_width: 800,
                      code_dialog_height: 600,
                      // Permitir contenido HTML más flexible
                      valid_children: '+body[style],+ul[li],+ol[li],+li[ul,ol,li]',
                      // Configuración de seguridad
                      entity_encoding: 'raw',
                      // Configuración de formato
                      formats: {
                        alignleft: { selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,table,img', classes: 'left' },
                        aligncenter: { selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,table,img', classes: 'center' },
                        alignright: { selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,table,img', classes: 'right' },
                        bold: { inline: 'span', classes: 'bold' },
                        italic: { inline: 'span', classes: 'italic' }
                      },
                      // Configuración de menú
                      menu: {
                        file: { title: 'Archivo', items: 'newdocument restoredraft | preview | export print | deleteallconversations' },
                        edit: { title: 'Editar', items: 'undo redo | cut copy paste pastetext | selectall | searchreplace' },
                        view: { title: 'Ver', items: 'code | visualaid visualchars visualblocks | spellchecker | preview fullscreen | showcomments' },
                        insert: { title: 'Insertar', items: 'image link media addcomment pageembed template codesample inserttable | charmap emoticons hr | pagebreak nonbreaking anchor tableofcontents | insertdatetime' },
                        format: { title: 'Formato', items: 'bold italic underline superscript subscript codeformat | styles blocks fontfamily fontsize align lineheight | numlist bullist outdent indent | forecolor removeformat | pagebreak | ltr rtl' },
                        tools: { title: 'Herramientas', items: 'spellchecker spellcheckerlanguage | a11ycheck code wordcount' },
                        table: { title: 'Tabla', items: 'inserttable | cell row column | advtablesort | tableprops deletetable' },
                        help: { title: 'Ayuda', items: 'help' }
                      }
                    }}
                  />
                </div>
              </div>

              {/* Sección de detalles */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Detalles del Curso</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Código y Duración */}
                  <div className="space-y-6">
                    <div className="transition-all duration-300">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FontAwesomeIcon icon={faHashtag} className="mr-2 text-blue-500" />
                        Código
                      </label>
                      <input
                        type="text"
                        value={codigo}
                        onChange={(e) => setCodigo(e.target.value)}
                        className="w-full h-11 px-4 py-2 text-sm border border-gray-200 rounded-lg bg-white transition-colors
                          focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                          hover:border-blue-300"
                        placeholder="Ingrese el código del curso"
                      />
                    </div>

                    {/* Código de Cohorte */}
                    <div className="transition-all duration-300">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FontAwesomeIcon icon={faHashtag} className="mr-2 text-blue-500" />
                        Código de Cohorte
                      </label>
                      <input
                        type="text"
                        value={codigoCohorte || ''}
                        onChange={(e) => setCodigoCohorte(e.target.value)}
                        className="w-full h-11 px-4 py-2 text-sm border border-gray-200 rounded-lg bg-white transition-colors
                          focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                          hover:border-blue-300"
                        placeholder="Ingrese el código de la cohorte"
                      />
                    </div>

                    <div className="transition-all duration-300">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FontAwesomeIcon icon={faClock} className="mr-2 text-blue-500" />
                        Duración (horas)
                      </label>
                      <input
                        type="number"
                        value={duracion}
                        onChange={(e) => setDuracion(e.target.value)}
                        min="0"
                        className="w-full h-11 px-4 py-2 text-sm border border-gray-200 rounded-lg bg-white transition-colors
                          focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                          hover:border-blue-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        placeholder="Ej: 40"
                      />
                    </div>
                  </div>

                  {/* Costo y Color */}
                  <div className="space-y-6">
                    <div className="transition-all duration-300">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FontAwesomeIcon icon={faMoneyBill} className="mr-2 text-blue-500" />
                        Costo
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={costo}
                          onChange={(e) => setCosto(e.target.value)}
                          min="0"
                          step="0.01"
                          className="w-full h-11 px-4 py-2 text-sm border border-gray-200 rounded-lg bg-white transition-colors
                            focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                            hover:border-blue-300 pr-8 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          placeholder="0.00"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      </div>
                    </div>

                    <div className="transition-all duration-300">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FontAwesomeIcon icon={faPalette} className="mr-2 text-blue-500" />
                        Color del Curso
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={color}
                          onChange={(e) => setColor(e.target.value)}
                          className="w-12 h-12 p-1 rounded-lg border border-gray-200 cursor-pointer hover:border-blue-300 transition-colors
                            [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-0 [&::-webkit-color-swatch]:rounded-lg
                            [&::-moz-color-swatch]:border-0 [&::-moz-color-swatch]:rounded-lg"
                        />
                        <input
                          type="text"
                          value={color}
                          onChange={(e) => setColor(e.target.value)}
                          className="flex-1 h-11 px-4 py-2 text-sm border border-gray-200 rounded-lg bg-white transition-colors
                            focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                            hover:border-blue-300"
                          placeholder="#4F46E5"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sección de fechas */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Período del Curso</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="transition-all duration-300">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-blue-500" />
                      Fecha y Hora de Inicio
                    </label>
                    <input
                      type="datetime-local"
                      value={fechaInicio}
                      onChange={(e) => setFechaInicio(e.target.value)}
                      className="w-full h-11 px-4 py-2 text-sm border border-gray-200 rounded-lg bg-white transition-colors
                        focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                        hover:border-blue-300"
                    />
                  </div>

                  <div className="transition-all duration-300">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-blue-500" />
                      Fecha y Hora de Fin
                    </label>
                    <input
                      type="datetime-local"
                      value={fechaFin}
                      onChange={(e) => setFechaFin(e.target.value)}
                      className="w-full h-11 px-4 py-2 text-sm border border-gray-200 rounded-lg bg-white transition-colors
                        focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                        hover:border-blue-300"
                    />
                  </div>
                </div>
              </div>

              {holidayWarning && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg my-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <FontAwesomeIcon icon={faTriangleExclamation} className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">{holidayWarning}</p>
                    </div>
                  </div>
                </div>
              )}

              {submitError && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{submitError}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="border-t border-gray-100 p-6 bg-gray-50 rounded-b-2xl flex-shrink-0 mt-6">
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-lg text-gray-700 hover:text-gray-900 bg-white border border-gray-200 
                      hover:bg-gray-50 transition-all duration-300 shadow-sm hover:shadow disabled:opacity-50 
                      disabled:cursor-not-allowed"
                  >
                    <FontAwesomeIcon icon={faTimes} className="mr-2" />
                    <span>Cancelar</span>
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-6 py-2.5 rounded-lg text-white bg-gradient-to-r from-blue-600 to-cyan-600 
                      hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-sm hover:shadow-lg 
                      disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        <span>Guardando...</span>
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faSave} className="mr-2" />
                        <span>{curso ? 'Actualizar Curso' : 'Guardar Curso'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </>
          )}
        </form>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        @keyframes modalOut {
          from { opacity: 1; transform: scale(1) translateY(0); }
          to { opacity: 0; transform: scale(0.95) translateY(10px); }
        }

        .animate-modal-in { animation: modalIn 0.3s ease-out; }
        .animate-modal-out { animation: modalOut 0.3s ease-out; }
      `}</style>
    </div>
  );
}

export default ModalFecha;
