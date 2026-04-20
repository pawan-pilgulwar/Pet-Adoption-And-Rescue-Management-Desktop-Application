import React from 'react';
import { Link } from 'react-router-dom';
import { Pet } from '../../../types';
import { imgUrl } from '../../../api/api';

interface Props {
  pet: Pet;
  listingId?: number;
  price?: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}

const PetCard: React.FC<Props> = ({ pet, listingId, price, actions, children }) => (
  <div className="bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex flex-col">
    <div className="relative h-48 bg-stone-100 overflow-hidden">
      <img src={imgUrl(pet.image_url)} alt={pet.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
      <div className="absolute top-2 left-2 flex gap-1.5">
        <span className="text-[10px] font-bold bg-brand-500 text-white px-2 py-0.5 rounded-full">{pet.species}</span>
        {price && <span className="text-[10px] font-bold bg-emerald-500 text-white px-2 py-0.5 rounded-full">${price}</span>}
      </div>
      {pet.vaccination_status && (
        <span className="absolute top-2 right-2 text-[10px] font-bold bg-white text-teal-600 px-2 py-0.5 rounded-full border border-teal-100">✓ Vaccinated</span>
      )}
    </div>
    <div className="p-4 flex flex-col flex-1">
      <h3 className="font-bold text-stone-900 mb-2">{pet.name}</h3>
      <div className="grid grid-cols-2 gap-1 mb-3">
        {[
          ['🧬', pet.breed || '—'],
          ['📅', pet.age ? `${pet.age} yrs` : '—'],
          ['🚻', pet.gender || '—'],
          ['📏', pet.size || '—'],
        ].map(([icon, val]) => (
          <div key={icon} className="flex items-center gap-1 text-xs text-stone-500">
            <span>{icon}</span><span>{val}</span>
          </div>
        ))}
      </div>
      {pet.description && <p className="text-xs text-stone-400 line-clamp-2 mb-3">{pet.description}</p>}
      <div className="mt-auto pt-3 border-t border-stone-50 space-y-2">
        {listingId && (
          <Link to={`/adoption/${listingId}`}
            className="block w-full text-center py-2 bg-brand-500 text-white text-sm font-semibold rounded-xl hover:bg-brand-600 transition-colors">
            Request Adoption
          </Link>
        )}
        {actions}
        {children}
      </div>
    </div>
  </div>
);

export default PetCard;
