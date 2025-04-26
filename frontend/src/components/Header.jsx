import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-blue-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold flex items-center">
          <span className="mr-2">♟️</span>
          <span>Xadrez</span>
        </Link>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link to="/" className="hover:text-blue-300 transition-colors">
                Início
              </Link>
            </li>
            <li>
              <Link to="/game" className="hover:text-blue-300 transition-colors">
                Jogar
              </Link>
            </li>
            <li>
              <Link to="/history" className="hover:text-blue-300 transition-colors">
                Histórico
              </Link>
            </li>
            <li>
              <Link to="/profile" className="hover:text-blue-300 transition-colors">
                Perfil
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
