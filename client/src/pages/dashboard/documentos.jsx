import React, { useState, useEffect } from 'react'
import { FaPlus, FaEdit, FaTrash, FaDownload, FaEye, FaFilter, FaFileAlt, FaFilePdf, FaFileWord, FaDatabase } from 'react-icons/fa'
import ModalDocumento from '../../components/ModalDocumento'
import useDocumentoStore from '../../store/documentoStrore'
import { hashDeterministaPorId } from '../../utils/hashUtils'
import DeleteModal from '../../components/DeleteModal'
import { toast } from 'sonner'
import * as iconos from '@fortawesome/free-solid-svg-icons'
import { getAllCursos } from '../../api/curso.api'
import { getUsuarios } from '../../api/persona.api'
import { CLASSIFICATION_IDS } from '../../config/classificationIds'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const BACKEND_URL = 'http://localhost:3001'

function Documentos() {
  const {
    documentos,
    loading: isLoading,
    fetchDocumentos,
    downloadDocumento,
    deleteDocumento
  } = useDocumentoStore();

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTipo, setSelectedTipo] = useState('')
  const [sortBy, setSortBy] = useState('fecha_hora')
  const [sortOrder, setSortOrder] = useState('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [showModalDocumento, setShowModalDocumento] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [cohortes, setCohortes] = useState([]);
  const [selectedCohorte, setSelectedCohorte] = useState('');
  const [cursosCohorteMap, setCursosCohorteMap] = useState({});
  const [selectedCurso, setSelectedCurso] = useState('');
  const [personas, setPersonas] = useState([]);
  const [selectedPersona, setSelectedPersona] = useState('');
  const [loadingPersonas, setLoadingPersonas] = useState(false);

  useEffect(() => {
    fetchDocumentos()
    getAllCursos()
      .then(res => {
        const cursos = res.data?.data || [];
        const cohorteMap = {};
        cursos.forEach(curso => {
          const cohorte = curso.codigo_cohorte || 'Sin cohorte';
          if (!cohorteMap[cohorte]) cohorteMap[cohorte] = [];
          cohorteMap[cohorte].push(curso);
        });
        setCohortes(Object.keys(cohorteMap));
        setCursosCohorteMap(cohorteMap);
      })
      .catch(() => {
        setCohortes([]);
        setCursosCohorteMap({});
      });
    getUsuarios()
      .then(res => setPersonas(res.data?.data || []))
      .catch(() => setPersonas([]));
  }, [fetchDocumentos])

  const formatExt = (ext) => (ext || '').replace('.', '').toUpperCase();

  const formatSizeMB = (size) => {
    if (!size) return 0;
    const mb = Number(size) / (1024 * 1024);
    return Number(mb.toFixed(1));
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hour = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hour}:${min}`;
  };

  const tipos = [...new Set(documentos.map(doc => formatExt(doc.ext)))];

  const documentosFiltradosPorCohorte = selectedCohorte && cursosCohorteMap[selectedCohorte]
    ? documentos.filter(doc =>
        cursosCohorteMap[selectedCohorte].some(curso =>
          Array.isArray(curso.documentos) && curso.documentos.includes(doc.id_documento)
        )
      )
    : documentos;

  const documentosFiltradosPorCurso = selectedCurso && selectedCohorte && cursosCohorteMap[selectedCohorte]
    ? documentosFiltradosPorCohorte.filter(doc =>
        cursosCohorteMap[selectedCohorte].some(curso =>
          curso.id_curso === Number(selectedCurso) && Array.isArray(curso.documentos) && curso.documentos.includes(doc.id_documento)
        )
      )
    : documentosFiltradosPorCohorte;

  const documentosFiltradosPorPersona = selectedPersona
    ? documentosFiltradosPorCurso.filter(doc => {
        const persona = personas.find(p => p.id_persona === Number(selectedPersona));
        return Array.isArray(persona?.documentos) && persona.documentos.includes(doc.id_documento);
      })
    : documentosFiltradosPorCurso;

  const filteredDocumentos = documentosFiltradosPorPersona
    .filter(doc => {
      const matchesSearch = (doc.nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (doc.descripcion || '').toLowerCase().includes(searchTerm.toLowerCase())
      const matchesTipo = !selectedTipo || formatExt(doc.ext) === selectedTipo
      return matchesSearch && matchesTipo
    })
    .sort((a, b) => {
      let aValue = a[sortBy]
      let bValue = b[sortBy]
      
      if (sortBy === 'fecha_hora') {
        aValue = new Date(aValue)
        bValue = new Date(bValue)
      }
      if (sortBy === 'tamano') {
        aValue = formatSizeMB(a.tamano)
        bValue = formatSizeMB(b.tamano)
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentDocumentos = filteredDocumentos.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredDocumentos.length / itemsPerPage)

  const getExtWithDot = (ext) => {
    if (!ext) return '';
    return ext.startsWith('.') ? ext : '.' + ext;
  };

  const getFileIcon = (ext) => {
    const extNorm = formatExt(ext);
    switch (extNorm) {
      case 'PDF': return <FaFilePdf className="h-5 w-5 text-red-500" />;
      case 'DOCX':
      case 'DOC': return <FaFileWord className="h-5 w-5 text-blue-500" />;
      case 'XLSX':
      case 'XLS': return <FaFileAlt className="h-5 w-5 text-green-600" />;
      case 'PPTX':
      case 'PPT': return <FaFileAlt className="h-5 w-5 text-orange-500" />;
      case 'SQL': return <FaDatabase className="h-5 w-5 text-purple-500" />;
      case 'TXT': return <FaFileAlt className="h-5 w-5 text-gray-600" />;
      case 'MP3':
      case 'WAV': return <FaFileAlt className="h-5 w-5 text-pink-500" />;
      case 'MPEG4':
      case 'MPEG': return <FaFileAlt className="h-5 w-5 text-yellow-700" />;
      case 'JPEG':
      case 'JPG':
      case 'PNG': return <FaFileAlt className="h-5 w-5 text-yellow-600" />;
      default: return <FaFileAlt className="h-5 w-5 text-gray-500" />;
    }
  };

  const handleAction = async (action, documento) => {
    setSelectedDocument(documento)
    if (action === 'editar') {
      setShowModalDocumento(true)
    }
    if (action === 'descargar') {
      const hash = hashDeterministaPorId(documento.id_documento)
      const ext = documento.ext.startsWith('.') ? documento.ext : '.' + documento.ext
      const filename = `${hash}${ext}`
      try {
        const blob = await downloadDocumento(filename)
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = documento.nombre + ext
        document.body.appendChild(a)
        a.click()
        a.remove()
        window.URL.revokeObjectURL(url)
      } catch {
        alert('Error al descargar el documento')
      }
    }
    if (action === 'eliminar') {
      setShowDeleteModal(true)
    }
    console.log(`${action} documento:`, documento.nombre)
  }

  const handleDocumentoGuardado = async () => {
    setLoadingPersonas(true);
    await fetchDocumentos();
    const res = await getUsuarios();
    setPersonas(res.data?.data || []);
    setShowModalDocumento(false);
    setSelectedDocument(null);
    setSelectedPersona('');
    setLoadingPersonas(false);
  };

  const handleConfirmDelete = async () => {
    if (!selectedDocument) return;
    try {
      await deleteDocumento(selectedDocument.id_documento)
      setShowDeleteModal(false)
      setSelectedDocument(null)
      toast.success('Documento eliminado correctamente')
    } catch {
      alert('Error al eliminar el documento')
    }
  }

  const countByExt = (ext) => documentos.filter(d => formatExt(d.ext) === ext).length;

  // Función para resaltar coincidencias en el texto
  function highlightMatch(text, search) {
    if (!search) return text;
    const regex = new RegExp(`(${search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.split(regex).map((part, i) =>
      regex.test(part)
        ? <span key={i} className="bg-red-400/40 border-b-2 border-red-500 font-bold rounded px-1">{part}</span>
        : part
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
            <FontAwesomeIcon icon={iconos.faFileAlt} className="mr-3 text-blue-600" />
            Documentos
          </h1>
          <p className="text-gray-600">Gestiona y consulta los documentos asociados a los cursos y cohortes.</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 transform transition-all duration-300 hover:shadow-xl">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Buscar documentos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              <svg
                className="absolute left-3 top-3 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200"
              >
                <FaFilter className="h-4 w-4" />
                Filtros
              </button>
              
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-200 transform hover:scale-105 shadow-lg"
                onClick={() => setShowModalDocumento(true)}
              >
                <FaPlus className="h-4 w-4" />
                Agregar Documento
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg animate-slide-down">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de archivo</label>
                  <select
                    value={selectedTipo}
                    onChange={(e) => setSelectedTipo(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Todos los tipos</option>
                    {tipos.map(tipo => (
                      <option key={tipo} value={tipo}>{tipo}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ordenar por</label>
                  <select
                    value={`${sortBy}-${sortOrder}`}
                    onChange={(e) => {
                      const [field, order] = e.target.value.split('-')
                      setSortBy(field)
                      setSortOrder(order)
                    }}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="fecha_hora-desc">Fecha (más reciente)</option>
                    <option value="fecha_hora-asc">Fecha (más antigua)</option>
                    <option value="nombre-asc">Nombre (A-Z)</option>
                    <option value="nombre-desc">Nombre (Z-A)</option>
                    <option value="tamano-desc">Tamaño (mayor)</option>
                    <option value="tamano-asc">Tamaño (menor)</option>
                  </select>
                </div>
                {/* Select de cohorte */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cohorte</label>
                  <select
                    value={selectedCohorte}
                    onChange={e => {
                      setSelectedCohorte(e.target.value);
                      setSelectedCurso('');
                    }}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Todos</option>
                    {cohortes.map(cohorte => (
                      <option key={cohorte} value={cohorte}>{cohorte}</option>
                    ))}
                  </select>
                </div>
                {/* Select de curso dependiente de cohorte */}
                {selectedCohorte && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Curso</label>
                    <select
                      value={selectedCurso}
                      onChange={e => setSelectedCurso(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Todos</option>
                      {(cursosCohorteMap[selectedCohorte] || []).map(curso => (
                        <option key={curso.id_curso} value={curso.id_curso}>
                          {curso.nombre_curso}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                {/* Select de persona */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Persona</label>
                  <select
                    value={selectedPersona}
                    onChange={e => setSelectedPersona(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    disabled={loadingPersonas}
                  >
                    <option value="">Todas</option>
                    {/* Agrupar personas por rol, solo mostrar si tienen rol y en orden jerárquico según classificationIds */}
                    {(() => {
                      // Definir el orden jerárquico usando los IDs de classificationIds.js
                      const rolIdToName = {};
                      personas.forEach(p => {
                        if (p.rol_nombre && p.id_rol) {
                          rolIdToName[p.id_rol] = p.rol_nombre;
                        }
                      });
                      const rolOrderIds = [
                        CLASSIFICATION_IDS.Super_admin,
                        CLASSIFICATION_IDS.Administrador,
                        CLASSIFICATION_IDS.ROLES_FACILITADORES
                      ];
                      const rolOrder = rolOrderIds.map(id => rolIdToName[id]).filter(Boolean);
                      // Agrupar personas por rol
                      const grupos = personas.reduce((acc, persona) => {
                        const rol = persona.rol_nombre;
                        if (!rol) return acc; // Omitir personas sin rol
                        if (!acc[rol]) acc[rol] = [];
                        acc[rol].push(persona);
                        return acc;
                      }, {});
                      // Ordenar los roles según la jerarquía y luego alfabéticamente los demás
                      const rolesOrdenados = [
                        ...rolOrder.filter(rol => grupos[rol]),
                        ...Object.keys(grupos)
                          .filter(rol => !rolOrder.includes(rol))
                          .sort()
                      ];
                      return rolesOrdenados.map(rol => (
                        <optgroup key={rol} label={rol}>
                          {grupos[rol].map(persona => (
                            <option key={persona.id_persona} value={persona.id_persona}>
                              {persona.persona_nombre} {persona.apellido}
                            </option>
                          ))}
                        </optgroup>
                      ));
                    })()}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Conteo de archivos por tipo */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-lg flex items-center">
            <FaFilePdf className="h-6 w-6 text-red-600 mr-2" />
            <div>
              <p className="text-sm text-gray-600">PDF</p>
              <p className="text-xl font-bold">{countByExt('PDF')}</p>
              </div>
              </div>
          <div className="bg-white rounded-xl p-4 shadow-lg flex items-center">
            <FaFileWord className="h-6 w-6 text-blue-600 mr-2" />
            <div>
              <p className="text-sm text-gray-600">Word</p>
              <p className="text-xl font-bold">{countByExt('DOCX') + countByExt('DOC')}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg flex items-center">
            <FaFileAlt className="h-6 w-6 text-green-600 mr-2" />
            <div>
              <p className="text-sm text-gray-600">Excel</p>
              <p className="text-xl font-bold">{countByExt('XLSX') + countByExt('XLS')}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg flex items-center">
            <FaFileAlt className="h-6 w-6 text-yellow-600 mr-2" />
            <div>
              <p className="text-sm text-gray-600">PowerPoint</p>
              <p className="text-xl font-bold">{countByExt('PPTX') + countByExt('PPT')}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg flex items-center">
            <FaFileAlt className="h-6 w-6 text-purple-600 mr-2" />
            <div>
              <p className="text-sm text-gray-600">Imágenes (PNG/JPG)</p>
              <p className="text-xl font-bold">{countByExt('PNG') + countByExt('JPG') + countByExt('JPEG')}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              <div className="w-full">
                <table className="w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                    <tr>
                      <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors w-1/4">
                        <div className="flex items-center gap-2">
                          Documento
                        
                        </div>
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5">
                        Descripción
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors w-1/6">
                        <div className="flex items-center gap-2">
                          Fecha
                         
                        </div>
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors w-1/12">
                        <div className="flex items-center gap-2">
                          Tamaño en Mb
                         
                        </div>
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentDocumentos.map((documento, index) => {
                      const hash = hashDeterministaPorId(documento.id_documento)
                      const fileUrl = `${BACKEND_URL}/docs/${hash}${getExtWithDot(documento.ext)}`
                      return (
                        <tr key={documento.id_documento}
                          className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 transform hover:scale-[1.01]"
                          style={{ animationDelay: `${index * 100}ms` }}>
                          <td className="px-4 py-4">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center shadow-md">
                                  {getFileIcon(documento.ext)}
                                </div>
                              </div>
                              <div className="ml-3 min-w-0 flex-1">
                                <a
                                  href={fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm font-semibold text-blue-700 underline truncate hover:text-blue-900"
                                >
                                  {highlightMatch(documento.nombre || '', searchTerm)}
                                </a>
                                <div className="text-xs text-gray-500">
                                  {formatExt(documento.ext)}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-sm text-gray-900 truncate max-w-xs">
                              {highlightMatch(documento.descripcion || '', searchTerm)}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-sm text-gray-900">
                              {formatDate(documento.fecha_hora)}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-900 font-medium">
                            {formatSizeMB(documento.tamano)}
                          </td>
                          <td className="px-4 py-4 text-sm font-medium">
                            <div className="flex items-center gap-1">
                              <a
                                href={fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-900 p-1.5 rounded-lg hover:bg-blue-100 transition-all duration-200 transform hover:scale-110"
                                onClick={e => e.stopPropagation()}
                              >
                                <FaEye className="h-4 w-4" />
                              </a>
                              <button 
                                onClick={() => handleAction('descargar', documento)}
                                className="text-green-600 hover:text-green-900 p-1.5 rounded-lg hover:bg-green-100 transition-all duration-200 transform hover:scale-110">
                                <FaDownload className="h-4 w-4" />
                              </button>
                              <button 
                                 title={'Editar: '+documento.nombre}
                                onClick={() => handleAction('editar', documento)}
                                className="text-yellow-600 hover:text-yellow-900 p-1.5 rounded-lg hover:bg-yellow-100 transition-all duration-200 transform hover:scale-110">
                                <FaEdit className="h-4 w-4" />
                              </button>
                              <button 
                              title={'Eliminar: ' +documento.nombre}
                                onClick={() => handleAction('eliminar', documento)}
                                className="text-red-600 hover:text-red-900 p-1.5 rounded-lg hover:bg-red-100 transition-all duration-200 transform hover:scale-110">
                                <FaTrash className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Mostrando {indexOfFirstItem + 1} a {Math.min(indexOfLastItem, filteredDocumentos.length)} de {filteredDocumentos.length} documentos
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                      >
                        Anterior
                      </button>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                            currentPage === page
                              ? 'bg-blue-600 text-white'
                              : 'border border-gray-300 hover:bg-gray-100'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      
                      <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                      >
                        Siguiente
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {filteredDocumentos.length === 0 && !isLoading && (
          <div className="text-center py-12 animate-fade-in">
            <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
              <FaFileAlt className="h-full w-full" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron documentos</h3>
            <p className="text-gray-500 mb-4">
              Intenta ajustar los filtros o términos de búsqueda.
            </p>
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedTipo('')
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Limpiar filtros
            </button>
          </div>
        )}

        <ModalDocumento isOpen={showModalDocumento} onClose={() => { setShowModalDocumento(false); setSelectedDocument(null); }} onSuccess={handleDocumentoGuardado} editData={selectedDocument} />
        <DeleteModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
          itemName={selectedDocument?.nombre || ''}
          itemType="documento"
          itemIcon={iconos.faFileAlt}
        />
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}

export default Documentos