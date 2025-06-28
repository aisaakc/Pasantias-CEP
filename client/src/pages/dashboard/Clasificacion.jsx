import React, { useEffect, useState } from 'react';
import useClasificacionStore from '../../store/clasificacionStore';
import useAuthStore from '../../store/authStore';
import { CLASSIFICATION_IDS } from '../../config/classificationIds';
import * as iconos from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { encodeId } from '../../utils/hashUtils';
import Modal from '../../components/Modal';
import DeleteModal from '../../components/DeleteModal';
import { toast } from 'sonner';

export default function Clasificacion() {
  const { 
    parentClasifications, 
    fetchParentClasifications, 
    deleteClasificacion,
    loading, 
    error 
  } = useClasificacionStore();
  const { tienePermiso, filtrarClasificacionesPorPermiso } = useAuthStore();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteData, setDeleteData] = useState(null);

  // Verificar si el usuario tiene acceso al menú de configuraciones
  const tieneAccesoConfiguracion = tienePermiso(CLASSIFICATION_IDS.MN_CONFIGURACION);

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

  if (!tieneAccesoConfiguracion) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full mx-4 text-center">
          <div className="flex items-center justify-center text-yellow-500 mb-4">
            <FontAwesomeIcon icon={iconos.faExclamationTriangle} className="text-4xl animate-bounce" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Acceso restringido</h3>
          <p className="text-gray-600 mb-4">
            No tienes permisos para acceder a las configuraciones. Por favor, contacta al administrador para que te asigne los permisos necesarios.
          </p>
        </div>
      </div>
    );
  }

  const openModal = () => {
    setEditData(null);
    setIsModalOpen(true);
  };

  const openEditModal = (clasificacion) => {
    setEditData(clasificacion);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditData(null);
  };

  const openDeleteModal = (clasificacion) => {
    setDeleteData(clasificacion);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeleteData(null);
  };

  const handleDelete = async () => {
    try {
      await deleteClasificacion(deleteData.id_clasificacion);
      toast.success(`Clasificación "${deleteData.nombre}" eliminada correctamente`);
      closeDeleteModal();
    } catch (err) {
      console.error("Error al eliminar:", err);
      toast.error('Error al eliminar la clasificación');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Encabezado */}
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 animate-fade-in py-1 leading-tight flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-100 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <FontAwesomeIcon 
                icon={iconos.faCog} 
                className="text-blue-600 relative z-10 animate-spin-slow group-hover:animate-spin-slow-hover transition-all duration-300" 
                size="lg"
              />
            </div>
            <span className="relative bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent pb-1">
              Configuraciones
              <div className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 group-hover:w-full transition-all duration-300"></div>
            </span>
          </h1>
          {!tienePermiso(CLASSIFICATION_IDS.CF_AGREGAR) && (
            <button
              onClick={openModal}
              className="bg-blue-600 text-white rounded-xl px-6 py-3 font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-2 hover:bg-blue-900">
              <FontAwesomeIcon icon={iconos.faPlus} />
              <span>Crear Clasificación</span>
            </button>
          )}
        </div>

        {/* Grid de clasificaciones */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {parentClasifications && parentClasifications.length > 0 ? (
            filtrarClasificacionesPorPermiso(parentClasifications)
              .map((clasificacion, index) => {
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
                    <h2 className="text-2xl font-bold text-center mb-3 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                      {clasificacion.nombre}
                    </h2>
                    <p className="text-gray-600 text-center mb-6 line-clamp-2">
                    {(clasificacion.descripcion) ? clasificacion.descripcion : <span className="text-gray-300">&lt; sin descripción &gt;</span> 
    }
                    </p>
                    <div className="flex justify-center space-x-3">
                      <button
                      title={'Ver detalles de '+clasificacion.nombre}
                        onClick={() => navigate(`/dashboard/tipos/${encodeId(clasificacion.id_clasificacion)}`)}
                        className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:shadow-md transition-all duration-300 group hover:bg-blue-700">
                        <FontAwesomeIcon 
                          icon={iconos.faList} 
                        />
                      </button>
                      <button
                        title={'Editar '+clasificacion.nombre}
                        onClick={() => openEditModal(clasificacion)}
                        className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:shadow-md transition-all duration-300 group hover:bg-blue-700"
                      >
                        <FontAwesomeIcon icon={iconos.faEdit} />
                      </button>
                      <button
                        title={'Eliminar '+clasificacion.nombre}
                        onClick={() => openDeleteModal(clasificacion)}
                        className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:shadow-md transition-all duration-300 group hover:bg-red-700"
                      >
                        <FontAwesomeIcon icon={iconos.faTrash} />
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

      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        editData={editData} 
        parentInfo={null}
      />
      <DeleteModal 
        isOpen={isDeleteModalOpen} 
        onClose={closeDeleteModal} 
        onConfirm={handleDelete}
        itemName={deleteData?.nombre}
        itemType="clasificación"
        itemIcon={deleteData?.nicono ? iconos[deleteData.nicono] : iconos.faFile}
      />

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

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes spin-slow-hover {
          from {
            transform: rotate(0deg) scale(1.1);
          }
          to {
            transform: rotate(360deg) scale(1.1);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }

        .animate-spin-slow-hover {
          animation: spin-slow-hover 4s linear infinite;
        }
      `}</style>
    </div>
  );
}
