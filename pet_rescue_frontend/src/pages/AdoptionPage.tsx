import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { AdoptionListing } from '../types';
import PetCard from '../components/PetCard';

const AdoptionPage: React.FC = () => {
  const [listings, setListings] = useState<AdoptionListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchSpecies, setSearchSpecies] = useState('');
  const [searchBreed, setSearchBreed] = useState('');

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async (params = {}) => {
    setLoading(true);
    try {
      const res = await api.get('/adoption/listings/', { params });
      setListings(res.data.data || []);
    } catch (error) {
      console.error('Failed to fetch listings', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const params: any = {};
    if (searchSpecies) params.species = searchSpecies;
    if (searchBreed) params.breed = searchBreed;
    fetchListings(params);
  };

  const handleClear = () => {
    setSearchSpecies('');
    setSearchBreed('');
    fetchListings();
  };

  return (
    <div className="paw-bg min-h-screen">
      {/* Page Header */}
      <section className="bg-gradient-to-br from-orange-500 to-amber-500 py-14 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 text-9xl flex items-center justify-end pr-20 pointer-events-none">🐾</div>
        <div className="max-w-7xl mx-auto relative z-10">
          <span className="text-orange-100 text-xs font-semibold uppercase tracking-wider">Find Your Match</span>
          <h1 className="text-3xl md:text-4xl font-black text-white mt-1 mb-2">
            Pets Available for Adoption
          </h1>
          <p className="text-orange-100 text-sm max-w-md">
            Browse pets looking for a loving home. Every adoption changes a life.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Filters */}
        <div className="bg-white p-4 rounded-2xl border border-orange-100 shadow-sm mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Species (Dog, Cat...)"
              value={searchSpecies}
              onChange={(e) => setSearchSpecies(e.target.value)}
              className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-slate-50"
            />
            <input
              type="text"
              placeholder="Breed"
              value={searchBreed}
              onChange={(e) => setSearchBreed(e.target.value)}
              className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-slate-50"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSearch}
                className="flex-1 px-4 py-2.5 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors text-sm"
              >
                Search
              </button>
              <button
                onClick={handleClear}
                className="px-4 py-2.5 bg-slate-100 text-slate-600 font-semibold rounded-xl hover:bg-slate-200 transition-colors text-sm"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Results count */}
        {!loading && listings.length > 0 && (
          <p className="text-sm text-slate-500 mb-5 font-medium">
            Showing <span className="text-orange-500 font-bold">{listings.length}</span> pets available for adoption
          </p>
        )}

        {/* Listing Grid */}
        {loading ? (
          <div className="text-center py-20">
            <span className="text-4xl animate-float inline-block">🐾</span>
            <p className="mt-4 text-slate-500 font-medium">Loading listings...</p>
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-orange-100">
            <span className="text-5xl block mb-4">🐕</span>
            <p className="text-slate-500 font-medium">No pets available for adoption right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {listings.map((listing) => (
              <PetCard
                key={listing.id}
                pet={listing.pet_detail}
                listingId={listing.id}
                price={listing.price}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdoptionPage;
