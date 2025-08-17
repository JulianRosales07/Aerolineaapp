import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { BarChart3, Plane, MapPin, Users, Settings, Home, User } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const { isAdmin, isLoggedIn, adminUser, logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!isAdmin || !isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Settings className="h-10 w-10 text-red-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Acceso Restringido</h2>
          <p className="text-gray-600 mb-6">Debes iniciar sesión como administrador para acceder a esta sección.</p>
          <Link to="/" className="bg-sky-500 text-white px-6 py-3 rounded-lg hover:bg-sky-600 transition-colors">
            Volver al Inicio
          </Link>
        </div>
      </div>
    );
  }

  const menuItems = [
    { path: '/admin', icon: BarChart3, label: 'Dashboard', exact: true },
    { path: '/admin/aircraft', icon: Plane, label: 'Aeronaves' },
    { path: '/admin/airports', icon: MapPin, label: 'Aeropuertos' },
    { path: '/admin/users', icon: Users, label: 'Usuarios' },
  ];

  const isActivePath = (path: string, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <div className="flex items-center space-x-2">
            <Settings className="h-8 w-8 text-sky-500" />
            <h1 className="text-xl font-bold text-gray-900">Panel Admin</h1>
          </div>
          <div className="mt-4 p-3 bg-sky-50 rounded-lg">
            <p className="text-sm text-sky-700">
              <strong>Conectado como:</strong><br />
              {adminUser}
            </p>
          </div>
        </div>

        <nav className="mt-6">
          <div className="px-4">
            <Link
              to="/"
              className="flex items-center space-x-3 text-gray-700 hover:text-sky-500 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors mb-2"
            >
              <Home className="h-5 w-5" />
              <span>Volver a Inicio</span>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors w-full"
            >
              <User className="h-5 w-5" />
              <span>Cerrar Sesión</span>
            </button>
          </div>

          <div className="px-4 mt-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Administración
            </p>
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors mb-1 ${isActivePath(item.path, item.exact)
                    ? 'bg-sky-100 text-sky-700'
                    : 'text-gray-700 hover:text-sky-500 hover:bg-gray-100'
                  }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;