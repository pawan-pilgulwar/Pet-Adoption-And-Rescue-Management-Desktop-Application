import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchAdoptionDetail } from '../../adoption/api';
import { Adoption } from '../../../types';
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

  return (
    <DetailLayout
      title={`Adoption of ${adoption.pet_detail?.name}`}
      subtitle={`Adoption ID: #${adoption.id}`}
      backLink="/admin/adoptions"
      backText="Back to Adoptions"
      image={adoption.pet_detail?.image_url || undefined}
      stats={[
        { label: 'Price', value: `₹${adoption.price}` },
        { label: 'Date', value: new Date(adoption.adopted_at || '').toLocaleDateString() },
        { label: 'Pet Species', value: adoption.pet_detail?.species || '—' },
        { label: 'Pet Breed', value: adoption.pet_detail?.breed || '—' }
      ]}
    >
      <div className="grid md:grid-cols-2 gap-8">
        {/* Adopter Info */}
        <section className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm">
          <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            👤 Adopter Details
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-stone-400 mb-0.5">Name</p>
              <p className="font-semibold text-stone-900">{adoption.user_detail}</p>
            </div>
            {/* Additional user info if available in Adoption type */}
          </div>
        </section>

        {/* Shop/Owner Info */}
        <section className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm">
          <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            🏠 Shop / Source Details
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-stone-400 mb-0.5">Shop Name</p>
              <p className="font-semibold text-stone-900">{adoption.shop_name || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-stone-400 mb-0.5">Contact</p>
              <p className="font-medium text-stone-600">{adoption.shop_contact || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-stone-400 mb-0.5">Address</p>
              <p className="font-medium text-stone-600 text-sm">{adoption.shop_address || '—'}</p>
            </div>
          </div>
        </section>
      </div>

      <hr className="border-stone-100 my-4" />

      {/* Pet Detail Section */}
      <section>
        <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-4">
          🐾 Pet Information
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <p className="text-xs text-stone-400 mb-1">Gender</p>
            <p className="font-medium text-stone-900">{adoption.pet_detail?.gender || '—'}</p>
          </div>
          <div>
            <p className="text-xs text-stone-400 mb-1">Age</p>
            <p className="font-medium text-stone-900">{adoption.pet_detail?.age ? `${adoption.pet_detail.age} years` : '—'}</p>
          </div>
          <div>
            <p className="text-xs text-stone-400 mb-1">Size</p>
            <p className="font-medium text-stone-900">{adoption.pet_detail?.size || '—'}</p>
          </div>
        </div>
      </section>

      {adoption.notes && (
        <>
          <hr className="border-stone-100 my-4" />
          <section>
            <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-2">Notes</h3>
            <p className="text-stone-700 bg-stone-50 p-4 rounded-xl italic">
              "{adoption.notes}"
            </p>
          </section>
        </>
      )}
    </DetailLayout>
  );
}

export default AdminAdoptionDetail;
