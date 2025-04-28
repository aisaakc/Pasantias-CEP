// frontend/src/components/DashboardLayout.jsx
import React from 'react';
import DashboardSidebar from './DashboardSidebar';
import DashboardNavbar from './DashboardNavbar';

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <DashboardSidebar />

      <div className="flex-grow flex flex-col lg:ml-64">
        {/* Navbar */}
        <DashboardNavbar />

        {/* Contenido Principal */}
        <main className="flex-grow p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
