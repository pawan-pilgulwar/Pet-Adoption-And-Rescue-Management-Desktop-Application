import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../api/api';
import { useAuth } from '../../../context/AuthContext';
import { Report, Booking, AdoptionRequest } from '../../../types';
import ReportCard from '../../rescue/components/ReportCard';
import Spinner from '../../../components/common/Spinner';
import Empty from '../../../components/common/Empty';

const statusCls: Record<string, string> = {
  Pending: 'bg-amber-50 text-amber-600',
  Confirmed: 'bg-emerald-50 text-emerald-600',
  Cancelled: 'bg-red-50 text-red-500',
  Completed: 'bg-stone-100 text-stone-500',
};

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [adoptions, setAdoptions] = useState<AdoptionRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/rescue/reports/').then(r => setReports(r.data.data || [])),
      api.get('/bookings/').then(r => setBookings(r.data.results || r.data || [])),
      api.get('/adoption/requests/').then(r => setAdoptions(r.data.data || r.data.results || [])),
    ]).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const deleteReport = async (id: number) => {
    if (!window.confirm('Delete this report?')) return;
    await api.delete(`/rescue/reports/${id}/`).catch(() => {});
    setReports(prev => prev.filter(r => r.id !== id));
  };

  if (!user) return null;
  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-brand-500 to-amber-500 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-12 -mt-12" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-brand-100 text-sm mb-0.5">Welcome back</p>
            <h1 className="text-2xl font-black">{user.first_name} {user.last_name} 👋</h1>
            <p className="text-brand-100 text-sm mt-1">Manage your reports, bookings, and adoptions.</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link to="/dashboard/reports/new" className="px-4 py-2 bg-white text-brand-600 font-semibold rounded-xl hover:bg-brand-50 transition-colors text-sm shadow-sm">
              + File Report
            </Link>
            <Link to="/services" className="px-4 py-2 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 transition-colors text-sm border border-brand-400">
              Book Service
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'My Reports', value: reports.length, icon: '📋', color: 'bg-brand-50 text-brand-500' },
          { label: 'Bookings', value: bookings.length, icon: '🩺', color: 'bg-teal-50 text-teal-500' },
          { label: 'Adoptions', value: adoptions.length, icon: '🏠', color: 'bg-purple-50 text-purple-500' },
          { label: 'Pending Reports', value: reports.filter(r => r.status === 'Pending').length, icon: '⏳', color: 'bg-amber-50 text-amber-500' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-4 border border-stone-100 shadow-sm flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${s.color}`}>{s.icon}</div>
            <div>
              <p className="text-xs text-stone-500">{s.label}</p>
              <p className="text-xl font-black text-stone-900">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reports */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-black text-stone-900">My Reports</h2>
            <Link to="/dashboard/reports/new" className="text-brand-500 text-xs font-semibold hover:underline">+ New</Link>
          </div>
          {reports.length === 0 ? (
            <Empty icon="📋" text="No reports filed yet." action={
              <Link to="/dashboard/reports/new" className="text-brand-500 text-sm font-semibold hover:underline">File your first report →</Link>
            } />
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
          {/* Bookings */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-black text-stone-900">My Bookings</h2>
              <Link to="/services" className="text-brand-500 text-xs font-semibold hover:underline">+ Book</Link>
            </div>
            {bookings.length === 0 ? (
              <div className="bg-white rounded-2xl p-6 border border-stone-100 text-center">
                <p className="text-stone-400 text-sm">No bookings yet.</p>
                <Link to="/services" className="text-brand-500 text-xs font-semibold mt-2 block hover:underline">Browse Services →</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {bookings.slice(0, 4).map((b: any) => (
                  <div key={b.id} className="bg-white rounded-xl p-4 border border-stone-100 shadow-sm">
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusCls[b.status] || 'bg-stone-100 text-stone-500'}`}>{b.status}</span>
                      <span className="text-[10px] text-stone-400">{new Date(b.booking_date).toLocaleDateString()}</span>
                    </div>
                    <p className="font-semibold text-stone-900 text-sm">{b.service_name}</p>
                    <p className="text-xs text-stone-500">${b.service_price}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Adoptions */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-black text-stone-900">My Adoptions</h2>
              <Link to="/adoption" className="text-brand-500 text-xs font-semibold hover:underline">Browse</Link>
            </div>
            {adoptions.length === 0 ? (
              <div className="bg-white rounded-2xl p-6 border border-stone-100 text-center">
                <p className="text-stone-400 text-sm">No adoption requests yet.</p>
                <Link to="/adoption" className="text-brand-500 text-xs font-semibold mt-2 block hover:underline">Find a Pet →</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {adoptions.slice(0, 3).map(a => (
                  <div key={a.id} className="bg-white rounded-xl p-4 border border-stone-100 shadow-sm">
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${a.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' : a.status === 'Rejected' ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-600'}`}>{a.status}</span>
                    </div>
                    <p className="font-semibold text-stone-900 text-sm">{a.pet_detail?.name}</p>
                    <p className="text-xs text-stone-500">{a.pet_detail?.species} · {a.pet_detail?.breed || '—'}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
