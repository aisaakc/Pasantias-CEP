// frontend/src/components/DashboardSidebar.jsx

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
// Importamos useAuth para el botón de cerrar sesión
import { useAuth } from '../context/AuthContext';
// Importamos íconos de Lucide React para los enlaces y los toggles
// Asegúrate de tener instalada la librería lucide-react
import { Home as HomeIcon, User, BookOpen, Menu, X, ChevronDown, ChevronUp, LogOut, Settings } from 'lucide-react';

const DashboardSidebar = () => {
    const location = useLocation();
    // Obtenemos la función logout del contexto de autenticación
    const { logout } = useAuth();

    // --- Estado para controlar la visibilidad del sidebar móvil (gestionado por React) ---
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    // --- Estado para controlar si el acordeón de 'Más Opciones' está abierto (gestionado por React) ---
    const [isMoreOptionsAccordionOpen, setIsMoreOptionsAccordionOpen] = useState(false);

    // Define los enlaces de navegación principales del dashboard
    const navLinks = [
        { path: '/dashboard', name: 'Inicio', icon: <HomeIcon size={16} /> },
        { path: '/dashboard/profile', name: 'Mi Perfil', icon: <User size={16} /> },
        { path: '/dashboard/courses', name: 'Mis Cursos', icon: <BookOpen size={16} /> },
    ];

    // Define los enlaces dentro del menú de acordeón 'Más Opciones'
    const moreOptionsLinks = [
        { path: '/more-options/option-1', name: 'Opción 1' },
        { path: '/more-options/option-2', name: 'Opción 2' },
        // Añade aquí los enlaces para las subsecciones de 'Más Opciones'
    ];

    // Funciones para alternar el estado
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const toggleMoreOptionsAccordion = () => setIsMoreOptionsAccordionOpen(!isMoreOptionsAccordionOpen);

    // Helper para determinar las clases de estilo de un enlace (activo, inactivo, hover, etc.)
    // Aplica clases basadas en el estilo Preline que proporcionaste
    const getLinkClasses = (path, isAccordionToggle = false) => {
        // Comprueba si el enlace actual coincide con la ruta actual
        // Manejo especial para la ruta raíz del dashboard
        const isActive = path === location.pathname || (path === '/dashboard' && location.pathname === '/dashboard/');

        // Clases para enlace activo/inactivo/hover, basadas en el estilo Preline
        const activeClasses = 'bg-gray-100 text-gray-800 dark:bg-neutral-700 dark:text-white'; // Fondo/texto para enlace activo
        const inactiveClasses = 'text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:text-neutral-200'; // Fondo/texto para enlace inactivo y hover/focus

        // Clases base comunes para todos los enlaces y botones de acordeón
        const baseLinkClasses = 'flex items-center gap-x-3.5 py-2 px-2.5 text-sm rounded-lg transition-all duration-200 w-full'; // Estilos base

        // Aplicamos las clases: activo si isActive es true y NO es un toggle de acordeón visualmente activo por sí mismo
        // El toggle de acordeón puede tener un estilo diferente cuando su sección está abierta si lo deseas,
        // pero por ahora usamos las mismas clases base + activo/inactivo.
         const accordionToggleActiveClasses = isAccordionToggle && isMoreOptionsAccordionOpen ? 'bg-gray-100 dark:bg-neutral-700' : ''; // Opcional: resaltar el toggle cuando el acordeón está abierto

        return `${baseLinkClasses} ${isActive && !isAccordionToggle ? activeClasses : inactiveClasses} ${accordionToggleActiveClasses}`;
    };


    // Renderizamos la estructura completa del sidebar
    return (
        <> {/* Usamos un Fragment porque el botón de alternar está fuera del div principal del sidebar */}
            {/* Botón de Alternar Navegación (Hamburguesa) para Móviles */}
            {/* Su visibilidad y evento onClick son gestionados por React */}
            <div className="lg:hidden py-4 px-4"> {/* Añadido padding */}
              <button
                type="button"
                onClick={toggleSidebar} // Llama a la función de alternar del estado de React
                className="py-2 px-3 inline-flex justify-center items-center gap-x-2 text-start bg-gray-800 border border-gray-800 text-white text-sm font-medium rounded-lg shadow-2xs align-middle hover:bg-gray-950 focus:outline-hidden focus:bg-gray-900 dark:bg-white dark:text-neutral-800 dark:hover:bg-neutral-200 dark:focus:bg-neutral-200"
                aria-label="Abrir menú"
                aria-expanded={isSidebarOpen ? 'true' : 'false'} // Refleja el estado de React
                aria-controls="hs-sidebar" // Apunta al ID del sidebar div
              >
                 {/* Usamos ícono de Menú de Lucide */}
                 <Menu size={20} />
                Abrir Menú
              </button>
            </div>
            {/* Fin Botón de Alternar */}

            {/* Estructura Principal del Sidebar */}
            {/* Su visibilidad y transición son gestionadas por el estado de React y clases CSS */}
            <div
                id="hs-sidebar" // ID del sidebar
                 // Clases para controlar la posición y visibilidad basadas en el estado isSidebarOpen
                className={`${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } lg:block lg:translate-x-0 lg:end-auto lg:bottom-0 w-64 h-full fixed top-0 start-0 bottom-0 z-60
                bg-white border-e border-gray-200 dark:bg-neutral-800 dark:border-neutral-700
                transition-transform duration-300 transform
                 ${isSidebarOpen ? '' : 'hidden lg:block'} `} // Ocultar en móviles si no está abierto, pero mantener lg:block
                role="dialog"
                tabIndex="-1"
                aria-label="Sidebar"
            >
              <div className="relative flex flex-col h-full max-h-full ">
                {/* Header del Sidebar */}
                <header className="p-4 flex justify-between items-center gap-x-2">
                  {/* Enlace de Marca/Logo - Usamos Link de React Router */}
                  <Link to="/dashboard" className="flex-none font-semibold text-xl text-black focus:outline-hidden focus:opacity-80 dark:text-white" aria-label="Brand">CEP Admin</Link>

                  {/* Botón de Cierre para Móviles (oculto en lg) */}
                  {/* Llama a la función de alternar del estado de React */}
                  <div className="lg:hidden -me-2">
                    <button
                        type="button"
                        onClick={toggleSidebar} // Llama a la función de alternar del estado de React
                        className="flex justify-center items-center gap-x-3 size-6 bg-white border border-gray-200 text-sm text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
                    >
                      {/* Usamos ícono de Cierre de Lucide */}
                      <X size={16} className="size-4" />
                      <span className="sr-only">Close</span>
                    </button>
                  </div>
                </header>
                {/* Fin Header */}

                {/* Cuerpo del Sidebar - Navegación y Acordeón */}
                <nav className="h-full overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
                  {/* Usamos un div simple en lugar de hs-accordion-group */}
                  <div className="pb-0 px-2 w-full flex flex-col"> {/* Clase flex-wrap no es necesaria sin hs-accordion-group */}
                    <ul className="space-y-1">

                      {/* --- Enlaces de Navegación Principales --- */}
                      {navLinks.map(link => (
                          <li key={link.path}>
                              {/* Aplicamos las clases de estilo */}
                              <Link to={link.path} className={getLinkClasses(link.path)}>
                                  {/* Renderizamos el ícono */}
                                   {React.cloneElement(link.icon, { className: 'size-4' })}
                                  {link.name}
                              </Link>
                          </li>
                      ))}
                      {/* --- Fin Enlaces Principales --- */}

                      {/* --- Acordeón 'Más Opciones' (Gestionado por Estado de React) --- */}
                      <li> {/* Elemento de lista para el acordeón */}
                         <button
                           type="button"
                           onClick={toggleMoreOptionsAccordion} // Llama a la función para alternar el estado del acordeón
                           className={getLinkClasses(null, true)} // Aplica clases base y posiblemente clase activa si está abierto
                           aria-expanded={isMoreOptionsAccordionOpen ? 'true' : 'false'} // Refleja el estado de React
                           aria-controls="more-options-collapse" // Apunta al ID del contenido colapsable
                         >
                            {/* Ícono para el toggle del acordeón */}
                             <Settings size={16} className="size-4" /> {/* Ejemplo: Ícono de Ajustes */}
                           <span className="flex-grow text-start">Más Opciones</span> {/* Texto con flex-grow para empujar el ícono a la derecha */}
                            {/* Íconos para mostrar/ocultar acordeón, condicionales según el estado */}
                             <span className="ms-auto">
                               {isMoreOptionsAccordionOpen ? <ChevronUp size={16} className="size-4" /> : <ChevronDown size={16} className="size-4" />}
                             </span>
                         </button>

                         {/* Contenido colapsable del acordeón */}
                         {/* Renderizado condicional basado en el estado isMoreOptionsAccordionOpen */}
                         {isMoreOptionsAccordionOpen && (
                            <div id="more-options-collapse" className="w-full overflow-hidden transition-[height] duration-300" role="region" aria-labelledby="more-options-accordion"> {/* Clases para animación de altura */}
                                <ul className="pt-1 ps-7 space-y-1">
                                    {/* Mapeamos los enlaces del submenú */}
                                    {moreOptionsLinks.map(subLink => (
                                        <li key={subLink.path}>
                                            {/* Aplicamos las clases de estilo a los sub-enlaces */}
                                            <Link to={subLink.path} className={getLinkClasses(subLink.path)}>
                                                {/* Puedes añadir íconos a los sub-enlaces si lo deseas */}
                                                {subLink.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                         )}
                      </li>
                      {/* --- Fin Acordeón --- */}


                       {/* --- Botón de Cerrar Sesión --- */}
                       {/* Colocado después de los enlaces y acordeones */}
                     
                      {/* --- Fin Botón de Cerrar Sesión --- */}

                    </ul>
                  </div>
                </nav>
                {/* Fin Cuerpo */}

              </div>
            </div>
            {/* Fin Sidebar */}
        </>
    );
};

export default DashboardSidebar;