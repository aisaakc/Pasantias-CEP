import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarAlt, 
  faClock, 
  faUser, 
  faHashtag,
  faBook,
  faSpinner,
  faSearch,
  faUsers
} from '@fortawesome/free-solid-svg-icons';
import { getAllCursos } from '../../api/curso.api';
import { toast } from 'sonner';

function Cohorte() {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCursos, setFilteredCursos] = useState([]);
  const [cohorteTabs, setCohorteTabs] = useState([]);

  // Obtener todos los cursos al cargar el componente
  useEffect(() => {
    const fetchCursos = async () => {
      try {
        setLoading(true);
        const response = await getAllCursos();
        if (response.data.success) {
          setCursos(response.data.data);
        } else {
          setError('Error al cargar los cursos');
        }
      } catch (error) {
        console.error('Error fetching cursos:', error);
        setError('Error al cargar los cursos');
        toast.error('Error al cargar los cursos');
      } finally {
        setLoading(false);
      }
    };

    fetchCursos();
  }, []);

  // Generar tabs basados en códigos únicos de cohorte
  useEffect(() => {
    if (cursos.length > 0) {
      const codigosUnicos = [...new Set(cursos.map(curso => curso.codigo_cohorte).filter(Boolean))];
      const tabs = [
        { id: 'todos', name: 'Todas las Cohortes', count: cursos.length },
        ...codigosUnicos.map(codigo => ({
          id: codigo,
          name: `Cohorte ${codigo}`,
          count: cursos.filter(curso => curso.codigo_cohorte === codigo).length
        }))
      ];
      setCohorteTabs(tabs);
    }
  }, [cursos]);

  // Filtrar cursos según el tab activo y término de búsqueda
  useEffect(() => {
    let filtered = cursos;

    // Filtrar por tab activo (código de cohorte)
    if (activeTab !== 'todos') {
      filtered = filtered.filter(curso => curso.codigo_cohorte === activeTab);
    }

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(curso => 
        curso.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        curso.nombre_curso?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        curso.nombre_completo_facilitador?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        curso.codigo_cohorte?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCursos(filtered);
  }, [cursos, activeTab, searchTerm]);

  // Formatear fecha para mostrar
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} className="animate-spin text-4xl text-blue-600 mb-4" />
          <p className="text-gray-600">Cargando cohortes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-600 text-4xl mb-4">⚠️</div>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
            <FontAwesomeIcon icon={faUsers} className="mr-3 text-blue-600" />
            Cohortes
          </h1>
          <p className="text-gray-600">Administra y visualiza todas las cohortes de cursos</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6 overflow-x-auto" aria-label="Tabs">
              {cohorteTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors duration-200 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <FontAwesomeIcon icon={faBook} />
                  <span>{tab.name}</span>
                  <span className="bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs font-medium">
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <FontAwesomeIcon 
                icon={faSearch} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Buscar por código, nombre, facilitador..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="text-sm text-gray-600">
              {filteredCursos.length} de {cursos.length} cohortes
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <FontAwesomeIcon icon={faHashtag} className="mr-2" />
                    Código
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <FontAwesomeIcon icon={faBook} className="mr-2" />
                    Nombre del Curso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <FontAwesomeIcon icon={faUser} className="mr-2" />
                    Facilitador
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <FontAwesomeIcon icon={faClock} className="mr-2" />
                    Duración
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                    Fecha Inicio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                    Fecha Fin
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCursos.length > 0 ? (
                  filteredCursos.map((curso, index) => (
                    <tr 
                      key={curso.id_curso || index}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {curso.codigo_cohorte || 'N/A'}
                        </div>
                        {curso.codigo && (
                          <div className="text-sm text-gray-500">
                            {curso.codigo}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {curso.nombre_curso || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {curso.modalidad || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {curso.nombre_completo_facilitador || 'Sin asignar'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {curso.duracion ? `${curso.duracion} horas` : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(curso.fecha_hora_inicio)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(curso.fecha_hora_fin)}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        <FontAwesomeIcon icon={faBook} className="text-4xl mb-4 text-gray-300" />
                        <p className="text-lg font-medium">No se encontraron cohortes</p>
                        <p className="text-sm">Intenta ajustar los filtros o la búsqueda</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cohorte;