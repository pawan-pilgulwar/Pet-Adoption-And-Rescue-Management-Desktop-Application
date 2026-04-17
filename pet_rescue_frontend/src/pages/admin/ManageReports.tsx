import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Report } from '../../types';
import ReportCard from '../../components/ReportCard';
import Button from '../../components/Button';

const ManageReports: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await api.get('/rescue/reports/');
      setReports(response.data.data);
    } catch (error) {
      console.error('Error fetching admin reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      const comment = newStatus === 'Rejected'
        ? prompt("Enter rejection reason (optional):") || ""
        : "Approved by administrator.";

      if (newStatus === 'Accepted') {
        await api.post(`/rescue/reports/${id}/verify/`);
      } else {
        await api.patch(`/rescue/reports/${id}/`, { status: newStatus, admin_comment: comment });
      }

      setReports(reports.map(r =>
        r.id === id ? { ...r, status: newStatus as any, admin_comment: comment } : r
      ));
    } catch (error) {
      console.error('Failed to update report status:', error);
      alert('Error updating report status.');
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900">Manage Reports</h1>
        <p className="text-slate-500 text-sm mt-0.5">Review and manage community rescue reports.</p>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-3"></div>
          <p className="text-slate-400 text-sm">Loading reports...</p>
        </div>
      ) : reports.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-orange-100">
          <span className="text-4xl block mb-3">📋</span>
          <p className="text-slate-500 text-sm font-medium">No reports found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reports.map((report) => (
            <ReportCard key={report.id} report={report}>
              {report.status === 'Pending' ? (
                <>
                  <Button className="flex-1" variant="success" onClick={() => handleUpdateStatus(report.id, 'Accepted')}>
                    ✓ Accept
                  </Button>
                  <Button className="flex-1" variant="danger" onClick={() => handleUpdateStatus(report.id, 'Rejected')}>
                    ✕ Reject
                  </Button>
                </>
              ) : (
                <div className="w-full text-center text-xs font-medium py-2 rounded-lg bg-slate-50 text-slate-500">
                  {report.status}{report.admin_comment ? ` — ${report.admin_comment}` : ''}
                </div>
              )}
            </ReportCard>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageReports;
