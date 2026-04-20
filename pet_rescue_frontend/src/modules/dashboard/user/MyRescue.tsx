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

const MyRescue: React.FC = () => {
  const [requests, setRequests] = useState<RescueRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/rescue/requests/').then(r => setRequests(r.data.data || r.data.results || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-stone-900">Rescue Requests</h1>
        <p className="text-stone-500 text-sm mt-0.5">Your submitted rescue requests</p>
      </div>
      {loading ? <Spinner /> : requests.length === 0 ? (
        <Empty icon="🚨" text="No rescue requests yet." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {requests.map(req => (
            <div key={req.id} className="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusCls[req.status] || statusCls.Pending}`}>{req.status}</span>
                <span className="text-[10px] text-stone-400">{new Date(req.created_at).toLocaleDateString()}</span>
              </div>
              <p className="font-semibold text-stone-900 text-sm mb-1">
                Report: {req.report_detail?.rescue_id || `#${req.report}`}
              </p>
              {req.report_detail && (
                <p className="text-xs text-stone-500 mb-2">
                  {req.report_detail.pet_detail?.name} · {req.report_detail.report_type} · {req.report_detail.location}
                </p>
              )}
              {req.message && <p className="text-xs text-stone-400 line-clamp-2">{req.message}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRescue;
