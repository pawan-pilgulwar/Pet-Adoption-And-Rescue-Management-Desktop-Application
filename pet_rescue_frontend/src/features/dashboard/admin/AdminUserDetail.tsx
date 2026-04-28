import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import { User } from '../../../types';
import Spinner from '../../../components/common/Spinner';
import DetailLayout from '../../../components/common/DetailLayout';
import Button from '../../../components/common/Button';

function AdminUserDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      api.get(`/users/${id}/`)
        .then(res => setUser(res.data))
        .catch(() => { })
        .finally(() => setLoading(false));
    }
  }, [id]);

  async function handleDelete() {
    if (!window.confirm(`Are you sure you want to delete user @${user?.username}? This action cannot be undone.`)) return;
    try {
      await api.delete(`/users/${id}/admin-delete-user/`);
      alert("User deleted successfully");
      navigate('/admin/users');
    } catch {
      alert("Failed to delete user");
    }
  }

  if (loading) return <Spinner message="Fetching user details..." />;
  if (!user) return <div className="p-8 text-center text-red-500">User not found</div>;

  return (
    <DetailLayout
      title={`${user.first_name} ${user.last_name}`}
      subtitle={`@${user.username}`}
      backLink="/admin/users"
      backText="Back to Users"
      image={user.profile?.profile_picture_url || undefined}
      imageFallback="👤"
      stats={[
        { label: 'Role', value: user.role },
        { label: 'Joined', value: new Date(user.created_at).toLocaleDateString() }
      ]}
      actions={
        <Button variant="outline" className="text-red-500 hover:bg-red-50 border-red-200" onClick={handleDelete}>
          Delete User Account
        </Button>
      }
    >
      <section>
        <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-4">Account Information</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-xs text-stone-400 mb-1">Email Address</p>
            <p className="font-medium text-stone-900">{user.email}</p>
          </div>
          <div>
            <p className="text-xs text-stone-400 mb-1">User ID</p>
            <p className="font-mono text-stone-900">{user.id}</p>
          </div>
        </div>
      </section>

      <hr className="border-stone-100" />

      <section>
        <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-4">Profile Details</h3>
        {user.profile ? (
          (() => {
            const profile = user.profile as any;
            return (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs text-stone-400 mb-1">Phone Number</p>
                    <p className="font-medium text-stone-900">{profile.phone_number || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-stone-400 mb-1">Address</p>
                    <p className="font-medium text-stone-900">{profile.address || profile.shop_address || 'Not provided'}</p>
                  </div>
                </div>
                {user.role === 'SHOP_OWNER' && (
                  <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100">
                    <p className="text-xs text-orange-600 font-bold uppercase mb-2">Shop Information</p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-orange-400">Shop Name</p>
                        <p className="font-bold text-orange-900">{profile.shop_name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-orange-400">License ID</p>
                        <p className="font-mono text-orange-900">{profile.shop_license}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })()
        ) : (
          <p className="text-stone-500 italic">No profile information available.</p>
        )}
      </section>
    </DetailLayout>
  );
}

export default AdminUserDetail;
