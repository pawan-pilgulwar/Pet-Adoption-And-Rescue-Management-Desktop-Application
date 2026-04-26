import React, { useState, useEffect } from 'react';
import { fetchServices, createService } from '../../services/api';
import { Service } from '../../../types';
import Spinner from '../../../components/common/Spinner';
import Empty from '../../../components/common/Empty';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import { serviceSchema } from '../../../utils/validation';
import { z } from 'zod';

function ShopServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  // New Service Form
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchServices().then(setServices).finally(() => setLoading(false));
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    try {
      // Validate with Zod
      serviceSchema.parse({ name, description: desc, price });

      setSaving(true);
      await createService({ name, description: desc, price });
      const newData = await fetchServices();
      setServices(newData);
      setShowModal(false);
      setName('');
      setDesc('');
      setPrice('');
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.issues.forEach(e => {
          if (e.path[0]) fieldErrors[e.path[0].toString()] = e.message;
        });
        setErrors(fieldErrors);
      } else {
        alert("Failed to create service");
      }
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

      <div className={`${showModal ? 'blur-sm opacity-50 pointer-events-none' : ''}`}>
        {loading ? (
          <Spinner />
        ) : services.length === 0 ? (
          <div className="card">
            <Empty message="No services created yet." />
          </div>
        ) : (
          <div className="card overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Service Name</th>
                  <th>Price</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map(s => (
                  <tr key={s.id}>
                    <td className="font-semibold text-stone-900">{s.name}</td>
                    <td className="text-brand-500 font-bold">₹{s.price}</td>
                    <td className="text-stone-500 text-sm max-w-xs truncate">{s.description}</td>
                    <td>
                      <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50">Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center min-h-screen px-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full fade-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-stone-900">Add Service</h3>
              <button onClick={() => setShowModal(false)} className="text-stone-400 hover:text-stone-600">✕</button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <Input
                label="Service Name"
                value={name}
                onChange={e => setName(e.target.value)}
                error={errors.name}
                placeholder="e.g. Grooming, Vaccination"
              />
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-stone-700">Description</label>
                <textarea
                  className={`input-field resize-none ${errors.description ? 'border-red-500' : ''}`}
                  rows={3}
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                  placeholder="Tell us about this service..."
                />
                {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
              </div>
              <Input
                label="Price (₹)"
                type="number"
                step="0.01"
                value={price}
                onChange={e => setPrice(e.target.value)}
                error={errors.price}
                placeholder="0.00"
              />
              <div className="flex gap-3 justify-end mt-6">
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
