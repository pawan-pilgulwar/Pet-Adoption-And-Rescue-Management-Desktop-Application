import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import api, { imgUrl, uploadToCloudinary } from '../../../api/api';
import { UserProfile, ShopOwnerProfile, AdminProfile } from '../../../types';

const Profile: React.FC = () => {
  const { user, refresh } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [pwData, setPwData] = useState({ old_password: '', new_password: '', confirm_password: '' });
  const [pwMsg, setPwMsg] = useState('');
  const [pwSaving, setPwSaving] = useState(false);

  const profile = user?.profile as any;

  const [form, setForm] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    phone_number: profile?.phone_number || '',
    address: profile?.address || '',
    shop_name: profile?.shop_name || '',
    shop_address: profile?.shop_address || '',
    shop_license: profile?.shop_license || '',
  });

  if (!user) return null;

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setSaving(true); setMsg('');
    try {
      let profile_picture_url = profile?.profile_picture_url || '';
      let profile_picture_public_id = profile?.profile_picture_public_id || '';
      if (imgFile) {
        const up = await uploadToCloudinary(imgFile);
        profile_picture_url = up.url;
        profile_picture_public_id = up.public_id;
      }
      await api.patch(`/users/${user.id}/update-user/`, { ...form, profile_picture_url, profile_picture_public_id });
      await refresh();
      setEditing(false);
      setMsg('Profile updated successfully!');
    } catch (e: any) {
      setMsg(e.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handlePwChange = async () => {
    setPwSaving(true); setPwMsg('');
    try {
      await api.patch('/users/update-password/', pwData);
      setPwMsg('Password updated successfully!');
      setPwData({ old_password: '', new_password: '', confirm_password: '' });
    } catch (e: any) {
      setPwMsg(e.response?.data?.message || 'Failed to update password');
    } finally {
      setPwSaving(false);
    }
  };

  const inputCls = "w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 bg-stone-50";
  const labelCls = "block text-sm font-medium text-stone-700 mb-1.5";
  const pic = profile?.profile_picture_url;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-stone-900">Profile Settings</h1>
        <p className="text-stone-500 text-sm mt-0.5">Manage your account information</p>
      </div>

      {/* Profile card */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
        <div className="flex items-center gap-5 mb-6 pb-6 border-b border-stone-50">
          <div className="w-16 h-16 rounded-2xl bg-brand-100 overflow-hidden flex items-center justify-center text-2xl font-black text-brand-500 flex-shrink-0">
            {pic ? <img src={imgUrl(pic)} alt="" className="w-full h-full object-cover" /> : user.first_name[0]}
          </div>
          <div>
            <h2 className="text-lg font-black text-stone-900">{user.first_name} {user.last_name}</h2>
            <p className="text-brand-500 text-sm">@{user.username}</p>
            <span className="text-[10px] font-bold bg-brand-50 text-brand-600 px-2.5 py-0.5 rounded-full border border-brand-100 mt-1 inline-block">{user.role}</span>
          </div>
        </div>

        {msg && (
          <div className={`p-3 rounded-xl mb-5 text-sm border ${msg.includes('success') ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>{msg}</div>
        )}

        {editing ? (
          <div className="space-y-4 fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className={labelCls}>First Name</label><input className={inputCls} value={form.first_name} onChange={e => set('first_name', e.target.value)} /></div>
              <div><label className={labelCls}>Last Name</label><input className={inputCls} value={form.last_name} onChange={e => set('last_name', e.target.value)} /></div>
            </div>
            {user.role === 'USER' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className={labelCls}>Phone</label><input className={inputCls} value={form.phone_number} onChange={e => set('phone_number', e.target.value)} /></div>
                <div><label className={labelCls}>Address</label><input className={inputCls} value={form.address} onChange={e => set('address', e.target.value)} /></div>
              </div>
            )}
            {user.role === 'SHOP_OWNER' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className={labelCls}>Shop Name</label><input className={inputCls} value={form.shop_name} onChange={e => set('shop_name', e.target.value)} /></div>
                <div><label className={labelCls}>Phone</label><input className={inputCls} value={form.phone_number} onChange={e => set('phone_number', e.target.value)} /></div>
                <div className="md:col-span-2"><label className={labelCls}>Shop Address</label><input className={inputCls} value={form.shop_address} onChange={e => set('shop_address', e.target.value)} /></div>
              </div>
            )}
            <div>
              <label className={labelCls}>Profile Picture</label>
              <input type="file" accept="image/*" onChange={e => setImgFile(e.target.files?.[0] || null)} className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm bg-stone-50" />
            </div>
            <div className="flex gap-3">
              <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-600 transition-colors text-sm disabled:opacity-60">{saving ? 'Saving...' : 'Save Changes'}</button>
              <button onClick={() => setEditing(false)} className="px-6 py-2.5 bg-stone-100 text-stone-600 font-semibold rounded-xl hover:bg-stone-200 transition-colors text-sm">Cancel</button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.role === 'USER' && [
                ['Phone', profile?.phone_number],
                ['Address', profile?.address],
              ].map(([k, v]) => (
                <div key={k} className="bg-stone-50 rounded-xl p-4 border border-stone-100">
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">{k}</p>
                  <p className="text-sm font-medium text-stone-800">{v || 'Not set'}</p>
                </div>
              ))}
              {user.role === 'SHOP_OWNER' && [
                ['Shop Name', profile?.shop_name],
                ['Phone', profile?.phone_number],
                ['Shop Address', profile?.shop_address],
                ['License', profile?.shop_license],
              ].map(([k, v]) => (
                <div key={k} className="bg-stone-50 rounded-xl p-4 border border-stone-100">
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">{k}</p>
                  <p className="text-sm font-medium text-stone-800">{v || 'Not set'}</p>
                </div>
              ))}
              {user.role === 'ADMIN' && (
                <div className="bg-stone-50 rounded-xl p-4 border border-stone-100">
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Admin Level</p>
                  <p className="text-sm font-medium text-stone-800">{profile?.admin_level || 'General'}</p>
                </div>
              )}
            </div>
            <button onClick={() => setEditing(true)} className="px-6 py-2.5 bg-stone-900 text-white font-semibold rounded-xl hover:bg-stone-800 transition-colors text-sm">Edit Profile</button>
          </div>
        )}
      </div>

      {/* Change password */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
        <h3 className="font-bold text-stone-900 mb-5 flex items-center gap-2">
          <span className="w-7 h-7 bg-red-50 text-red-500 rounded-lg flex items-center justify-center text-sm">🔐</span>
          Change Password
        </h3>
        {pwMsg && (
          <div className={`p-3 rounded-xl mb-4 text-sm border ${pwMsg.includes('success') ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>{pwMsg}</div>
        )}
        <div className="space-y-4">
          <div><label className={labelCls}>Current Password</label><input type="password" className={inputCls} value={pwData.old_password} onChange={e => setPwData(p => ({ ...p, old_password: e.target.value }))} /></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className={labelCls}>New Password</label><input type="password" className={inputCls} value={pwData.new_password} onChange={e => setPwData(p => ({ ...p, new_password: e.target.value }))} /></div>
            <div><label className={labelCls}>Confirm Password</label><input type="password" className={inputCls} value={pwData.confirm_password} onChange={e => setPwData(p => ({ ...p, confirm_password: e.target.value }))} /></div>
          </div>
          <button onClick={handlePwChange} disabled={pwSaving} className="px-6 py-2.5 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-600 transition-colors text-sm disabled:opacity-60">{pwSaving ? 'Updating...' : 'Update Password'}</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
