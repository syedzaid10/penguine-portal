import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UploadCloud,
  FileText,
  Database,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function UploadForm() {
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [contentType, setContentType] = useState('report'); // 'report', 'dataset', 'media'
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [station, setStation] = useState('Maitri');
  const [year, setYear] = useState(new Date().getFullYear());
  const [topicTags, setTopicTags] = useState('Glaciology, Polar Research');
  const [authorName, setAuthorName] = useState(user?.name || '');
  const [extractedTextInput, setExtractedTextInput] = useState('');

  // Dataset specific
  const [instrument, setInstrument] = useState('');
  const [units, setUnits] = useState('');

  // Status & Feedback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successItem, setSuccessItem] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('summary', summary);
      formData.append('station', station);
      formData.append('year', year);
      formData.append('topicTags', topicTags);
      formData.append('authorName', authorName);

      if (file) {
        formData.append('file', file);
      }

      let endpoint = '/api/documents';
      if (contentType === 'dataset') {
        endpoint = '/api/datasets';
        formData.append('instrument', instrument || 'Automated Sensor Suite');
        formData.append('units', units || 'Standard Units');
      } else if (contentType === 'media') {
        endpoint = '/api/media';
        formData.append('caption', summary);
        formData.append('credit', authorName || 'NCPOR / MoES');
        formData.append('type', file?.type.startsWith('video') ? 'video' : 'photo');
      } else {
        formData.append('type', contentType);
        if (extractedTextInput) {
          formData.append('extractedTextInput', extractedTextInput);
        }
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setSuccessItem(data.data);
      } else {
        setError(data.message || 'Failed to upload item.');
      }
    } catch (err) {
      setError('Upload failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 1-Click Submit for Review
  const handleSubmitForReview = async (itemId) => {
    try {
      const res = await fetch(`/api/documents/${itemId}/transition`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          newStatus: 'In review',
          comment: 'Submitted for editorial validation by scientist',
        }),
      });
      const data = await res.json();
      if (data.success) {
        navigate('/console/my-submissions');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Status transition error: ' + err.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto text-slate-900">
      {/* Success Notification Banner */}
      {successItem ? (
        <div className="card-glacier rounded-2xl p-8 border border-emerald-300 text-center space-y-4 my-8">
          <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-500 flex items-center justify-center mx-auto text-emerald-600">
            <CheckCircle className="w-6 h-6" />
          </div>

          <h2 className="font-heading font-bold text-xl text-slate-900">
            Item Uploaded Successfully as Draft!
          </h2>
          <p className="text-xs text-slate-600 font-mono max-w-md mx-auto">
            "{successItem.title}" has been saved. It is currently in{' '}
            <span className="text-amber-600 font-bold">Draft</span> status and is not yet public.
          </p>

          <div className="flex flex-wrap justify-center gap-3 pt-4">
            <button
              onClick={() => handleSubmitForReview(successItem._id)}
              className="btn-glacier-primary px-6 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Submit for Editor Review Now →</span>
            </button>
            <button
              onClick={() => navigate('/console/my-submissions')}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
            >
              Go to My Submissions
            </button>
          </div>
        </div>
      ) : (
        <div className="card-glacier p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 gap-4 mb-6">
            <div>
              <h2 className="font-heading font-bold text-lg text-slate-900">Upload New Polar Archive Item</h2>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Ingest PDF research reports, telemetry CSVs, or multimedia records
              </p>
            </div>

            {/* Type selector tabs */}
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-mono">
              <button
                type="button"
                onClick={() => setContentType('report')}
                className={`px-3.5 py-1.5 rounded-lg transition-all font-semibold ${
                  contentType === 'report' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Report/PDF
              </button>
              <button
                type="button"
                onClick={() => setContentType('dataset')}
                className={`px-3.5 py-1.5 rounded-lg transition-all font-semibold ${
                  contentType === 'dataset' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                CSV Dataset
              </button>
              <button
                type="button"
                onClick={() => setContentType('media')}
                className={`px-3.5 py-1.5 rounded-lg transition-all font-semibold ${
                  contentType === 'media' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Photo/Video
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-mono flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-mono font-bold text-slate-700 mb-1.5">
                Item Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 51st Antarctic Glaciology Survey: Schirmacher Glacier Ablation"
                className="w-full bg-white border border-slate-300 focus:border-blue-600 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none shadow-sm"
              />
            </div>

            {/* Summary */}
            <div>
              <label className="block text-xs font-mono font-bold text-slate-700 mb-1.5">
                Executive Abstract / Summary <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Comprehensive summary of methodology, instruments, and observed results..."
                className="w-full bg-white border border-slate-300 focus:border-blue-600 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none shadow-sm"
              />
            </div>

            {/* Station & Year */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 mb-1.5">Station / Sector</label>
                <select
                  value={station}
                  onChange={(e) => setStation(e.target.value)}
                  className="w-full bg-white border border-slate-300 focus:border-blue-600 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none shadow-sm"
                >
                  <option value="Maitri">Maitri Station (Antarctica)</option>
                  <option value="Bharati">Bharati Station (Antarctica)</option>
                  <option value="Himadri">Himadri Base (Svalbard Arctic)</option>
                  <option value="IndARC">IndARC Subsurface Mooring</option>
                  <option value="Southern Ocean">Southern Ocean</option>
                  <option value="Dakshin Gangotri">Dakshin Gangotri</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 mb-1.5">Expedition Year</label>
                <input
                  type="number"
                  required
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full bg-white border border-slate-300 focus:border-blue-600 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none shadow-sm"
                />
              </div>
            </div>

            {/* Topic Tags & Author */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 mb-1.5">Topic Tags (comma-separated)</label>
                <input
                  type="text"
                  value={topicTags}
                  onChange={(e) => setTopicTags(e.target.value)}
                  placeholder="Glaciology, Mass Balance, Radar Sounding"
                  className="w-full bg-white border border-slate-300 focus:border-blue-600 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 mb-1.5">Author / Investigator</label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Dr. Ananya Sen, NCPOR Cryosphere Division"
                  className="w-full bg-white border border-slate-300 focus:border-blue-600 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none shadow-sm"
                />
              </div>
            </div>

            {/* Dataset Specific Fields */}
            {contentType === 'dataset' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-blue-50/60 border border-blue-200">
                <div>
                  <label className="block text-[11px] font-mono text-blue-900 font-bold mb-1">Sensor Instrument</label>
                  <input
                    type="text"
                    value={instrument}
                    onChange={(e) => setInstrument(e.target.value)}
                    placeholder="e.g. Vaisala AWS / SeaBird CTD"
                    className="w-full bg-white border border-blue-200 rounded-lg p-2 text-xs text-slate-900 shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-blue-900 font-bold mb-1">Measurement Units</label>
                  <input
                    type="text"
                    value={units}
                    onChange={(e) => setUnits(e.target.value)}
                    placeholder="Temperature (°C), Wind (kts)"
                    className="w-full bg-white border border-blue-200 rounded-lg p-2 text-xs text-slate-900 shadow-sm"
                  />
                </div>
              </div>
            )}

            {/* Optional Extracted Text (Direct paste or OCR backup) */}
            {contentType === 'report' && (
              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 mb-1.5">
                  Report Text Content (Direct input or auto-extracted from attached file)
                </label>
                <textarea
                  rows={4}
                  value={extractedTextInput}
                  onChange={(e) => setExtractedTextInput(e.target.value)}
                  placeholder="Paste research text here if uploading without a PDF file..."
                  className="w-full bg-white border border-slate-300 focus:border-blue-600 rounded-xl p-2.5 text-xs text-slate-900 font-mono shadow-sm"
                />
              </div>
            )}

            {/* File Upload Area */}
            <div>
              <label className="block text-xs font-mono font-bold text-slate-700 mb-1.5">
                Attach File ({contentType === 'dataset' ? 'CSV' : contentType === 'media' ? 'Image/Video' : 'PDF/Text'})
              </label>
              <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-6 text-center transition-colors bg-slate-50/60 hover:bg-blue-50/20">
                <input
                  type="file"
                  id="file-upload"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                  <UploadCloud className="w-8 h-8 text-blue-600 mb-2 animate-bounce" />
                  <span className="text-xs font-mono text-slate-800 font-bold">
                    {file ? file.name : 'Click to select or drag and drop file'}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 mt-1">
                    {file ? `${(file.size / 1024).toFixed(1)} KB` : 'Maximum size 25MB'}
                  </span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="btn-glacier-primary px-7 py-3 rounded-xl text-xs font-semibold flex items-center space-x-1.5 disabled:opacity-50"
              >
                <span>{loading ? 'Processing & Indexing Chunks...' : 'Save Draft Item'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
