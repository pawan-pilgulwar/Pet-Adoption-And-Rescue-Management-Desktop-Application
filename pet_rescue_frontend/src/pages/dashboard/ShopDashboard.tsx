import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { PetReport, ShopOwnerProfile } from '../../types';
import ReportCard from '../../components/ReportCard';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';

const ShopDashboard: React.FC = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<PetReport[]>([]);
  const [loading, setLoading] = useState(true);

  if (!user || user.role !== 'SHOP_OWNER') return null;

  useEffect(() => {
    fetchMyReports();
  }, []);

  const fetchMyReports = async () => {
    try {
      const response = await api.get('/reports/get-user-reports/');
      setReports(response.data.data.Reports);
    } catch (error) {
      console.error('Failed to fetch personal reports', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;
    try {
      await api.delete(`/reports/${id}/delete-report/`);
      setReports(reports.filter(r => r.id !== id));
    } catch (error) {
      console.error("Failed to delete report:", error);
      alert("Error deleting report.");
    }
  };

  const profile = user.profile as ShopOwnerProfile;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-teal-500 to-teal-700 p-6 md:p-8 rounded-2xl shadow-md mb-8 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black">
              🏪 Shop Dashboard
            </h1>
            <p className="text-white/80 mt-1">
              Managing {profile.shop_name}
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/create-report">
              <button className="px-5 py-2.5 bg-white text-teal-600 font-bold rounded-xl text-sm hover:bg-teal-50 transition-colors shadow-md">
                File a Report
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-orange-100 shadow-sm">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Shop Status</p>
          <p className="text-lg font-bold text-teal-600 flex items-center gap-2 mt-1">
            <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></span>
            Active
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-orange-100 shadow-sm col-span-2">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Shop Address</p>
          <p className="text-sm font-bold text-slate-700 mt-1 uppercase truncate">{profile.shop_address}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-orange-100 shadow-sm">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">License</p>
          <p className="text-sm font-bold text-slate-700 mt-1">{profile.shop_license}</p>
        </div>
      </div>

      {/* Reports Section */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-slate-800">
          📋 Shop Reports
        </h2>
        <span className="text-sm text-slate-400 font-bold">{reports.length} report(s)</span>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <span className="text-4xl animate-float inline-block">🐾</span>
          <p className="mt-4 text-slate-500 font-bold">Loading shop reports...</p>
        </div>
      ) : reports.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-orange-50">
          <span className="text-4xl">📋</span>
          <p className="mt-4 text-slate-500 font-bold">You haven't filed any reports yet.</p>
          <Link
            to="/create-report"
            className="inline-block mt-4 text-sm font-bold text-teal-600 hover:underline"
          >
            File your first report →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <ReportCard key={report.id} report={report}>
              <Button className="flex-1" variant="danger" onClick={() => handleDelete(report.id)}>
                Delete
              </Button>
            </ReportCard>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopDashboard;
