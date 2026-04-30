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
import ConfirmModal from '../../../components/ui/ConfirmModal';

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

  // Medical Fields
  const [serviceType, setServiceType] = useState<'General' | 'Medical'>('General');
  const [medicalType, setMedicalType] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [clinicAddress, setClinicAddress] = useState('');

  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Modal states
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
    onConfirm: () => { },
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
    setServiceType('General');
    setMedicalType('');
    setDoctorName('');
    setClinicAddress('');
  };

  const handleEdit = (service: Service) => {
    setName(service.name);
    setDesc(service.description);
    setPrice(service.price.toString());
    setDuration(service.duration || '');
    setImageUrl(service.image_url || '');
    setServiceType(service.service_type || 'General');
    setMedicalType(service.medical_type || '');
    setDoctorName(service.doctor_name || '');
    setClinicAddress(service.clinic_address || '');
    setIsEditing(true);
    setEditingId(service.id);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    showConfirm(
      "Delete Service",
      "Are you sure you want to delete this service? This action cannot be undone.",
      async () => {
        try {
          await deleteService(id);
          loadServices();
          showAlert("Deleted", "Service deleted successfully", "success");
        } catch {
          showAlert("Error", "Failed to delete service", "danger");
        }
      },
      'danger'
    );
  };

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
        image_url: finalImageUrl || undefined,
        service_type: serviceType,
        medical_type: serviceType === 'Medical' ? medicalType : undefined,
        doctor_name: serviceType === 'Medical' ? doctorName : undefined,
        clinic_address: serviceType === 'Medical' ? clinicAddress : undefined
      };

      if (isEditing && editingId) {
        await updateService(editingId, serviceData);
      } else {
        await createService(serviceData);
      }

      loadServices();
      setShowModal(false);
      resetForm();
      showAlert("Success", `Service ${isEditing ? 'updated' : 'created'} successfully!`, "success");
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.issues.forEach(e => {
          if (e.path[0]) fieldErrors[e.path[0].toString()] = e.message;
        });
        setErrors(fieldErrors);
      } else {
        showAlert("Error", `Failed to ${isEditing ? 'update' : 'create'} service`, "danger");
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
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-lg max-h-[80vh] overflow-y-auto w-full fade-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-stone-900">{isEditing ? 'Edit Service' : 'Add Service'}</h3>
              <button onClick={() => setShowModal(false)} className="text-stone-400 hover:text-stone-600">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-stone-700">Service Type</label>
                <select
                  className="input-field"
                  value={serviceType}
                  onChange={e => setServiceType(e.target.value as any)}
                >
                  <option value="General">General Service</option>
                  <option value="Medical">Medical Service</option>
                </select>
              </div>
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

              {serviceType === 'Medical' && (
                <div className="space-y-4 p-4 bg-brand-50/50 rounded-2xl border border-brand-100 fade-in">
                  <p className="text-xs font-bold text-brand-600 uppercase tracking-widest">Medical Details</p>
                  <Input
                    label="Medical Type"
                    value={medicalType}
                    onChange={e => setMedicalType(e.target.value)}
                    placeholder="e.g. Vaccination, Surgery"
                  />
                  <Input
                    label="Doctor Name"
                    value={doctorName}
                    onChange={e => setDoctorName(e.target.value)}
                    placeholder="Dr. John Doe"
                  />
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-stone-700">Clinic Address</label>
                    <textarea
                      className="input-field resize-none"
                      rows={2}
                      value={clinicAddress}
                      onChange={e => setClinicAddress(e.target.value)}
                      placeholder="Full clinic address..."
                    />
                  </div>
                </div>
              )}

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

export default ShopServices;
