import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { fetchServices } from '../api';
import { Service } from '../../../types';
import ServiceCard from '../components/ServiceCard';
import Spinner from '../../../components/common/Spinner';
import Empty from '../../../components/common/Empty';
import { useAuth } from '../../../context/AuthContext';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';

function ServicesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  function loadServices() {
    setLoading(true);
    fetchServices()
      .then(data => setServices(Array.isArray(data) ? data : []))
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadServices();
  }, []);

  // Navigate to booking page with selected service in state
  function handleBook(service: Service) {
    if (!user) { navigate('/login'); return; }
    navigate('/booking', { state: { service } });
  }

  const filteredServices = services.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const economyCount = services.filter(s => parseFloat(s.price) < 500).length;
  const premiumCount = services.filter(s => parseFloat(s.price) >= 500).length;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-stone-900">🛠️ Pet Services</h1>
          <p className="text-stone-500 mt-1">Professional care services for your furry friends</p>
        </div>
        {user?.role === 'SHOP_OWNER' && (
          <Link to="/dashboard/services" className="btn-primary">
            + Add Service
          </Link>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <div className="card text-center">
          <p className="text-2xl font-bold text-green-500">{economyCount}</p>
          <p className="text-stone-500 text-sm">Economy Services</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-purple-500">{premiumCount}</p>
          <p className="text-stone-500 text-sm">Premium Care</p>
        </div>
        <div className="card text-center col-span-2 md:col-span-1">
          <p className="text-2xl font-bold text-brand-500">{services.length}</p>
          <p className="text-stone-500 text-sm">Total Services</p>
        </div>
      </div>

      {/* Search */}
      <div className="card mb-8 flex flex-col sm:flex-row gap-4 w-full">
        <Input
          id="service-search"
          label="Search Services"
          placeholder="Grooming, Vaccination..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="flex-1 min-w-[350px]"
        />
        <Button onClick={() => setSearchQuery('')} variant="ghost" type="button">Clear</Button>
      </div>

      {loading ? (
        <Spinner message="Loading services..." />
      ) : filteredServices.length === 0 ? (
        <Empty message="No services found matching your search." emoji="🛠️" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map(s => (
            <ServiceCard key={s.id} service={s} onBook={handleBook} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ServicesPage;

