import React, { useEffect, useState } from 'react';
import api from '../../../api/api';
import { Service, Booking } from '../../../types';
import ServiceCard from '../../services/components/ServiceCard';
import Spinner from '../../../components/common/Spinner';
import Empty from '../../../components/common/Empty';

const AdminServices: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/pet-services/').then(r => setServices(r.data.results || r.data || [])),
      api.get('/bookings/').then(r => setBookings(r.data.results || r.data || [])),
    ]).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const del = async (id: number) => {
    if (!window.confirm('Delete this service?')) return;
    await api.delete(`/pet-services/${id}/`).catch(() => {});
    setServices(prev => prev.filter(s => s.id !== id));
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-stone-900">Services & Bookings</h1>
        <p className="text-stone-500 text-sm mt-0.5">All platform services and booking records</p>
      </div>

      <div>
        <h2 className="font-bold text-stone-900 mb-4">Services ({services.length})</h2>
        {services.length === 0 ? <Empty icon="✂️" text="No services." /> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map(s => (
              <ServiceCard key={s.id} service={s} actions={
                <button onClick={() => del(s.id)} className="w-full mt-3 py-1.5 bg-red-50 text-red-500 text-xs font-semibold rounded-lg hover:bg-red-100 transition-colors">Delete</button>
              } />
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="font-bold text-stone-900 mb-4">All Bookings ({bookings.length})</h2>
        {bookings.length === 0 ? <Empty icon="🗓️" text="No bookings." /> : (
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-stone-50 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                    <th className="px-5 py-3 border-b border-stone-100">Service</th>
                    <th className="px-5 py-3 border-b border-stone-100">Customer</th>
                    <th className="px-5 py-3 border-b border-stone-100 hidden md:table-cell">Date</th>
                    <th className="px-5 py-3 border-b border-stone-100">Price</th>
                    <th className="px-5 py-3 border-b border-stone-100">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b: any) => (
                    <tr key={b.id} className="border-b border-stone-50 hover:bg-stone-50 transition-colors">
                      <td className="px-5 py-3.5 font-semibold text-stone-900 text-sm">{b.service_name}</td>
                      <td className="px-5 py-3.5 text-sm text-stone-600">{b.user_name}</td>
                      <td className="px-5 py-3.5 text-xs text-stone-400 hidden md:table-cell">{new Date(b.booking_date).toLocaleString()}</td>
                      <td className="px-5 py-3.5 font-semibold text-brand-500">${b.service_price}</td>
                      <td className="px-5 py-3.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${b.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-600' : b.status === 'Cancelled' ? 'bg-red-50 text-red-500' : b.status === 'Completed' ? 'bg-stone-100 text-stone-500' : 'bg-amber-50 text-amber-600'}`}>{b.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminServices;
