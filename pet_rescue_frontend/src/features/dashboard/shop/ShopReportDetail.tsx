import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../../services/api';
import { Report } from '../../../types';
import Spinner from '../../../components/common/Spinner';
import DetailLayout from '../../../components/common/DetailLayout';

function ShopReportDetail() {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      api.get(`/rescue/reports/${id}/`)
        .then(res => setReport(res.data?.data || res.data))
        .catch(() => { })
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <Spinner message="Loading report..." />;
  if (!report) return <div className="p-8 text-center text-red-500">Report not found</div>;

  const pet = report.pet_detail;

  return (
    <DetailLayout
      title={pet?.name || 'Unknown Pet'}
      subtitle={`${report.report_type} Report • ${report.location}`}
      backLink="/dashboard/reports"
      backText="Back to My Reports"
      image={report.pet_detail?.image_url || undefined}
      stats={[
        { label: 'Rescue ID', value: report.rescue_id },
        { label: 'Status', value: report.status },
        { label: 'Verified', value: report.is_verified ? 'Yes' : 'No' },
        { label: 'Date', value: new Date(report.created_at).toLocaleDateString() }
      ]}
    >
      <section>
        <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-4">Pet Information</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-xs text-stone-400 mb-1">Species</p>
            <p className="font-medium text-stone-900">{pet?.species || '—'}</p>
          </div>
          <div>
            <p className="text-xs text-stone-400 mb-1">Breed</p>
            <p className="font-medium text-stone-900">{pet?.breed || '—'}</p>
          </div>
        </div>
      </section>

      <hr className="border-stone-100" />

      <section>
        <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-4">Report Details</h3>
        <p className="text-stone-700 leading-relaxed mb-6">
          {report.description || "No description provided."}
        </p>
        <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100">
          <p className="text-xs text-stone-400 uppercase font-bold mb-2 tracking-wider">Verification Status</p>
          <p className="text-sm text-stone-600">
            {report.is_verified
              ? "This report has been verified by the administrator."
              : "This report is currently pending verification."}
          </p>
        </div>
      </section>
    </DetailLayout>
  );
}

export default ShopReportDetail;
