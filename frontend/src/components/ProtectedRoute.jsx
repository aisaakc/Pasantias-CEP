// frontend/src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ProtectedRoute({ element }) {

  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
  
  const location = useLocation();

  if (isLoading) {
    return <div>Cargando sesión...</div>;
  }

  if (!isAuthenticated) {
  
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return element;
}