import React, { useState, useEffect } from 'react';
import { applyPhoneMask, extractNumbers, validatePhoneFormat } from '../utils/phoneMask';

const PhoneInput = ({ 
  field, 
  form, 
  prefijosTelefonicos = [], 
  onBlur, 
  placeholder = "Tu número de teléfono",
  className = ""
}) => {
  const [selectedPrefix, setSelectedPrefix] = useState('');
  const [displayValue, setDisplayValue] = useState('');
  const [isValid, setIsValid] = useState(true);

  // Obtener los códigos de prefijos válidos de la BD
  const validPrefixes = prefijosTelefonicos.map(prefijo => prefijo.nombre);

  // Ordenar prefijos: primero móviles (mobile: true), luego fijos (mobile: false), ordenados numéricamente
  const sortedPrefijos = [...prefijosTelefonicos].sort((a, b) => {
    // Primero separar por tipo (móvil vs fijo)
    const aIsMobile = a.adicional?.mobile === true;
    const bIsMobile = b.adicional?.mobile === true;
    
    if (aIsMobile && !bIsMobile) return -1; // a es móvil, b es fijo
    if (!aIsMobile && bIsMobile) return 1;  // a es fijo, b es móvil
    
    // Si ambos son del mismo tipo, ordenar numéricamente por nombre (prefijo)
    return parseInt(a.nombre) - parseInt(b.nombre);
  });

  // Inicializar con el valor actual si existe
  useEffect(() => {
    if (field.value) {
      const numbers = extractNumbers(field.value);
      if (numbers.length >= 4) {
        const prefix = numbers.substring(0, 4);
        setSelectedPrefix(prefix);
        setDisplayValue(applyPhoneMask(field.value, prefix));
      } else {
        setDisplayValue(field.value);
      }
    }
  }, [field.value]);

  // Función para validar si el prefijo es válido según la BD
  const validatePrefix = (prefix) => {
    return validPrefixes.includes(prefix);
  };

  // Manejar cambio de prefijo
  const handlePrefixChange = (e) => {
    const newPrefix = e.target.value;
    setSelectedPrefix(newPrefix);
    
    if (newPrefix) {
      // Aplicar el nuevo prefijo al número actual
      const currentNumbers = extractNumbers(displayValue);
      const numberWithoutPrefix = currentNumbers.substring(4);
      const newFullNumber = newPrefix + numberWithoutPrefix;
      const newDisplayValue = applyPhoneMask(newFullNumber, newPrefix);
      
      setDisplayValue(newDisplayValue);
      form.setFieldValue(field.name, newFullNumber);
    } else {
      // Si no hay prefijo seleccionado, limpiar el campo
      setDisplayValue('');
      form.setFieldValue(field.name, '');
    }
  };

  // Manejar cambio en el campo de teléfono
  const handlePhoneChange = (e) => {
    const inputValue = e.target.value;
    const maskedValue = applyPhoneMask(inputValue, selectedPrefix);
    
    setDisplayValue(maskedValue);
    
    // Extraer solo números para el valor real
    const numbersOnly = extractNumbers(maskedValue);
    form.setFieldValue(field.name, numbersOnly);
    
    // Validar formato y prefijo
    const validFormat = numbersOnly.length === 0 || validatePhoneFormat(maskedValue);
    const validPrefix = numbersOnly.length === 0 || numbersOnly.length < 4 || validatePrefix(numbersOnly.substring(0, 4));
    const valid = validFormat && validPrefix;
    
    setIsValid(valid);
    
    // Limpiar error si el formato es válido
    if (valid && form.errors[field.name]) {
      form.setFieldError(field.name, undefined);
    }
  };

  // Manejar blur del campo
  const handleBlur = (e) => {
    const numbersOnly = extractNumbers(displayValue);
    
    // Validar formato y prefijo al perder el foco
    if (numbersOnly.length > 0) {
      const formatValid = validatePhoneFormat(displayValue);
      const prefixValid = validatePrefix(numbersOnly.substring(0, 4));
      
      if (!formatValid) {
        form.setFieldError(field.name, 'El teléfono debe tener el formato (9999)-999.99.99');
        setIsValid(false);
      } else if (!prefixValid) {
        form.setFieldError(field.name, 'El prefijo telefónico no es válido. Seleccione un prefijo de la lista.');
        setIsValid(false);
      } else {
        setIsValid(true);
      }
    } else {
      setIsValid(true);
    }
    
    // Llamar al onBlur original si existe
    if (onBlur) {
      onBlur(e, field, form);
    }
  };

  return (
    <div className="flex space-x-2">
      {/* Select de prefijos */}
      <div className="w-1/3">
        <select
          value={selectedPrefix}
          onChange={handlePrefixChange}
          className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
            !selectedPrefix ? 'text-gray-500' : 'text-gray-900'
          }`}
        >
          <option value="">Prefijo</option>
          {/* Grupo de prefijos móviles */}
          {sortedPrefijos.filter(prefijo => prefijo.adicional?.mobile === true).length > 0 && (
            <optgroup label="📱 Móviles">
              {sortedPrefijos
                .filter(prefijo => prefijo.adicional?.mobile === true)
                .map((prefijo) => (
                  <option key={prefijo.id} value={prefijo.nombre}>
                    {prefijo.nombre} - {prefijo.descripcion || `Prefijo móvil ${prefijo.nombre}`}
                  </option>
                ))}
            </optgroup>
          )}
          
          {/* Grupo de prefijos fijos */}
          {sortedPrefijos.filter(prefijo => prefijo.adicional?.mobile === false).length > 0 && (
            <optgroup label="🏠 Fijos">
              {sortedPrefijos
                .filter(prefijo => prefijo.adicional?.mobile === false)
                .map((prefijo) => (
                  <option key={prefijo.id} value={prefijo.nombre}>
                    {prefijo.nombre} - {prefijo.descripcion || `Prefijo fijo ${prefijo.nombre}`}
                  </option>
                ))}
            </optgroup>
          )}
          
          {/* Prefijos sin información de móvil/fijo */}
          {sortedPrefijos.filter(prefijo => prefijo.adicional?.mobile === undefined).length > 0 && (
            <optgroup label="📞 Otros">
              {sortedPrefijos
                .filter(prefijo => prefijo.adicional?.mobile === undefined)
                .map((prefijo) => (
                  <option key={prefijo.id} value={prefijo.nombre}>
                    {prefijo.nombre} - {prefijo.descripcion || `Prefijo ${prefijo.nombre}`}
                  </option>
                ))}
            </optgroup>
          )}
        </select>
      </div>
      
      {/* Campo de teléfono */}
      <div className="w-2/3">
        <input
          value={displayValue}
          onChange={handlePhoneChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
            !isValid || (form.touched[field.name] && form.errors[field.name])
              ? 'border-red-500 bg-red-50 focus:ring-red-500 focus:border-red-500' 
              : 'border-gray-300'
          } ${className}`}
        />
      </div>
    </div>
  );
};

export default PhoneInput; 