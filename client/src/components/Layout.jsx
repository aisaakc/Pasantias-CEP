import React from 'react';
import Sidebar from './Sidebar';
import NavbarAuth from './NavbarAuth';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar a la izquierda */}
      <Sidebar />

      {/* Contenedor principal: Navbar + contenido */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* NavbarAuth horizontal, arriba pero al lado del sidebar */}
        <NavbarAuth />

        {/* Contenido desplazable */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
