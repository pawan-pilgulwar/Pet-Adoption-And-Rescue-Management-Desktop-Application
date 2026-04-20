import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { uploadToCloudinary } from '../../../api/api';

const CreateReport: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    report_type: 'Lost',
    location: '',
    description: '',
    pet_name: '', species: '', breed: '', color: '',
    age: '', gender: '', size: '',
  });

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      let image_url = '';
      let image_public_id = '';
      if (imgFile) {
        const up = await uploadToCloudinary(imgFile);
        image_url = up.url;
        image_public_id = up.public_id;
      }
      await api.post('/rescue/reports/', {
        report_type: form.report_type,
        location: form.location,
        description: form.description,
        pet_data: {
          name: form.pet_name, species: form.species, breed: form.breed,
          color: form.color, age: form.age ? parseInt(form.age) : null,
          gender: form.gender, size: form.size,
          image_url, image_public_id,
        },
      });
      navigate('/dashboard/reports');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 bg-stone-50";
  const labelCls = "block text-sm font-medium text-stone-700 mb-1.5";

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <h1 className="text-2xl font-black text-stone-900">File a Rescue Report</h1>
        <p className="text-stone-500 text-sm mt-0.5">Report a lost or found pet to help them get home safely.</p>
      </div>
      {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100">{error}</div>}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Pet Name</label>
            <input required className={inputCls} value={form.pet_name} onChange={e => set('pet_name', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Report Type</label>
            <select className={inputCls} value={form.report_type} onChange={e => set('report_type', e.target.value)}>
              <option value="Lost">🔍 Lost</option>
              <option value="Found">✅ Found</option>
            </select>
          </div>
        </div>

        <div className="p-4 bg-stone-50 rounded-xl border border-stone-100">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">Pet Details</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className={labelCls}>Species *</label><input required className={inputCls} placeholder="Dog, Cat..." value={form.species} onChange={e => set('species', e.target.value)} /></div>
            <div><label className={labelCls}>Breed</label><input className={inputCls} value={form.breed} onChange={e => set('breed', e.target.value)} /></div>
            <div><label className={labelCls}>Color</label><input className={inputCls} value={form.color} onChange={e => set('color', e.target.value)} /></div>
            <div><label className={labelCls}>Age</label><input type="number" className={inputCls} value={form.age} onChange={e => set('age', e.target.value)} /></div>
            <div><label className={labelCls}>Gender</label><input className={inputCls} value={form.gender} onChange={e => set('gender', e.target.value)} /></div>
            <div><label className={labelCls}>Size</label><input className={inputCls} placeholder="Small, Medium, Large" value={form.size} onChange={e => set('size', e.target.value)} /></div>
          </div>
        </div>

        <div><label className={labelCls}>Location *</label><input required className={inputCls} placeholder="Last seen / found location" value={form.location} onChange={e => set('location', e.target.value)} /></div>
        <div>
          <label className={labelCls}>Description *</label>
          <textarea required rows={3} className={`${inputCls} resize-none`} placeholder="Describe the pet and circumstances..." value={form.description} onChange={e => set('description', e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Pet Image</label>
          <input type="file" accept="image/*" onChange={e => setImgFile(e.target.files?.[0] || null)} className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm bg-stone-50" />
        </div>

        <div className="flex gap-3">
          <button type="button" onClick={() => navigate(-1)} className="px-5 py-2.5 bg-stone-100 text-stone-600 font-semibold rounded-xl hover:bg-stone-200 transition-colors text-sm">Cancel</button>
          <button type="submit" disabled={loading} className="flex-1 py-2.5 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-600 transition-colors disabled:opacity-60 text-sm">
            {loading ? 'Submitting...' : 'Submit Report'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateReport;
