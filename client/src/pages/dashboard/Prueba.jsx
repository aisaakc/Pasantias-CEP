import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';

// URL base del backend
const API_URL = 'http://localhost:3001';

function Prueba() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleGeneratePDF = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

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
        },
        timeout: 120000 // 2 minutos de timeout
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

      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000); // Ocultar mensaje después de 5 segundos
    } catch (err) {
      console.error('Error completo:', err);
      
      let errorMessage = 'Error al generar el PDF: ';
      
      if (err.code === 'ERR_NETWORK') {
        errorMessage += 'No se pudo conectar al servidor. Asegúrate de que el servidor backend esté corriendo en el puerto 3001.';
      } else if (err.code === 'ECONNABORTED') {
        errorMessage += 'La solicitud tardó demasiado tiempo. El servidor puede estar sobrecargado o tener problemas de rendimiento.';
      } else if (err.response) {
        // El servidor respondió con un código de estado fuera del rango 2xx
        if (err.response.data instanceof Blob) {
          // Si la respuesta es un blob, intentar leer el error
          try {
            const errorText = await err.response.data.text();
            const errorData = JSON.parse(errorText);
            errorMessage += errorData.error || `Error del servidor: ${err.response.status}`;
          } catch (parseError) {
            errorMessage += `Error del servidor: ${err.response.status} - ${err.response.statusText}`;
          }
        } else {
          errorMessage += err.response.data?.error || `Error del servidor: ${err.response.status}`;
        }
      } else if (err.request) {
        // La petición fue hecha pero no se recibió respuesta
        errorMessage += 'No se recibió respuesta del servidor. Verifica que el backend esté funcionando.';
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
            Generador de Certificados
          </h1>
          <p className="text-gray-600">Genera certificados PDF personalizados para los participantes de los cursos.</p>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 max-w-2xl">
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">Información del Certificado de Prueba</h3>
              <div className="text-sm text-blue-700 space-y-1">
                <p><strong>Participante:</strong> Juan Pérez</p>
                <p><strong>Curso:</strong> Desarrollo Web Avanzado</p>
                <p><strong>Institución:</strong> Instituto de Tecnología</p>
                <p><strong>Duración:</strong> 40 horas</p>
                <p><strong>Fecha:</strong> Enero 2024</p>
              </div>
            </div>
            
            <p className="text-gray-600">
              Haz clic en el botón para generar un certificado de ejemplo. Este proceso puede tardar unos segundos.
            </p>
            
            <button
              onClick={handleGeneratePDF}
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all duration-200 ${
                loading 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Generando PDF...
                </div>
              ) : (
                'Generar Certificado de Prueba'
              )}
            </button>

            {success && (
              <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  ¡Certificado generado exitosamente! Se ha descargado automáticamente.
                </div>
              </div>
            )}

            {error && (
              <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                <div className="flex items-start">
                  <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-semibold">Error al generar el certificado:</p>
                    <p className="mt-1">{error}</p>
                    <div className="mt-3 text-sm">
                      <p className="font-medium">Sugerencias para resolver el problema:</p>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        <li>Verifica que el servidor backend esté ejecutándose en el puerto 3001</li>
                        <li>Asegúrate de que Chrome esté instalado en tu sistema</li>
                        <li>Revisa la consola del navegador para más detalles del error</li>
                        <li>Si el problema persiste, contacta al administrador del sistema</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">Notas Técnicas:</h4>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>El sistema detecta automáticamente si Chrome está instalado en tu PC</li>
                <li>Si no encuentra Chrome, usa el navegador incluido con Puppeteer</li>
                <li>El proceso incluye timeouts para evitar bloqueos indefinidos</li>
                <li>Los certificados se generan en formato A4 horizontal con fondo</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Prueba;