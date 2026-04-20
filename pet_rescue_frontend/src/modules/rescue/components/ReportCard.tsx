import React from 'react';
import { Report } from '../../../types';
import { imgUrl } from '../../../api/api';

interface Props { report: Report; actions?: React.ReactNode; children?: React.ReactNode; }

const statusCls: Record<string, string> = {
  Pending: 'bg-amber-50 text-amber-600 border-amber-100',
  Accepted: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  Rejected: 'bg-red-50 text-red-500 border-red-100',
  Closed: 'bg-stone-100 text-stone-500 border-stone-200',
};

const ReportCard: React.FC<Props> = ({ report, actions, children }) => {
  const pet = report.pet_detail;
  const image = report.image_url || pet?.image_url;

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-300">
      <div className="relative h-44 bg-stone-100 overflow-hidden">
        <img src={imgUrl(image, 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=600&q=80')}
          alt={pet?.name || 'Pet'} className="w-full h-full object-cover" />
        <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${report.report_type === 'Lost' ? 'bg-orange-500 text-white' : 'bg-teal-500 text-white'}`}>
          {report.report_type}
        </span>
        <span className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusCls[report.status] || statusCls.Pending}`}>
          {report.status}
        </span>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-bold text-stone-900">{pet?.name || 'Unknown Pet'}</h3>
          <span className="text-[10px] text-stone-400 font-mono">{report.rescue_id}</span>
        </div>
        <p className="text-xs font-medium text-brand-500 mb-2">{pet?.species} · {report.report_type}</p>
        <div className="space-y-1 text-xs text-stone-500 mb-3">
          <p>📍 {report.location}</p>
          {pet && <p>🐾 {[pet.age ? `${pet.age}y` : null, pet.gender, pet.size].filter(Boolean).join(' · ') || '—'}</p>}
          {report.user_contact && <p>📞 {report.user_contact.phone || report.user_contact.email}</p>}
        </div>
        {report.description && <p className="text-xs text-stone-400 line-clamp-2">{report.description}</p>}
        {actions && <div className="mt-3 pt-3 border-t border-stone-50 flex gap-2">{actions}</div>}
        {children && <div className="mt-3 pt-3 border-t border-stone-50 flex gap-2">{children}</div>}
      </div>
    </div>
  );
};

export default ReportCard;
