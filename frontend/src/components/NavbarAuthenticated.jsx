// frontend/src/components/NavbarAuthenticated.jsx
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function NavbarAuthenticated() { 
     const [menuOpen, setMenuOpen] = useState(false);
     const { user, logout } = useAuth(); 
 
      return (

      <nav className="bg-blue-800 shadow-lg fixed w-full z-50 border-b border-blue-700 text-white"> 
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="flex justify-end items-center h-16"> 

           <div className="flex items-center space-x-5"> 
                <Link
                  to="/profile" 
                    className="text-white font-medium hover:text-blue-200 transition-all text-sm" 
                    >
                 {user ? `Hola, ${user.nombre}!` : 'Mi Perfil'} 
                 </Link>
                <button
                onClick={logout} 
                className="bg-red-600 text-white px-5 py-2 rounded-full hover:bg-red-700 transition-all text-sm font-semibold" >
               Cerrar Sesión
              </button>
             
              </div>

           <div className="flex justify-between items-center h-16 w-full"> 
             
               <div className="flex items-center space-x-5 ml-auto"> 
                   {/* Desktop Profile/Logout links */}
                   <div className="hidden md:flex items-center space-x-5">
                       <Link to="/profile" className="text-white font-medium hover:text-blue-200 transition-all text-sm">
                           {user ? `Hola, ${user.nombre}!` : 'Mi Perfil'}
                       </Link>
                       <button onClick={logout} className="bg-red-600 text-white px-5 py-2 rounded-full hover:bg-red-700 transition-all text-sm font-semibold">
                           Cerrar Sesión
                       </button>
                      
                   </div>
                   <button
                       onClick={() => setMenuOpen(!menuOpen)}
                       aria-label="Abrir menú"
                       className="md:hidden text-white focus:outline-none"
                   >
                       {menuOpen ? <X size={28} /> : <Menu size={28} />}
                   </button>
               </div>
           </div>
           
        </div>
      </div>

     <div 
        className={`md:hidden transition-all duration-300 ease-in-out ${
        menuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
       }`}
      >

         <ul className="flex flex-col px-6 pt-4 pb-6 space-y-4 bg-blue-700 text-white font-medium shadow-md border-t border-blue-600 rounded-xl"> {/* Darker blue for mobile menu */}

             <li className="pt-4 space-y-2"> 
             <Link
                 to="/profile"
                 className="block w-full text-blue-200 hover:underline transition py-2" 
                 onClick={() => setMenuOpen(false)}
             >
              {user ? `Hola, ${user.nombre}!` : 'Mi Perfil'}
            </Link>
               
                <button
                  onClick={() => { logout(); setMenuOpen(false); }} 
                 className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition text-sm font-medium"
                 >
                 Cerrar Sesión  
                 </button>
           </li>

         </ul>
        </div>        
     </nav>
     );
}