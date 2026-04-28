import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../services/api';
import { User } from '../../../types';
import Spinner from '../../../components/common/Spinner';
import Button from '../../../components/common/Button';

function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    // GET /api/v1/users/ 
    api.get('/users/')
      .then(res => setUsers(res.data?.data.users || []))
      .catch(() => { })
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id: number, username: string) {
    if (!window.confirm(`Are you sure you want to delete user @${username}? This action is permanent.`)) return;
    try {
      await api.delete(`/users/${id}/admin-delete-user/`);
      load();
    } catch {
      alert("Failed to delete user");
    }
  }

  return (
    <div className="fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900">User Management</h1>
        <p className="text-stone-500">View and manage registered users.</p>
      </div>

      <div className="card overflow-x-auto">
        {loading ? <Spinner /> : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td className="font-mono text-stone-600">@{u.username}</td>
                  <td className="font-semibold text-stone-900">{u.first_name} {u.last_name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`badge ${u.role === 'ADMIN' ? 'badge-blue' :
                      u.role === 'SHOP_OWNER' ? 'badge-orange' : 'badge-green'
                      }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="text-stone-500">{new Date(u.created_at).toLocaleDateString()}</td>
                  <td>
                    <div className="flex gap-2">
                       <Link to={`/admin/users/${u.id}`}>
                         <Button variant="ghost" size="sm" className="text-brand-500 font-bold">View</Button>
                       </Link>
                       <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50" onClick={() => handleDelete(u.id, u.username)}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminUsers;
