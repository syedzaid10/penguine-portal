import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Sparkles,
  Globe,
  Share2,
  Copy,
  Check,
  Send,
  Download,
  AlertCircle,
  FileText,
  MessageSquare,
  Camera,
  CheckCircle,
  Radio,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import SocialCardGenerator from '../../components/SocialCardGenerator';
import LocationPin from '../../components/LocationPin';

export default function ContentStudio() {
  const { token } = useAuth();
  const [searchParams] = useSearchParams();
  const preselectedItemId = searchParams.get('itemId');

  const [documents, setDocuments] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState(preselectedItemId || '');
  const [selectedDoc, setSelectedDoc] = useState(null);

  // Studio Generation Output State
  const [generatedData, setGeneratedData] = useState(null);
  const [activeLang, setActiveLang] = useState('en'); // 'en' or 'hi'
  const [activeChannel, setActiveChannel] = useState('x'); // 'website', 'press_release', 'x', 'linkedin', 'instagram'
  const [editedTexts, setEditedTexts] = useState({});
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [actionNotice, setActionNotice] = useState('');
  const [error, setError] = useState('');

  // Fetch documents for the selector
  useEffect(() => {
    fetch('/api/documents?status=all', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setDocuments(data.data);
          if (preselectedItemId) {
            const found = data.data.find((d) => d._id === preselectedItemId);
            if (found) {
              setSelectedDoc(found);
              setSelectedDocId(found._id);
            }
          } else if (data.data.length > 0) {
            setSelectedDoc(data.data[0]);
            setSelectedDocId(data.data[0]._id);
          }
        }
      })
      .catch((err) => console.warn('Could not fetch documents:', err));
  }, [preselectedItemId, token]);

  const handleSelectDoc = (id) => {
    setSelectedDocId(id);
    const found = documents.find((d) => d._id === id);
    setSelectedDoc(found || null);
    setGeneratedData(null);
    setEditedTexts({});
  };

  const handleGenerate = async () => {
    if (!selectedDocId) return;
    setLoading(true);
    setError('');
    setActionNotice('');

    try {
      const res = await fetch('/api/content-studio/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ itemId: selectedDocId }),
      });
      const data = await res.json();

      if (data.success) {
        setGeneratedData(data.data);
        // Pre-fill editable texts
        const initial = {
          'en-website': data.data.en.website,
          'en-press_release': data.data.en.press_release,
          'en-x': data.data.en.x,
          'en-linkedin': data.data.en.linkedin,
          'en-instagram': data.data.en.instagram,
          'hi-website': data.data.hi.website,
          'hi-press_release': data.data.hi.press_release,
          'hi-x': data.data.hi.x,
          'hi-linkedin': data.data.hi.linkedin,
          'hi-instagram': data.data.hi.instagram,
        };
        setEditedTexts(initial);
      } else {
        setError(data.message || 'Generation failed.');
      }
    } catch (err) {
      setError('Content generation failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const currentKey = `${activeLang}-${activeChannel}`;
  const currentText = editedTexts[currentKey] || '';

  const handleTextChange = (val) => {
    setEditedTexts((prev) => ({
      ...prev,
      [currentKey]: val,
    }));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Workflow Approve Action directly from Studio
  const handleApproveSource = async () => {
    if (!selectedDoc) return;
    try {
      const res = await fetch(`/api/documents/${selectedDoc._id}/transition`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          newStatus: 'Published',
          comment: `Approved by Editor via Content Studio with generated ${activeChannel.toUpperCase()} release`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActionNotice(`"${selectedDoc.title}" is now Officially Published on the Portal!`);
        setTimeout(() => setActionNotice(''), 4500);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Approval failed: ' + err.message);
    }
  };

  const channels = [
    { id: 'website', label: 'Website Blurb', icon: FileText },
    { id: 'press_release', label: 'Press Release', icon: Globe },
    { id: 'x', label: 'X (Twitter)', icon: MessageSquare },
    { id: 'linkedin', label: 'LinkedIn', icon: Share2 },
    { id: 'instagram', label: 'Instagram', icon: Camera },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 text-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-900">
              AI Content Studio
            </h1>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-1">
            One-click transformation of polar research into website, press, and social media releases (English & Hindi)
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 font-semibold">
            Zero-Hallucination Grounding
          </span>
        </div>
      </div>

      {actionNotice && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-mono flex items-center space-x-2 shadow-sm">
          <CheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-600" />
          <span>{actionNotice}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-mono flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Item Picker & Generation Trigger */}
      <div className="card-glacier p-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-8">
            <label className="block text-xs font-mono font-bold text-slate-700 mb-1.5">
              Select Source Research Item to Process:
            </label>
            <select
              value={selectedDocId}
              onChange={(e) => handleSelectDoc(e.target.value)}
              className="w-full bg-white border border-slate-300 focus:border-blue-600 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none shadow-sm"
            >
              {documents.map((doc) => (
                <option key={doc._id} value={doc._id}>
                  [{doc.station} • {doc.year}] {doc.title} ({doc.status})
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-4 flex items-center gap-2">
            <button
              onClick={handleGenerate}
              disabled={loading || !selectedDocId}
              className="w-full btn-glacier-primary py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? 'Synthesizing Content...' : 'Generate Content Studio'}</span>
            </button>
          </div>
        </div>

        {selectedDoc && (
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-mono text-slate-500 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-1.5">
              <LocationPin className="w-3.5 h-3.5" />
              <span>Station: <strong className="text-slate-800">{selectedDoc.station}</strong></span>
            </span>
            <span>Type: <strong className="text-slate-800">{selectedDoc.type}</strong></span>
            <span>Year: <strong className="text-slate-800">{selectedDoc.year}</strong></span>
            <span>Workflow Status: <strong className="text-blue-600">{selectedDoc.status}</strong></span>
          </div>
        )}
      </div>

      {/* Generated Content Studio Workspace */}
      {generatedData && (
        <div className="card-glacier p-6 sm:p-8 space-y-6">
          {/* Top Controls: Channel Tabs + Language Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            {/* Channel Tabs */}
            <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-mono">
              {channels.map((ch) => {
                const Icon = ch.icon;
                const isSelected = activeChannel === ch.id;
                return (
                  <button
                    key={ch.id}
                    onClick={() => setActiveChannel(ch.id)}
                    className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg transition-all font-semibold ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{ch.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Language Toggle */}
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-mono">
              <button
                onClick={() => setActiveLang('en')}
                className={`px-3 py-1 rounded-lg transition-colors font-semibold ${
                  activeLang === 'en'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setActiveLang('hi')}
                className={`px-3 py-1 rounded-lg transition-colors font-semibold ${
                  activeLang === 'hi'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                हिन्दी (Hindi)
              </button>
            </div>
          </div>

          {/* Active Content Editor Box */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-700 font-bold">
                Generated Text ({activeChannel.toUpperCase()} - {activeLang.toUpperCase()}):
              </span>

              {/* Character Counter for Twitter/X */}
              {activeChannel === 'x' && (
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    currentText.length <= 280
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  {currentText.length} / 280 Characters
                </span>
              )}
            </div>

            <textarea
              rows={8}
              value={currentText}
              onChange={(e) => handleTextChange(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 focus:border-blue-600 rounded-2xl p-4 text-xs sm:text-sm text-slate-800 font-sans leading-relaxed focus:outline-none shadow-sm"
            />
          </div>

          {/* Actions Bar: Copy, Social Card Generator (.PNG), Approve Source */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopy}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-mono font-semibold transition-all shadow-sm"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Text</span>
                  </>
                )}
              </button>

              {/* HTML5 Canvas Social Card Generator */}
              <SocialCardGenerator
                title={selectedDoc?.title}
                text={currentText}
                station={selectedDoc?.station}
                channel={activeChannel}
                language={activeLang}
              />
            </div>

            {/* Direct Workflow Transition / Approval */}
            <div className="flex items-center space-x-3">
              <button
                onClick={handleApproveSource}
                className="btn-glacier-primary px-6 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Approve & Publish Item to Archive</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
