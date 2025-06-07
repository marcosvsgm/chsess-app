// src/contexts/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { API_URL } from '../config';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem('token');

    if (token) {
      try {
        const decoded = jwtDecode(token);
        const now = Date.now() / 1000;

        if (decoded.exp && decoded.exp > now) {
          setIsAuthenticated(true);
          // Configurar o token para todas as requisições
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Buscar dados do usuário
          fetchUserData(token);
        } else {
          sessionStorage.removeItem('token');
          setIsAuthenticated(false);
          setUser(null);
          setLoading(false);
        }
      } catch (error) {
        console.error('Token inválido:', error);
        sessionStorage.removeItem('token');
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserData = async (token) => {
    try {
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUser(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });
      
      const { token, user } = response.data;
      sessionStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      console.error('Erro de login:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Erro ao fazer login'
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password
      });
      
      return { success: true };
    } catch (error) {
      console.error('Erro ao registrar:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Erro ao criar conta'
      };
    }
  };

  const logout = () => {
    sessionStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setIsAuthenticated(false);
    setUser(null);
  };

  const updateUserProfile = async (userData) => {
    try {
      // Verificar se estamos enviando um arquivo (FormData) ou dados JSON
      let response;
      
      if (userData instanceof FormData) {
        response = await axios.put(`${API_URL}/users/profile`, userData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        response = await axios.put(`${API_URL}/users/profile`, userData);
      }
      
      // Atualizar o usuário no estado
      setUser(response.data);
      
      return { success: true };
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Erro ao atualizar perfil'
      };
    }
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      login, 
      logout, 
      register,
      updateUserProfile
    }}>
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

