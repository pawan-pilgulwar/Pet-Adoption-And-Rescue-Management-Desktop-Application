import React, { useState, useEffect } from 'react';
import { fetchServices, createService, fetchBookings } from '../../services/api';
import { Service } from '../../../types';
import Spinner from '../../../components/common/Spinner';
import Empty from '../../../components/common/Empty';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';

function ShopServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  // New Service Form
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchServices().then(setServices).finally(() => setLoading(false));
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await createService({ name, description: desc, price });
      const newData = await fetchServices();
      setServices(newData);
      setShowModal(false);
      setName('');
      setDesc('');
      setPrice('');
    } catch {
      alert("Failed to create service");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Pet Services</h1>
          <p className="text-stone-500">Manage the services your shop provides.</p>
        </div>
        <Button onClick={() => setShowModal(true)}>+ New Service</Button>
      </div>

      {loading ? (
        <Spinner />
      ) : services.length === 0 ? (
        <div className="card">
          <Empty message="No services created yet." />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(s => (
            <div key={s.id} className="card !p-5">
              <h3 className="font-bold text-stone-900 text-lg mb-1">{s.name}</h3>
              <p className="text-brand-500 font-bold text-lg mb-3">₹{s.price}</p>
              <p className="text-stone-500 text-sm line-clamp-2">{s.description}</p>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full fade-in">
            <h3 className="text-lg font-bold text-stone-900 mb-4">Add Service</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <Input label="Service Name" value={name} onChange={e => setName(e.target.value)} required />
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-stone-700">Description</label>
                <textarea className="input-field resize-none" rows={3} value={desc} onChange={e => setDesc(e.target.value)} required />
              </div>
              <Input label="Price (₹)" type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} required />
              <div className="flex gap-3 justify-end mt-4">
                <Button variant="ghost" type="button" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type="submit" isLoading={saving}>Add Service</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShopServices;
