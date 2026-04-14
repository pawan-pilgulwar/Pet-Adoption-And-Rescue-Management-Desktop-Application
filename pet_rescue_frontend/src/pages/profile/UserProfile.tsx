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
        <div className="max-w-3xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-black text-slate-800 mb-8">
                My <span className="text-orange-500">Profile</span>
            </h1>

            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-orange-50 mb-6">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-orange-50">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-orange-100 border border-orange-200">
                        {profile?.profile_picture_url ? (
                            <img src={formatImageUrl(profile.profile_picture_url)} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl font-black text-orange-600">
                                {user.first_name?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase()}
                            </div>
                        )}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">
                            {user.first_name} {user.last_name}
                        </h2>
                        <p className="text-sm text-slate-500">@{user.username} • {user.email}</p>
                    </div>
                </div>

                {message && (
                    <div className={`p-3 rounded-xl mb-4 text-sm font-medium ${message.includes('success') ? 'bg-teal-50 text-teal-700 border border-teal-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                        {message}
                    </div>
                )}

                {editMode ? (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label="First Name" name="first_name" value={formData.first_name} onChange={handleChange} />
                            <Input label="Last Name" name="last_name" value={formData.last_name} onChange={handleChange} />
                        </div>
                        <Input label="Phone Number" name="phone_number" value={formData.phone_number} onChange={handleChange} />
                        <Input label="Address" name="address" value={formData.address} onChange={handleChange} />
                        <Input label="Profile Picture" type="file" name="profile_picture" onChange={handleChange} />
                        <div className="flex gap-3 pt-2">
                            <Button onClick={handleSave} disabled={saving}>
                                {saving ? 'Saving...' : 'Save Changes'}
                            </Button>
                            <Button variant="secondary" onClick={() => setEditMode(false)}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase">Phone</p>
                                <p className="text-sm text-slate-700 font-medium">{profile?.phone_number || '—'}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase">Address</p>
                                <p className="text-sm text-slate-700 font-medium">{profile?.address || '—'}</p>
                            </div>
                        </div>
                        <div className="pt-3">
                            <Button onClick={() => setEditMode(true)}>Edit Profile</Button>
                        </div>
                    </div>
                )}
            </div>

            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-orange-50">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Change Password</h3>
                {passwordMessage && (
                    <div className={`p-3 rounded-xl mb-4 text-sm font-medium ${passwordMessage.includes('success') ? 'bg-teal-50 text-teal-700 border border-teal-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                        {passwordMessage}
                    </div>
                )}
                <div className="space-y-4">
                    <Input label="Current Password" type="password" value={passwordData.old_password} onChange={(e) => setPasswordData({ ...passwordData, old_password: e.target.value })} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="New Password" type="password" value={passwordData.new_password} onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })} />
                        <Input label="Confirm New Password" type="password" value={passwordData.confirm_password} onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })} />
                    </div>
                    <Button onClick={handlePasswordChange} disabled={savingPassword} variant="secondary">
                        {savingPassword ? 'Updating...' : 'Update Password'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
