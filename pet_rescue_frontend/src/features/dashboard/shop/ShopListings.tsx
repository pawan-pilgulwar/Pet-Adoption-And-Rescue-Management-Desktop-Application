import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AdoptionListing, Pet } from '../../../types';
import Spinner from '../../../components/common/Spinner';
import Empty from '../../../components/common/Empty';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import SearchBar from '../../../components/common/SearchBar';
import api from '../../../services/api';
import { listingSchema } from '../../../utils/validation';
import { z } from 'zod';
import ConfirmModal from '../../../components/ui/ConfirmModal';

function ShopListings() {
  const [listings, setListings] = useState<AdoptionListing[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Form
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formPet, setFormPet] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formAvailable, setFormAvailable] = useState(true);

  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel?: () => void;
    type?: 'danger' | 'info' | 'success';
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const showConfirm = (title: string, message: string, onConfirm: () => void, type: 'danger' | 'info' | 'success' = 'info') => {
    setModalConfig({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        onConfirm();
        setModalConfig(prev => ({ ...prev, isOpen: false }));
      },
      onCancel: () => setModalConfig(prev => ({ ...prev, isOpen: false })),
      type
    });
  };

  const showAlert = (title: string, message: string, type: 'info' | 'success' | 'danger' = 'info') => {
    setModalConfig({
      isOpen: true,
      title,
      message,
      onConfirm: () => setModalConfig(prev => ({ ...prev, isOpen: false })),
      type
    });
  };

  const loadData = () => {
    setLoading(true);
    Promise.all([
      api.get('/adoption/listings/?my_listings=true').then(res => res.data?.results || res.data || []),
      api.get('/pets/all-pets/?my_pets=true').then(r => r.data?.data?.Pets || [])
    ]).then(([lData, pData]) => {
      setListings(lData);
      setPets(pData);
    }).finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setFormPet('');
    setFormPrice('');
    setFormDesc('');
    setFormAvailable(true);
    setErrors({});
    setIsEditing(false);
    setEditingId(null);
  };

  const handleEdit = (l: AdoptionListing) => {
    setFormPet(l.pet.toString());
    setFormPrice(l.price.toString());
    setFormDesc(l.description || '');
    setFormAvailable(l.is_available);
    setIsEditing(true);
    setEditingId(l.id);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    showConfirm(
      "Remove Listing",
      "Are you sure you want to delete this adoption listing? This cannot be undone.",
      async () => {
        try {
          await api.delete(`/adoption/listings/${id}/`);
          loadData();
          showAlert("Deleted", "Listing removed successfully", "success");
        } catch {
          showAlert("Error", "Failed to delete listing", "danger");
        }
      },
      'danger'
    );
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    try {
      // Validate
      listingSchema.parse({ pet: formPet, price: formPrice, description: formDesc });

      setSaving(true);
      const data = {
        pet: Number(formPet),
        price: formPrice,
        description: formDesc,
        is_available: formAvailable
      };

      if (isEditing && editingId) {
        await api.patch(`/adoption/listings/${editingId}/`, data);
      } else {
        await api.post('/adoption/listings/', data);
      }

      loadData();
      setShowModal(false);
      resetForm();
      showAlert("Success", `Listing ${isEditing ? 'updated' : 'created'} successfully!`, "success");
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.issues.forEach(e => {
          if (e.path[0]) fieldErrors[e.path[0].toString()] = e.message;
        });
        setErrors(fieldErrors);
      } else {
        showAlert("Error", `Failed to ${isEditing ? 'update' : 'create'} listing`, "danger");
      }
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
        <Button onClick={() => { resetForm(); setShowModal(true); }}>+ New Listing</Button>
      </div>

      <div className={`${showModal ? 'blur-sm opacity-50 pointer-events-none' : ''}`}>
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by pet name..."
        />

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
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {listings
                  .filter(l => l.pet_detail?.name.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map(l => (
                    <tr key={l.id} className="hover:bg-stone-50/50 transition-colors">
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg overflow-hidden shrink-0 bg-orange-50">
                            {l.pet_detail?.image_url ? (
                              <img src={l.pet_detail?.image_url} alt={l.pet_detail?.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="flex items-center justify-center h-full">🐾</span>
                            )}
                          </div>
                          <Link to={`/dashboard/listings/${l.id}`} className="font-semibold text-stone-900 hover:text-brand-500">
                            {l.pet_detail?.name}
                          </Link>
                        </div>
                      </td>
                      <td className="text-brand-500 font-bold">₹{l.price}</td>
                      <td>
                        <span className={`badge ${l.is_available ? 'badge-green' : 'badge-red'}`}>
                          {l.is_available ? 'Available' : 'Adopted'}
                        </span>
                      </td>
                      <td className="text-stone-500 text-sm">{new Date(l.created_at).toLocaleDateString()}</td>
                      <td className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" className="text-stone-600" onClick={() => handleEdit(l)}>Edit</Button>
                          <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50" onClick={() => handleDelete(l.id)}>Delete</Button>
                        </div>
                      </td>
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
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-stone-900">{isEditing ? 'Edit Listing' : 'Create Listing'}</h3>
              <button onClick={() => setShowModal(false)} className="text-stone-400 hover:text-stone-600">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-stone-700">Select Pet</label>
                <select
                  className={`input-field ${errors.pet ? 'border-red-500' : ''}`}
                  value={formPet}
                  onChange={e => setFormPet(e.target.value)}
                  disabled={isEditing}
                >
                  <option value="">Choose a pet...</option>
                  {pets.map(p => <option key={p.id} value={p.id}>{p.name} ({p.pet_id})</option>)}
                </select>
                {errors.pet && <p className="text-xs text-red-500 mt-1">{errors.pet}</p>}
              </div>
              <Input
                label="Price (₹)"
                type="number"
                step="0.01"
                value={formPrice}
                onChange={e => setFormPrice(e.target.value)}
                error={errors.price}
                placeholder="0.00"
              />
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-stone-700">Description</label>
                <textarea
                  className={`input-field resize-none ${errors.description ? 'border-red-500' : ''}`}
                  rows={3}
                  value={formDesc}
                  onChange={e => setFormDesc(e.target.value)}
                  placeholder="Tell us about this pet..."
                />
                {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
              </div>

              {isEditing && (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_available"
                    checked={formAvailable}
                    onChange={e => setFormAvailable(e.target.checked)}
                    className="rounded border-stone-300 text-brand-500 focus:ring-brand-500"
                  />
                  <label htmlFor="is_available" className="text-sm text-stone-700">Is Available for Adoption</label>
                </div>
              )}

              <div className="flex gap-3 justify-end mt-6">
                <Button variant="ghost" type="button" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type="submit" isLoading={saving}>{isEditing ? 'Update' : 'Create'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        onConfirm={modalConfig.onConfirm}
        onCancel={modalConfig.onCancel}
        type={modalConfig.type}
      />
    </div>
  );
}

export default ShopListings;
