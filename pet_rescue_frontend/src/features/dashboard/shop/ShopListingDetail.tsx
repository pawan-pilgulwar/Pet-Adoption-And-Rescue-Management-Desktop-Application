import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import { AdoptionListing, ShopOwnerProfile, Adoption } from '../../../types';

import Spinner from '../../../components/common/Spinner';
import DetailLayout from '../../../components/common/DetailLayout';
import Button from '../../../components/common/Button';
import ConfirmModal from '../../../components/ui/ConfirmModal';

function ShopListingDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [listing, setListing] = useState<AdoptionListing | null>(null);
  const [adoption, setAdoption] = useState<Adoption | null>(null);
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
      setLoading(true);
      api.get(`/adoption/listings/${id}/?my_listings=true`)
        .then(async res => {
          const lData = res.data;
          setListing(lData);
          if (!lData.is_available) {
            try {
              const adRes = await api.get('/adoption/adoptions/');
              const adoptions = adRes.data?.results || adRes.data || [];
              const matched = adoptions.find((a: Adoption) => a.pet.id === lData.pet.id);
              setAdoption(matched || null);
            } catch {}
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleDelete = () => {
    showConfirm(
      "Remove Listing",
      "Are you sure you want to delete this adoption listing? This action cannot be undone.",
      async () => {
        try {
          await api.delete(`/adoption/listings/${id}/`);
          navigate('/dashboard/listings');
        } catch {
          showAlert("Error", "Failed to remove listing", "danger");
        }
      },
      'danger'
    );
  };

  if (loading) return <Spinner message="Loading listing..." />;
  if (!listing) return <div className="p-8 text-center text-red-500">Listing not found</div>;

  const { pet, shop_owner } = listing;

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
      <div className="space-y-12">
        <section>
          <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-4">Listing Description</h3>
          <div className="bg-stone-50 p-6 rounded-3xl border border-stone-100 italic">
            <p className="text-stone-700 leading-relaxed">
              "{listing.description || "No specific description provided for this listing."}"
            </p>
          </div>
        </section>

        <hr className="border-stone-100" />

        <section>
          <div className="flex justify-between items-end mb-6">
            <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest">🐾 Pet Details</h3>
            <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-bold rounded-full border border-amber-100">
              {pet.pet_id}
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm">
              <p className="text-[10px] text-stone-400 uppercase font-bold mb-1">Gender</p>
              <p className="font-semibold text-stone-900">{pet.gender || '—'}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm">
              <p className="text-[10px] text-stone-400 uppercase font-bold mb-1">Age</p>
              <p className="font-semibold text-stone-900">{pet.age ? `${pet.age} yrs` : '—'}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm">
              <p className="text-[10px] text-stone-400 uppercase font-bold mb-1">Size</p>
              <p className="font-semibold text-stone-900">{pet.size || '—'}</p>
            </div>
             <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm">
              <p className="text-[10px] text-stone-400 uppercase font-bold mb-1">Color</p>
              <p className="font-semibold text-stone-900">{pet.color || '—'}</p>
            </div>
          </div>
          <div className="mt-6">
             <p className="text-xs text-stone-400 uppercase font-bold mb-2 tracking-wider px-1">Pet Description</p>
             <p className="text-stone-600 text-sm bg-white p-4 rounded-2xl border border-stone-50 leading-relaxed shadow-sm">
               {pet.description || "No description available for the pet instance."}
             </p>
          </div>
        </section>

        {adoption && (
          <>
            <hr className="border-stone-100" />
            <section>
              <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-6">🎉 Adoption Details</h3>
              <div className="bg-green-50 p-6 rounded-3xl border border-green-100 flex items-center gap-6">
                 <div className="w-16 h-16 rounded-2xl bg-white overflow-hidden border border-green-200">
                  {adoption.user.profile?.profile_picture_url ? (
                    <img src={adoption.user.profile.profile_picture_url} alt={adoption.user.username} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-green-400 font-bold text-xl uppercase">
                      {adoption.user.username.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-green-600 font-bold uppercase tracking-wider mb-1">Adopted By</p>
                      <p className="font-bold text-stone-900 text-lg">{adoption.user.first_name} {adoption.user.last_name}</p>
                      <p className="text-stone-500 text-sm">@{adoption.user.username}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-stone-400 uppercase font-bold mb-1">Adopted On</p>
                      <p className="text-stone-900 font-semibold">{adoption.adopted_at ? new Date(adoption.adopted_at).toLocaleDateString() : '—'}</p>
                    </div>
                  </div>
                  {adoption.notes && (
                    <div className="mt-4 pt-4 border-t border-green-100 text-sm text-green-800">
                      <span className="font-bold mr-2">Notes:</span>
                      {adoption.notes}
                    </div>
                  )}
                </div>
              </div>
            </section>
          </>
        )}

        <hr className="border-stone-100" />

        <section>
          <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-6">Shop / Provider Info</h3>
          <div className="bg-stone-50 p-6 rounded-3xl border border-stone-100 flex items-center gap-6">
             <div className="w-16 h-16 rounded-2xl bg-white overflow-hidden border border-stone-200">
              {shop_owner.profile?.profile_picture_url ? (
                <img src={shop_owner.profile.profile_picture_url} alt={shop_owner.username} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-400 font-bold text-xl uppercase">
                  {shop_owner.username.charAt(0)}
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-stone-900 text-lg">{(shop_owner.profile as ShopOwnerProfile)?.shop_name || `${shop_owner.first_name} ${shop_owner.last_name}`}</p>
                  <p className="text-stone-500 text-sm">@{shop_owner.username} • {shop_owner.role}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-stone-400 uppercase font-bold mb-1">Contact</p>
                  <p className="text-stone-900 font-semibold">{shop_owner.email}</p>
                  <p className="text-stone-600 text-sm font-medium">
                    {(shop_owner.profile as ShopOwnerProfile)?.phone_number || '—'}
                  </p>
                </div>
              </div>
            </div>
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

export default ShopListingDetail;
