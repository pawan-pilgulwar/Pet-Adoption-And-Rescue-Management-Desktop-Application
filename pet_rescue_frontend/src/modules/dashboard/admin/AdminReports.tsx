import React, { useEffect, useState } from 'react';
import api from '../../../api/api';
import { Report } from '../../../types';
import ReportCard from '../../rescue/components/ReportCard';
import Spinner from '../../../components/common/Spinner';
import Empty from '../../../components/common/Empty';

const AdminReports: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    api.get('/rescue/reports/').then(r => setReports(r.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const verify = async (id: number) => {
    await api.post(`/rescue/reports/${id}/verify/`).catch(() => {});
    setReports(prev => prev.map(r => r.id === id ? { ...r, is_verified: true, status: 'Accepted' } : r));
  };

  const reject = async (id: number) => {
    const reason = prompt('Rejection reason (optional):') || '';
    await api.patch(`/rescue/reports/${id}/`, { status: 'Rejected', admin_comment: reason }).catch(() => {});
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: 'Rejected' } : r));
  };

  const filtered = filter ? reports.filter(r => r.status === filter) : reports;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-stone-900">Manage Reports</h1>
          <p className="text-stone-500 text-sm mt-0.5">Review and verify community rescue reports</p>
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 flex-wrap">
        {['', 'Pending', 'Accepted', 'Rejected'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${filter === s ? 'bg-brand-500 text-white' : 'bg-stone-100 text-stone-600 hover:bg-brand-50 hover:text-brand-600'}`}>
            {s === '' ? 'All' : s}
          </button>
        ))}
        {!loading && <span className="ml-auto text-xs text-stone-400 self-center">{filtered.length} reports</span>}
      </div>

      {loading ? <Spinner /> : filtered.length === 0 ? <Empty icon="📋" text="No reports found." /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(r => (
            <ReportCard key={r.id} report={r} actions={
              r.status === 'Pending' ? (
                <>
                  <button onClick={() => verify(r.id)} className="flex-1 py-1.5 bg-emerald-500 text-white text-xs font-semibold rounded-lg hover:bg-emerald-600 transition-colors">✓ Accept</button>
                  <button onClick={() => reject(r.id)} className="flex-1 py-1.5 bg-red-50 text-red-500 text-xs font-semibold rounded-lg hover:bg-red-100 transition-colors">✕ Reject</button>
                </>
              ) : (
                <div className="flex-1 text-center py-1.5 bg-stone-50 text-stone-500 text-xs font-medium rounded-lg">{r.status}</div>
              )
            } />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReports;
