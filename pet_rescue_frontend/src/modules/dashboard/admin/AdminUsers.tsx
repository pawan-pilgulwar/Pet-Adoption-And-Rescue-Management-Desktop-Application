import React, { useEffect, useState } from 'react';
import api from '../../../api/api';
import { User } from '../../../types';
import Spinner from '../../../components/common/Spinner';
import Empty from '../../../components/common/Empty';

const roleCls: Record<string, string> = {
  ADMIN: 'bg-brand-100 text-brand-700',
  SHOP_OWNER: 'bg-teal-100 text-teal-700',
  USER: 'bg-stone-100 text-stone-600',
};

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users/admin-users/').then(r => setUsers(r.data.data?.users || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const del = async (id: number) => {
    if (!window.confirm('Delete this user? This cannot be undone.')) return;
    await api.delete(`/users/${id}/admin-delete-user/`).catch(() => {});
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-stone-900">Manage Users</h1>
        <p className="text-stone-500 text-sm mt-0.5">View and manage all registered users</p>
      </div>
      {loading ? <Spinner /> : users.length === 0 ? <Empty icon="👥" text="No users found." /> : (
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-stone-100">
            <span className="text-sm font-semibold text-stone-700">{users.length} users registered</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-stone-50 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                  <th className="px-5 py-3 border-b border-stone-100">User</th>
                  <th className="px-5 py-3 border-b border-stone-100">Email</th>
                  <th className="px-5 py-3 border-b border-stone-100 hidden md:table-cell">Role</th>
                  <th className="px-5 py-3 border-b border-stone-100 hidden lg:table-cell">Joined</th>
                  <th className="px-5 py-3 border-b border-stone-100 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-b border-stone-50 hover:bg-stone-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center text-sm font-bold text-brand-600">
                          {u.first_name?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <p className="font-semibold text-stone-800 text-sm">{u.first_name} {u.last_name}</p>
                          <p className="text-xs text-stone-400">@{u.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-stone-600">{u.email}</td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${roleCls[u.role] || roleCls.USER}`}>{u.role}</span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-stone-400 hidden lg:table-cell">{new Date(u.created_at).toLocaleDateString()}</td>
                    <td className="px-5 py-3.5 text-right">
                      <button onClick={() => del(u.id)} className="px-3 py-1.5 bg-red-50 text-red-500 text-xs font-semibold rounded-lg hover:bg-red-100 transition-colors">Delete</button>
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
};

export default AdminUsers;
