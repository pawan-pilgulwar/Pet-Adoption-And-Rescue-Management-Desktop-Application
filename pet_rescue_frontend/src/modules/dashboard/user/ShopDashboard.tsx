import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../api/api';
import { useAuth } from '../../../context/AuthContext';
import { Pet, AdoptionListing, AdoptionRequest, Service, Booking, Report } from '../../../types';
import ReportCard from '../../rescue/components/ReportCard';
import Spinner from '../../../components/common/Spinner';
import Empty from '../../../components/common/Empty';

const ShopDashboard: React.FC = () => {
  const { user } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [listings, setListings] = useState<AdoptionListing[]>([]);
  const [requests, setRequests] = useState<AdoptionRequest[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/pets/all-pets/').then(r => setPets(r.data.data?.Pets || [])),
      api.get('/adoption/listings/').then(r => setListings(r.data.data || [])),
      api.get('/adoption/requests/').then(r => setRequests(r.data.data || r.data.results || [])),
      api.get('/pet-services/').then(r => setServices(r.data.results || r.data || [])),
      api.get('/bookings/').then(r => setBookings(r.data.results || r.data || [])),
      api.get('/rescue/reports/').then(r => setReports(r.data.data || [])),
    ]).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const deleteReport = async (id: number) => {
    if (!window.confirm('Delete this report?')) return;
    await api.delete(`/rescue/reports/${id}/`).catch(() => {});
    setReports(prev => prev.filter(r => r.id !== id));
  };

  if (!user) return null;
  if (loading) return <Spinner />;

  const profile = user.profile as any;
  const pendingRequests = requests.filter(r => r.status === 'Pending');

  return (
    <div className="space-y-6">
      {/* Shop header */}
      <div className="bg-stone-900 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-brand-500/10 rounded-full -mr-12 -mt-12" />
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-brand-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-brand-500/20">🏪</div>
            <div>
              <p className="text-stone-400 text-xs mb-0.5">Shop Dashboard</p>
              <h1 className="text-xl font-black">{profile?.shop_name || user.first_name}</h1>
              <p className="text-stone-400 text-sm">📍 {profile?.shop_address || '—'}</p>
            </div>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link to="/dashboard/reports/new" className="px-4 py-2 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors text-sm">
              File Report
            </Link>
            <Link to="/profile" className="px-4 py-2 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-600 transition-colors text-sm shadow-md shadow-brand-500/20">
              Edit Shop
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Pets', value: pets.length, icon: '🐾', color: 'bg-brand-50 text-brand-500' },
          { label: 'Listings', value: listings.length, icon: '🏷️', color: 'bg-amber-50 text-amber-500' },
          { label: 'Requests', value: pendingRequests.length, icon: '📩', color: 'bg-purple-50 text-purple-500' },
          { label: 'Services', value: services.length, icon: '✂️', color: 'bg-teal-50 text-teal-500' },
          { label: 'Bookings', value: bookings.length, icon: '🗓️', color: 'bg-blue-50 text-blue-500' },
          { label: 'Reports', value: reports.length, icon: '📋', color: 'bg-stone-100 text-stone-500' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-4 border border-stone-100 shadow-sm">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg mb-2 ${s.color}`}>{s.icon}</div>
            <p className="text-xl font-black text-stone-900">{s.value}</p>
            <p className="text-xs text-stone-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending adoption requests */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-black text-stone-900">Pending Adoption Requests</h2>
            <Link to="/dashboard/listings" className="text-brand-500 text-xs font-semibold hover:underline">View All</Link>
          </div>
          {pendingRequests.length === 0 ? (
            <Empty icon="📩" text="No pending adoption requests." />
          ) : (
            <div className="space-y-3">
              {pendingRequests.slice(0, 5).map(req => (
                <div key={req.id} className="bg-white rounded-2xl p-4 border border-stone-100 shadow-sm flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center text-lg">🐾</div>
                    <div>
                      <p className="font-semibold text-stone-900 text-sm">{req.pet_detail?.name}</p>
                      <p className="text-xs text-stone-500">by {req.user_detail} · {req.pet_detail?.species}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={async () => {
                      await api.patch(`/adoption/requests/${req.id}/accept-request/`).catch(() => {});
                      setRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: 'Approved' } : r));
                    }} className="px-3 py-1.5 bg-emerald-500 text-white text-xs font-semibold rounded-lg hover:bg-emerald-600 transition-colors">
                      Accept
                    </button>
                    <button onClick={async () => {
                      await api.post(`/adoption/requests/${req.id}/reject-request/`).catch(() => {});
                      setRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: 'Rejected' } : r));
                    }} className="px-3 py-1.5 bg-red-50 text-red-500 text-xs font-semibold rounded-lg hover:bg-red-100 transition-colors">
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* My Reports */}
          <div className="flex items-center justify-between mt-6">
            <h2 className="font-black text-stone-900">My Reports</h2>
            <Link to="/dashboard/reports/new" className="text-brand-500 text-xs font-semibold hover:underline">+ New</Link>
          </div>
          {reports.length === 0 ? (
            <Empty icon="📋" text="No reports filed yet." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reports.map(r => (
                <ReportCard key={r.id} report={r} actions={
                  <button onClick={() => deleteReport(r.id)}
                    className="flex-1 py-1.5 text-red-500 text-xs font-semibold hover:bg-red-50 rounded-lg transition-colors">
                    Delete
                  </button>
                } />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Shop info */}
          <div className="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm">
            <h3 className="font-bold text-stone-900 mb-4 text-sm">Shop Information</h3>
            <div className="space-y-3">
              {[
                ['License', profile?.shop_license],
                ['Phone', profile?.phone_number],
                ['Email', user.email],
              ].map(([k, v]) => (
                <div key={k} className="flex items-start gap-3">
                  <div className="w-7 h-7 bg-brand-50 text-brand-500 rounded-lg flex items-center justify-center text-xs flex-shrink-0">✓</div>
                  <div>
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">{k}</p>
                    <p className="text-sm font-medium text-stone-800">{v || '—'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="bg-gradient-to-br from-brand-500 to-amber-500 rounded-2xl p-5 text-white shadow-lg shadow-brand-500/20">
            <h3 className="font-bold mb-3 text-sm">Quick Actions</h3>
            <div className="space-y-2">
              {[
                ['/dashboard/pets', '🐾 Manage Pets'],
                ['/dashboard/listings', '🏷️ Manage Listings'],
                ['/dashboard/services', '✂️ Manage Services'],
              ].map(([to, label]) => (
                <Link key={to} to={to} className="block py-2 px-3 bg-white/10 rounded-xl text-sm font-medium hover:bg-white/20 transition-colors">{label}</Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopDashboard;
