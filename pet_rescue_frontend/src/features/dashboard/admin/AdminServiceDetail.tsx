import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import { Service, ShopOwnerProfile } from '../../../types';

import Spinner from '../../../components/common/Spinner';
import DetailLayout from '../../../components/common/DetailLayout';
import Button from '../../../components/common/Button';
import ConfirmModal from '../../../components/ui/ConfirmModal';

function AdminServiceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    if (id) {
      api.get(`/pet-services/${id}/`)
        .then(res => setService(res.data))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleDelete = () => {
    showConfirm(
      "Delete Service",
      `Are you sure you want to delete the service "${service?.name}"?`,
      async () => {
        try {
          await api.delete(`/pet-services/${id}/`);
          navigate('/admin/services');
        } catch {
          showAlert("Error", "Failed to delete service", "danger");
        }
      },
      'danger'
    );
  };

  if (loading) return <Spinner message="Loading service details..." />;
  if (!service) return <div className="p-8 text-center text-red-500">Service not found</div>;

  const creator = service.created_by;

  return (
    <DetailLayout
      title={service.name}
      subtitle={`Price: ₹${service.price}`}
      backLink="/admin/services"
      backText="Back to Services"
      image={service.image_url || undefined}
      imageFallback="🏥"
      stats={[
        { label: 'Type', value: service.service_type },
        { label: 'Duration', value: service.duration || 'Flexible' },
        { label: 'Created', value: new Date(service.created_at).toLocaleDateString() }
      ]}
      actions={
        <Button variant="outline" className="text-red-500 hover:bg-red-50 border-red-200" onClick={handleDelete}>
          Delete Service
        </Button>
      }
    >
      <div className="space-y-12">
        <section>
          <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-4">Service Description</h3>
          <p className="text-stone-700 leading-relaxed bg-stone-50 p-6 rounded-3xl border border-stone-100 italic">
            "{service.description}"
          </p>
        </section>

        <hr className="border-stone-100" />

        <div className="grid md:grid-cols-2 gap-8">
          {service.service_type === 'Medical' && (
             <section>
                <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-6">Medical Information</h3>
                <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 space-y-4">
                  <div>
                    <p className="text-[10px] text-blue-400 uppercase font-bold mb-1">Medical Type</p>
                    <p className="font-bold text-blue-900">{service.medical_type || 'General Medical'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-blue-400 uppercase font-bold mb-1">Doctor Name</p>
                    <p className="font-bold text-blue-900">{service.doctor_name || '—'}</p>
                  </div>
                   <div>
                    <p className="text-[10px] text-blue-400 uppercase font-bold mb-1">Clinic Address</p>
                    <p className="text-sm text-blue-800 font-medium">{service.clinic_address || '—'}</p>
                  </div>
                </div>
             </section>
          )}

          <section>
            <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-6">Provider / Shop Details</h3>
            <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-stone-100 overflow-hidden border border-stone-200">
                  {creator.profile?.profile_picture_url ? (
                    <img src={creator.profile.profile_picture_url} alt={creator.username} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-400 font-bold text-lg uppercase">
                      {creator.username.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-bold text-stone-900">{(creator.profile as ShopOwnerProfile)?.shop_name || creator.username}</p>
                  <p className="text-stone-500 text-xs">@{creator.username} • {creator.role}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-stone-500">Contact Person:</span>
                  <span className="text-stone-900 font-medium">{creator.first_name} {creator.last_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Email:</span>
                  <span className="text-stone-900 font-medium">{creator.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Phone:</span>
                  <span className="text-stone-900 font-medium">
                    {(creator.profile as ShopOwnerProfile)?.phone_number || '—'}
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>

        <hr className="border-stone-100" />

        <section>
          <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-6">Availability / Schedules</h3>
          {service.schedules && service.schedules.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {service.schedules.map(sch => (
                <div key={sch.id} className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm text-center">
                  <p className="text-[10px] text-stone-400 uppercase font-bold mb-1">{sch.day}</p>
                  <p className="font-bold text-stone-900 text-sm">{sch.start_time.substring(0, 5)} - {sch.end_time.substring(0, 5)}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-stone-50 p-6 rounded-3xl border border-stone-100 text-center">
              <p className="text-stone-500 italic text-sm">No specific schedules defined for this service.</p>
            </div>
          )}
        </section>
      </div>


      <ConfirmModal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        onConfirm={modalConfig.onConfirm}
        onCancel={modalConfig.onCancel}
        type={modalConfig.type}
      />
    </DetailLayout>
  );
}

export default AdminServiceDetail;
