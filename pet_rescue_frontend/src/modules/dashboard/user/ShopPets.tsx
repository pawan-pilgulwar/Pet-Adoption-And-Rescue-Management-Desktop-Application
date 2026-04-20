import React, { useEffect, useState } from 'react';
import api, { uploadToCloudinary } from '../../../api/api';
import { Pet } from '../../../types';
import PetCard from '../../adoption/components/PetCard';
import Spinner from '../../../components/common/Spinner';
import Empty from '../../../components/common/Empty';

const emptyForm = { name: '', species: '', breed: '', color: '', age: '', gender: '', size: '', description: '', vaccination_status: '' };

const ShopPets: React.FC = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Pet | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/pets/all-pets/').then(r => setPets(r.data.data?.Pets || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const openEdit = (pet: Pet) => {
    setEditing(pet);
    setForm({ name: pet.name, species: pet.species, breed: pet.breed || '', color: pet.color || '', age: pet.age?.toString() || '', gender: pet.gender || '', size: pet.size || '', description: pet.description || '', vaccination_status: pet.vaccination_status || '' });
    setShowForm(true);
  };

  const cancel = () => { setEditing(null); setForm(emptyForm); setShowForm(false); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      let image_url = editing?.image_url || '';
      let image_public_id = editing?.image_public_id || '';
      if (imgFile) { const up = await uploadToCloudinary(imgFile); image_url = up.url; image_public_id = up.public_id; }
      const payload = { ...form, age: form.age ? parseInt(form.age) : null, image_url, image_public_id };
      if (editing) {
        const r = await api.put(`/pets/${editing.id}/admin-update-pet/`, payload);
        setPets(prev => prev.map(p => p.id === editing.id ? r.data.data : p));
      } else {
        const r = await api.post('/pets/admin-register-pet/', payload);
        setPets(prev => [...prev, r.data.data]);
      }
      cancel();
    } catch {}
    setSaving(false);
  };

  const del = async (id: number) => {
    if (!window.confirm('Delete this pet?')) return;
    await api.delete(`/pets/${id}/admin-delete-pet/`).catch(() => {});
    setPets(prev => prev.filter(p => p.id !== id));
  };

  const inputCls = "w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 bg-stone-50";
  const labelCls = "block text-sm font-medium text-stone-700 mb-1.5";

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-stone-900">My Pets</h1>
          <p className="text-stone-500 text-sm mt-0.5">Manage your registered pets</p>
        </div>
        <button onClick={() => showForm ? cancel() : setShowForm(true)}
          className="px-4 py-2 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-600 transition-colors text-sm shadow-sm">
          {showForm ? '✕ Cancel' : '+ Add Pet'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSave} className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm space-y-4 fade-in">
          <h2 className="font-bold text-stone-900">{editing ? 'Edit Pet' : 'Register New Pet'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className={labelCls}>Name *</label><input required className={inputCls} value={form.name} onChange={e => set('name', e.target.value)} /></div>
            <div><label className={labelCls}>Species *</label><input required className={inputCls} placeholder="Dog, Cat..." value={form.species} onChange={e => set('species', e.target.value)} /></div>
            <div><label className={labelCls}>Breed</label><input className={inputCls} value={form.breed} onChange={e => set('breed', e.target.value)} /></div>
            <div><label className={labelCls}>Color</label><input className={inputCls} value={form.color} onChange={e => set('color', e.target.value)} /></div>
            <div><label className={labelCls}>Age</label><input type="number" className={inputCls} value={form.age} onChange={e => set('age', e.target.value)} /></div>
            <div><label className={labelCls}>Gender</label><input className={inputCls} value={form.gender} onChange={e => set('gender', e.target.value)} /></div>
            <div><label className={labelCls}>Size</label><input className={inputCls} value={form.size} onChange={e => set('size', e.target.value)} /></div>
            <div><label className={labelCls}>Vaccination Status</label><input className={inputCls} value={form.vaccination_status} onChange={e => set('vaccination_status', e.target.value)} /></div>
            <div className="md:col-span-2"><label className={labelCls}>Description</label><textarea rows={2} className={`${inputCls} resize-none`} value={form.description} onChange={e => set('description', e.target.value)} /></div>
            <div><label className={labelCls}>Pet Image</label><input type="file" accept="image/*" onChange={e => setImgFile(e.target.files?.[0] || null)} className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm bg-stone-50" /></div>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={cancel} className="px-5 py-2.5 bg-stone-100 text-stone-600 font-semibold rounded-xl text-sm">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-600 transition-colors disabled:opacity-60 text-sm">{saving ? 'Saving...' : editing ? 'Update Pet' : 'Register Pet'}</button>
          </div>
        </form>
      )}

      {loading ? <Spinner /> : pets.length === 0 ? <Empty icon="🐾" text="No pets registered yet." /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {pets.map(p => (
            <PetCard key={p.id} pet={p} actions={
              <div className="flex gap-2">
                <button onClick={() => openEdit(p)} className="flex-1 py-1.5 bg-stone-100 text-stone-600 text-xs font-semibold rounded-lg hover:bg-stone-200 transition-colors">Edit</button>
                <button onClick={() => del(p.id)} className="flex-1 py-1.5 bg-red-50 text-red-500 text-xs font-semibold rounded-lg hover:bg-red-100 transition-colors">Delete</button>
              </div>
            } />
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopPets;
