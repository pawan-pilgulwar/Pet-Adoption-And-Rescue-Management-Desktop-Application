import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Pet } from '../types';
import PetCard from '../components/PetCard';

const AdoptionPage: React.FC = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchSpecies, setSearchSpecies] = useState('');
  const [searchBreed, setSearchBreed] = useState('');
  const [searchColor, setSearchColor] = useState('');

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    setLoading(true);
    try {
      const res = await api.get('/pets/all-pets/');
      setPets(res.data.data.Pets || []);
    } catch (error) {
      console.error('Failed to fetch pets', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchSpecies) params.append('species', searchSpecies);
      if (searchBreed) params.append('breed', searchBreed);
      if (searchColor) params.append('color', searchColor);

      const res = await api.get(`/pets/search/?${params.toString()}`);
      setPets(res.data.data.Pets || []);
    } catch (error) {
      console.error('Failed to search pets', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSearchSpecies('');
    setSearchBreed('');
    setSearchColor('');
    fetchPets();
  };

  return (
    <div>
      {/* Page Header */}
      <section className="bg-gradient-to-r from-orange-500 to-amber-500 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
            🏠 Find Your New Best Friend
          </h1>
          <p className="text-white/80 max-w-lg mx-auto">
            Browse pets that are looking for a loving home. Every pet deserves a family.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Filters */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-orange-50 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Species (Dog, Cat...)"
              value={searchSpecies}
              onChange={(e) => setSearchSpecies(e.target.value)}
              className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <input
              type="text"
              placeholder="Breed"
              value={searchBreed}
              onChange={(e) => setSearchBreed(e.target.value)}
              className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <input
              type="text"
              placeholder="Color"
              value={searchColor}
              onChange={(e) => setSearchColor(e.target.value)}
              className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSearch}
                className="flex-1 px-4 py-2.5 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors text-sm"
              >
                Search
              </button>
              <button
                onClick={handleClear}
                className="px-4 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors text-sm"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Pet Grid */}
        {loading ? (
          <div className="text-center py-16">
            <span className="text-4xl animate-float inline-block">🐾</span>
            <p className="mt-4 text-slate-500 font-bold">Loading pets...</p>
          </div>
        ) : pets.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-orange-50">
            <span className="text-4xl">🐕</span>
            <p className="mt-4 text-slate-500 font-bold">No pets found. Try adjusting your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdoptionPage;
