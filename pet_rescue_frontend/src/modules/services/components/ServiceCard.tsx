import React from 'react';
import { Service } from '../../../types';
import { imgUrl } from '../../../api/api';

interface Props { service: Service; onBook?: () => void; actions?: React.ReactNode; children?: React.ReactNode; }

const ServiceCard: React.FC<Props> = ({ service, onBook, actions, children }) => (
  <div className="bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300">
    <div className="relative h-44 bg-stone-100 overflow-hidden">
      <img src={imgUrl(service.image_url, 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&q=80')}
        alt={service.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
      <div className="absolute top-2 right-2 bg-white px-2.5 py-1 rounded-full shadow-sm border border-stone-100">
        <span className="text-brand-600 font-bold text-sm">${service.price}</span>
      </div>
    </div>
    <div className="p-4">
      <h3 className="font-bold text-stone-900 mb-1">{service.name}</h3>
      <p className="text-xs text-stone-500 line-clamp-2 mb-4">{service.description}</p>
      {onBook && (
        <button onClick={onBook}
          className="w-full py-2.5 bg-brand-500 text-white text-sm font-semibold rounded-xl hover:bg-brand-600 transition-colors">
          Book Appointment
        </button>
      )}
      {actions}
      {children}
    </div>
  </div>
);

export default ServiceCard;
