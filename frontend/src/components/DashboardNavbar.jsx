// frontend/src/components/DashboardNavbar.jsx

import React from 'react';
import { useAuth } from '../context/AuthContext';
// Ya no necesitamos importar Link aquí
// import { Link } from 'react-router-dom';
import ProfileAvatar from './ProfileAvatar'; // Importamos el componente ProfileAvatar

const DashboardNavbar = () => {
    const { user } = useAuth();
    // Eliminamos la lógica del saludo ya que no se mostrará
    // const greeting = user ? `Bienvenido, ${user.nombre}` : 'Bienvenido';

    return (
        // Header principal de la Navbar del dashboard
        // Sigue usando flex y justify-between (aunque justify-between no tendrá efecto visible con solo un hijo)
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
            {/* --- Eliminamos el h1 que mostraba el saludo --- */}
            {/* <h1>{greeting}</h1> */}
            {/* Ahora el lado izquierdo está vacío */}

            {/* Contenedor del lado derecho: Elementos de usuario / acciones */}
            {/* --- Añadimos ml-auto aquí para empujar este div a la derecha --- */}
            <div className="flex items-center space-x-4 ml-auto"> {/* Añadimos ml-auto */}
                 {/* Renderizamos el componente ProfileAvatar si el usuario está logueado */}
                 {user && (
                    <ProfileAvatar />
                 )}
                {/* Otros elementos opcionales como íconos de notificación irían aquí */}
            </div>
        </header>
    );
};

export default DashboardNavbar;