import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Shield, Lock, Mail, ArrowRight, UserCheck, Sparkles, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { user, role, login, logout } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const officialCredentials = [
    {
      role: 'Administrator',
      roleKey: 'admin',
      name: 'Dr. Rameshwar Sharma',
      department: 'Ministry of Earth Sciences (Director General)',
      email: 'admin@penguine.gov.in',
      password: 'Admin@123',
      badge: 'bg-amber-50 text-amber-800 border-amber-200',
    },
    {
      role: 'Science Editor',
      roleKey: 'editor',
      name: 'Priya Narayanan',
      department: 'NCPOR Science Communication Bureau',
      email: 'editor@penguine.gov.in',
      password: 'Editor@123',
      badge: 'bg-purple-50 text-purple-800 border-purple-200',
    },
    {
      role: 'Research Scientist',
      roleKey: 'scientist',
      name: 'Dr. Ananya Sen',
      department: 'Cryosphere & Atmospheric Sciences, NCPOR',
      email: 'scientist@penguine.gov.in',
      password: 'Scientist@123',
      badge: 'bg-blue-50 text-blue-800 border-blue-200',
    },
    {
      role: 'Public Visitor',
      roleKey: 'public',
      name: 'Aarav Mehta',
      department: 'Delhi University, Polar Geophysics Scholar',
      email: 'visitor@penguine.gov.in',
      password: 'Visitor@123',
      badge: 'bg-slate-100 text-slate-700 border-slate-200',
    },
  ];

  const fillCredentials = (credsEmail, credsPassword) => {
    setEmail(credsEmail);
    setPassword(credsPassword);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (data.success) {
        login(data.user, data.token);
        if (data.user.role === 'public') {
          navigate('/library');
        } else {
          navigate('/console/upload');
        }
      } else {
        setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('Server connection failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen relative flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-cover bg-center"
      style={{ backgroundImage: "url('/images/station-datacenter.jpg')" }}
    >
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[3px]" />

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-xl text-center">
        <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center p-2.5 mx-auto shadow-lg shadow-blue-600/30 mb-3 text-white">
          <Compass className="w-7 h-7 stroke-[2.5]" />
        </div>
        <h2 className="font-heading font-extrabold text-3xl text-white tracking-tight">
          Penguine Authentication
        </h2>
        <p className="text-xs text-slate-300 font-mono mt-1">
          Ministry of Earth Sciences (MoES) • National Polar Data Archive
        </p>
      </div>

      <div className="relative z-10 mt-8 sm:mx-auto sm:w-full sm:max-w-xl space-y-6">
        {/* Active Session Notice if already logged in */}
        {user && role !== 'public' && (
          <div className="bg-emerald-950/80 border border-emerald-500/40 rounded-2xl p-4 text-white flex items-center justify-between shadow-xl">
            <div>
              <div className="text-xs font-mono text-emerald-400 font-semibold">Active Session Detected</div>
              <div className="text-sm font-bold">{user.name} ({user.role.toUpperCase()})</div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigate('/console/upload')}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold"
              >
                Go to Console
              </button>
              <button
                onClick={logout}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-xs text-slate-300 hover:text-white"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}

        {/* Real Login Form Card */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/40 shadow-2xl text-slate-900">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-5">
            <div>
              <h3 className="font-heading font-bold text-lg text-slate-900">
                Staff & Researcher Sign In
              </h3>
              <p className="text-xs text-slate-500 font-sans mt-0.5">
                Sign in with verified institutional credentials
              </p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-mono">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-bold text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="scientist@penguine.gov.in"
                  className="w-full bg-white border border-slate-300 focus:border-blue-600 rounded-xl pl-10 pr-3 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none shadow-sm transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-slate-300 focus:border-blue-600 rounded-xl pl-10 pr-3 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none shadow-sm transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-glacier-primary py-3 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 mt-2 transition-all shadow-md"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In with Credentials'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Official Credentials Reference Card */}
        <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl p-6 border border-slate-700 shadow-2xl text-white space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Shield className="w-4 h-4 text-blue-400" />
                <span>Official Penguine Demo Credentials</span>
              </span>
              <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                Click "Fill Form" on any account below to autofill and test authentication
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-900/50 text-blue-300 border border-blue-500/40 font-semibold">
              MoES Verified
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {officialCredentials.map((cred, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-slate-600 transition-all flex flex-col justify-between space-y-2"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white font-heading">{cred.role}</span>
                    <span className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded border ${cred.badge}`}>
                      {cred.roleKey}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300 font-medium truncate mt-0.5">
                    {cred.name}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono truncate">
                    {cred.department}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-700/60 font-mono text-[10px] space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Email:</span>
                    <span className="text-blue-300 select-all">{cred.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Pass:</span>
                    <span className="text-emerald-400 font-bold select-all">{cred.password}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => fillCredentials(cred.email, cred.password)}
                  className="w-full mt-1 py-1.5 rounded-lg bg-blue-600/30 hover:bg-blue-600 text-blue-200 hover:text-white border border-blue-500/40 text-[10px] font-mono font-semibold transition-all text-center"
                >
                  Fill Form
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
