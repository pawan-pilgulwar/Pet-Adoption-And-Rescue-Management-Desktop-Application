import React from 'react';
import { Pet } from '../types';
import { formatImageUrl } from '../services/api';

interface PetCardProps {
  pet: Pet;
  children?: React.ReactNode;
}

const PetCard: React.FC<PetCardProps> = ({ pet, children }) => {
  const imageUrl = formatImageUrl(pet.image_url);
  const breed = pet.breed ? pet.breed : 'Unknown';
  const color = pet.color ? pet.color : 'Unknown';

  return (
    <article className="bg-white rounded-2xl overflow-hidden shadow-md border border-orange-50 card-hover">
      {/* Image */}
      <div className="relative h-64 overflow-hidden bg-slate-50 flex items-center justify-center p-2">
        <img
          src={imageUrl}
          alt={pet.name}
          className="max-h-full max-w-full object-contain transition-transform duration-500 hover:scale-105"
        />
        <span className="absolute top-3 right-3 text-xs font-bold text-white bg-orange-500 px-3 py-1 rounded-full shadow-sm">
          {pet.species}
        </span>
      </div>


      {/* Content */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-black text-slate-800">{pet.name}</h3>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
            pet.status === 'Available'
              ? 'bg-teal-50 text-teal-600'
              : 'bg-slate-100 text-slate-500'
          }`}>
            {pet.status}
          </span>
        </div>
        <p className="text-sm text-slate-500 mb-2">
          Breed: {breed} • Color: {color} • Age: {pet.age ?? '—'}
        </p>
        <p className="text-sm text-slate-500 mb-2">
          Gender: {pet.gender || '—'} • Size: {pet.size || '—'}
        </p>
        {pet.vaccination_status && (
          <p className="text-sm text-emerald-600 mb-2">Vaccination: {pet.vaccination_status}</p>
        )}
        {pet.description && (
          <p className="text-sm text-slate-400 mb-3 line-clamp-2">{pet.description}</p>
        )}
        <div className="space-y-2">{children}</div>
      </div>
    </article>
  );
};

export default PetCard;
