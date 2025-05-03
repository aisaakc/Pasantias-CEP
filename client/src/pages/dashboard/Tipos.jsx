import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useClasificacionStore from '../../store/clasificacionStore';
import * as iconos from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { decodeId } from '../../utils/hashUtils';
import EditSubclasificacionModal from '../../components/EditSubclasificacionModal';
import CreateSubclasificacionModal from '../../components/CreateSubclasificacionModal';

export default function Tipos() {
  const { id: encodedId } = useParams();
  const realId = decodeId(encodedId);
  const [busqueda, setBusqueda] = useState('');
  const [ordenAscendente, setOrdenAscendente] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedClasificacion, setSelectedClasificacion] = useState(null);

  const { subClasificaciones, fetchSubClasificaciones, loading, error } = useClasificacionStore();

  // Llamamos a la API para obtener las subclasificaciones con el id real decodificado
  useEffect(() => {
    if (realId) {
      fetchSubClasificaciones(realId);
    }
  }, [realId, fetchSubClasificaciones]);

  // Filtrar y ordenar subclasificaciones
  const subClasificacionesFiltradas = subClasificaciones
    .filter(sub => sub.nombre.toLowerCase().includes(busqueda.toLowerCase()))
    .sort((a, b) => {
      const comparacion = a.nombre.localeCompare(b.nombre);
      return ordenAscendente ? comparacion : -comparacion;
    });

  // Función para cambiar el orden
  const cambiarOrden = () => {
    setOrdenAscendente(!ordenAscendente);
  };

  // Función para abrir el modal de edición
  const handleEdit = (clasificacion) => {
    setSelectedClasificacion(clasificacion);
    setIsEditModalOpen(true);
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 transform hover:scale-105 transition-transform duration-300">
            Subclasificaciones
          </h1>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
          >
            <FontAwesomeIcon icon={iconos.faPlus} />
            <span>Crear Subclasificación</span>
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md animate-fade-in">
            <div className="flex items-center">
              <FontAwesomeIcon icon={iconos.faExclamationCircle} className="mr-2" />
              <p>{error}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white p-4 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
              <div className="flex items-center">
                <div className="relative flex-1 max-w-md">
                  <FontAwesomeIcon 
                    icon={iconos.faSearch} 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder="Buscar por nombre..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:shadow-md"
                  />
                </div>
                <div className="ml-4">
                  <span className="text-sm text-gray-600">
                    {subClasificacionesFiltradas.length} resultados encontrados
                  </span>
                </div>
              </div>
            </div>

            <div className="overflow-hidden bg-white rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600 to-cyan-600">
                    <th 
                      className="py-4 px-6 text-left text-sm uppercase tracking-wider cursor-pointer group transition-colors duration-300"
                      onClick={cambiarOrden}
                    >
                      <div className="flex items-center space-x-2 text-white">
                        <span>Nombre</span>
                        <FontAwesomeIcon 
                          icon={ordenAscendente ? iconos.faSortAlphaDown : iconos.faSortAlphaUp}
                          className="transform group-hover:scale-110 transition-all duration-300"
                        />
                      </div>
                    </th>
                    <th className="py-4 px-6 text-left text-sm uppercase tracking-wider text-white">Descripción</th>
                    <th className="py-4 px-6 text-center text-sm uppercase tracking-wider text-white">Ícono</th>
                    <th className="py-4 px-6 text-center text-sm uppercase tracking-wider text-white">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {subClasificacionesFiltradas.length > 0 ? (
                    subClasificacionesFiltradas.map((sub) => {
                      const iconName = sub.nicono || 'faFile';
                      const Icon = iconos[iconName] || iconos.faFile;

                      return (
                        <tr
                          key={sub.id_clasificacion}
                          className="transform hover:scale-[1.01] hover:bg-blue-50 transition-all duration-300"
                        >
                          <td className="py-4 px-6 font-medium text-gray-800">{sub.nombre}</td>
                          <td className="py-4 px-6 text-gray-600">{sub.descripcion}</td>
                          <td className="py-4 px-6 text-center">
                            <FontAwesomeIcon 
                              icon={Icon} 
                              size="lg"
                              className="text-blue-600 transform hover:scale-125 transition-all duration-300" 
                            />
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex justify-center space-x-4">
                              <button 
                                onClick={() => handleEdit(sub)}
                                className="text-blue-600 hover:text-blue-800 transform hover:scale-110 transition-all duration-300"
                              >
                                <FontAwesomeIcon icon={iconos.faPen} size="lg" />
                              </button>
                              <button className="text-red-600 hover:text-red-800 transform hover:scale-110 transition-all duration-300">
                                <FontAwesomeIcon icon={iconos.faTrash} size="lg" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="4" className="py-8 text-center text-gray-500 animate-pulse">
                        <FontAwesomeIcon icon={iconos.faInbox} className="text-4xl mb-2" />
                        <p>No hay subclasificaciones que coincidan con tu búsqueda.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal de Edición */}
        <EditSubclasificacionModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedClasificacion(null);
            fetchSubClasificaciones(realId);
          }}
          clasificacionToEdit={selectedClasificacion}
        />

        {/* Modal de Creación */}
        <CreateSubclasificacionModal
          isOpen={isCreateModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false);
            fetchSubClasificaciones(realId);
          }}
          parentId={realId}
        />
      </div>
    </div>
  );
}
