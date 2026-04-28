import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchBookings } from '../../services/api';
import { Booking } from '../../../types';
import Spinner from '../../../components/common/Spinner';
import Empty from '../../../components/common/Empty';
import SearchBar from '../../../components/common/SearchBar';
import Button from '../../../components/common/Button';

function ShopBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBookings()
      .then(b => setBookings(b))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900">Service Bookings</h1>
        <p className="text-stone-500">View bookings made by users for your services.</p>
      </div>

      <SearchBar 
        value={searchTerm} 
        onChange={setSearchTerm} 
        placeholder="Search by customer or service..." 
      />

      {loading ? (
        <Spinner />
      ) : bookings.length === 0 ? (
        <div className="card">
          <Empty message="No bookings received yet." emoji="📅" />
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Service</th>
                <th>Date & Time</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings
                .filter(b => 
                  b.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  (b.service_name && b.service_name.toLowerCase().includes(searchTerm.toLowerCase()))
                )
                .map(b => (
                <tr key={b.id} className="hover:bg-stone-50/50 transition-colors">
                  <td className="font-semibold text-stone-900">
                    <Link to={`/dashboard/bookings/${b.id}`} className="hover:text-brand-500">
                      {b.user_name}
                    </Link>
                  </td>
                  <td>{b.service_name}</td>
                  <td className="text-stone-500">{new Date(b.booking_date).toLocaleString()}</td>
                  <td>
                     <span className={`badge ${
                       b.status === 'Confirmed' ? 'badge-green' : 
                       b.status === 'Cancelled' ? 'badge-red' : 'badge-yellow'
                     }`}>
                       {b.status}
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

export default ShopBookings;
