import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Home from "./pages/cep/Home";
import Lista from "./pages/cep/Lista";
import Contacto from "./pages/cep/Contacto";
import Login from "./pages/auth/Login";
import Registro from "./pages/auth/Registro";
import Clasificacion from "./pages/dashboard/Clasificacion";
import Tipos from "./pages/dashboard/Tipos";
import Curso from "./pages/dashboard/Curso";
import Roles from "./pages/dashboard/Roles";
import HorarioCurso from "./pages/dashboard/HorarioCurso";
import Layout from "./components/Layout";
import useAuthStore from "./store/authStore";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Toaster } from 'sonner';
import React from 'react';

// Componente para proteger rutas
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return children;
};

export default function App() {
  
  const location = useLocation();
 
  const hideLayout = ["/login", "/registro"].includes(location.pathname) || location.pathname.startsWith("/dashboard");

  const mainContent = (
    <main className={`flex-grow ${!hideLayout ? 'mb-16' : ''}`}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lista" element={<Lista />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/login" element={<Login redirectTo="/dashboard/clasificacion" />} /> 
        <Route path="/registro" element={<Registro />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Clasificacion />} />
          <Route path="clasificacion" element={<Clasificacion />} />
          <Route path="tipos/:id" element={<Tipos />} />
          <Route path="tipos/:id/:parentId" element={<Tipos />} />
          <Route path="cursos" element={<Curso />} />
          <Route path="roles" element={<Roles />} />
          <Route path="horario-curso/:id" element={<HorarioCurso /> } />
        </Route>
      </Routes>
    </main>
  );

  return (
    <>
      <Toaster position="top-right" richColors expand={true} />

      {!hideLayout && <Navbar />}
      {mainContent}
      {!hideLayout && <Footer />}
    </>
  );
}
