import React from 'react';
import { useAuth } from '../context/AuthContext';
const UserProfilePage = () => {
  
  const { user } = useAuth();  
  if (!user) {
      
      return <div>Cargando perfil o acceso denegado...</div>;
  }
  
  return (
    <div className="container mx-auto p-6 mt-8"> {/* Ajusta mt-8 para el Navbar fijo */}
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Mi Perfil</h1>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Información de Usuario</h2>
        
        <p className="mb-2"><strong>Nombre Completo:</strong> {user.nombre} {user.apellido}</p>
        <p className="mb-2"><strong>Correo Electrónico:</strong> {user.gmail}</p>
        <p className="mb-2"><strong>Cédula:</strong> {user.cedula}</p>
    <p className="mb-2"><strong>Rol ID:</strong> {user.id_rol} </p>
      
      </div>

    </div>
  );
};

export default UserProfilePage;