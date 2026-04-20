import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { uploadToCloudinary } from '../../../api/api';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<'USER' | 'SHOP_OWNER'>('USER');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    username: '', email: '', first_name: '', last_name: '', password: '', confirm_password: '',
    phone_number: '', address: '',
    shop_name: '', shop_address: '', shop_license: '',
  });

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm_password) { setError('Passwords do not match'); return; }
    setLoading(true); setError('');
    try {
      let profile_picture_url = '';
      let profile_picture_public_id = '';
      if (imgFile) {
        const up = await uploadToCloudinary(imgFile);
        profile_picture_url = up.url;
        profile_picture_public_id = up.public_id;
      }
      const payload: any = {
        username: form.username, email: form.email,
        first_name: form.first_name, last_name: form.last_name,
        password: form.password, role,
        profile_picture_url, profile_picture_public_id,
      };
      if (role === 'USER') {
        payload.phone_number = form.phone_number;
        payload.address = form.address;
      } else {
        payload.shop_name = form.shop_name;
        payload.shop_address = form.shop_address;
        payload.shop_license = form.shop_license;
        payload.phone_number = form.phone_number;
      }
      await api.post('/users/register/', payload);
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 bg-stone-50";
  const labelCls = "block text-sm font-medium text-stone-700 mb-1.5";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-stone-50">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-brand-500 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 shadow-lg shadow-brand-500/20">🐾</div>
          <h1 className="text-2xl font-black text-stone-900">Create Account</h1>
          <p className="text-stone-500 text-sm mt-1">Join the PetRescue community</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100">
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-5 text-sm border border-red-100">{error}</div>}

          {/* Role selector */}
          <div className="flex gap-3 mb-6">
            {(['USER', 'SHOP_OWNER'] as const).map(r => (
              <button key={r} type="button" onClick={() => setRole(r)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all ${role === r ? 'bg-brand-500 text-white border-brand-500' : 'bg-stone-50 text-stone-600 border-stone-200 hover:border-brand-300'}`}>
                {r === 'USER' ? '👤 Pet Owner' : '🏪 Shop Owner'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className={labelCls}>First Name</label><input required className={inputCls} value={form.first_name} onChange={e => set('first_name', e.target.value)} /></div>
              <div><label className={labelCls}>Last Name</label><input required className={inputCls} value={form.last_name} onChange={e => set('last_name', e.target.value)} /></div>
              <div><label className={labelCls}>Username</label><input required className={inputCls} value={form.username} onChange={e => set('username', e.target.value)} /></div>
              <div><label className={labelCls}>Email</label><input type="email" required className={inputCls} value={form.email} onChange={e => set('email', e.target.value)} /></div>
              <div><label className={labelCls}>Password</label><input type="password" required className={inputCls} value={form.password} onChange={e => set('password', e.target.value)} /></div>
              <div><label className={labelCls}>Confirm Password</label><input type="password" required className={inputCls} value={form.confirm_password} onChange={e => set('confirm_password', e.target.value)} /></div>
            </div>

            {role === 'USER' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-stone-50 rounded-xl border border-stone-100">
                <div><label className={labelCls}>Phone Number</label><input required className={inputCls} value={form.phone_number} onChange={e => set('phone_number', e.target.value)} /></div>
                <div><label className={labelCls}>Address</label><input required className={inputCls} value={form.address} onChange={e => set('address', e.target.value)} /></div>
              </div>
            )}

            {role === 'SHOP_OWNER' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-brand-50 rounded-xl border border-brand-100">
                <div><label className={labelCls}>Shop Name</label><input required className={inputCls} value={form.shop_name} onChange={e => set('shop_name', e.target.value)} /></div>
                <div><label className={labelCls}>Shop Address</label><input required className={inputCls} value={form.shop_address} onChange={e => set('shop_address', e.target.value)} /></div>
                <div><label className={labelCls}>Phone Number</label><input required className={inputCls} value={form.phone_number} onChange={e => set('phone_number', e.target.value)} /></div>
                <div><label className={labelCls}>Shop License</label><input required className={inputCls} value={form.shop_license} onChange={e => set('shop_license', e.target.value)} /></div>
              </div>
            )}

            <div>
              <label className={labelCls}>Profile Picture (optional)</label>
              <input type="file" accept="image/*" onChange={e => setImgFile(e.target.files?.[0] || null)}
                className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm bg-stone-50" />
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-600 transition-colors disabled:opacity-60 text-sm mt-2">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-stone-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-500 font-semibold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
