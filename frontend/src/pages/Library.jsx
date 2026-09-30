import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  BookOpen,
  Download,
  Calendar,
  Tag,
  Zap,
  FileText,
  Copy,
  Check,
  X,
  ChevronRight,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import LocationPin from '../components/LocationPin';

export default function Library({ isEmbedded = false }) {
  const { t } = useLanguage();
  const { role } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  // State
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [queryDuration, setQueryDuration] = useState(0);

  // Filters
  const [q, setQ] = useState(searchParams.get('q') || '');
  const [station, setStation] = useState(searchParams.get('station') || 'all');
  const [type, setType] = useState(searchParams.get('type') || 'all');
  const [topic, setTopic] = useState('all');
  const [year, setYear] = useState('all');
  const [status, setStatus] = useState('Published');

  // Modal
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [copiedCitation, setCopiedCitation] = useState(false);

  // Fetch documents
  const fetchDocuments = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (station && station !== 'all') params.set('station', station);
    if (type && type !== 'all') params.set('type', type);
    if (topic && topic !== 'all') params.set('topic', topic);
    if (year && year !== 'all') params.set('year', year);
    if (status && status !== 'all') params.set('status', status);

    fetch(`/api/documents?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setDocuments(data.data);
          setQueryDuration(data.queryDurationMs || 0);
        }
      })
      .catch((err) => console.warn('Fetch error:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDocuments();
  }, [station, type, topic, year, status]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDocuments();
  };

  const handleCopyCitation = (doc) => {
    const citation = `${doc.authorName || 'NCPOR Scientific Team'} (${doc.year}). "${doc.title}". National Polar Data Archive, Station: ${doc.station}. Permanent URI: https://penguine.gov.in/archive/${doc._id}`;
    navigator.clipboard.writeText(citation);
    setCopiedCitation(true);
    setTimeout(() => setCopiedCitation(false), 2500);
  };

  const handleDownload = (doc) => {
    // Generate text blob for download if no local file exists
    const blob = new Blob(
      [
        `PENGUINE - OFFICIAL RESEARCH RECORD\n=======================================================\nTITLE: ${doc.title}\nAUTHOR: ${doc.authorName}\nSTATION: ${doc.station}\nYEAR: ${doc.year}\nTYPE: ${doc.type}\nTOPICS: ${doc.topicTags?.join(', ')}\n\nABSTRACT & SUMMARY:\n${doc.summary}\n\nEXTRACTED ARCHIVE TEXT:\n${doc.extractedText || 'No additional raw text attached.'}\n\n=======================================================\nNATIONAL CENTRE FOR POLAR AND OCEAN RESEARCH (NCPOR)\nMINISTRY OF EARTH SCIENCES, GOVT OF INDIA`,
      ],
      { type: 'text/plain;charset=utf-8' }
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${doc.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const ContainerTag = isEmbedded ? 'section' : 'div';

  return (
    <ContainerTag
      id={isEmbedded ? 'library' : undefined}
      className={
        isEmbedded
          ? 'py-20 px-4 sm:px-6 lg:px-8 bg-transparent border-t border-slate-200/40 scroll-mt-16'
          : 'min-h-screen bg-transparent py-10 px-4 sm:px-6 lg:px-8 text-slate-900'
      }
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header Banner */}
        <div className="card-glacier p-6 sm:p-8 rounded-2xl mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 border border-slate-200 shadow-sm">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              <span>National Polar Literature & Expedition Repository</span>
            </div>
            <div className="flex items-center space-x-3">
              {!isEmbedded && (
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-xs">
                  <BookOpen className="w-5 h-5" />
                </div>
              )}
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-slate-900 tracking-tight">
                {isEmbedded ? (
                  <>Polar Research Document Library</>
                ) : (
                  t('navLibrary')
                )}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-2xl leading-relaxed">
              Search peer-reviewed research papers, official expedition reports, and scientific datasets across India's Antarctic, Arctic, and Southern Ocean missions.
            </p>
          </div>

          {/* Latency and Count badges */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs shrink-0">
            <span className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold shadow-xs">
              <Zap className="w-3.5 h-3.5 text-emerald-600" />
              <span>Query: {queryDuration}ms</span>
            </span>
            <span className="px-3 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 font-bold shadow-xs">
              {documents.length} Records Indexed
            </span>
          </div>
        </div>

        {/* Search & Filter Bay */}
        <div className="card-glacier p-5 sm:p-6 rounded-2xl mb-8 border border-slate-200 shadow-sm space-y-4">
          <form onSubmit={handleSearchSubmit} className="flex gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by keywords, author, ice core, mooring, glaciology..."
                className="w-full bg-white border border-slate-300 focus:border-blue-500 focus:ring-3 focus:ring-blue-100 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none transition-all shadow-xs"
              />
            </div>
            <button
              type="submit"
              className="btn-glacier-primary px-6 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2"
            >
              <span>Search Library</span>
            </button>
          </form>

          {/* Facet Filter Dropdowns */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 text-xs">
            {/* Station */}
            <div>
              <label className="text-xs text-slate-700 font-semibold block mb-1">Station Base</label>
              <select
                value={station}
                onChange={(e) => setStation(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-xs"
              >
                <option value="all">All Stations</option>
                <option value="Maitri">Maitri Station</option>
                <option value="Bharati">Bharati Station</option>
                <option value="Himadri">Himadri Base</option>
                <option value="IndARC">IndARC Mooring</option>
                <option value="Dakshin Gangotri">Dakshin Gangotri</option>
                <option value="Southern Ocean">Southern Ocean</option>
              </select>
            </div>

            {/* Type */}
            <div>
              <label className="text-xs text-slate-700 font-semibold block mb-1">Content Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-xs"
              >
                <option value="all">All Types</option>
                <option value="report">Expedition Report</option>
                <option value="publication">Journal Publication</option>
                <option value="dataset">Telemetry Dataset</option>
              </select>
            </div>

            {/* Topic Tag */}
            <div>
              <label className="text-xs text-slate-700 font-semibold block mb-1">Topic Field</label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-xs"
              >
                <option value="all">All Topics</option>
                <option value="Glaciology">Glaciology</option>
                <option value="Atmospheric Science">Atmospheric Science</option>
                <option value="Oceanography">Oceanography</option>
                <option value="Geophysics">Geophysics</option>
                <option value="Space Weather">Space Weather</option>
                <option value="Microbiology">Microbiology</option>
                <option value="Ice Core">Ice Core</option>
              </select>
            </div>

            {/* Year */}
            <div>
              <label className="text-xs text-slate-700 font-semibold block mb-1">Expedition Year</label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-xs"
              >
                <option value="all">All Years</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
                <option value="2020">2020</option>
                <option value="2019">2019</option>
                <option value="1990">1990 (Historical)</option>
              </select>
            </div>

            {/* Workflow Status Filter (For staff) */}
            {role !== 'public' && (
              <div>
                <label className="text-[11px] text-cyan-300 font-bold uppercase block mb-1.5">
                  Workflow Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl p-2.5 text-cyan-100 font-bold focus:outline-none focus:border-cyan-400 shadow-sm"
                >
                  <option value="all">All Statuses</option>
                  <option value="Published">Published</option>
                  <option value="In review">In review</option>
                  <option value="Draft">Draft</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="card-glacier h-52 p-5 bg-slate-100"></div>
            ))}
          </div>
        ) : documents.length === 0 ? (
          <div className="card-glacier rounded-2xl p-12 text-center max-w-lg mx-auto my-12">
            <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="font-heading font-bold text-lg text-slate-900 mb-2">No archive items matched</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Try adjusting your search keywords or resetting the facet filters above.
            </p>
            <button
              onClick={() => {
                setQ('');
                setStation('all');
                setType('all');
                setTopic('all');
                setYear('all');
                setStatus('Published');
              }}
              className="px-5 py-2.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc) => (
              <div
                key={doc._id}
                className="card-glacier p-6 flex flex-col justify-between group hover:border-blue-300"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between text-[11px] font-mono mb-3">
                    <span className="px-2.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-semibold inline-flex items-center gap-1.5">
                      <LocationPin className="w-3.5 h-3.5" />
                      <span>{doc.station}</span>
                    </span>
                    <div className="flex items-center space-x-1.5 font-mono text-xs">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 uppercase font-bold text-[10px] border border-slate-200">
                        {doc.type}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 font-bold text-[11px] border border-blue-100">{doc.year}</span>
                    </div>
                  </div>

                  <h3 className="font-heading font-extrabold text-base text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2 leading-snug">
                    {doc.title}
                  </h3>

                  <p className="text-xs text-slate-700 font-medium line-clamp-3 leading-relaxed mb-4">
                    {doc.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200/80">
                  <div className="flex flex-wrap gap-1.5 mb-3.5">
                    {doc.topicTags?.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50/80 text-blue-800 font-semibold border border-blue-100"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-mono font-bold text-slate-700 truncate max-w-[150px]">
                      {doc.authorName}
                    </span>
                    <button
                      onClick={() => setSelectedDoc(doc)}
                      className="px-3.5 py-1.5 rounded-xl btn-glacier-primary text-xs font-bold transition-all shadow-sm"
                    >
                      View Record →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Document Detail Modal with Citations & Download */}
        {selectedDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80">
            <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative border border-slate-200 shadow-2xl text-slate-900">
              {/* Close Button */}
              <button
                onClick={() => setSelectedDoc(null)}
                className="absolute top-5 right-5 p-2 rounded-lg bg-slate-100 text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Station & Status Strip */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono mb-3">
                <span className="px-2.5 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200 font-semibold inline-flex items-center gap-1.5">
                  <LocationPin className="w-3.5 h-3.5" />
                  <span>{selectedDoc.station}</span>
                </span>
                <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200 uppercase font-medium">
                  {selectedDoc.type}
                </span>
                <span className="px-2.5 py-1 rounded bg-purple-50 text-purple-700 border border-purple-200 font-medium">
                  Year {selectedDoc.year}
                </span>
                <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                  Status: {selectedDoc.status}
                </span>
              </div>

              {/* Document Title */}
              <h2 className="font-heading font-bold text-xl sm:text-2xl text-slate-900 mb-2 leading-tight">
                {selectedDoc.title}
              </h2>
              <div className="text-xs font-mono text-slate-500 mb-6">
                Investigator / Desk: <span className="text-slate-800 font-semibold">{selectedDoc.authorName}</span>
              </div>

              {/* Executive Abstract */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 mb-6">
                <h4 className="font-heading font-bold text-xs text-blue-700 uppercase font-mono tracking-wider mb-2">
                  Executive Summary / Abstract
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {selectedDoc.summary}
                </p>
              </div>

              {/* Extracted Scientific Text Preview */}
              {selectedDoc.extractedText && (
                <div className="bg-slate-900 text-slate-100 rounded-xl p-4 border border-slate-800 mb-6">
                  <h4 className="font-heading font-semibold text-xs text-blue-300 uppercase font-mono tracking-wider mb-2">
                    Extracted Research Text (OCR & RAG Chunks)
                  </h4>
                  <div className="text-xs text-slate-300 font-mono max-h-48 overflow-y-auto leading-relaxed whitespace-pre-wrap">
                    {selectedDoc.extractedText}
                  </div>
                </div>
              )}

              {/* Topic Tags */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                {selectedDoc.topicTags?.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-mono px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Verified Citation Box */}
              <div className="bg-blue-50/60 rounded-xl p-4 border border-blue-200 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-blue-900 font-bold uppercase">
                    Official Bibliographic Citation
                  </span>
                  <button
                    onClick={() => handleCopyCitation(selectedDoc)}
                    className="flex items-center space-x-1 text-xs font-mono text-blue-700 font-bold hover:underline"
                  >
                    {copiedCitation ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Citation</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="text-xs font-mono text-slate-800 bg-white p-3 rounded-lg border border-blue-200 leading-relaxed">
                  {selectedDoc.authorName} ({selectedDoc.year}). "{selectedDoc.title}". National Polar Data Archive, Station: {selectedDoc.station}.
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200">
                <button
                  onClick={() => handleDownload(selectedDoc)}
                  className="btn-glacier-primary px-6 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Archive Report (.txt / PDF)</span>
                </button>

                <button
                  onClick={() => setSelectedDoc(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                >
                  Close Record
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ContainerTag>
  );
}
