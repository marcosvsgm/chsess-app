import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = () => {
  const { isAuthenticated } = useAuth();

  // Redireciona se não estiver autenticado
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Renderiza o conteúdo protegido
  return <Outlet />;
};

export default PrivateRoute;
