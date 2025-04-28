// frontend/src/App.jsx
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { checkAuthAsync } from './features/auth/authSlice'; 

import Navbar from "./components/NavbarPublic";
import Footer from "./components/Footer";
import Home from "./pages/cep/Home";
import Lista from "./pages/cep/Lista";
import Contacto from "./pages/cep/Contacto";
import Login from './pages/auth/Login';
import Registro from './pages/auth/Registro';
import DashboardIndex from './pages/dashboard/Clasificacion';
import Clasificacion from './pages/dashboard/Clasificacion';  
import Hijos from './pages/dashboard/Hijos';  
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout'; // Importar el layout

function App() {
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuthAsync());
  }, [dispatch]);

  const shouldShowNavbar = location.pathname === '/' || location.pathname === '/lista' || location.pathname === '/contacto';
  const isAuthPage = location.pathname === '/login' || location.pathname === '/registro';
  const shouldShowFooter = !location.pathname.startsWith('/dashboard');

  if (isAuthPage) {
    return (
      <> 
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        <div className="min-h-screen bg-gray-100 items-center justify-center">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
          </Routes>
        </div>
      </>  
    );
  } else {
    return (
      <>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        {shouldShowNavbar && <Navbar />}
        <div className="flex-grow h-full flex flex-col">
          <main className="flex-grow mb-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/lista" element={<Lista />} />
              <Route path="/contacto" element={<Contacto />} />

              {/* Dashboard Protected Route */}
              <Route path="/dashboard" element={<ProtectedRoute element={<DashboardIndex />} />}>
                
                {/* Usar DashboardLayout para las rutas de Dashboard */}
                <Route path="/dashboard" element={<DashboardLayout> 
                  <DashboardIndex /> 
                </DashboardLayout>} />
                
                <Route path="clasificacion" element={<DashboardLayout><Clasificacion /></DashboardLayout>} />
                <Route path="hijos" element={<DashboardLayout><Hijos /></DashboardLayout>} />
              </Route>

            </Routes>
          </main>
        </div>
        {shouldShowFooter && <Footer />}
      </>  
    );
  }
}

export default App;
