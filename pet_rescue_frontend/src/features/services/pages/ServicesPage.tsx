import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchServices } from '../api';
import { Service } from '../../../types';
import ServiceCard from '../components/ServiceCard';
import Spinner from '../../../components/common/Spinner';
import Empty from '../../../components/common/Empty';
import { useAuth } from '../../../context/AuthContext';

function ServicesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    fetchServices()
      .then(data => setServices(Array.isArray(data) ? data : []))
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, []);

  // Navigate to booking page with selected service in state
  function handleBook(service: Service) {
    if (!user) { navigate('/login'); return; }
    navigate('/booking', { state: { service } });
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-900">🛠️ Pet Services</h1>
        <p className="text-stone-500 mt-1">Professional care services for your furry friends</p>
      </div>

      {loading ? (
        <Spinner message="Loading services..." />
      ) : services.length === 0 ? (
        <Empty message="No services available yet." emoji="🛠️" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(s => (
            <ServiceCard key={s.id} service={s} onBook={handleBook} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ServicesPage;
