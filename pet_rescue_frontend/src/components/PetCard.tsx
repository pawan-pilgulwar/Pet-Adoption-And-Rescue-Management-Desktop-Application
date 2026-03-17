import React from 'react';
import { BASE_URL } from '../services/api';

interface PetCardProps {
    pet: {
        id: number;
        name: string;
        pet_type: string;
        breed: string;
        location: string;
        image: string | null;
        status: string;
    };
}

const PetCard: React.FC<PetCardProps> = ({ pet }) => {
    return (
        <div className="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-blue-100 transition-all duration-500 hover:-translate-y-2">
            <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden">
                {pet.image ? (
                    <img
                        src={pet.image.startsWith('http') ? pet.image : `${BASE_URL}${pet.image}`}
                        alt={pet.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                )}
                <div className="absolute top-4 right-4">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-black shadow-lg backdrop-blur-md ${
                        pet.status === 'Lost' ? 'bg-red-500/90 text-white' : 
                        pet.status === 'Available' ? 'bg-green-500/90 text-white' :
                        'bg-blue-600/90 text-white'
                    }`}>
                        {pet.status}
                    </span>
                </div>
            </div>
            <div className="p-8">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{pet.name}</h3>
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg uppercase tracking-wider">{pet.pet_type}</span>
                </div>
                <p className="text-sm text-gray-500 mb-6 font-medium tracking-wide italic">{pet.breed}</p>
                
                <div className="flex items-center text-gray-500 text-sm mb-6 bg-gray-50 p-3 rounded-2xl">
                    <div className="p-2 bg-white rounded-xl shadow-sm mr-3">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <span className="font-semibold">{pet.location}</span>
                </div>
                
                <button className="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-blue-600 transition-all shadow-lg active:scale-95">
                    View Full Profile
                </button>
            </div>
        </div>
    );
};

export default PetCard;
