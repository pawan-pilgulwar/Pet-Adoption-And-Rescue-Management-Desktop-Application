import React, { useState, useEffect } from 'react';
import { fetchBookings } from '../../services/api';
import { Booking } from '../../../types';
import Spinner from '../../../components/common/Spinner';
import Empty from '../../../components/common/Empty';

function ShopBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

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
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id}>
                  <td className="font-semibold text-stone-900">{b.user_name}</td>
                  <td>{b.service_name}</td>
                  <td className="text-stone-500">{new Date(b.booking_date).toLocaleString()}</td>
                  <td>
                     <span className={`badge ${
                       b.status === 'Confirmed' ? 'badge-green' : 'badge-yellow'
                     }`}>
                       {b.status}
                     </span>
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
