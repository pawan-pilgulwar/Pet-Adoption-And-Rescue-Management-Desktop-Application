import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchReportDetail } from '../api';
import { Report } from '../../../types';
import Spinner from '../../../components/common/Spinner';
import Button from '../../../components/common/Button';

function RescueDetail() {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchReportDetail(Number(id))
      .then(data => setReport(data))
      .catch(() => setReport(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="py-20"><Spinner message="Loading report details..." /></div>;
  if (!report) return (
    <div className="max-w-3xl mx-auto px-6 py-20 text-center">
      <p className="text-stone-500">Report not found. <Link to="/rescue" className="text-brand-500 hover:underline">Go back</Link></p>
    </div>
  );

  const pet = report.pet;
  const user = report.user;
  const profile = user.profile;

  // Type guards
  const isUserProfile = (p: any): p is { phone_number: string } => p && 'phone_number' in p;
  const isShopOwnerProfile = (p: any): p is { phone_number: string } => p && 'phone_number' in p;

  const phone = isUserProfile(profile) ? profile.phone_number : (isShopOwnerProfile(profile) ? profile.phone_number : null);

  const isLost = report.report_type === 'Lost';

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 fade-in">
      {/* Breadcrumb */}
      <p className="text-sm text-stone-500 mb-6">
        <Link to="/rescue" className="hover:text-brand-500">Rescue Center</Link> › {pet?.name || 'Report'}
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Pet Image */}
        <div className="aspect-square rounded-2xl overflow-hidden bg-orange-50 flex items-center justify-center">
          {pet?.image_url ? (
            <img src={pet.image_url} alt={pet.name} className="w-full h-full object-cover" />
          ) : (
            <div className="text-8xl">🐾</div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <span className={`badge ${isLost ? 'badge-red' : 'badge-green'} text-sm px-3 py-1`}>
              {isLost ? '🔴 Lost Pet' : '🟢 Found Pet'}
            </span>
            <span className="text-xs text-stone-400 font-mono">ID: {report.rescue_id}</span>
          </div>

          <div>
            <h1 className="text-3xl font-extrabold text-stone-900">{pet?.name || 'Unknown Pet'}</h1>
            <p className="text-stone-500 mt-1 flex items-center gap-1 text-lg">
              📍 {report.location}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Species', value: pet?.species || '—' },
              { label: 'Breed', value: pet?.breed || '—' },
              { label: 'Color', value: pet?.color || '—' },
              { label: 'Gender', value: pet?.gender || '—' },
            ].map(item => (
              <div key={item.label} className="bg-orange-50 rounded-xl px-4 py-3">
                <p className="text-xs text-stone-400 uppercase tracking-wide">{item.label}</p>
                <p className="font-semibold text-stone-800 mt-0.5">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-stone-700">Description / Details</p>
            <p className="text-stone-500 text-sm leading-relaxed">
              {report.description || 'No additional details provided for this report.'}
            </p>
          </div>

          {/* Contact Information */}
          <div className="card !bg-brand-50 border-brand-100">
            <h3 className="font-bold text-brand-900 mb-3 flex items-center gap-2">
              📞 Contact Information
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-brand-700">Reporter</span>
                <span className="font-semibold text-brand-900">{user.first_name} {user.last_name} (@{user.username})</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-brand-700">Email</span>
                <a href={`mailto:${user.email}`} className="font-semibold text-brand-900 hover:underline">
                  {user.email}
                </a>
              </div>
              {phone && phone !== '—' && (
                <div className="flex justify-between text-sm">
                  <span className="text-brand-700">Phone</span>
                  <a href={`tel:${phone}`} className="font-semibold text-brand-900 hover:underline">
                    {phone}
                  </a>
                </div>
              )}
            </div>
          </div>


          <div className="pt-4">
            <Button className="w-full justify-center py-4 text-lg" variant="outline">
              🤝 Offer Help / Send Message
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RescueDetail;
