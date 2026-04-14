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

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-800">👥 Manage Users</h1>
        <p className="text-slate-500 mt-1">View and manage registered users.</p>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <span className="text-4xl animate-float inline-block">👥</span>
          <p className="mt-4 text-slate-500 font-bold">Loading users...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-orange-50">
          <span className="text-4xl">👥</span>
          <p className="mt-4 text-slate-500 font-bold">No external users found.</p>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-2xl border border-orange-50 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-orange-50/50 text-slate-500 border-b border-orange-100">
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">User</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider hidden md:table-cell">Role</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-orange-50 hover:bg-orange-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center text-sm font-black text-orange-600">
                        {u.first_name?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{u.first_name} {u.last_name}</p>
                        <p className="text-xs text-slate-400">@{u.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{u.email}</td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      u.role === 'ADMIN'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="danger" className="text-xs px-3 py-1.5" onClick={() => handleDeleteUser(u.id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
