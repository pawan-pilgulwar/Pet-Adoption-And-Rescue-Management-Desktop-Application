import React from 'react';
import { Link } from 'react-router-dom';
import { AdoptionListing } from '../../../types';

interface PetCardProps {
  listing: AdoptionListing;
}

// Card showing a pet available for adoption
function PetCard({ listing }: PetCardProps) {
  const pet = listing.pet_detail;

  return (
    <Link
      to={`/adoption/${listing.id}`}
      className="card group hover:shadow-xl transition-all duration-300 flex flex-col fade-in"
    >
      {/* Pet Image */}
      <div className="aspect-square rounded-xl overflow-hidden bg-orange-50 mb-4 relative">
        {pet?.image_url ? (
          <img
            src={pet.image_url}
            alt={pet.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">🐾</div>
        )}

        {/* Available badge */}
        <div className="absolute top-2 right-2">
          <span className={`badge ${listing.is_available ? 'badge-green' : 'badge-red'}`}>
            {listing.is_available ? 'Available' : 'Adopted'}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="flex-1">
        <h3 className="font-bold text-stone-900 text-lg">{pet?.name}</h3>
        <p className="text-stone-500 text-sm mt-0.5">
          {pet?.species}
          {pet?.breed ? ` · ${pet.breed}` : ''}
          {pet?.age ? ` · ${pet.age}yr` : ''}
        </p>
        {pet?.gender && (
          <p className="text-xs text-stone-400 mt-1">
            {pet.gender} {pet.size ? `· ${pet.size}` : ''}
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-stone-100">
        <span className="text-brand-500 font-bold text-lg">₹{listing.price}</span>
        <span className="text-xs text-stone-400">
          by {listing.shop_detail?.username || 'Shop'}
        </span>
      </div>
    </Link>
  );
}

export default PetCard;
