import React from 'react'; // Ya no necesitamos useState ni useEffect
import { NavLink } from 'react-router-dom';


export default function DashboardSidebar() {

  const baseLinkClasses = "flex items-center py-2 px-4 rounded-md transition duration-200 w-full text-left";
  const activeLinkClasses = "bg-gray-700 text-white";
  const inactiveLinkClasses = "text-gray-300 hover:bg-gray-700 hover:text-white";

  // Eliminamos toggleClasses si no hay toggle

  return (
    <div className="w-64 bg-gray-800 text-white fixed h-full top-0 left-0 hidden lg:flex flex-col p-4">
      {/* Área para el logo o título del Dashboard */}
      <div className="text-2xl font-semibold mb-6">
        Tu Dashboard
      </div>

      {/* Sección de Navegación */}
      <nav className="flex-grow">
        <ul>
          {/* Enlace a la página principal del Dashboard */}
          <li className="mb-2">
            <NavLink
              to="/dashboard"
              end
              className={({ isActive }) =>
                `${baseLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`
              }
            >
             Clasificaciones
            </NavLink>
          </li>
          <li className="mb-2">
             <div className={`${baseLinkClasses} ${inactiveLinkClasses}`}>
                xd
             </div>
          </li>
        </ul>
      </nav>
    </div>
  );
}