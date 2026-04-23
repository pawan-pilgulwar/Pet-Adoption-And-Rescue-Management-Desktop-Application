import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../services/api';
import { AdminDashboardData } from '../../../types';
import DashboardCard from '../../../components/common/DashboardCard';
import Spinner from '../../../components/common/Spinner';

function AdminDashboard() {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // GET /api/v1/users/admin-dashboard/
    api.get('/users/admin-dashboard/')
      .then(res => setData(res.data?.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner message="Loading Admin Stats..." />;
  if (!data) return <div className="p-4 text-red-500">Failed to load admin dashboard.</div>;

  return (
    <div className="fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900">Admin Dashboard 👑</h1>
        <p className="text-stone-500">Platform overview and statistics.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <DashboardCard title="Total Users" value={data.total_users} icon="👥" color="bg-blue-100" textColor="text-blue-600" />
        <DashboardCard title="Total Pets" value={data.total_pets} icon="🐾" color="bg-orange-100" textColor="text-orange-600" />
        <DashboardCard title="Total Reports" value={data.total_reports} icon="🚨" color="bg-red-100" textColor="text-red-600" />
        <DashboardCard title="Pending Reports" value={data.report_stats.pending} icon="⏳" color="bg-yellow-100" textColor="text-yellow-600" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex justify-between mb-4">
            <h2 className="font-bold text-stone-900">Recent Users</h2>
            <Link to="/admin/users" className="text-sm text-brand-500 hover:underline">View All</Link>
          </div>
          <div className="space-y-3">
            {data.recent_activity.users.slice(0, 5).map(u => (
              <div key={u.id} className="flex justify-between items-center p-2 rounded-lg hover:bg-stone-50">
                <div>
                  <p className="font-semibold text-stone-900 text-sm">{u.first_name} {u.last_name}</p>
                  <p className="text-xs text-stone-500">{u.email}</p>
                </div>
                <span className={`badge ${u.role === 'ADMIN' ? 'badge-blue' : u.role === 'SHOP_OWNER' ? 'badge-orange' : 'badge-green'}`}>
                  {u.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="flex justify-between mb-4">
            <h2 className="font-bold text-stone-900">Recent Reports</h2>
            <Link to="/admin/reports" className="text-sm text-brand-500 hover:underline">Verify Reports</Link>
          </div>
          <div className="space-y-3">
            {data.recent_activity.reports.slice(0, 5).map(r => (
               <div key={r.id} className="flex justify-between items-center p-2 rounded-lg hover:bg-stone-50">
                 <div>
                    <p className="font-semibold text-stone-900 text-sm">{r.pet_detail?.name || 'Unknown'}</p>
                    <p className="text-xs text-stone-500">{r.report_type} • {r.location}</p>
                 </div>
                 <span className={`badge ${r.status === 'Pending' ? 'badge-yellow' : 'badge-green'}`}>
                    {r.status}
                 </span>
               </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
