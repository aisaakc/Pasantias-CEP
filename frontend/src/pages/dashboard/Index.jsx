import React from 'react';
import { Outlet } from 'react-router-dom';
import DashboardSidebar from '../../components/DashboardSidebar'; 

const DashboardIndex = () => {
  return (
    <div className="flex min-h-screen bg-gray-100"> 

      <div className="w-64 bg-gray-800 text-white flex-shrink-0"> 
        <div className="p-4"> 
          <h2 className="text-2xl font-bold mb-4">Dashboard Navegación</h2>
          <DashboardSidebar /> 
        </div>
      </div>

      <div className="flex-grow p-6 overflow-y-auto"> 

        <Outlet />
      </div>
    </div>
  );
};

export default DashboardIndex;