// frontend/src/components/DashboardNavbar.jsx

import React from 'react';
import { useAuth } from '../context/AuthContext'; // Para obtener los datos del usuario
// Ya no necesitamos importar Link aquí si solo lo usamos dentro de ProfileAvatar
// import { Link } from 'react-router-dom';
// Importamos el nuevo componente ProfileAvatar
import ProfileAvatar from './ProfileAvatar';

const DashboardNavbar = () => {
    // Obtenemos el objeto 'user' del contexto de autenticación
    const { user } = useAuth();

    // Preparamos un saludo personalizado usando el nombre del usuario, si está disponible
    const greeting = user ? `Bienvenido, ${user.nombre}` : 'Bienvenido';

    return (
        // Header principal de la Navbar del dashboard
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
            {/* Sección izquierda: Saludo o Título */}
            <h1 className="text-xl font-semibold text-gray-800">
                {greeting}
            </h1>

            {/* Sección derecha: Elementos de usuario / acciones */}
            <div className="flex items-center space-x-4">
                 {/* Renderizamos el componente ProfileAvatar si el usuario está logueado */}
                 {/* ProfileAvatar ya es un enlace a /dashboard/profile */}
                 {user && (
                    <ProfileAvatar />
                 )}

                {/* Otros elementos opcionales como íconos de notificación irían aquí */}
            </div>
        </header>
    );
};

export default DashboardNavbar;