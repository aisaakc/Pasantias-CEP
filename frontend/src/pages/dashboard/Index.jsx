// frontend/src/pages/dashboard/Index.jsx

import React from 'react';
import { Outlet } from 'react-router-dom';
// Importamos el componente Sidebar (que ahora incluye el toggle móvil)
import DashboardSidebar from '../../components/DashboardSidebar';
// Importamos el componente Navbar del Dashboard
import DashboardNavbar from '../../components/DashboardNavbar';

const DashboardIndex = () => {
    // Este componente de layout define la estructura principal del dashboard:
    // Sidebar fijo a la izquierda, Navbar en la parte superior del área de contenido,
    // y el contenido específico de la ruta (Outlet) debajo de la Navbar.

    return (
        // Contenedor principal del layout: display flex para layout horizontal (sidebar | contenido)
        <div className="flex min-h-screen bg-gray-100">

            {/* Sidebar: Primer elemento flex. Ocupa ancho fijo (w-64). */}
            {/* DashboardSidebar ya incluye el toggle móvil y la estructura completa del sidebar. */}
            <DashboardSidebar />

            {/* Área de Contenido Principal: El segundo elemento flex */}
            {/* flex-grow: Ocupa todo el espacio horizontal restante. */}
            {/* flex-col: Sus hijos (Navbar y main/Outlet) se apilan verticalmente. */}
            {/* lg:ml-64: Añade margen izquierdo en pantallas grandes para estar al lado del sidebar fijo. */}
            <div className="flex-grow flex flex-col lg:ml-64">

                {/* Navbar: Primer hijo del contenedor flex-col. Se posiciona arriba. */}
                {/* NO necesita ml-64; se alinea automáticamente al borde izquierdo de su padre. */}
                <DashboardNavbar />

                {/* Contenido de la página (Outlet): Segundo hijo del contenedor flex-col. Se posiciona debajo de Navbar. */}
                {/* flex-grow: Ocupa el espacio restante verticalmente. */}
                {/* p-6 y overflow-y-auto gestionan el padding y el scroll del contenido. */}
                <main className="flex-grow p-6 overflow-y-auto">
                    {/* Outlet renderiza el componente de la ruta anidada actual */}
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardIndex;