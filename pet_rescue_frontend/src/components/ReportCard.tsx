import React from 'react';
import { Report } from '../types';
import { formatImageUrl } from '../services/api';

interface ReportCardProps {
  report: Report;
  children?: React.ReactNode;
}

const statusColors: Record<string, string> = {
  Accepted: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  Rejected: 'bg-red-50 text-red-500 border-red-100',
  Pending: 'bg-amber-50 text-amber-600 border-amber-100',
};

const typeColors: Record<string, string> = {
  Found: 'bg-teal-500',
  Lost: 'bg-orange-500',
};

const ReportCard: React.FC<ReportCardProps> = ({ report, children }) => {
  const petName = report.pet_detail?.name || 'Unknown';
  const petSpecies = report.pet_detail?.species || 'Unknown';
  const petImage = report.image_url || report.pet_detail?.image_url;
  const imageUrl = formatImageUrl(petImage, 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=800&q=70');

  return (
    <article className="bg-white rounded-2xl overflow-hidden border border-orange-100 card-hover shadow-sm">
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-orange-50">
        <img
          src={imageUrl}
          alt={petName}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <span className={`absolute top-3 left-3 text-[10px] font-bold text-white px-2.5 py-1 rounded-full ${typeColors[report.report_type] || 'bg-slate-500'}`}>
          {report.report_type}
        </span>
        <span className={`absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full border ${statusColors[report.status] || 'bg-slate-50 text-slate-500 border-slate-100'}`}>
          {report.status}
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-base font-bold text-slate-800">{petName}</h3>
          <span className="text-[10px] text-slate-400 font-medium">{report.rescue_id}</span>
        </div>

        <p className="text-xs font-semibold text-orange-500 mb-3">{petSpecies} · {report.report_type} Pet</p>

        <div className="space-y-1.5 text-xs text-slate-500 mb-3">
          <p className="flex items-center gap-1.5">
            <span className="text-orange-400">📍</span> {report.location}
          </p>
          <p className="flex items-center gap-1.5">
            <span className="text-orange-400">🐾</span>
            {[report.pet_detail?.age ? `${report.pet_detail.age} yrs` : null, report.pet_detail?.gender, report.pet_detail?.size].filter(Boolean).join(' · ') || '—'}
          </p>
          {report.user_contact && (
            <p className="flex items-center gap-1.5">
              <span className="text-orange-400">📞</span> {report.user_contact.phone || report.user_contact.email}
            </p>
          )}
        </div>

        {report.description && (
          <p className="text-xs text-slate-400 line-clamp-2 mb-3">{report.description}</p>
        )}

        {children && <div className="mt-3 flex gap-2 pt-3 border-t border-orange-50">{children}</div>}
      </div>
    </article>
  );
};

export default ReportCard;
