// frontend/src/components/DashboardSidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom'; 

const DashboardSidebar = () => {
  const location = useLocation(); 
  const navLinks = [
   
    { path: '/dashboard', name: 'Inicio del Dashboard' }, 
    { path: '/dashboard/profile', name: 'Mi Perfil' }, 
    { path: '/dashboard/courses', name: 'Mis Cursos' }, 
    
  ];

  return (
    <nav className="mt-5"> 
      <ul>
        {navLinks.map((link) => (
          <li key={link.path} className="mb-2">
            <Link
              to={link.path}
              className={`block px-4 py-2 rounded transition duration-200 ${
                location.pathname === link.path
                  ? 'bg-blue-700 text-white font-semibold' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white' 
              }`}
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default DashboardSidebar;