import React from 'react';
import { Link, Outlet, useLocation, Navigate } from 'react-router-dom';
import {
  UploadCloud,
  Layers,
  UserCheck,
  Sparkles,
  Users,
  FileText,
  Shield,
  Compass,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export default function ConsoleLayout() {
  const { user, role, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();

  if (!isAuthenticated || role === 'public') {
    return <Navigate to="/login" replace />;
  }

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 text-slate-900">
      <div className="max-w-7xl mx-auto">
        {/* Console Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4 mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-900">
                  Staff Operations Console
                </h1>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase font-bold">
                  Role: {role}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Logged in as <span className="text-slate-900 font-semibold">{user.name}</span> ({user.email})
              </p>
            </div>
          </div>

          {/* Navigation Pills */}
          <div className="flex flex-wrap gap-1.5 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm text-xs font-mono">
            <Link
              to="/console/upload"
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl transition-all ${
                isActive('/console/upload')
                  ? 'bg-blue-600 text-white font-bold shadow'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>{t('navUpload')}</span>
            </Link>

            <Link
              to="/console/my-submissions"
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl transition-all ${
                isActive('/console/my-submissions')
                  ? 'bg-blue-600 text-white font-bold shadow'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{t('navMySubmissions')}</span>
            </Link>

            {['editor', 'admin'].includes(role) && (
              <>
                <Link
                  to="/console/review-queue"
                  className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl transition-all ${
                    isActive('/console/review-queue')
                      ? 'bg-blue-600 text-white font-bold shadow'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>{t('navReviewQueue')}</span>
                </Link>

                <Link
                  to="/console/content-studio"
                  className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl transition-all ${
                    isActive('/console/content-studio')
                      ? 'bg-blue-600 text-white font-bold shadow'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t('navContentStudio')}</span>
                </Link>
              </>
            )}

            {role === 'admin' && (
              <>
                <Link
                  to="/console/users"
                  className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl transition-all ${
                    isActive('/console/users')
                      ? 'bg-blue-600 text-white font-bold shadow'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>{t('navUsers')}</span>
                </Link>

                <Link
                  to="/console/audit-log"
                  className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl transition-all ${
                    isActive('/console/audit-log')
                      ? 'bg-blue-600 text-white font-bold shadow'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{t('navAudit')}</span>
                </Link>

                <Link
                  to="/console/impact"
                  className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl transition-all ${
                    isActive('/console/impact')
                      ? 'bg-blue-600 text-white font-bold shadow'
                      : 'text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 border border-emerald-200'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Impact & KPIs</span>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Content Outlet */}
        <Outlet />
      </div>
    </div>
  );
}
