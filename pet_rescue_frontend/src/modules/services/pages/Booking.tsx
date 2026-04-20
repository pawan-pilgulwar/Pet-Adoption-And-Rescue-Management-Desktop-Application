import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api, { imgUrl } from '../../../api/api';
import { Service } from '../../../types';

const Booking: React.FC = () => {
  const { state } = useLocation();
  const service: Service = state?.service;
  const navigate = useNavigate();
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState<'form' | 'payment' | 'success'>('form');

  if (!service) { navigate('/services'); return null; }

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePayment = async () => {
    setSubmitting(true);
    try {
      await api.post('/bookings/', { service: service.id, booking_date: date, additional_notes: notes });
      setStep('success');
    } catch {
      alert('Booking failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (step === 'success') return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 bg-stone-50">
      <div className="bg-white rounded-2xl p-10 border border-stone-100 shadow-sm text-center max-w-md w-full">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-5">✓</div>
        <h2 className="text-xl font-black text-stone-900 mb-2">Booking Confirmed!</h2>
        <p className="text-stone-500 text-sm mb-2">Your appointment for <strong>{service.name}</strong> has been booked.</p>
        <p className="text-stone-400 text-xs mb-6">Date: {new Date(date).toLocaleString()}</p>
        <div className="bg-stone-50 rounded-xl p-4 mb-6 text-left">
          <p className="text-xs text-stone-500">Service: <span className="font-semibold text-stone-800">{service.name}</span></p>
          <p className="text-xs text-stone-500 mt-1">Amount Paid: <span className="font-semibold text-emerald-600">${service.price}</span></p>
          <p className="text-xs text-stone-500 mt-1">Status: <span className="font-semibold text-amber-600">Pending Confirmation</span></p>
        </div>
        <button onClick={() => navigate('/dashboard')} className="px-6 py-2.5 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-600 transition-colors text-sm">Go to Dashboard</button>
      </div>
    </div>
  );

  if (step === 'payment') return (
    <div className="min-h-screen bg-stone-50 py-12 px-6">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm mb-5">
          <h2 className="text-lg font-black text-stone-900 mb-4">Payment Summary</h2>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm"><span className="text-stone-500">Service</span><span className="font-medium">{service.name}</span></div>
            <div className="flex justify-between text-sm"><span className="text-stone-500">Date</span><span className="font-medium">{new Date(date).toLocaleString()}</span></div>
            <div className="border-t border-stone-100 pt-3 flex justify-between"><span className="font-bold text-stone-900">Total</span><span className="font-black text-brand-500 text-lg">${service.price}</span></div>
          </div>
          <div className="bg-stone-50 rounded-xl p-4 mb-5 border border-stone-100">
            <p className="text-xs font-semibold text-stone-600 mb-3">Payment Method</p>
            <div className="flex gap-3">
              {['💳 Credit Card', '🏦 Bank Transfer', '💵 Cash'].map(m => (
                <div key={m} className="flex-1 text-center py-2 bg-white rounded-lg border border-stone-200 text-xs font-medium text-stone-600 cursor-pointer hover:border-brand-300 transition-colors">{m}</div>
              ))}
            </div>
          </div>
          <button onClick={handlePayment} disabled={submitting}
            className="w-full py-3 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-600 transition-colors disabled:opacity-60 text-sm">
            {submitting ? 'Processing...' : `Pay $${service.price}`}
          </button>
          <button onClick={() => setStep('form')} className="w-full py-2.5 mt-2 text-stone-500 text-sm hover:text-stone-700 transition-colors">← Back</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-6">
      <div className="max-w-xl mx-auto">
        <div className="bg-brand-50 border border-brand-100 rounded-2xl p-5 mb-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-brand-500 rounded-xl flex items-center justify-center text-xl shadow-md shadow-brand-500/20">🩺</div>
          <div>
            <p className="text-xs text-brand-500 font-semibold uppercase tracking-wider">Booking for</p>
            <p className="font-bold text-stone-900">{service.name}</p>
            <p className="text-sm text-stone-500">${service.price}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-7 border border-stone-100 shadow-sm">
          <h1 className="text-xl font-black text-stone-900 mb-6">Book Appointment</h1>
          <form onSubmit={handleBook} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Select Date & Time</label>
              <input type="datetime-local" required value={date} onChange={e => setDate(e.target.value)}
                className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 bg-stone-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Additional Notes <span className="text-stone-400 font-normal">(optional)</span></label>
              <textarea rows={3} value={notes} onChange={e => setNotes(e.target.value)}
                placeholder="Any special instructions..."
                className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 bg-stone-50 resize-none" />
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => navigate('/services')} className="px-5 py-3 bg-stone-100 text-stone-600 font-semibold rounded-xl hover:bg-stone-200 transition-colors text-sm">Cancel</button>
              <button type="submit" className="flex-1 py-3 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-600 transition-colors text-sm">Continue to Payment</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Booking;
