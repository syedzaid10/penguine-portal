import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  Send,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import LocationPin from '../../components/LocationPin';

export default function MySubmissions() {
  const { token, user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState('');

  const fetchSubmissions = () => {
    setLoading(true);
    fetch('/api/documents?mySubmissions=true&status=all', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setItems(data.data);
        }
      })
      .catch((err) => console.warn('Could not fetch submissions:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSubmissions();
  }, [token]);

  const handleSubmitForReview = async (id, title) => {
    try {
      const res = await fetch(`/api/documents/${id}/transition`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          newStatus: 'In review',
          comment: 'Submitted for editorial review',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage(`"${title}" successfully transitioned to 'In review'!`);
        fetchSubmissions();
        setTimeout(() => setActionMessage(''), 3500);
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Error transitioning status: ' + err.message);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Published':
        return (
          <span className="flex items-center space-x-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-bold">
            <CheckCircle className="w-3 h-3" />
            <span>Published</span>
          </span>
        );
      case 'In review':
        return (
          <span className="flex items-center space-x-1 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-mono font-bold">
            <Clock className="w-3 h-3" />
            <span>In review</span>
          </span>
        );
      case 'Rejected':
        return (
          <span className="flex items-center space-x-1 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-mono font-bold">
            <XCircle className="w-3 h-3" />
            <span>Rejected</span>
          </span>
        );
      default:
        return (
          <span className="flex items-center space-x-1 px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-mono font-bold">
            <AlertCircle className="w-3 h-3" />
            <span>Draft</span>
          </span>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 text-slate-900">
      <div className="flex items-center justify-between pb-5 border-b border-slate-200">
        <div>
          <h2 className="font-heading font-bold text-lg sm:text-xl text-slate-900">My Research Submissions</h2>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Track status progression through the certified editorial workflow
          </p>
        </div>

        <Link
          to="/console/upload"
          className="btn-glacier-primary px-5 py-2.5 rounded-xl text-xs font-semibold"
        >
          + Upload New Item
        </Link>
      </div>

      {actionMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-mono flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 flex-shrink-0 text-emerald-600" />
          <span>{actionMessage}</span>
        </div>
      )}

      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card-glacier h-24 bg-slate-100"></div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="card-glacier rounded-2xl p-12 text-center">
          <Layers className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="font-heading font-bold text-slate-900">No items found</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            You haven't uploaded any documents or datasets yet.
          </p>
          <Link
            to="/console/upload"
            className="btn-glacier-primary px-5 py-2.5 rounded-xl text-xs font-semibold inline-block"
          >
            Upload Your First Item
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item._id}
              className="card-glacier p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  {getStatusBadge(item.status)}
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-semibold inline-flex items-center gap-1">
                    <LocationPin className="w-3 h-3" />
                    <span>{item.station}</span>
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 uppercase font-medium">
                    {item.type}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{item.year}</span>
                </div>

                <h3 className="font-heading font-bold text-base text-slate-900">{item.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-1">{item.summary}</p>

                {item.reviewComment && (
                  <div className="text-[11px] font-mono text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                    <span className="font-bold">Editor Remark: </span>
                    {item.reviewComment}
                  </div>
                )}
              </div>

              {/* Status Actions */}
              <div className="flex items-center space-x-2 flex-shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                {item.status === 'Draft' && (
                  <button
                    onClick={() => handleSubmitForReview(item._id, item.title)}
                    className="btn-glacier-primary px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit for Review</span>
                  </button>
                )}

                {item.status === 'Rejected' && (
                  <button
                    onClick={() => handleSubmitForReview(item._id, item.title)}
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Re-submit for Review</span>
                  </button>
                )}

                <Link
                  to={`/library?q=${encodeURIComponent(item.title)}`}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                >
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
