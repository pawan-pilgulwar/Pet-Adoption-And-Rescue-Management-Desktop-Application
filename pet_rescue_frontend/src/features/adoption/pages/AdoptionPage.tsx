import React, { useState, useEffect } from 'react';
import { fetchListings } from '../api';
import { AdoptionListing } from '../../../types';
import PetCard from '../components/PetCard';
import Spinner from '../../../components/common/Spinner';
import Empty from '../../../components/common/Empty';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';

function AdoptionPage() {
  const [listings, setListings]   = useState<AdoptionListing[]>([]);
  const [loading, setLoading]     = useState(true);
  const [species, setSpecies]     = useState('');
  const [breed, setBreed]         = useState('');

  function loadListings(s = '', b = '') {
    setLoading(true);
    fetchListings({ species: s || undefined, breed: b || undefined })
      .then(data => setListings(data))
      .catch(() => setListings([]))
      .finally(() => setLoading(false));
  }

  // Initial load
  useEffect(() => { loadListings(); }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    loadListings(species, breed);
  }

  function handleClear() {
    setSpecies('');
    setBreed('');
    loadListings();
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-900">🐾 Pet Adoption</h1>
        <p className="text-stone-500 mt-1">Find your perfect companion from our available pets</p>
      </div>

      {/* Filters */}
      <form onSubmit={handleSearch} className="card mb-8 flex flex-col sm:flex-row gap-4 items-end">
        <Input
          id="adopt-species"
          label="Species"
          placeholder="Dog, Cat, Bird..."
          value={species}
          onChange={e => setSpecies(e.target.value)}
          className="flex-1"
        />
        <Input
          id="adopt-breed"
          label="Breed"
          placeholder="Labrador, Persian..."
          value={breed}
          onChange={e => setBreed(e.target.value)}
          className="flex-1"
        />
        <div className="flex gap-2">
          <Button type="submit">🔍 Search</Button>
          <Button type="button" variant="ghost" onClick={handleClear}>Clear</Button>
        </div>
      </form>

      {/* Results */}
      {loading ? (
        <Spinner message="Loading pets..." />
      ) : listings.length === 0 ? (
        <Empty message="No pets found. Try different filters." />
      ) : (
        <>
          <p className="text-stone-500 text-sm mb-4">{listings.length} pet(s) found</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map(listing => (
              <PetCard key={listing.id} listing={listing} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default AdoptionPage;
