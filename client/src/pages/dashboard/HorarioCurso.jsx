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
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

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

  useEffect(() => {
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
              anio = selectedYear;
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
  }, [feriados, selectedYear]);

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
              <div className="flex justify-end mb-4">
                <select
                  onChange={(e) => {
                    const year = parseInt(e.target.value);
                    setSelectedYear(year);
                    if (calendarRef.current) {
                      const calendarApi = calendarRef.current.getApi();
                      calendarApi.gotoDate(new Date(year, 0, 1));
                    }
                  }}
                  className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-700 shadow-sm"
                  value={selectedYear}
                >
                  {Array.from({ length: 81 }, (_, i) => 2020 + i).map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                initialView="timeGridWeek"
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,timeGridWeek,timeGridDay'
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
                      <div className="flex items-center gap-2 p-1">
                        <FontAwesomeIcon icon={faCalendar} className="text-white" />
                        <span className="truncate font-medium">{eventInfo.event.title}</span>
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
    </div>
  );
}

export default HorarioCurso;