import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useClasificacionStore from '../../store/clasificacionStore';
import * as iconos from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { decodeId  } from '../../utils/hashUtils';
import { decodeParentId  } from '../../utils/hashUtils';
import { useNavigate } from 'react-router-dom';
import EditSubclasificacionModal from '../../components/EditSubclasificacionModal';
import CreateSubclasificacionModal from '../../components/CreateSubclasificacionModal';
import { encodeId } from '../../utils/hashUtils';
import { encodeParentId} from '../../utils/hashUtils';


import DeleteModal from '../../components/DeleteModal';
import { toast } from 'sonner';

export default function Tipos() {
  const navigate = useNavigate();
  const { id: encodedId, parentId: encodedParentId } = useParams();
    console.log(JSON.stringify(useParams())+ " - parentId:"+encodedParentId);
  const realId = decodeId(encodedId);
  const realParentId = decodeParentId(encodedParentId);
  const [busqueda, setBusqueda] = useState('');
  const [ordenAscendente, setOrdenAscendente] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedClasificacion, setSelectedClasificacion] = useState(null);
  const [nombreClasificacion, setNombreClasificacion] = useState('');

  const { 
    subClasificaciones, 
    fetchSubClasificaciones, 
    fetchClasificacionById, 
    deleteClasificacion,
    loading, 
    error 
  } = useClasificacionStore();

  const getClasificacionById = useClasificacionStore(state => state.getClasificacionById);

  // Llamamos a la API para obtener las subclasificaciones y la clasificación padre
  useEffect(() => {
      console.log("useEffect > realParentId: "+realParentId);
    if (realId) {
      fetchSubClasificaciones(realId, realParentId).then(response => {
        if (response?.nombre) {
          setNombreClasificacion(response.nombre);
        }
      });
      
    }
  }, [realId, realParentId, fetchSubClasificaciones, fetchClasificacionById]);

  // Filtrar y ordenar subclasificaciones
  const subClasificacionesFiltradas = subClasificaciones
    .filter(sub => sub.nombre.toLowerCase().includes(busqueda.toLowerCase()))
    .sort((a, b) => {
      const comparacion = a.nombre.localeCompare(b.nombre);
      return ordenAscendente ? comparacion : -comparacion;
    });

// const parent_nombre = subClasificaciones[0].parent_nombre;

// const parent_nombre = subClasificacionesFiltradas[0].parent_nombre;


  // Función para cambiar el orden
  const cambiarOrden = () => {
    setOrdenAscendente(!ordenAscendente);
  };

  // Función para abrir el modal de edición
  const handleEdit = (clasificacion) => {
    console.log('Clasificación seleccionada para editar:', clasificacion);
    setSelectedClasificacion(clasificacion);
    setIsEditModalOpen(true);
  };

  // Función para abrir el modal de eliminación
  const handleDelete = (clasificacion) => {
    console.log('Clasificación a eliminar:', clasificacion);
    console.log('Ícono de la clasificación:', clasificacion.nicono);
    setSelectedClasificacion(clasificacion);
    setIsDeleteModalOpen(true);
  };

  // Función para confirmar la eliminación
  const handleConfirmDelete = async () => {
    try {
      await deleteClasificacion(selectedClasificacion.id_clasificacion);
      toast.success(`Subclasificación "${selectedClasificacion.nombre}" eliminada correctamente`);
      setIsDeleteModalOpen(false);
      setSelectedClasificacion(null);
      // Recargar la lista después de eliminar
      fetchSubClasificaciones(realId);
    } catch (error) {
      console.error('Error al eliminar la clasificación:', error);
      toast.error('Error al eliminar la subclasificación');
    }
  };

  useEffect(() => {
    if (realParentId) {
      const clasificacion = getClasificacionById(realParentId);
      if (clasificacion) {
        setNombreClasificacion(clasificacion.nombre);
      }
    }
  }, [realParentId, getClasificacionById]);
  

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 transform hover:scale-105 transition-transform duration-300">
           
          {subClasificaciones.length > 0 && subClasificaciones[0].parent_icono  && (
            
              <FontAwesomeIcon
               
                icon={iconos[subClasificaciones[0].parent_icono] || iconos.faFile}
                size="lg"
                className="text-blue-600 transform hover:scale-125 transition-all duration-300" 
              />
            )} &nbsp; 
          {subClasificaciones.length > 0 ? subClasificaciones[0].parent_nombre : 'Cargando Subclasificaciones...'}

          

          </h1>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
          >
            <FontAwesomeIcon icon={iconos.faPlus} />
            <span>Crear  {subClasificaciones.length > 0 ? subClasificaciones[0].parent_nombre : ''}</span>
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
                  <tr key="header" className="bg-gradient-to-r from-blue-600 to-cyan-600">
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
                    subClasificacionesFiltradas.map((sub, index) => {
                      const iconName = sub.nicono || 'faFile';
                      const Icon = iconos[iconName] || iconos.faFile;

                      return (
                        <tr
                          key={`row-${sub.id_clasificacion}-${index}`}
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
                              <button 
                                onClick={() => handleDelete(sub)}
                                className="text-red-600 hover:text-red-800 transform hover:scale-110 transition-all duration-300"
                              >
                                <FontAwesomeIcon icon={iconos.faTrash} size="lg" />

                              </button>
                             
                              <button 
                              onClick={() => navigate(`/dashboard/tipos/${encodeId(sub.type_id)}/${encodeParentId(sub.id_clasificacion)}`)}
                              className="text-red-600 hover:text-red-800 transform hover:scale-110 transition-all duration-300"
                              >
                                 <FontAwesomeIcon icon={iconos.faFolderTree} size="lg" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr key="no-results-row">
                      <td colSpan="4" className="py-8 text-center text-gray-500 ">
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
          // nombreClasificacion={subClasificaciones[0].parent_nombre}
        />

        {/* Modal de Creación */}
        <CreateSubclasificacionModal
          isOpen={isCreateModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false);
            fetchSubClasificaciones(realId);
          }}
          parentId={realId}
          nombreClasificacion={subClasificaciones.length > 0 ? subClasificaciones[0].parent_nombre : 'Subclasificación'}
          parentIcono={subClasificaciones.length > 0 ? subClasificaciones[0].parent_icono : null}
        />

        {/* Modal de Eliminación */}
        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedClasificacion(null);
          }}
          onConfirm={handleConfirmDelete}
          itemName={selectedClasificacion?.nombre || ''}
          itemType="subclasificación"
          itemIcon={selectedClasificacion?.nicono ? iconos[selectedClasificacion.nicono] : iconos.faFile}
        />
      </div>
    </div>
  );
}
