import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Compass,
  BookOpen,
  Database,
  Image,
  Calendar,
  Newspaper,
  GraduationCap,
  MessageSquare,
  Shield,
  UploadCloud,
  Layers,
  Sparkles,
  Users,
  FileText,
  Globe,
  UserCheck,
  ChevronDown,
  LogOut,
  Lock,
  Menu,
  X,
  Radio,
  Mail,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar() {
  const { user, role, logout } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  const location = useLocation();

  const [consoleMenuOpen, setConsoleMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const roleBadgeColors = {
    admin: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    editor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    scientist: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    public: 'bg-slate-700/40 text-slate-300 border-slate-600/40',
  };

  const navLinks = [
    { to: '/', sectionId: 'hero', label: t('navHome'), icon: Compass },
    { to: '/library', sectionId: 'library', label: t('navLibrary'), icon: BookOpen },
    { to: '/datasets', sectionId: 'datasets', label: t('navDatasets'), icon: Database },
    { to: '/gallery', sectionId: 'gallery', label: t('navGallery'), icon: Image },
    { to: '/activities', sectionId: 'activities', label: t('navActivities'), icon: Calendar },
    { to: '/student-zone', sectionId: 'student-zone', label: t('navStudent'), icon: GraduationCap },
    { to: '/news', sectionId: 'news', label: t('navNews'), icon: Newspaper },
    { to: '/ask', sectionId: 'ask', label: t('navAsk'), icon: MessageSquare },
    { to: '/#contact', sectionId: 'contact', label: t('navContact'), icon: Mail },
  ];

  // ScrollSpy listener when on the homepage
  useEffect(() => {
    if (location.pathname !== '/') return;

    const sectionIds = ['hero', 'library', 'datasets', 'gallery', 'activities', 'student-zone', 'news', 'ask', 'contact'];

    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= windowHeight * 0.45) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const handleLinkClick = (link, e) => {
    if (location.pathname === '/') {
      e.preventDefault();
      const el = document.getElementById(link.sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, '', link.sectionId === 'hero' ? '/' : `#${link.sectionId}`);
        setActiveSection(link.sectionId);
      }
    }
    setMobileMenuOpen(false);
  };

  const isLinkActive = (link) => {
    if (location.pathname === '/') {
      return activeSection === link.sectionId;
    }
    return location.pathname === link.to;
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0B1320]/95 backdrop-blur-md border-b border-slate-800/80 transition-colors text-white font-navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2.5 shrink-0 group">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-600/30 group-hover:scale-105 transition-transform shrink-0">
              <Compass className="w-5 h-5 text-white stroke-[2.2]" />
            </div>
            <div className="flex flex-col justify-center shrink-0 whitespace-nowrap">
              <div className="flex items-center space-x-1.5 leading-none">
                <span className="font-heading font-black text-sm sm:text-base tracking-wider text-white uppercase">
                  PENGUINE
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 border border-blue-500/40 text-blue-300 font-bold uppercase leading-none">
                  MoES
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-navbar tracking-tight mt-1 leading-none">
                National Polar Data Archive
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-0.5 xl:space-x-1">
            {navLinks.map((link) => {
              const active = isLinkActive(link);
              return (
                <Link
                  key={link.sectionId}
                  to={location.pathname === '/' ? `#${link.sectionId}` : `/#${link.sectionId}`}
                  onClick={(e) => handleLinkClick(link, e)}
                  className={`px-2 xl:px-3 py-1.5 rounded-lg text-[11px] xl:text-xs font-medium transition-all ${
                    active
                      ? 'bg-blue-600 text-white font-semibold shadow-sm shadow-blue-600/30'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Tools: Language, Demo Role Switcher, Staff Console */}
          <div className="hidden md:flex items-center space-x-2.5">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-xs font-mono text-slate-200 hover:text-white transition-all shadow-sm"
              title="Toggle English / Hindi interface"
            >
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>

            {/* Staff Console Dropdown (If authenticated or scientist/editor/admin) */}
            {role !== 'public' && (
              <div className="relative">
                <button
                  onClick={() => setConsoleMenuOpen(!consoleMenuOpen)}
                  className="btn-glacier-primary flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-semibold shadow-md shadow-blue-600/25"
                >
                  <Shield className="w-3.5 h-3.5 text-white" />
                  <span>{t('navConsole')}</span>
                  <ChevronDown className="w-3 h-3 ml-0.5 text-white" />
                </button>

                {consoleMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 rounded-xl bg-[#0F172A] border border-slate-700 shadow-2xl p-1.5 z-50 text-white"
                    onClick={() => setConsoleMenuOpen(false)}
                  >
                    <div className="px-3 py-1.5 border-b border-slate-800 text-[10px] font-mono uppercase text-slate-400 font-semibold">
                      Staff Workspace
                    </div>
                    <Link
                      to="/console/upload"
                      className="flex items-center space-x-2 px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 hover:text-blue-400 rounded-md"
                    >
                      <UploadCloud className="w-4 h-4 text-blue-400" />
                      <span>{t('navUpload')}</span>
                    </Link>
                    <Link
                      to="/console/my-submissions"
                      className="flex items-center space-x-2 px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 hover:text-blue-400 rounded-md"
                    >
                      <Layers className="w-4 h-4 text-emerald-400" />
                      <span>{t('navMySubmissions')}</span>
                    </Link>
                    {['editor', 'admin'].includes(role) && (
                      <>
                        <Link
                          to="/console/review-queue"
                          className="flex items-center space-x-2 px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 hover:text-blue-400 rounded-md"
                        >
                          <UserCheck className="w-4 h-4 text-purple-400" />
                          <span>{t('navReviewQueue')}</span>
                        </Link>
                        <Link
                          to="/console/content-studio"
                          className="flex items-center space-x-2 px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 hover:text-blue-400 rounded-md"
                        >
                          <Sparkles className="w-4 h-4 text-pink-400" />
                          <span>{t('navContentStudio')}</span>
                        </Link>
                      </>
                    )}
                    {role === 'admin' && (
                      <>
                        <div className="border-t border-slate-800 my-1"></div>
                        <Link
                          to="/console/users"
                          className="flex items-center space-x-2 px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 hover:text-blue-400 rounded-md"
                        >
                          <Users className="w-4 h-4 text-amber-400" />
                          <span>{t('navUsers')}</span>
                        </Link>
                        <Link
                          to="/console/audit-log"
                          className="flex items-center space-x-2 px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 hover:text-blue-400 rounded-md"
                        >
                          <FileText className="w-4 h-4 text-rose-400" />
                          <span>{t('navAudit')}</span>
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Real Authentication: Sign In or User Profile with Sign Out */}
            {user && role !== 'public' ? (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2 px-2.5 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-navbar">
                  <div className="w-6 h-6 rounded-lg bg-blue-600/40 text-blue-300 border border-blue-500/40 flex items-center justify-center font-bold text-[11px] uppercase">
                    {user.name ? user.name[0] : 'U'}
                  </div>
                  <div className="hidden xl:block text-left leading-none">
                    <div className="font-semibold text-white text-[11px] truncate max-w-[130px]">{user.name}</div>
                    <div className="text-[9px] font-mono text-slate-400 uppercase mt-0.5">{user.role}</div>
                  </div>
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase border ${roleBadgeColors[user.role] || roleBadgeColors.public}`}>
                    {user.role}
                  </span>
                </div>

                <button
                  onClick={logout}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-rose-950/40 border border-slate-700 hover:border-rose-700/50 text-xs font-navbar text-slate-300 hover:text-rose-300 transition-all shadow-sm"
                  title="Sign out of Penguine session"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="btn-glacier-primary flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-navbar font-semibold shadow-md shadow-blue-600/25 transition-all"
                title="Sign in with your MoES / NCPOR credentials"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={toggleLanguage}
              className="px-2 py-1 rounded bg-slate-800 text-xs font-mono text-blue-400"
            >
              {language === 'en' ? 'हि' : 'EN'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-300 hover:text-white hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0B1320] border-b border-slate-800 px-4 pt-2 pb-4 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isLinkActive(link);
            return (
              <Link
                key={link.sectionId}
                to={location.pathname === '/' ? `#${link.sectionId}` : `/#${link.sectionId}`}
                onClick={(e) => handleLinkClick(link, e)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium ${
                  active
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
          {role !== 'public' && (
            <div className="pt-2 border-t border-slate-800 space-y-1">
              <div className="text-[10px] font-mono text-slate-400 uppercase px-3">Staff Console</div>
              <Link
                to="/console/upload"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-cyan-300"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Upload Item</span>
              </Link>
              <Link
                to="/console/my-submissions"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-emerald-300"
              >
                <Layers className="w-4 h-4" />
                <span>My Submissions</span>
              </Link>
              {['editor', 'admin'].includes(role) && (
                <>
                  <Link
                    to="/console/review-queue"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2 text-sm text-purple-300"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Review Queue</span>
                  </Link>
                  <Link
                    to="/console/content-studio"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2 text-sm text-pink-300"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Content Studio</span>
                  </Link>
                </>
              )}
            </div>
          )}

          {/* Mobile Auth Button */}
          <div className="pt-2 border-t border-slate-800">
            {user && role !== 'public' ? (
              <div className="p-3 bg-slate-900 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-white">{user.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{user.email}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold border ${roleBadgeColors[user.role] || roleBadgeColors.public}`}>
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="w-full flex items-center justify-center space-x-1.5 py-2 rounded-lg bg-rose-950/40 hover:bg-rose-950/60 text-rose-300 border border-rose-700/40 text-xs font-semibold"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out Session</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-glacier-primary w-full flex items-center justify-center space-x-1.5 py-2.5 rounded-xl text-xs font-semibold"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Sign In to Penguine</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
