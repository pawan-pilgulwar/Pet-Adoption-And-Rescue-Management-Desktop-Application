import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchBookings } from '../../services/api';
import { Booking } from '../../../types';
import Spinner from '../../../components/common/Spinner';
import Empty from '../../../components/common/Empty';
import SearchBar from '../../../components/common/SearchBar';
import Button from '../../../components/common/Button';

function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'Pending' | 'Confirmed' | 'Completed'>('Confirmed');

  useEffect(() => {
    fetchBookings()
      .then(b => setBookings(b))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filteredBookings = bookings
    .filter(b => {
      const matchesSearch = (b.service_name && b.service_name.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesTab = b.status === activeTab;
      return matchesSearch && matchesTab;
    })
    .sort((a, b) => new Date(a.booking_date).getTime() - new Date(b.booking_date).getTime());

  return (
    <div className="fade-in">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">My Bookings</h1>
          <p className="text-stone-500">Track your service appointments and history.</p>
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
              className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
                activeTab === tab.value 
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
        placeholder="Search by service..." 
      />

      {loading ? (
        <Spinner />
      ) : filteredBookings.length === 0 ? (
        <div className="card">
          <Empty 
            message={`No ${activeTab.toLowerCase()} bookings found.`} 
            emoji="📅" 
          />
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Date & Time</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map(b => (
                <tr key={b.id} className="hover:bg-stone-50/50 transition-colors">
                  <td className="font-semibold text-stone-900">
                    {b.service_name}
                  </td>
                  <td className="text-stone-500">{new Date(b.booking_date).toLocaleString()}</td>
                  <td>
                     <span className={`badge ${
                       b.status === 'Confirmed' ? 'badge-green' : 
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
      )}
    </div>
  );
}

export default MyBookings;
