import React, { useEffect } from 'react';
import * as iconos from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useAuthStore from '../../store/authStore';

function Roles() {
  const { roles, loading, error, fetchOpcionesRegistro } = useAuthStore();

  useEffect(() => {
    fetchOpcionesRegistro();
  }, [fetchOpcionesRegistro]);

  const usuarios = [
    {
      id: 1,
      nombreCompleto: 'Juan Pérez',
      email: 'juan.perez@gmail.com',
      rol: 'Administrador'
    },
    {
      id: 2,
      nombreCompleto: 'María García',
      email: 'maria.garcia@gmail.com',
      rol: 'Usuario'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-800 font-medium">Cargando roles...</p>
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
        </div>
      </div>
    );
  }

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
            className="bg-blue-600 text-white rounded-xl px-6 py-3 font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-2 hover:bg-blue-900">
            <FontAwesomeIcon icon={iconos.faPlus} />
            <span>Agregar Usuario</span>
          </button>
        </div>

        {/* Cards de Roles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {roles.map((rol, index) => (
            <div
              key={rol.id_clasificacion}
              className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up overflow-hidden border border-gray-100"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="p-3">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <FontAwesomeIcon 
                      icon={iconos[rol.nicono] || iconos.faUser} 
                      size="lg" 
                      className="text-blue-600" 
                      title={rol.nombre}
                    />
                  </div>
                  <h2 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    {rol.nombre}
                  </h2>
                </div>
                <p className="text-gray-600 text-sm line-clamp-2 pl-11">
                  {rol.descripcion || 'Sin descripción'}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-fade-in">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-blue-600 to-cyan-600">
                <th className="py-4 px-6 text-left text-sm uppercase tracking-wider text-white">Nombre Completo</th>
                <th className="py-4 px-6 text-left text-sm uppercase tracking-wider text-white">Email</th>
                <th className="py-4 px-6 text-left text-sm uppercase tracking-wider text-white">Rol</th>
                <th className="py-4 px-6 text-center text-sm uppercase tracking-wider text-white">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {usuarios.map((usuario) => (
                <tr key={usuario.id} className="transform hover:scale-[1.01] hover:bg-blue-50 transition-all duration-300">
                  <td className="py-4 px-6 font-medium text-gray-800">{usuario.nombreCompleto}</td>
                  <td className="py-4 px-6 text-gray-600">{usuario.email}</td>
                  <td className="py-4 px-6 text-gray-600">{usuario.rol}</td>
                  <td className="py-4 px-6">
                    <div className="flex justify-center space-x-4">
                      <button 
                        title="Editar usuario"
                        className="text-blue-600 hover:text-blue-800 transform hover:scale-110 transition-all duration-300"
                      >
                        <FontAwesomeIcon icon={iconos.faPen} size="lg" />
                      </button>
                      <button 
                        title="Eliminar usuario"
                        className="text-red-600 hover:text-red-800 transform hover:scale-110 transition-all duration-300"
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