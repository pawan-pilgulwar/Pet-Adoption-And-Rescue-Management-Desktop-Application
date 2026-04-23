import React, { useState, useEffect } from 'react';
import { fetchMyRescueRequests } from '../../rescue/api';
import { RescueRequest } from '../../../types';
import Spinner from '../../../components/common/Spinner';
import Empty from '../../../components/common/Empty';

function MyRescue() {
  const [requests, setRequests] = useState<RescueRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyRescueRequests()
      .then(data => setRequests(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900">My Rescue Requests</h1>
        <p className="text-stone-500">Requests you have made to help rescue reported pets.</p>
      </div>

      {loading ? (
        <Spinner />
      ) : requests.length === 0 ? (
        <div className="card">
          <Empty message="You haven't submitted any rescue requests." />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map(req => (
            <div key={req.id} className="card">
              <div className="flex justify-between items-start mb-3">
                <span className={`badge ${
                  req.status === 'Accepted' ? 'badge-green' : 
                  req.status === 'Rejected' ? 'badge-red' : 
                  req.status === 'Completed' ? 'badge-blue' : 'badge-yellow'
                }`}>
                  {req.status}
                </span>
                <span className="text-xs text-stone-400 font-mono">{req.report_detail?.rescue_id}</span>
              </div>
              <p className="font-semibold text-stone-900 mb-1">
                {req.report_detail?.report_type === 'Lost' ? '🔴 Lost' : '🟢 Found'} Pet Request
              </p>
              <p className="text-sm text-stone-500 mb-3">{req.report_detail?.location}</p>
              {req.message && (
                <div className="bg-orange-50 rounded-lg p-3 text-sm text-stone-700 italic">
                  "{req.message}"
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyRescue;
