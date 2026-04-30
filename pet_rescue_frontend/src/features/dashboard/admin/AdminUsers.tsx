import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../services/api';
import { User } from '../../../types';
import Spinner from '../../../components/common/Spinner';
import Button from '../../../components/common/Button';
import ConfirmModal from '../../../components/ui/ConfirmModal';

function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel?: () => void;
    type?: 'danger' | 'info' | 'success';
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const showConfirm = (title: string, message: string, onConfirm: () => void, type: 'danger' | 'info' | 'success' = 'info') => {
    setModalConfig({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        onConfirm();
        setModalConfig(prev => ({ ...prev, isOpen: false }));
      },
      onCancel: () => setModalConfig(prev => ({ ...prev, isOpen: false })),
      type
    });
  };

  const showAlert = (title: string, message: string, type: 'info' | 'success' | 'danger' = 'info') => {
    setModalConfig({
      isOpen: true,
      title,
      message,
      onConfirm: () => setModalConfig(prev => ({ ...prev, isOpen: false })),
      type
    });
  };

  function load() {
    setLoading(true);
    // GET /api/v1/users/ 
    api.get('/users/')
      .then(res => setUsers(res.data?.data.users || []))
      .catch(() => { })
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  const handleDelete = (id: number, username: string) => {
    showConfirm(
      "Delete User",
      `Are you sure you want to delete user @${username}? This action is permanent and cannot be undone.`,
      async () => {
        try {
          await api.delete(`/users/${id}/admin-delete-user/`);
          load();
          showAlert("Deleted", "User deleted successfully", "success");
        } catch {
          showAlert("Error", "Failed to delete user", "danger");
        }
      },
      'danger'
    );
  };

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

      <ConfirmModal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        onConfirm={modalConfig.onConfirm}
        onCancel={modalConfig.onCancel}
        type={modalConfig.type}
      />
    </div>
  );
}

export default AdminUsers;
