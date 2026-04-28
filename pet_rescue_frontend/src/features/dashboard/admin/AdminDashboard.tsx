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

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
        <DashboardCard title="Users" value={data.total_users} icon="👥" color="bg-blue-50" textColor="text-blue-600" />
        <DashboardCard title="Pets" value={data.total_pets} icon="🐾" color="bg-orange-50" textColor="text-orange-600" />
        <DashboardCard title="Reports" value={data.total_reports} icon="🚨" color="bg-red-50" textColor="text-red-600" />
        <DashboardCard title="Services" value={data.total_services} icon="🏥" color="bg-teal-50" textColor="text-teal-600" />
        <DashboardCard title="Adoptions" value={data.total_adoptions} icon="🏠" color="bg-green-50" textColor="text-green-600" />
        <DashboardCard title="Rescues" value={data.total_rescues} icon="🤝" color="bg-purple-50" textColor="text-purple-600" />
      </div>

      {/* Status Breakdown Section */}
      <div className="mb-8 grid md:grid-cols-3 gap-6">
        <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs text-yellow-600 font-bold uppercase">Pending Reports</p>
            <p className="text-2xl font-black text-yellow-700">{data.report_stats.pending}</p>
          </div>
          <div className="text-2xl opacity-40">⏳</div>
        </div>
        <div className="bg-green-50 border border-green-100 p-4 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs text-green-600 font-bold uppercase">Accepted Reports</p>
            <p className="text-2xl font-black text-green-700">{data.report_stats.accepted}</p>
          </div>
          <div className="text-2xl opacity-40">✅</div>
        </div>
        <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs text-red-600 font-bold uppercase">Rejected Reports</p>
            <p className="text-2xl font-black text-red-700">{data.report_stats.rejected}</p>
          </div>
          <div className="text-2xl opacity-40">❌</div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Recent Users */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-stone-900">Recent Users</h2>
            <Link to="/admin/users" className="text-xs text-brand-500 hover:underline font-bold uppercase tracking-wider">All →</Link>
          </div>
          <div className="space-y-3">
            {data.recent_activity.users.map(u => (
              <Link key={u.id} to={`/admin/users/${u.id}`} className="flex justify-between items-center p-2 rounded-xl hover:bg-stone-50 transition-colors border border-transparent hover:border-stone-100">
                <div>
                  <p className="font-bold text-stone-900 text-sm">{u.first_name} {u.last_name}</p>
                  <p className="text-xs text-stone-500">@{u.username}</p>
                </div>
                <span className={`badge text-[10px] ${u.role === 'ADMIN' ? 'badge-blue' : u.role === 'SHOP_OWNER' ? 'badge-orange' : 'badge-green'}`}>
                  {u.role}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Reports */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-stone-900">Recent Reports</h2>
            <Link to="/admin/reports" className="text-xs text-brand-500 hover:underline font-bold uppercase tracking-wider">Verify →</Link>
          </div>
          <div className="space-y-3">
            {data.recent_activity.reports.map(r => (
               <Link key={r.id} to={`/admin/reports/${r.id}`} className="flex justify-between items-center p-2 rounded-xl hover:bg-stone-50 transition-colors border border-transparent hover:border-stone-100">
                 <div>
                    <p className="font-bold text-stone-900 text-sm">{r.pet_detail?.name || 'Unknown'}</p>
                    <p className="text-xs text-stone-500">{r.report_type} • {r.location}</p>
                 </div>
                 <span className={`badge text-[10px] ${r.status === 'Pending' ? 'badge-yellow' : r.status === 'Accepted' ? 'badge-green' : 'badge-red'}`}>
                    {r.status}
                 </span>
               </Link>
            ))}
          </div>
        </div>

        {/* Recent Adoptions */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-stone-900">Recent Adoptions</h2>
            <Link to="/admin/pets" className="text-xs text-brand-500 hover:underline font-bold uppercase tracking-wider">Registry →</Link>
          </div>
          <div className="space-y-3">
            {data.recent_activity.adoptions.map(a => (
               <div key={a.id} className="flex justify-between items-center p-2 rounded-xl bg-stone-50/50 border border-stone-100">
                 <div>
                    <p className="font-bold text-stone-900 text-sm">{a.pet_detail?.name}</p>
                    <p className="text-xs text-stone-500">Adopted by {a.user_detail}</p>
                 </div>
                 <span className="text-brand-600 font-bold text-xs">₹{a.price}</span>
               </div>
            ))}
            {data.recent_activity.adoptions.length === 0 && <p className="text-stone-400 text-sm italic text-center py-4">No adoptions yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
