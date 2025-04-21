// frontend/src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
const ProtectedRoute = ({ element }) => {
  
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation(); 

  if (loading) {

    return <div>Cargando sesión...</div>; 
  }

  if (!isAuthenticated) {
   
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return element;
};

export default ProtectedRoute;