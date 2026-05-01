import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { fetchBookings, fetchServices } from '../../services/api';
import { Booking, Service } from '../../../types';
import Spinner from '../../../components/common/Spinner';
import Empty from '../../../components/common/Empty';
import SearchBar from '../../../components/common/SearchBar';
import Button from '../../../components/common/Button';

function ShopBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'Pending' | 'Confirmed' | 'Completed'>('Confirmed');

  useEffect(() => {
    Promise.all([
      fetchBookings().catch(() => []),
      fetchServices({ my_services: 'true' }).catch(() => [])
    ]).then(([b, s]) => {
      setBookings(b);
      setServices(s);
    }).finally(() => setLoading(false));
  }, []);

  const filteredBookings = useMemo(() => {
    return bookings
      .filter(b => {
        const matchesSearch = b.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (b.service_name && b.service_name.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesTab = b.status === activeTab;
        return matchesSearch && matchesTab;
      })
      .sort((a, b) => new Date(a.booking_date).getTime() - new Date(b.booking_date).getTime());
  }, [bookings, searchTerm, activeTab]);

  // Group by service name
  const groupedBookings = useMemo(() => {
    const groups: Record<string, Booking[]> = {};

    // Initialize groups with all services owned by the user
    services.forEach(s => {
      groups[s.name] = [];
    });

    // Populate groups with filtered bookings
    filteredBookings.forEach(b => {
      const name = b.service_name || 'Other';
      if (!groups[name]) groups[name] = [];
      groups[name].push(b);
    });

    return groups;
  }, [filteredBookings, services]);

  // Total count for current tab
  const totalCount = filteredBookings.length;

  return (
    <div className="fade-in">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Service Bookings</h1>
          <p className="text-stone-500">Manage and track service appointments for your shop.</p>
        </div>
        <div className="flex bg-stone-100 p-1 rounded-xl">
          {[
            { label: 'Pending', value: 'Pending' },
            { label: 'Upcoming', value: 'Confirmed' },
            { label: 'Completed', value: 'Completed' },
          ].map(tab => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value as any)}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === tab.value
                ? 'bg-white text-brand-500 shadow-sm'
                : 'text-stone-500 hover:text-stone-700'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Search by customer or service..."
      />

      {loading ? (
        <Spinner />
      ) : services.length === 0 ? (
        <div className="card">
          <Empty
            message="You haven't created any services yet. Create one to receive bookings!"
            emoji="🛠️"
          />
          <div className="text-center mt-4">
            <Link to="/dashboard/services">
              <Button>Manage Services</Button>
            </Link>
          </div>
        </div>
      ) : totalCount === 0 && searchTerm === '' ? (
        <div className="card">
          <Empty
            message={`No ${activeTab.toLowerCase()} bookings found for any of your services.`}
            emoji="📅"
          />
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedBookings).map(([serviceName, serviceBookings]) => {
            // If searching and this group has no matches, skip it
            if (searchTerm && serviceBookings.length === 0 && !serviceName.toLowerCase().includes(searchTerm.toLowerCase())) {
              return null;
            }

            return (
              <div key={serviceName} className="space-y-4">
                <h2 className="text-lg font-bold text-stone-800 flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${serviceBookings.length > 0 ? 'bg-brand-500' : 'bg-stone-200'}`}></span>
                  {serviceName}
                  <span className="text-xs font-normal text-stone-400">({serviceBookings.length} bookings)</span>
                </h2>
                {serviceBookings.length > 0 ? (
                  <div className="card overflow-x-auto !p-0">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Customer</th>
                          <th>Date & Time</th>
                          <th>Status</th>
                          <th className="text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {serviceBookings.map(b => (
                          <tr key={b.id} className="hover:bg-stone-50/50 transition-colors">
                            <td className="font-semibold text-stone-900">
                              <Link to={`/dashboard/bookings/${b.id}`} className="hover:text-brand-500">
                                {b.user_name}
                              </Link>
                            </td>
                            <td className="text-stone-500">{new Date(b.booking_date).toLocaleString()}</td>
                            <td>
                              <span className={`badge ${b.status === 'Confirmed' ? 'badge-green' :
                                b.status === 'Cancelled' ? 'badge-red' :
                                  b.status === 'Completed' ? 'badge-blue' : 'badge-yellow'
                                }`}>
                                {b.status === 'Confirmed' ? 'Upcoming' : b.status}
                              </span>
                            </td>
                            <td className="text-right">
                              <Link to={`/dashboard/bookings/${b.id}`}>
                                <Button variant="ghost" size="sm" className="text-brand-500">View</Button>
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="bg-stone-50 border border-stone-100 border-dashed rounded-2xl p-6 text-center">
                    <p className="text-stone-400 text-sm italic">No {activeTab.toLowerCase()} bookings for this service.</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ShopBookings;
