import React from 'react';

export default function Perfil() {
  // Obtener el usuario desde localStorage
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    return <div className="text-center mt-10">No se encontraron datos del usuario.</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Perfil de Usuario</h2>
      <div className="mb-2"><strong>Nombre:</strong> {user.nombre}</div>
      <div className="mb-2"><strong>Apellido:</strong> {user.apellido}</div>
      <div className="mb-2"><strong>Email:</strong> {user.email}</div>
      {/* Puedes agregar más campos según la estructura de tu usuario */}
    </div>
  );
}
