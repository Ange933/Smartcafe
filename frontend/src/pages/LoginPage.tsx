/**
 * Page de connexion Smart Café
 * Design moderne avec animations et effets visuels
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CoffeeLogo = ({ size = 48 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <defs>
      <linearGradient id="coffeeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
      <linearGradient id="steamGrad" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
      </linearGradient>
    </defs>
    <path d="M16 10C16 10 18 6 16 2" stroke="url(#steamGrad)" strokeWidth="2.5" strokeLinecap="round" className="animate-pulse" />
    <path d="M24 8C24 8 26 4 24 0" stroke="url(#steamGrad)" strokeWidth="2.5" strokeLinecap="round" className="animate-pulse" style={{ animationDelay: '0.3s' }} />
    <path d="M32 10C32 10 34 6 32 2" stroke="url(#steamGrad)" strokeWidth="2.5" strokeLinecap="round" className="animate-pulse" style={{ animationDelay: '0.6s' }} />
    <path d="M8 16H36V32C36 38.627 30.627 44 24 44H20C13.373 44 8 38.627 8 32V16Z" fill="url(#coffeeGrad)" />
    <path d="M36 20H40C42.209 20 44 21.791 44 24V26C44 28.209 42.209 30 40 30H36" stroke="#D97706" strokeWidth="3" strokeLinecap="round" fill="none" />
    <path d="M13 20V28" stroke="rgba(255,255,255,0.4)" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const EmailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M22 7L12 13L2 7" />
  </svg>
);

const LockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);

const ArrowIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const SpinnerIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="animate-spin">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" />
    <path d="M12 2a10 10 0 019.17 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const demoAccounts = [
    { role: 'Admin', email: 'admin@smartcafe.com', color: 'from-amber-500 to-orange-500' },
    { role: 'Serveur', email: 'waiter@smartcafe.com', color: 'from-emerald-500 to-teal-500' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900">
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%">
            <pattern id="coffeePattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <ellipse cx="30" cy="30" rx="12" ry="18" fill="white" transform="rotate(45 30 30)" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#coffeePattern)" />
          </svg>
        </div>
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 rounded-3xl blur-lg opacity-30 animate-pulse" />

          <div className="relative bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl shadow-lg shadow-amber-500/30 mb-4 transform hover:scale-110 transition-transform duration-300">
                <CoffeeLogo size={48} />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
                Smart Café
              </h1>
              <p className="text-stone-400 text-sm">
                Bienvenue dans votre espace de gestion
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl text-sm flex items-center gap-2 animate-shake">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v4M12 16h.01" />
                  </svg>
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-stone-300">
                  Email
                </label>
                <div className={`relative group transition-all duration-300 ${focusedField === 'email' ? 'transform scale-[1.02]' : ''}`}>
                  <div className={`absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl blur opacity-0 transition-opacity duration-300 ${focusedField === 'email' ? 'opacity-30' : 'group-hover:opacity-20'}`} />
                  <div className="relative flex items-center">
                    <span className={`absolute left-4 transition-colors duration-300 ${focusedField === 'email' ? 'text-amber-400' : 'text-stone-500'}`}>
                      <EmailIcon />
                    </span>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-stone-500 focus:outline-none focus:border-amber-500/50 focus:bg-white/10 transition-all duration-300"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-stone-300">
                  Mot de passe
                </label>
                <div className={`relative group transition-all duration-300 ${focusedField === 'password' ? 'transform scale-[1.02]' : ''}`}>
                  <div className={`absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl blur opacity-0 transition-opacity duration-300 ${focusedField === 'password' ? 'opacity-30' : 'group-hover:opacity-20'}`} />
                  <div className="relative flex items-center">
                    <span className={`absolute left-4 transition-colors duration-300 ${focusedField === 'password' ? 'text-amber-400' : 'text-stone-500'}`}>
                      <LockIcon />
                    </span>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-stone-500 focus:outline-none focus:border-amber-500/50 focus:bg-white/10 transition-all duration-300"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="relative w-full group mt-6"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl blur opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl text-white font-semibold shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                  {loading ? (
                    <>
                      <SpinnerIcon />
                      <span>Connexion en cours...</span>
                    </>
                  ) : (
                    <>
                      <span>Se connecter</span>
                      <ArrowIcon />
                    </>
                  )}
                </div>
              </button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 text-xs text-stone-500 bg-transparent">
                  COMPTES DEMO
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {demoAccounts.map((account) => (
                <button
                  key={account.role}
                  type="button"
                  onClick={() => {
                    setEmail(account.email);
                    setPassword('admin123');
                  }}
                  className="group relative p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${account.color} rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  <div className="relative">
                    <div className={`text-xs font-bold bg-gradient-to-r ${account.color} bg-clip-text text-transparent`}>
                      {account.role}
                    </div>
                    <div className="text-[10px] text-stone-500 truncate mt-0.5">
                      {account.email}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-stone-600 text-xs mt-6">
          © 2026 Smart Café • Gestion intelligente
        </p>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
