import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/AuthContext";
import NavbarPublic from "./components/NavbarPublic";
import NavbarAuthenticated from "./components/NavbarAuthenticated";
import Footer from "./components/Footer";
import Home from "./pages/cep/Home";
import Lista from "./pages/cep/Lista";
import Contacto from "./pages/cep/Contacto";
import Login from './pages/auth/Login';
import Registro from './pages/auth/Registro';
import DashboardIndex from './pages/dashboard/Index';
import ProtectedRoute from './components/ProtectedRoute';
import UserProfilePage from './pages/UserProfilePage';

function App() {
  const location = useLocation();

  const isAuthPage = location.pathname === '/login' || location.pathname === '/registro';
  const { isAuthenticated, loading } = useAuth();

  return (
    
    <AuthProvider> 
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

      {isAuthPage ? (
        <div className="min-h-screen bg-gray-100">
          <Routes>
          
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
          </Routes>
        </div>
      ) : (
  
        <div className="flex flex-col min-h-screen">
       
          {loading ? null : (isAuthenticated ?   <NavbarAuthenticated /> : <NavbarPublic />)}

          <main className="flex-grow mt-16 mb-16">
            <Routes>
              {/* --- Rutas Públicas (con Navbar/Footer) --- */}
              <Route path="/" element={<Home />} />
              <Route path="/lista" element={<Lista />} />
              <Route path="/contacto" element={<Contacto />} />

              {/* --- Ruta de la página de Perfil del Usuario (con Navbar/Footer, protegida) --- */}
               <Route
                   path="/profile"
                   element={<ProtectedRoute element={<UserProfilePage />} />} // Protegida
               />

               <Route path="/dashboard" element={<ProtectedRoute element={<DashboardIndex />} />}>
                   <Route index element={<div>Contenido del Dashboard (Index) - Placeholder</div>} /> 
               </Route>
          
            </Routes>
          </main>
          <Footer /> 
        </div>
      )}
       
    </AuthProvider>
  );
}

export default App;