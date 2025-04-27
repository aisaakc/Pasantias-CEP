import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

import * as iconos from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import DashboardSidebar from '../../components/DashboardSidebar';
import DashboardNavbar from '../../components/DashboardNavbar';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchParentClassificationsAsync,
  createClasificacionAsync,
  clearCreateClasificacionError,
} from '../../features/dashboard/dashboardFilterSlice';


<script src="https://kit.fontawesome.com/f4e2dd3dc8.js" crossorigin="anonymous"></script>


import CreateClasificacionModal from '../../components/CreateClasificacionModal';

export default function Index() {
  const dispatch = useDispatch();


  const {
    parentClassificationsList,
    isLoadingParentClassifications,
    parentClassificationsError,
    isLoadingCreateClasificacion,
    createClasificacionError,
  } = useSelector((state) => state.dashboardFilter);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {

    if (parentClassificationsList.length === 0 && !isLoadingParentClassifications && !parentClassificationsError) {
      dispatch(fetchParentClassificationsAsync());
    }
  }, [dispatch, parentClassificationsList.length, isLoadingParentClassifications, parentClassificationsError]);


  // --- ✅ Función para manejar el cierre de la modal ---
  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    // Opcional: Limpiar el error de creación en Redux al cerrar la modal
    dispatch(clearCreateClasificacionError());
  };

  const [selectedClasificacionId, setSelectedClasificacionId] = useState(null);

  const subclasificacionesPorPadre = useSelector(
    (state) => state.dashboardFilter.subclasificacionesPorPadre
  );

  const handleClasificacionClick = (id) => {
    setSelectedClasificacionId(id);
    if (!subclasificacionesPorPadre[id]) {
      dispatch(fetchSubclasificacionesByTypeIdAsync(id));
    }
  };

  return (
    <div className="flex min-h-screen ">
      {/* El Sidebar y Navbar se mantienen como parte del layout */}
      <DashboardSidebar />

      <div className="flex-grow flex flex-col lg:ml-64">
        <DashboardNavbar />

        <main className="flex-grow p-6 overflow-y-auto">


          <h1 className="text-3xl font-bold text-gray-900 mb-6">Gestión de Clasificaciones</h1>


          <div className="mb-6">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              disabled={isLoadingCreateClasificacion}
              className={`px-6 py-3 rounded-2xl font-semibold text-white transition duration-300 ease-in-out
                ${isLoadingCreateClasificacion
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5 active:scale-95'}
  `}
            >
              {isLoadingCreateClasificacion ? (
                <>
                  <span className="loading loading-spinner mr-2"></span>Creando...
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="inline-block w-5 h-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Crear Nueva Clasificación
                </>
              )}
            </button>

          </div>



          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Clasificaciones Principales</h2> {/* Subtítulo para la lista */}

          {isLoadingParentClassifications && (
            <p className="text-gray-600">Cargando clasificaciones...</p>
          )}

          {parentClassificationsError && (
            <div className="text-red-500 bg-red-100 border border-red-400 p-3 rounded">
              Error al cargar clasificaciones: {parentClassificationsError}
            </div>
          )}

          {!isLoadingParentClassifications && !parentClassificationsError && parentClassificationsList.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {parentClassificationsList.map((clasificacion) => (
                <div
                  key={clasificacion.id}
                  className="bg-white rounded-lg shadow-md p-6 transform transition duration-300 hover:scale-105 hover:shadow-xl place-self-center"
                >


                  <div className="text-center">
                    <FontAwesomeIcon icon={iconos[clasificacion.nicono]} size="4x" className="block mx-auto" />
                  </div>




                  <h3 className="text-xl font-bold mb-2 text-gray-900 text-center">{clasificacion.nombre}</h3>

                  {clasificacion.descripcion && (
                    <p className="text-gray-700 text-sm">{clasificacion.descripcion}</p>
                  )}

                  <button
                    onClick={() => handleClasificacionClick(clasificacion.id)}
                    className="mt-4 inline-block px-4 py-2 text-sm font-semibold bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                  >
                    {selectedClasificacionId === clasificacion.id ? 'Ocultar' : 'Ver'} subclasificaciones
                  </button>

                  {selectedClasificacionId === clasificacion.id && subclasificacionesPorPadre[clasificacion.id] && (
                    <div className="mt-4 border-t pt-3">
                      <p className="text-gray-800 font-semibold mb-2">Subclasificaciones:</p>
                      {subclasificacionesPorPadre[clasificacion.id].length > 0 ? (
                        <ul className="list-disc ml-5 space-y-1">
                          {subclasificacionesPorPadre[clasificacion.id].map((sub) => (
                            <li key={sub.id} className="text-gray-700">{sub.nombre}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500">No tiene subclasificaciones.</p>
                      )}
                    </div>
                  )}
                </div>
              ))}


            </div>
          )}

          {!isLoadingParentClassifications && !parentClassificationsError && parentClassificationsList.length === 0 && (
            <p className="text-gray-600">No se encontraron clasificaciones principales.</p>
          )}


          <Outlet />
        </main>
      </div>

      <CreateClasificacionModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}

      />

    </div>
  );
}