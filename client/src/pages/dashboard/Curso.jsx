import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faBook, faChalkboardTeacher, faUser, faMoneyBill } from '@fortawesome/free-solid-svg-icons';
import * as iconos from '@fortawesome/free-solid-svg-icons';
import { useCursoStore } from '../../store/cursoStore';
import ModalFecha from '../../components/ModalCurso';

function Curso() {
  const { fetchCursos, loading, error, modalidades } = useCursoStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCurso, setSelectedCurso] = useState(null);
  const [cursosCalendario, setCursosCalendario] = useState([]);

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
  }, [fetchCursos]);

  const handleCursoSaved = async () => {
    await loadCursos();
  };

  const eventosCalendario = React.useMemo(() => {
    if (!Array.isArray(cursosCalendario)) return [];
    return cursosCalendario
      .filter(curso => curso && curso.id_curso && curso.fecha_hora_inicio && curso.fecha_hora_fin)
      .map(curso => ({
        id: String(curso.id_curso),
        title: curso.nombre_curso || 'Curso sin nombre',
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <h1 className="text-xl font-semibold text-gray-900">Calendario Académico</h1>
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
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
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
                  day: 'Día',
                  list: 'Lista'
                }}
                views={{
                  timeGridDay: {
                    titleFormat: { year: 'numeric', month: 'long', day: 'numeric' }
                  },
                  timeGridWeek: {
                    titleFormat: { year: 'numeric', month: 'long', day: 'numeric' }
                  },
                  listWeek: {
                    titleFormat: { year: 'numeric', month: 'long', day: 'numeric' },
                    listDayFormat: { weekday: 'long', day: 'numeric', month: 'long' },
                    listDaySideFormat: { year: 'numeric' },
                    noEventsMessage: 'No hay cursos programados para esta semana'
                  }
                }}
                dayHeaderFormat={{ weekday: 'long' }}
                events={eventosCalendario}
                eventContent={renderEventContent}
                eventClassNames="fc-event-with-icon"
                dateClick={handleDateClick}
                eventClick={handleEventClick}
              />
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
          }

          .fc-theme-standard td, .fc-theme-standard th {
            border-color: var(--fc-border-color);
          }

          .fc .fc-daygrid-day {
            transition: background-color 0.2s;
          }

          .fc .fc-daygrid-day:hover {
            background-color: #f8fafc;
          }

          .fc .fc-day-today {
            background-color: var(--fc-today-bg-color) !important;
          }

          .fc .fc-daygrid-day-number {
            padding: 8px;
            color: #64748b;
            font-weight: 500;
          }

          .fc .fc-col-header-cell {
            padding: 12px 0;
            background-color: #f8fafc;
          }

          .fc .fc-col-header-cell-cushion {
            padding: 8px;
            color: #1e293b;
            font-weight: 600;
            text-decoration: none;
          }

          .fc-event {
            border-radius: 0.5rem;
            border: none;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
            transition: all 0.2s ease;
          }

          .fc-event:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }

          .fc-event-with-icon {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem;
            cursor: pointer;
          }

          .fc-event-with-icon .fa {
            font-size: 1rem;
          }

          .fc-list {
            border-radius: 0.75rem;
            overflow: hidden;
          }

          .fc-list-event:hover td {
            background-color: var(--fc-list-event-hover-bg-color);
          }

          .fc-list-event-time {
            font-weight: 500;
            padding: 1rem;
            color: #64748b;
          }

          .fc-list-event-title a {
            font-weight: 600;
            padding: 1rem;
            color: #1e293b;
          }

          .fc-list-day-cushion {
            background-color: #f8fafc !important;
            padding: 1rem !important;
          }

          .fc-list-day-text, .fc-list-day-side-text {
            font-weight: 600;
            color: #1e293b;
            font-size: 1.1rem;
          }

          .fc-list-table {
            border-spacing: 0 0.5rem;
            border-collapse: separate;
          }

          .fc-list-event td {
            padding: 0.75rem 1rem;
            border-color: var(--fc-border-color);
          }

          .fc-list-event-graphic {
            padding: 0 1rem;
          }

          .fc-list-event-time {
            min-width: 150px;
          }

          .fc-list-event-title {
            min-width: 300px;
          }

          .fc-list-empty {
            padding: 2rem;
            text-align: center;
            color: #64748b;
            font-size: 1.1rem;
          }

          .fc-timegrid-slot {
            height: 3em !important;
          }

          .fc-timegrid-slot-label {
            font-size: 0.875rem;
            color: #64748b;
          }

          .fc-timegrid-axis {
            padding: 1rem;
            color: #64748b;
            font-weight: 500;
          }

          .fc-timegrid-slot-minor {
            border-top-style: dashed;
          }

          .fc-timegrid-now-indicator-line {
            border-color: #ef4444;
          }

          .fc-timegrid-now-indicator-arrow {
            border-color: #ef4444;
          }

          .fc .fc-button-primary {
            background-color: var(--fc-button-bg-color);
            border-color: var(--fc-button-border-color);
            color: white;
            font-weight: 500;
            padding: 0.5rem 1rem;
            border-radius: 0.375rem;
            transition: all 0.2s ease;
          }

          .fc .fc-button-primary:hover {
            background-color: var(--fc-button-hover-bg-color);
            border-color: var(--fc-button-hover-border-color);
            transform: translateY(-1px);
          }

          .fc .fc-button-primary:active {
            background-color: var(--fc-button-active-bg-color);
            border-color: var(--fc-button-active-border-color);
            transform: translateY(0);
          }

          .fc .fc-button-primary:not(:disabled):active,
          .fc .fc-button-primary:not(:disabled).fc-button-active {
            background-color: var(--fc-button-active-bg-color);
            border-color: var(--fc-button-active-border-color);
          }

          .fc .fc-button-primary:disabled {
            background-color: #93c5fd;
            border-color: #93c5fd;
            opacity: 0.7;
          }
        `}
      </style>
    </div>
  );
}

export default Curso;
