import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { toast } from 'sonner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as iconos from '@fortawesome/free-solid-svg-icons';
import useClasificacionStore from '../store/clasificacionStore';
import { 
  faXmark, 
  faSave, 
  faTimes, 
  faFolder, 
  faImage, 
  faLayerGroup,
  faIcons,
  faSearch
} from '@fortawesome/free-solid-svg-icons';

export default function CreateSubclasificacionModal({ isOpen, onClose, parentId }) {
  const { createSubclasificacion, loading, error } = useClasificacionStore();
  const [searchIcon, setSearchIcon] = useState('');
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [animationClass, setAnimationClass] = useState('');
  const [activeField, setActiveField] = useState('');

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    nicono: 'faFile'
  });

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      document.body.style.overflow = 'hidden';
      setTimeout(() => setAnimationClass('animate-modal-in'), 10);
    } else {
      setAnimationClass('animate-modal-out');
      document.body.style.overflow = 'unset';
      const timeout = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createSubclasificacion({
        ...formData,
        type_id: parentId
      });
      toast.success('Subclasificación creada correctamente');
      onClose();
    } catch (error) {
      console.error('Error al crear subclasificación:', error);
      toast.error('Error al crear la subclasificación');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFocus = (fieldName) => {
    setActiveField(fieldName);
  };

  const handleBlur = () => {
    setActiveField('');
  };

  if (!shouldRender) return null;

  // Lista de iconos disponibles filtrada por búsqueda
  const iconList = Object.keys(iconos)
    .filter(key => key.startsWith('fa') && 
      key.toLowerCase().includes(searchIcon.toLowerCase()));

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center perspective-1000">
      <div 
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-all duration-500 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`} 
        onClick={onClose}
      />
      
      <div 
        className={`relative w-full max-w-xl bg-white rounded-2xl shadow-2xl transform transition-all duration-500 ${
          animationClass
        }`}
      >
        <div className="relative overflow-hidden p-6 border-b border-gray-100">
          <div className="animate-shine absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Crear Nueva Subclasificación
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full transform hover:rotate-90 duration-300"
            >
              <FontAwesomeIcon icon={faXmark} className="text-xl" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Campo Nombre */}
          <div className="transform transition-all duration-300 animate-fade-slide-up">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FontAwesomeIcon icon={faFolder} className="mr-2 text-blue-500" />
              Nombre
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              onFocus={() => handleFocus('nombre')}
              onBlur={handleBlur}
              placeholder="Nombre de la subclasificación..."
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-300"
              required
            />
          </div>

          {/* Campo Descripción */}
          <div className="transform transition-all duration-300 animate-fade-slide-up" style={{ animationDelay: '100ms' }}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FontAwesomeIcon icon={faLayerGroup} className="mr-2 text-blue-500" />
              Descripción
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              onFocus={() => handleFocus('descripcion')}
              onBlur={handleBlur}
              placeholder="Descripción detallada..."
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-300 min-h-[100px] resize-none"
            />
          </div>

          {/* Selector de Ícono */}
          <div className="space-y-4 transform transition-all duration-300 animate-fade-slide-up" style={{ animationDelay: '200ms' }}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FontAwesomeIcon icon={faIcons} className="mr-2 text-blue-500" />
              Ícono
            </label>
            
            {/* Búsqueda de íconos */}
            <div className="relative">
              <FontAwesomeIcon 
                icon={faSearch} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={searchIcon}
                onChange={(e) => setSearchIcon(e.target.value)}
                placeholder="Buscar ícono..."
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-300"
              />
            </div>

            {/* Grid de íconos */}
            <div className="grid grid-cols-6 gap-2 p-3 border border-gray-200 rounded-lg max-h-40 overflow-y-auto bg-gray-50">
              {iconList.map(iconName => (
                <div
                  key={iconName}
                  onClick={() => handleChange({ target: { name: 'nicono', value: iconName } })}
                  className={`p-2 rounded-lg cursor-pointer hover:bg-blue-100 transition-all duration-300 flex flex-col items-center ${
                    formData.nicono === iconName ? 'bg-blue-500 text-white' : 'bg-white'
                  }`}
                >
                  <FontAwesomeIcon icon={iconos[iconName]} className="text-xl mb-1" />
                  <span className="text-xs truncate w-full text-center">
                    {iconName.replace('fa', '')}
                  </span>
                </div>
              ))}
            </div>

            {/* Vista previa del ícono seleccionado */}
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <FontAwesomeIcon
                icon={iconos[formData.nicono]}
                className="text-4xl text-blue-600 mr-3"
              />
              <span className="text-sm text-gray-600">
                Ícono seleccionado: {formData.nicono}
              </span>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center space-x-2 animate-shake">
              <FontAwesomeIcon icon={faTimes} className="text-red-500" />
              <p>{error}</p>
            </div>
          )}
        </div>

        <div className="relative overflow-hidden border-t border-gray-100 p-6 bg-gray-50 rounded-b-2xl">
          <div className="animate-shine absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-lg text-gray-700 hover:text-gray-900 bg-white border border-gray-200 hover:bg-gray-50 transition-all duration-300 shadow-sm hover:shadow transform hover:scale-105"
              disabled={loading}
            >
              <FontAwesomeIcon icon={faTimes} className="mr-2" />
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2.5 rounded-lg text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
              disabled={loading}
            >
              <FontAwesomeIcon icon={faSave} className="mr-2" />
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
} 