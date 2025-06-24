// Función para aplicar máscara de teléfono venezolano
export const applyPhoneMask = (value, prefix = '') => {
  // Remover todos los caracteres no numéricos
  const numbers = value.replace(/\D/g, '');
  
  // Si no hay números, retornar vacío
  if (!numbers) return '';
  
  // Si hay prefijo, asegurarse de que los primeros 4 dígitos sean el prefijo
  let formattedNumber = numbers;
  if (prefix && prefix.length === 4) {
    // Si el número empieza con el prefijo, mantenerlo
    if (numbers.startsWith(prefix)) {
      formattedNumber = numbers;
    } else {
      // Si no empieza con el prefijo, agregarlo al inicio
      formattedNumber = prefix + numbers.substring(0, 7);
    }
  }
  
  // Limitar a 11 dígitos (4 prefijo + 7 número)
  formattedNumber = formattedNumber.substring(0, 11);
  
  // Aplicar formato: (9999)-999.99.99
  if (formattedNumber.length >= 4) {
    const prefixPart = formattedNumber.substring(0, 4);
    const remaining = formattedNumber.substring(4);
    
    if (remaining.length >= 3) {
      const firstPart = remaining.substring(0, 3);
      const secondPart = remaining.substring(3, 5);
      const thirdPart = remaining.substring(5, 7);
      
      if (secondPart.length > 0 && thirdPart.length > 0) {
        return `(${prefixPart})-${firstPart}.${secondPart}.${thirdPart}`;
      } else if (secondPart.length > 0) {
        return `(${prefixPart})-${firstPart}.${secondPart}`;
      } else {
        return `(${prefixPart})-${firstPart}`;
      }
    } else {
      return `(${prefixPart})-${remaining}`;
    }
  }
  
  return formattedNumber;
};

// Función para extraer solo números del valor con máscara
export const extractNumbers = (value) => {
  return value.replace(/\D/g, '');
};

// Función para validar formato de teléfono venezolano
export const validatePhoneFormat = (value) => {
  const numbers = extractNumbers(value);
  
  // Debe tener exactamente 11 dígitos (4 prefijo + 7 número)
  if (numbers.length !== 11) {
    return false;
  }
  
  // Validar que sean solo números
  if (!/^\d{11}$/.test(numbers)) {
    return false;
  }
  
  return true;
};

// Función para validar prefijo contra lista dinámica de la BD
export const validatePrefix = (prefix, validPrefixes = []) => {
  return validPrefixes.includes(prefix);
};

// Función para obtener el prefijo del número
export const getPrefixFromNumber = (value) => {
  const numbers = extractNumbers(value);
  return numbers.substring(0, 4);
};

// Función para obtener el número sin prefijo
export const getNumberWithoutPrefix = (value) => {
  const numbers = extractNumbers(value);
  return numbers.substring(4);
};

// Función para validar teléfono completo (formato + prefijo)
export const validateCompletePhone = (value, validPrefixes = []) => {
  const numbers = extractNumbers(value);
  
  // Validar formato básico
  if (!validatePhoneFormat(value)) {
    return { valid: false, error: 'El teléfono debe tener exactamente 11 dígitos' };
  }
  
  // Validar prefijo
  const prefix = numbers.substring(0, 4);
  if (!validatePrefix(prefix, validPrefixes)) {
    return { valid: false, error: 'El prefijo telefónico no es válido. Seleccione un prefijo de la lista.' };
  }
  
  return { valid: true, error: null };
}; 