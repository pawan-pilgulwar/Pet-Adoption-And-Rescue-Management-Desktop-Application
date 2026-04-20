import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api, { imgUrl } from '../../../api/api';
import { AdoptionListing } from '../../../types';
import Spinner from '../../../components/common/Spinner';
import { useAuth } from '../../../context/AuthContext';

const AdoptionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listing, setListing] = useState<AdoptionListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/adoption/listings/${id}/`).then(r => setListing(r.data)).catch(() => navigate('/adoption')).finally(() => setLoading(false));
  }, [id]);

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    setSubmitting(true); setError('');
    try {
      await api.post('/adoption/requests/', { pet: listing!.pet, listing: listing!.id, request_details: details });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner />;
  if (!listing) return null;

  const pet = listing.pet_detail;

  if (success) return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-10 border border-stone-100 shadow-sm text-center max-w-md w-full">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-5">✓</div>
        <h2 className="text-xl font-black text-stone-900 mb-2">Request Submitted!</h2>
        <p className="text-stone-500 text-sm mb-6">Your adoption request for <strong>{pet.name}</strong> has been submitted. The shop owner will review it shortly.</p>
        <button onClick={() => navigate('/dashboard/adoptions')} className="px-6 py-2.5 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-600 transition-colors text-sm">View My Adoptions</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50 py-10 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Pet info */}
          <div className="bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-sm">
            <div className="h-64 bg-stone-100 overflow-hidden">
              <img src={imgUrl(pet.image_url)} alt={pet.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h2 className="text-xl font-black text-stone-900">{pet.name}</h2>
                <span className="text-lg font-black text-brand-500">${listing.price}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {[['Species', pet.species], ['Breed', pet.breed || '—'], ['Age', pet.age ? `${pet.age} yrs` : '—'], ['Gender', pet.gender || '—'], ['Size', pet.size || '—'], ['Vaccination', pet.vaccination_status || '—']].map(([k, v]) => (
                  <div key={k} className="bg-stone-50 rounded-xl p-3">
                    <p className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider">{k}</p>
                    <p className="text-sm font-medium text-stone-800">{v}</p>
                  </div>
                ))}
              </div>
              {pet.description && <p className="text-sm text-stone-500 leading-relaxed">{pet.description}</p>}
              {listing.description && <p className="text-sm text-stone-500 mt-2 leading-relaxed">{listing.description}</p>}
            </div>
          </div>

          {/* Request form */}
          <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm">
            <h3 className="text-lg font-black text-stone-900 mb-1">Request Adoption</h3>
            <p className="text-sm text-stone-500 mb-6">Tell the shop owner why you'd be a great match for {pet.name}.</p>
            {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm border border-red-100">{error}</div>}
            {!user ? (
              <div className="text-center py-8">
                <p className="text-stone-500 text-sm mb-4">You need to be logged in to request adoption.</p>
                <button onClick={() => navigate('/login')} className="px-6 py-2.5 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-600 transition-colors text-sm">Login to Continue</button>
              </div>
            ) : (
              <form onSubmit={handleRequest} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">Why do you want to adopt {pet.name}?</label>
                  <textarea rows={5} required value={details} onChange={e => setDetails(e.target.value)}
                    placeholder="Tell us about your home, experience with pets, and why you'd be a great owner..."
                    className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 bg-stone-50 resize-none" />
                </div>
                <div className="bg-brand-50 rounded-xl p-4 border border-brand-100">
                  <p className="text-xs text-stone-600 font-medium">Shop: <span className="font-bold">{(listing.shop_detail as any)?.profile?.shop_name || 'Pet Shop'}</span></p>
                  <p className="text-xs text-stone-600 mt-1">Adoption Fee: <span className="font-bold text-brand-600">${listing.price}</span></p>
                </div>
                <button type="submit" disabled={submitting}
                  className="w-full py-3 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-600 transition-colors disabled:opacity-60 text-sm">
                  {submitting ? 'Submitting...' : 'Submit Adoption Request'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdoptionDetail;
