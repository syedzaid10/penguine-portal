import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserCheck,
  Check,
  X,
  Sparkles,
  AlertCircle,
  FileText,
  Clock,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import LocationPin from '../../components/LocationPin';

export default function ReviewQueue() {
  const { token, role } = useAuth();
  const navigate = useNavigate();

  const [pendingItems, setPendingItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [reviewRemark, setReviewRemark] = useState('');
  const [actionError, setActionError] = useState('');

  const fetchPending = () => {
    setLoading(true);
    fetch('/api/documents?status=In review', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPendingItems(data.data);
          if (data.data.length > 0) {
            setSelectedItem(data.data[0]);
          } else {
            setSelectedItem(null);
          }
        }
      })
      .catch((err) => console.warn('Could not fetch queue:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPending();
  }, [token]);

  const handleDecision = async (newStatus) => {
    if (!selectedItem) return;
    setActionError('');

    if (newStatus === 'Rejected' && !reviewRemark.trim()) {
      setActionError('A review comment is required when rejecting a submission.');
      return;
    }

    try {
      const res = await fetch(`/api/documents/${selectedItem._id}/transition`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          newStatus,
          comment: reviewRemark.trim() || 'Approved by editorial desk',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setReviewRemark('');
        fetchPending();
      } else {
        setActionError(data.message);
      }
    } catch (err) {
      setActionError('Workflow transition failed: ' + err.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 text-slate-900">
      <div className="flex items-center justify-between pb-5 border-b border-slate-200">
        <div>
          <h2 className="font-heading font-bold text-lg sm:text-xl text-slate-900">Editorial Review Queue</h2>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Review submitted polar research documents before making them public in the archive
          </p>
        </div>
        <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-mono font-bold">
          {pendingItems.length} Submissions Pending
        </span>
      </div>

      {actionError && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-mono flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-pulse">
          <div className="md:col-span-5 h-72 card-glacier bg-slate-100"></div>
          <div className="md:col-span-7 h-72 card-glacier bg-slate-100"></div>
        </div>
      ) : pendingItems.length === 0 ? (
        <div className="card-glacier rounded-2xl p-12 text-center max-w-md mx-auto my-8">
          <Check className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
          <h3 className="font-heading font-bold text-lg text-slate-900">Queue is Clear!</h3>
          <p className="text-xs text-slate-500 mt-1">
            All submitted research reports and datasets have been reviewed.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column: Pending List */}
          <div className="md:col-span-5 space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase text-slate-500 mb-2">
              Pending Submissions ({pendingItems.length})
            </h3>
            {pendingItems.map((item) => {
              const isSelected = selectedItem?._id === item._id;
              return (
                <div
                  key={item._id}
                  onClick={() => setSelectedItem(item)}
                  className={`p-4 rounded-2xl cursor-pointer border transition-all ${
                    isSelected
                      ? 'bg-blue-50/70 border-blue-500 shadow-md ring-1 ring-blue-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono mb-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-semibold border border-blue-200 inline-flex items-center gap-1">
                      <LocationPin className="w-3 h-3" />
                      <span>{item.station}</span>
                    </span>
                    <span className="text-slate-400 font-medium">{item.year}</span>
                  </div>
                  <h4 className="font-heading font-bold text-xs text-slate-900 line-clamp-2 mb-1">
                    {item.title}
                  </h4>
                  <div className="text-[10px] text-slate-500 font-mono">
                    By: {item.authorName || item.createdBy?.name || 'Researcher'}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Active Item Review & Decision Panel */}
          {selectedItem && (
            <div className="md:col-span-7 space-y-4">
              <div className="card-glacier p-6 sm:p-8 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-2 text-xs font-mono">
                    <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-bold">
                      In review
                    </span>
                    <span className="text-slate-600 font-medium">{selectedItem.station}</span>
                    <span className="text-slate-400">• {selectedItem.year}</span>
                  </div>

                  {/* Open in Content Studio */}
                  <button
                    onClick={() => navigate(`/console/content-studio?itemId=${selectedItem._id}`)}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 text-xs font-mono font-semibold transition-all shadow-sm"
                    title="Generate press release and social posts before publishing"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                    <span>Open in Content Studio</span>
                  </button>
                </div>

                <h3 className="font-heading font-bold text-lg text-slate-900">
                  {selectedItem.title}
                </h3>

                <div className="text-xs font-mono text-slate-500">
                  Principal Investigator:{' '}
                  <span className="text-slate-800 font-semibold">{selectedItem.authorName}</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed font-sans">
                  {selectedItem.summary}
                </div>

                {selectedItem.extractedText && (
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200 max-h-36 overflow-y-auto leading-relaxed">
                    <div className="text-[10px] text-blue-300 uppercase mb-1 font-bold">
                      Indexed Text Preview:
                    </div>
                    {selectedItem.extractedText}
                  </div>
                )}

                {/* Review Remark Input */}
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-700 mb-1.5">
                    Editorial Remark (Required for rejection, optional for approval)
                  </label>
                  <textarea
                    rows={2}
                    value={reviewRemark}
                    onChange={(e) => setReviewRemark(e.target.value)}
                    placeholder="e.g. Verified glaciological radar profiles and metadata. Approved for national publication."
                    className="w-full bg-white border border-slate-300 focus:border-blue-600 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 font-mono shadow-sm"
                  />
                </div>

                {/* Decision Action Buttons */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <button
                    onClick={() => handleDecision('Rejected')}
                    className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 text-xs font-mono font-semibold flex items-center space-x-1.5 transition-all shadow-sm"
                  >
                    <X className="w-4 h-4" />
                    <span>Reject with Comment</span>
                  </button>

                  <button
                    onClick={() => handleDecision('Published')}
                    className="btn-glacier-primary px-6 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Approve & Publish to Archive</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
