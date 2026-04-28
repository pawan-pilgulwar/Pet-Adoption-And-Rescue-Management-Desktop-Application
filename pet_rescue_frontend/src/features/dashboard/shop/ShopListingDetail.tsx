import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import { AdoptionListing } from '../../../types';
import Spinner from '../../../components/common/Spinner';
import DetailLayout from '../../../components/common/DetailLayout';
import Button from '../../../components/common/Button';

function ShopListingDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [listing, setListing] = useState<AdoptionListing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      api.get(`/adoption/listings/${id}/`)
        .then(res => setListing(res.data))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [id]);

  async function handleDelete() {
    if (!window.confirm("Are you sure you want to remove this listing?")) return;
    try {
      await api.delete(`/adoption/listings/${id}/`);
      alert("Listing removed successfully");
      navigate('/dashboard/listings');
    } catch {
      alert("Failed to remove listing");
    }
  }

  if (loading) return <Spinner message="Loading listing..." />;
  if (!listing) return <div className="p-8 text-center text-red-500">Listing not found</div>;

  const pet = listing.pet_detail;

  return (
    <DetailLayout
      title={pet?.name || 'Pet Listing'}
      subtitle={`Adoption Fee: ₹${listing.price}`}
      backLink="/dashboard/listings"
      backText="Back to My Listings"
      image={pet?.image_url || undefined}
      stats={[
        { label: 'Status', value: listing.is_available ? 'Available' : 'Adopted' },
        { label: 'Species', value: pet?.species || '—' },
        { label: 'Breed', value: pet?.breed || '—' },
        { label: 'Listed On', value: new Date(listing.created_at).toLocaleDateString() }
      ]}
      actions={
        <Button variant="outline" className="text-red-500 hover:bg-red-50 border-red-200" onClick={handleDelete}>
          Remove Listing
        </Button>
      }
    >
      <section>
        <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-4">Listing Description</h3>
        <p className="text-stone-700 leading-relaxed">
          {listing.description || "No specific description provided for this listing."}
        </p>
      </section>

      <hr className="border-stone-100" />

      <section>
        <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-4">Pet Details</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
             <p className="text-xs text-stone-400 mb-1">Gender</p>
             <p className="font-medium text-stone-900">{pet?.gender || '—'}</p>
          </div>
          <div>
             <p className="text-xs text-stone-400 mb-1">Age</p>
             <p className="font-medium text-stone-900">{pet?.age ? `${pet.age} yrs` : '—'}</p>
          </div>
        </div>
      </section>
    </DetailLayout>
  );
}

export default ShopListingDetail;
