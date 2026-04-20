import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { imgUrl } from '../../../api/api';
import { AdoptionRequest } from '../../../types';
import Spinner from '../../../components/common/Spinner';
import Empty from '../../../components/common/Empty';

const statusCls: Record<string, string> = {
  Pending: 'bg-amber-50 text-amber-600 border-amber-100',
  Approved: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  Rejected: 'bg-red-50 text-red-500 border-red-100',
  Completed: 'bg-stone-100 text-stone-500 border-stone-200',
};

const MyAdoptions: React.FC = () => {
  const [requests, setRequests] = useState<AdoptionRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/adoption/requests/').then(r => setRequests(r.data.data || r.data.results || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-stone-900">My Adoptions</h1>
          <p className="text-stone-500 text-sm mt-0.5">Your adoption requests and history</p>
        </div>
        <Link to="/adoption" className="px-4 py-2 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-600 transition-colors text-sm shadow-sm">
          Browse Pets
        </Link>
      </div>
      {loading ? <Spinner /> : requests.length === 0 ? (
        <Empty icon="🏠" text="No adoption requests yet." action={
          <Link to="/adoption" className="px-4 py-2 bg-brand-500 text-white font-semibold rounded-xl text-sm">Find a Pet</Link>
        } />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {requests.map(req => (
            <div key={req.id} className="bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-sm">
              <div className="h-40 bg-stone-100 overflow-hidden">
                <img src={imgUrl(req.pet_detail?.image_url)} alt={req.pet_detail?.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-stone-900">{req.pet_detail?.name}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusCls[req.status] || statusCls.Pending}`}>{req.status}</span>
                </div>
                <p className="text-xs text-stone-500 mb-1">{req.pet_detail?.species} · {req.pet_detail?.breed || '—'}</p>
                <p className="text-xs text-stone-400">{new Date(req.created_at).toLocaleDateString()}</p>
                {req.request_details && <p className="text-xs text-stone-500 mt-2 line-clamp-2">{req.request_details}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAdoptions;
