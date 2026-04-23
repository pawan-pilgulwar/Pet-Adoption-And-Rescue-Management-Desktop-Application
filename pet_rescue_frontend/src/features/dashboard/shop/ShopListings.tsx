import React, { useState, useEffect } from 'react';
import { fetchListings, createListing } from '../../adoption/api';
import { AdoptionListing, Pet } from '../../../types';
import Spinner from '../../../components/common/Spinner';
import Empty from '../../../components/common/Empty';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import ConfirmModal from '../../../components/common/ConfirmModal';
import api from '../../../services/api';

function ShopListings() {
  const [listings, setListings] = useState<AdoptionListing[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  // Form
  const [showModal, setShowModal] = useState(false);
  const [formPet, setFormPet] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      fetchListings(),
      api.get('/pets/all-pets/').then(r => r.data?.data?.Pets || [])
    ]).then(([lData, pData]) => {
      setListings(lData);
      setPets(pData);
    }).finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const newListing = await createListing({
        pet: Number(formPet),
        price: formPrice,
        description: formDesc
      });
      // Refresh listings
      const lData = await fetchListings();
      setListings(lData);
      setShowModal(false);
      setFormPet(''); setFormPrice(''); setFormDesc('');
    } catch (err) {
      alert('Failed to create listing');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Adoption Listings</h1>
          <p className="text-stone-500">Manage which pets are available for adoption.</p>
        </div>
        <Button onClick={() => setShowModal(true)}>+ New Listing</Button>
      </div>

      <div className={`${showModal ? 'blur-sm opacity-50 pointer-events-none' : ''}`}>
        {loading ? (
          <Spinner />
        ) : listings.length === 0 ? (
          <div className="card">
            <Empty message="No adoption listings created yet." />
          </div>
        ) : (
          <div className="card overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Pet</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Image</th>
                </tr>
              </thead>
              <tbody>
                {listings.map(l => (
                  <tr key={l.id}>
                    <td className="font-semibold text-stone-900">{l.pet_detail?.name}</td>
                    <td className="text-brand-500 font-bold">₹{l.price}</td>
                    <td>
                      <span className={`badge ${l.is_available ? 'badge-green' : 'badge-red'}`}>
                        {l.is_available ? 'Available' : 'Adopted'}
                      </span>
                    </td>
                    <td className="text-stone-500">{new Date(l.created_at).toLocaleDateString()}</td>
                    <td><img src={l.pet_detail?.image_url || undefined} alt={l.pet_detail?.name} className="w-20 h-20 object-cover" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Basic modal for creating listing */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center min-h-screen px-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full fade-in">
            <h3 className="text-lg font-bold text-stone-900 mb-4">Create Listing</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-stone-700">Select Pet</label>
                <select className="input-field" value={formPet} onChange={e => setFormPet(e.target.value)} required>
                  <option value="">Choose a pet...</option>
                  {pets.map(p => <option key={p.id} value={p.id}>{p.name} ({p.pet_id})</option>)}
                </select>
              </div>
              <Input label="Price (₹)" type="number" step="0.01" value={formPrice} onChange={e => setFormPrice(e.target.value)} required />
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-stone-700">Description</label>
                <textarea className="input-field resize-none" rows={3} value={formDesc} onChange={e => setFormDesc(e.target.value)} />
              </div>
              <div className="flex gap-3 justify-end mt-4">
                <Button variant="ghost" type="button" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type="submit" isLoading={saving}>Create</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShopListings;
