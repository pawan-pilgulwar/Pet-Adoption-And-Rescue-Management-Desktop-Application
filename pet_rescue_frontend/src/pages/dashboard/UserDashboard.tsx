import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Report } from '../../types';
import ReportCard from '../../components/ReportCard';
import { useAuth } from '../../context/AuthContext';

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (!user || user.role !== 'USER') return null;

  const fetchDashboardData = async () => {
    try {
      const [reportsRes, bookingsRes] = await Promise.all([
        api.get('/rescue/reports/'),
        api.get('/bookings/')
      ]);
      setReports(reportsRes.data.data || []);
      setBookings(bookingsRes.data.results || []);
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;
    try {
      await api.delete(`/rescue/reports/${id}/`);
      setReports(reports.filter(r => r.id !== id));
    } catch (error) {
      console.error("Failed to delete report:", error);
    }
  };

  const statusColor: Record<string, string> = {
    Pending: 'bg-amber-50 text-amber-600',
    Confirmed: 'bg-emerald-50 text-emerald-600',
    Cancelled: 'bg-red-50 text-red-500',
    Completed: 'bg-slate-100 text-slate-500',
  };

  return (
    <div className="paw-bg min-h-screen py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-8 rounded-2xl shadow-lg shadow-orange-500/20 mb-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div>
              <p className="text-orange-100 text-sm font-medium mb-1">Welcome back</p>
              <h1 className="text-2xl md:text-3xl font-black">
                {user.first_name} {user.last_name} 👋
              </h1>
              <p className="text-orange-100 text-sm mt-1">Manage your reports and bookings here.</p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <Link to="/create-report" className="px-5 py-2.5 bg-white text-orange-600 font-semibold rounded-xl hover:bg-orange-50 transition-all text-sm shadow-md">
                File a Report
              </Link>
              <Link to="/services" className="px-5 py-2.5 bg-orange-600 text-white font-semibold rounded-xl hover:bg-orange-700 transition-all text-sm border border-orange-400">
                Book Service
              </Link>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'My Reports', value: reports.length, icon: '📋', color: 'text-orange-500' },
            { label: 'Bookings', value: bookings.length, icon: '🩺', color: 'text-teal-500' },
            { label: 'Pending', value: reports.filter(r => r.status === 'Pending').length, icon: '⏳', color: 'text-amber-500' },
            { label: 'Accepted', value: reports.filter(r => r.status === 'Accepted').length, icon: '✅', color: 'text-emerald-500' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-5 border border-orange-100 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl">{stat.icon}</span>
                <span className={`text-2xl font-black ${stat.color}`}>{stat.value}</span>
              </div>
              <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Reports Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-black text-slate-900">My Reports</h2>
              <Link to="/create-report" className="text-orange-500 text-xs font-semibold hover:underline">
                + New Report
              </Link>
            </div>

            {loading ? (
              <div className="bg-white rounded-2xl p-16 text-center border border-orange-100">
                <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-3"></div>
                <p className="text-slate-400 text-sm">Loading reports...</p>
              </div>
            ) : reports.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-orange-100">
                <span className="text-4xl block mb-3">📋</span>
                <p className="text-slate-500 text-sm font-medium mb-4">No reports filed yet.</p>
                <Link to="/create-report" className="text-orange-500 text-sm font-semibold hover:underline">
                  Report a pet now →
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reports.map((report) => (
                  <ReportCard key={report.id} report={report}>
                    <button
                      onClick={() => handleDelete(report.id)}
                      className="w-full py-2 text-red-500 font-semibold text-xs hover:bg-red-50 rounded-lg transition-all"
                    >
                      Delete Report
                    </button>
                  </ReportCard>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Bookings */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-black text-slate-900">My Bookings</h2>
                <Link to="/services" className="text-orange-500 text-xs font-semibold hover:underline">
                  + Book
                </Link>
              </div>
              <div className="space-y-3">
                {bookings.length === 0 ? (
                  <div className="bg-white p-8 rounded-2xl border border-orange-100 text-center">
                    <p className="text-slate-400 text-sm">No bookings yet.</p>
                    <Link to="/services" className="text-orange-500 text-xs font-semibold mt-2 block hover:underline">
                      Find Services →
                    </Link>
                  </div>
                ) : (
                  bookings.map((booking: any) => (
                    <div key={booking.id} className="bg-white p-4 rounded-2xl border border-orange-100 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColor[booking.status] || 'bg-slate-100 text-slate-500'}`}>
                          {booking.status}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(booking.booking_date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="font-semibold text-slate-900 text-sm">{booking.service_name}</p>
                      <p className="text-xs text-slate-500">${booking.service_price}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Account info */}
            <div className="bg-slate-900 p-6 rounded-2xl text-white">
              <h3 className="font-bold text-sm mb-4">Account Info</h3>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-lg font-bold">
                  {user.first_name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-sm">{user.first_name} {user.last_name}</p>
                  <p className="text-slate-400 text-xs">{user.email}</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-orange-400 bg-orange-500/20 px-3 py-1 rounded-full uppercase tracking-wider">
                {user.role}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
