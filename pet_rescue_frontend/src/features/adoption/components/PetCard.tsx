import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AdoptionListing } from '../../../types';

interface PetCardProps {
  listing: AdoptionListing;
}

// Card showing a pet available for adoption
function PetCard({ listing }: PetCardProps) {
  const pet = listing.pet;
  const navigate = useNavigate();

  const handleAdoptClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/adoption/${listing.id}`);
  };

  return (
    <div
      onClick={() => navigate(`/adoption/${listing.id}`)}
      className="card group hover:shadow-xl transition-all duration-300 flex flex-col fade-in cursor-pointer"
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
        <button 
          onClick={handleAdoptClick}
          className="btn-primary py-1.5 px-4 text-sm"
          disabled={!listing.is_available}
        >
          {listing.is_available ? 'Adopt' : 'Adopted'}
        </button>
      </div>
    </div>
  );
}

export default PetCard;
