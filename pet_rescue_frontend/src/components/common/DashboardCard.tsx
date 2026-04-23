import React from 'react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: string;       // emoji or icon character
  color: string;      // Tailwind bg color class e.g. 'bg-orange-100'
  textColor?: string; // Tailwind text color class e.g. 'text-orange-500'
}

// Stat card used in all dashboard overviews
function DashboardCard({ title, value, icon, color, textColor = 'text-brand-500' }: DashboardCardProps) {
  return (
    <div className="card flex items-center gap-4 fade-in">
      <div className={`${color} rounded-2xl p-4 flex items-center justify-center text-2xl`}>
        {icon}
      </div>
      <div>
        <p className="text-stone-500 text-xs font-medium uppercase tracking-wide">{title}</p>
        <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
      </div>
    </div>
  );
}

export default DashboardCard;
