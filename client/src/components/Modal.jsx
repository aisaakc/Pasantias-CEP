import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import useClasificacionStore from '../store/clasificacionStore';
import { getAllClasificaciones } from '../api/clasificacion.api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faSave, faTimes, faFolder, faImage, faLayerGroup, faArrowUp } from '@fortawesome/free-solid-svg-icons';

const Modal = ({ isOpen, onClose }) => {
  const { createClasificacion, loading, error, clearError } = useClasificacionStore();

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    type_id: '',
    parent_id: '',
    id_icono: ''
  });

  const [clasificaciones, setClasificaciones] = useState([]);
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [activeField, setActiveField] = useState('');
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      document.body.style.overflow = 'hidden';
      setTimeout(() => setAnimationClass('animate-modal-in'), 10);
      fetchClasificaciones();
    } else {
      setAnimationClass('animate-modal-out');
      document.body.style.overflow = 'unset';
      const timeout = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        nombre: '',
        descripcion: '',
        type_id: '',
        parent_id: '',
        id_icono: ''
      });
      clearError();
      setActiveField('');
    }
  }, [isOpen, clearError]);

  const fetchClasificaciones = async () => {
    try {
      const response = await getAllClasificaciones();
      setClasificaciones(response.data);
    } catch (err) {
      console.error('Error al cargar clasificaciones:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFocus = (fieldName) => {
    setActiveField(fieldName);
  };

  const handleBlur = () => {
    setActiveField('');
  };

  const handleSubmit = async () => {
    try {
      const dataToSend = {
        ...formData,
        type_id: formData.type_id !== '' ? parseInt(formData.type_id) : null,
        parent_id: formData.parent_id !== '' ? parseInt(formData.parent_id) : null,
        id_icono: formData.id_icono !== '' ? parseInt(formData.id_icono) : null,
      };
  
      await createClasificacion(dataToSend);
      onClose();
    } catch (err) {
      console.error("Error al guardar:", err);
    }
  };

  if (!shouldRender) return null;

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
        {/* Encabezado con animación de brillo */}
        <div className="relative overflow-hidden p-6 border-b border-gray-100">
          <div className="animate-shine absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Agregar Clasificación
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full transform hover:rotate-90 duration-300"
            >
              <FontAwesomeIcon icon={faXmark} className="text-xl" />
            </button>
          </div>
        </div>

        {/* Contenido con animación de entrada escalonada */}
        <div className="p-6 space-y-5">
          {[
            { name: 'nombre', icon: faFolder, label: 'Nombre' },
            { name: 'descripcion', icon: faLayerGroup, label: 'Descripción' },
            { name: 'type_id', icon: faLayerGroup, label: 'Tipo' },
            { name: 'parent_id', icon: faArrowUp, label: 'Clasificación Padre' },
            { name: 'id_icono', icon: faImage, label: 'Icono' }
          ].map((field, index) => (
            <div 
              key={field.name}
              className={`transform transition-all duration-300 animate-fade-slide-up`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FontAwesomeIcon icon={field.icon} className="mr-2 text-blue-500" />
                {field.label}
              </label>
              {field.name === 'descripcion' ? (
                <textarea
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  onFocus={() => handleFocus(field.name)}
                  onBlur={handleBlur}
                  placeholder={`${field.label} detallado...`}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-300 min-h-[100px] resize-none"
                />
              ) : field.name.includes('_id') ? (
                <select
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  onFocus={() => handleFocus(field.name)}
                  onBlur={handleBlur}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-300 appearance-none bg-white"
                >
                  <option value="">Seleccionar {field.label.toLowerCase()}</option>
                  {clasificaciones.map((c) => (
                    <option key={c.id_clasificacion} value={c.id_clasificacion}>
                      {c.nombre}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  onFocus={() => handleFocus(field.name)}
                  onBlur={handleBlur}
                  placeholder={`${field.label}...`}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-300"
                />
              )}
            </div>
          ))}

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center space-x-2 animate-shake">
              <FontAwesomeIcon icon={faTimes} className="text-red-500" />
              <p>{error}</p>
            </div>
          )}
        </div>

        {/* Pie del modal con animación de brillo */}
        <div className="relative overflow-hidden border-t border-gray-100 p-6 bg-gray-50 rounded-b-2xl">
          <div className="animate-shine absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-lg text-gray-700 hover:text-gray-900 bg-white border border-gray-200 hover:bg-gray-50 transition-all duration-300 shadow-sm hover:shadow transform hover:scale-105"
              disabled={loading}
            >
              <FontAwesomeIcon icon={faTimes} className="mr-2" />
              <span>Cancelar</span>
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2.5 rounded-lg text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-sm hover:shadow-lg transform hover:scale-105 disabled:opacity-50 group"
              disabled={loading}
            >
              <FontAwesomeIcon 
                icon={faSave} 
                className={`mr-2 ${loading ? 'animate-spin' : 'group-hover:rotate-12 transition-transform duration-300'}`} 
              />
              <span>{loading ? 'Guardando...' : 'Guardar'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

// Añadir estilos necesarios en tu archivo CSS global
const style = document.createElement('style');
style.textContent = `
  @keyframes modalIn {
    from {
      opacity: 0;
      transform: scale(0.95) translateY(10px) rotateX(-10deg);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0) rotateX(0);
    }
  }

  @keyframes modalOut {
    from {
      opacity: 1;
      transform: scale(1) translateY(0) rotateX(0);
    }
    to {
      opacity: 0;
      transform: scale(0.95) translateY(10px) rotateX(10deg);
    }
  }

  @keyframes shine {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(100%);
    }
  }

  @keyframes fadeSlideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .perspective-1000 {
    perspective: 1000px;
  }

  .animate-modal-in {
    animation: modalIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .animate-modal-out {
    animation: modalOut 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .animate-shine {
    animation: shine 2s infinite;
  }

  .animate-fade-slide-up {
    animation: fadeSlideUp 0.5s ease-out forwards;
  }
`;
document.head.appendChild(style);

export default Modal;
