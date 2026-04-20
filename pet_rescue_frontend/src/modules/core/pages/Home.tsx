import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../api/api';
import { AdoptionListing } from '../../../types';
import PetCard from '../../adoption/components/PetCard';

const Home: React.FC = () => {
  const [listings, setListings] = useState<AdoptionListing[]>([]);

  useEffect(() => {
    api.get('/adoption/listings/').then(r => setListings((r.data.data || []).slice(0, 3))).catch(() => {});
  }, []);

  const services = [
    { icon: '🛁', title: 'Grooming', desc: 'Professional styling and grooming for your furry friends.' },
    { icon: '🩺', title: 'Veterinary', desc: 'Expert medical care and regular checkups for pet wellness.' },
    { icon: '🏠', title: 'Adoption', desc: 'Find and adopt the perfect companion for your home.' },
    { icon: '🚨', title: 'Rescue', desc: 'Report lost or found pets and help reunite families.' },
  ];

  const steps = [
    { n: '01', title: 'Create Account', desc: 'Sign up as a pet owner or shop owner.' },
    { n: '02', title: 'Browse Pets', desc: 'Explore available pets from verified shops.' },
    { n: '03', title: 'Request Adoption', desc: 'Submit a request for your chosen pet.' },
    { n: '04', title: 'Welcome Home', desc: 'Get approved and bring your companion home!' },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[88vh] flex items-center bg-stone-900 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=1800&q=80"
            alt="Hero" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-900/90 via-stone-900/60 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 w-full">
          <div className="max-w-xl fade-in">
            <div className="inline-flex items-center gap-2 bg-brand-500/20 border border-brand-500/30 text-brand-300 text-xs font-semibold px-4 py-2 rounded-full mb-6">
              🐾 Trusted Pet Care Platform
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white leading-tight mb-5">
              Every Pet Deserves<br /><span className="text-brand-400">A Loving Home</span>
            </h1>
            <p className="text-stone-300 text-lg mb-8 leading-relaxed">
              Adopt, rescue, and care for pets with our all-in-one platform. Smart matching, professional services, and a community that cares.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/adoption" className="px-7 py-3.5 bg-brand-500 text-white font-bold rounded-xl hover:bg-brand-600 transition-colors shadow-lg text-sm">
                Adopt a Pet
              </Link>
              <Link to="/rescue" className="px-7 py-3.5 bg-white/10 border border-white/20 text-white font-bold rounded-xl hover:bg-white/20 transition-colors text-sm">
                Report Lost Pet
              </Link>
            </div>
            <div className="flex gap-8 mt-10 pt-8 border-t border-white/10">
              {[['5k+', 'Happy Pets'], ['120+', 'Adoptions'], ['50+', 'Experts']].map(([v, l]) => (
                <div key={l}>
                  <div className="text-2xl font-black text-white">{v}</div>
                  <div className="text-xs text-stone-400">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Floating card */}
        <div className="absolute bottom-8 right-8 hidden xl:block float">
          <div className="bg-white rounded-2xl p-4 shadow-2xl flex items-center gap-3 max-w-xs">
            <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center text-2xl">🐶</div>
            <div>
              <p className="text-xs text-stone-400">New arrival</p>
              <p className="text-sm font-bold text-stone-800">Buddy is looking for a home!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-brand-500 font-semibold text-sm uppercase tracking-wider">What We Offer</span>
            <h2 className="text-3xl md:text-4xl font-black text-stone-900 mt-2">Professional Pet Services</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map(s => (
              <div key={s.title} className="p-6 bg-stone-50 rounded-2xl border border-stone-100 hover:border-brand-200 hover:bg-white hover:shadow-md transition-all group">
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform inline-block">{s.icon}</div>
                <h3 className="font-bold text-stone-900 mb-2">{s.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 bg-brand-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-brand-500 font-semibold text-sm uppercase tracking-wider">Simple Process</span>
            <h2 className="text-3xl md:text-4xl font-black text-stone-900 mt-2">How It Works</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map(s => (
              <div key={s.n} className="bg-white rounded-2xl p-6 border border-brand-100 text-center hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-brand-500 rounded-2xl flex items-center justify-center text-white font-black text-sm mx-auto mb-4 shadow-md shadow-brand-500/20">
                  {s.n}
                </div>
                <h3 className="font-bold text-stone-900 mb-2">{s.title}</h3>
                <p className="text-xs text-stone-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Pets */}
      {listings.length > 0 && (
        <section className="py-20 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="text-brand-500 font-semibold text-sm uppercase tracking-wider">New Members</span>
                <h2 className="text-3xl font-black text-stone-900 mt-1">Featured Pets</h2>
              </div>
              <Link to="/adoption" className="text-sm font-semibold text-brand-500 hover:text-brand-600 transition-colors">View All →</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map(l => (
                <PetCard key={l.id} pet={l.pet_detail} listingId={l.id} price={l.price} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 px-6 bg-stone-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 text-[200px] flex items-center justify-center pointer-events-none">🐾</div>
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
            Ready to Find Your<br /><span className="text-brand-400">Perfect Companion?</span>
          </h2>
          <p className="text-stone-400 text-sm mb-8 leading-relaxed">
            Join thousands of happy pet owners. Adopt, rescue, or book professional care today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register" className="px-8 py-3.5 bg-brand-500 text-white font-bold rounded-xl hover:bg-brand-600 transition-colors shadow-lg text-sm">
              Get Started Free
            </Link>
            <Link to="/services" className="px-8 py-3.5 bg-white/10 border border-white/20 text-white font-bold rounded-xl hover:bg-white/20 transition-colors text-sm">
              Our Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
