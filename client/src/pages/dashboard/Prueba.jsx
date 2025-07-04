import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';

// URL base del backend
const API_URL = 'http://localhost:3001';

function Prueba() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGeneratePDF = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Iniciando generación de PDF...');
      
      const response = await axios.post(`${API_URL}/api/pdf/generate-certificate`, {
        participantName: "Juan Pérez",
        courseName: "Desarrollo Web Avanzado",
        institutionName: "Instituto de Tecnología",
        startDate: "01/01/2024",
        endDate: "31/01/2024",
        duration: "40",
        city: "Ciudad de México",
        day: "15",
        month: "Enero",
        year: "2024",
        facilitatorName: "María González",
        directorName: "Dr. Carlos Rodríguez",
        logoPath: "/logos/default-logo.png"
      }, {
        responseType: 'blob',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/pdf'
        }
      });

      console.log('PDF generado exitosamente');

      // Crear un blob con el PDF
      const blob = new Blob([response.data], { type: 'application/pdf' });
      
      // Crear una URL para el blob
      const url = window.URL.createObjectURL(blob);
      
      // Crear un enlace temporal y hacer clic en él para descargar
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'certificado.pdf');
      document.body.appendChild(link);
      link.click();
      
      // Limpiar
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error completo:', err);
      
      let errorMessage = 'Error al generar el PDF: ';
      
      if (err.code === 'ERR_NETWORK') {
        errorMessage += 'No se pudo conectar al servidor. Asegúrate de que el servidor backend esté corriendo en el puerto 3001.';
      } else if (err.response) {
        // El servidor respondió con un código de estado fuera del rango 2xx
        errorMessage += err.response.data?.error || `Error del servidor: ${err.response.status}`;
      } else if (err.request) {
        // La petición fue hecha pero no se recibió respuesta
        errorMessage += 'No se recibió respuesta del servidor.';
      } else {
        // Algo sucedió al configurar la petición
        errorMessage += err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
            <FontAwesomeIcon icon={faFilePdf} className="mr-3 text-blue-600" />
            Generar de Certificados
          </h1>
          <p className="text-gray-600">Genera certificados PDF personalizados para los participantes de los cursos.</p>
        </div>
        <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 max-w-2xl">
          <div className="space-y-4">
            <p className="text-gray-600">
              Haz clic en el botón para generar un certificado de ejemplo.
            </p>
            
            <button
              onClick={handleGeneratePDF}
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all duration-200 ${
                loading 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? 'Generando PDF...' : 'Generar Certificado'}
            </button>

            {error && (
              <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Prueba;