// frontend/src/components/DashboardSidebar.jsx
import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
// Importar la acción para establecer el filtro Y el thunk para cargar la lista
import {
  setParentClasificacionFilter,
  fetchParentClassificationsAsync // Importa el thunk
} from '../features/dashboard/dashboardFilterSlice';


export default function DashboardSidebar() {
  const dispatch = useDispatch();

  // --- Leer el estado de clasificaciones y filtro desde Redux ---
  const {
    parentClassificationsList,
    isLoadingParentClassifications,
    parentClassificationsError,
    selectedParentClasificacionId // <-- Este es el nombre correcto de la variable
  } = useSelector((state) => state.dashboardFilter);
  // --- Fin Leer estado desde Redux ---


  // --- Dispatchar el thunk para cargar las clasificaciones al montar el componente ---
  useEffect(() => {
    // Solo cargamos si la lista aún no está cargada y no estamos ya cargando o tenemos un error
    if (parentClassificationsList.length === 0 && !isLoadingParentClassifications && !parentClassificationsError) {
       dispatch(fetchParentClassificationsAsync());
    }
  }, [dispatch, parentClassificationsList.length, isLoadingParentClassifications, parentClassificationsError]); // Dependencias importantes

  // --- Fin Dispatch del thunk ---


  // Manejar el cambio en la selección del dropdown (igual que antes)
  const handleParentSelectChange = (event) => {
    const selectedId = event.target.value === "" ? null : event.target.value;

    dispatch(setParentClasificacionFilter(selectedId));

    console.log("Clasificación principal seleccionada en Sidebar (dispatch):", selectedId);
  };


  // Clases base para los enlaces de navegación (igual que antes)
  const baseLinkClasses = "flex items-center py-2 px-4 rounded-md transition duration-200";
  const activeLinkClasses = "bg-gray-700 text-white";
  const inactiveLinkClasses = "text-gray-300 hover:bg-gray-700 hover:text-white";

  return (
    <div className="w-64 bg-gray-800 text-white fixed h-full top-0 left-0 hidden lg:flex flex-col p-4">
      {/* Área para el logo o título del Dashboard */}
      <div className="text-2xl font-semibold mb-6">
        Tu Dashboard
      </div>

      {/* --- Selector de Clasificaciones (usa estado de Redux) --- */}
      <div className="mb-6">
        {isLoadingParentClassifications ? (
          <div>Cargando clasif...</div>
        ) : parentClassificationsError ? (
          <div className="text-red-500 text-sm">{parentClassificationsError}</div>
        ) : (
          <div>
            <label htmlFor="sidebarParentClasificacion" className="block text-sm font-medium text-gray-300 mb-1">
            Clasificación
            </label>
            <select
              id="sidebarParentClasificacion"
              name="sidebarParentClasificacion"
              // --- ¡Corregido aquí! Usar el nombre correcto de la variable de Redux ---
              value={selectedParentClasificacionId != null ? selectedParentClasificacionId : ""}
              onChange={handleParentSelectChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
             
              {parentClassificationsList.map((clasificacion) => (
                <option key={clasificacion.id} value={clasificacion.id}>
                  {clasificacion.nombre}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      {/* --- Fin del Selector de Clasificaciones --- */}

      {/* Sección de Navegación (igual que antes) */}
      <nav className="flex-grow">
        {/* ... tus NavLinks ... */}
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
              Inicio del Dashboard
            </NavLink>
          </li>

          {/* Ejemplo de enlace a una página de perfil */}
          <li className="mb-2">
            <NavLink
              to="/dashboard/profile"
              className={({ isActive }) =>
                `${baseLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`
              }
            >
              Mi Perfil
            </NavLink>
          </li>

          {/* Ejemplo de enlace a una página de configuración */}
          <li className="mb-2">
            <NavLink
              to="/dashboard/settings"
              className={({ isActive }) =>
                `${baseLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`
              }
            >
              Configuración
            </NavLink>
          </li>
          

        </ul>
      </nav>
    </div>
  );
}