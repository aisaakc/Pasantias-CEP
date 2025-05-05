import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { toast } from 'sonner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useClasificacionStore from '../store/clasificacionStore';
import { getAllClasificaciones } from '../api/clasificacion.api';
import { 
  faXmark, 
  faSave, 
  faTimes, 
  faFolder, 
  faImage, 
  faLayerGroup
} from '@fortawesome/free-solid-svg-icons';

export default function CreateSubclasificacionModal({ isOpen, onClose, parentId, nombreClasificacion }) {
  const { createSubclasificacion, loading, error } = useClasificacionStore();
  const [clasificaciones, setClasificaciones] = useState([]);
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [animationClass, setAnimationClass] = useState('');
  const [activeField, setActiveField] = useState('');

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    id_icono: ''
  });

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

  const fetchClasificaciones = async () => {
    try {
      const response = await getAllClasificaciones();
      setClasificaciones(response.data);
    } catch (err) {
      console.error('Error al cargar clasificaciones:', err);
      toast.error('Error al cargar las clasificaciones');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        type_id: parentId,
        id_icono: formData.id_icono !== '' ? parseInt(formData.id_icono) : null,
      };
      await createSubclasificacion(dataToSend);
      toast.success(`Subclasificación "${dataToSend.nombre}" creada correctamente`);
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

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className={`relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 transform transition-all duration-300 ${animationClass}`}>
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Crear {nombreClasificacion}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FontAwesomeIcon icon={faXmark} className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-5">
            {[
              { name: 'nombre', icon: faFolder, label: 'Nombre' },
              { name: 'descripcion', icon: faLayerGroup, label: 'Descripción' },
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
                ) : field.name === 'id_icono' ? (
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

          <div className="flex justify-end gap-4 p-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FontAwesomeIcon icon={faSave} />
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
} 