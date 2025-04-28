import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Importar useParams
import { useSelector, useDispatch } from 'react-redux'; // Importar hooks de Redux
import {
    fetchSubClassificationsByTypeAsync, // Importar el nuevo thunk
    clearSubClassifications // Importar la acción para limpiar el estado
} from '../../features/dashboard/dashboardFilterSlice';
import * as iconos from "@fortawesome/free-solid-svg-icons"; // Importar iconos si se usarán
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Hijos() {
    const { id } = useParams(); // Obtener el ID de los parámetros de la URL
    const dispatch = useDispatch();

    const { subClassificationsList, isLoadingSubClassifications, subClassificationsError } = useSelector(
        (state) => state.dashboardFilter
    );

    useEffect(() => {
        if (id) {
            const typeId = parseInt(id, 10);
            if (!isNaN(typeId)) {
                dispatch(fetchSubClassificationsByTypeAsync(typeId));
            } else {
                console.error("ID de clasificación padre inválido en la URL");
            }
        }

        // Limpiar el estado cuando el componente se desmonte
        return () => {
            dispatch(clearSubClassifications());
        };

    }, [id, dispatch]);

    const renderLoading = () => (
        <p className="text-gray-600">Cargando subclasificaciones...</p>
    );

    const renderError = () => (
        <div className="text-red-500 bg-red-100 border border-red-400 p-3 rounded">
            Error al cargar subclasificaciones: {subClassificationsError}
        </div>
    );

    const renderNoSubClassifications = () => (
        <p className="text-gray-600">No se encontraron subclasificaciones/hijos para esta clasificación.</p>
    );

    const renderSubClassifications = () => (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {subClassificationsList.map((subclasificacion) => (
                <div key={subclasificacion.id_clasificacion} className="bg-white rounded-lg shadow-md p-6">
                    {/* Renderizar el icono si existe */}
                    {iconos[subclasificacion.id_icono] ? (
                        <div className="text-center">
                            <FontAwesomeIcon icon={iconos[subclasificacion.id_icono]} size="4x" className="block mx-auto" />
                        </div>
                    ) : (
                        <div className="text-center text-gray-400">
                            <FontAwesomeIcon icon={iconos.faTag} size="4x" className="block mx-auto" />
                        </div>
                    )}

                    <h3 className="text-xl font-bold mb-2 text-gray-900 text-center">{subclasificacion.nombre}</h3>

                    {subclasificacion.descripcion && (
                        <p className="text-gray-700 text-sm">{subclasificacion.descripcion}</p>
                    )}
                </div>
            ))}
        </div>
    );

    return (
        <main className="flex-grow p-6 overflow-y-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
                Hijos/Subtipos de Clasificación (ID: {id})
            </h1>

            {/* Mostrar estado de carga, error o la lista de hijos */}
            {isLoadingSubClassifications && renderLoading()}
            {subClassificationsError && renderError()}
            {!isLoadingSubClassifications && !subClassificationsError && subClassificationsList.length > 0 && renderSubClassifications()}
            {!isLoadingSubClassifications && !subClassificationsError && subClassificationsList.length === 0 && renderNoSubClassifications()}
        </main>
    );
}
