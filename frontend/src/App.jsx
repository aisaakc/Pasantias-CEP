import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/AuthContext"; 
import Navbar from "./components/NavbarPublic"; 
import Footer from "./components/Footer";
import Home from "./pages/cep/Home";
import Lista from "./pages/cep/Lista";
import Contacto from "./pages/cep/Contacto";
import Login from './pages/auth/Login';
import Registro from './pages/auth/Registro';
import DashboardIndex from './pages/dashboard/Index'; 
import ProtectedRoute from './components/ProtectedRoute';


function App() {
  const location = useLocation(); 
  const shouldShowNavbar = location.pathname === '/' || location.pathname === '/lista' || location.pathname === '/contacto';

  const isAuthPage = location.pathname === '/login' || location.pathname === '/registro';
  const shouldShowFooter = !location.pathname.startsWith('/dashboard'); 

  if (isAuthPage) {
    return (
      <AuthProvider>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      
        <div className="min-h-screen bg-gray-100 items-center justify-center">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />          
          </Routes>
        </div>
      </AuthProvider>
    );
  } else {
   
    return (
      <AuthProvider>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} 
        newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

        {shouldShowNavbar && <Navbar />}

        <div className="flex-grow h-full flex flex-col">
             <main className="flex-grow mb-16"> 
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/lista" element={<Lista />} />
                    <Route path="/contacto" element={<Contacto />} />
                    <Route path="/dashboard/*" element={<ProtectedRoute element={<DashboardIndex />} />} />

                </Routes>
             </main>
        </div>

        {shouldShowFooter && <Footer />}

      </AuthProvider>
    );
  }
}

export default App;