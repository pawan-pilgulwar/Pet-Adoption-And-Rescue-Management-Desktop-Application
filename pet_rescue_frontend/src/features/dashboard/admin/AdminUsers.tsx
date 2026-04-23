import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { User } from '../../../types';
import Spinner from '../../../components/common/Spinner';

function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // GET /api/v1/users/ 
    api.get('/users/')
      .then(res => setUsers(res.data?.data.users || []))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

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
