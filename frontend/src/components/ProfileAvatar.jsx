// frontend/src/components/ProfileAvatar.jsx

import React, { useState, useRef, useEffect } from 'react'; // Se mantienen los hooks de React
import { Link } from 'react-router-dom'; // Se mantiene

// --- CAMBIOS AQUÍ ---
// 1. ELIMINAR la importación del Contexto de Autenticación
// import { useAuth } from '../context/AuthContext';

// 2. Importar el hook useDispatch de react-redux
import { useDispatch } from 'react-redux';
// 3. Importar el thunk logoutAsync del slice de auth
import { logoutAsync } from '../features/auth/authSlice'; // Ajusta la ruta si es necesario (../features/auth/authSlice)
// --- FIN CAMBIOS ---

import { User, LogOut } from 'lucide-react'; // Se mantienen los íconos


const ProfileAvatar = () => {
    // Estado local para controlar si el menú desplegable está abierto (se mantiene)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    // Referencia para almacenar el ID del temporizador (timeout) (se mantiene)
    const timeoutRef = useRef(null);

    // --- CAMBIOS AQUÍ ---
    // Obtener la función dispatch de Redux
    const dispatch = useDispatch();

    // ELIMINAR: Ya no obtenemos 'logout' del contexto
    // const { logout } = useAuth();
    // --- FIN CAMBIOS ---


    // --- Funciones para manejar eventos de ratón con temporizador (se mantienen) ---
    const openDropdown = () => { /* ... lógica ... */
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setIsDropdownOpen(true);
    };

    const closeDropdown = () => { /* ... lógica ... */
        timeoutRef.current = setTimeout(() => {
            setIsDropdownOpen(false);
        }, 200); // Retraso en milisegundos
    };
    // --- Fin Funciones de manejo de ratón ---


    // Efecto para limpiar el temporizador cuando el componente se desmonta (se mantiene)
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);


    // Función para manejar el clic en cualquier elemento del menú (se mantiene)
    const handleMenuItemClick = () => { /* ... lógica ... */
         if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setIsDropdownOpen(false);
    };


    return (
        // Div contenedor principal (se mantiene)
        <div
            className="relative"
            onMouseEnter={openDropdown}
            onMouseLeave={closeDropdown}
        >
            {/* Botón del avatar (se mantiene) */}
            <button
                type="button"
                className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Opciones de perfil"
                aria-expanded={isDropdownOpen ? 'true' : 'false'}
                aria-haspopup="true"
            >
                {/* Ícono de perfil (se mantiene) */}
                <User size={20} />
            </button>

            {/* Menú Desplegable - Se renderiza condicionalmente (se mantiene) */}
            {isDropdownOpen && (
                // Div para el menú desplegable (se mantiene)
                <div className="absolute top-full mt-2 right-0 z-50 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-neutral-700 dark:ring-neutral-600">
                    <ul className="py-1" role="menu" aria-orientation="vertical">
                        {/* Opción 'Mi Perfil' (se mantiene, solo la navegación y la llamada a handleMenuItemClick) */}
                        <li>
                            <Link
                                to="/dashboard/profile"
                                onClick={handleMenuItemClick}
                                className="flex items-center gap-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-600"
                                role="menuitem"
                            >
                                <User size={16} /> Mi Perfil
                            </Link>
                        </li>
                        {/* Opción 'Cerrar Sesión' */}
                        <li>
                            <button
                                onClick={() => {
                                    // --- CAMBIOS AQUÍ ---
                                    // Disparar el thunk logoutAsync de Redux
                                    dispatch(logoutAsync());
                                    // --- FIN CAMBIOS ---
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