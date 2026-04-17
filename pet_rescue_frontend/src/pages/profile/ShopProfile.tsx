import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { formatImageUrl } from '../../services/api';
import { uploadImage } from '../../utils/uploadImage';
import { ShopOwnerProfile } from '../../types';

const ShopProfile: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [editMode, setEditMode] = useState(false);
  
  const profile = user?.profile as ShopOwnerProfile;

  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    shop_name: profile?.shop_name || '',
    shop_address: profile?.shop_address || '',
    phone_number: profile?.phone_number || '',
    shop_license: profile?.shop_license || '',
    profile_picture: null as File | null,
  });
  
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Password change state
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [passwordMessage, setPasswordMessage] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  if (!user || user.role !== 'SHOP_OWNER') return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'profile_picture') {
      const files = (e.target as HTMLInputElement).files;
      if (files && files[0]) {
        setFormData({ ...formData, profile_picture: files[0] });
        return;
      }
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      let profile_picture_url = profile?.profile_picture_url || '';
      let profile_picture_public_id = profile?.profile_picture_public_id || '';

      if (formData.profile_picture) {
        const uploadResult = await uploadImage(formData.profile_picture);
        profile_picture_url = uploadResult.url;
        profile_picture_public_id = uploadResult.public_id;
      }

      const payload = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        shop_name: formData.shop_name,
        shop_address: formData.shop_address,
        phone_number: formData.phone_number,
        shop_license: formData.shop_license,
        profile_picture_url,
        profile_picture_public_id,
      };

      await api.patch(`/users/${user?.id}/update-user/`, payload);
      await refreshUser();
      setEditMode(false);
      setMessage('Shop profile updated successfully!');
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Failed to update shop profile.');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    setSavingPassword(true);
    setPasswordMessage('');
    try {
      await api.patch('/users/update-password/', passwordData);
      setPasswordMessage('Password changed successfully!');
      setPasswordData({ old_password: '', new_password: '', confirm_password: '' });
    } catch (err: any) {
      setPasswordMessage(err.response?.data?.message || 'Failed to change password.');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="paw-bg min-h-screen py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-7">
          <span className="text-orange-500 text-xs font-semibold uppercase tracking-wider">Shop Account</span>
          <h1 className="text-2xl font-black text-slate-900 mt-1">Shop Profile</h1>
        </div>

        <div className="bg-white p-7 rounded-2xl border border-orange-100 shadow-sm mb-5">
          <div className="flex flex-col sm:flex-row items-center gap-5 mb-6 pb-6 border-b border-orange-50">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-orange-50 border-2 border-orange-100 flex-shrink-0">
              {profile?.profile_picture_url ? (
                <img src={formatImageUrl(profile.profile_picture_url)} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl font-black text-orange-500">
                  {user.first_name?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase()}
                </div>
              )}
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-lg font-black text-slate-900">{profile?.shop_name || `${user.first_name} ${user.last_name}`}</h2>
              <p className="text-orange-500 text-sm font-medium">@{user.username}</p>
              <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-2.5 py-0.5 rounded-full mt-1 inline-block border border-teal-100">
                Verified Shop Owner
              </span>
            </div>
          </div>

          {message && (
            <div className={`p-3 rounded-xl mb-5 text-sm font-medium flex items-center gap-2 ${message.includes('successfully') ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
              <span>{message.includes('successfully') ? '✅' : '❌'}</span> {message}
            </div>
          )}

          {editMode ? (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Owner First Name" name="first_name" value={formData.first_name} onChange={handleChange} />
                <Input label="Owner Last Name" name="last_name" value={formData.last_name} onChange={handleChange} />
              </div>
              <div className="p-4 bg-orange-50 rounded-xl border border-orange-100 space-y-4">
                <p className="text-xs font-semibold text-orange-600 uppercase tracking-wider">Shop Details</p>
                <Input label="Shop Name" name="shop_name" value={formData.shop_name} onChange={handleChange} />
                <Input label="Shop Address" name="shop_address" value={formData.shop_address} onChange={handleChange} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Phone Number" name="phone_number" value={formData.phone_number} onChange={handleChange} />
                  <Input label="License Number" name="shop_license" value={formData.shop_license} onChange={handleChange} />
                </div>
              </div>
              <Input label="Profile Photo" type="file" name="profile_picture" onChange={handleChange} />
              <div className="flex gap-3 pt-2">
                <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-all text-sm disabled:bg-slate-300">
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button onClick={() => setEditMode(false)} className="px-6 py-2.5 bg-slate-100 text-slate-600 font-semibold rounded-xl hover:bg-slate-200 transition-all text-sm">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Shop Name</p>
                  <p className="text-slate-900 font-medium text-sm">{profile?.shop_name || 'Not set'}</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Phone</p>
                  <p className="text-slate-900 font-medium text-sm">{profile?.phone_number || 'Not set'}</p>
                </div>
                <div className="col-span-full p-4 bg-orange-50 rounded-xl border border-orange-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Shop Address</p>
                  <p className="text-slate-900 font-medium text-sm">{profile?.shop_address || 'Not set'}</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">License</p>
                  <p className="font-mono text-orange-600 font-bold text-sm">{profile?.shop_license || 'PENDING'}</p>
                </div>
              </div>
              <button onClick={() => setEditMode(true)} className="px-6 py-2.5 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-all text-sm">
                Edit Shop Profile
              </button>
            </div>
          )}
        </div>

        <div className="bg-white p-7 rounded-2xl border border-orange-100 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-5 flex items-center gap-2">
            <span className="w-7 h-7 bg-red-50 text-red-500 rounded-lg flex items-center justify-center text-sm">🔐</span>
            Change Password
          </h3>

          {passwordMessage && (
            <div className={`p-3 rounded-xl mb-5 text-sm font-medium flex items-center gap-2 ${passwordMessage.includes('successfully') ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
              <span>✅</span> {passwordMessage}
            </div>
          )}

          <div className="space-y-4">
            <Input label="Current Password" type="password" value={passwordData.old_password} onChange={(e) => setPasswordData({ ...passwordData, old_password: e.target.value })} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="New Password" type="password" value={passwordData.new_password} onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })} />
              <Input label="Confirm Password" type="password" value={passwordData.confirm_password} onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })} />
            </div>
            <button onClick={handlePasswordChange} disabled={savingPassword} className="px-6 py-2.5 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-all text-sm disabled:bg-slate-300">
              {savingPassword ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopProfile;
