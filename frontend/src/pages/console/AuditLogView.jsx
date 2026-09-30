import React, { useState, useEffect } from 'react';
import { FileText, Shield, Filter, Search, Clock, ArrowRight, RotateCcw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AuditLogView() {
  const { token, role } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchLogs = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (actionFilter !== 'all') params.set('action', actionFilter);
    if (searchQuery) params.set('q', searchQuery);

    fetch(`/api/audit-logs?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setLogs(data.data);
        }
      })
      .catch((err) => console.warn('Could not fetch audit logs:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLogs();
  }, [actionFilter, token]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchLogs();
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'STATUS_CHANGE':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'CONTENT_GENERATE':
        return 'bg-pink-50 text-pink-700 border-pink-200';
      case 'UPLOAD':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'USER_ROLE_CHANGE':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'DELETE':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  if (role !== 'admin') {
    return (
      <div className="p-8 text-center text-slate-500 font-mono text-xs">
        Administrator credentials required to view the repository audit trail.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <FileText className="w-6 h-6 text-blue-600" />
            <h2 className="font-heading font-bold text-lg text-slate-900">
              Immutable Repository Audit Trail
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Cryptographically logged records of every status transition, AI content generation, and staff action
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 shadow-sm transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5 text-blue-600" />
          <span>Refresh Trail</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search audit trail by user, document title, or comment..."
              className="w-full bg-white border border-slate-200 focus:border-blue-600 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none shadow-sm transition-all"
            />
          </div>
          <button
            type="submit"
            className="btn-glacier-primary px-4 py-2 rounded-xl text-xs font-semibold"
          >
            Filter
          </button>
        </form>

        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-700 focus:outline-none shadow-sm"
        >
          <option value="all">All Action Types</option>
          <option value="STATUS_CHANGE">STATUS_CHANGE</option>
          <option value="CONTENT_GENERATE">CONTENT_GENERATE</option>
          <option value="UPLOAD">UPLOAD</option>
          <option value="USER_ROLE_CHANGE">USER_ROLE_CHANGE</option>
          <option value="DELETE">DELETE</option>
        </select>
      </div>

      {/* Audit Log Table */}
      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card-glacier h-16 rounded-xl bg-slate-100"></div>
          ))}
        </div>
      ) : logs.length === 0 ? (
        <div className="card-glacier rounded-2xl p-12 text-center">
          <FileText className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="font-heading font-semibold text-slate-900">No audit records found</h3>
          <p className="text-xs text-slate-500 mt-1">Try resetting the action filter or query.</p>
        </div>
      ) : (
        <div className="card-glacier rounded-2xl overflow-hidden border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Timestamp (UTC)</th>
                  <th className="px-4 py-3">User & Role</th>
                  <th className="px-4 py-3">Action</th>
                  <th className="px-4 py-3">Target & Details</th>
                  <th className="px-4 py-3">Status Mutation</th>
                  <th className="px-4 py-3">Remark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900">{log.userName}</div>
                      <div className="text-[10px] text-slate-400 uppercase">{log.userRole}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getActionColor(
                          log.action
                        )}`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-slate-800 font-semibold line-clamp-1">
                        {log.targetTitle}
                      </div>
                      <div className="text-[10px] text-slate-500">{log.targetType}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {log.oldStatus && log.newStatus ? (
                        <div className="flex items-center space-x-1 text-[11px]">
                          <span className="text-slate-500">{log.oldStatus}</span>
                          <ArrowRight className="w-3 h-3 text-blue-600" />
                          <span className="text-emerald-600 font-semibold">{log.newStatus}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-600 max-w-xs truncate">
                      {log.comment || JSON.stringify(log.details) || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
