// frontend/src/components/ProfileAvatar.jsx

import React, { useState, useRef, useEffect } from 'react'; // Necesitamos useRef y useEffect para el temporizador
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, LogOut } from 'lucide-react';

const ProfileAvatar = () => {
    // Estado para controlar si el menú desplegable está abierto
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    // Referencia para almacenar el ID del temporizador (timeout)
    const timeoutRef = useRef(null);
    // Obtenemos la función logout del contexto de autenticación
    const { logout } = useAuth();

    // --- Funciones para manejar eventos de ratón con temporizador ---

    // Función para abrir el menú (sin retraso)
    const openDropdown = () => {
        // Limpiar cualquier temporizador de cierre pendiente si volvemos a entrar rápidamente
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setIsDropdownOpen(true);
    };

    // Función para iniciar el temporizador de cierre del menú
    const closeDropdown = () => {
        // Iniciar un temporizador para cerrar el menú después de un retraso (ej. 200ms)
        // Este retraso da tiempo al usuario para mover el ratón del avatar al menú.
        timeoutRef.current = setTimeout(() => {
            setIsDropdownOpen(false);
        }, 200); // Retraso en milisegundos. Puedes ajustar este valor (ej. 100, 200, 300)
    };

    // --- Fin Funciones de manejo de ratón ---


    // Efecto para limpiar el temporizador cuando el componente se desmonta
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []); // Se ejecuta solo al montar y desmontar


    // Función para manejar el clic en cualquier elemento del menú
    const handleMenuItemClick = () => {
        // Limpiar cualquier temporizador de cierre pendiente inmediatamente al hacer clic
         if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        // Cerrar el menú inmediatamente
        setIsDropdownOpen(false);
    };


    return (
        // Div contenedor principal con posicionamiento relativo
        // Aplicamos los listeners de eventos de ratón (hover) a este contenedor
        // Incluimos el botón del avatar Y el menú desplegable dentro de este div
        <div
            className="relative"
            onMouseEnter={openDropdown} // Usar la función con lógica de temporizador al entrar
            onMouseLeave={closeDropdown} // Usar la función con lógica de temporizador al salir
        >
            {/* Botón que representa el avatar (área de activación del hover) */}
            {/* No hay evento onClick aquí */}
            <button
                type="button"
                className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Opciones de perfil" // ARIA label
                // ARIA attributes para accesibilidad en menús desplegables por hover
                aria-expanded={isDropdownOpen ? 'true' : 'false'}
                aria-haspopup="true"
            >
                {/* Ícono de perfil */}
                <User size={20} />
            </button>

            {/* Menú Desplegable - Se renderiza condicionalmente si isDropdownOpen es true */}
            {isDropdownOpen && (
                // Div para el menú desplegable
                // Posicionado absolutamente respecto al contenedor padre
                // z-index alto para asegurar visibilidad
                // top-full y mt-2 para posicionarlo debajo del avatar
                // right-0 para alinearlo a la derecha
                // Estilos para apariencia (fondo, bordes, sombra, padding, espaciado)
                <div className="absolute top-full mt-2 right-0 z-50 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-neutral-700 dark:ring-neutral-600">
                    <ul className="py-1" role="menu" aria-orientation="vertical">
                        {/* Opción 'Mi Perfil' */}
                        <li>
                            {/* Usamos Link de React Router para navegar */}
                            {/* Llamamos a handleMenuItemClick al hacer clic para limpiar temporizador y cerrar menú */}
                            <Link
                                to="/dashboard/profile"
                                onClick={handleMenuItemClick} // Usa la función que limpia el temporizador y cierra el menú
                                className="flex items-center gap-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-600"
                                role="menuitem"
                            >
                                <User size={16} /> Mi Perfil
                            </Link>
                        </li>
                        {/* Opción 'Cerrar Sesión' */}
                        <li>
                            {/* Usamos un botón para la acción de cerrar sesión */}
                            {/* Llama a logout Y a handleMenuItemClick */}
                            <button
                                onClick={() => {
                                    logout(); // Realiza la acción de logout
                                    handleMenuItemClick(); // Llama a la función que limpia el temporizador y cierra el menú
                                }}
                                className="w-full text-left flex items-center gap-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-neutral-600"
                                role="menuitem"
                            >
                                <LogOut size={16} /> Cerrar Sesión
                            </button>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ProfileAvatar;