import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faBook, faChalkboardTeacher, faUser, faMoneyBill } from '@fortawesome/free-solid-svg-icons';
import * as iconos from '@fortawesome/free-solid-svg-icons';
import { useCursoStore } from '../../store/cursoStore';
import ModalFecha from '../../components/ModalCurso';

function Curso() {
  const navigate = useNavigate();
  const { fetchCursos, loading, error, modalidades, fetchOpcionesCurso, cursos } = useCursoStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCurso, setSelectedCurso] = useState(null);
  const [cursosCalendario, setCursosCalendario] = useState([]);
  const [currentView, setCurrentView] = useState('dayGridMonth');
  const calendarRef = React.useRef(null);

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

  useEffect(() => {
    loadCursos();
    fetchOpcionesCurso();
  }, [fetchCursos, fetchOpcionesCurso]);

  const handleCursoSaved = async () => {
    await loadCursos();
  };

  const handleCursoSelect = (e) => {
    const cursoId = e.target.value;
    if (cursoId) {
      navigate(`/dashboard/horario-curso/${cursoId}`);
    }
  };

  const eventosCalendario = React.useMemo(() => {
    if (!Array.isArray(cursosCalendario)) return [];
    return cursosCalendario
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
  }, [cursosCalendario]);

  const renderEventContent = (eventInfo) => {
    const icon = eventInfo.event.extendedProps.icon;
    const status = eventInfo.event.extendedProps.estado;
    const modalidad = eventInfo.event.extendedProps.modalidad;
    const instructor = eventInfo.event.extendedProps.instructor;
    const costo = eventInfo.event.extendedProps.costo;

    // Si estamos en vista de lista, mostrar un diseño más detallado
    if (eventInfo.view.type === 'listWeek' || eventInfo.view.type === 'listMonth') {
      return (
        <div className="flex flex-col p-4 space-y-3">
          <div className="flex items-center gap-3">
            {icon && <FontAwesomeIcon icon={icon} className="text-white text-lg" />}
            <span className="font-semibold text-lg">{eventInfo.event.title}</span>
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">{status}</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 bg-white/10 p-2 rounded-lg">
              <FontAwesomeIcon icon={faChalkboardTeacher} className="text-white/80" />
              <span>{modalidad}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 p-2 rounded-lg">
              <FontAwesomeIcon icon={faUser} className="text-white/80" />
              <span>{instructor}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 p-2 rounded-lg">
              <FontAwesomeIcon icon={faMoneyBill} className="text-white/80" />
              <span>${costo}</span>
            </div>
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
    setSelectedDate(arg.dateStr);
    setSelectedCurso(null);
    setModalOpen(true);
  };

  const handleEventClick = (info) => {
    const cursoId = info.event.id;
    const curso = cursosCalendario.find(c => c.id_curso === parseInt(cursoId));
    setSelectedCurso(curso);
    setModalOpen(true);
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
                  {cursosCalendario && Object.entries(
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
                      {group.map((curso) => (
                        <option key={curso.id_curso} value={curso.id_curso}>
                          {curso.nombre_curso}
                        </option>
                      ))}
                    </optgroup>
                  ))}
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
                </div>
                <FullCalendar
                  ref={calendarRef}
                  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
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
                  dayMaxEvents={true}
                  weekends={true}
                  selectable={true}
                  selectMirror={true}
                  dayMaxEventRows={true}
                  editable={true}
                  droppable={true}
                  buttonText={{
                    today: 'Hoy',
                    month: 'Mes',
                    week: 'Semana',
                    day: 'Día'
                  }}
                  views={{
                    timeGridDay: {
                      titleFormat: { year: 'numeric', month: 'long', day: 'numeric' }
                    },
                    timeGridWeek: {
                      titleFormat: { year: 'numeric', month: 'long', day: 'numeric' }
                    }
                  }}
                  dayHeaderFormat={{ weekday: 'long' }}
                  events={eventosCalendario}
                  eventContent={renderEventContent}
                  eventClassNames="fc-event-with-icon"
                  dateClick={handleDateClick}
                  eventClick={handleEventClick}
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
        />
      )}

      <style>
        {`
          :root {
            --fc-border-color: #e2e8f0;
            --fc-button-bg-color: #2563eb;
            --fc-button-border-color: #2563eb;
            --fc-button-hover-bg-color: #1d4ed8;
            --fc-button-hover-border-color: #1e40af;
            --fc-button-active-bg-color: #1e40af;
            --fc-button-active-border-color: #1e3a8a;
            --fc-today-bg-color: #f8fafc;
            --fc-neutral-bg-color: #ffffff;
            --fc-list-event-hover-bg-color: #f8fafc;
            --fc-event-border-color: transparent;
            --fc-event-bg-color: #4F46E5;
            --fc-event-text-color: #ffffff;
          }

          .fc {
            background: white;
            border-radius: 0.75rem;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
          }

          .fc-theme-standard td, .fc-theme-standard th {
            border-color: var(--fc-border-color);
          }

          .fc .fc-daygrid-day {
            transition: all 0.2s ease;
          }

          .fc .fc-daygrid-day:hover {
            background-color: #f8fafc;
            transform: scale(1.02);
          }

          .fc .fc-day-today {
            background-color: #f0f9ff !important;
          }

          .fc .fc-daygrid-day-number {
            padding: 8px;
            color: #64748b;
            font-weight: 500;
            transition: all 0.2s ease;
          }

          .fc .fc-daygrid-day:hover .fc-daygrid-day-number {
            color: #1e293b;
            transform: scale(1.1);
          }

          .fc .fc-col-header-cell {
            padding: 12px 0;
            background-color: #f8fafc;
            transition: all 0.2s ease;
          }

          .fc .fc-col-header-cell:hover {
            background-color: #f1f5f9;
          }

          .fc .fc-col-header-cell-cushion {
            padding: 8px;
            color: #1e293b;
            font-weight: 600;
            text-decoration: none;
            transition: all 0.2s ease;
          }

          .fc .fc-col-header-cell:hover .fc-col-header-cell-cushion {
            color: #4f46e5;
          }

          .fc-event {
            border-radius: 0.5rem;
            border: none;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
            transition: all 0.3s ease;
            cursor: pointer;
          }

          .fc-event:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }

          .fc-event-with-icon {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem;
          }

          .fc-list {
            border-radius: 0.75rem;
            overflow: hidden;
            transition: all 0.3s ease;
          }

          .fc-list-event:hover td {
            background-color: #f8fafc;
            transform: translateX(5px);
          }

          .fc-list-event-time {
            font-weight: 500;
            padding: 1rem;
            color: #64748b;
            transition: all 0.2s ease;
          }

          .fc-list-event:hover .fc-list-event-time {
            color: #4f46e5;
          }

          .fc-list-event-title a {
            font-weight: 600;
            padding: 1rem;
            color: #1e293b;
            transition: all 0.2s ease;
          }

          .fc-list-event:hover .fc-list-event-title a {
            color: #4f46e5;
          }

          .fc-list-day-cushion {
            background-color: #f8fafc !important;
            padding: 1rem !important;
            transition: all 0.2s ease;
          }

          .fc-list-day-cushion:hover {
            background-color: #f1f5f9 !important;
          }

          .fc-list-day-text, .fc-list-day-side-text {
            font-weight: 600;
            color: #1e293b;
            font-size: 1.1rem;
            transition: all 0.2s ease;
          }

          .fc-list-day-cushion:hover .fc-list-day-text,
          .fc-list-day-cushion:hover .fc-list-day-side-text {
            color: #4f46e5;
          }

          .fc-timegrid-slot {
            height: 3em !important;
            transition: all 0.2s ease;
          }

          .fc-timegrid-slot:hover {
            background-color: #f8fafc;
          }

          .fc-timegrid-slot-label {
            font-size: 0.875rem;
            color: #64748b;
            transition: all 0.2s ease;
          }

          .fc-timegrid-slot:hover .fc-timegrid-slot-label {
            color: #4f46e5;
          }

          .fc-timegrid-now-indicator-line {
            border-color: #ef4444;
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
            font-weight: 500;
            padding: 0.5rem 1rem;
            border-radius: 0.375rem;
            transition: all 0.3s ease;
          }

          .fc .fc-button-primary:hover {
            background-color: var(--fc-button-hover-bg-color);
            border-color: var(--fc-button-hover-border-color);
            transform: translateY(-2px);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }

          .fc .fc-button-primary:active {
            transform: translateY(0);
          }
        `}
      </style>
    </div>
  );
}

export default Curso;
