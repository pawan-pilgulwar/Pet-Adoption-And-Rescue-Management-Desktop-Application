import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import DashboardCard from '../../../components/common/DashboardCard';
import api from '../../../services/api';

function ShopDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ listings: 0, services: 0, adoptions: 0, bookings: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app with proper endpoints, you'd fetch these from a dedicated dashboard endpoint.
    // For now, we'll try to fetch counts from existing endpoints.
    Promise.all([
      api.get('/adoption/listings/'),
      api.get('/pet-services/'),
      api.get('/adoption/adoptions/'),
      api.get('/bookings/')
    ]).then(([listingsRes, servicesRes, adoptionsRes, bookingsRes]) => {
      const p = (res: any) => res.data?.data?.results?.length || res.data?.data?.length || 0;
      setStats({
        listings: p(listingsRes),
        services: p(servicesRes),
        adoptions: p(adoptionsRes),
        bookings: p(bookingsRes)
      });
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900">Welcome, {(user?.profile as any)?.shop_name || 'Shop Owner'}! 🏪</h1>
        <p className="text-stone-500">Manage your shop's pets, services, and bookings.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <DashboardCard title="Active Listings" value={loading ? '-' : stats.listings} icon="📋" color="bg-brand-100" />
        <DashboardCard title="Services" value={loading ? '-' : stats.services} icon="🛠️" color="bg-blue-100" textColor="text-blue-600" />
        <DashboardCard title="Adoptions" value={loading ? '-' : stats.adoptions} icon="❤️" color="bg-red-100" textColor="text-red-600" />
        <DashboardCard title="Bookings" value={loading ? '-' : stats.bookings} icon="📅" color="bg-green-100" textColor="text-green-600" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="font-bold text-stone-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link to="/dashboard/pets" className="block p-3 rounded-xl hover:bg-orange-50 text-brand-500 font-medium transition-colors">
              + Register a new Pet
            </Link>
            <Link to="/dashboard/listings" className="block p-3 rounded-xl hover:bg-orange-50 text-brand-500 font-medium transition-colors">
              + Create an Adoption Listing
            </Link>
            <Link to="/dashboard/services" className="block p-3 rounded-xl hover:bg-orange-50 text-brand-500 font-medium transition-colors">
              + Add a new Pet Service
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShopDashboard;
