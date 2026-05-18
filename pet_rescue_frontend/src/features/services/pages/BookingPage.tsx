import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { fetchServices, createBooking } from '../api';
import { Service } from '../../../types';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import Spinner from '../../../components/common/Spinner';
import { bookingSchema } from '../../../utils/validation';
import { z } from 'zod';

function BookingPage() {
  const location = useLocation();

  // Service passed from ServicesPage via navigate state
  const preSelected = location.state?.service as Service | undefined;

  const [services, setServices] = useState<Service[]>([]);
  const [selectedId, setSelectedId] = useState<number | ''>(preSelected?.id || '');
  const [bookingDate, setBookingDate] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [servicesLoading, setServicesLoading] = useState(!preSelected);
  const [step, setStep] = useState<'details' | 'payment'>('details');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (preSelected) { setServices([preSelected]); return; }
    fetchServices()
      .then(data => setServices(Array.isArray(data) ? data : []))
      .catch(() => { })
      .finally(() => setServicesLoading(false));
  }, [preSelected]);

  const selectedService = services.find(s => s.id === selectedId) || preSelected;

  function handleProceed(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setError('');

    try {
      // Validate
      bookingSchema.parse({
        service: selectedId,
        booking_date: bookingDate,
        additional_notes: notes
      });

      setStep('payment');
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.issues.forEach(e => {
          if (e.path[0]) fieldErrors[e.path[0].toString()] = e.message;
        });
        setErrors(fieldErrors);
      }
    }
  }

  async function handleFinalConfirm() {
    setLoading(true);
    setError('');

    try {
      // POST /api/v1/bookings/
      await createBooking({
        service: Number(selectedId),
        booking_date: bookingDate,
        additional_notes: notes || undefined,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Booking failed. Please try again.');
      setStep('details');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="max-w-md mx-auto px-6 py-20 text-center fade-in">
        <span className="text-6xl">🎉</span>
        <h2 className="text-2xl font-bold text-stone-900 mt-4">Booking Confirmed!</h2>
        <p className="text-stone-500 mt-2">Your service booking has been placed successfully.</p>
        {selectedService && (
          <div className="card mt-6 text-left">
            <p className="text-sm text-stone-400">Service</p>
            <p className="font-bold text-stone-900">{selectedService.name}</p>
            <p className="text-sm text-stone-400 mt-2">Date</p>
            <p className="font-semibold text-stone-800">{new Date(bookingDate).toLocaleString()}</p>
            <p className="text-sm text-stone-400 mt-2">Price</p>
            <p className="text-brand-500 font-bold">₹{selectedService.price}</p>
          </div>
        )}
        <div className="flex gap-3 mt-6 justify-center">
          <Link to="/services" className="btn-outline">View More Services</Link>
          <Link to="/dashboard" className="btn-primary">My Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-900">📅 Book a Service</h1>
        <p className="text-stone-500 mt-1">Schedule a service for your pet</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Booking Form */}
        <div className="card">
          {step === 'payment' && selectedService ? (
            <div className="!bg-brand-50 border border-brand-100 p-6 rounded-2xl space-y-4 fade-in">
              <h3 className="font-bold text-brand-900">💳 Payment Confirmation</h3>
              <p className="text-sm text-brand-700">
                This is a secure checkout for your service booking. Please review the details before confirming.
              </p>

              <div className="space-y-2 border-t border-brand-100 pt-3">
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">Service</span>
                  <span className="font-semibold">{selectedService.name}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-brand-600">
                  <span>Total Amount</span>
                  <span>₹{selectedService.price}</span>
                </div>
              </div>

              <div className="bg-white p-3 rounded-lg border border-brand-200">
                <p className="text-xs text-stone-400 uppercase mb-2">Select Payment Method</p>
                <div className="flex gap-4">
                  <div className="flex-1 border-2 border-brand-500 bg-brand-50 rounded-lg p-2 text-center text-xs font-bold text-brand-700 cursor-pointer">UPI / Cards</div>
                  <div className="flex-1 border-2 border-transparent bg-stone-50 rounded-lg p-2 text-center text-xs text-stone-400 cursor-pointer hover:bg-stone-100">Net Banking</div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="ghost" onClick={() => setStep('details')} className="flex-1 text-brand-700 hover:bg-brand-100">Back</Button>
                <Button onClick={handleFinalConfirm} isLoading={loading} className="flex-[2] justify-center">Confirm & Pay</Button>
              </div>
            </div>
          ) : (
            <>
              <h2 className="font-bold text-stone-900 mb-4">Booking Details</h2>

              {servicesLoading ? <Spinner size="sm" /> : (
                <form onSubmit={handleProceed} className="space-y-4 fade-in">
              {/* Service selection */}
              {!preSelected && (
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-stone-700">Select Service *</label>
                  <select
                    id="booking-service"
                    className={`input-field ${errors.service ? 'border-red-500' : ''}`}
                    value={selectedId}
                    onChange={e => setSelectedId(Number(e.target.value))}
                  >
                    <option value="">Choose a service...</option>
                    {services.map(s => (
                      <option key={s.id} value={s.id}>{s.name} — ₹{s.price}</option>
                    ))}
                  </select>
                  {errors.service && <p className="text-xs text-red-500 mt-1">{errors.service}</p>}
                </div>
              )}

              <Input
                id="booking-date"
                label="Booking Date & Time *"
                type="datetime-local"
                value={bookingDate}
                onChange={e => setBookingDate(e.target.value)}
                error={errors.booking_date}
                min={new Date().toISOString().slice(0, 16)}
              />

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-stone-700">Additional Notes</label>
                <textarea
                  id="booking-notes"
                  className="input-field resize-none"
                  rows={3}
                  placeholder="Any special instructions..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full justify-center">
                Proceed to Payment
              </Button>
            </form>
          )}
          </>
        )}
        </div>

        {/* Selected Service Summary */}
        <div>
          {selectedService ? (
            <div className="card">
              <h2 className="font-bold text-stone-900 mb-4">Service Summary</h2>
              <div className="aspect-video rounded-xl overflow-hidden bg-orange-50 mb-4 flex items-center justify-center">
                {selectedService.image_url ? (
                  <img src={selectedService.image_url} alt={selectedService.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-5xl">🛠️</span>
                )}
              </div>
              <h3 className="text-xl font-bold text-stone-900">{selectedService.name}</h3>
              <p className="text-stone-500 text-sm mt-2">{selectedService.description}</p>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-stone-100">
                <span className="text-stone-500 text-sm">Price</span>
                <span className="text-brand-500 font-bold text-xl">₹{selectedService.price}</span>
              </div>
            </div>
          ) : (
            <div className="card flex items-center justify-center h-48 text-stone-300">
              <p>Select a service to see details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookingPage;
