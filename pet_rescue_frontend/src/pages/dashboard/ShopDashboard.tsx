import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Report, ShopOwnerProfile } from '../../types';
import ReportCard from '../../components/ReportCard';
import { useAuth } from '../../context/AuthContext';

const ShopDashboard: React.FC = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ pets: 0, services: 0, bookings: 0 });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (!user || user.role !== 'SHOP_OWNER') return null;

  const fetchDashboardData = async () => {
    try {
      const [reportsRes, petsRes, servicesRes, bookingsRes] = await Promise.all([
        api.get('/rescue/reports/'),
        api.get('/pets/all-pets/'),
        api.get('/pet-services/'),
        api.get('/bookings/')
      ]);
      setReports(reportsRes.data.data || []);
      setStats({
        pets: petsRes.data.data.Pets?.length || 0,
        services: servicesRes.data.results?.length || 0,
        bookings: bookingsRes.data.results?.length || 0
      });
    } catch (error) {
      console.error('Failed to fetch shop data', error);
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

  const profile = user.profile as ShopOwnerProfile;

  return (
    <div className="paw-bg min-h-screen py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Shop Header */}
        <div className="bg-slate-900 p-8 rounded-2xl shadow-lg mb-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/10 rounded-full -mr-16 -mt-16"></div>
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-orange-500/20">
                🏪
              </div>
              <div>
                <p className="text-slate-400 text-xs font-medium mb-0.5">Shop Dashboard</p>
                <h1 className="text-2xl font-black">{profile.shop_name}</h1>
                <p className="text-slate-400 text-sm flex items-center gap-1.5 mt-0.5">
                  <span>📍</span> {profile.shop_address}
                </p>
              </div>
            </div>
            <div className="flex gap-3 flex-wrap">
              <Link to="/create-report" className="px-5 py-2.5 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all text-sm">
                File Report
              </Link>
              <Link to="/profile" className="px-5 py-2.5 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-all text-sm shadow-md shadow-orange-500/20">
                Edit Shop
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Pets for Sale', val: stats.pets, icon: '🐕', color: 'text-orange-500', bg: 'bg-orange-50' },
            { label: 'Total Services', val: stats.services, icon: '✂️', color: 'text-teal-500', bg: 'bg-teal-50' },
            { label: 'Bookings', val: stats.bookings, icon: '🗓️', color: 'text-amber-500', bg: 'bg-amber-50' },
          ].map((item) => (
            <div key={item.label} className="bg-white p-6 rounded-2xl border border-orange-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1">{item.label}</p>
                <p className={`text-3xl font-black ${item.color}`}>{item.val}</p>
              </div>
              <div className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center text-2xl`}>
                {item.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Reports */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-black text-slate-900">Shop Reports</h2>
              <Link to="/create-report" className="text-orange-500 text-xs font-semibold hover:underline">
                + New Report
              </Link>
            </div>

            {loading ? (
              <div className="bg-white rounded-2xl p-16 text-center border border-orange-100">
                <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-3"></div>
                <p className="text-slate-400 text-sm">Loading...</p>
              </div>
            ) : reports.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-orange-100">
                <span className="text-4xl block mb-3">📋</span>
                <p className="text-slate-500 text-sm font-medium mb-4">No reports filed by your shop.</p>
                <Link to="/create-report" className="text-orange-500 text-sm font-semibold hover:underline">
                  Start Filing →
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reports.map((report) => (
                  <ReportCard key={report.id} report={report}>
                    <button
                      onClick={() => handleDelete(report.id)}
                      className="w-full py-2 bg-red-50 text-red-500 font-semibold text-xs rounded-lg hover:bg-red-100 transition-all"
                    >
                      Delete
                    </button>
                  </ReportCard>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Shop Info */}
            <div className="bg-white p-6 rounded-2xl border border-orange-100 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4 text-sm">Shop Information</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center text-sm flex-shrink-0">✓</div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">License ID</p>
                    <p className="font-semibold text-slate-900 text-sm">{profile.shop_license}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-50 text-orange-500 rounded-lg flex items-center justify-center text-sm flex-shrink-0">📞</div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Phone</p>
                    <p className="font-semibold text-slate-900 text-sm">{profile.phone_number}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Promo card */}
            <div className="bg-gradient-to-br from-orange-500 to-amber-500 p-6 rounded-2xl text-white shadow-lg shadow-orange-500/20">
              <h3 className="font-bold mb-2">Boost Visibility</h3>
              <p className="text-orange-100 text-xs leading-relaxed mb-4">
                Complete more successful adoptions to earn your Verified Seller badge.
              </p>
              <button className="w-full py-2.5 bg-white text-orange-600 font-semibold rounded-xl text-sm hover:bg-orange-50 transition-all">
                Get Verified Badge
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopDashboard;
