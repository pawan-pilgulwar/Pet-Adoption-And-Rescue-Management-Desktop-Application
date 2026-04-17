import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { formatImageUrl } from '../../services/api';
import { uploadImage } from '../../utils/uploadImage';

const UserProfile: React.FC = () => {
    const { user, refreshUser } = useAuth();

    const profile = user?.profile;

    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        phone_number: profile?.phone_number || '',
        address: profile?.address || '',
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

    if (!user || user.role !== 'USER') return null;

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
            let profile_picture_url = user?.profile?.profile_picture_url || '';
            let profile_picture_public_id = user?.profile?.profile_picture_public_id || '';

            if (formData.profile_picture) {
                const uploadResult = await uploadImage(formData.profile_picture);
                profile_picture_url = uploadResult.url;
                profile_picture_public_id = uploadResult.public_id;
            }

            const payload = {
                first_name: formData.first_name,
                last_name: formData.last_name,
                phone_number: formData.phone_number,
                address: formData.address,
                profile_picture_url,
                profile_picture_public_id,
            };

            await api.patch(`/users/${user?.id}/update-user/`, payload);
            await refreshUser();
            setEditMode(false);
            setMessage('Profile updated successfully!');
        } catch (err: any) {
            setMessage(err.response?.data?.message || 'Failed to update profile.');
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
                    <span className="text-orange-500 text-xs font-semibold uppercase tracking-wider">My Account</span>
                    <h1 className="text-2xl font-black text-slate-900 mt-1">Account Settings</h1>
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
                            <h2 className="text-lg font-black text-slate-900">{user.first_name} {user.last_name}</h2>
                            <p className="text-orange-500 text-sm font-medium">@{user.username}</p>
                            <p className="text-slate-400 text-xs mt-0.5">{user.email}</p>
                        </div>
                    </div>

                    {message && (
                        <div className={`p-3 rounded-xl mb-5 text-sm font-medium flex items-center gap-2 ${message.includes('success') ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                            <span>{message.includes('success') ? '✅' : '❌'}</span> {message}
                        </div>
                    )}

                    {editMode ? (
                        <div className="space-y-4 animate-fade-in">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input label="First Name" name="first_name" value={formData.first_name} onChange={handleChange} />
                                <Input label="Last Name" name="last_name" value={formData.last_name} onChange={handleChange} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input label="Phone Number" name="phone_number" value={formData.phone_number} onChange={handleChange} />
                                <Input label="Profile Picture" type="file" name="profile_picture" onChange={handleChange} />
                            </div>
                            <Input label="Address" name="address" value={formData.address} onChange={handleChange} />
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
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Phone</p>
                                    <p className="text-slate-900 font-medium text-sm">{profile?.phone_number || 'Not set'}</p>
                                </div>
                                <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Address</p>
                                    <p className="text-slate-900 font-medium text-sm">{profile?.address || 'Not set'}</p>
                                </div>
                            </div>
                            <button onClick={() => setEditMode(true)} className="px-6 py-2.5 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-all text-sm">
                                Edit Profile
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
                        <div className={`p-3 rounded-xl mb-5 text-sm font-medium flex items-center gap-2 ${passwordMessage.includes('success') ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
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

export default UserProfile;
