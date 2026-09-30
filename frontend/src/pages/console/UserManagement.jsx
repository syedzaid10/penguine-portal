import React, { useState, useEffect } from 'react';
import { Users, Shield, CheckCircle, AlertCircle, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function UserManagement() {
  const { token, role } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');

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
        setNotice(`User role updated to '${newRole}' and recorded in audit log.`);
        fetchUsers();
        setTimeout(() => setNotice(''), 3000);
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Error updating user role: ' + err.message);
    }
  };

  if (role !== 'admin') {
    return (
      <div className="p-8 text-center text-slate-400 font-mono text-xs">
        Administrator permissions required to access User Management.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 text-slate-900">
      <div className="flex items-center justify-between pb-5 border-b border-slate-200">
        <div>
          <h2 className="font-heading font-bold text-lg sm:text-xl text-slate-900">System User Management</h2>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Manage repository staff roles (Scientist, Editor, Admin) and access credentials
          </p>
        </div>
        <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-mono font-bold">
          {users.length} Registered Accounts
        </span>
      </div>

      {notice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-mono flex items-center space-x-2 shadow-sm">
          <CheckCircle className="w-4 h-4 flex-shrink-0 text-emerald-600" />
          <span>{notice}</span>
        </div>
      )}

      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card-glacier h-16 bg-slate-100"></div>
          ))}
        </div>
      ) : (
        <div className="card-glacier overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-50 text-slate-700 uppercase text-[10px] border-b border-slate-200 font-bold">
                <tr>
                  <th className="px-5 py-3.5">User</th>
                  <th className="px-5 py-3.5">Department / Affiliation</th>
                  <th className="px-5 py-3.5">Current Role</th>
                  <th className="px-5 py-3.5 text-right">Role Assignment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-slate-900">{u.name}</div>
                      <div className="text-[10px] text-slate-500">{u.email}</div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 font-medium">{u.department}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-md text-[10px] uppercase font-bold ${
                          u.role === 'admin'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : u.role === 'editor'
                            ? 'bg-purple-50 text-purple-800 border border-purple-200'
                            : u.role === 'scientist'
                            ? 'bg-blue-50 text-blue-800 border border-blue-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className="bg-white border border-slate-300 focus:border-blue-600 rounded-lg px-3 py-1.5 text-xs text-slate-800 shadow-sm focus:outline-none"
                      >
                        <option value="public">Public</option>
                        <option value="scientist">Scientist</option>
                        <option value="editor">Editor</option>
                        <option value="admin">Admin</option>
                      </select>
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
