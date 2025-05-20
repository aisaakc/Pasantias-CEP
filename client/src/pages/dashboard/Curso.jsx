import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import ModalCurso from '../../components/ModalCurso';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faBriefcase, faCoffee, faUniversity } from '@fortawesome/free-solid-svg-icons'; // Importa faUniversity

function Curso() {
  const [showModal, setShowModal] = useState(false);
  const [selectedEventInfo, setSelectedEventInfo] = useState(null);

  const handleDateClick = (selectInfo) => { // Cambiamos el nombre a handleDateClick para claridad
    setSelectedEventInfo({
      date: selectInfo.startStr.slice(0, 10),
      start: selectInfo.startStr + 'T00:00', // Hora de inicio predeterminada al inicio del día
      end: selectInfo.startStr + 'T01:00',   // Hora de fin predeterminada una hora después
      title: '', // Indicador de que es un nuevo evento
      icon: faUniversity, // Añadimos el icono de universidad para el nuevo curso
      extendedProps: {
        descripcion: '',
        instructor: '',
      },
    });
    setShowModal(true);
  };

  const handleEventClick = (clickInfo) => {
    setSelectedEventInfo({
      date: clickInfo.event.startStr.slice(0, 10), // Conservamos la fecha por si es útil
      start: clickInfo.event.startStr, // Pasamos la cadena completa de inicio (YYYY-MM-DDTHH:mm:ss)
      end: clickInfo.event.endStr,     // Pasamos la cadena completa de fin (YYYY-MM-DDTHH:mm:ss)
      title: clickInfo.event.title,
      idCurso: clickInfo.event.extendedProps.id_Curso, // Usamos el id_Curso correcto
      icon: clickInfo.event.extendedProps.icon,
      extendedProps: clickInfo.event.extendedProps,
    });
    setShowModal(true);
  };

  const eventosConJSX = [
    {
      id: '1',
      title: 'Curso 1',
      start: '2025-05-24T08:00:00',
      end: '2025-05-25T10:00:00',
      icon: faBook,
    //   eventColor: '#FF6B6B',
      color: '#FF6B6B',
      extendedProps: {
        id_Curso: 'CURSO001',
        descripcion: 'Descripción del Curso 1',
        instructor: 'Instructor A',
      },
    },
    {
      id: '2',
      title: 'Curso 2',
      start: '2025-05-24T08:00:00',
      end: '2025-05-24T12:00:00',
      icon: faBriefcase,
      color: '#4ECDC4',
      extendedProps: {
        id_Curso: 'CURSO002',
        descripcion: 'Descripción del Curso 2',
        instructor: 'Instructor B',
      },
    },
    {
      id: '3',
      title: 'Curso 3',
      start: '2025-05-24T09:00:00',
      end: '2025-05-25T15:00:00',
      icon: faCoffee,
      color: '#FFD93D',
      extendedProps: {
        id_Curso: 'CURSO003',
        descripcion: 'Descripción del Curso 3',
        instructor: 'Instructor C',
      },
    },
  ];

  const renderEventContent = (eventInfo) => {
    return (
      <>
        <FontAwesomeIcon icon={eventInfo.event.extendedProps.icon} className="mr-2" />
        <span>{eventInfo.event.title}</span>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <h1 className="text-xl font-semibold text-gray-900">Calendario Académico</h1>
          </div>
          <div className="p-4 sm:p-6">
            <div className="[&_.fc]:font-sans [&_.fc]:text-sm">
              <div className="[&_.fc-toolbar]:bg-gray-50 [&_.fc-toolbar]:p-4 [&_.fc-toolbar]:rounded-lg [&_.fc-toolbar]:mb-6 [&_.fc-toolbar]:border [&_.fc-toolbar]:border-gray-200">
                <div className="[&_.fc-button]:bg-gray-700 [&_.fc-button]:border-gray-700 [&_.fc-button]:text-white [&_.fc-button]:px-4 [&_.fc-button]:py-2 [&_.fc-button]:text-sm [&_.fc-button]:font-medium [&_.fc-button]:rounded [&_.fc-button]:hover:bg-gray-800 [&_.fc-button]:hover:border-gray-800 [&_.fc-button-active]:bg-gray-900 [&_.fc-button-active]:border-gray-900">
                  <div className="[&_.fc-toolbar-title]:text-lg [&_.fc-toolbar-title]:font-semibold [&_.fc-toolbar-title]:text-gray-900">
                    <div className="[&_.fc-daygrid]:bg-white [&_.fc-daygrid-day]:border-gray-200 [&_.fc-daygrid-day-number]:text-gray-700 [&_.fc-day-today]:bg-gray-50 [&_.fc-day-today_.fc-daygrid-day-number]:bg-gray-700 [&_.fc-day-today_.fc-daygrid-day-number]:text-white [&_.fc-day-today_.fc-daygrid-day-number]:rounded-full [&_.fc-day-today_.fc-daygrid-day-number]:w-6 [&_.fc-day-today_.fc-daygrid-day-number]:h-6 [&_.fc-day-today_.fc-daygrid-day-number]:flex [&_.fc-day-today_.fc-daygrid-day-number]:items-center [&_.fc-day-today_.fc-daygrid-day-number]:justify-center">
                      <div className="[&_.fc-event]:bg-gray-700 [&_.fc-event]:text-white [&_.fc-event]:border-l-4 [&_.fc-event]:border-gray-800 [&_.fc-event]:px-3 [&_.fc-event]:py-1.5 [&_.fc-event]:text-sm [&_.fc-event]:font-medium [&_.fc-event]:hover:bg-gray-800">
                        <div className="[&_.fc-list]:bg-white [&_.fc-list-event]:hover:bg-gray-50 [&_.fc-list-event-time]:text-gray-600 [&_.fc-list-event-title]:text-gray-900 [&_.fc-list-event-title]:font-medium">
                          <div className="[&_.fc-timegrid]:bg-white [&_.fc-timegrid-slot]:h-14 [&_.fc-timegrid-axis]:text-gray-600 [&_.fc-timegrid-slot-label]:text-gray-600">
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
                              select={handleDateClick} // Usamos la prop 'select'
                              eventClick={handleEventClick}
                              dayMaxEvents={true}
                              weekends={true}
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
                                  titleFormat: { year: 'numeric', month: 'long', day: 'numeric' }
                                }
                              }}
                              dayHeaderFormat={{ weekday: 'long' }}
                              events={eventosConJSX}
                              eventContent={renderEventContent}
                              selectable={true} // Asegúrate de que selectable esté habilitado
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ModalCurso
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        selectedEventInfo={selectedEventInfo}
      />
    </div>
  );
}

export default Curso;