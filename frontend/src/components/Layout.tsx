/**
 * Layout principal de l'application
 * Contient la navigation et le conteneur pour les pages
 */

import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              {/* Logo */}
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-2xl font-bold text-primary-600">☕ Smart Café</h1>
              </div>

              {/* Menu principal - Adapté selon le rôle */}
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {/* Dashboard - Tous sauf CUSTOMER */}
                {user?.role !== 'CUSTOMER' && (
                  <Link
                    to="/dashboard"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive('/dashboard')
                        ? 'border-primary-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    📊 Tableau de bord
                  </Link>
                )}

                {/* Catégories - ADMIN uniquement */}
                {user?.role === 'ADMIN' && (
                  <Link
                    to="/categories"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive('/categories')
                        ? 'border-primary-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    📁 Catégories
                  </Link>
                )}

                {/* Produits - ADMIN uniquement */}
                {user?.role === 'ADMIN' && (
                  <Link
                    to="/products"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive('/products')
                        ? 'border-primary-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    🍽️ Produits
                  </Link>
                )}

                {/* Commandes - Tous */}
                <Link
                  to="/orders"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive('/orders')
                      ? 'border-primary-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  📋 {user?.role === 'CUSTOMER' ? 'Mes Commandes' : 'Commandes'}
                </Link>

                {/* Tables - ADMIN et WAITER uniquement */}
                {(user?.role === 'ADMIN' || user?.role === 'WAITER') && (
                  <Link
                    to="/tables"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive('/tables')
                        ? 'border-primary-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    🪑 Tables
                  </Link>
                )}
              </div>
            </div>

            {/* Menu utilisateur */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-gray-700 text-sm mr-4">
                  {user?.first_name} {user?.last_name}
                  <span className="ml-2 px-2 py-1 text-xs bg-primary-100 text-primary-800 rounded">
                    {user?.role}
                  </span>
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Déconnexion
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
