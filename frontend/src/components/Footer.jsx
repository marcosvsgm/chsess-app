import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-center md:text-left">
              &copy; {new Date().getFullYear()} Xadrez. Todos os direitos reservados.
            </p>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-blue-300 transition-colors">
              Sobre
            </a>
            <a href="#" className="hover:text-blue-300 transition-colors">
              Termos
            </a>
            <a href="#" className="hover:text-blue-300 transition-colors">
              Privacidade
            </a>
            <a href="#" className="hover:text-blue-300 transition-colors">
              Contacto
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
