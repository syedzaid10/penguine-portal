import React, { useState, useEffect } from 'react';
import { Users, Shield, CheckCircle, AlertCircle, UserCheck, Clock, XCircle, UserPlus, Filter } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function UserManagement() {
  const { token, role } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [processingId, setProcessingId] = useState(null);

  const fetchUsers = () => {
    setLoading(true);
    fetch('/api/users', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUsers(data.data);
        }
      })
      .catch((err) => console.warn('Could not fetch users:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await fetch(`/api/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();
      if (data.success) {
        setNotice(`User role updated to '${newRole}'.`);
        fetchUsers();
        setTimeout(() => setNotice(''), 4000);
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Error updating user role: ' + err.message);
    }
  };

  const handleStatusChange = async (userId, newStatus, assignedRole) => {
    try {
      setProcessingId(userId);
      const payload = { status: newStatus };
      if (assignedRole) payload.role = assignedRole;

      const res = await fetch(`/api/users/${userId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setNotice(
          newStatus === 'active'
            ? `Account approved! User has been granted ${data.data.role} access.`
            : `Account status updated to '${newStatus}'.`
        );
        fetchUsers();
        setTimeout(() => setNotice(''), 4000);
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Error updating account status: ' + err.message);
    } finally {
      setProcessingId(null);
    }
  };

  if (role !== 'admin') {
    return (
      <div className="p-8 text-center text-slate-400 font-mono text-xs">
        Administrator permissions required to access User Management.
      </div>
    );
  }

  const pendingUsers = users.filter((u) => u.status === 'pending');
  const filteredUsers = users.filter((u) => {
    if (filterRole !== 'all' && u.role !== filterRole) return false;
    if (filterStatus !== 'all' && (u.status || 'active') !== filterStatus) return false;
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 text-slate-900 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <h2 className="font-heading font-bold text-xl sm:text-2xl text-slate-900 flex items-center gap-2.5">
            <Users className="w-6 h-6 text-blue-600" />
            System User Management
          </h2>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Verify pending account registrations and manage repository role credentials
          </p>
        </div>
        <div className="flex items-center gap-2">
          {pendingUsers.length > 0 && (
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-mono font-bold flex items-center gap-1.5 animate-pulse">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              {pendingUsers.length} Pending Approval
            </span>
          )}
          <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-mono font-bold">
            {users.length} Total Users
          </span>
        </div>
      </div>

      {notice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-mono flex items-center space-x-2 shadow-sm animate-fade-in">
          <CheckCircle className="w-4 h-4 flex-shrink-0 text-emerald-600" />
          <span>{notice}</span>
        </div>
      )}

      {/* PENDING APPROVALS QUEUE (High Priority) */}
      {pendingUsers.length > 0 && (
        <div className="card-glacier border-2 border-amber-300/80 bg-gradient-to-br from-amber-50/50 via-white to-orange-50/30 p-5 sm:p-6 shadow-md rounded-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-amber-200/80">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold shadow-sm">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-slate-900">
                  Pending Verification Requests ({pendingUsers.length})
                </h3>
                <p className="text-[11px] text-slate-600 font-mono">
                  These researchers registered for staff access and require Administrator verification before gaining entry.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {pendingUsers.map((u) => (
              <div
                key={u._id}
                className="bg-white rounded-xl border border-amber-200 p-4 shadow-sm hover:shadow transition-shadow flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{u.name}</h4>
                      <p className="text-xs text-slate-500 font-mono">{u.email}</p>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider font-mono ${
                        u.role === 'scientist'
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : u.role === 'editor'
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {u.role}
                    </span>
                  </div>

                  <div className="mt-2.5 text-xs text-slate-600 font-mono space-y-1">
                    <div>
                      <span className="text-slate-400">Affiliation: </span>
                      <span className="font-medium text-slate-800">{u.department || 'Not provided'}</span>
                    </div>
                    {u.createdAt && (
                      <div>
                        <span className="text-slate-400">Registered: </span>
                        <span>{new Date(u.createdAt).toLocaleDateString()} at {new Date(u.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <button
                    disabled={processingId === u._id}
                    onClick={() => handleStatusChange(u._id, 'active')}
                    className="flex-1 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-1.5 shadow-sm transition disabled:opacity-50"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    Approve Account
                  </button>
                  <button
                    disabled={processingId === u._id}
                    onClick={() => {
                      if (confirm(`Are you sure you want to reject registration for ${u.name}?`)) {
                        handleStatusChange(u._id, 'rejected');
                      }
                    }}
                    className="py-1.5 px-3 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 rounded-lg text-xs font-mono font-medium flex items-center justify-center gap-1 shadow-sm transition disabled:opacity-50"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FILTER & ALL USERS TABLE */}
      <div className="card-glacier overflow-hidden space-y-4 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <h3 className="font-heading font-bold text-sm text-slate-800 uppercase tracking-wider">All Accounts Directory</h3>
            <span className="text-xs text-slate-400 font-mono">({filteredUsers.length} shown)</span>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 text-[11px]">Role:</span>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="bg-white border border-slate-200 rounded-md px-2 py-1 text-slate-700 focus:outline-none focus:border-blue-500"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="scientist">Scientist</option>
                <option value="public">Public</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 text-[11px]">Status:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-white border border-slate-200 rounded-md px-2 py-1 text-slate-700 focus:outline-none focus:border-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3 animate-pulse py-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-slate-100 rounded-lg"></div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-50/80 text-slate-700 uppercase text-[10px] border-b border-slate-200 font-bold">
                <tr>
                  <th className="px-4 py-3">User & Email</th>
                  <th className="px-4 py-3">Affiliation</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-slate-400">
                      No accounts matched the selected filters.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const userStatus = u.status || 'active';
                    return (
                      <tr key={u._id} className="hover:bg-blue-50/30 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-bold text-slate-900">{u.name}</div>
                          <div className="text-[10px] text-slate-500">{u.email}</div>
                        </td>
                        <td className="px-4 py-3 text-slate-600 font-medium">
                          {u.department || 'N/A'}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              userStatus === 'active'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : userStatus === 'pending'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {userStatus === 'active' && <CheckCircle className="w-3 h-3 text-emerald-600" />}
                            {userStatus === 'pending' && <Clock className="w-3 h-3 text-amber-600" />}
                            {userStatus === 'rejected' && <XCircle className="w-3 h-3 text-rose-600" />}
                            {userStatus.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                              u.role === 'admin'
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : u.role === 'editor'
                                ? 'bg-purple-50 text-purple-800 border border-purple-200'
                                : u.role === 'scientist'
                                ? 'bg-blue-50 text-blue-800 border border-blue-200'
                                : 'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="inline-flex items-center gap-2">
                            {/* Role Select */}
                            <select
                              value={u.role}
                              onChange={(e) => handleRoleChange(u._id, e.target.value)}
                              className="bg-white border border-slate-300 focus:border-blue-600 rounded-md px-2 py-1 text-xs text-slate-800 shadow-sm focus:outline-none"
                              title="Change Role"
                            >
                              <option value="public">Public</option>
                              <option value="scientist">Scientist</option>
                              <option value="editor">Editor</option>
                              <option value="admin">Admin</option>
                            </select>

                            {/* Status Quick Action */}
                            {userStatus === 'pending' && (
                              <button
                                onClick={() => handleStatusChange(u._id, 'active')}
                                className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-mono font-bold transition shadow-sm"
                                title="Approve Account"
                              >
                                Approve
                              </button>
                            )}
                            {userStatus === 'rejected' && (
                              <button
                                onClick={() => handleStatusChange(u._id, 'active')}
                                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-mono transition"
                                title="Reactivate Account"
                              >
                                Reactivate
                              </button>
                            )}
                            {userStatus === 'active' && u.role !== 'admin' && (
                              <button
                                onClick={() => {
                                  if (confirm(`Suspend account for ${u.name}?`)) {
                                    handleStatusChange(u._id, 'rejected');
                                  }
                                }}
                                className="px-2 py-1 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded text-xs font-mono transition"
                                title="Suspend Account"
                              >
                                Suspend
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
