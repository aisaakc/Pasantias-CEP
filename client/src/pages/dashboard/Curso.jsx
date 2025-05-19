import React, { useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import interactionPlugin from '@fullcalendar/interaction'
import esLocale from '@fullcalendar/core/locales/es'
import Modal from '../../components/Modal'
import { Formik, Form, Field } from 'formik'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons'

function Curso() {
  const [showModal, setShowModal] = useState(false)
  const [selectedStartDate, setSelectedStartDate] = useState(null)

  const handleDateClick = (clickInfo) => {
    setSelectedStartDate(clickInfo.date)
    setShowModal(true)
  }

  const initialValues = {
    fecha_fin: ''
  }

  const handleSubmit = (values) => {
    if (!values.fecha_fin) return
    
    const endDate = new Date(values.fecha_fin)
    if (endDate < selectedStartDate) {
      alert('La fecha de finalización debe ser posterior a la fecha de inicio')
      return
    }

    console.log('Nuevo curso:', {
      start: selectedStartDate,
      end: endDate
    })
    setShowModal(false)
  }

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
                              dateClick={handleDateClick}
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
                              events={[
                                
                              ]}
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
    </div>
  )
}

export default Curso