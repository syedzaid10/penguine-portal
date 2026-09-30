import React from 'react';
import { Compass, ExternalLink, ShieldCheck, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import LocationPin from './LocationPin';

export default function Footer() {
  return (
    <footer className="bg-[#0B1320] border-t border-slate-800 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Col 1: Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2.5 text-white font-heading font-extrabold text-base tracking-wide">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Compass className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span>PENGUINE</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              National Polar Data Archive & Content Studio. Preserving India’s Antarctic, Arctic, and Southern Ocean expedition reports, datasets, and multimedia for global science and society.
            </p>
            <div className="flex items-center space-x-3 text-slate-400 pt-1">
              <span className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-colors cursor-pointer text-xs font-bold">f</span>
              <span className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-colors cursor-pointer text-xs font-bold">𝕏</span>
              <span className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-colors cursor-pointer text-xs font-bold">in</span>
              <span className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-colors cursor-pointer text-xs font-bold">▶</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-white mb-4 text-sm tracking-wide">Quick Links</h4>
            <ul className="space-y-2.5 text-slate-400">
              <li><Link to="/library" className="hover:text-blue-400 transition-colors">Research Library</Link></li>
              <li><Link to="/datasets" className="hover:text-blue-400 transition-colors">Sensor Datasets</Link></li>
              <li><Link to="/gallery" className="hover:text-blue-400 transition-colors">Photo & Video Gallery</Link></li>
              <li><Link to="/activities" className="hover:text-blue-400 transition-colors">Expedition Timeline</Link></li>
              <li><Link to="/news" className="hover:text-blue-400 transition-colors">News & Press Releases</Link></li>
              <li><Link to="/ask" className="hover:text-blue-400 transition-colors">Ask Archive Assistant</Link></li>
            </ul>
          </div>

          {/* Col 3: Information & Compliance */}
          <div>
            <h4 className="font-heading font-bold text-white mb-4 text-sm tracking-wide">Information</h4>
            <ul className="space-y-2.5 text-slate-400">
              <li><Link to="/student-zone" className="hover:text-blue-400 transition-colors">Student Explainer Academy</Link></li>
              <li><span className="text-slate-400">FAIR Open Data Compliance</span></li>
              <li><span className="text-slate-400">CF-1.8 NetCDF Standards</span></li>
              <li><span className="text-slate-400">Zero-Hallucination Grounding</span></li>
              <li><span className="text-slate-400">Ministry of Earth Sciences (MoES)</span></li>
              <li><span className="text-slate-400">NCPOR Guidelines</span></li>
            </ul>
          </div>

          {/* Col 4: Contact Us */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-white mb-4 text-sm tracking-wide">Contact Us</h4>
            <div className="space-y-2.5 text-slate-400 text-xs">
              <p className="flex items-start space-x-2">
                <LocationPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                <span>Headland Sada, Vasco da Gama, Goa 403804, India</span>
              </p>
              <p className="flex items-center space-x-2">
                <span className="text-blue-400 flex-shrink-0">📞</span>
                <span>+91 832 252 5600</span>
              </p>
              <p className="flex items-center space-x-2">
                <span className="text-blue-400 flex-shrink-0">✉️</span>
                <span>info@penguine.gov.in</span>
              </p>
            </div>
            <div className="pt-2">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Scientific Repository</span>
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row justify-between items-center text-slate-500 text-[11px]">
          <div>
            © 2026 Penguine. All rights reserved. Ministry of Earth Sciences.
          </div>
          <div className="mt-2 sm:mt-0 flex items-center space-x-4">
            <span className="text-slate-400">Open Government Data (OGD)</span>
            <span>•</span>
            <span className="text-slate-400">Rajbhasha English & Hindi</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
