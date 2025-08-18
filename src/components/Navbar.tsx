import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plane, Menu, X, User } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import LoginModal from './LoginModal';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { isAdmin, isLoggedIn, adminUser, logout } = useApp();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="bg-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <Plane className="h-8 w-8 text-sky-500" />
              <span className="text-xl font-bold text-gray-900">NovaAir</span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <Link to="/booking" className="text-gray-700 hover:text-sky-500 font-medium transition-colors">
                Reservar
              </Link>
              <Link to="/offers" className="text-gray-700 hover:text-sky-500 font-medium transition-colors">
                Ofertas y Destinos
              </Link>
              <Link to="/checkin" className="text-gray-700 hover:text-sky-500 font-medium transition-colors">
                Check-in
              </Link>
              <Link to="/info" className="text-gray-700 hover:text-sky-500 font-medium transition-colors">
                Información y Ayuda
              </Link>
              
              {isAdmin && (
                <Link to="/admin" className="bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600 transition-colors font-medium">
                  Panel Admin
                </Link>
              )}
              
              {isLoggedIn && isAdmin ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">Hola, {adminUser}</span>
                  <button
                    onClick={handleLogout}
                    className="text-red-600 hover:text-red-800 transition-colors font-medium"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="flex items-center space-x-1 text-gray-700 hover:text-sky-500 transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span>Iniciar Sesión</span>
                </button>
              )}
            </div>

            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <Link
                  to="/booking"
                  className="block px-3 py-2 text-gray-700 hover:text-sky-500"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Reservar
                </Link>
                <Link
                  to="/offers"
                  className="block px-3 py-2 text-gray-700 hover:text-sky-500"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Ofertas y Destinos
                </Link>
                <Link
                  to="/checkin"
                  className="block px-3 py-2 text-gray-700 hover:text-sky-500"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Check-in
                </Link>
                <Link
                  to="/info"
                  className="block px-3 py-2 text-gray-700 hover:text-sky-500"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Información y Ayuda
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="block px-3 py-2 bg-sky-500 text-white rounded"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Panel Admin
                  </Link>
                )}
                
                {isLoggedIn && isAdmin ? (
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 text-red-600 hover:text-red-800"
                  >
                    Cerrar Sesión
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsLoginOpen(true);
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-gray-700 hover:text-sky-500"
                  >
                    Iniciar Sesión
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
};

export default Navbar;