import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>({
    total_users: 0,
    total_reports: 0,
    total_pets: 0,
    report_stats: { pending: 0, accepted: 0, rejected: 0 },
    recent_activity: { reports: [], users: [] }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/users/admin-dashboard/');
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching admin dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Dashboard Overview</h1>
          <p className="text-slate-500 text-sm mt-0.5">Platform-wide analytics and metrics.</p>
        </div>
        <span className="hidden md:block bg-orange-500 text-white px-4 py-1.5 rounded-xl text-xs font-bold shadow-md shadow-orange-500/20">
          Administrator
        </span>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-400 text-sm">Loading analytics...</p>
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'Platform Users', value: stats.total_users, icon: '👥', bg: 'bg-orange-50', text: 'text-orange-500' },
              { label: 'Active Pets', value: stats.total_pets, icon: '🐕', bg: 'bg-teal-50', text: 'text-teal-500' },
              { label: 'Total Reports', value: stats.total_reports, icon: '📋', bg: 'bg-purple-50', text: 'text-purple-500' },
            ].map((card) => (
              <div key={card.label} className="bg-white p-6 rounded-2xl border border-orange-100 shadow-sm flex items-center gap-5">
                <div className={`w-12 h-12 ${card.bg} rounded-xl flex items-center justify-center text-2xl`}>
                  {card.icon}
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">{card.label}</p>
                  <p className={`text-3xl font-black ${card.text}`}>{card.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Report Status */}
            <div className="bg-white p-6 rounded-2xl border border-orange-100 shadow-sm">
              <h2 className="font-bold text-slate-900 mb-5 flex items-center gap-2">
                <span className="w-7 h-7 bg-orange-50 text-orange-500 rounded-lg flex items-center justify-center text-sm">📊</span>
                Report Status
              </h2>
              <div className="space-y-4">
                {[
                  { label: 'Accepted', value: stats.report_stats.accepted, color: 'bg-emerald-500', text: 'text-emerald-600' },
                  { label: 'Pending', value: stats.report_stats.pending, color: 'bg-amber-400', text: 'text-amber-600' },
                  { label: 'Rejected', value: stats.report_stats.rejected, color: 'bg-slate-300', text: 'text-slate-500' },
                ].map((item) => {
                  const pct = stats.total_reports > 0 ? (item.value / stats.total_reports) * 100 : 0;
                  return (
                    <div key={item.label}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-sm font-medium text-slate-600">{item.label}</span>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-bold ${item.text}`}>{item.value}</span>
                          <span className="text-[10px] text-slate-400">{Math.round(pct)}%</span>
                        </div>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${item.color} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Users */}
            <div className="bg-white p-6 rounded-2xl border border-orange-100 shadow-sm">
              <h2 className="font-bold text-slate-900 mb-5 flex items-center gap-2">
                <span className="w-7 h-7 bg-orange-50 text-orange-500 rounded-lg flex items-center justify-center text-sm">👋</span>
                New Members
              </h2>
              <div className="space-y-3">
                {stats.recent_activity.users.length === 0 ? (
                  <div className="text-center py-10 text-slate-400 text-sm">No recent users</div>
                ) : (
                  stats.recent_activity.users.map((u: any) => (
                    <div key={u.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-orange-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm">
                          {u.first_name?.[0]?.toUpperCase() || u.username[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 text-sm leading-none">{u.first_name || u.username} {u.last_name || ''}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{u.email}</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400">{new Date(u.created_at).toLocaleDateString()}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Activity Logs */}
          <div className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-orange-50 flex justify-between items-center">
              <h2 className="font-bold text-slate-900 flex items-center gap-2">
                <span className="w-7 h-7 bg-orange-500 text-white rounded-lg flex items-center justify-center text-sm">📜</span>
                Recent Reports
              </h2>
              <span className="text-[10px] font-bold bg-orange-50 text-orange-500 px-3 py-1 rounded-full">Live</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50">
                    <th className="py-3 px-5 border-b border-slate-100">Pet</th>
                    <th className="py-3 px-5 border-b border-slate-100">Type</th>
                    <th className="py-3 px-5 border-b border-slate-100 hidden md:table-cell">Location</th>
                    <th className="py-3 px-5 border-b border-slate-100 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {stats.recent_activity.reports.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-slate-400 text-sm">No recent activity</td>
                    </tr>
                  ) : (
                    stats.recent_activity.reports.map((r: any) => (
                      <tr key={r.id} className="hover:bg-orange-50/30 transition-colors">
                        <td className="py-3.5 px-5">
                          <p className="font-semibold text-slate-900 text-sm">{r.pet_detail?.name}</p>
                          <p className="text-[10px] text-slate-400">{new Date(r.created_at).toLocaleDateString()}</p>
                        </td>
                        <td className="py-3.5 px-5">
                          <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">{r.pet_detail?.species}</span>
                        </td>
                        <td className="py-3.5 px-5 text-sm text-slate-500 hidden md:table-cell">{r.location}</td>
                        <td className="py-3.5 px-5 text-right">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                            r.status === 'Accepted' ? 'bg-emerald-50 text-emerald-600' :
                            r.status === 'Rejected' ? 'bg-slate-100 text-slate-500' :
                            'bg-amber-50 text-amber-600'
                          }`}>
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
