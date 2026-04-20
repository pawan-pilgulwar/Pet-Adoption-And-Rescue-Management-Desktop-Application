import React, { useEffect, useState } from 'react';
import api, { imgUrl } from '../../../api/api';
import { AdoptionListing } from '../../../types';
import Spinner from '../../../components/common/Spinner';
import Empty from '../../../components/common/Empty';

const AdminListings: React.FC = () => {
  const [listings, setListings] = useState<AdoptionListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/adoption/listings/').then(r => setListings(r.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const del = async (id: number) => {
    if (!window.confirm('Delete this listing?')) return;
    await api.delete(`/adoption/listings/${id}/`).catch(() => {});
    setListings(prev => prev.filter(l => l.id !== id));
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-stone-900">Adoption Listings</h1>
        <p className="text-stone-500 text-sm mt-0.5">All active adoption listings across the platform</p>
      </div>
      {loading ? <Spinner /> : listings.length === 0 ? <Empty icon="🏷️" text="No listings found." /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {listings.map(l => (
            <div key={l.id} className="bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-sm">
              <div className="h-40 bg-stone-100 overflow-hidden">
                <img src={imgUrl(l.pet_detail?.image_url)} alt={l.pet_detail?.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-bold text-stone-900">{l.pet_detail?.name}</h3>
                  <span className="font-black text-brand-500">${l.price}</span>
                </div>
                <p className="text-xs text-stone-500 mb-1">{l.pet_detail?.species} · {l.pet_detail?.breed || '—'}</p>
                <p className="text-xs text-stone-400 mb-3">Shop: {(l.shop_detail as any)?.profile?.shop_name || (l.shop_detail as any)?.username || '—'}</p>
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${l.is_available ? 'bg-emerald-50 text-emerald-600' : 'bg-stone-100 text-stone-500'}`}>
                    {l.is_available ? 'Available' : 'Unavailable'}
                  </span>
                  <button onClick={() => del(l.id)} className="px-3 py-1 bg-red-50 text-red-500 text-xs font-semibold rounded-lg hover:bg-red-100 transition-colors">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminListings;
