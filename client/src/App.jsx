window.global = window;

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
import ProtectedRoute from "./components/ProtectedRoute";
import useAuthStore from "./store/authStore";
import useClasificacionStore from "./store/clasificacionStore";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Prueba from "./pages/dashboard/prueba";
import Documentos from "./pages/dashboard/documentos";
import Perfil from "./pages/dashboard/profile/perfil";
import ListCursos from "./pages/dashboard/ListCursos";
import PermissionTest from "./pages/dashboard/PermissionTest";
import Estadisticas from "./pages/dashboard/Estadisticas";
import Cohorte from "./pages/dashboard/Cohorte";
import { Toaster } from 'sonner';
import React from 'react';
import { CLASSIFICATION_IDS } from "./config/classificationIds";

// Componente para proteger rutas básicas (solo autenticación)
const BasicProtectedRoute = ({ children }) => {
  const { isAuthenticated, inicializarPermisos, loading } = useAuthStore();
  const { preloadIcons } = useClasificacionStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isInitializing, setIsInitializing] = React.useState(true);

  React.useEffect(() => {
    const initializeAuth = async () => {
      // Si hay un token en localStorage, intentar inicializar permisos
      if (localStorage.getItem('token')) {
        try {
          await inicializarPermisos();
          // Precargar iconos después de inicializar permisos
          await preloadIcons();
        } catch (error) {
          console.error('Error al inicializar permisos:', error);
          // Si hay error, limpiar localStorage y redirigir
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('isSupervisor');
          localStorage.removeItem('userRoles');
        }
      }
      setIsInitializing(false);
    };

    initializeAuth();
  }, [inicializarPermisos, preloadIcons]);

  React.useEffect(() => {
    // Solo redirigir después de que se complete la inicialización
    if (!isInitializing && !isAuthenticated) {
      // Guardar la URL actual para redirigir después del login
      const currentPath = location.pathname + location.search;
      navigate('/login', { 
        replace: true,
        state: { from: currentPath }
      });
    }
  }, [isAuthenticated, navigate, location, isInitializing]);

  // Mostrar loading mientras se inicializa
  if (isInitializing || loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

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
        <Route path="/login" element={<Login />} /> 
        <Route path="/registro" element={<Registro />} />
        <Route path="/dashboard" element={
          <BasicProtectedRoute>
            <Layout />
          </BasicProtectedRoute>
        }>
          <Route index element={<Clasificacion />} />
          <Route path="clasificacion" element={<Clasificacion />} />
          <Route path="tipos/:id" element={<Tipos />} />
          <Route path="tipos/:id/:parentId" element={<Tipos />} />
          <Route path="cursos" element={
            <ProtectedRoute>
              <Curso />
            </ProtectedRoute>
          } />
          <Route path="roles" element={
            <ProtectedRoute>
              <Roles />
            </ProtectedRoute>
          } />
          <Route path="horario-curso/:id" element={<HorarioCurso /> } />
          <Route path="prueba" element={
            <ProtectedRoute>
              <Prueba/>
            </ProtectedRoute>
          } />  
          <Route path="documentos" element={
            <ProtectedRoute>
              <Documentos/>
            </ProtectedRoute>
          } />
          <Route path="perfil" element={<Perfil />} />
          <Route path="listcursos" element={
            <ProtectedRoute>
              <ListCursos/>
            </ProtectedRoute>
          } />
          <Route path="permission-test" element={<PermissionTest />} />
          <Route path="estadisticas" element={
            <ProtectedRoute requiredPermission={CLASSIFICATION_IDS.MN_ESTADISTICAS}>
              <Estadisticas />
            </ProtectedRoute>
          } />
          <Route path="cohorte" element={
            <ProtectedRoute requiredPermission={CLASSIFICATION_IDS.MN_COHORTE}>
              <Cohorte />
            </ProtectedRoute>
          } />
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
