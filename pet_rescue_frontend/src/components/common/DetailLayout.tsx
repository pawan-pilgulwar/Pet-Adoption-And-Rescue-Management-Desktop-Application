import React from 'react';
import { Link } from 'react-router-dom';

interface DetailLayoutProps {
  title: string;
  subtitle?: string;
  backLink: string;
  backText: string;
  image?: string;
  imageFallback?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  stats?: { label: string; value: string | number }[];
}

const DetailLayout: React.FC<DetailLayoutProps> = ({
  title,
  subtitle,
  backLink,
  backText,
  image,
  imageFallback = "🐾",
  actions,
  children,
  stats,
}) => {
  return (
    <div className="max-w-6xl mx-auto py-6 px-4 fade-in">
      {/* Breadcrumb / Back Link */}
      <nav className="mb-6">
        <Link to={backLink} className="text-sm text-stone-500 hover:text-brand-500 transition-colors flex items-center gap-1">
          ← {backText}
        </Link>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: Image and Key Stats */}
        <div className="lg:w-1/3 space-y-6">
          <div className="aspect-square rounded-3xl overflow-hidden bg-stone-100 border border-stone-200 shadow-sm flex items-center justify-center">
            {image ? (
              <img src={image} alt={title} className="w-full h-full object-cover" />
            ) : (
              <div className="text-8xl">{imageFallback}</div>
            )}
          </div>

          {stats && stats.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm">
                  <p className="text-xs text-stone-400 uppercase tracking-wider mb-1">{stat.label}</p>
                  <p className="font-bold text-stone-900">{stat.value}</p>
                </div>
              ))}
            </div>
          )}

          {actions && (
            <div className="flex flex-col gap-3 pt-4">
              {actions}
            </div>
          )}
        </div>

        {/* Right Column: Details Content */}
        <div className="lg:w-2/3">
          <div className="mb-8">
            <h1 className="text-4xl font-extrabold text-stone-900 tracking-tight">{title}</h1>
            {subtitle && <p className="text-lg text-stone-500 mt-2">{subtitle}</p>}
          </div>

          <div className="bg-white rounded-3xl p-8 border border-stone-100 shadow-sm space-y-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailLayout;
