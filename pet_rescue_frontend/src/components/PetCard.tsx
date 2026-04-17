import React from 'react';
import { Pet } from '../types';
import { formatImageUrl } from '../services/api';
import { Link } from 'react-router-dom';

interface PetCardProps {
  pet: Pet;
  listingId?: number;
  price?: string;
  children?: React.ReactNode;
}

const PetCard: React.FC<PetCardProps> = ({ pet, listingId, price, children }) => {
  const imageUrl = formatImageUrl(pet.image_url);
  const breed = pet.breed || 'Unknown';

  return (
    <article className="bg-white rounded-2xl overflow-hidden border border-orange-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl shadow-sm flex flex-col h-full">
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-orange-50">
        <img
          src={imageUrl}
          alt={pet.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className="text-[10px] font-bold uppercase text-white bg-orange-500 px-2.5 py-1 rounded-full shadow-sm">
            {pet.species}
          </span>
          {price && (
            <span className="text-[10px] font-bold uppercase text-white bg-emerald-500 px-2.5 py-1 rounded-full shadow-sm">
              ${price}
            </span>
          )}
        </div>
        {pet.vaccination_status && (
          <div className="absolute top-3 right-3">
            <span className="text-[10px] font-bold bg-white text-teal-600 px-2 py-1 rounded-full shadow-sm border border-teal-100">
              ✓ Vaccinated
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-bold text-slate-900">{pet.name}</h3>
          {listingId && (
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
              Available
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-y-1.5 gap-x-3 mb-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="text-orange-400">🧬</span> {breed}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="text-orange-400">📅</span> {pet.age ?? '—'} yrs
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="text-orange-400">🚻</span> {pet.gender || '—'}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="text-orange-400">📏</span> {pet.size || '—'}
          </div>
        </div>

        {pet.description && (
          <p className="text-xs text-slate-400 mb-4 line-clamp-2 leading-relaxed">{pet.description}</p>
        )}

        <div className="mt-auto pt-3 border-t border-orange-50 flex flex-col gap-2">
          {listingId && (
            <Link
              to={`/adoption/request/${listingId}`}
              className="w-full py-2.5 bg-orange-500 text-white text-center font-semibold rounded-xl hover:bg-orange-600 transition-colors text-sm"
            >
              Request Adoption
            </Link>
          )}
          {children}
        </div>
      </div>
    </article>
  );
};

export default PetCard;
