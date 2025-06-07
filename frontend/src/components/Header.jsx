import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="nav-ios sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="nav-title-ios">
          Xadrez Educativo
        </Link>
        
        <nav className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Link to="/game" className="text-blue-500 hover:text-blue-600">
                Jogar
              </Link>
              <Link to="/history" className="text-blue-500 hover:text-blue-600">
                Histórico
              </Link>
              <div className="relative group">
                <button className="flex items-center text-blue-500 hover:text-blue-600">
                  <span className="mr-1">{user?.name?.split(' ')[0] || 'Usuário'}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 card-ios">
                  <Link to="/profile" className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Perfil
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Sair
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ios btn-ios-secondary py-2 px-4">
                Login
              </Link>
              <Link to="/register" className="btn-ios btn-ios-primary py-2 px-4">
                Registrar
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;

