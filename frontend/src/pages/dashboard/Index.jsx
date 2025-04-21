// frontend/src/pages/dashboard/Index.jsx
import React from 'react';
import { Outlet } from 'react-router-dom'; // Outlet es donde se renderizarán los componentes de las rutas anidadas
import DashboardSidebar from '../../components/DashboardSidebar'; // Importar el sidebar

const DashboardIndex = () => {
  return (
    // Contenedor principal del layout del dashboard (usa flexbox para sidebar + contenido)
    <div className="flex min-h-screen bg-gray-100"> {/* Ajusta el color de fondo si es necesario */}

      {/* Área del Sidebar */}
      <div className="w-64 bg-gray-800 text-white flex-shrink-0"> {/* Ancho fijo para el sidebar, color oscuro */}
        <div className="p-4"> {/* Padding dentro del sidebar */}
          <h2 className="text-2xl font-bold mb-4">Dashboard Navegación</h2> {/* Título del sidebar */}
          <DashboardSidebar /> {/* Renderizar el componente del sidebar */}
        </div>
      </div>

      {/* Área del Contenido Principal */}
      {/* flex-grow hace que esta área ocupe el espacio restante */}
      <div className="flex-grow p-6 overflow-y-auto"> {/* Padding y auto-scroll si el contenido es largo */}
        {/* Título de la página actual (opcional, podrías manejarlo en los componentes hijos) */}
        {/* <h1 className="text-2xl font-bold mb-6 text-gray-800">Contenido Principal</h1> */}

        {/* --- Outlet: Aquí se renderizarán los componentes de las rutas anidadas (rutas hijas de /dashboard) --- */}
        <Outlet />
        {/* ----------------------------------------------------------------------------------------------------- */}
      </div>
    </div>
  );
};

export default DashboardIndex;