import React from 'react'
import { Outlet } from 'react-router-dom'; 
import DashboardSidebar from '../../components/DashboardSidebar';
import DashboardNavbar from '../../components/DashboardNavbar';

export default function Index() {
  return (
     <div className="flex min-h-screen ">
     <DashboardSidebar />
     <div className="flex-grow flex flex-col lg:ml-64">

         <DashboardNavbar />
        
         <main className="flex-grow p-6 overflow-y-auto">
            
             <Outlet />
         </main>
     </div>
 </div>
  )
}
