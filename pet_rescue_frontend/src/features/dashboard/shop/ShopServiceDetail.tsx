import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import { Service } from '../../../types';
import Spinner from '../../../components/common/Spinner';
import DetailLayout from '../../../components/common/DetailLayout';
import Button from '../../../components/common/Button';

function ShopServiceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      api.get(`/pet-services/${id}/`)
        .then(res => setService(res.data))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [id]);

  async function handleDelete() {
    if (!window.confirm(`Are you sure you want to delete the service "${service?.name}"?`)) return;
    try {
      await api.delete(`/pet-services/${id}/`);
      alert("Service deleted successfully");
      navigate('/dashboard/services');
    } catch {
      alert("Failed to delete service");
    }
  }

  if (loading) return <Spinner message="Loading service details..." />;
  if (!service) return <div className="p-8 text-center text-red-500">Service not found</div>;

  return (
    <DetailLayout
      title={service.name}
      subtitle={`Price: ₹${service.price}`}
      backLink="/dashboard/services"
      backText="Back to Services"
      image={service.image_url || undefined}
      imageFallback="🏥"
      stats={[
        { label: 'Duration', value: service.duration || 'Flexible' },
        { label: 'Created', value: new Date(service.created_at).toLocaleDateString() }
      ]}
      actions={
        <Button variant="outline" className="text-red-500 hover:bg-red-50 border-red-200" onClick={handleDelete}>
          Delete Service
        </Button>
      }
    >
      <section>
        <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-4">Service Description</h3>
        <p className="text-stone-700 leading-relaxed">
          {service.description}
        </p>
      </section>

      <hr className="border-stone-100" />

      <section>
        <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-4">Availability / Schedules</h3>
        {service.schedules && service.schedules.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {service.schedules.map(sch => (
              <div key={sch.id} className="bg-stone-50 p-4 rounded-2xl border border-stone-100">
                <p className="font-bold text-stone-900">{sch.day}</p>
                <p className="text-sm text-stone-500">{sch.start_time} - {sch.end_time}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-stone-500 italic">No specific schedules defined for this service.</p>
        )}
      </section>
    </DetailLayout>
  );
}

export default ShopServiceDetail;
