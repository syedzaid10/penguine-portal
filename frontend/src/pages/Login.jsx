import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  Shield,
  Lock,
  Mail,
  ArrowRight,
  UserCheck,
  Sparkles,
  CheckCircle2,
  Clock,
  UserPlus,
  Building,
  User,
  FlaskConical,
  FileEdit,
  Globe,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { user, role, login, logout } = useAuth();
  const navigate = useNavigate();

  // Mode: 'login' or 'register'
  const [activeTab, setActiveTab] = useState('login');

  // Sign In State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Registration State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('scientist');
  const [regDepartment, setRegDepartment] = useState('');
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState(null);

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
    setActiveTab('login');
  };

  const handleLoginSubmit = async (e) => {
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

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess(null);
    setRegLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regName,
          email: regEmail,
          password: regPassword,
          role: regRole,
          department: regDepartment,
        }),
      });
      const data = await res.json();

      if (data.success) {
        if (!data.requiresApproval && data.token) {
          // Instant activation for public role
          login(data.user, data.token);
          setRegSuccess({
            title: 'Welcome to Penguine!',
            message: 'Your public researcher account has been activated immediately.',
            requiresApproval: false,
          });
          setTimeout(() => navigate('/library'), 1800);
        } else {
          // Requires admin approval for scientist or editor
          setRegSuccess({
            title: 'Registration Submitted for Verification',
            message: data.message,
            requiresApproval: true,
            role: regRole,
            email: regEmail,
          });
        }
      } else {
        setRegError(data.message || 'Registration failed. Please check your details.');
      }
    } catch (err) {
      setRegError('Server connection failed: ' + err.message);
    } finally {
      setRegLoading(false);
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

        {/* Main Authentication Card */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/40 shadow-2xl text-slate-900">
          {/* Segmented Switcher: Sign In vs Create Account */}
          <div className="bg-slate-100 p-1.5 rounded-xl border border-slate-200 flex mb-6">
            <button
              type="button"
              onClick={() => { setActiveTab('login'); setError(''); setRegError(''); }}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center space-x-2 transition-all ${
                activeTab === 'login'
                  ? 'bg-white text-blue-700 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('register'); setError(''); setRegError(''); }}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center space-x-2 transition-all ${
                activeTab === 'register'
                  ? 'bg-white text-blue-700 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create an Account</span>
            </button>
          </div>

          {/* TAB 1: SIGN IN FORM */}
          {activeTab === 'login' && (
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div>
                  <h3 className="font-heading font-bold text-base text-slate-900">
                    Staff & Scholar Sign In
                  </h3>
                  <p className="text-xs text-slate-500">
                    Sign in with verified institutional credentials
                  </p>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start space-x-2 leading-relaxed">
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
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
                      className="w-full bg-white border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-xl pl-10 pr-3 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none shadow-xs transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
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
                      className="w-full bg-white border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-xl pl-10 pr-3 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none shadow-xs transition-all"
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
          )}

          {/* TAB 2: CREATE AN ACCOUNT FORM */}
          {activeTab === 'register' && (
            <div>
              {regSuccess ? (
                <div className="p-6 rounded-2xl bg-blue-50/80 border border-blue-200 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mx-auto shadow-xs">
                    {regSuccess.requiresApproval ? (
                      <Clock className="w-6 h-6 text-amber-600" />
                    ) : (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-heading font-extrabold text-base text-slate-900">
                      {regSuccess.title}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed mt-1.5 max-w-md mx-auto">
                      {regSuccess.message}
                    </p>
                  </div>

                  {regSuccess.requiresApproval && (
                    <div className="p-3 bg-white rounded-xl border border-blue-200/80 text-[11px] text-slate-600 space-y-1 text-left">
                      <div className="font-bold text-slate-800">Application Reference:</div>
                      <div>Requested Role: <span className="font-bold uppercase text-blue-700">{regSuccess.role}</span></div>
                      <div>Registered Email: <span className="font-semibold text-slate-800">{regSuccess.email}</span></div>
                      <div className="text-amber-700 font-semibold pt-1">
                        Status: Pending Administrator Verification
                      </div>
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setRegSuccess(null);
                        setActiveTab('login');
                      }}
                      className="btn-glacier-primary px-5 py-2.5 rounded-xl text-xs font-semibold inline-flex items-center space-x-1.5"
                    >
                      <span>Return to Sign In</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="pb-3 border-b border-slate-100 mb-4">
                    <h3 className="font-heading font-bold text-base text-slate-900">
                      National Polar Science Portal Registration
                    </h3>
                    <p className="text-xs text-slate-500">
                      Choose your role to request access to the research repository
                    </p>
                  </div>

                  {regError && (
                    <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start space-x-2 leading-relaxed">
                      <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                      <span>{regError}</span>
                    </div>
                  )}

                  <form onSubmit={handleRegisterSubmit} className="space-y-4">
                    {/* Role Selection Option Cards */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2">
                        Select Requested Role
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {/* 1. Public Visitor */}
                        <div
                          onClick={() => setRegRole('public')}
                          className={`p-3 rounded-xl border cursor-pointer transition-all ${
                            regRole === 'public'
                              ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500/30'
                              : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <Globe className="w-4 h-4 text-blue-600" />
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Instant
                            </span>
                          </div>
                          <div className="font-bold text-xs text-slate-900">Public Scholar</div>
                          <div className="text-[10px] text-slate-500 leading-tight mt-0.5">
                            Immediate exploration access
                          </div>
                        </div>

                        {/* 2. Research Scientist */}
                        <div
                          onClick={() => setRegRole('scientist')}
                          className={`p-3 rounded-xl border cursor-pointer transition-all ${
                            regRole === 'scientist'
                              ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500/30'
                              : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <FlaskConical className="w-4 h-4 text-blue-600" />
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                              Admin Verify
                            </span>
                          </div>
                          <div className="font-bold text-xs text-slate-900">Scientist</div>
                          <div className="text-[10px] text-slate-500 leading-tight mt-0.5">
                            Upload papers & telemetry
                          </div>
                        </div>

                        {/* 3. Science Editor */}
                        <div
                          onClick={() => setRegRole('editor')}
                          className={`p-3 rounded-xl border cursor-pointer transition-all ${
                            regRole === 'editor'
                              ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500/30'
                              : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <FileEdit className="w-4 h-4 text-purple-600" />
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                              Admin Verify
                            </span>
                          </div>
                          <div className="font-bold text-xs text-slate-900">Science Editor</div>
                          <div className="text-[10px] text-slate-500 leading-tight mt-0.5">
                            Review queue & Content Studio
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Full Name & Title
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        <input
                          type="text"
                          required
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          placeholder="e.g. Dr. Vikram Joshi"
                          className="w-full bg-white border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-xl pl-10 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none shadow-xs transition-all"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        <input
                          type="email"
                          required
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="e.g. vikram.joshi@ncpor.res.in"
                          className="w-full bg-white border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-xl pl-10 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none shadow-xs transition-all"
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Create Password
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        <input
                          type="password"
                          required
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="At least 6 characters"
                          className="w-full bg-white border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-xl pl-10 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none shadow-xs transition-all"
                        />
                      </div>
                    </div>

                    {/* Department / Institution */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Department / Research Affiliation
                      </label>
                      <div className="relative">
                        <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        <input
                          type="text"
                          value={regDepartment}
                          onChange={(e) => setRegDepartment(e.target.value)}
                          placeholder="e.g. NCPOR Ocean Sciences / Goa University"
                          className="w-full bg-white border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-xl pl-10 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none shadow-xs transition-all"
                        />
                      </div>
                    </div>

                    {/* Verification Notice Banner */}
                    {regRole !== 'public' ? (
                      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 flex items-start space-x-2">
                        <Clock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <span>
                          <strong>Verification Policy:</strong> Because you are registering for an official institutional role (<strong>{regRole.toUpperCase()}</strong>), your account will enter the Administrator Approval Queue and will be verified before you can access upload and editing capabilities.
                        </span>
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900 flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>
                          <strong>Instant Access:</strong> Public researcher accounts activate immediately upon form submission with full access to datasets and library items.
                        </span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={regLoading}
                      className="w-full btn-glacier-primary py-3 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 mt-2 transition-all shadow-md"
                    >
                      <span>
                        {regLoading
                          ? 'Registering Account...'
                          : regRole === 'public'
                          ? 'Create Account & Sign In'
                          : 'Submit for Administrator Approval'}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
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
