// frontend/src/components/DashboardSidebar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getParentClassificationsApi, getClasificacionItemsApi } from '../api/lookup.api'; // Importa la nueva función API

import Modal from './Modal';

import {
    Menu,
    X,
    LogOut,
    Settings,
    ChevronDown,
    ChevronUp,
} from 'lucide-react';


const DashboardSidebar = () => {
    const location = useLocation();
    const { logout } = useAuth();

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [parentClassifications, setParentClassifications] = useState([]);
    const [loadingParents, setLoadingParents] = useState(true); // Renombrado para claridad
    const [errorParents, setErrorParents] = useState(null);   // Renombrado para claridad

    const [isClasificacionesAccordionOpen, setIsClasificacionesAccordionOpen] = useState(false);

    // --- ESTADOS PARA LA MODAL Y LA CARGA DE SUS ITEMS ---
    const [isModalOpenSidebar, setIsModalOpenSidebar] = useState(false);
    const [modalParentClassification, setModalParentClassification] = useState(null); // Info del padre clickeado
    const [modalItems, setModalItems] = useState([]); // Los items hijos cargados para la modal
    const [loadingModalItems, setLoadingModalItems] = useState(false); // Estado de carga para los items de la modal
    const [errorModalItems, setErrorModalItems] = useState(null);    // Estado de error para los items de la modal


    // Cargar las clasificaciones principales al montar el componente
    useEffect(() => {
        const fetchParentClassifications = async () => {
            try {
                setLoadingParents(true);
                const response = await getParentClassificationsApi();
                setParentClassifications(response.data);
                setLoadingParents(false);
            } catch (err) {
                console.error("Error fetching parent classifications:", err);
                setErrorParents("Error al cargar clasificaciones principales.");
                setLoadingParents(false);
            }
        };

        fetchParentClassifications();
    }, []);


    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const toggleClasificacionesAccordion = () => setIsClasificacionesAccordionOpen(!isClasificacionesAccordionOpen);

    // --- FUNCIÓN para manejar el clic en un elemento de clasificación principal ---
    const handleClassificationClick = async (event, parentClassification) => {
        event.preventDefault(); // Evita la navegación

        // 1. Guarda la info del padre y abre la modal inmediatamente (con estado de carga)
        setModalParentClassification(parentClassification);
        setModalItems([]); // Limpia items de modales anteriores
        setLoadingModalItems(true);
        setErrorModalItems(null);
        setIsModalOpenSidebar(true); // Abre la modal

        // Cierra el sidebar móvil si está abierto
        if (isSidebarOpen && window.innerWidth < 1024) {
            setIsSidebarOpen(false);
        }

        // 2. Carga los items hijos DE FORMA ASÍNCRONA
        try {
            const response = await getClasificacionItemsApi(parentClassification.id); // Llama a la nueva API
            setModalItems(response.data); // Guarda los items cargados
            setLoadingModalItems(false);
        } catch (err) {
            console.error(`Error fetching items for classification ID ${parentClassification.id}:`, err);
            setErrorModalItems("Error al cargar los elementos.");
            setLoadingModalItems(false);
        }
    };

    // --- FUNCIÓN para cerrar la modal ---
    const closeModalSidebar = () => {
        setIsModalOpenSidebar(false);
        // Limpia los estados de la modal al cerrarla
        setModalParentClassification(null);
        setModalItems([]);
        setErrorModalItems(null);
        setLoadingModalItems(false); // Asegurarse de que el estado de carga se resetee también
    };


    // Helper para las clases de estilo de un enlace estático
    // (Mantén si decides re-añadir enlaces estáticos)
    const getLinkClasses = (path) => {
        const isActive = path === location.pathname || (path === '/dashboard' && location.pathname === '/dashboard/');
        const activeClasses = 'bg-gray-100 text-gray-800 dark:bg-neutral-700 dark:text-white';
        const inactiveClasses = 'text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:text-neutral-200';
        const baseLinkClasses = 'flex items-center gap-x-3.5 py-2 px-2.5 text-sm rounded-lg transition-all duration-200 w-full';
        return `${baseLinkClasses} ${isActive ? activeClasses : inactiveClasses}`;
    };

    // Helper para las clases del BOTÓN toggle del acordeón
    const getAccordionToggleClasses = (isOpen) => {
        const baseClasses = 'flex items-center gap-x-3.5 py-2 px-2.5 text-sm rounded-lg transition-all duration-200 w-full';
        const openClasses = 'bg-gray-100 text-gray-800 dark:bg-neutral-700 dark:text-white';
        const closedClasses = 'text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:text-neutral-200';
        return `${baseClasses} ${isOpen ? openClasses : closedClasses}`;
    };


    return (
        <>
            {/* Botón de Alternar Navegación (Hamburguesa) para Móviles */}
            <div className="lg:hidden py-4 px-4">
                <button
                    type="button"
                    onClick={toggleSidebar}
                    className="py-2 px-3 inline-flex justify-center items-center gap-x-2 text-start bg-gray-800 border border-gray-800 text-white text-sm font-medium rounded-lg shadow-2xs align-middle hover:bg-gray-950 focus:outline-hidden focus:bg-gray-900 dark:bg-white dark:text-neutral-800 dark:hover:bg-neutral-200 dark:focus:bg-neutral-200"
                    aria-label="Abrir menú"
                    aria-expanded={isSidebarOpen ? 'true' : 'false'}
                    aria-controls="hs-sidebar"
                >
                    <Menu size={20} />
                    Abrir Menú
                </button>
            </div>

            {/* Estructura Principal del Sidebar */}
            <div
                id="hs-sidebar"
                className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:block lg:translate-x-0 lg:end-auto lg:bottom-0 w-64 h-full fixed top-0 start-0 bottom-0 z-60
                bg-white border-e border-gray-200 dark:bg-neutral-800 dark:border-neutral-700
                transition-transform duration-300 transform`}
                role="dialog"
                tabIndex="-1"
                aria-label="Sidebar"
            // Ya no cerramos el sidebar aquí, lo hace handleClassificationClick
            >
                <div className="relative flex flex-col h-full max-h-full ">
                    {/* Header del Sidebar */}
                    <header className="p-4 flex justify-between items-center gap-x-2">
                        <Link to="/dashboard" className="flex-none font-semibold text-xl text-black focus:outline-hidden focus:opacity-80 dark:text-white" aria-label="Brand">CEP Admin</Link>
                        {/* Botón de Cierre para Móviles (oculto en lg) */}
                        <div className="lg:hidden -me-2">
                            <button
                                type="button"
                                onClick={toggleSidebar}
                                className="flex justify-center items-center gap-x-3 size-6 bg-white border border-gray-200 text-sm text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
                            >
                                <X size={16} className="size-4" />
                                <span className="sr-only">Close</span>
                            </button>
                        </div>
                    </header>

                    {/* Cuerpo del Sidebar - Navegación */}
                    <nav className="flex flex-col flex-grow h-full overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
                        <ul className="pb-2 px-2 w-full space-y-1">

                            {/* --- Sección de Clasificaciones Dinámicas como Acordeón --- */}
                            <li className="pt-0">
                                {/* Botón Toggle del Acordeón */}
                                <button
                                    type="button"
                                    onClick={toggleClasificacionesAccordion}
                                    className={getAccordionToggleClasses(isClasificacionesAccordionOpen)}
                                    aria-expanded={isClasificacionesAccordionOpen ? 'true' : 'false'}
                                    aria-controls="clasificaciones-collapse"
                                >
                                    <Settings size={16} className="size-4" />
                                    <span className="flex-grow text-start">Clasificaciones</span>
                                    <span className="ms-auto">
                                        {isClasificacionesAccordionOpen ? <ChevronUp size={16} className="size-4" /> : <ChevronDown size={16} className="size-4" />}
                                    </span>
                                </button>

                                {/* Contenido Colapsable del Acordeón (lista dinámica) */}
                                {isClasificacionesAccordionOpen && (
                                    <div id="clasificaciones-collapse" role="region" aria-labelledby="clasificaciones-accordion-toggle">
                                        <ul className="pt-1 ps-7 space-y-1">
                                            {loadingParents && <li><span className="px-2.5 text-sm text-gray-500 dark:text-neutral-400">Cargando...</span></li>}
                                            {errorParents && <li><span className="px-2.5 text-sm text-red-500 dark:text-red-400">{errorParents}</span></li>}

                                            {/* Mapea las clasificaciones principales */}
                                            {!loadingParents && !errorParents && parentClassifications.map(classification => (
                                                <li key={classification.id}>
                                                    {/* --- Este botón ahora abre la modal con los ITEMS --- */}
                                                    <button
                                                        type="button"
                                                        onClick={(e) => handleClassificationClick(e, classification)} // Llama a la función para cargar items y abrir modal
                                                        className={getLinkClasses(`/dashboard/clasificaciones/${classification.id}`)} // Mantiene el estilo
                                                    >
                                                        {classification.nombre}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </li>
                        </ul>
                    </nav>

                    {/* Botón de Cerrar Sesión - Aseguramos que esté al final */}
                    <div className="px-2 pb-2 mt-auto">
                        <button
                            type="button"
                            onClick={logout}
                            className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-red-100 hover:text-red-700 focus:outline-hidden focus:bg-red-100 dark:text-neutral-200 dark:hover:bg-red-700 dark:hover:text-white dark:focus:bg-red-700 dark:focus:text-white transition-all duration-200 w-full"
                        >
                            <LogOut size={16} className="size-4" />
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </div>

            {/* --- Componente Modal: Muestra la lista de ITEMS --- */}
            <Modal
                isOpen={isModalOpenSidebar}
                onClose={closeModalSidebar}
                // Título: Muestra el nombre de la clasificación padre si está disponible
                title={modalParentClassification ? `Elementos de "${modalParentClassification.nombre}"` : 'Elementos de Clasificación'}
            >
                {/* Contenido de la Modal: Carga, Error o Lista de Items */}
                {loadingModalItems ? (
                    <p className="text-gray-500 dark:text-neutral-400">Cargando elementos...</p>
                ) : errorModalItems ? (
                    <p className="text-red-500 dark:text-red-400">Error al cargar elementos: {errorModalItems}</p>
                ) : modalItems.length > 0 ? (
                    <ul className="space-y-2">
                        {modalItems.map(item => (
                            <li key={item.id} className="text-gray-700 dark:text-neutral-300 border-b border-gray-200 dark:border-neutral-700 pb-1">
                                <span className="font-semibold">{item.nombre}</span> (ID: {item.id})
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 dark:text-neutral-400">No hay elementos relacionados para esta clasificación.</p>
                )}

            </Modal>

        </>
    );
};

export default DashboardSidebar;