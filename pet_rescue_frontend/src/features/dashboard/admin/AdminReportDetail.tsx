import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../../services/api';
import { Report, UserProfile, ShopOwnerProfile } from '../../../types';

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

  const pet = report.pet;
  const user = report.user;
  const profile = user.profile;

  // Helper to safely cast profile types
  const isShopOwnerProfile = (p: any): p is ShopOwnerProfile => p && 'shop_name' in p;
  const isUserProfile = (p: any): p is UserProfile => p && 'address' in p;

  return (
    <DetailLayout
      title={pet?.name || 'Unknown Pet'}
      subtitle={`${report.report_type} Report • ${report.location}`}
      backLink="/admin/reports"
      backText="Back to Reports"
      image={pet?.image_url || undefined}
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
      <div className="space-y-12">
        {/* Report Section */}
        <section>
          <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-4">Report Details</h3>
          <div className="bg-stone-50 p-6 rounded-3xl border border-stone-100 mb-6">
            <p className="text-stone-700 leading-relaxed italic">
              "{report.description || "No description provided."}"
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-stone-400 mb-1">Report Type</p>
              <p className="font-medium text-stone-900">{report.report_type}</p>
            </div>
            <div>
              <p className="text-xs text-stone-400 mb-1">Location</p>
              <p className="font-medium text-stone-900">{report.location}</p>
            </div>
          </div>
        </section>

        <hr className="border-stone-100" />

        {/* Reporter Section */}
        <section>
          <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-4">Reporter Details</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-stone-100 overflow-hidden border border-stone-200">
                {profile?.profile_picture_url ? (
                  <img src={profile.profile_picture_url} alt={user.username} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-400 font-bold text-xl uppercase">
                    {user.username.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <p className="font-bold text-stone-900 text-lg">{user.first_name} {user.last_name}</p>
                <p className="text-stone-500 text-sm">@{user.username} • {user.role}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm">
                <p className="text-xs text-stone-400 uppercase font-bold mb-2 tracking-wider">Contact Information</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Email:</span>
                    <span className="text-stone-900 font-medium">{user.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Phone:</span>
                    <span className="text-stone-900 font-medium">
                      {isUserProfile(profile) ? profile.phone_number : (isShopOwnerProfile(profile) ? profile.phone_number : '—')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Address:</span>
                    <span className="text-stone-900 font-medium text-right max-w-[200px]">
                      {isUserProfile(profile) ? profile.address : (isShopOwnerProfile(profile) ? profile.shop_address : '—')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {pet && (
          <>
            <hr className="border-stone-100" />
            {/* Pet Section */}
            <section>
              <div className="flex justify-between items-end mb-4">
                <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest">Pet Information</h3>
                <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-bold rounded-full border border-amber-100">
                  {pet.pet_id}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm">
                  <p className="text-[10px] text-stone-400 uppercase font-bold mb-1">Species</p>
                  <p className="font-semibold text-stone-900">{pet.species}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm">
                  <p className="text-[10px] text-stone-400 uppercase font-bold mb-1">Breed</p>
                  <p className="font-semibold text-stone-900">{pet.breed || '—'}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm">
                  <p className="text-[10px] text-stone-400 uppercase font-bold mb-1">Gender</p>
                  <p className="font-semibold text-stone-900">{pet.gender || '—'}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm">
                  <p className="text-[10px] text-stone-400 uppercase font-bold mb-1">Age</p>
                  <p className="font-semibold text-stone-900">{pet.age ? `${pet.age} yrs` : '—'}</p>
                </div>
              </div>
            </section>
          </>
        )}
      </div>

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
