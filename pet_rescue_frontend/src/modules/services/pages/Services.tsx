import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/api';
import { Service } from '../../../types';
import ServiceCard from '../components/ServiceCard';
import Spinner from '../../../components/common/Spinner';
import Empty from '../../../components/common/Empty';
import { useAuth } from '../../../context/AuthContext';

const Services: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/pet-services/').then(r => setServices(r.data.results || r.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleBook = (s: Service) => {
    if (!user) { navigate('/login'); return; }
    navigate('/booking', { state: { service: s } });
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <section className="bg-gradient-to-br from-stone-800 to-stone-900 py-14 px-6">
        <div className="max-w-7xl mx-auto">
          <span className="text-stone-400 text-xs font-semibold uppercase tracking-wider">Professional Care</span>
          <h1 className="text-3xl md:text-4xl font-black text-white mt-1 mb-2">Pet Services</h1>
          <p className="text-stone-400 text-sm max-w-md">From grooming to wellness, we provide the best care for your furry companions.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {loading ? <Spinner /> : services.length === 0 ? (
          <Empty icon="🧼" text="No services available right now." />
        ) : (
          <>
            <p className="text-sm text-stone-500 mb-6"><span className="text-brand-500 font-bold">{services.length}</span> services available</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {services.map(s => <ServiceCard key={s.id} service={s} onBook={() => handleBook(s)} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Services;
