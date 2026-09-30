import React, { useState, useEffect } from 'react';
import { Calendar, Flag, Award, Radio, ArrowRight, BookOpen, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import LocationPin from '../components/LocationPin';

export default function Activities({ isEmbedded = false }) {
  const { t } = useLanguage();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    const url =
      categoryFilter !== 'all'
        ? `/api/activities?category=${categoryFilter}`
        : '/api/activities';

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setActivities(data.data);
        }
      })
      .catch((err) => console.warn('Could not fetch activities:', err))
      .finally(() => setLoading(false));
  }, [categoryFilter]);

  const ContainerTag = isEmbedded ? 'section' : 'div';

  return (
    <ContainerTag
      id={isEmbedded ? 'activities' : undefined}
      className={
        isEmbedded
          ? 'py-20 px-4 sm:px-6 lg:px-8 bg-transparent border-t border-slate-200/40 scroll-mt-16'
          : 'min-h-screen bg-transparent py-10 px-4 sm:px-6 lg:px-8 text-slate-900'
      }
    >
      <div className="max-w-5xl mx-auto">
        {/* Section Header Banner */}
        <div className="card-glacier p-6 sm:p-8 rounded-2xl mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 border border-slate-200 shadow-sm">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <span>Official Expedition Chronology & Milestones</span>
            </div>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-slate-900 tracking-tight">
              {isEmbedded ? 'Polar Expedition Milestones & Timeline' : t('navActivities')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed font-medium">
              Historical milestones, station establishments, and expedition timeline of India's polar research program (1981 - 2026).
            </p>
          </div>

          {/* Filter Pills */}
          <div className="bg-slate-100 p-1 rounded-xl shrink-0 z-10 flex flex-wrap gap-1 text-xs border border-slate-200">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                categoryFilter === 'all'
                  ? 'bg-white text-blue-700 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Milestones
            </button>
            <button
              onClick={() => setCategoryFilter('expedition')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                categoryFilter === 'expedition'
                  ? 'bg-white text-blue-700 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Expeditions
            </button>
            <button
              onClick={() => setCategoryFilter('event')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                categoryFilter === 'event'
                  ? 'bg-white text-blue-700 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Key Events
            </button>
            <button
              onClick={() => setCategoryFilter('announcement')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                categoryFilter === 'announcement'
                  ? 'bg-white text-blue-700 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Announcements
            </button>
          </div>
        </div>

        {/* Vertical Timeline */}
        {loading ? (
          <div className="space-y-6 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="card-glacier h-32 bg-slate-100"></div>
            ))}
          </div>
        ) : (
          <div className="relative ml-4 md:ml-32 space-y-8 pb-12 before:absolute before:top-0 before:left-[-1px] before:w-[2px] before:h-full before:bg-slate-300">
            {activities.map((act, idx) => (
              <div key={act._id || idx} className="relative pl-6 md:pl-8 group">
                {/* Timeline node icon */}
                <div className="absolute -left-[17px] top-1.5 w-8 h-8 rounded-full bg-white border-2 border-blue-600 flex items-center justify-center shadow-sm group-hover:scale-105 group-hover:border-blue-700 transition-all duration-200">
                  {act.category === 'expedition' ? (
                    <Flag className="w-3.5 h-3.5 text-blue-600" />
                  ) : act.category === 'event' ? (
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                  ) : (
                    <Radio className="w-3.5 h-3.5 text-indigo-600" />
                  )}
                </div>

                {/* Date tag floating on left on larger screens */}
                <div className="md:absolute md:-left-32 md:top-2 text-xs font-semibold text-slate-700 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-xs mb-1 md:mb-0">
                  {act.date}
                </div>

                {/* Content Card */}
                <div className="card-glacier p-6 hover:border-blue-300 hover:shadow-md transition-all duration-200">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80 uppercase inline-flex items-center gap-1.5 shadow-xs">
                      <LocationPin className="w-3.5 h-3.5 text-blue-600" />
                      <span>{act.station}</span>
                    </span>
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 capitalize">
                      {act.category}
                    </span>
                  </div>

                  <h3 className="font-heading font-extrabold text-base text-slate-900 group-hover:text-blue-700 transition-colors mb-2">
                    {act.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4 font-medium">
                    {act.description}
                  </p>

                  {/* Related Links */}
                  <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center space-x-2 text-slate-500 text-[11px] font-medium">
                      <span>Archive Verification:</span>
                      <span className="text-emerald-700 font-bold">✓ Certified Record</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/library?station=${encodeURIComponent(act.station)}`}
                        className="flex items-center space-x-1.5 text-blue-600 font-semibold hover:text-blue-800 transition-colors text-xs"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                        <span>Related Reports</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ContainerTag>
  );
}
