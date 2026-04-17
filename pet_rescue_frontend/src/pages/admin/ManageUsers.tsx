import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { User } from '../../types';
import Button from '../../components/Button';

const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users/admin-users/');
      setUsers(response.data.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!window.confirm("Delete this user? This cannot be undone.")) return;
    try {
      await api.delete(`/users/${id}/admin-delete-user/`);
      setUsers(users.filter(u => u.id !== id));
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert('Error deleting user.');
    }
  };

  const roleStyle: Record<string, string> = {
    ADMIN: 'bg-orange-100 text-orange-700',
    SHOP_OWNER: 'bg-teal-100 text-teal-700',
    USER: 'bg-slate-100 text-slate-600',
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900">Manage Users</h1>
        <p className="text-slate-500 text-sm mt-0.5">View and manage registered users.</p>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-3"></div>
          <p className="text-slate-400 text-sm">Loading users...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-orange-100">
          <span className="text-4xl block mb-3">👥</span>
          <p className="text-slate-500 text-sm font-medium">No users found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-orange-50 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-700">{users.length} users registered</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50">
                  <th className="px-5 py-3 border-b border-slate-100">User</th>
                  <th className="px-5 py-3 border-b border-slate-100">Email</th>
                  <th className="px-5 py-3 border-b border-slate-100 hidden md:table-cell">Role</th>
                  <th className="px-5 py-3 border-b border-slate-100 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-slate-50 hover:bg-orange-50/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center text-sm font-bold text-orange-600">
                          {u.first_name?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 text-sm">{u.first_name} {u.last_name}</p>
                          <p className="text-xs text-slate-400">@{u.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-600">{u.email}</td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${roleStyle[u.role] || 'bg-slate-100 text-slate-600'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Button variant="danger" className="text-xs px-3 py-1.5" onClick={() => handleDeleteUser(u.id)}>
                        Delete
                      </Button>
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

export default ManageUsers;
