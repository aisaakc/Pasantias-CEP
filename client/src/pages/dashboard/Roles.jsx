import React, { useEffect, useState } from 'react';
import * as iconos from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import usePersonaStore from '../../store/personaStore';
import ModalUser from '../../components/ModalUser';
import DeleteModal from '../../components/DeleteModal';

function Roles() {
  const { roles, usuarios, loading, error, fetchRoles, fetchUsuarios, deleteUser } = usePersonaStore();
  const [selectedRole, setSelectedRole] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchRoles();
    fetchUsuarios();
  }, []);

  const handleRoleClick = (role) => {
    setSelectedRole(selectedRole?.id === role.id ? null : role);
  };

  const handleEditClick = (usuario) => {
    // Transformar los datos del usuario al formato esperado por el modal
    const userData = {
      id_persona: usuario.id_persona,
      nombre: usuario.persona_nombre || '',
      apellido: usuario.apellido || '',
      cedula: usuario.cedula || '',
      telefono: usuario.telefono || '',
      gmail: usuario.gmail || '',
      contrasena: usuario.contrasena || '', // Incluimos la contraseña
      id_genero: usuario.id_genero || '',
      id_pregunta: usuario.id_pregunta || '',
      respuesta: usuario.respuesta_seguridad || '',
      id_rol: usuario.roles?.map(rol => rol.id) || []
    };
    
    console.log('Datos del usuario a editar:', userData); // Para debugging
    setEditData(userData);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditData(null);
  };

  // Agrupar usuarios por id_persona
  const groupedUsers = usuarios.reduce((acc, user) => {
    if (!acc[user.id_persona]) {
      acc[user.id_persona] = {
        ...user,
        roles: [{
          id: user.id_rol,
          nombre: user.rol_nombre,
          descripcion: user.rol_desc
        }]
      };
    } else {
      acc[user.id_persona].roles.push({
        id: user.id_rol,
        nombre: user.rol_nombre,
        descripcion: user.rol_desc
      });
    }
    return acc;
  }, {});

  const filteredUsers = selectedRole 
    ? Object.values(groupedUsers).filter(user => 
        user.roles.some(role => role.id === selectedRole.id)
      )
    : Object.values(groupedUsers);

  // Filtrar por nombre, apellido o email si hay búsqueda
  const filteredAndSearchedUsers = filteredUsers.filter(user => {
    const fullName = `${user.persona_nombre} ${user.apellido}`.toLowerCase();
    const email = (user.gmail || '').toLowerCase();
    const searchLower = search.toLowerCase();
    return fullName.includes(searchLower) || email.includes(searchLower);
  });

  // Función para resaltar el texto buscado en nombre, apellido o email
  const highlightText = (text, search) => {
    if (!search || !text) return text;
    const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedSearch})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <span key={i} className="bg-red-400/40 border-b-2 border-red-500 font-bold rounded px-1">{part}</span>
      ) : part
    );
  };

  // Handler para abrir el modal de eliminar
  const handleDeleteClick = (usuario) => {
    setUserToDelete(usuario);
    setDeleteModalOpen(true);
  };

  // Handler para confirmar eliminación
  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    try {
      await deleteUser(userToDelete.id_persona);
      setDeleteModalOpen(false);
      setUserToDelete(null);
      // Puedes mostrar un toast aquí si usas alguna librería de notificaciones
    } catch {
      // Manejar error si lo deseas
      setDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
      <div className="text-red-600">Error: {error}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Encabezado */}
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 animate-fade-in py-1 leading-tight flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-100 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <FontAwesomeIcon 
                icon={iconos.faUsers} 
                className="text-blue-600 relative z-10 transform group-hover:scale-110 transition-all duration-300" 
                size="lg"
              />
            </div>
            <span className="relative bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Gestión de Roles
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 group-hover:w-full transition-all duration-300"></div>
            </span>
          </h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white rounded-xl px-6 py-3 font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-2 hover:bg-blue-900">
            <FontAwesomeIcon icon={iconos.faPlus} />
            <span>Agregar Usuario</span>
          </button>
        </div>

        {/* Cards de Roles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-12">
          {/* Card de Resumen */}
          <div 
            onClick={() => setSelectedRole(null)}
            className={`bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up overflow-hidden cursor-pointer
              ${!selectedRole ? 'ring-2 ring-white ring-offset-2' : ''}`}
          >
            <div className="p-5">
              <div className="flex flex-col items-center text-center text-white">
                <div className="p-3 rounded-xl bg-white/20 mb-3">
                  <FontAwesomeIcon 
                    icon={iconos.faUsers}
                    size="2x" 
                    className="text-white" 
                  />
                </div>
                <div>
                  <h2 className="text-lg font-semibold mb-1">
                    Total de Roles
                  </h2>
                  <p className="text-2xl font-bold">{roles.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Cards de Roles Individuales */}
          {roles.map((rol, index) => (
            <div
              key={rol.id}
              onClick={() => handleRoleClick(rol)}
              className={`bg-white/80 backdrop-blur-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up overflow-hidden border cursor-pointer
                ${selectedRole?.id === rol.id ? 'ring-2 ring-blue-500 ring-offset-2' : 'border-gray-100'}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="p-5">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-xl bg-blue-100 mb-3">
                    <FontAwesomeIcon 
                      icon={iconos[rol.nombre_icono] || iconos.faUser}
                      size="2x" 
                      className="text-blue-600" 
                      title={rol.nombre}
                    />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-1">
                      {rol.nombre}
                    </h2>
                    <p className="text-gray-600 text-sm">{rol.descripcion || 'Sin descripción'}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Campo de búsqueda de usuarios (ahora justo encima de la tabla) */}
        <div className="mb-4 flex justify-end">
          <div className="relative w-full max-w-xs">
            <input
              type="text"
              placeholder="Buscar usuario por nombre, apellido o email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <FontAwesomeIcon icon={iconos.faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Tabla de Usuarios */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-fade-in">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              {selectedRole 
                ? `Usuarios con rol: ${selectedRole.nombre}`
                : 'Todos los Usuarios'}
            </h2>
            {selectedRole && (
              <button
                onClick={() => setSelectedRole(null)}
                className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
              >
                <FontAwesomeIcon icon={iconos.faTimes} />
                <span>Limpiar filtro</span>
              </button>
            )}
          </div>
          <div className="w-full">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-blue-600 to-cyan-600">
                  <th className="py-4 px-6 text-left text-sm uppercase tracking-wider text-white w-1/4">Nombre Completo</th>
                  <th className="py-4 px-6 text-left text-sm uppercase tracking-wider text-white w-1/4">Email</th>
                  <th className="py-4 px-6 text-left text-sm uppercase tracking-wider text-white w-1/6">Género</th>
                  <th className="py-4 px-6 text-left text-sm uppercase tracking-wider text-white w-1/4">Roles</th>
                  <th className="py-4 px-6 text-center text-sm uppercase tracking-wider text-white w-1/6">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredAndSearchedUsers.map((usuario) => (
                  <tr key={usuario.id_persona} className="transform hover:scale-[1.01] hover:bg-blue-50 transition-all duration-300">
                    <td className="py-4 px-6 font-medium text-gray-800 truncate">
                      {highlightText(`${usuario.persona_nombre} ${usuario.apellido}`, search)}
                    </td>
                    <td className="py-4 px-6 text-gray-600 truncate">{highlightText(usuario.gmail, search)}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        usuario.genero_nombre === 'Masculino' 
                          ? 'bg-blue-100 text-blue-800' 
                          : usuario.genero_nombre === 'Femenino'
                          ? 'bg-pink-100 text-pink-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                      title={usuario.genero_desc || ''}>
                        {usuario.genero_nombre || 'No especificado'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-2">
                        {selectedRole ? (
                          usuario.roles.find(role => role.id === selectedRole.id) && (
                            <span 
                              className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                              title={selectedRole.descripcion}
                            >
                              {selectedRole.nombre}
                            </span>
                          )
                        ) : (
                          usuario.roles.map((rol, index) => (
                            <span 
                              key={index}
                              className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                              title={rol.descripcion}
                            >
                              {rol.nombre}
                            </span>
                          ))
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex justify-center space-x-4">
                        <button 
                          title="Ver detalles"
                          className="text-green-600 hover:text-green-800 transform hover:scale-110 transition-all duration-300"
                        >
                          <FontAwesomeIcon icon={iconos.faEye} size="lg" />
                        </button>
                        <button 
                          title={`Editar usuario: ${usuario.persona_nombre} ${usuario.apellido}`}
                          onClick={() => handleEditClick(usuario)}
                          className="text-blue-600 hover:text-blue-800 transform hover:scale-110 transition-all duration-300"
                        >
                          <FontAwesomeIcon icon={iconos.faPen} size="lg" />
                        </button>
                        <button 
                          title={`Eliminar usuario: ${usuario.persona_nombre} ${usuario.apellido}`}
                          className="text-red-600 hover:text-red-800 transform hover:scale-110 transition-all duration-300"
                          onClick={() => handleDeleteClick(usuario)}
                        >
                          <FontAwesomeIcon icon={iconos.faTrash} size="lg" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ModalUser 
        isOpen={isModalOpen} 
        onClose={handleModalClose}
        editData={editData}
      />

      {/* Modal de eliminar usuario */}
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => { setDeleteModalOpen(false); setUserToDelete(null); }}
        onConfirm={handleConfirmDelete}
        itemName={userToDelete ? `${userToDelete.persona_nombre} ${userToDelete.apellido}` : ''}
        itemType="usuario"
        itemIcon={iconos.faUser}
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

export default Roles;