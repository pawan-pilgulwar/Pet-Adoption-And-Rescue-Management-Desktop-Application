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

  const statCards = [
    {
      label: 'Total Users',
      value: stats.total_users,
      icon: '👥',
      color: 'from-orange-500 to-amber-500',
      bgLight: 'bg-orange-50',
    },
    {
      label: 'Pets for Adoption',
      value: stats.total_pets,
      icon: '🐕',
      color: 'from-teal-500 to-emerald-500',
      bgLight: 'bg-teal-50',
    },
    {
      label: 'Community Reports',
      value: stats.total_reports,
      icon: '📋',
      color: 'from-purple-500 to-indigo-500',
      bgLight: 'bg-purple-50',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in group">
      <div>
        <h1 className="text-3xl font-black text-slate-800 mb-2 group-hover:text-orange-500 transition-colors">Admin Analysis Dashboard</h1>
        <p className="text-slate-500">Comprehensive overview of platform activity and rescue metrics.</p>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <span className="text-4xl animate-float inline-block">📊</span>
          <p className="mt-4 text-slate-500 font-bold">Fetching latest analytics...</p>
        </div>
      ) : (
        <>
          {/* Main Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {statCards.map((card) => (
              <div
                key={card.label}
                className="bg-white p-6 rounded-2xl shadow-sm border border-orange-50 card-hover group/card"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 ${card.bgLight} rounded-2xl flex items-center justify-center text-2xl group-hover/card:scale-110 transition-transform`}>
                    {card.icon}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-400">{card.label}</p>
                    <p className={`text-3xl font-black bg-gradient-to-r ${card.color} bg-clip-text text-transparent`}>
                      {card.value}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Report Status Distribution */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-orange-50 relative overflow-hidden">
              {/* Decorative Background */}
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-orange-50 rounded-full blur-3xl opacity-50"></div>

              <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2 relative z-10">
                <span className="p-2 bg-orange-100 rounded-lg text-lg">📊</span> Rescue Report Distribution
              </h2>
              <div className="space-y-4 relative z-10">
                {[
                  { label: 'Accepted Reports', value: stats.report_stats.accepted, color: 'bg-teal-500', text: 'text-teal-600', percentage: stats.total_reports > 0 ? (stats.report_stats.accepted / stats.total_reports) * 100 : 0 },
                  { label: 'Pending Review', value: stats.report_stats.pending, color: 'bg-amber-500', text: 'text-amber-600', percentage: stats.total_reports > 0 ? (stats.report_stats.pending / stats.total_reports) * 100 : 0 },
                  { label: 'Rejected/Closed', value: stats.report_stats.rejected, color: 'bg-red-500', text: 'text-red-600', percentage: stats.total_reports > 0 ? (stats.report_stats.rejected / stats.total_reports) * 100 : 0 },
                ].map((item) => (
                  <div key={item.label} className="p-4 rounded-xl border border-slate-50 bg-slate-50/30 backdrop-blur-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-slate-600">{item.label}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-black ${item.text}`}>{item.value}</span>
                        <span className="text-[10px] text-slate-400 font-bold bg-white px-1.5 py-0.5 rounded border border-slate-100">
                          {Math.round(item.percentage)}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                      <div
                        className={`h-full ${item.color} transition-all duration-1000 ease-out`}
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Users List */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-orange-50">
              <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                <span className="p-2 bg-blue-100 rounded-lg text-lg">👋</span> New Registered Members
              </h2>
              <div className="space-y-3">
                {stats.recent_activity.users.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-slate-400 font-medium italic">No recent registrations found.</p>
                  </div>
                ) : (
                  stats.recent_activity.users.map((u: any) => (
                    <div key={u.id} className="group/user flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-blue-100 hover:bg-blue-50/50 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-black text-sm border-2 border-white shadow-sm transition-transform group-hover/user:rotate-12">
                          {u.first_name?.[0]?.toUpperCase() || u.username[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800 leading-none mb-1">
                            {u.first_name || u.username} {u.last_name || ''}
                          </p>
                          <p className="text-xs text-slate-400">{u.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                          {new Date(u.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Activity Logs Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-orange-50 overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                <span className="p-2 bg-indigo-100 rounded-lg text-lg">📜</span> Platform Activity Logs
              </h2>
              <span className="text-[10px] font-black bg-white px-3 py-1 rounded-full border border-slate-100 text-slate-400 uppercase tracking-widest">
                Real-time
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white">
                    <th className="py-4 px-6 border-b border-slate-100">Rescue Entry</th>
                    <th className="py-4 px-6 border-b border-slate-100">Category</th>
                    <th className="py-4 px-6 border-b border-slate-100">Location</th>
                    <th className="py-4 px-6 border-b border-slate-100 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {stats.recent_activity.reports.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-20 text-center text-slate-300 font-medium italic">No recent platform activity to display.</td>
                    </tr>
                  ) : (
                    stats.recent_activity.reports.map((r: any) => (
                      <tr key={r.id} className="hover:bg-slate-50/30 transition-colors group/row">
                        <td className="py-4 px-6">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-800 group-hover/row:text-orange-600 transition-colors">{r.pet_name}</span>
                            <span className="text-[10px] text-slate-400">{new Date(r.created_at).toLocaleDateString()}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{r.species}</span>
                        </td>
                        <td className="py-4 px-6 text-sm text-slate-500 font-medium">
                          {r.location}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <span className={`text-[10px] font-black px-3 py-1 rounded-full border ${r.status === 'Accepted' ? 'bg-teal-50 text-teal-600 border-teal-100' :
                              r.status === 'Rejected' ? 'bg-red-50 text-red-600 border-red-100' :
                                'bg-amber-50 text-amber-600 border-amber-100'
                            }`}>
                            {r.status.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-slate-50/30 text-center border-t border-slate-50">
              <p className="text-xs text-slate-400 font-bold">Showing the 5 most recent platform events</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
