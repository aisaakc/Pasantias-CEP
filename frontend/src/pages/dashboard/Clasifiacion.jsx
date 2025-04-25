import React, { useEffect } from 'react'; // Solo necesitamos useEffect ahora para el dispatch
import { Outlet } from 'react-router-dom';
import DashboardSidebar from '../../components/DashboardSidebar';
import DashboardNavbar from '../../components/DashboardNavbar';
import { useSelector, useDispatch } from 'react-redux'; // Importamos hooks de Redux

// Importamos el thunk que ya definiste en tu slice de Redux
import { fetchParentClassificationsAsync } from '../../features/dashboard/dashboardFilterSlice';

export default function Index() {
  const dispatch = useDispatch();

  // Usamos useSelector para obtener el estado de las clasificaciones principales
  // desde tu slice de Redux
  const {
    parentClassificationsList,          // La lista de clasificaciones obtenida por el thunk
    isLoadingParentClassifications,     // Estado de carga del thunk
    parentClassificationsError,         // Estado de error del thunk
    // selectedParentClasificacionId    // Este estado también viene del slice, pero no lo necesitamos
                                        // directamente aquí para mostrar la lista completa.
  } = useSelector((state) => state.dashboardFilter); // Asegúrate que 'dashboardFilter' coincide con el nombre de tu reducer en el store

  // useEffect para disparar el thunk fetchParentClassificationsAsync cuando el componente se monta
  useEffect(() => {
    // Esta condición opcional evita recargar los datos si ya están en el store
    // al montar el componente (por ejemplo, si el usuario navega de vuelta a esta página).
    // Si prefieres recargar siempre al entrar a la página, puedes quitar esta condición.
    if (parentClassificationsList.length === 0 && !isLoadingParentClassifications && !parentClassificationsError) {
       dispatch(fetchParentClassificationsAsync());
    }
  }, [dispatch, parentClassificationsList.length, isLoadingParentClassifications, parentClassificationsError]); // Dependencias para que el efecto se ejecute si cambian

  return (
    <div className="flex min-h-screen ">
      {/* El Sidebar se mantiene fijo a la izquierda en pantallas grandes */}
      <DashboardSidebar />

      {/* Contenedor principal que ocupa el resto del espacio */}
      <div className="flex-grow flex flex-col lg:ml-64">
        {/* Navbar en la parte superior */}
        <DashboardNavbar />

        {/* Área de contenido principal con scroll vertical si es necesario */}
        <main className="flex-grow p-6 overflow-y-auto">
          {/* Título de la sección */}
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Clasificaciones Principales</h2>

          {/* Indicador de carga basado en el estado de Redux */}
          {isLoadingParentClassifications && (
            <p className="text-gray-600">Cargando clasificaciones...</p>
          )}

          {/* Mostrar mensaje de error basado en el estado de Redux */}
          {parentClassificationsError && (
            <div className="text-red-500 bg-red-100 border border-red-400 p-3 rounded">
              Error: {parentClassificationsError}
            </div>
          )}

          {/* Mostrar las cards solo si no está cargando, no hay error y hay datos */}
          {!isLoadingParentClassifications && !parentClassificationsError && parentClassificationsList.length > 0 && (
            // Grid para mostrar las cards
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {/* Mapeamos sobre la lista obtenida del estado de Redux */}
              {parentClassificationsList.map((clasificacion) => (
                // Una card simple para cada clasificación
                <div
                  key={clasificacion.id} // Es crucial tener una key única al mapear listas
                  className="bg-white rounded-lg shadow-md p-6 transform transition duration-300 hover:scale-105 hover:shadow-xl"
                >
                  <h3 className="text-xl font-bold mb-2 text-gray-900">{clasificacion.nombre}</h3>
                  {/* Puedes añadir la descripción si existe */}
                  {clasificacion.descripcion && (
                      <p className="text-gray-700 text-sm">{clasificacion.descripcion}</p>
                  )}
                  {/* Espacio para ícono o imagen si los datos los incluyen */}
                </div>
              ))}
            </div>
          )}

           {/* Mensaje si no hay clasificaciones después de cargar y sin errores */}
           {!isLoadingParentClassifications && !parentClassificationsError && parentClassificationsList.length === 0 && (
               <p className="text-gray-600">No se encontraron clasificaciones principales.</p>
           )}


          {/* El Outlet para renderizar rutas anidadas */}
           <Outlet />
        </main>
      </div>
    </div>
  );
}