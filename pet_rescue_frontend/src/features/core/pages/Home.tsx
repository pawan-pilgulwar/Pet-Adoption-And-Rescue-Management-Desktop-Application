import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../services/api';
import { AdoptionListing } from '../../../types';
import Spinner from '../../../components/common/Spinner';
import { useAuth } from '../../../context/AuthContext';

function Home() {
  const [listings, setListings] = useState<AdoptionListing[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  // const [stats, setStats] = useState({ pets: 0, reports: 0 });

  // Fetch a few featured listings for the homepage showcase
  // GET /api/v1/adoption/listings/ — requires auth, show only if available
  useEffect(() => {
    api.get('/adoption/listings/')
      .then(res => {
        const data = res.data?.data?.results || res.data?.data || [];
        setListings(Array.isArray(data) ? data.slice(0, 4) : []);
      })
      .catch(() => setListings([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen">

      {/* ── Hero Section ── */}
      <section className="relative bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-9xl float">🐕</div>
          <div className="absolute top-20 right-20 text-7xl float" style={{ animationDelay: '1s' }}>🐈</div>
          <div className="absolute bottom-10 left-1/3 text-8xl float" style={{ animationDelay: '0.5s' }}>🐾</div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-24 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight fade-in-up">
            Find Your Perfect
            <span className="block text-yellow-200">Furry Friend 🐾</span>
          </h1>
          <p className="text-lg text-orange-100 max-w-xl mx-auto mb-8 fade-in-up" style={{ animationDelay: '0.1s' }}>
            Adopt, rescue, and care for pets with PetRescue — connecting loving homes with animals in need.
          </p>
          <div className="flex flex-wrap gap-4 justify-center fade-in-up" style={{ animationDelay: '0.2s' }}>
            <Link to={user ? "/adoption" : "/login"} className="bg-white text-brand-500 font-bold px-8 py-3 rounded-2xl hover:bg-orange-50 transition-all duration-200 shadow-lg active:scale-95">
              🐾 Adopt a Pet
            </Link>
            <Link to={user ? "/rescue" : "/login"} className="border-2 border-white text-white font-bold px-8 py-3 rounded-2xl hover:bg-white/10 transition-all duration-200 active:scale-95">
              🚨 Report a Pet
            </Link>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,40 C360,0 1080,80 1440,40 L1440,60 L0,60 Z" fill="#fafaf9" />
          </svg>
        </div>
      </section>

      {/* ── Stats Banner ── */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Pets Available', value: '100+', icon: '🐾' },
            { label: 'Reports Resolved', value: '50+', icon: '✅' },
            { label: 'Happy Families', value: '200+', icon: '❤️' },
            { label: 'Active Shops', value: '20+', icon: '🏪' },
          ].map(stat => (
            <div key={stat.label} className="card text-center fade-in">
              <span className="text-4xl">{stat.icon}</span>
              <p className="text-2xl font-extrabold text-brand-500 mt-2">{stat.value}</p>
              <p className="text-stone-500 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="bg-orange-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-stone-900 text-center mb-2">How It Works</h2>
          <p className="text-stone-500 text-center mb-10">Three simple steps to bring home a new friend</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', icon: '🔍', title: 'Browse Pets', desc: 'Explore available pets listed by verified shops and shelters near you.' },
              { step: '02', icon: '📋', title: 'Request Adoption', desc: 'Submit an adoption request and get approved by the shop owner.' },
              { step: '03', icon: '🏠', title: 'Welcome Home', desc: 'Complete the process and give your new furry friend a loving home.' },
            ].map(step => (
              <div key={step.step} className="card text-center relative overflow-hidden fade-in">
                <div className="absolute top-0 right-0 text-8xl font-black text-orange-100 select-none leading-none">
                  {step.step}
                </div>
                <span className="text-5xl relative">{step.icon}</span>
                <h3 className="text-lg font-bold text-stone-900 mt-3 mb-2 relative">{step.title}</h3>
                <p className="text-stone-500 text-sm relative">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Pets ── */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-stone-900">Featured Pets</h2>
            <p className="text-stone-500 text-sm mt-1">Meet some of our adorable pets waiting for a home</p>
          </div>
          <Link to={user ? "/adoption" : "/login"} className="btn-outline text-sm hidden md:inline-flex">
            View All →
          </Link>
        </div>

        {loading ? (
          <Spinner message="Loading pets..." />
        ) : listings.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-5xl">🐾</span>
            <p className="text-stone-400 mt-3">
              <Link to="/login" className="text-brand-500 hover:underline">Sign in</Link> to view available pets.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {listings.map(listing => (
              <Link key={listing.id} to={`/adoption/${listing.id}`} className="card hover:shadow-xl transition-shadow group fade-in">
                <div className="aspect-square rounded-xl overflow-hidden bg-orange-50 mb-4">
                  {listing.pet_detail?.image_url ? (
                    <img
                      src={listing.pet_detail.image_url}
                      alt={listing.pet_detail.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl">🐾</div>
                  )}
                </div>
                <h3 className="font-bold text-stone-900 text-lg">{listing.pet_detail?.name}</h3>
                <p className="text-stone-500 text-sm">{listing.pet_detail?.species} · {listing.pet_detail?.breed || 'Mixed'}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-brand-500 font-bold text-lg">₹{listing.price}</span>
                  <span className={`badge ${listing.is_available ? 'badge-green' : 'badge-red'}`}>
                    {listing.is_available ? 'Available' : 'Adopted'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ── CTA Banner ── */}
      <section className="bg-stone-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference? 🐾</h2>
          <p className="text-stone-400 mb-8 text-sm">Join thousands of pet lovers who have already changed lives through PetRescue.</p>
          <div className="flex gap-4 justify-center">
            <Link to="/register" className="btn-primary px-8 py-3 text-base">Get Started</Link>
            <Link to={user ? "/rescue" : "/login"} className="btn-outline border-white text-white hover:bg-white/10 px-8 py-3 text-base">Report Lost Pet</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
