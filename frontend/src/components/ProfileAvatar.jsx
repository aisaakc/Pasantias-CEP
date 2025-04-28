
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { logoutAsync } from '../features/auth/authSlice';

import { User, LogOut } from 'lucide-react';
const ProfileAvatar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const timeoutRef = useRef(null);
    const dispatch = useDispatch();

    const openDropdown = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setIsDropdownOpen(true);
    };
    const closeDropdown = () => {
        timeoutRef.current = setTimeout(() => {
            setIsDropdownOpen(false);
        }, 200);
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    },);

    const handleMenuItemClick = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setIsDropdownOpen(false);
    };


    return (

        <div
            className="relative"
            onMouseEnter={openDropdown}
            onMouseLeave={closeDropdown}
        >

            <button
                type="button"
                className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center
 text-gray-600 hover:bg-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Opciones de perfil"
                aria-expanded={isDropdownOpen ? 'true' : 'false'}
                aria-haspopup="true"
            >
                <User size={20} />
            </button>
            {isDropdownOpen && (

                <div className="absolute top-full mt-2 right-0 z-50 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-neutral-700 dark:ring-neutral-600">
                    <ul className="py-1" role="menu" aria-orientation="vertical">

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

                        <li>
                            <button
                                onClick={() => {
                                dispatch(logoutAsync());
                                handleMenuItemClick();
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