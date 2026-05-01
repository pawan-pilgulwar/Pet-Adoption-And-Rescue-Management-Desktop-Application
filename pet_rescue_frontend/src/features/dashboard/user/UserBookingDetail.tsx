import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../../services/api';
import { Booking } from '../../../types';
import Spinner from '../../../components/common/Spinner';
import DetailLayout from '../../../components/common/DetailLayout';
import Button from '../../../components/common/Button';
import ConfirmModal from '../../../components/ui/ConfirmModal';

function UserBookingDetail() {
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
      api.get(`/bookings/${id}/`)
        .then(res => setBooking(res.data))
        .catch(() => { })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleCancel = () => {
    showConfirm(
      "Cancel Booking",
      "Are you sure you want to cancel your booking? This action cannot be undone.",
      async () => {
        try {
          await api.post(`/bookings/${id}/cancel/`);
          setBooking(prev => prev ? { ...prev, status: 'Cancelled' } : null);
          showAlert("Cancelled", "Your booking has been cancelled successfully.", "success");
        } catch {
          showAlert("Error", "Failed to cancel booking. Please try again.", "danger");
        }
      },
      'danger'
    );
  };

  if (loading) return <Spinner message="Loading booking details..." />;
  if (!booking) return <div className="p-8 text-center text-red-500">Booking not found</div>;

  return (
    <DetailLayout
      title={booking.service_name || 'Service Booking'}
      subtitle={`With ${booking.shop_name || 'Service Provider'}`}
      backLink="/dashboard/bookings"
      backText="Back to My Bookings"
      imageFallback="📅"
      stats={[
        { label: 'Status', value: booking.status === 'Confirmed' ? 'Upcoming' : booking.status },
        { label: 'Date', value: new Date(booking.booking_date).toLocaleDateString() },
        { label: 'Time', value: new Date(booking.booking_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
        { label: 'Fee', value: `₹${booking.service_price}` }
      ]}
      actions={
        booking.status === 'Pending' || booking.status === 'Confirmed' ? (
          <Button variant="outline" className="text-red-500 hover:bg-red-50 border-red-200" onClick={handleCancel}>
            Cancel Booking
          </Button>
        ) : null
      }
    >
      <div className="grid md:grid-cols-2 gap-8">
        <section className="space-y-4">
          <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest">My Notes</h3>
          <p className="text-stone-700 leading-relaxed italic bg-stone-50 p-4 rounded-2xl border border-stone-100">
            {booking.additional_notes || "No additional notes provided."}
          </p>
        </section>

        <section className="space-y-4">
          <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest">Provider Details</h3>
          <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 space-y-3">
            <div>
              <p className="text-[10px] text-orange-600 font-bold uppercase tracking-wider">Shop Name</p>
              <p className="text-stone-900 font-bold">{booking.shop_name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-[10px] text-orange-600 font-bold uppercase tracking-wider">Contact Number</p>
              <p className="text-stone-700 font-medium">{booking.shop_contact || 'N/A'}</p>
            </div>
            <div>
              <p className="text-[10px] text-orange-600 font-bold uppercase tracking-wider">Location</p>
              <p className="text-stone-600 text-sm">{booking.shop_address || 'N/A'}</p>
            </div>
          </div>
        </section>
      </div>

      <hr className="border-stone-100" />

      <section>
        <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-4">How to Prepare</h3>
        <ul className="space-y-2 text-stone-600 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-brand-500">✓</span>
            Reach the location 10 minutes before the scheduled time.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-brand-500">✓</span>
            Carry your pet's basic medical history if available.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-brand-500">✓</span>
            Keep the shop's contact number handy for any delays.
          </li>
        </ul>
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

export default UserBookingDetail;
