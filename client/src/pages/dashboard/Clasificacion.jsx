import React, { useEffect, useState } from 'react';
import useClasificacionStore from '../../store/clasificacionStore';
import * as iconos from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { encodeId } from '../../utils/hashUtils';
import Modal from '../../components/Modal';

export default function Clasificacion() {
  const { parentClasifications, fetchParentClasifications, loading, error } = useClasificacionStore();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchParentClasifications();
  }, [fetchParentClasifications]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-gray-800 mx-auto mb-4"></div>
          <p className="text-lg text-gray-800 font-medium">Cargando clasificaciones...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full mx-4">
          <div className="flex items-center justify-center text-gray-800 mb-4">
            <FontAwesomeIcon icon={iconos.faExclamationTriangle} className="text-4xl animate-bounce" />
          </div>
          <h3 className="text-xl font-semibold text-center text-gray-800 mb-2">¡Ups! Algo salió mal</h3>
          <p className="text-gray-600 text-center">{error}</p>
          <button 
            onClick={() => fetchParentClasifications()}
            className="mt-4 w-full bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors duration-300 flex items-center justify-center gap-2"
          >
            <FontAwesomeIcon icon={iconos.faRedo} />
            <span>Intentar de nuevo</span>
          </button>
        </div>
      </div>
    );
  }

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Encabezado */}
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent animate-fade-in">
            Clasificaciones Principales
          </h1>
          <button
            onClick={openModal}
            className="bg-gray-800 text-white rounded-xl px-6 py-3 font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-2 hover:bg-gray-700"
          >
            <FontAwesomeIcon icon={iconos.faPlus} />
            <span>Agregar</span>
          </button>
        </div>

        {/* Grid de clasificaciones */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {parentClasifications && parentClasifications.length > 0 ? (
            parentClasifications.map((clasificacion, index) => {
              const Icon = iconos[clasificacion.nicono] || iconos.faFile;
              return (
                <div
                  key={clasificacion.id_clasificacion}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up overflow-hidden"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="p-6">
                    <div className="text-center mb-6">
                      <div className="inline-block p-4 rounded-full bg-gray-100">
                        <FontAwesomeIcon 
                          icon={Icon} 
                          size="3x" 
                          className="text-gray-800" 
                        />
                      </div>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 text-center mb-3">
                      {clasificacion.nombre}
                    </h2>
                    <p className="text-gray-600 text-center mb-6 line-clamp-2">
                      {clasificacion.descripcion}
                    </p>
                    <div className="text-center">
                      <button
                        onClick={() => navigate(`/dashboard/tipos/${encodeId(clasificacion.id_clasificacion)}`)}
                        className="inline-flex items-center justify-center px-6 py-2 text-sm font-medium text-white bg-gray-800 rounded-lg hover:shadow-md transition-all duration-300 group hover:bg-gray-700"
                      >
                        Ver Detalles
                        <FontAwesomeIcon 
                          icon={iconos.faArrowRight} 
                          className="ml-2 transform group-hover:translate-x-1 transition-transform duration-300" 
                        />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full flex items-center justify-center py-12">
              <div className="text-center">
                <FontAwesomeIcon icon={iconos.faFolder} className="text-6xl text-gray-800 mb-4" />
                <h3 className="text-xl font-medium text-gray-800 mb-2">
                  No hay clasificaciones
                </h3>
                <p className="text-gray-600">
                  Comienza agregando una nueva clasificación
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} />

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
