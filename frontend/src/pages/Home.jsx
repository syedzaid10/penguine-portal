import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  Search,
  BookOpen,
  Database,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Layers,
  GraduationCap,
  ChevronRight,
  Play,
  Star,
} from 'lucide-react';
import StationStatusStrip from '../components/StationStatusStrip';
import ContactSection from '../components/ContactSection';
import Library from './Library';
import Datasets from './Datasets';
import Gallery from './Gallery';
import Activities from './Activities';
import StudentZone from './StudentZone';
import News from './News';
import AskArchive from './AskArchive';
import { useLanguage } from '../context/LanguageContext';

export default function Home() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Ensure that whenever the website is opened, it first displays the top of the home screen page
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }
      if (!window.location.hash || window.location.hash === '#hero') {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      } else {
        const targetId = window.location.hash.replace('#', '');
        const element = document.getElementById(targetId);
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth' });
          }, 150);
        }
      }
    }
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const libEl = document.getElementById('library');
      if (libEl) {
        libEl.scrollIntoView({ behavior: 'smooth' });
        // Update URL hash without reload
        window.history.pushState(null, '', '#library');
      } else {
        navigate(`/library?q=${encodeURIComponent(searchQuery.trim())}`);
      }
    } else {
      const libEl = document.getElementById('library');
      if (libEl) {
        libEl.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate('/library');
      }
    }
  };

  const scrollToSection = (id) => (e) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      window.history.pushState(null, '', `#${id}`);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-slate-900">
      {/* 1. Glacier Adventures Hero Section with High-Res Polar Background */}
      <section id="hero" className="relative min-h-[640px] flex items-center overflow-hidden scroll-mt-16">
        {/* Background Image with Dark Atmospheric Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/glacier-mountains-sea.jpg')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-slate-900/50" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
          <div className="max-w-3xl space-y-6 text-white">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-blue-200 text-xs font-medium">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>National Polar Science & Data Archive • MoES & NCPOR</span>
              </div>

              <h1 className="font-heading font-extrabold text-4xl sm:text-5xl md:text-6xl tracking-tight text-white leading-[1.1]">
                Explore. Experience. <br />
                <span className="text-blue-400">Polar.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-200 max-w-xl leading-relaxed">
                Archive once, publish everywhere. Over 40 years of Antarctic, Arctic, and Southern Ocean expeditions, FAIR telemetry datasets, satellite imagery, and peer-reviewed research.
              </p>

              {/* Action Buttons: Primary & Ghost with Play icon */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#library"
                  onClick={scrollToSection('library')}
                  className="btn-glacier-primary px-7 py-3.5 rounded-xl font-semibold inline-flex items-center space-x-2 text-sm"
                >
                  <span>Explore Archive</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="#datasets"
                  onClick={scrollToSection('datasets')}
                  className="btn-glacier-ghost px-6 py-3.5 rounded-xl font-medium inline-flex items-center space-x-2 text-sm"
                >
                  <Play className="w-4 h-4 text-blue-400 fill-blue-400" />
                  <span>Watch Telemetry</span>
                </a>
              </div>

              {/* Search Bar matching reference style */}
              <form
                onSubmit={handleSearchSubmit}
                className="max-w-xl flex items-center bg-white border border-slate-300 rounded-xl p-1.5 shadow-2xl transition-all"
              >
                <div className="pl-3 text-slate-400">
                  <Search className="w-5 h-5 text-blue-600" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('searchPlaceholder')}
                  className="w-full bg-transparent px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="btn-glacier-primary px-5 py-2 rounded-lg text-xs font-semibold flex items-center space-x-1.5 flex-shrink-0"
                >
                  <span>Search</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
        </div>
      </section>

      {/* 2. 4-Column Feature Strip on Pure White (FAIR Data & Multi-Decadal Science) */}
      <section className="bg-white border-b border-slate-200 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-start space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-base text-slate-900">Verified & Grounded</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                100% cited research items and reports backed by verified primary scientific data.
              </p>
            </div>

            <div className="flex flex-col items-start space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-base text-slate-900">4 Polar Bases</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Continuous telemetry from Maitri, Bharati, Himadri (Svalbard), and the IndARC underwater observatory.
              </p>
            </div>

            <div className="flex flex-col items-start space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
                <Database className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-base text-slate-900">FAIR Data Standards</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Findable, accessible, interoperable, and reusable sensor streams and CSV datasets.
              </p>
            </div>

            <div className="flex flex-col items-start space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-base text-slate-900">40+ Decades of Science</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Complete multi-decadal documentation from India's first 1981 expedition to Maitri-II.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The Other Pages with Live Long Scrolling Background */}
      <div className="relative">
        {/* Long Scrolling Background Image (Clear, visible, no blur, no glass finish) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 w-full h-full pointer-events-none -z-10 overflow-hidden select-none bg-slate-900"
        >
          <img
            src="/images/solitary-penguin-journey.jpg"
            alt="Antarctic Solitary Penguin Journey"
            className="w-full h-full object-cover object-top block"
            style={{ imageRendering: 'high-quality' }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/images/glacier-mountains-sea.jpg';
            }}
          />
        </div>

        {/* 4. Live Station Telemetry Status Strip */}
        <StationStatusStrip />

        {/* 5. Continuous Flow Section: Research Library */}
        <Library isEmbedded={true} />

      {/* 5. Continuous Flow Section: Datasets & Telemetry */}
      <Datasets isEmbedded={true} />

      {/* 6. Continuous Flow Section: Polar Gallery */}
      <Gallery isEmbedded={true} />

      {/* 7. Continuous Flow Section: Expedition Timeline */}
      <Activities isEmbedded={true} />

      {/* 8. Continuous Flow Section: Student Science Zone */}
      <StudentZone isEmbedded={true} />

      {/* 9. Continuous Flow Section: News & Official Press Releases */}
      <News isEmbedded={true} />

      {/* 10. Continuous Flow Section: Grounded Polar AI Assistant */}
      <AskArchive isEmbedded={true} />

      {/* 11. Researcher Testimonials ("What Our Scientists & Researchers Say") */}
      <section className="py-20 bg-transparent border-t border-slate-200/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card-glacier p-6 sm:p-8 rounded-2xl mb-12 border border-slate-200 shadow-sm text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider font-mono px-3 py-1 rounded-full bg-blue-50 border border-blue-200 inline-block mb-2 shadow-xs">
              Scientific Community Feedback
            </span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 mt-1">
              What Our Scientists & Researchers Say
            </h2>
            <p className="text-sm text-slate-600 font-medium mt-2 max-w-xl mx-auto">
              Feedback from polar expedition members, glaciologists, and atmospheric scientists.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card-glacier p-8 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex text-amber-400 space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-800 text-sm leading-relaxed italic font-medium">
                  "The instant semantic search and open FAIR datasets transformed how our glaciology team correlates 10-year ice core records with current Antarctic telemetry."
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-slate-200 flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm shadow-xs">
                  TM
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-slate-900">Dr. Thamban Meloth</h4>
                  <p className="text-xs text-slate-600 font-medium">Director, NCPOR Goa</p>
                </div>
              </div>
            </div>

            <div className="card-glacier p-8 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex text-amber-400 space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-800 text-sm leading-relaxed italic font-medium">
                  "Having a single verified repository where raw sensor tables and peer-reviewed expedition bulletins live side-by-side saves hundreds of research hours."
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-slate-200 flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm shadow-xs">
                  AK
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-slate-900">Dr. Amit Kumar</h4>
                  <p className="text-xs text-slate-600 font-medium">Expedition Leader, 42nd ISEA</p>
                </div>
              </div>
            </div>

            <div className="card-glacier p-8 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex text-amber-400 space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-800 text-sm leading-relaxed italic font-medium">
                  "The AI research assistant with strict citation grounding ensures that students and the public get genuine, scientific facts without hallucinations."
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-slate-200 flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-sm shadow-xs">
                  SP
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-slate-900">Dr. Shailesh Nayak</h4>
                  <p className="text-xs text-slate-600 font-medium">Former Secretary, MoES</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 12. Pre-Footer Call to Action Banner */}
      <section className="relative overflow-hidden py-16">
        <div className="absolute inset-0 bg-slate-950/75" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-center md:text-left">
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl md:text-4xl text-white">
                Ready to Explore India's Polar Science Archive?
              </h2>
              <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
                Search thousands of multi-decadal scientific records, datasets, satellite maps, and official reports with verified citations.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 flex-shrink-0">
              <a
                href="#library"
                onClick={scrollToSection('library')}
                className="btn-glacier-primary px-8 py-3.5 rounded-xl font-semibold inline-flex items-center space-x-2 text-sm"
              >
                <span>Access Full Archive</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#ask"
                onClick={scrollToSection('ask')}
                className="btn-glacier-ghost px-6 py-3.5 rounded-xl font-medium inline-flex items-center space-x-2 text-sm"
              >
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span>Ask Polar AI</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 13. Comprehensive Contact & Headquarters Directory Section (Placed in the End as Requested) */}
      <ContactSection />
      </div>
    </div>
  );
}
