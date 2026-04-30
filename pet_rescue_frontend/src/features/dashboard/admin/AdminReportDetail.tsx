import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../../services/api';
import { Report } from '../../../types';
import Spinner from '../../../components/common/Spinner';
import DetailLayout from '../../../components/common/DetailLayout';
import Button from '../../../components/common/Button';
import ConfirmModal from '../../../components/ui/ConfirmModal';

function AdminReportDetail() {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel?: () => void;
    type?: 'danger' | 'info' | 'success';
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const showConfirm = (title: string, message: string, onConfirm: () => void, type: 'danger' | 'info' | 'success' = 'info') => {
    setModalConfig({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        onConfirm();
        setModalConfig(prev => ({ ...prev, isOpen: false }));
      },
      onCancel: () => setModalConfig(prev => ({ ...prev, isOpen: false })),
      type
    });
  };

  const showAlert = (title: string, message: string, type: 'info' | 'success' | 'danger' = 'info') => {
    setModalConfig({
      isOpen: true,
      title,
      message,
      onConfirm: () => setModalConfig(prev => ({ ...prev, isOpen: false })),
      type
    });
  };

  useEffect(() => {
    if (id) {
      api.get(`/rescue/reports/${id}/`)
        .then(res => setReport(res.data?.data || res.data))
        .catch(() => { })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleVerify = () => {
    showConfirm(
      "Verify Report",
      "This action will mark the report as verified and notify the user. Continue?",
      async () => {
        try {
          await api.post(`/rescue/reports/${id}/verify/`);
          setReport(prev => prev ? { ...prev, is_verified: true, status: 'Accepted' } : null);
          showAlert("Verified", "Report verified successfully", "success");
        } catch {
          showAlert("Error", "Verification failed", "danger");
        }
      }
    );
  };

  if (loading) return <Spinner message="Loading report..." />;
  if (!report) return <div className="p-8 text-center text-red-500">Report not found</div>;

  const pet = report.pet_detail;

  return (
    <DetailLayout
      title={pet?.name || 'Unknown Pet'}
      subtitle={`${report.report_type} Report • ${report.location}`}
      backLink="/admin/reports"
      backText="Back to Reports"
      image={report.pet_detail?.image_url || undefined}
      stats={[
        { label: 'Rescue ID', value: report.rescue_id },
        { label: 'Status', value: report.status },
        { label: 'Verified', value: report.is_verified ? 'Yes' : 'No' },
        { label: 'Date', value: new Date(report.created_at).toLocaleDateString() }
      ]}
      actions={
        !report.is_verified ? (
          <Button onClick={handleVerify}>Verify Report</Button>
        ) : (
          <div className="bg-green-50 text-green-700 p-4 rounded-2xl border border-green-100 text-center text-sm font-bold">
            ✓ Report Verified
          </div>
        )
      }
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
          <p className="text-xs text-stone-400 uppercase font-bold mb-2 tracking-wider">Reporter Contact</p>
          <div className="space-y-1 text-sm">
            <p className="text-stone-900 font-semibold">{report.user_detail}</p>
            <p className="text-stone-500">{report.user_contact?.email}</p>
            <p className="text-stone-500">{report.user_contact?.phone !== '—' ? report.user_contact?.phone : 'No phone provided'}</p>
          </div>
        </div>
      </section>
      
      <ConfirmModal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        onConfirm={modalConfig.onConfirm}
        onCancel={modalConfig.onCancel}
        type={modalConfig.type}
      />
    </DetailLayout>
  );
}

export default AdminReportDetail;
