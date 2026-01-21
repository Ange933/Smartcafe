/**
 * Page du tableau de bord
 * Affiche les statistiques et informations importantes
 */

import { useEffect, useState } from 'react';
import { orderService, authService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const OrderIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M6 2L4 4v16l2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2V4l-2-2H6z" fill="currentColor" opacity="0.3" />
    <path d="M6 2L4 4v16l2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2V4l-2-2H6z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <line x1="8" y1="7" x2="16" y2="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="8" y1="11" x2="14" y2="11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const RevenueIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.3" />
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
    <path d="M12 6v12M9 9c0-1.1.9-2 2-2h2c1.1 0 2 .9 2 2s-.9 2-2 2h-2c-1.1 0-2 .9-2 2s.9 2 2 2h2c1.1 0 2-.9 2-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const UserPlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="8.5" cy="7" r="4" />
    <line x1="20" y1="8" x2="20" y2="14" />
    <line x1="23" y1="11" x2="17" y2="11" />
  </svg>
);

const SpinnerIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="animate-spin">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" />
    <path d="M12 2a10 10 0 019.17 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
    <path d="M22 4L12 14.01l-3-3" />
  </svg>
);

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
  const [focusedField, setFocusedField] = useState<string | null>(null);

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
      <div className="relative min-h-[60vh] flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 rounded-3xl" />
        <div className="relative z-10 flex items-center gap-3 text-lg text-stone-300">
          <SpinnerIcon />
          <span>Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden rounded-3xl">
      <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 px-6 sm:px-8 lg:px-10 py-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-3xl font-bold text-white">Tableau de bord</h1>
            <p className="mt-2 text-sm text-stone-400">
              Vue d'ensemble de l'activité du restaurant
            </p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300" />
            <div className="relative bg-white/10 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl hover:bg-white/[0.15] transition-all duration-300">
              <div className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 p-3 shadow-lg shadow-amber-500/30 text-white">
                    <OrderIcon />
                  </div>
                  <div className="min-w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-stone-400 truncate">
                        Total Commandes (Aujourd'hui)
                      </dt>
                      <dd className="text-3xl font-bold text-white mt-1">
                        {stats?.total_orders || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300" />
            <div className="relative bg-white/10 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl hover:bg-white/[0.15] transition-all duration-300">
              <div className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 p-3 shadow-lg shadow-emerald-500/30 text-white">
                    <RevenueIcon />
                  </div>
                  <div className="min-w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-stone-400 truncate">
                        Revenu (Aujourd'hui)
                      </dt>
                      <dd className="text-3xl font-bold text-white mt-1">
                        {stats?.total_revenue ? `${parseFloat(stats.total_revenue.toString()).toFixed(2)}€` : '0€'}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {user?.role === 'ADMIN' && (
          <div className="mt-10 relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 rounded-2xl blur opacity-10 group-hover:opacity-20 transition-opacity duration-300" />
            <div className="relative bg-white/10 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                  <UserPlusIcon />
                </div>
                <h2 className="text-xl font-semibold text-white">
                  Créer un serveur
                </h2>
              </div>
              <p className="text-sm text-stone-400 mb-6">
                Entrez le prénom et le nom. Un email et un mot de passe temporaire seront générés.
              </p>

              {createdCredentials && (
                <div className="mb-6 relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl blur opacity-30" />
                  <div className="relative rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-200">
                    <div className="flex items-center gap-2 font-semibold mb-2 text-emerald-300">
                      <CheckIcon />
                      Compte créé avec succès
                    </div>
                    <div className="space-y-1 text-emerald-200/80">
                      <p><span className="text-emerald-300">Email :</span> {createdCredentials.email}</p>
                      <p><span className="text-emerald-300">Mot de passe :</span> {createdCredentials.password}</p>
                    </div>
                  </div>
                </div>
              )}

              <form
                onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
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
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-stone-300">
                    Prénom
                  </label>
                  <div className={`relative group transition-all duration-300 ${focusedField === 'firstName' ? 'transform scale-[1.02]' : ''}`}>
                    <div className={`absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl blur opacity-0 transition-opacity duration-300 ${focusedField === 'firstName' ? 'opacity-30' : 'group-hover:opacity-20'}`} />
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      onFocus={() => setFocusedField('firstName')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Jean"
                      className="relative w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-stone-500 focus:border-amber-500/50 focus:bg-white/10 focus:outline-none transition-all duration-300"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-stone-300">
                    Nom
                  </label>
                  <div className={`relative group transition-all duration-300 ${focusedField === 'lastName' ? 'transform scale-[1.02]' : ''}`}>
                    <div className={`absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl blur opacity-0 transition-opacity duration-300 ${focusedField === 'lastName' ? 'opacity-30' : 'group-hover:opacity-20'}`} />
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      onFocus={() => setFocusedField('lastName')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Dupont"
                      className="relative w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-stone-500 focus:border-amber-500/50 focus:bg-white/10 focus:outline-none transition-all duration-300"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    disabled={creating}
                    className="relative group"
                  >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl blur opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                      {creating ? (
                        <>
                          <SpinnerIcon />
                          <span>Création...</span>
                        </>
                      ) : (
                        <>
                          <UserPlusIcon />
                          <span>Créer le serveur</span>
                        </>
                      )}
                    </div>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
