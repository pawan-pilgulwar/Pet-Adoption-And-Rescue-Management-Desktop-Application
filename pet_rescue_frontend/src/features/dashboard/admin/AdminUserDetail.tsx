import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import { User, UserProfile, ShopOwnerProfile } from '../../../types';

import Spinner from '../../../components/common/Spinner';
import DetailLayout from '../../../components/common/DetailLayout';
import Button from '../../../components/common/Button';
import ConfirmModal from '../../../components/ui/ConfirmModal';

function AdminUserDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
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

  useEffect(() => {
    if (id) {
      api.get(`/users/${id}/`)
        .then(res => setUser(res.data))
        .catch(() => { })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleDelete = () => {
    showConfirm(
      "Delete User",
      `Are you sure you want to delete user @${user?.username}? This action is permanent and cannot be undone.`,
      async () => {
        try {
          await api.delete(`/users/${id}/admin-delete-user/`);
          navigate('/admin/users');
        } catch {
          showAlert("Error", "Failed to delete user", "danger");
        }
      },
      'danger'
    );
  };

  if (loading) return <Spinner message="Fetching user details..." />;
  if (!user) return <div className="p-8 text-center text-red-500">User not found</div>;

  const profile = user.profile;
  const isUserProfile = (p: any): p is UserProfile => p && 'address' in p;
  const isShopOwnerProfile = (p: any): p is ShopOwnerProfile => p && 'shop_name' in p;

  return (
    <DetailLayout
      title={`${user.first_name} ${user.last_name}`}
      subtitle={`@${user.username}`}
      backLink="/admin/users"
      backText="Back to Users"
      image={profile?.profile_picture_url || undefined}
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
      <div className="space-y-12">
        <section>
          <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-6">Account Information</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm">
              <p className="text-[10px] text-stone-400 uppercase font-bold mb-1">Email Address</p>
              <p className="font-semibold text-stone-900">{user.email}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm">
              <p className="text-[10px] text-stone-400 uppercase font-bold mb-1">User ID</p>
              <p className="font-mono text-stone-900">#{user.id}</p>
            </div>
             <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm">
              <p className="text-[10px] text-stone-400 uppercase font-bold mb-1">System Role</p>
              <p className="font-semibold text-stone-900">{user.role}</p>
            </div>
          </div>
        </section>

        <hr className="border-stone-100" />

        <section>
          <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-6">Profile Details</h3>
          {profile ? (
            <div className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-stone-50 p-6 rounded-3xl border border-stone-100">
                  <p className="text-xs text-stone-400 uppercase font-bold mb-4 tracking-wider">Contact Details</p>
                  <div className="space-y-3">
                    <div className="flex justify-between border-b border-stone-200/50 pb-2">
                      <span className="text-stone-500 text-sm">Phone</span>
                      <span className="font-semibold text-stone-900">
                         {isUserProfile(profile) ? profile.phone_number : (isShopOwnerProfile(profile) ? profile.phone_number : '—')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500 text-sm">Address</span>
                      <span className="font-semibold text-stone-900 text-right max-w-[200px]">
                        {isUserProfile(profile) ? profile.address : (isShopOwnerProfile(profile) ? profile.shop_address : '—')}
                      </span>
                    </div>
                  </div>
                </div>

                {isShopOwnerProfile(profile) && (
                  <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100">
                    <p className="text-xs text-amber-600 font-bold uppercase mb-4 tracking-wider">Shop Information</p>
                    <div className="space-y-3">
                      <div className="flex justify-between border-b border-amber-200/50 pb-2">
                        <span className="text-amber-500 text-sm">Shop Name</span>
                        <span className="font-bold text-amber-900">{profile.shop_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-amber-500 text-sm">License ID</span>
                        <span className="font-mono text-amber-900 font-bold">{profile.shop_license || '—'}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-stone-50 p-8 rounded-3xl border border-stone-100 text-center">
              <p className="text-stone-500 italic">No profile information available for this user.</p>
            </div>
          )}
        </section>
      </div>


      <ConfirmModal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        onConfirm={modalConfig.onConfirm}
        onCancel={modalConfig.onCancel}
        type={modalConfig.type}
      />
    </DetailLayout>
  );
}

export default AdminUserDetail;
