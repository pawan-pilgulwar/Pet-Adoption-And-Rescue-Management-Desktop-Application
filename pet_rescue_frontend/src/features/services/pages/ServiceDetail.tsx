import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchServiceDetail } from '../api';
import { Service } from '../../../types';
import { useAuth } from '../../../context/AuthContext';
import Spinner from '../../../components/common/Spinner';
import Button from '../../../components/common/Button';

function ServiceDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchServiceDetail(Number(id))
      .then(data => setService(data))
      .catch(() => setService(null))
      .finally(() => setLoading(false));
  }, [id]);

  function handleBook() {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate('/booking', { state: { service } });
  }

  if (loading) return <div className="py-20"><Spinner message="Loading service details..." /></div>;
  if (!service) return (
    <div className="max-w-3xl mx-auto px-6 py-20 text-center">
      <p className="text-stone-500">Service not found. <Link to="/services" className="text-brand-500 hover:underline">Go back</Link></p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 fade-in">
      {/* Breadcrumb */}
      <p className="text-sm text-stone-500 mb-6">
        <Link to="/services" className="hover:text-brand-500">Services</Link> › {service.name}
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Service Image */}
        <div className="aspect-square rounded-2xl overflow-hidden bg-orange-50 flex items-center justify-center">
          {service.image_url ? (
            <img src={service.image_url} alt={service.name} className="w-full h-full object-cover" />
          ) : (
            <div className="text-8xl">🛠️</div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-extrabold text-stone-900">{service.name}</h1>
            <p className="text-brand-500 text-2xl font-bold mt-2">₹{service.price}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-stone-700">Description</p>
            <p className="text-stone-500 text-sm leading-relaxed">{service.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-orange-50 rounded-xl px-4 py-3">
              <p className="text-xs text-stone-400 uppercase tracking-wide">Duration</p>
              <p className="font-semibold text-stone-800 mt-0.5">{service.duration || 'Flexible'}</p>
            </div>
            <div className="bg-orange-50 rounded-xl px-4 py-3">
              <p className="text-xs text-stone-400 uppercase tracking-wide">Category</p>
              <p className="font-semibold text-stone-800 mt-0.5">Professional Care</p>
            </div>
          </div>

          {/* Schedule */}
          {service.schedules && service.schedules.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-stone-700">Availability Schedule</p>
              <div className="space-y-2">
                {service.schedules.map((s, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-stone-50 px-4 py-2 rounded-lg text-sm">
                    <span className="font-medium text-stone-700">{s.day}</span>
                    <span className="text-stone-500">{s.start_time} - {s.end_time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4">
            <Button className="w-full justify-center py-4 text-lg" onClick={handleBook}>
              📅 Book Service Now
            </Button>
            {!user && (
              <p className="text-xs text-center text-stone-400 mt-2">
                You need to be logged in to book a service.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServiceDetail;
