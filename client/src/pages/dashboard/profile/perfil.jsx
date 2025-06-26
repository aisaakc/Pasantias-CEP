import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faEnvelope, 
  faPhone, 
  faMapMarkerAlt, 
  faCalendarAlt, 
  faEdit, 
  faSave, 
  faTimes,

  faUsers,

} from '@fortawesome/free-solid-svg-icons';

export default function Perfil() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setUser(userData);
      setFormData({
        nombre: userData.nombre || '',
        apellido: userData.apellido || '',
        email: userData.email || '',
        telefono: userData.telefono || '',
        direccion: userData.direccion || '',
        fecha_nacimiento: userData.fecha_nacimiento || ''
      });
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Aquí iría la lógica para actualizar el usuario en el backend
      // Por ahora simulamos una actualización exitosa
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Actualizar localStorage con los nuevos datos
      const updatedUser = { ...user, ...formData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      setIsEditing(false);
      toast.success('Perfil actualizado correctamente');
    } catch  {
      toast.error('Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      nombre: user?.nombre || '',
      apellido: user?.apellido || '',
      email: user?.email || '',
      telefono: user?.telefono || '',
      direccion: user?.direccion || '',
      fecha_nacimiento: user?.fecha_nacimiento || ''
    });
    setIsEditing(false);
  };

  

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mi Perfil</h1>
        <p className="text-gray-600">Gestiona tu información personal y configuración de cuenta</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tarjeta de información principal */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <FontAwesomeIcon icon={faUser} className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">
                      {user.nombre} {user.apellido}
                    </h2>
                    <p className="text-blue-100">{user.email}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                    >
                      <FontAwesomeIcon icon={faEdit} className="w-4 h-4" />
                      <span>Editar</span>
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSave}
                        disabled={loading}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50"
                      >
                        <FontAwesomeIcon icon={faSave} className="w-4 h-4" />
                        <span>{loading ? 'Guardando...' : 'Guardar'}</span>
                      </button>
                      <button
                        onClick={handleCancel}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                      >
                        <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
                        <span>Cancelar</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nombre */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FontAwesomeIcon icon={faUser} className="w-4 h-4 inline mr-2" />
                    Nombre
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{user.nombre || 'No especificado'}</p>
                  )}
                </div>

                {/* Apellido */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FontAwesomeIcon icon={faUser} className="w-4 h-4 inline mr-2" />
                    Apellido
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="apellido"
                      value={formData.apellido}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{user.apellido || 'No especificado'}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FontAwesomeIcon icon={faEnvelope} className="w-4 h-4 inline mr-2" />
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{user.email}</p>
                  )}
                </div>

                {/* Teléfono */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FontAwesomeIcon icon={faPhone} className="w-4 h-4 inline mr-2" />
                    Teléfono
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+1234567890"
                    />
                  ) : (
                    <p className="text-gray-900">{user.telefono || 'No especificado'}</p>
                  )}
                </div>

                {/* Dirección */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="w-4 h-4 inline mr-2" />
                    Dirección
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ingresa tu dirección"
                    />
                  ) : (
                    <p className="text-gray-900">{user.direccion || 'No especificada'}</p>
                  )}
                </div>

                {/* Fecha de nacimiento */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FontAwesomeIcon icon={faCalendarAlt} className="w-4 h-4 inline mr-2" />
                    Fecha de nacimiento
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      name="fecha_nacimiento"
                      value={formData.fecha_nacimiento}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">
                      {user.fecha_nacimiento ? new Date(user.fecha_nacimiento).toLocaleDateString('es-ES') : 'No especificada'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar con información adicional */}
        <div className="space-y-6">
        
          {/* Estadísticas */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FontAwesomeIcon icon={faUsers} className="w-5 h-5 mr-2" />
              Estadísticas
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Cursos completados</span>
                <span className="text-sm font-medium text-gray-900">0</span>
              </div>
            
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Última actividad</span>
                <span className="text-sm font-medium text-gray-900">Hoy</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 