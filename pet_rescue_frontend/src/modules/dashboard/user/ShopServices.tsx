import React, { useEffect, useState } from 'react';
import api, { uploadToCloudinary } from '../../../api/api';
import { Service, Booking } from '../../../types';
import ServiceCard from '../../services/components/ServiceCard';
import Spinner from '../../../components/common/Spinner';
import Empty from '../../../components/common/Empty';

const ShopServices: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState({ name: '', description: '', price: '' });
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get('/pet-services/').then(r => setServices(r.data.results || r.data || [])),
      api.get('/bookings/').then(r => setBookings(r.data.results || r.data || [])),
    ]).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const cancel = () => { setEditing(null); setForm({ name: '', description: '', price: '' }); setShowForm(false); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      let image_url = editing?.image_url || '';
      if (imgFile) { const up = await uploadToCloudinary(imgFile); image_url = up.url; }
      const payload = { ...form, image_url };
      if (editing) {
        const r = await api.put(`/pet-services/${editing.id}/`, payload);
        setServices(prev => prev.map(s => s.id === editing.id ? r.data : s));
      } else {
        const r = await api.post('/pet-services/', payload);
        setServices(prev => [...prev, r.data]);
      }
      cancel();
    } catch {}
    setSaving(false);
  };

  const del = async (id: number) => {
    if (!window.confirm('Delete this service?')) return;
    await api.delete(`/pet-services/${id}/`).catch(() => {});
    setServices(prev => prev.filter(s => s.id !== id));
  };

  const inputCls = "w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 bg-stone-50";
  const labelCls = "block text-sm font-medium text-stone-700 mb-1.5";

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-stone-900">My Services</h1>
          <p className="text-stone-500 text-sm mt-0.5">Manage your pet services and bookings</p>
        </div>
        <button onClick={() => showForm ? cancel() : setShowForm(true)}
          className="px-4 py-2 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-600 transition-colors text-sm shadow-sm">
          {showForm ? '✕ Cancel' : '+ Add Service'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSave} className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm space-y-4 fade-in">
          <h2 className="font-bold text-stone-900">{editing ? 'Edit Service' : 'Add New Service'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className={labelCls}>Service Name *</label><input required className={inputCls} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div><label className={labelCls}>Price ($) *</label><input type="number" required className={inputCls} value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} /></div>
            <div className="md:col-span-2"><label className={labelCls}>Description *</label><textarea required rows={2} className={`${inputCls} resize-none`} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
            <div><label className={labelCls}>Service Image</label><input type="file" accept="image/*" onChange={e => setImgFile(e.target.files?.[0] || null)} className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm bg-stone-50" /></div>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={cancel} className="px-5 py-2.5 bg-stone-100 text-stone-600 font-semibold rounded-xl text-sm">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-600 transition-colors disabled:opacity-60 text-sm">{saving ? 'Saving...' : editing ? 'Update' : 'Create Service'}</button>
          </div>
        </form>
      )}

      <div>
        <h2 className="font-bold text-stone-900 mb-4">Services ({services.length})</h2>
        {services.length === 0 ? <Empty icon="✂️" text="No services yet." /> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map(s => (
              <ServiceCard key={s.id} service={s} actions={
                <div className="flex gap-2 mt-3">
                  <button onClick={() => { setEditing(s); setForm({ name: s.name, description: s.description, price: s.price }); setShowForm(true); }}
                    className="flex-1 py-1.5 bg-stone-100 text-stone-600 text-xs font-semibold rounded-lg hover:bg-stone-200 transition-colors">Edit</button>
                  <button onClick={() => del(s.id)} className="flex-1 py-1.5 bg-red-50 text-red-500 text-xs font-semibold rounded-lg hover:bg-red-100 transition-colors">Delete</button>
                </div>
              } />
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="font-bold text-stone-900 mb-4">Bookings ({bookings.length})</h2>
        {bookings.length === 0 ? <Empty icon="🗓️" text="No bookings yet." /> : (
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-stone-50 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                  <th className="px-5 py-3 border-b border-stone-100">Service</th>
                  <th className="px-5 py-3 border-b border-stone-100">Customer</th>
                  <th className="px-5 py-3 border-b border-stone-100 hidden md:table-cell">Date</th>
                  <th className="px-5 py-3 border-b border-stone-100">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b: any) => (
                  <tr key={b.id} className="border-b border-stone-50 hover:bg-stone-50 transition-colors">
                    <td className="px-5 py-3.5 font-semibold text-stone-900 text-sm">{b.service_name}</td>
                    <td className="px-5 py-3.5 text-sm text-stone-600">{b.user_name}</td>
                    <td className="px-5 py-3.5 text-xs text-stone-400 hidden md:table-cell">{new Date(b.booking_date).toLocaleString()}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${b.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-600' : b.status === 'Cancelled' ? 'bg-red-50 text-red-500' : b.status === 'Completed' ? 'bg-stone-100 text-stone-500' : 'bg-amber-50 text-amber-600'}`}>{b.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopServices;
