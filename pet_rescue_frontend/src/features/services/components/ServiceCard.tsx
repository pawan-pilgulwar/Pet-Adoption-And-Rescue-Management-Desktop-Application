import React from 'react';
import { Service } from '../../../types';

interface ServiceCardProps {
  service: Service;
  onBook?: (service: Service) => void;
}

function ServiceCard({ service, onBook }: ServiceCardProps) {
  return (
    <div className="card flex flex-col gap-3 fade-in hover:shadow-xl transition-shadow">
      {/* Image placeholder */}
      <div className="aspect-video rounded-xl overflow-hidden bg-orange-50 flex items-center justify-center">
        {service.image_url ? (
          <img src={service.image_url} alt={service.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-5xl">🛠️</span>
        )}
      </div>

      <div className="flex-1">
        <h3 className="font-bold text-stone-900 text-lg">{service.name}</h3>
        <p className="text-stone-500 text-sm mt-1 line-clamp-2">{service.description}</p>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-stone-100">
        <span className="text-brand-500 font-bold text-lg">₹{service.price}</span>
        {onBook && (
          <button
            onClick={() => onBook(service)}
            className="btn-primary text-sm px-4 py-2"
          >
            Book Now
          </button>
        )}
      </div>
    </div>
  );
}

export default ServiceCard;
