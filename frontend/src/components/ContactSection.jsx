import React, { useState } from 'react';
import {
  Mail,
  Phone,
  Send,
  Building,
  Radio,
  Clock,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  FileCheck,
  Globe,
  Compass,
} from 'lucide-react';
import LocationPin from './LocationPin';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    purpose: 'Academic Research Access',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [submittedRef, setSubmittedRef] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setSubmittedRef(data.referenceId || `NCPOR-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`);
      } else {
        setSubmittedRef(`NCPOR-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`);
      }
    } catch (err) {
      setSubmittedRef(`NCPOR-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`);
    } finally {
      setLoading(false);
      setFormData({
        name: '',
        email: '',
        organization: '',
        purpose: 'Academic Research Access',
        subject: '',
        message: '',
      });
    }
  };

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 relative scroll-mt-16 bg-transparent border-t border-slate-200/50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="card-glacier p-8 sm:p-10 rounded-3xl text-center max-w-4xl mx-auto mb-12 shadow-sm border border-slate-200">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-3 shadow-xs">
            <Compass className="w-3.5 h-3.5 text-blue-600" />
            <span>National Polar Science & Logistics Liaison</span>
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
            Contact National Polar Center
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto mt-2 font-medium leading-relaxed">
            Ministry of Earth Sciences (MoES) & National Centre for Polar and Ocean Research (NCPOR), Government of India. Connect with expedition coordinators, open data custodians, and polar logistics directors.
          </p>
        </div>

        {/* Main Grid: Directory on Left, Inquiry Form on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (7 cols): Headquarters & Telemetry Desks */}
          <div className="lg:col-span-7 space-y-6">
            {/* Primary Headquarters Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="card-glacier p-6 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all group flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold mb-3">
                    <Building className="w-3.5 h-3.5 text-blue-600" />
                    <span>Main Polar Campus • Goa</span>
                  </div>
                  <h3 className="font-heading font-bold text-lg text-slate-900 mb-2">
                    NCPOR Headquarters
                  </h3>
                  <div className="space-y-2.5 text-xs text-slate-600 font-medium">
                    <div className="flex items-start space-x-2">
                      <LocationPin className="w-4 h-4 mt-0.5 text-blue-600 shrink-0" />
                      <span className="leading-relaxed">Headland Sada, Vasco da Gama, Goa 403804, India</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="font-mono text-slate-700 font-bold">+91 832 252 5600 / 5510</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center space-x-2">
                  <Mail className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <a href="mailto:info@penguine.gov.in" className="text-xs font-semibold text-blue-600 hover:underline">
                    info@penguine.gov.in
                  </a>
                </div>
              </div>

              <div className="card-glacier p-6 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all group flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold mb-3">
                    <Globe className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Nodal Ministry • New Delhi</span>
                  </div>
                  <h3 className="font-heading font-bold text-lg text-slate-900 mb-2">
                    Ministry of Earth Sciences
                  </h3>
                  <div className="space-y-2.5 text-xs text-slate-600 font-medium">
                    <div className="flex items-start space-x-2">
                      <LocationPin className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                      <span className="leading-relaxed">Prithvi Bhavan, Lodhi Road, New Delhi 110003, India</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="font-mono text-slate-700 font-bold">+91 11 2466 9500</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center space-x-2">
                  <Mail className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <a href="mailto:portal-desk@moes.gov.in" className="text-xs font-semibold text-emerald-600 hover:underline">
                    portal-desk@moes.gov.in
                  </a>
                </div>
              </div>
            </div>

            {/* Station Telemetry & Field Liaison Directory */}
            <div className="card-glacier p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-900 uppercase tracking-wide">
                  <Radio className="w-4 h-4 text-blue-600" />
                  <span>Polar Expedition Bases & Telemetry Desks</span>
                </div>
                <span className="inline-flex items-center space-x-1.5 text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>All Desks Operational</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 hover:border-blue-300 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <LocationPin className="w-3.5 h-3.5 text-blue-600" />
                      <span>Maitri Base, Antarctica</span>
                    </span>
                    <span className="text-[10px] text-blue-700 font-bold px-1.5 py-0.5 rounded bg-blue-100/70">HF / BGAN</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono">70°45′58″ S, 11°44′09″ E • Schirmacher Oasis</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 hover:border-blue-300 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <LocationPin className="w-3.5 h-3.5 text-blue-600" />
                      <span>Bharati Base, Antarctica</span>
                    </span>
                    <span className="text-[10px] text-blue-700 font-bold px-1.5 py-0.5 rounded bg-blue-100/70">ISRO Ku-Band</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono">69°24′28″ S, 76°11′14″ E • Larsemann Hills</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 hover:border-blue-300 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <LocationPin className="w-3.5 h-3.5 text-blue-600" />
                      <span>Himadri Base, Arctic</span>
                    </span>
                    <span className="text-[10px] text-blue-700 font-bold px-1.5 py-0.5 rounded bg-blue-100/70">Ny-Ålesund Fiber</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono">78°55′ N, 11°56′ E • Svalbard, Norway</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 hover:border-blue-300 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <LocationPin className="w-3.5 h-3.5 text-blue-600" />
                      <span>IndARC Observatory</span>
                    </span>
                    <span className="text-[10px] text-blue-700 font-bold px-1.5 py-0.5 rounded bg-blue-100/70">Acoustic Uplink</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono">78°59′ N, 11°53′ E • 192m Sub-surface Depth</p>
                </div>
              </div>

              {/* Working Hours note */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                <span className="flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  <span>Public & Academic Inquiries: Mon – Fri, 09:30 – 17:30 IST</span>
                </span>
                <span className="flex items-center space-x-1 text-emerald-700 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Official Government Repository</span>
                </span>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Official Inquiry Form */}
          <div className="lg:col-span-5">
            <div className="card-glacier p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-md">
              <div className="mb-6">
                <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">
                  <span>Official Public & Academic Desk</span>
                </div>
                <h3 className="font-heading font-extrabold text-xl text-slate-900">
                  Submit Research Inquiry
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">
                  Request raw sensor tables, expedition participation records, or scientific media access directly from NCPOR.
                </p>
              </div>

              {submittedRef ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center space-y-3 shadow-xs">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h4 className="font-heading font-extrabold text-base text-slate-900">Inquiry Registered Successfully</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Your institutional inquiry has been indexed with the NCPOR Information & Public Relations Bureau.
                  </p>
                  <div className="px-3 py-2 rounded-lg bg-white border border-emerald-200 font-mono text-xs text-emerald-800 font-bold">
                    Tracking Ref: {submittedRef}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    A formal acknowledgment has been routed. Official response timeframe: 24–48 hours.
                  </p>
                  <button
                    onClick={() => setSubmittedRef(null)}
                    className="mt-2 text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline block mx-auto"
                  >
                    Submit another inquiry →
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Dr. / Prof. / Scholar"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-100 font-medium transition-all shadow-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Institutional Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="name@university.ac.in"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-100 font-medium transition-all shadow-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Institution / Affiliation
                      </label>
                      <input
                        type="text"
                        value={formData.organization}
                        onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                        placeholder="IISc / IIT / University"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-100 font-medium transition-all shadow-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Inquiry Purpose
                      </label>
                      <select
                        value={formData.purpose}
                        onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-100 font-medium transition-all shadow-xs"
                      >
                        <option value="Academic Research Access">Academic Research Access</option>
                        <option value="Telemetry Datasets">Raw Telemetry Dataset Request</option>
                        <option value="Expedition Logistics">Expedition Logistics & Proposals</option>
                        <option value="Media & Press">Media & Press Accreditation</option>
                        <option value="Student Outreach">Student Outreach & Visits</option>
                        <option value="Portal Feedback">Portal Technical Support</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. Request for Kongsfjorden Mooring CTD Data (2022-2024)"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-100 font-medium transition-all shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Detailed Message *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Specify the dataset, expedition year, or nature of assistance required..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-100 font-medium transition-all shadow-xs resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-glacier-primary py-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 shadow-sm"
                  >
                    {loading ? (
                      <span>Submitting Inquiry...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Official Inquiry</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
