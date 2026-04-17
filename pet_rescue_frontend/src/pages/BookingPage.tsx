import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';

const BookingPage: React.FC = () => {
  const { state } = useLocation();
  const service = state?.service;
  const navigate = useNavigate();

  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!service) {
    navigate('/services');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/bookings/', {
        service: service.id,
        booking_date: date,
        additional_notes: notes,
      });
      setIsSuccess(true);
    } catch (err) {
      console.error('Booking failed', err);
      alert('Failed to book appointment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="paw-bg min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center bg-white rounded-2xl p-10 border border-orange-100 shadow-sm">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-5">
            ✓
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Booking Confirmed!</h2>
          <p className="text-slate-500 text-sm mb-7">
            Your appointment for <strong>{service.name}</strong> has been successfully booked.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-7 py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-all shadow-md text-sm"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="paw-bg min-h-screen py-12 px-4">
      <div className="max-w-xl mx-auto">
        {/* Service summary */}
        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5 mb-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center text-xl shadow-md shadow-orange-500/20">
            🩺
          </div>
          <div>
            <p className="text-xs text-orange-500 font-semibold uppercase tracking-wider">Booking for</p>
            <p className="font-bold text-slate-900">{service.name}</p>
            <p className="text-sm text-slate-500">${service.price}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-7 border border-orange-100 shadow-sm">
          <h1 className="text-xl font-black text-slate-900 mb-6">Book Appointment</h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Select Date & Time
              </label>
              <input
                type="datetime-local"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 outline-none transition-all text-sm bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Additional Notes <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <textarea
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special instructions for your pet..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 outline-none transition-all text-sm resize-none bg-slate-50"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate('/services')}
                className="px-5 py-3 bg-slate-100 text-slate-600 font-semibold rounded-xl hover:bg-slate-200 transition-all text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-slate-300 text-white font-semibold rounded-xl transition-all text-sm active:scale-95"
              >
                {isSubmitting ? 'Processing...' : 'Confirm Booking'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
