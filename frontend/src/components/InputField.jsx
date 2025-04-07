import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'; // Importamos los iconos desde lucide-react
import { Link } from 'react-router-dom'; // Importamos Link de react-router-dom

export default function InputField({
  type,
  value,
  onChange,
  placeholder,
  name,
  error,
  touched,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  // Verificamos si hay error y si el campo ha sido tocado
  const borderColor = error && touched ? '#ef4444' : '#e5e7eb'; // Rojo si hay error, gris si no

  return (
    <div className="mb-4">
      <div
        className={`flex items-center border-2 py-3 px-4 rounded-xl transition-all`}
        style={{ borderColor: borderColor }}
      >
        {/* Usamos Mail para el email y Lock para la contraseña */}
        {type === 'email' ? (
          <Mail className="h-5 w-5 text-gray-400 mr-3" />
        ) : (
          <Lock className="h-5 w-5 text-gray-400 mr-3" />
        )}

        {/* Campo de entrada */}
        <input
          className="pl-3 outline-none border-none w-full text-gray-700"
          type={type === 'password' && !showPassword ? 'password' : 'text'} // Si showPassword es falso, se oculta
          value={value} // Aquí utilizamos el valor proporcionado
          onChange={onChange} // Aquí utilizamos la función de cambio proporcionada
          placeholder={placeholder}
          name={name} // Aseguramos que el campo tiene el nombre correcto
          required
        />

        {/* Icono para mostrar/ocultar la contraseña */}
        {type === 'password' && (
          <span
            onClick={handleTogglePassword}
            className="cursor-pointer ml-3"
          >
            {/* Mostrar Eye (ojo abierto) cuando la contraseña está oculta */}
            {showPassword ? (
              <Eye className="h-5 w-5 text-gray-400" />
            ) : (
              <EyeOff className="h-5 w-5 text-gray-400" />
            )}
          </span>
        )}
      </div>

      {/* Mostrar mensaje de error */}
      {error && touched && (
        <div className="text-sm text-red-500 mt-1">{error}</div>
      )}

      {/* Enlace: "No tienes cuenta? Regístrate" */}
      {type === 'password' && (
        <div className="text-center mt-4">
          <span className="text-sm text-blue-600 cursor-pointer hover:underline">
            ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
          </span>
        </div>
      )}
    </div>
  );
}
