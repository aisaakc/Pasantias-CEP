import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import esLocale from '@fullcalendar/core/locales/es';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faBook, faChalkboardTeacher, faUser, faMoneyBill } from '@fortawesome/free-solid-svg-icons';
import * as iconos from '@fortawesome/free-solid-svg-icons';
import { useCursoStore } from '../../store/cursoStore';
import { useClasificacionStore } from '../../store/clasificacionStore';
import ModalFecha from '../../components/ModalCurso';
import { encodeId } from '../../utils/hashUtils';

function Curso() {
  const navigate = useNavigate();
  const { fetchCursos, loading, error, modalidades, fetchOpcionesCurso, cursos } = useCursoStore();
  const { fetchSubClasificaciones } = useClasificacionStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCurso, setSelectedCurso] = useState(null);
  const [cursosCalendario, setCursosCalendario] = useState([]);
  const [feriados, setFeriados] = useState([]);
  const [currentView, setCurrentView] = useState('dayGridMonth');
  const calendarRef = React.useRef(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const loadCursos = async () => {
    try {
      const response = await fetchCursos();
      if (response?.data?.data) {
        console.log('Cursos cargados:', response.data.data);
        setCursosCalendario(response.data.data);
      } else {
        console.error('No se recibieron datos de cursos');
      }
    } catch (error) {
      console.error('Error al cargar cursos:', error);
    }
  };

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
    const loadData = async () => {
      await Promise.all([
        loadCursos(),
        loadFeriados(),
        fetchOpcionesCurso()
      ]);
    };
    loadData();
  }, [fetchCursos, fetchOpcionesCurso, fetchSubClasificaciones]);

  const handleCursoSaved = async () => {
    await loadCursos();
  };

  const handleCursoSelect = (e) => {
    const cursoId = e.target.value;
    if (cursoId) {
      const encodedId = encodeId(cursoId);
      if (encodedId) {
        navigate(`/dashboard/horario-curso/${encodedId}`);
      } else {
        console.error('Error al codificar el ID del curso');
      }
    }
  };

  const eventosCalendario = React.useMemo(() => {
    const eventosCursos = cursosCalendario
      .filter(curso => curso && curso.id_curso && curso.fecha_hora_inicio && curso.fecha_hora_fin)
      .map(curso => ({
        id: String(curso.id_curso),
        title: curso.nombre_curso || 'Curso sin nombre',
        nombre_parent: curso.nombre_parent || 'Sin categoria',
        start: curso.fecha_hora_inicio,
        end: curso.fecha_hora_fin,
        backgroundColor: curso.color || '#4F46E5',
        borderColor: curso.color || '#4F46E5',
        textColor: '#ffffff',
        display: 'block',
        icon: iconos[curso.nombre_icono] || iconos.faFile,
        extendedProps: {
          id_curso: curso.id_curso,
          descripcion: curso.descripcion_corto || '',
          instructor: curso.nombre_completo_facilitador || 'Sin instructor',
          modalidad: curso.modalidad || 'No especificada',
          estado: curso.estado || 'No especificado',
          costo: curso.costo || 0,
          codigo: curso.codigo || 'Sin código',
          icon: iconos[curso.nombre_icono] || iconos.faFile,
          color: curso.color || '#4F46E5'
        },
      }));

    const eventosFeriados = feriados
      .filter(feriado => feriado && feriado.descripcion)
      .flatMap(feriado => {
        try {
          // Dividir las fechas por coma y procesar cada una
          const fechas = feriado.descripcion.split(',').map(fecha => fecha.trim());
          
          return fechas.map(fecha => {
            // Verificar si la fecha incluye el año (DD/MM/AA)
            const partes = fecha.split('/');
            let dia, mes, anio;
            
            if (partes.length === 3) {
              // Formato DD/MM/AA
              [dia, mes, anio] = partes.map(num => parseInt(num));
              anio = 2000 + anio; // Convertir AA a 20AA
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
                icon: iconos[feriado.parent_icono] || iconos.faCalendar,
                extendedProps: {
                  esFeriado: true,
                  nombre: feriado.nombre,
                  orden: feriado.orden,
                  fechaOriginal: fecha
                }
              };
            } else if (partes.length === 2) {
              // Formato DD/MM - Crear eventos para todos los años
              [dia, mes] = partes.map(num => parseInt(num));
              const eventos = [];
              
              // Crear eventos para los años 2020-2100
              for (let year = 2020; year <= 2100; year++) {
                const fechaCompleta = new Date(year, mes - 1, dia);
                eventos.push({
                  id: `feriado-${feriado.id_clasificacion}-${fecha}-${year}`,
                  title: feriado.nombre,
                  start: fechaCompleta,
                  end: fechaCompleta,
                  allDay: true,
                  backgroundColor: '#EF4444',
                  borderColor: '#EF4444',
                  textColor: '#ffffff',
                  display: 'block',
                  icon: iconos[feriado.parent_icono] || iconos.faCalendar,
                  extendedProps: {
                    esFeriado: true,
                    nombre: feriado.nombre,
                    orden: feriado.orden,
                    fechaOriginal: fecha
                  }
                });
              }
              
              return eventos;
            } else {
              console.error('Formato de fecha inválido:', fecha);
              return null;
            }
          }).filter(Boolean).flat();
        } catch (error) {
          console.error('Error al procesar feriado:', feriado, error);
          return [];
        }
      })
      .sort((a, b) => {
        // Primero ordenar por fecha
        const fechaA = new Date(a.start);
        const fechaB = new Date(b.start);
        if (fechaA.getTime() !== fechaB.getTime()) {
          return fechaA.getTime() - fechaB.getTime();
        }
        // Si las fechas son iguales, ordenar por el campo orden
        return a.extendedProps.orden - b.extendedProps.orden;
      });

    return [...eventosCursos, ...eventosFeriados];
  }, [cursosCalendario, feriados, selectedYear]);

  const renderEventContent = (eventInfo) => {
    const icon = eventInfo.event.extendedProps.icon;
    const status = eventInfo.event.extendedProps.estado;
    const modalidad = eventInfo.event.extendedProps.modalidad;
    const instructor = eventInfo.event.extendedProps.instructor;
    const costo = eventInfo.event.extendedProps.costo;
    const esFeriado = eventInfo.event.extendedProps.esFeriado;
    const descripcion = eventInfo.event.extendedProps.descripcion;
    const esHorario = eventInfo.event.extendedProps.esHorario;

    // Si es un feriado, mostrar un diseño específico
    if (esFeriado) {
      return (
        <div 
          className="flex items-center gap-2 p-1 group relative"
          title={eventInfo.event.title}
        >
          <FontAwesomeIcon icon={iconos.faCalendar} className="text-white" />
          <span className="truncate font-medium">{eventInfo.event.title}</span>
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 pointer-events-none">
            {eventInfo.event.title}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
          </div>
        </div>
      );
    }

    // Si estamos en vista de semana o día, mostrar el bloque detallado como en HorarioCurso.jsx
    if (eventInfo.view.type === 'timeGridWeek' || eventInfo.view.type === 'timeGridDay') {
      return (
        <div className="p-2">
          <div className="font-semibold flex items-center">
            {eventInfo.event.title}
            {esHorario && (
              <span className="ml-2 text-xs bg-white bg-opacity-20 px-2 py-0.5 rounded">
                Horario
              </span>
            )}
          </div>
          <div className="text-sm">
            {instructor && (
              <div>Instructor: {instructor}</div>
            )}
            {modalidad && (
              <div>Modalidad: {modalidad}</div>
            )}
            {descripcion && (
              <div>Descripción: {descripcion}</div>
            )}
          </div>
        </div>
      );
    }

    // Vista normal para otras vistas del calendario
    return (
      <div className="flex items-center gap-2">
        {icon && <FontAwesomeIcon icon={icon} className="text-white" />}
        <span className="truncate">{eventInfo.event.title}</span>
        <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{status}</span>
      </div>
    );
  };

  const handleDateClick = (arg) => {
    // Usar la fecha y hora real seleccionada en el calendario
    const fechaSeleccionada = new Date(arg.date);
    const year = fechaSeleccionada.getFullYear();
    const month = String(fechaSeleccionada.getMonth() + 1).padStart(2, '0');
    const day = String(fechaSeleccionada.getDate()).padStart(2, '0');
    const hour = String(fechaSeleccionada.getHours()).padStart(2, '0');
    const min = String(fechaSeleccionada.getMinutes()).padStart(2, '0');
    const fechaFormateada = `${year}-${month}-${day}T${hour}:${min}`;
    setSelectedDate(fechaFormateada);
    setSelectedCurso(null);
    setModalOpen(true);
  };

  const handleEventClick = (info) => {
    const cursoId = info.event.id;
    const curso = cursosCalendario.find(c => c.id_curso === parseInt(cursoId));
    if (curso) {
      setSelectedCurso(curso);
      setModalOpen(true);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedDate(null);
    setSelectedCurso(null);
  };

  const handleViewChange = (view) => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.changeView(view);
      setCurrentView(view);
    }
  };

  // Calcular slotMinTime y slotMaxTime dinámicamente según los cursos
  const [slotMinTime, slotMaxTime] = React.useMemo(() => {
    // Filtrar solo eventos de cursos (no feriados)
    const eventosCursos = cursosCalendario.filter(curso => curso && curso.fecha_hora_inicio && curso.fecha_hora_fin);
    if (eventosCursos.length === 0) {
      return ["01:00:00", "23:59:59"];
    }
    const horasInicio = eventosCursos.map(curso => new Date(curso.fecha_hora_inicio).getHours());
    const horasFin = eventosCursos.map(curso => new Date(curso.fecha_hora_fin).getHours());
    const min = Math.min(...horasInicio, 0);
    const max = Math.max(...horasFin, 23) + 1;
    // Formatear a HH:mm:ss
    const pad = n => n.toString().padStart(2, '0');
    return [`${pad(min)}:00:00`, `${pad(max)}:00:00`];
  }, [cursosCalendario]);

  // Calcular scrollTime dinámicamente según la hora de inicio del primer curso
  const scrollTime = React.useMemo(() => {
    const eventosCursos = cursosCalendario.filter(curso => curso && curso.fecha_hora_inicio);
    if (eventosCursos.length === 0) return "01:00:00";
    // Buscar el curso más próximo en fecha de inicio
    const primerCurso = eventosCursos.reduce((min, curr) => new Date(curr.fecha_hora_inicio) < new Date(min.fecha_hora_inicio) ? curr : min, eventosCursos[0]);
    const fecha = new Date(primerCurso.fecha_hora_inicio);
    const pad = n => n.toString().padStart(2, '0');
    return `${pad(fecha.getHours())}:00:00`;
  }, [cursosCalendario]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-semibold text-gray-900">Calendario Académico</h1>
              <div className="w-200">
                <select
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-700 shadow-sm"
                  onChange={handleCursoSelect}
                  value=""
                >
                  <option value="">__________ Ver Horarios del Curso __________</option>
                  {cursosCalendario && cursosCalendario.length > 0 ? (
                    Object.entries(
                      cursosCalendario.reduce((groups, curso) => {
                        const parentName = curso.nombre_parent || "Sin categoría";
                        if (!groups[parentName]) {
                          groups[parentName] = [];
                        }
                        groups[parentName].push(curso);
                        return groups;
                      }, {})
                    ).map(([parentName, group]) => (
                      <optgroup key={parentName} label={parentName}>
                        {group.map((curso) => {
                          let timeString = '';
                          if (curso.fecha_hora_inicio && curso.fecha_hora_fin) {
                            try {
                              const startTime = new Date(curso.fecha_hora_inicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                              const endTime = new Date(curso.fecha_hora_fin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                              timeString = ` (${startTime} - ${endTime})`;
                            } catch (e) {
                              console.error("Error al formatear la fecha para el curso:", curso.id_curso, e);
                            }
                          }
                          return (
                            <option key={curso.id_curso} value={curso.id_curso}>
                              {`${curso.nombre_curso}${timeString}`}
                            </option>
                          );
                        })}
                      </optgroup>
                    ))
                  ) : (
                    <option value="" disabled>
                      No hay cursos asignados
                    </option>
                  )}
                </select>
              </div>
            </div>
          </div>
          <div className="p-4 sm:p-6">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-700"></div>
              </div>
            ) : error ? (
              <div className="text-center text-red-600 p-4">
                <p>Error al cargar los cursos: {error}</p>
              </div>
            ) : (
              <>
                <div className="flex justify-end mb-4 space-x-2">
                  <button
                    onClick={() => handleViewChange('dayGridMonth')}
                    className={`px-4 py-2 rounded-md transition-all duration-300 transform hover:scale-105 ${
                      currentView === 'dayGridMonth'
                        ? 'bg-indigo-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <FontAwesomeIcon icon={iconos.faCalendarAlt} className="mr-2" />
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
                    <FontAwesomeIcon icon={iconos.faCalendarWeek} className="mr-2" />
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
                    <FontAwesomeIcon icon={iconos.faCalendarDay} className="mr-2" />
                    Día
                  </button>
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
                  initialView={currentView}
                  headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: ''
                  }}
                  locale={esLocale}
                  height="auto"
                  allDaySlot={true}
                  slotMinTime={slotMinTime}
                  slotMaxTime={slotMaxTime}
                  dayMaxEvents={true}
                  weekends={true}
                  selectable={true}
                  selectMirror={true}
                  dayMaxEventRows={true}
                  editable={true}
                  droppable={true}
                  views={{
                    timeGridDay: {
                      titleFormat: { year: 'numeric', month: 'long', day: 'numeric' }
                    },
                    timeGridWeek: {
                      titleFormat: { year: 'numeric', month: 'long', day: 'numeric' }
                    },
                    listYear: {
                      titleFormat: { year: 'numeric' },
                      listDayFormat: { weekday: 'long', month: 'long', day: 'numeric' },
                      listDaySideFormat: { year: 'numeric' }
                    }
                  }}
                  buttonText={{
                    today: 'Hoy',
                    month: 'Mes',
                    week: 'Semana',
                    day: 'Día'
                  }}
                  dayHeaderFormat={{ weekday: 'long' }}
                  events={eventosCalendario}
                  eventContent={renderEventContent}
                  eventClassNames="fc-event-with-icon"
                  dateClick={handleDateClick}
                  eventClick={handleEventClick}
                  scrollTime={scrollTime}
                />
              </>
            )}
          </div>
        </div>
      </div>

      {modalOpen && (
        <ModalFecha 
          fecha={selectedDate}
          curso={selectedCurso}
          onClose={closeModal} 
          cursosCalendario={cursosCalendario}
          onCursoSaved={handleCursoSaved}
          feriados={feriados}
        />
      )}

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
          }

          .fc .fc-toolbar-title {
            font-size: 1.5rem !important;
            font-weight: 700;
            color: #1F2937;
          }

          .fc .fc-prev-button, .fc .fc-next-button {
            padding: 0.75rem !important;
            border-radius: 0.75rem !important;
          }

          .fc .fc-today-button {
            padding: 0.75rem 1.5rem !important;
            border-radius: 0.75rem !important;
            font-weight: 600 !important;
          }

          .fc .fc-daygrid-more-link {
            background: rgba(79, 70, 229, 0.1);
            color: #4F46E5;
            border-radius: 0.5rem;
            padding: 2px 6px;
            font-size: 0.85rem;
            font-weight: 500;
            transition: all 0.2s ease;
          }

          .fc .fc-daygrid-more-link:hover {
            background: rgba(79, 70, 229, 0.2);
            transform: translateY(-1px);
          }

          .fc .fc-scrollgrid {
            border: none !important;
          }

          .fc .fc-scrollgrid-section > * {
            border: none !important;
          }

          .fc .fc-scrollgrid-section-header {
            background: #F9FAFB;
          }

          .fc .fc-scrollgrid-section-body {
            background: white;
          }

          .fc .fc-scrollgrid-section-footer {
            background: #F9FAFB;
          }
        `}
      </style>
    </div>
  );
}

export default Curso;
