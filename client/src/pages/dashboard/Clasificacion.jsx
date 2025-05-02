// src/pages/Clasificacion.jsx
import React, { useEffect, useState } from 'react';
import useClasificacionStore from '../../store/clasificacionStore';
import * as iconos from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { encodeId } from '../../utils/hashUtils';
import Modal from '../../components/Modal'; // Importa la Modal

export default function Clasificacion() {
  const { parentClasifications, fetchParentClasifications, loading, error } = useClasificacionStore();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchParentClasifications();
  }, [fetchParentClasifications]);

  if (loading) {
    return <div className="text-center text-xl font-semibold">Cargando...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center font-semibold">{error}</div>;
  }

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-center text-blue-600 mb-12">Clasificaciones Principales</h1>

      <div className="text-center mb-8">
        <button
          onClick={openModal}
          className="rounded-md bg-slate-800 py-2 px-4 text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 ml-2"
        >
          Agregar Clasificación
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-center">
        {parentClasifications && parentClasifications.length > 0 ? (
          parentClasifications.map((clasificacion) => {
            const Icon = iconos[clasificacion.nicono];

            return (
              <div
                key={clasificacion.id_clasificacion}
                className="card bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105"
              >
                <div className="card-body text-center">
                  {Icon ? (
                    <div className="text-center mb-6">
                      <FontAwesomeIcon icon={Icon} size="5x" className="mx-auto" />
                    </div>
                  ) : (
                    <div className="text-center mb-6">
                      <FontAwesomeIcon icon={iconos.faFile} size="5x" className="text-gray-400 mx-auto" />
                    </div>
                  )}

                  <h2 className="text-2xl font-semibold text-gray-800">{clasificacion.nombre}</h2>
                  <p className="text-gray-600 mt-2 mb-4">{clasificacion.descripcion}</p>

                  <div className="flex justify-center">
                    <button
                      onClick={() => navigate(`/dashboard/tipos/${encodeId(clasificacion.id_clasificacion)}`)}
                      className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Ver Subclasificaciones
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="col-span-full text-center text-xl">No hay clasificaciones disponibles.</p>
        )}
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}
