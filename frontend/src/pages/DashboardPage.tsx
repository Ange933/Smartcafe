/**
 * Page du tableau de bord
 * Affiche les statistiques et informations importantes
 */

import { useEffect, useState } from 'react';
import { orderService, authService } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface Stats {
  total_orders: number;
  total_revenue: number;
}

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [creating, setCreating] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState<{ email: string; password: string } | null>(null);

  useEffect(() => {
    loadStats();
    const interval = setInterval(() => {
      loadStats();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadStats = async () => {
    try {
      const response = await orderService.getStats();
      setStats(response.data.data);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="mt-2 text-sm text-gray-700">
            Vue d'ensemble de l'activité du restaurant
          </p>
        </div>
      </div>

      {/* Statistiques */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* Total des commandes */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="rounded-md bg-primary-500 p-3">
                  <span className="text-2xl">CMD</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Commandes (Aujourd'hui)
                  </dt>
                  <dd className="text-3xl font-semibold text-gray-900">
                    {stats?.total_orders || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Revenu total */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="rounded-md bg-green-500 p-3">
                  <span className="text-2xl">EUR</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Revenu (Aujourd'hui)
                  </dt>
                  <dd className="text-3xl font-semibold text-gray-900">
                    {stats?.total_revenue ? `${parseFloat(stats.total_revenue.toString()).toFixed(2)}€` : '0€'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {user?.role === 'ADMIN' && (
        <div className="mt-10 bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Créer un serveur
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Entrez le prénom et le nom. Un email et un mot de passe temporaire seront générés.
          </p>

          {createdCredentials && (
            <div className="mb-4 rounded-md border border-green-200 bg-green-50 p-4 text-sm text-green-800">
              <div className="font-semibold mb-1">Compte créé :</div>
              Email : {createdCredentials.email}<br />
              Mot de passe : {createdCredentials.password}
            </div>
          )}

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setCreating(true);
              setCreatedCredentials(null);
              try {
                const response = await authService.registerWaiter({
                  first_name: firstName.trim(),
                  last_name: lastName.trim(),
                });
                setCreatedCredentials(response.data.data.credentials);
                setFirstName('');
                setLastName('');
              } catch (error) {
                console.error('Erreur lors de la création du serveur:', error);
                alert('Erreur lors de la création du serveur');
              } finally {
                setCreating(false);
              }
            }}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prénom
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom
              </label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border"
              />
            </div>
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={creating}
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 disabled:opacity-50"
              >
                {creating ? 'Création...' : 'Créer le serveur'}
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};

export default DashboardPage;
