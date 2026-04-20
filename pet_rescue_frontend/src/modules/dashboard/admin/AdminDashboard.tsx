import React, { useEffect, useState } from 'react';
import api from '../../../api/api';
import StatCard from '../components/StatCard';
import Spinner from '../../../components/common/Spinner';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users/admin-dashboard/').then(r => setStats(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (!stats) return null;

  const { total_users, total_pets, total_reports, report_stats, recent_activity } = stats;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-stone-900">Admin Dashboard</h1>
          <p className="text-stone-500 text-sm mt-0.5">Platform-wide analytics and metrics</p>
        </div>
        <span className="bg-brand-500 text-white px-4 py-1.5 rounded-xl text-xs font-bold shadow-md shadow-brand-500/20">Administrator</span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Users" value={total_users} icon="👥" color="bg-brand-50 text-brand-500" />
        <StatCard label="Total Pets" value={total_pets} icon="🐾" color="bg-teal-50 text-teal-500" />
        <StatCard label="Total Reports" value={total_reports} icon="📋" color="bg-purple-50 text-purple-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Report status */}
        <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm">
          <h2 className="font-bold text-stone-900 mb-5 flex items-center gap-2">
            <span className="w-7 h-7 bg-brand-50 text-brand-500 rounded-lg flex items-center justify-center text-sm">📊</span>
            Report Status
          </h2>
          <div className="space-y-4">
            {[
              { label: 'Accepted', value: report_stats.accepted, color: 'bg-emerald-500', text: 'text-emerald-600' },
              { label: 'Pending', value: report_stats.pending, color: 'bg-amber-400', text: 'text-amber-600' },
              { label: 'Rejected', value: report_stats.rejected, color: 'bg-stone-300', text: 'text-stone-500' },
            ].map(item => {
              const pct = total_reports > 0 ? Math.round((item.value / total_reports) * 100) : 0;
              return (
                <div key={item.label}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm font-medium text-stone-600">{item.label}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${item.text}`}>{item.value}</span>
                      <span className="text-[10px] text-stone-400">{pct}%</span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent users */}
        <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm">
          <h2 className="font-bold text-stone-900 mb-5 flex items-center gap-2">
            <span className="w-7 h-7 bg-brand-50 text-brand-500 rounded-lg flex items-center justify-center text-sm">👋</span>
            New Members
          </h2>
          <div className="space-y-3">
            {recent_activity.users.length === 0 ? (
              <p className="text-center text-stone-400 text-sm py-8">No recent users</p>
            ) : recent_activity.users.map((u: any) => (
              <div key={u.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-stone-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-sm">
                    {u.first_name?.[0]?.toUpperCase() || u.username[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-stone-900 text-sm">{u.first_name} {u.last_name}</p>
                    <p className="text-xs text-stone-400">{u.email}</p>
                  </div>
                </div>
                <span className="text-[10px] text-stone-400">{new Date(u.created_at).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent reports */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-stone-100 flex items-center justify-between">
          <h2 className="font-bold text-stone-900 flex items-center gap-2">
            <span className="w-7 h-7 bg-brand-500 text-white rounded-lg flex items-center justify-center text-sm">📜</span>
            Recent Reports
          </h2>
          <span className="text-[10px] font-bold bg-brand-50 text-brand-500 px-3 py-1 rounded-full">Live</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-stone-50 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                <th className="px-5 py-3 border-b border-stone-100">Pet</th>
                <th className="px-5 py-3 border-b border-stone-100">Type</th>
                <th className="px-5 py-3 border-b border-stone-100 hidden md:table-cell">Location</th>
                <th className="px-5 py-3 border-b border-stone-100 text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {recent_activity.reports.length === 0 ? (
                <tr><td colSpan={4} className="py-12 text-center text-stone-400 text-sm">No recent activity</td></tr>
              ) : recent_activity.reports.map((r: any) => (
                <tr key={r.id} className="border-b border-stone-50 hover:bg-stone-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="font-semibold text-stone-900 text-sm">{r.pet_detail?.name}</p>
                    <p className="text-[10px] text-stone-400">{new Date(r.created_at).toLocaleDateString()}</p>
                  </td>
                  <td className="px-5 py-3.5"><span className="text-xs font-medium bg-stone-100 text-stone-600 px-2.5 py-1 rounded-full">{r.pet_detail?.species}</span></td>
                  <td className="px-5 py-3.5 text-sm text-stone-500 hidden md:table-cell">{r.location}</td>
                  <td className="px-5 py-3.5 text-right">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${r.status === 'Accepted' ? 'bg-emerald-50 text-emerald-600' : r.status === 'Rejected' ? 'bg-stone-100 text-stone-500' : 'bg-amber-50 text-amber-600'}`}>{r.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
