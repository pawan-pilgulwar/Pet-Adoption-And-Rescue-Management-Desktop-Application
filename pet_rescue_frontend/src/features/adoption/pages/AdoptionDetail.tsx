import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchListingDetail, createAdoptionRequest } from '../api';
import { AdoptionListing } from '../../../types';
import { useAuth } from '../../../context/AuthContext';
import Spinner from '../../../components/common/Spinner';
import Button from '../../../components/common/Button';

function AdoptionDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [listing, setListing]       = useState<AdoptionListing | null>(null);
  const [loading, setLoading]       = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [details, setDetails]       = useState('');
  const [success, setSuccess]       = useState(false);
  const [error, setError]           = useState('');

  useEffect(() => {
    if (!id) return;
    fetchListingDetail(Number(id))
      .then(data => setListing(data))
      .catch(() => setListing(null))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleAdopt() {
    if (!listing || !user) return;
    setRequesting(true);
    setError('');

    try {
      // POST /api/v1/adoption/requests/
      await createAdoptionRequest({
        pet: listing.pet,
        listing: listing.id,
        request_details: details,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Request failed. Please try again.');
    } finally {
      setRequesting(false);
    }
  }

  if (loading) return <div className="py-20"><Spinner message="Loading pet details..." /></div>;
  if (!listing) return (
    <div className="max-w-3xl mx-auto px-6 py-20 text-center">
      <p className="text-stone-500">Pet not found. <Link to="/adoption" className="text-brand-500 hover:underline">Go back</Link></p>
    </div>
  );

  const pet = listing.pet_detail;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 fade-in">

      {/* Breadcrumb */}
      <p className="text-sm text-stone-500 mb-6">
        <Link to="/adoption" className="hover:text-brand-500">Adoption</Link> › {pet?.name}
      </p>

      <div className="grid md:grid-cols-2 gap-8">

        {/* Pet Image */}
        <div className="aspect-square rounded-2xl overflow-hidden bg-orange-50">
          {pet?.image_url ? (
            <img src={pet.image_url} alt={pet.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-8xl">🐾</div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-extrabold text-stone-900">{pet?.name}</h1>
              <span className={`badge ${listing.is_available ? 'badge-green' : 'badge-red'}`}>
                {listing.is_available ? 'Available' : 'Not Available'}
              </span>
            </div>
            <p className="text-stone-500">
              {pet?.species}{pet?.breed ? ` · ${pet.breed}` : ''}{pet?.age ? ` · ${pet.age} years old` : ''}
            </p>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Gender',         value: pet?.gender || '—' },
              { label: 'Size',           value: pet?.size || '—' },
              { label: 'Color',          value: pet?.color || '—' },
              { label: 'Vaccination',    value: pet?.vaccination_status || '—' },
            ].map(item => (
              <div key={item.label} className="bg-orange-50 rounded-xl px-4 py-3">
                <p className="text-xs text-stone-400 uppercase tracking-wide">{item.label}</p>
                <p className="font-semibold text-stone-800 mt-0.5">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          {pet?.description && (
            <div>
              <p className="text-sm font-semibold text-stone-700 mb-1">About {pet.name}</p>
              <p className="text-stone-500 text-sm leading-relaxed">{pet.description}</p>
            </div>
          )}

          {/* Price + Shop */}
          <div className="card !p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-stone-400">Adoption Fee</p>
                <p className="text-2xl font-bold text-brand-500">₹{listing.price}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-stone-400">Listed by</p>
                <p className="font-semibold text-stone-800">{listing.shop_detail?.username || 'Shop'}</p>
              </div>
            </div>
          </div>

          {/* Adoption Form */}
          {!user ? (
            <div className="bg-orange-50 rounded-xl p-4 text-center">
              <p className="text-stone-600 text-sm">
                <Link to="/login" className="text-brand-500 font-semibold hover:underline">Login</Link> to request adoption
              </p>
            </div>
          ) : success ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
              <p className="text-green-700 font-semibold">🎉 Adoption request sent!</p>
              <p className="text-green-600 text-sm mt-1">The shop owner will review your request shortly.</p>
              <Link to="/dashboard/adoptions" className="text-brand-500 text-sm hover:underline mt-2 block">
                View My Requests →
              </Link>
            </div>
          ) : listing.is_available ? (
            <div className="space-y-3">
              <textarea
                className="input-field resize-none"
                rows={3}
                placeholder="Tell us a bit about yourself and why you'd like to adopt..."
                value={details}
                onChange={e => setDetails(e.target.value)}
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button className="w-full justify-center" onClick={handleAdopt} isLoading={requesting}>
                ❤️ Request Adoption
              </Button>
            </div>
          ) : (
            <div className="bg-stone-100 rounded-xl p-4 text-center">
              <p className="text-stone-500 text-sm">This pet has already been adopted.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdoptionDetail;
