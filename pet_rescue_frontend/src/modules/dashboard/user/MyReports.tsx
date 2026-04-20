import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../api/api';
import { Report } from '../../../types';
import ReportCard from '../../rescue/components/ReportCard';
import Spinner from '../../../components/common/Spinner';
import Empty from '../../../components/common/Empty';

const MyReports: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/rescue/reports/').then(r => setReports(r.data.data || [])).catch(() => { }).finally(() => setLoading(false));
  }, []);

  const del = async (id: number) => {
    if (!window.confirm('Delete this report?')) return;
    await api.delete(`/rescue/reports/${id}/`).catch(() => { });
    setReports(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-stone-900">My Reports</h1>
          <p className="text-stone-500 text-sm mt-0.5">Your lost & found pet reports</p>
        </div>
        <Link to="/dashboard/reports/new" className="px-4 py-2 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-600 transition-colors text-sm shadow-sm">
          + New Report
        </Link>
      </div>
      {loading ? <Spinner /> : reports.length === 0 ? (
        <Empty icon="📋" text="No reports yet." action={
          <Link to="/dashboard/reports/new" className="px-4 py-2 bg-brand-500 text-white font-semibold rounded-xl text-sm">File First Report</Link>
        } />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 justify-center">
          {reports.map(r => (
            <ReportCard key={r.id} report={r} actions={
              <button onClick={() => del(r.id)} className="flex-1 py-1.5 text-red-500 text-xs font-semibold hover:bg-red-50 rounded-lg transition-colors">Delete</button>
            } />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReports;
