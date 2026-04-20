import React, { useEffect, useState } from 'react';
import api from '../../../api/api';
import { AdoptionListing } from '../../../types';
import PetCard from '../components/PetCard';
import Spinner from '../../../components/common/Spinner';
import Empty from '../../../components/common/Empty';

const Adoption: React.FC = () => {
  const [listings, setListings] = useState<AdoptionListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [species, setSpecies] = useState('');
  const [breed, setBreed] = useState('');

  const fetch = async (params?: any) => {
    setLoading(true);
    try {
      const r = await api.get('/adoption/listings/', { params });
      setListings(r.data.data || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const search = () => {
    const p: any = {};
    if (species) p.species = species;
    if (breed) p.breed = breed;
    fetch(p);
  };

  const clear = () => { setSpecies(''); setBreed(''); fetch(); };

  const inputCls = "px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 bg-stone-50";

  return (
    <div className="min-h-screen bg-stone-50">
      <section className="bg-gradient-to-br from-brand-500 to-amber-500 py-14 px-6">
        <div className="max-w-7xl mx-auto">
          <span className="text-brand-100 text-xs font-semibold uppercase tracking-wider">Find Your Match</span>
          <h1 className="text-3xl md:text-4xl font-black text-white mt-1 mb-2">Pets Available for Adoption</h1>
          <p className="text-brand-100 text-sm max-w-md">Browse pets looking for a loving home. Every adoption changes a life.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input className={inputCls} placeholder="Species (Dog, Cat...)" value={species} onChange={e => setSpecies(e.target.value)} />
            <input className={inputCls} placeholder="Breed" value={breed} onChange={e => setBreed(e.target.value)} />
            <div className="flex gap-2">
              <button onClick={search} className="flex-1 py-2.5 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-600 transition-colors text-sm">Search</button>
              <button onClick={clear} className="px-4 py-2.5 bg-stone-100 text-stone-600 font-semibold rounded-xl hover:bg-stone-200 transition-colors text-sm">Clear</button>
            </div>
          </div>
        </div>

        {!loading && listings.length > 0 && (
          <p className="text-sm text-stone-500 mb-5"><span className="text-brand-500 font-bold">{listings.length}</span> pets available</p>
        )}

        {loading ? <Spinner /> : listings.length === 0 ? (
          <Empty icon="🐕" text="No pets available for adoption right now." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {listings.map(l => <PetCard key={l.id} pet={l.pet_detail} listingId={l.id} price={l.price} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Adoption;
