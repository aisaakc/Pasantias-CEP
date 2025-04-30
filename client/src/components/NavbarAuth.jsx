import React from 'react';

export default function NavbarAuth() {
  return (
    <header className="h-16 w-full bg-white text-gray-800 flex items-center justify-end px-6 shadow-md">
      <div className="flex space-x-6 items-center">
        <a href="tel:+123456789" className="flex items-center space-x-2 hover:text-blue-600">
          <span>Contacto</span>
        </a>
        <a href="mailto:correo@ejemplo.com" className="flex items-center space-x-2 hover:text-blue-600">
          <span>Email</span>
        </a>
        <a href="/perfil" className="flex items-center space-x-2 hover:text-blue-600">
          <span>Mi Perfil</span>
        </a>
      </div>
    </header>
  );
}
