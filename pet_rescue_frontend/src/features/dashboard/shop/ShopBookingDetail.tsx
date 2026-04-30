import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../../services/api';
import { Booking } from '../../../types';
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
      api.get(`/pet-services/bookings/${id}/`)
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
          await api.post(`/pet-services/bookings/${id}/cancel/`);
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

  return (
    <DetailLayout
      title={booking.service_name || 'Service Booking'}
      subtitle={`Customer: ${booking.user_name}`}
      backLink="/dashboard/bookings"
      backText="Back to Bookings"
      imageFallback="📅"
      stats={[
        { label: 'Status', value: booking.status },
        { label: 'Date', value: new Date(booking.booking_date).toLocaleDateString() },
        { label: 'Time', value: new Date(booking.booking_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
        { label: 'Price', value: `₹${booking.service_price}` }
      ]}
      actions={
        booking.status === 'Pending' || booking.status === 'Confirmed' ? (
          <Button variant="outline" className="text-red-500 hover:bg-red-50 border-red-200" onClick={handleCancel}>
            Cancel Booking
          </Button>
        ) : null
      }
    >
      <section>
        <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-4">Customer Notes</h3>
        <p className="text-stone-700 leading-relaxed italic">
          {booking.additional_notes || "No additional notes provided."}
        </p>
      </section>

      <hr className="border-stone-100" />

      <section>
        <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-4">Service Information</h3>
        <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100">
          <p className="text-xs text-stone-400 uppercase font-bold mb-2 tracking-wider">Service Name</p>
          <p className="text-stone-900 font-semibold">{booking.service_name}</p>
          <p className="text-xs text-stone-500 mt-2">Booking ID: {booking.id}</p>
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

export default ShopBookingDetail;
