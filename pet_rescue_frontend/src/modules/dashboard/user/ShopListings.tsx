import React, { useEffect, useState } from 'react';
import api, { imgUrl } from '../../../api/api';
import { AdoptionListing, AdoptionRequest, Pet } from '../../../types';
import Spinner from '../../../components/common/Spinner';
import Empty from '../../../components/common/Empty';

const ShopListings: React.FC = () => {
  const [listings, setListings] = useState<AdoptionListing[]>([]);
  const [requests, setRequests] = useState<AdoptionRequest[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ pet: '', price: '', description: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get('/adoption/listings/').then(r => setListings(r.data.data || [])),
      api.get('/adoption/requests/').then(r => setRequests(r.data.data || r.data.results || [])),
      api.get('/pets/all-pets/').then(r => setPets(r.data.data?.Pets || [])),
    ]).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const r = await api.post('/adoption/listings/', { pet: parseInt(form.pet), price: form.price, description: form.description });
      setListings(prev => [...prev, r.data]);
      setShowForm(false);
      setForm({ pet: '', price: '', description: '' });
    } catch {}
    setSaving(false);
  };

  const handleRequest = async (reqId: number, action: 'accept' | 'reject') => {
    try {
      if (action === 'accept') {
        await api.patch(`/adoption/requests/${reqId}/accept-request/`);
      } else {
        await api.post(`/adoption/requests/${reqId}/reject-request/`);
      }
      setRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: action === 'accept' ? 'Approved' : 'Rejected' } : r));
    } catch {}
  };

  const inputCls = "w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 bg-stone-50";
  const labelCls = "block text-sm font-medium text-stone-700 mb-1.5";

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-stone-900">Adoption Listings</h1>
          <p className="text-stone-500 text-sm mt-0.5">Manage your pet listings and requests</p>
        </div>
        <button onClick={() => setShowForm(s => !s)}
          className="px-4 py-2 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-600 transition-colors text-sm shadow-sm">
          {showForm ? '✕ Cancel' : '+ New Listing'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm space-y-4 fade-in">
          <h2 className="font-bold text-stone-900">Create Adoption Listing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Select Pet *</label>
              <select required className={inputCls} value={form.pet} onChange={e => setForm(f => ({ ...f, pet: e.target.value }))}>
                <option value="">Choose a pet...</option>
                {pets.map(p => <option key={p.id} value={p.id}>{p.name} ({p.species})</option>)}
              </select>
            </div>
            <div><label className={labelCls}>Adoption Price ($) *</label><input type="number" required className={inputCls} value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} /></div>
            <div className="md:col-span-2"><label className={labelCls}>Description</label><textarea rows={2} className={`${inputCls} resize-none`} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
          </div>
          <button type="submit" disabled={saving} className="px-6 py-2.5 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-600 transition-colors disabled:opacity-60 text-sm">{saving ? 'Creating...' : 'Create Listing'}</button>
        </form>
      )}

      {/* Listings */}
      <div>
        <h2 className="font-bold text-stone-900 mb-4">Active Listings ({listings.length})</h2>
        {listings.length === 0 ? <Empty icon="🏷️" text="No listings yet." /> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {listings.map(l => (
              <div key={l.id} className="bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-sm">
                <div className="h-40 bg-stone-100 overflow-hidden">
                  <img src={imgUrl(l.pet_detail?.image_url)} alt={l.pet_detail?.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-bold text-stone-900">{l.pet_detail?.name}</h3>
                    <span className="font-black text-brand-500">${l.price}</span>
                  </div>
                  <p className="text-xs text-stone-500 mb-2">{l.pet_detail?.species} · {l.pet_detail?.breed || '—'}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${l.is_available ? 'bg-emerald-50 text-emerald-600' : 'bg-stone-100 text-stone-500'}`}>
                    {l.is_available ? 'Available' : 'Unavailable'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Adoption Requests */}
      <div>
        <h2 className="font-bold text-stone-900 mb-4">Adoption Requests ({requests.length})</h2>
        {requests.length === 0 ? <Empty icon="📩" text="No adoption requests yet." /> : (
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-stone-50 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                  <th className="px-5 py-3 border-b border-stone-100">Pet</th>
                  <th className="px-5 py-3 border-b border-stone-100">Requester</th>
                  <th className="px-5 py-3 border-b border-stone-100 hidden md:table-cell">Date</th>
                  <th className="px-5 py-3 border-b border-stone-100">Status</th>
                  <th className="px-5 py-3 border-b border-stone-100 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map(req => (
                  <tr key={req.id} className="border-b border-stone-50 hover:bg-stone-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-stone-900 text-sm">{req.pet_detail?.name}</p>
                      <p className="text-xs text-stone-400">{req.pet_detail?.species}</p>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-stone-600">{req.user_detail}</td>
                    <td className="px-5 py-3.5 text-xs text-stone-400 hidden md:table-cell">{new Date(req.created_at).toLocaleDateString()}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${req.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' : req.status === 'Rejected' ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-600'}`}>{req.status}</span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {req.status === 'Pending' && (
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => handleRequest(req.id, 'accept')} className="px-3 py-1 bg-emerald-500 text-white text-xs font-semibold rounded-lg hover:bg-emerald-600 transition-colors">Accept</button>
                          <button onClick={() => handleRequest(req.id, 'reject')} className="px-3 py-1 bg-red-50 text-red-500 text-xs font-semibold rounded-lg hover:bg-red-100 transition-colors">Reject</button>
                        </div>
                      )}
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

export default ShopListings;
