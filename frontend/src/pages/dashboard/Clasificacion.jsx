import React, { useEffect, useState } from 'react';
import * as iconos from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    fetchParentClassificationsAsync,
    clearCreateClasificacionError,
} from '../../features/dashboard/dashboardFilterSlice';

import CreateClasificacionModal from '../../components/CreateClasificacionModal';

export default function Clasificacion() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        parentClassificationsList,
        isLoadingParentClassifications,
        parentClassificationsError,
        isLoadingCreateClasificacion,
    } = useSelector((state) => state.dashboardFilter);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentClassifications = Array.isArray(parentClassificationsList) ? parentClassificationsList.slice(indexOfFirstItem, indexOfLastItem) : [];

    const totalPages = Array.isArray(parentClassificationsList) ? Math.ceil(parentClassificationsList.length / itemsPerPage) : 0;

    useEffect(() => {
        if (Array.isArray(parentClassificationsList) && parentClassificationsList.length === 0 && !isLoadingParentClassifications && !parentClassificationsError) {
            dispatch(fetchParentClassificationsAsync());
        }
    }, [dispatch, parentClassificationsList, isLoadingParentClassifications, parentClassificationsError]);

    const handleCloseCreateModal = () => {
        setIsCreateModalOpen(false);
        dispatch(clearCreateClasificacionError());
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleViewHijos = (clasificacionId) => {
        if (clasificacionId) {
            navigate(`/dashboard/clasificaciones/tipo/${clasificacionId}`);
        } else {
            console.warn("Clasificación con ID indefinido:", clasificacionId);
        }
    };
    

    return (
        <div>
            <main className="flex-grow p-6 overflow-y-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Gestión de Clasificaciones</h1>
                <div className="mb-6">
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        disabled={isLoadingCreateClasificacion}
                        className={`px-6 py-3 rounded-2xl font-semibold text-white transition duration-300 ease-in-out
                            ${isLoadingCreateClasificacion ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                        {isLoadingCreateClasificacion ? (
                            <span className="loading loading-spinner mr-2"></span>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="inline-block w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Crear Nueva Clasificación
                            </>
                        )}
                    </button>
                </div>

                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Clasificaciones Principales</h2>
                {isLoadingParentClassifications && <p className="text-gray-600">Cargando clasificaciones...</p>}
                {parentClassificationsError && (
                    <div className="text-red-500 bg-red-100 border border-red-400 p-3 rounded">
                        Error al cargar clasificaciones: {parentClassificationsError}
                    </div>
                )}

                {!isLoadingParentClassifications && !parentClassificationsError && currentClassifications.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {currentClassifications.map((clasificacion, index) => (
                            <div key={clasificacion.id ?? `index-${index}`} className="bg-white rounded-lg shadow-md p-6">
                                {iconos[clasificacion.nicono] ? (
                                    <div className="text-center">
                                        <FontAwesomeIcon icon={iconos[clasificacion.nicono]} size="4x" className="block mx-auto" />
                                    </div>
                                ) : (
                                    <div className="text-center text-gray-400">
                                        <FontAwesomeIcon icon={iconos.faQuestionCircle} size="4x" className="block mx-auto" />
                                    </div>
                                )}
                                <h3 className="text-xl font-bold mb-2 text-gray-900 text-center">{clasificacion.nombre}</h3>
                                {clasificacion.descripcion && <p className="text-gray-700 text-sm">{clasificacion.descripcion}</p>}
                                <button
                                    onClick={() => handleViewHijos(clasificacion.id)}
                                    className="mt-4 inline-block px-4 py-2 text-sm font-semibold bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                                >
                                    Ver Hijos/Subtipos
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {!isLoadingParentClassifications && !parentClassificationsError && currentClassifications.length === 0 && parentClassificationsList.length > 0 && (
                    <p className="text-gray-600">Cargando o sin clasificaciones para la página actual.</p>
                )}

                {!isLoadingParentClassifications && !parentClassificationsError && parentClassificationsList.length === 0 && (
                    <p className="text-gray-600">No se encontraron clasificaciones principales.</p>
                )}

                {totalPages > 1 && (
                    <div className="flex justify-center mt-6">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-blue-600 text-white rounded-l-lg hover:bg-blue-700 transition"
                        >
                            Anterior
                        </button>
                        <span className="px-4 py-2 text-lg font-semibold">{`${currentPage} de ${totalPages}`}</span>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition"
                        >
                            Siguiente
                        </button>
                    </div>
                )}

                <CreateClasificacionModal isOpen={isCreateModalOpen} onClose={handleCloseCreateModal} />
            </main>
        </div>
    );
}
