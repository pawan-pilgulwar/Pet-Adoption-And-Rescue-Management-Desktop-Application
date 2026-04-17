import React from 'react';
import { formatImageUrl } from '../services/api';

interface Service {
  id: number;
  name: string;
  description: string;
  price: string;
  image_url: string;
}

interface ServiceCardProps {
  service: Service;
  onBook: (service: Service) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onBook }) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-orange-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 shadow-sm group">
      <div className="h-44 overflow-hidden relative bg-orange-50">
        <img
          src={formatImageUrl(service.image_url)}
          alt={service.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full shadow-sm border border-orange-100">
          <span className="text-orange-600 font-bold text-sm">${service.price}</span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-base font-bold text-slate-900 mb-1.5">{service.name}</h3>
        <p className="text-slate-500 text-sm mb-4 leading-relaxed line-clamp-2">{service.description}</p>
        <button
          onClick={() => onBook(service)}
          className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all text-sm active:scale-95"
        >
          Book Appointment
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;
