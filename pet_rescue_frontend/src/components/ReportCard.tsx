import React from 'react';
import { PetReport } from '../types';
import { formatImageUrl } from '../services/api';

interface ReportCardProps {
  report: PetReport;
  children?: React.ReactNode;
}

const ReportCard: React.FC<ReportCardProps> = ({ report, children }) => {
  // Use data from the linked pet if available, otherwise fallback to report fields
  const petName = report.pet?.name || report.pet_name || 'Unknown';
  const petSpecies = report.pet?.species || report.species || 'Unknown';
  const petStatus = report.pet?.status || report.pet_status || 'Lost';
  const petImage = report.image_url || report.pet?.image_url;


  const imageUrl = formatImageUrl(petImage, 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=800&q=70');

  return (
    <article className="bg-white rounded-2xl overflow-hidden shadow-md border border-orange-50 card-hover">
      {/* Image */}
      <div className="relative h-64 overflow-hidden bg-slate-50 flex items-center justify-center p-2">
        <img
          src={imageUrl}
          alt={petName}
          className="max-h-full max-w-full object-contain transition-transform duration-500 hover:scale-105"
        />
        <span className={`absolute top-3 right-3 text-xs font-bold px-3 py-1 rounded-full shadow-sm ${petStatus === 'Found'
            ? 'bg-teal-500 text-white'
            : 'bg-orange-500 text-white'
          }`}>
          {petStatus}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-black text-slate-800">{petName}</h3>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${report.status === 'Accepted'
              ? 'bg-teal-50 text-teal-600'
              : report.status === 'Rejected'
                ? 'bg-red-50 text-red-600'
                : 'bg-amber-50 text-amber-600'
            }`}>
            {report.status}
          </span>
        </div>

        <p className="text-sm font-bold text-orange-600 mb-2">
          {report.report_type} • Type: {petSpecies}
        </p>


        <div className="space-y-1 text-sm text-slate-500 mb-3">
          <p className="flex items-center gap-1">
            <span className="text-orange-400">📍</span> {report.location}
          </p>
          <p className="flex items-center gap-1">
            <span className="text-orange-400">🐾</span> Age: {report.pet_age || '—'} • {report.pet_gender || '—'} Gender • {report.pet_size || '—'} Size
          </p>
          {report.user_contact && (
            <p className="flex items-center gap-1">
              <span className="text-orange-400">📞</span> {report.user_contact.phone || report.user_contact.email}
            </p>
          )}
        </div>

        <p className="text-sm text-slate-400 line-clamp-2">
          {report.description || 'No additional details provided.'}
        </p>

        {children && <div className="mt-4 flex gap-2">{children}</div>}
      </div>
    </article>
  );
};

export default ReportCard;
