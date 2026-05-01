import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchAdoptionDetail } from '../../adoption/api';
import { Adoption, UserProfile, ShopOwnerProfile } from '../../../types';

import Spinner from '../../../components/common/Spinner';
import DetailLayout from '../../../components/common/DetailLayout';

function AdminAdoptionDetail() {
  const { id } = useParams<{ id: string }>();
  const [adoption, setAdoption] = useState<Adoption | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchAdoptionDetail(Number(id))
        .then(data => setAdoption(data))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <Spinner message="Loading adoption details..." />;
  if (!adoption) return <div className="p-8 text-center text-red-500">Adoption record not found</div>;

  const { pet, user, shop_owner } = adoption;

  return (
    <DetailLayout
      title={`Adoption of ${pet?.name}`}
      subtitle={`Adoption ID: #${adoption.id}`}
      backLink="/admin/adoptions"
      backText="Back to Adoptions"
      image={pet?.image_url || undefined}
      stats={[
        { label: 'Price', value: `₹${adoption.price}` },
        { label: 'Date', value: new Date(adoption.adopted_at || '').toLocaleDateString() },
        { label: 'Pet Species', value: pet?.species || '—' },
        { label: 'Pet Breed', value: pet?.breed || '—' }
      ]}
    >
      <div className="space-y-12">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Adopter Info */}
          <section className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm">
            <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              👤 Adopter Details
            </h3>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-stone-100 overflow-hidden border border-stone-200">
                {user.profile?.profile_picture_url ? (
                  <img src={user.profile.profile_picture_url} alt={user.username} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-400 font-bold text-xl uppercase">
                    {user.username.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <p className="font-bold text-stone-900 text-lg">{user.first_name} {user.last_name}</p>
                <p className="text-stone-500 text-sm">@{user.username}</p>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-stone-50 pb-2">
                <span className="text-stone-500">Email</span>
                <span className="font-medium text-stone-900">{user.email}</span>
              </div>
              <div className="flex justify-between border-b border-stone-50 pb-2">
                <span className="text-stone-500">Phone</span>
                <span className="font-medium text-stone-900">{(user.profile as UserProfile)?.phone_number || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Address</span>
                <span className="font-medium text-stone-900 text-right max-w-[200px]">{(user.profile as UserProfile)?.address || '—'}</span>
              </div>
            </div>
          </section>

          {/* Shop/Owner Info */}
          <section className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm">
            <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              🏠 Shop / Source Details
            </h3>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-stone-100 overflow-hidden border border-stone-200">
                {shop_owner.profile?.profile_picture_url ? (
                  <img src={shop_owner.profile.profile_picture_url} alt={shop_owner.username} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-400 font-bold text-xl uppercase">
                    {shop_owner.username.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <p className="font-bold text-stone-900 text-lg">{(shop_owner.profile as ShopOwnerProfile)?.shop_name || `${shop_owner.first_name} ${shop_owner.last_name}`}</p>
                <p className="text-stone-500 text-sm">@{shop_owner.username}</p>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-stone-50 pb-2">
                <span className="text-stone-500">Contact Person</span>
                <span className="font-medium text-stone-900">{shop_owner.first_name} {shop_owner.last_name}</span>
              </div>
              <div className="flex justify-between border-b border-stone-50 pb-2">
                <span className="text-stone-500">Phone</span>
                <span className="font-medium text-stone-900">{(shop_owner.profile as ShopOwnerProfile)?.phone_number || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Shop Address</span>
                <span className="font-medium text-stone-900 text-right max-w-[200px]">{(shop_owner.profile as ShopOwnerProfile)?.shop_address || '—'}</span>
              </div>
            </div>
          </section>
        </div>

        <hr className="border-stone-100" />

        {/* Pet Detail Section */}
        <section>
          <div className="flex justify-between items-end mb-4">
            <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest">🐾 Pet Information</h3>
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
              <p className="font-semibold text-stone-900">{pet.age ? `${pet.age} years` : '—'}</p>
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
          <div className="mt-6 bg-stone-50 p-6 rounded-3xl border border-stone-100">
            <p className="text-xs text-stone-400 uppercase font-bold mb-2 tracking-wider">Description</p>
            <p className="text-stone-700 leading-relaxed italic">
              "{pet.description || "No description provided."}"
            </p>
          </div>
        </section>

        {adoption.notes && (
          <>
            <hr className="border-stone-100" />
            <section>
              <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-4">Adoption Notes</h3>
              <p className="text-stone-700 bg-stone-50 p-6 rounded-3xl italic border border-stone-100">
                "{adoption.notes}"
              </p>
            </section>
          </>
        )}
      </div>

    </DetailLayout>
  );
}

export default AdminAdoptionDetail;
