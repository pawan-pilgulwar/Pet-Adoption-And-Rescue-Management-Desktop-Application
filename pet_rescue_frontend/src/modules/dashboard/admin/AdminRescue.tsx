import React, { useEffect, useState } from 'react';
import api from '../../../api/api';
import { RescueRequest } from '../../../types';
import Spinner from '../../../components/common/Spinner';
import Empty from '../../../components/common/Empty';

const statusCls: Record<string, string> = {
  Pending: 'bg-amber-50 text-amber-600',
  Accepted: 'bg-emerald-50 text-emerald-600',
  Rejected: 'bg-red-50 text-red-500',
  Completed: 'bg-stone-100 text-stone-500',
};

const AdminRescue: React.FC = () => {
  const [requests, setRequests] = useState<RescueRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/rescue/requests/').then(r => setRequests(r.data.data || r.data.results || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-stone-900">Rescue Requests</h1>
        <p className="text-stone-500 text-sm mt-0.5">All community rescue requests</p>
      </div>
      {loading ? <Spinner /> : requests.length === 0 ? <Empty icon="🚨" text="No rescue requests." /> : (
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-stone-50 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                  <th className="px-5 py-3 border-b border-stone-100">Report</th>
                  <th className="px-5 py-3 border-b border-stone-100">Requester</th>
                  <th className="px-5 py-3 border-b border-stone-100 hidden md:table-cell">Message</th>
                  <th className="px-5 py-3 border-b border-stone-100">Status</th>
                  <th className="px-5 py-3 border-b border-stone-100 hidden lg:table-cell">Date</th>
                </tr>
              </thead>
              <tbody>
                {requests.map(req => (
                  <tr key={req.id} className="border-b border-stone-50 hover:bg-stone-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-stone-900 text-sm">{req.report_detail?.rescue_id || `#${req.report}`}</p>
                      <p className="text-xs text-stone-400">{req.report_detail?.pet_detail?.name}</p>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-stone-600">{req.user_detail}</td>
                    <td className="px-5 py-3.5 text-xs text-stone-500 hidden md:table-cell max-w-xs truncate">{req.message || '—'}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusCls[req.status] || statusCls.Pending}`}>{req.status}</span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-stone-400 hidden lg:table-cell">{new Date(req.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRescue;
