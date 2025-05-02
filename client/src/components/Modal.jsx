import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import useClasificacionStore from '../store/clasificacionStore';
import { getAllClasificaciones } from '../api/clasificacion.api';

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

  // Mostrar u ocultar el modal suavemente
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      fetchClasificaciones();
    } else {
      const timeout = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  // Reset al cerrar
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
    }
  }, [isOpen, clearError]);

  // Cargar opciones para selects
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

  const tiposUnicos = [...new Set(clasificaciones.map(c => c.type_id))];

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
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className={`bg-white w-full max-w-lg rounded-xl shadow-xl p-6 transform transition-all duration-300 ${isOpen ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-4 opacity-0'}`}>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Agregar Clasificación</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Nombre de la clasificación"
              className="mt-1 p-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Descripción"
              className="mt-1 p-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Tipo</label>
            <select
  name="type_id"
  value={formData.type_id}
  onChange={handleChange}
  className="mt-1 p-2 w-full border rounded-lg"
>
  <option value="">Selecciona un tipo</option>
  {tiposUnicos.map((tipo) => (
    <option key={tipo} value={tipo}>
      Tipo {tipo}
    </option>
  ))}
</select>

          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Clasificación Padre</label>
            <select
              name="parent_id"
              value={formData.parent_id}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-lg"
            >
              <option value="">Sin padre (raíz)</option>
              {clasificaciones.map((c) => (
                <option key={c.id_clasificacion} value={c.id_clasificacion}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Icono</label>
            <select
              name="id_icono"
              value={formData.id_icono}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-lg"
            >
              <option value="">Selecciona un ícono</option>
              {clasificaciones.map((c) => (
                <option key={c.id_clasificacion} value={c.id_icono}>
                  {c.nombre} (ID Icono: {c.id_icono})
                </option>
              ))}
            </select>
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}
        </div>

        <div className="flex justify-end mt-6 space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
