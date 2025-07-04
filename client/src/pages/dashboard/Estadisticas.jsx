import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar } from '@fortawesome/free-solid-svg-icons';

export default function Estadisticas() {
  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
            <FontAwesomeIcon icon={faChartBar} className="mr-3 text-blue-600" />
            Estadísticas
          </h1>
          <p className="text-gray-600">Visualiza estadísticas y reportes del sistema.</p>
        </div>
      </div>
    </div>
  )
}
