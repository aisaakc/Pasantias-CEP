import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import * as iconos from '@fortawesome/free-solid-svg-icons';
import useIcons from '../hooks/useIcons';

/**
 * Componente reutilizable para seleccionar iconos
 * @param {Object} props - Propiedades del componente
 * @param {string} props.value - Valor seleccionado
 * @param {Function} props.onChange - Función de cambio
 * @param {string} props.name - Nombre del campo
 * @param {boolean} props.disabled - Si está deshabilitado
 * @param {string} props.className - Clases CSS adicionales
 */
const IconSelector = ({ 
  value, 
  onChange, 
  name = 'id_icono', 
  disabled = false,
  className = '' 
}) => {
  const { icons, isLoading, isLoaded } = useIcons();

  if (isLoading) {
    return (
      <div className={`grid grid-cols-6 md:grid-cols-8 gap-3 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3 ${className}`}>
        <div className="col-span-full flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Cargando iconos...</span>
        </div>
      </div>
    );
  }

  if (!isLoaded || icons.length === 0) {
    return (
      <div className={`grid grid-cols-6 md:grid-cols-8 gap-3 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3 ${className}`}>
        <div className="col-span-full flex items-center justify-center py-8">
          <span className="text-gray-500">No hay iconos disponibles</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-6 md:grid-cols-8 gap-3 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3 ${className}`}>
      {/* Opción "Sin icono" */}
      <div 
        className={`flex flex-col items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-blue-50 hover:border-blue-300 ${
          !value ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={() => !disabled && onChange({ target: { name, value: '' } })}
        title="Sin icono"
      >
        <FontAwesomeIcon icon={faTimes} className="text-gray-400 text-lg mb-1" />
        <span className="text-xs text-gray-500 text-center">Sin icono</span>
      </div>

      {/* Iconos disponibles */}
      {icons.map((icon) => {
        const IconComponent = iconos[icon.nombre];
        return (
          <div 
            key={icon.id_clasificacion}
            className={`flex flex-col items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-blue-50 hover:border-blue-300 ${
              value === icon.id_clasificacion.toString() ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => !disabled && onChange({ target: { name, value: icon.id_clasificacion.toString() } })}
            title={icon.nombre}
          >
            {IconComponent ? (
              <FontAwesomeIcon icon={IconComponent} className="text-gray-700 text-lg mb-1" />
            ) : (
              <div className="w-4 h-4 bg-gray-300 rounded mb-1"></div>
            )}
            <span className="text-xs text-gray-500 text-center truncate w-full">
              {icon.nombre}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default IconSelector; 