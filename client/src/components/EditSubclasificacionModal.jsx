import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { toast } from 'sonner';
import useClasificacionStore from '../store/clasificacionStore';
import { getAllClasificaciones } from '../api/clasificacion.api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faXmark, 
  faSave, 
  faTimes, 
  faFolder, 
  faImage, 
  faLayerGroup, 
  faArrowUp 
} from '@fortawesome/free-solid-svg-icons';

const EditSubclasificacionModal = ({ isOpen, onClose, clasificacionToEdit }) => {
  const { updateClasificacion, loading, error, clearError } = useClasificacionStore();

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
    if (isOpen && clasificacionToEdit) {
      setFormData({
        nombre: clasificacionToEdit.nombre || '',
        descripcion: clasificacionToEdit.descripcion || '',
        type_id: clasificacionToEdit.type_id || '',
        parent_id: clasificacionToEdit.parent_id || '',
        id_icono: clasificacionToEdit.id_icono || ''
      });
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
  }, [isOpen, clasificacionToEdit]);

  const fetchClasificaciones = async () => {
    try {
      const response = await getAllClasificaciones();
      setClasificaciones(response.data);
    } catch (err) {
      console.error('Error al cargar clasificaciones:', err);
      toast.error('Error al cargar las clasificaciones');
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
  
      await updateClasificacion(clasificacionToEdit.id_clasificacion, dataToSend);
      toast.success('Clasificación editada correctamente');
      onClose();
    } catch (err) {
      console.error("Error al actualizar:", err);
      toast.error('Error al actualizar la clasificación');
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
        <div className="relative overflow-hidden p-6 border-b border-gray-100">
          <div className="animate-shine absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
             Editar la subclasificación {clasificacionToEdit?.nombre}
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
              ) : field.name === 'type_id' || field.name === 'parent_id' || field.name === 'id_icono' ? (
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
              className="px-6 py-2.5 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-all duration-300 shadow-sm hover:shadow transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              <FontAwesomeIcon icon={faSave} className="mr-2" />
              <span>Guardar Cambios</span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default EditSubclasificacionModal; 