import React from 'react';

interface Props { label: string; value: number | string; icon: string; color?: string; }

const StatCard: React.FC<Props> = ({ label, value, icon, color = 'bg-brand-50 text-brand-500' }) => (
  <div className="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${color}`}>{icon}</div>
    <div>
      <p className="text-xs text-stone-500 font-medium">{label}</p>
      <p className="text-2xl font-black text-stone-900">{value}</p>
    </div>
  </div>
);

export default StatCard;
