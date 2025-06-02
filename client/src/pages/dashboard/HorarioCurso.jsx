import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCursoStore } from '../../store/cursoStore';
import { useClasificacionStore } from '../../store/clasificacionStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCalendarAlt, faClock, faUser, faChalkboardTeacher, faMoneyBill, faPlus, faTrash, faCalendar } from '@fortawesome/free-solid-svg-icons';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import esLocale from '@fullcalendar/core/locales/es';
import { toast } from 'sonner';
import { decodeId, encodeId } from '../../utils/hashUtils';

function HorarioCurso() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchCursos } = useCursoStore();
  const { fetchSubClasificaciones } = useClasificacionStore();
  const [curso, setCurso] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [eventosCalendario, setEventosCalendario] = useState([]);
  const [feriados, setFeriados] = useState([]);
  const [horarios, setHorarios] = useState([{ fechaHoraInicio: '', fechaHoraFin: '', descripcion: '' }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const calendarRef = useRef(null);
  const [currentView, setCurrentView] = useState('timeGridWeek');

  // Decodificar el ID de manera segura
  const decodedId = React.useMemo(() => {
    try {
      return decodeId(id);
    } catch (error) {
      console.error('Error al decodificar ID:', error);
      return null;
    }
  }, [id]);

  const loadFeriados = async () => {
    try {
      console.log('Intentando cargar feriados...');
      const response = await fetchSubClasificaciones(100121, null);
      console.log('Respuesta de feriados:', response);
      
      if (response?.data) {
        console.log('Feriados cargados:', response.data);
        setFeriados(response.data);
      } else {
        console.error('No se recibieron datos de feriados. Respuesta:', response);
        setFeriados([]);
      }
    } catch (error) {
      console.error('Error al cargar feriados:', error);
      setFeriados([]);
    }
  };

  useEffect(() => {
    const loadCurso = async () => {
      try {
        setLoading(true);
        const response = await fetchCursos();
        if (response?.data?.data && decodedId) {
          const cursoEncontrado = response.data.data.find(c => c.id_curso === parseInt(decodedId));
          if (cursoEncontrado) {
            setCurso(cursoEncontrado);
            // Crear evento para el calendario
            const eventoCurso = {
              id: String(cursoEncontrado.id_curso),
              title: cursoEncontrado.nombre_curso,
              start: cursoEncontrado.fecha_hora_inicio,
              end: cursoEncontrado.fecha_hora_fin,
              backgroundColor: cursoEncontrado.color || '#4F46E5',
              borderColor: cursoEncontrado.color || '#4F46E5',
              textColor: '#ffffff',
              extendedProps: {
                instructor: cursoEncontrado.nombre_completo_facilitador,
                modalidad: cursoEncontrado.modalidad,
                estado: cursoEncontrado.estado,
                costo: cursoEncontrado.costo,
                codigo: cursoEncontrado.codigo
              }
            };
            setEventosCalendario([eventoCurso]);
          } else {
            setError('Curso no encontrado');
          }
        }
      } catch (error) {
        console.error('Error al cargar el curso:', error);
        setError('Error al cargar la información del curso');
      } finally {
        setLoading(false);
      }
    };

    const loadData = async () => {
      await Promise.all([
        loadCurso(),
        loadFeriados()
      ]);
    };
    loadData();
  }, [decodedId, fetchCursos, fetchSubClasificaciones]);

  // Modificar el useEffect de feriados para que se ejecute inmediatamente
  useEffect(() => {
    const procesarFeriados = () => {
      if (!feriados.length) return;

      const eventosFeriados = feriados
        .filter(feriado => feriado && feriado.descripcion)
        .flatMap(feriado => {
          try {
            const fechas = feriado.descripcion.split(',').map(fecha => fecha.trim());
            
            return fechas.map(fecha => {
              const partes = fecha.split('/');
              let dia, mes, anio;
              
              if (partes.length === 3) {
                [dia, mes, anio] = partes.map(num => parseInt(num));
                anio = 2000 + anio;
              } else if (partes.length === 2) {
                [dia, mes] = partes.map(num => parseInt(num));
                const calendarApi = calendarRef.current?.getApi();
                anio = calendarApi ? calendarApi.getDate().getFullYear() : new Date().getFullYear();
              } else {
                console.error('Formato de fecha inválido:', fecha);
                return null;
              }

              if (isNaN(dia) || isNaN(mes) || isNaN(anio)) {
                console.error('Valores de fecha inválidos:', { dia, mes, anio });
                return null;
              }

              const fechaCompleta = new Date(anio, mes - 1, dia);
              
              return {
                id: `feriado-${feriado.id_clasificacion}-${fecha}`,
                title: feriado.nombre,
                start: fechaCompleta,
                end: fechaCompleta,
                allDay: true,
                backgroundColor: '#EF4444',
                borderColor: '#EF4444',
                textColor: '#ffffff',
                display: 'block',
                extendedProps: {
                  esFeriado: true,
                  nombre: feriado.nombre,
                  orden: feriado.orden,
                  fechaOriginal: fecha
                }
              };
            }).filter(Boolean);
          } catch (error) {
            console.error('Error al procesar feriado:', feriado, error);
            return [];
          }
        });

      setEventosCalendario(prev => {
        const eventosCurso = prev.filter(evento => !evento.id.startsWith('feriado-'));
        return [...eventosCurso, ...eventosFeriados];
      });
    };

    // Ejecutar inmediatamente
    procesarFeriados();

    // Configurar el listener para cambios de vista
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.on('datesSet', procesarFeriados);

      return () => {
        calendarApi.off('datesSet', procesarFeriados);
      };
    }
  }, [feriados]);

  const handleAddRow = () => {
    setHorarios([...horarios, { fechaHoraInicio: '', fechaHoraFin: '', descripcion: '' }]);
  };

  const handleRemoveRow = (index) => {
    const newHorarios = horarios.filter((_, i) => i !== index);
    setHorarios(newHorarios);
  };

  const handleHorarioChange = (index, field, value) => {
    const newHorarios = [...horarios];
    newHorarios[index][field] = value;
    
    // Si se cambia la fecha de inicio, actualizar automáticamente la fecha de fin
    if (field === 'fechaHoraInicio') {
      newHorarios[index].fechaHoraFin = value;
    }
    
    setHorarios(newHorarios);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validar todos los horarios
      for (const horario of horarios) {
        if (!horario.fechaHoraInicio || !horario.fechaHoraFin) {
          toast.error('Por favor complete todas las fechas de inicio y fin');
          return;
        }

        const inicio = new Date(horario.fechaHoraInicio);
        const fin = new Date(horario.fechaHoraFin);

        if (inicio >= fin) {
          toast.error('La fecha de inicio debe ser anterior a la fecha de fin');
          return;
        }
      }

      // Crear eventos para cada horario
      const nuevosEventos = horarios.map(horario => ({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        title: curso.nombre_curso,
        start: horario.fechaHoraInicio,
        end: horario.fechaHoraFin,
        backgroundColor: curso.color || '#4F46E5',
        borderColor: curso.color || '#4F46E5',
        textColor: '#ffffff',
        extendedProps: {
          descripcion: horario.descripcion,
          instructor: curso.nombre_completo_facilitador,
          modalidad: curso.modalidad
        }
      }));

      setEventosCalendario(prev => [...prev, ...nuevosEventos]);
      
      // Limpiar formulario y mantener una fila vacía
      setHorarios([{ fechaHoraInicio: '', fechaHoraFin: '', descripcion: '' }]);
      
      toast.success('Horarios agregados exitosamente');
    } catch (error) {
      console.error('Error al agregar horarios:', error);
      toast.error('Error al agregar los horarios');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewChange = (view) => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.changeView(view);
      setCurrentView(view);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-700"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button
            onClick={() => navigate('/dashboard/cursos')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Volver a Cursos
          </button>
        </div>
      </div>
    );
  }

  if (!curso) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Botón de regreso */}
        <button
          onClick={() => navigate('/dashboard/cursos')}
          className="mb-6 flex items-center text-gray-600 hover:text-indigo-600 transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Volver a Cursos
        </button>

        {/* Información del curso */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{curso.nombre_curso}</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <FontAwesomeIcon icon={faCalendarAlt} className="text-indigo-600 text-xl" />
                <div>
                  <p className="text-sm text-gray-500">Fecha de Inicio</p>
                  <p className="font-medium">{new Date(curso.fecha_hora_inicio).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <FontAwesomeIcon icon={faClock} className="text-indigo-600 text-xl" />
                <div>
                  <p className="text-sm text-gray-500">Duración</p>
                  <p className="font-medium">{curso.duracion || 'No especificada'} horas</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <FontAwesomeIcon icon={faUser} className="text-indigo-600 text-xl" />
                <div>
                  <p className="text-sm text-gray-500">Instructor</p>
                  <p className="font-medium">{curso.nombre_completo_facilitador || 'No asignado'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <FontAwesomeIcon icon={faChalkboardTeacher} className="text-indigo-600 text-xl" />
                <div>
                  <p className="text-sm text-gray-500">Modalidad</p>
                  <p className="font-medium">{curso.modalidad || 'No especificada'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <FontAwesomeIcon icon={faMoneyBill} className="text-indigo-600 text-xl" />
                <div>
                  <p className="text-sm text-gray-500">Costo</p>
                  <p className="font-medium">${curso.costo || 'No especificado'}</p>
                </div>
              </div>
            </div>

            {/* Descripción */}
            {curso.descripcion_corto && (
              <div className="mt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Descripción</h2>
                <p className="text-gray-600">{curso.descripcion_corto}</p>
              </div>
            )}
          </div>
        </div>

        {/* Contenedor principal de dos columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Columna izquierda: Calendario */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Horario del Curso</h2>
              <div className="flex justify-end mb-4 space-x-2">
                <button
                  onClick={() => handleViewChange('dayGridMonth')}
                  className={`px-4 py-2 rounded-md transition-all duration-300 transform hover:scale-105 ${
                    currentView === 'dayGridMonth'
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                  Mes
                </button>
                <button
                  onClick={() => handleViewChange('timeGridWeek')}
                  className={`px-4 py-2 rounded-md transition-all duration-300 transform hover:scale-105 ${
                    currentView === 'timeGridWeek'
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <FontAwesomeIcon icon={faCalendar} className="mr-2" />
                  Semana
                </button>
                <button
                  onClick={() => handleViewChange('timeGridDay')}
                  className={`px-4 py-2 rounded-md transition-all duration-300 transform hover:scale-105 ${
                    currentView === 'timeGridDay'
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <FontAwesomeIcon icon={faCalendar} className="mr-2" />
                  Día
                </button>
              </div>
              <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                initialView={currentView}
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: ''
                }}
                locale={esLocale}
                height="auto"
                allDaySlot={true}
                slotMinTime="06:00:00"
                slotMaxTime="22:00:00"
                weekends={true}
                events={eventosCalendario}
                views={{
                  dayGridMonth: {
                    titleFormat: { year: 'numeric', month: 'long' },
                    dayMaxEventRows: true,
                    displayEventTime: false
                  },
                  timeGridWeek: {
                    titleFormat: { year: 'numeric', month: 'long', day: 'numeric' },
                    dayMaxEventRows: true
                  },
                  timeGridDay: {
                    titleFormat: { year: 'numeric', month: 'long', day: 'numeric' },
                    dayMaxEventRows: true
                  }
                }}
                buttonText={{
                  today: 'Hoy',
                  month: 'Mes',
                  week: 'Semana',
                  day: 'Día'
                }}
                eventContent={(eventInfo) => {
                  const esFeriado = eventInfo.event.extendedProps.esFeriado;

                  if (esFeriado) {
                    return (
                      <div 
                        className="flex items-center gap-2 p-1 group relative"
                        title={eventInfo.event.title}
                      >
                        <FontAwesomeIcon icon={faCalendar} className="text-white" />
                        <span className="truncate font-medium">{eventInfo.event.title}</span>
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 pointer-events-none">
                          {eventInfo.event.title}
                          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div className="p-2">
                      <div className="font-semibold">{eventInfo.event.title}</div>
                      <div className="text-sm">
                        {eventInfo.event.extendedProps.instructor && (
                          <div>Instructor: {eventInfo.event.extendedProps.instructor}</div>
                        )}
                        {eventInfo.event.extendedProps.modalidad && (
                          <div>Modalidad: {eventInfo.event.extendedProps.modalidad}</div>
                        )}
                        {eventInfo.event.extendedProps.descripcion && (
                          <div>Descripción: {eventInfo.event.extendedProps.descripcion}</div>
                        )}
                      </div>
                    </div>
                  );
                }}
              />
            </div>
          </div>

          {/* Columna derecha: Formulario de horarios */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Agregar Horarios</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {horarios.map((horario, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="flex-1">
                      <input
                        type="datetime-local"
                        value={horario.fechaHoraInicio}
                        onChange={(e) => handleHorarioChange(index, 'fechaHoraInicio', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Inicio"
                        required
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="datetime-local"
                        value={horario.fechaHoraFin}
                        onChange={(e) => handleHorarioChange(index, 'fechaHoraFin', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Fin"
                        required
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        value={horario.descripcion}
                        onChange={(e) => handleHorarioChange(index, 'descripcion', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Descripción"
                      />
                    </div>
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveRow(index)}
                        className="p-2 text-red-600 hover:text-red-700 transition-colors"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    )}
                  </div>
                ))}

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={handleAddRow}
                    className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Agregar Fila
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        <span>Agregando...</span>
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faPlus} className="mr-2" />
                        <span>Guardar Horarios</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          :root {
            --fc-border-color: #e2e8f0;
            --fc-button-bg-color: #4F46E5;
            --fc-button-border-color: #4F46E5;
            --fc-button-hover-bg-color: #4338CA;
            --fc-button-hover-border-color: #3730A3;
            --fc-button-active-bg-color: #3730A3;
            --fc-button-active-border-color: #312E81;
            --fc-today-bg-color: #EEF2FF;
            --fc-neutral-bg-color: #ffffff;
            --fc-list-event-hover-bg-color: #F5F3FF;
            --fc-event-border-color: transparent;
            --fc-event-bg-color: #4F46E5;
            --fc-event-text-color: #ffffff;
          }

          .fc {
            background: white;
            border-radius: 1rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            transition: all 0.3s ease;
            overflow: hidden;
          }

          .fc-theme-standard td, .fc-theme-standard th {
            border-color: var(--fc-border-color);
          }

          .fc .fc-daygrid-day {
            transition: all 0.2s ease;
            position: relative;
          }

          .fc .fc-daygrid-day:hover {
            background-color: #F5F3FF;
            transform: scale(1.02);
            z-index: 1;
          }

          .fc .fc-day-today {
            background-color: var(--fc-today-bg-color) !important;
            position: relative;
          }

          .fc .fc-day-today::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: #4F46E5;
            border-radius: 3px 3px 0 0;
          }

          .fc .fc-daygrid-day-number {
            padding: 12px;
            color: #4B5563;
            font-weight: 500;
            transition: all 0.2s ease;
            font-size: 0.95rem;
          }

          .fc .fc-daygrid-day:hover .fc-daygrid-day-number {
            color: #4F46E5;
            transform: scale(1.1);
          }

          .fc .fc-col-header-cell {
            padding: 16px 0;
            background-color: #F9FAFB;
            transition: all 0.2s ease;
            border-bottom: 2px solid #E5E7EB;
          }

          .fc .fc-col-header-cell:hover {
            background-color: #F3F4F6;
          }

          .fc .fc-col-header-cell-cushion {
            padding: 12px;
            color: #1F2937;
            font-weight: 600;
            text-decoration: none;
            transition: all 0.2s ease;
            font-size: 1rem;
            text-transform: capitalize;
          }

          .fc .fc-col-header-cell:hover .fc-col-header-cell-cushion {
            color: #4F46E5;
          }

          .fc-event {
            border-radius: 0.75rem;
            border: none;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            transition: all 0.3s ease;
            cursor: pointer;
            margin: 2px 4px;
            padding: 4px;
          }

          .fc-event:hover {
            transform: translateY(-2px) scale(1.02);
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
          }

          .fc-event-with-icon {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.75rem;
            font-size: 0.95rem;
          }

          .fc-list {
            border-radius: 1rem;
            overflow: hidden;
            transition: all 0.3s ease;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          }

          .fc-list-event:hover td {
            background-color: #F5F3FF;
            transform: translateX(8px);
          }

          .fc-list-event-time {
            font-weight: 500;
            padding: 1.25rem;
            color: #4B5563;
            transition: all 0.2s ease;
            font-size: 0.95rem;
          }

          .fc-list-event:hover .fc-list-event-time {
            color: #4F46E5;
          }

          .fc-list-event-title a {
            font-weight: 600;
            padding: 1.25rem;
            color: #1F2937;
            transition: all 0.2s ease;
            font-size: 1rem;
          }

          .fc-list-event:hover .fc-list-event-title a {
            color: #4F46E5;
          }

          .fc-list-day-cushion {
            background-color: #F9FAFB !important;
            padding: 1.25rem !important;
            transition: all 0.2s ease;
            border-bottom: 2px solid #E5E7EB;
          }

          .fc-list-day-cushion:hover {
            background-color: #F3F4F6 !important;
          }

          .fc-list-day-text, .fc-list-day-side-text {
            font-weight: 600;
            color: #1F2937;
            font-size: 1.1rem;
            transition: all 0.2s ease;
          }

          .fc-list-day-cushion:hover .fc-list-day-text,
          .fc-list-day-cushion:hover .fc-list-day-side-text {
            color: #4F46E5;
          }

          .fc-timegrid-slot {
            height: 3.5em !important;
            transition: all 0.2s ease;
          }

          .fc-timegrid-slot:hover {
            background-color: #F5F3FF;
          }

          .fc-timegrid-slot-label {
            font-size: 0.9rem;
            color: #4B5563;
            transition: all 0.2s ease;
            font-weight: 500;
          }

          .fc-timegrid-slot:hover .fc-timegrid-slot-label {
            color: #4F46E5;
          }

          .fc-timegrid-now-indicator-line {
            border-color: #EF4444;
            border-width: 2px;
            animation: pulse 2s infinite;
          }

          @keyframes pulse {
            0% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
            100% {
              opacity: 1;
            }
          }

          .fc .fc-button-primary {
            background-color: var(--fc-button-bg-color);
            border-color: var(--fc-button-border-color);
            color: white;
            font-weight: 600;
            padding: 0.75rem 1.5rem;
            border-radius: 0.75rem;
            transition: all 0.3s ease;
            text-transform: capitalize;
            font-size: 0.95rem;
            box-shadow: 0 2px 4px rgba(79, 70, 229, 0.2);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
          }

          .fc .fc-button-primary:hover {
            background-color: var(--fc-button-hover-bg-color);
            border-color: var(--fc-button-hover-border-color);
            transform: translateY(-2px);
            box-shadow: 0 8px 16px rgba(79, 70, 229, 0.3);
          }

          .fc .fc-button-primary:active {
            transform: translateY(0);
            box-shadow: 0 2px 4px rgba(79, 70, 229, 0.2);
          }

          .fc .fc-toolbar {
            padding: 1.5rem;
            background: #F9FAFB;
            border-bottom: 2px solid #E5E7EB;
            margin-bottom: 0 !important;
            display: flex;
            align-items: center;
            gap: 1rem;
          }

          .fc .fc-toolbar-title {
            font-size: 1.5rem !important;
            font-weight: 700;
            color: #1F2937;
            margin: 0;
          }

          .fc .fc-prev-button, .fc .fc-next-button {
            padding: 0.75rem !important;
            border-radius: 0.75rem !important;
            min-width: 42px;
            height: 42px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }

          .fc .fc-today-button {
            padding: 0.75rem 1.5rem !important;
            border-radius: 0.75rem !important;
            font-weight: 600 !important;
            min-width: 100px;
            height: 42px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
          }

          .fc .fc-button-group {
            display: flex;
            gap: 0.5rem;
          }

          .fc .fc-button-group .fc-button {
            margin: 0 !important;
          }

          .fc .fc-toolbar-chunk {
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }
        `}
      </style>
    </div>
  );
}

export default HorarioCurso;