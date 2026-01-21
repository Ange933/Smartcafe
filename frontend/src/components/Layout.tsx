/**
 * Layout principal de l'application
 * Contient la navigation et le conteneur pour les pages
 */

import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  CoffeeLogo,
  DashboardIcon,
  CategoriesIcon,
  ProductsIcon,
  OrdersIcon,
  TablesIcon,
  UserIcon,
  LogoutIcon,
} from './Icons';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    {
      path: '/dashboard',
      label: 'Tableau de bord',
      icon: DashboardIcon,
      roles: ['ADMIN', 'WAITER', 'KITCHEN'],
    },
    {
      path: '/categories',
      label: 'Catégories',
      icon: CategoriesIcon,
      roles: ['ADMIN'],
    },
    {
      path: '/products',
      label: 'Produits',
      icon: ProductsIcon,
      roles: ['ADMIN'],
    },
    {
      path: '/orders',
      label: user?.role === 'CUSTOMER' ? 'Mes Commandes' : 'Commandes',
      icon: OrdersIcon,
      roles: ['ADMIN', 'WAITER', 'KITCHEN', 'CUSTOMER'],
    },
    {
      path: '/tables',
      label: 'Tables',
      icon: TablesIcon,
      roles: ['ADMIN', 'WAITER'],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900">
      {/* Navigation */}
      <nav className="bg-white/10 backdrop-blur-2xl border-b border-white/10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex min-w-0">
              {/* Logo */}
              <div className="flex-shrink-0 flex items-center gap-2">
                <CoffeeLogo size={32} />
                <h1 className="text-2xl font-bold text-white">Smart Café</h1>
              </div>

              {/* Menu principal - Adapté selon le rôle */}
              <div className="hidden sm:ml-6 sm:flex sm:space-x-6">
                {navLinks
                  .filter((link) => link.roles.includes(user?.role || ''))
                  .map((link) => {
                    const Icon = link.icon;
                    const active = isActive(link.path);
                    return (
                      <Link
                        key={link.path}
                        to={link.path}
                        className={`inline-flex items-center px-2 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                          active
                            ? 'text-white bg-white/10 shadow-sm'
                            : 'text-stone-300 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <Icon />
                          {link.label}
                        </span>
                      </Link>
                    );
                  })}
              </div>
            </div>

            {/* Menu utilisateur */}
            <div className="flex items-center">
              <div className="flex items-center gap-2">
                <span className="text-stone-200 text-sm mr-2 inline-flex items-center gap-2">
                  <UserIcon className="text-stone-400" />
                  <span className="hidden sm:inline">
                    {user?.first_name} {user?.last_name}
                  </span>
                  <span className="hidden sm:inline ml-2 px-2 py-1 text-xs bg-white/10 text-stone-200 rounded">
                    {user?.role}
                  </span>
                </span>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-2 rounded-xl text-sm font-medium shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all"
                >
                  <LogoutIcon />
                  <span className="hidden sm:inline">Déconnexion</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Navigation mobile */}
      <div className="sm:hidden border-b border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="flex gap-2 overflow-x-auto px-3 py-2">
          {navLinks
            .filter((link) => link.roles.includes(user?.role || ''))
            .map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-3 py-2 text-xs font-medium transition-all ${
                    active
                      ? 'text-white bg-white/10'
                      : 'text-stone-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon />
                  {link.label}
                </Link>
              );
            })}
        </div>
      </div>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
