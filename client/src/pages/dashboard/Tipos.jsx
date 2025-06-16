import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import useClasificacionStore from '../../store/clasificacionStore';
import useAuthStore from '../../store/authStore';
import { CLASSIFICATION_IDS } from '../../config/classificationIds';
import * as iconos from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { decodeId, decodeParentId, encodeId, encodeParentId } from '../../utils/hashUtils';
import DeleteModal from '../../components/DeleteModal';
import Modal from '../../components/Modal';
import { toast } from 'sonner';
import { getParentHierarchy } from '../../api/clasificacion.api';

// Componente memoizado para la fila de la tabla
const SubclasificacionRow = React.memo(({ sub, onEdit, onDelete, onNavigate, searchText, puedeVerOrden }) => {
  const iconName = sub.nicono || 'faFile';
  const Icon = iconos[iconName] || iconos.faFile;

  // Función para resaltar el texto coincidente
  const highlightText = (text, searchText) => {
    if (true || !searchText || !text) return text;
    
    const regex = new RegExp(`(${searchText})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, i) => 
      regex.test(part) ? (
        <span key={i} className="bg-red-200 font-bold">{part}</span>
      ) : part
    );
  };

  return (
    <tr className="transform hover:scale-[1.01] hover:bg-blue-50 transition-all duration-300">
      <td className="py-4 px-6 font-medium text-gray-800">
        {highlightText(sub.nombre, searchText)}
      </td>
      <td className="py-4 px-6 text-gray-600">
        {highlightText(sub.descripcion, searchText)}
      </td>
      <td className="py-4 px-6 text-center">
        <FontAwesomeIcon 
          icon={Icon} 
          size="lg"
          className="text-blue-600 transform hover:scale-125 transition-all duration-300" 
        />
      </td>
      {puedeVerOrden && (
        <td className="py-4 px-6 text-center text-gray-600">{sub.orden || 0}</td>
      )}
      <td className="py-4 px-6">
        <div className="flex justify-center space-x-4">
          <button 
            onClick={() => onEdit(sub)}
            title={`Editar ${sub.nombre}`}
            className="text-blue-600 hover:text-blue-800 transform hover:scale-110 transition-all duration-300"
          >
            <FontAwesomeIcon icon={iconos.faPen} size="lg" />
          </button>
          <button 
            onClick={() => onDelete(sub)}
            title={`Eliminar ${sub.nombre}`}
            className="text-red-600 hover:text-red-800 transform hover:scale-110 transition-all duration-300"
          >
            <FontAwesomeIcon icon={iconos.faTrash} size="lg" />
          </button>
          <button 
            onClick={() => onNavigate(sub)}
            title={`Navegar a ${sub.nombre}`}
            className="text-red-600 hover:text-red-800 transform hover:scale-110 transition-all duration-300"
          >
            <FontAwesomeIcon icon={iconos.faFolderTree} size="lg" />
          </button>
        </div>
      </td>
    </tr>
  );
});

// Componente memoizado para el encabezado de la tabla
const TableHeader = React.memo(({ ordenAscendente, onSort, onSortOrden, onSortDescripcion, puedeVerOrden }) => (
  <tr className="bg-gradient-to-r from-blue-600 to-cyan-600">
    <th 
      className="py-4 px-6 text-left text-sm uppercase tracking-wider cursor-pointer group transition-colors duration-300"
      onClick={onSort}
    >
      <div className="flex items-center space-x-2 text-white">
        <span>Nombre</span>
        <FontAwesomeIcon 
          icon={ordenAscendente ? iconos.faSortAlphaDown : iconos.faSortAlphaUp}
          className="transform group-hover:scale-110 transition-all duration-300"
        />
      </div>
    </th>
    <th 
      className="py-4 px-6 text-left text-sm uppercase tracking-wider cursor-pointer group transition-colors duration-300"
      onClick={onSortDescripcion}
    >
      <div className="flex items-center space-x-2 text-white">
        <span>Descripción</span>
        <FontAwesomeIcon 
          icon={ordenAscendente ? iconos.faSortAlphaDown : iconos.faSortAlphaUp}
          className="transform group-hover:scale-110 transition-all duration-300"
        />
      </div>
    </th>
    <th className="py-4 px-6 text-center text-sm uppercase tracking-wider text-white">Ícono</th>
    {puedeVerOrden && (
      <th 
        className="py-4 px-6 text-center text-sm uppercase tracking-wider cursor-pointer group transition-colors duration-300"
        onClick={onSortOrden}
      >
        <div className="flex items-center justify-center space-x-2 text-white">
          <span>Orden</span>
          <FontAwesomeIcon 
            icon={ordenAscendente ? iconos.faSortNumericDown : iconos.faSortNumericUp}
            className="transform group-hover:scale-110 transition-all duration-300"
          />
        </div>
      </th>
    )}
    <th className="py-4 px-6 text-center text-sm uppercase tracking-wider text-white">Acciones</th>
  </tr>
));

// Componente para el breadcrumb
const Breadcrumb = React.memo(({ items }) => (
  <nav className="flex mb-6 px-4 py-2 bg-white rounded-lg shadow-sm">
    <ol className="flex items-center space-x-2">
      {items.map((item, index) => (
        <li key={index} className="flex items-center">
          {index > 0 && (
            <FontAwesomeIcon 
              icon={iconos.faChevronRight} 
              className="mx-2 text-gray-400"
            />
          )}
          {index === items.length - 1 ? (
            <span className="text-blue-600 font-medium">{item.label}</span>
          ) : (
            <Link 
              to={item.path}
              className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
            >
              {item.icon && (
                <FontAwesomeIcon 
                  icon={iconos[item.icon] || iconos.faFolder} 
                  className="mr-2"
                />
              )}
              {item.label}
            </Link>
          )}
        </li>
      ))}
    </ol>
  </nav>
));

export default function Tipos() {
  const navigate = useNavigate();
  const { id: encodedId, parentId: encodedParentId } = useParams();
  const initialLogDone = useRef(false);
  const lastSubclasificacionesRef = useRef(null);
  
  // Memoize decoded values to prevent multiple decodings
  const decodedValues = useMemo(() => ({
    realId: decodeId(encodedId),
    realParentId: decodeParentId(encodedParentId)
  }), [encodedId, encodedParentId]);

  const { realId, realParentId } = decodedValues;
  
  const [busqueda, setBusqueda] = useState('');
  const [ordenAscendente, setOrdenAscendente] = useState(true);
  const [ordenarPorOrden, setOrdenarPorOrden] = useState(true);
  const [ordenarPorNombre, setOrdenarPorNombre] = useState(false);
  const [ordenarPorDescripcion, setOrdenarPorDescripcion] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClasificacion, setSelectedClasificacion] = useState(null);
  const [nombreClasificacion, setNombreClasificacion] = useState('');
  const [parentHierarchy, setParentHierarchy] = useState([]);

  const { 
    subClasificaciones, 
    fetchSubClasificaciones, 
    deleteClasificacion,
    loading, 
    error,
    fetchAllClasificaciones,
    allClasificaciones,
    getClasificacionById
  } = useClasificacionStore();
  const { tienePermiso } = useAuthStore();

  // Verificar si el usuario puede ver la columna de orden
  const puedeVerOrden = !tienePermiso(CLASSIFICATION_IDS.CMP_ORDEN);

  // Memoize parent classification data
  const parentClasificacionData = useMemo(() => {
    if (realParentId && allClasificaciones.length > 0) {
      return allClasificaciones.find(c => c.id_clasificacion === realParentId) || null;
    }
    return null;
  }, [realParentId, allClasificaciones]);

  // Memoize parent name and icon
  const parentInfo = useMemo(() => {
    console.log('=== DEBUG parentInfo ===');
    console.log('subClasificaciones:', subClasificaciones);
    console.log('realParentId:', realParentId);
    console.log('realId:', realId);

    if (subClasificaciones.length > 0) {
      console.log('Primera subclasificación:', {
        type_nombre: subClasificaciones[0].type_nombre,
        type_icono: subClasificaciones[0].type_icono,
        parent_nombre: subClasificaciones[0].parent_nombre,
        parent_icono: subClasificaciones[0].parent_icono
      });

      // Si no hay parent_id, usar la información del tipo
      if (!realParentId) {
        console.log('No hay parent_id, usando información del tipo');
        const info = {
          nombre: subClasificaciones[0].type_nombre || 'Cargando...',
          icono: subClasificaciones[0].type_icono
        };
        console.log('Info del tipo:', info);
        return info;
      }
      // Si hay parent_id, usar la información del padre
      console.log('Hay parent_id, usando información del padre');
      const info = {
        nombre: subClasificaciones[0].parent_nombre,
        icono: subClasificaciones[0].parent_icono
      };
      console.log('Info del padre:', info);
      return info;
    }
    console.log('No hay subclasificaciones, retornando estado de carga');
    return {
      nombre: 'Cargando Subclasificaciones...',
      icono: null
    };
  }, [subClasificaciones, realParentId, realId]);

  // Single effect for initial data loading
  useEffect(() => {
    const loadInitialData = async () => {
      console.log('=== DEBUG loadInitialData ===');
      console.log('Cargando datos con:', { realId, realParentId });
      
      if (realId) {
        console.log('Llamando a fetchSubClasificaciones');
        const response = await fetchSubClasificaciones(realId, realParentId);
        console.log('Respuesta de fetchSubClasificaciones:', response);
      }
      console.log('Llamando a fetchAllClasificaciones');
      await fetchAllClasificaciones();
    };
    
    loadInitialData();
  }, [realId, realParentId, fetchSubClasificaciones, fetchAllClasificaciones]);

  useEffect(() => {
    console.log('=== DEBUG useEffect nombreClasificacion ===');
    console.log('realId:', realId);
    if (realId) {
      const clasificacion = getClasificacionById(realId);
      console.log('Clasificación encontrada:', clasificacion);
      if (clasificacion) {
        setNombreClasificacion(clasificacion.nombre);
      }
    }
  }, [realId, getClasificacionById]);

  // Efecto para mostrar las subclasificaciones en consola cuando cambien
  useEffect(() => {
    if (subClasificaciones.length > 0) {
      // Convertir las subclasificaciones actuales a string para comparación
      const currentSubclasificacionesStr = JSON.stringify(subClasificaciones);
      
      // Solo mostrar si son diferentes a las últimas mostradas
      if (currentSubclasificacionesStr !== lastSubclasificacionesRef.current) {
        console.log('=== SUBCLASIFICACIONES ACTUALES ===');
        console.log('ID Padre:', realId);
        console.log('Subclasificaciones:', subClasificaciones.map(sub => ({
          id: sub.id_clasificacion,
          nombre: sub.nombre,
          descripcion: sub.descripcion,
          tipo: sub.type_id,
          icono: sub.nicono,
          parent_id: sub.parent_id,
          parent_nombre: sub.parent_nombre,
          parent_icono: sub.parent_icono
        })));
        
        // Actualizar la referencia con las subclasificaciones actuales
        lastSubclasificacionesRef.current = currentSubclasificacionesStr;
      }
    }
  }, [subClasificaciones, realId, realParentId]);

  // Memoizar las subclasificaciones filtradas
  const subClasificacionesFiltradas = useMemo(() => {
    // Primero filtramos por búsqueda
    const filtradas = subClasificaciones.filter(sub => 
      sub.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    // Ordenamos según el campo seleccionado
    if (ordenarPorNombre) {
      return [...filtradas].sort((a, b) => {
        const nombreA = a.nombre.toLowerCase();
        const nombreB = b.nombre.toLowerCase();
        return ordenAscendente ? 
          nombreA.localeCompare(nombreB) : 
          nombreB.localeCompare(nombreA);
      });
    }

    if (ordenarPorDescripcion) {
      return [...filtradas].sort((a, b) => {
        const descA = (a.descripcion || '').toLowerCase();
        const descB = (b.descripcion || '').toLowerCase();
        return ordenAscendente ? 
          descA.localeCompare(descB) : 
          descB.localeCompare(descA);
      });
    }

    // Por defecto ordenamos por el campo orden
    return [...filtradas].sort((a, b) => {
      const ordenA = a.orden || 0;
      const ordenB = b.orden || 0;
      return ordenAscendente ? ordenA - ordenB : ordenB - ordenA;
    });
  }, [subClasificaciones, busqueda, ordenAscendente, ordenarPorNombre, ordenarPorDescripcion]);

  // Función para cambiar el orden por nombre
  const cambiarOrden = () => {
    setOrdenarPorOrden(false);
    setOrdenarPorDescripcion(false);
    setOrdenarPorNombre(true);
    setOrdenAscendente(!ordenAscendente);
  };

  // Función para cambiar el orden por descripción
  const cambiarOrdenPorDescripcion = () => {
    setOrdenarPorOrden(false);
    setOrdenarPorNombre(false);
    setOrdenarPorDescripcion(true);
    setOrdenAscendente(!ordenAscendente);
  };

  // Función para cambiar el orden por el campo orden
  const cambiarOrdenPorOrden = () => {
    setOrdenarPorNombre(false);
    setOrdenarPorDescripcion(false);
    setOrdenarPorOrden(true);
    setOrdenAscendente(!ordenAscendente);
  };

  // Memoize breadcrumb items
  const breadcrumbItems = useMemo(() => {
    console.log('=== DEBUG breadcrumbItems ===');
    console.log('parentInfo:', parentInfo);
    console.log('nombreClasificacion:', nombreClasificacion);
    console.log('realId:', realId);
    console.log('realParentId:', realParentId);

    const items = [
      {
        label: 'Inicio',
        path: '/dashboard',
        icon: 'faHome'
      }
    ];

    if (parentInfo.nombre) {
      items.push({
        label: parentInfo.nombre,
        path: `/dashboard/tipos/${encodeId(realId)}`,
        icon: parentInfo.icono
      });
    }

    if (nombreClasificacion) {
      items.push({
        label: nombreClasificacion,
        path: `/dashboard/tipos/${encodeId(realId)}/${encodeParentId(realParentId)}`,
        icon: selectedClasificacion?.nicono
      });
    }

    console.log('Items finales del breadcrumb:', items);
    return items;
  }, [parentInfo, nombreClasificacion, realId, realParentId, selectedClasificacion]);

  // Memoizar las funciones de callback
  const handleEdit = useCallback((clasificacion) => {
    setSelectedClasificacion(clasificacion);
    setIsModalOpen(true);
  }, []);

  const handleCreate = useCallback(() => {
    setSelectedClasificacion(null);
    setIsModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setSelectedClasificacion(null);
    fetchSubClasificaciones(realId);
  }, [fetchSubClasificaciones, realId]);

  // Memoizar las funciones de callback
  const handleDelete = useCallback((clasificacion) => {
    setSelectedClasificacion(clasificacion);
    setIsDeleteModalOpen(true);
  }, []);

  const handleNavigate = useCallback((sub) => {
    // Asegurarnos de que los datos se muestren en la consola
    console.log('=== DATOS DE LA SUBCLASIFICACIÓN ===');
    console.log('Navegando a subclasificación:', {
      id: sub.id_clasificacion,
      nombre: sub.nombre,
      descripcion: sub.descripcion,
      tipo: sub.type_id,
      icono: sub.nicono,
      parent_id: sub.parent_id,
      parent_nombre: sub.parent_nombre,
      parent_icono: sub.parent_icono,
      datos_completos: sub
    });

    navigate(`/dashboard/tipos/${encodeId(sub.type_id)}/${encodeParentId(sub.id_clasificacion)}`);
  }, [navigate]);

  const handleConfirmDelete = useCallback(async () => {
    try {
      await deleteClasificacion(selectedClasificacion.id_clasificacion);
      toast.success(`Subclasificación "${selectedClasificacion.nombre}" eliminada correctamente`);
      setIsDeleteModalOpen(false);
      setSelectedClasificacion(null);
      fetchSubClasificaciones(realId);
    } catch (error) {
      console.error('Error al eliminar la clasificación:', error);
      toast.error('Error al eliminar la subclasificación');
    }
  }, [selectedClasificacion, deleteClasificacion, fetchSubClasificaciones, realId]);

  // Efecto para mostrar las subclasificaciones filtradas solo cuando cambie la búsqueda o el orden
  useEffect(() => {
    if (busqueda !== '' || ordenAscendente !== true) {
      console.log('Subclasificaciones filtradas:', subClasificacionesFiltradas);
    }
  }, [busqueda, ordenAscendente, subClasificacionesFiltradas]);

  // Add this new useEffect to fetch parent hierarchy
  useEffect(() => {
    const fetchParentHierarchy = async () => {
      try {
        // Si tenemos parent_id, usamos ese, si no, usamos el type_id
        const idToUse = realParentId || realId;
        if (!idToUse) {
          console.log('No hay ID para obtener la jerarquía');
          return;
        }

        console.log('=== DEBUG fetchParentHierarchy ===');
        console.log('ID a usar:', idToUse);
        console.log('realParentId:', realParentId);
        console.log('realId:', realId);

        const encodedId = encodeId(idToUse);
        console.log('ID codificado:', encodedId);
        
        const response = await getParentHierarchy(encodedId);
        console.log('Respuesta de getParentHierarchy:', response);
        
        if (response.data && Array.isArray(response.data)) {
          // Invertir el orden del array para mostrar desde el más jerárquico
          const reversedData = [...response.data].reverse();
          console.log('Datos invertidos:', reversedData);
          setParentHierarchy(reversedData);
        } else {
          console.error('Respuesta inválida del servidor:', response.data);
          toast.error('Error en el formato de la respuesta del servidor');
        }
      } catch (error) {
        console.error('Error fetching parent hierarchy:', error);
        const errorMessage = error.response?.data?.error || 'Error al cargar la jerarquía de padres';
        toast.error(errorMessage);
      }
    };

    fetchParentHierarchy();
  }, [realId, realParentId]);

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />

        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {parentHierarchy.map((parent, index) => (
                <React.Fragment key={parent.id_clasificacion}>
                  {index > 0 && (
                    <FontAwesomeIcon 
                      icon={iconos.faChevronRight} 
                      className="text-gray-400 mx-2"
                    />
                  )}
                  <div className="flex items-center">
                    {/* Icono del elemento o tipo */}
                    {(() => {
                      // Si es el primer elemento (raíz) y no tiene type_id, mostrar su propio icono
                      if (index === 0 && !parent.type_id && parent.icono) {
                        return (
                          <FontAwesomeIcon
                            icon={iconos[parent.icono] || iconos.faFile}
                            size="lg"
                            className="text-blue-600 transform hover:scale-125 transition-all duration-300 mr-2"
                            title={parent.nombre}
                          />
                        );
                      }
                      // Para los demás elementos, primero intentar mostrar su propio icono
                      if (parent.icono) {
                        return (
                          <FontAwesomeIcon
                            icon={iconos[parent.icono] || iconos.faFile}
                            size="lg"
                            className="text-blue-600 transform hover:scale-125 transition-all duration-300 mr-2"
                            title={parent.nombre}
                          />
                        );
                      }
                      // Si no tiene icono propio, mostrar el icono del tipo
                      if (parent.type_id && parent.type_icono) {
                        return (
                          <FontAwesomeIcon
                            icon={iconos[parent.type_icono] || iconos.faFile}
                            size="lg"
                            className="text-blue-600 transform hover:scale-125 transition-all duration-300 mr-2"
                            title={parent.type_nombre || 'Tipo'}
                          />
                        );
                      }
                      return null;
                    })()}
                    <Link
                      to={`/dashboard/tipos/${encodeId(parent.type_id || parent.id_clasificacion)}/${encodeParentId(parent.id_clasificacion)}`}
                      className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors duration-300"
                    >
                      {parent.nombre}
                    </Link>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
          <button
            onClick={handleCreate}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
          >
            <FontAwesomeIcon icon={iconos.faPlus} />
            <span>Crear {nombreClasificacion || parentInfo.nombre}</span>
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md">
            <div className="flex items-center">
              <FontAwesomeIcon icon={iconos.faExclamationCircle} className="mr-2" />
              <p>{error}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-xl shadow-lg">
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
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  <TableHeader 
                    ordenAscendente={ordenAscendente} 
                    onSort={cambiarOrden} 
                    onSortOrden={cambiarOrdenPorOrden}
                    onSortDescripcion={cambiarOrdenPorDescripcion}
                    puedeVerOrden={puedeVerOrden}
                  />
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {subClasificacionesFiltradas.length > 0 ? (
                    subClasificacionesFiltradas.map((sub, index) => (
                      <SubclasificacionRow
                        key={`row-${sub.id_clasificacion}-${index}`}
                        sub={sub}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onNavigate={handleNavigate}
                        searchText={busqueda}
                        puedeVerOrden={puedeVerOrden}
                      />
                    ))
                  ) : (
                    <tr key="no-results-row">
                      <td colSpan="5" className="py-8 text-center text-gray-500">
                        <FontAwesomeIcon icon={iconos.faInbox} className="text-4xl mb-2" />
                        <p>No hay subclasificaciones que coincidan con tu búsqueda.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Botón de volver a la clasificación anterior */}
            {encodedParentId && (
              <div className="mb-6 flex items-center">
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center px-4 py-2 bg-gray-100 text-gray-800 font-medium rounded-md shadow-sm hover:bg-gray-200 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  <FontAwesomeIcon icon={iconos.faArrowLeft} className="mr-2" />
                  Volver
                </button>
              </div>
            )}
          </div>
        )}

        {/* Modal para crear/editar */}
        <Modal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          editData={selectedClasificacion}
          parentId={realId}
          parentInfo={{
            type_id: realId,
            nombre: parentInfo.nombre,
            icono: parentInfo.icono
          }}
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