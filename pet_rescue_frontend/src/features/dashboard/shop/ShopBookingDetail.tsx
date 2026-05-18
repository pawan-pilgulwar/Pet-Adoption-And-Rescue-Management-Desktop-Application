import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../../services/api';
import { Booking, UserProfile } from '../../../types';

import Spinner from '../../../components/common/Spinner';
import DetailLayout from '../../../components/common/DetailLayout';
import Button from '../../../components/common/Button';
import ConfirmModal from '../../../components/ui/ConfirmModal';

function ShopBookingDetail() {
  const { id } = useParams<{ id: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
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
    onConfirm: () => { },
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
      api.get(`/bookings/${id}/`)
        .then(res => setBooking(res.data))
        .catch(() => { })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleCancel = () => {
    showConfirm(
      "Cancel Booking",
      "Are you sure you want to cancel this booking? This action cannot be undone.",
      async () => {
        try {
          await api.post(`/bookings/${id}/cancel/`);
          setBooking(prev => prev ? { ...prev, status: 'Cancelled' } : null);
          showAlert("Cancelled", "Booking cancelled successfully", "success");
        } catch {
          showAlert("Error", "Failed to cancel booking", "danger");
        }
      },
      'danger'
    );
  };

  if (loading) return <Spinner message="Loading booking details..." />;
  if (!booking) return <div className="p-8 text-center text-red-500">Booking not found</div>;

  const { user, service } = booking;
  const profile = user.profile;

  return (
    <DetailLayout
      title={service.name || 'Service Booking'}
      subtitle={`Customer: ${user.first_name} ${user.last_name}`}
      backLink="/dashboard/bookings"
      backText="Back to Bookings"
      image={service.image_url || undefined}
      stats={[
        { label: 'Status', value: booking.status },
        { label: 'Date', value: new Date(booking.booking_date).toLocaleDateString() },
        { label: 'Time', value: new Date(booking.booking_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
        { label: 'Price', value: `₹${service.price}` }
      ]}
      actions={
        booking.status === 'Confirmed' ? (
          <div className="flex gap-2">
            <Button variant="outline" className="text-red-500 hover:bg-red-50 border-red-200" onClick={handleCancel}>
              Cancel Booking
            </Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={() => {
              showConfirm(
                "Complete Booking",
                "Are you sure you want to mark this booking as completed?",
                async () => {
                  try {
                    await api.post(`/bookings/${id}/complete/`);
                    setBooking(prev => prev ? { ...prev, status: 'Completed' } : null);
                    showAlert("Success", "Booking marked as completed", "success");
                  } catch {
                    showAlert("Error", "Failed to update booking", "danger");
                  }
                },
                'success'
              );
            }}>
              Mark as Completed
            </Button>
          </div>
        ) : null
      }
    >
      <div className="space-y-12">
        {/* Booking Details Section */}
        <section>
          <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-4">Booking Information</h3>
          <div className="bg-stone-50 p-6 rounded-3xl border border-stone-100 mb-6">
            <p className="text-stone-700 leading-relaxed italic">
              "{booking.additional_notes || "No additional notes provided."}"
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm">
              <p className="text-[10px] text-stone-400 uppercase font-bold mb-1">Booking ID</p>
              <p className="font-semibold text-stone-900">#{booking.id}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm">
              <p className="text-[10px] text-stone-400 uppercase font-bold mb-1">Created At</p>
              <p className="font-semibold text-stone-900">{new Date(booking.created_at).toLocaleString()}</p>
            </div>
          </div>
        </section>

        <hr className="border-stone-100" />

        {/* Customer Section */}
        <section>
          <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-6">Customer Details</h3>
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-2xl bg-stone-100 overflow-hidden border border-stone-200">
              {profile?.profile_picture_url ? (
                <img src={profile.profile_picture_url} alt={user.username} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-400 font-bold text-2xl uppercase">
                  {user.username.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <p className="font-bold text-stone-900 text-xl">{user.first_name} {user.last_name}</p>
              <p className="text-stone-500">@{user.username} • Customer</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm">
              <p className="text-[10px] text-stone-400 uppercase font-bold mb-1">Email</p>
              <p className="font-semibold text-stone-900">{user.email}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm">
              <p className="text-[10px] text-stone-400 uppercase font-bold mb-1">Phone</p>
              <p className="font-semibold text-stone-900">{(profile as UserProfile)?.phone_number || '—'}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm">
              <p className="text-[10px] text-stone-400 uppercase font-bold mb-1">Address</p>
              <p className="font-semibold text-stone-900 truncate">{(profile as UserProfile)?.address || '—'}</p>
            </div>
          </div>
        </section>

        <hr className="border-stone-100" />

        {/* Service Section */}
        <section>
          <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-6">Service Details</h3>
          <div className="bg-stone-50 p-6 rounded-3xl border border-stone-100">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="font-bold text-stone-900 text-lg">{service.name}</p>
                <p className="text-stone-500 text-sm">{service.service_type} Service • {service.duration || 'Flexible'}</p>
              </div>
              <p className="font-bold text-stone-900 text-xl">₹{service.price}</p>
            </div>
            <p className="text-stone-700 text-sm leading-relaxed">{service.description}</p>
            
            {service.service_type === 'Medical' && (
              <div className="mt-6 pt-6 border-t border-stone-200 grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-[10px] text-stone-400 uppercase font-bold mb-1">Medical Type</p>
                  <p className="font-semibold text-stone-900">{service.medical_type || '—'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-stone-400 uppercase font-bold mb-1">Doctor</p>
                  <p className="font-semibold text-stone-900">{service.doctor_name || '—'}</p>
                </div>
              </div>
            )}
          </div>
        </section>
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

export default ShopBookingDetail;
