import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { fetchServices, createService, updateService, deleteService } from '../../services/api';
import { Service } from '../../../types';
import Spinner from '../../../components/common/Spinner';
import Empty from '../../../components/common/Empty';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import SearchBar from '../../../components/common/SearchBar';
import { uploadImage } from '../../../utils/cloudinary';
import { serviceSchema } from '../../../utils/validation';
import { z } from 'zod';

interface ShopServicesProps {
  allServices?: boolean;
}

function ShopServices({ allServices = false }: ShopServicesProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Service Form State
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const loadServices = () => {
    setLoading(true);
    // If allServices is true, we fetch all services (myServices = false)
    // If allServices is false (default for shop), we fetch only my services (myServices = true)
    fetchServices(!allServices).then(setServices).finally(() => setLoading(false));
  };

  useEffect(() => {
    loadServices();
  }, []);

  const resetForm = () => {
    setName('');
    setDesc('');
    setPrice('');
    setDuration('');
    setImageUrl('');
    setImageFile(null);
    if (fileRef.current) fileRef.current.value = '';
    setErrors({});
    setIsEditing(false);
    setEditingId(null);
  };

  const handleEdit = (service: Service) => {
    setName(service.name);
    setDesc(service.description);
    setPrice(service.price.toString());
    setDuration(service.duration || '');
    setImageUrl(service.image_url || '');
    setIsEditing(true);
    setEditingId(service.id);
    setShowModal(true);
  };

  async function handleDelete(id: number) {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    try {
      await deleteService(id);
      loadServices();
    } catch {
      alert("Failed to delete service");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    try {
      // Validate with Zod
      serviceSchema.parse({ name, description: desc, price, duration });

      setSaving(true);
      
      let finalImageUrl = imageUrl;
      if (imageFile) {
        const uploadRes = await uploadImage(imageFile);
        finalImageUrl = uploadRes.url;
      }

      const serviceData = { 
        name, 
        description: desc, 
        price, 
        duration: duration || undefined,
        image_url: finalImageUrl || undefined
      };

      if (isEditing && editingId) {
        await updateService(editingId, serviceData);
      } else {
        await createService(serviceData);
      }

      loadServices();
      setShowModal(false);
      resetForm();
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.issues.forEach(e => {
          if (e.path[0]) fieldErrors[e.path[0].toString()] = e.message;
        });
        setErrors(fieldErrors);
      } else {
        alert(`Failed to ${isEditing ? 'update' : 'create'} service`);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">{allServices ? 'Global Services' : 'Pet Services'}</h1>
          <p className="text-stone-500">
            {allServices 
              ? 'Manage all pet services offered by all shop owners.' 
              : 'Manage the services your shop provides.'}
          </p>
        </div>
        <Button onClick={() => { resetForm(); setShowModal(true); }}>+ New Service</Button>
      </div>

      <div className={`${showModal ? 'blur-sm opacity-50 pointer-events-none' : ''}`}>
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by service name..."
        />

        {loading ? (
          <Spinner />
        ) : services.length === 0 ? (
          <div className="card">
            <Empty message={allServices ? "No services found in the system." : "No services created yet."} />
          </div>
        ) : (
          <div className="card overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Price</th>
                  <th>Duration</th>
                  {allServices && <th>Owner</th>}
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {services
                  .filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map(s => (
                    <tr key={s.id} className="hover:bg-stone-50/50 transition-colors">
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                            {s.image_url ? (
                              <img src={s.image_url} alt={s.name} className="h-full w-full object-cover" />
                            ) : (
                              <span className="flex items-center justify-center h-full text-xl">✂️</span>
                            )}
                          </div>
                          <Link to={`/dashboard/services/${s.id}`} className="font-semibold text-stone-900 hover:text-brand-500">
                            {s.name}
                          </Link>
                        </div>
                      </td>
                      <td className="text-brand-500 font-bold">₹{s.price}</td>
                      <td className="text-stone-500 text-sm">{s.duration || '-'}</td>
                      {allServices && <td className="text-stone-500 text-sm italic">{s.owner_name || 'Admin'}</td>}
                      <td className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" className="text-stone-600" onClick={() => handleEdit(s)}>Edit</Button>
                          <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50" onClick={() => handleDelete(s.id)}>Delete</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center min-h-screen px-4 overflow-y-auto pt-10 pb-10">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full fade-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-stone-900">{isEditing ? 'Edit Service' : 'Add Service'}</h3>
              <button onClick={() => setShowModal(false)} className="text-stone-400 hover:text-stone-600">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Service Name"
                value={name}
                onChange={e => setName(e.target.value)}
                error={errors.name}
                placeholder="e.g. Grooming, Vaccination"
                required
              />
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-stone-700">Description</label>
                <textarea
                  className={`input-field resize-none ${errors.description ? 'border-red-500' : ''}`}
                  rows={3}
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                  placeholder="Tell us about this service..."
                  required
                />
                {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Price (₹)"
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  error={errors.price}
                  placeholder="0.00"
                  required
                />
                <Input
                  label="Duration"
                  value={duration}
                  onChange={e => setDuration(e.target.value)}
                  error={errors.duration}
                  placeholder="e.g. 1 hour"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-stone-700 block mb-1">Service Photo</label>
                {imageUrl && !imageFile && (
                  <div className="mb-2 relative w-20 h-20 rounded-lg overflow-hidden border border-stone-200">
                    <img src={imageUrl} alt="Current" className="w-full h-full object-cover" />
                    <button 
                      type="button" 
                      onClick={() => setImageUrl('')}
                      className="absolute top-0 right-0 bg-red-500 text-white p-0.5 text-[10px]"
                    >✕</button>
                  </div>
                )}
                <input 
                  type="file" 
                  ref={fileRef} 
                  onChange={e => setImageFile(e.target?.files?.[0] || null)} 
                  className="text-xs w-full" 
                  accept="image/*" 
                />
              </div>

              <div className="flex gap-3 justify-end mt-6">
                <Button variant="ghost" type="button" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type="submit" isLoading={saving}>{isEditing ? 'Update Service' : 'Add Service'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShopServices;
