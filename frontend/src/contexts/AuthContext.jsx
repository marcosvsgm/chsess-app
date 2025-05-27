// src/contexts/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem('token');

    if (token) {
      try {
        const decoded = jwtDecode(token);
        const now = Date.now() / 1000;

        if (decoded.exp && decoded.exp > now) {
          setIsAuthenticated(true);
        } else {
          sessionStorage.removeItem('token');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Token inválido:', error);
        sessionStorage.removeItem('token');
        setIsAuthenticated(false);
      }
    }

    setLoading(false);
  }, []);

  const login = (token) => {
    sessionStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    sessionStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
