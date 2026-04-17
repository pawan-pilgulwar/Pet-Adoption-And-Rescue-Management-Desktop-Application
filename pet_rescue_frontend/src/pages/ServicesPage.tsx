import React, { useEffect, useState } from 'react';
import api from '../services/api';
import ServiceCard from '../components/ServiceCard';
import { useNavigate } from 'react-router-dom';

const ServicesPage: React.FC = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadServices = async () => {
    try {
      const res = await api.get('/pet-services/');
      setServices(res.data.results || []);
    } catch (err) {
      console.error('Error loading services', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleBook = (service: any) => {
    navigate('/booking', { state: { service } });
  };

  return (
    <div className="paw-bg min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-br from-slate-800 to-slate-900 py-14 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 text-9xl flex items-center justify-end pr-20 pointer-events-none">🩺</div>
        <div className="max-w-7xl mx-auto relative z-10">
          <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Professional Care</span>
          <h1 className="text-3xl md:text-4xl font-black text-white mt-1 mb-2">Pet Services</h1>
          <p className="text-slate-400 text-sm max-w-md">
            From grooming to wellness, we provide the best care for your furry companions.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        {loading ? (
          <div className="text-center py-20">
            <span className="text-4xl animate-float inline-block">🩺</span>
            <p className="mt-4 text-slate-500 font-medium">Loading services...</p>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-orange-100">
            <span className="text-5xl block mb-4">🧼</span>
            <p className="text-slate-500 font-medium">No services available right now.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-slate-500 mb-6 font-medium">
              <span className="text-orange-500 font-bold">{services.length}</span> services available
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {services.map((service: any) => (
                <ServiceCard key={service.id} service={service} onBook={handleBook} />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default ServicesPage;
