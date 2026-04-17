import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Pet } from '../types';
import PetCard from '../components/PetCard';

const Home: React.FC = () => {
  const { user } = useAuth();
  const [featuredPets, setFeaturedPets] = useState<Pet[]>([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/pets/all-pets/');
        setFeaturedPets((res.data.data.Pets || []).slice(0, 3));
      } catch (err) {
        // Guest users won't see featured pets
      }
    };
    if (user) fetchFeatured();
  }, [user]);

  return (
    <div className="paw-bg min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[88vh] flex items-center overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&q=80&w=2000"
            alt="Hero"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-20">
          <div className="max-w-xl animate-slide-up">
            <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/30 text-orange-300 text-xs font-semibold px-4 py-2 rounded-full mb-6">
              <span>🐾</span> Trusted Pet Care Platform
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white leading-[1.1] mb-5">
              Every Pet Deserves<br />
              <span className="text-orange-400">A Loving Home</span>
            </h1>
            <p className="text-lg text-slate-300 mb-8 leading-relaxed">
              Adopt, rescue, and care for pets with our all-in-one platform. Professional services, smart matching, and a community that cares.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/adoption" className="px-7 py-3.5 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/30 text-sm">
                Adopt a Pet
              </Link>
              <Link to="/rescue" className="px-7 py-3.5 bg-white/10 border border-white/20 text-white font-bold rounded-xl hover:bg-white/20 transition-all text-sm">
                Report Lost Pet
              </Link>
            </div>

            {/* Quick stats */}
            <div className="flex flex-wrap gap-6 mt-10 pt-8 border-t border-white/10">
              {[
                { val: '5k+', label: 'Happy Pets' },
                { val: '120+', label: 'Adoptions' },
                { val: '50+', label: 'Experts' },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-black text-white">{s.val}</div>
                  <div className="text-xs text-slate-400 font-medium">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Floating card */}
        <div className="absolute bottom-8 right-8 hidden lg:block animate-float">
          <div className="bg-white rounded-2xl p-4 shadow-2xl flex items-center gap-3 max-w-xs">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-2xl">🐶</div>
            <div>
              <p className="text-xs text-slate-400 font-medium">New arrival</p>
              <p className="text-sm font-bold text-slate-800">Buddy is looking for a home!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-orange-500 font-semibold text-sm uppercase tracking-wider">What We Offer</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mt-2 mb-3">Professional Pet Services</h2>
            <p className="text-slate-500 max-w-md mx-auto text-sm">From grooming to veterinary care, we've got everything your pet needs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Grooming', icon: '🛁', desc: 'Professional styling and grooming for your furry friends.', color: 'bg-orange-50 border-orange-100' },
              { title: 'Veterinary', icon: '🩺', desc: 'Expert medical care and regular checkups for pet wellness.', color: 'bg-teal-50 border-teal-100' },
              { title: 'Adoption', icon: '🏠', desc: 'Find and adopt the perfect companion for your home.', color: 'bg-amber-50 border-amber-100' },
            ].map((s) => (
              <div key={s.title} className={`p-8 rounded-2xl border ${s.color} hover:shadow-lg transition-all duration-300 group`}>
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300 inline-block">{s.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{s.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-4">{s.desc}</p>
                <Link to="/services" className="text-orange-500 font-semibold text-sm hover:text-orange-600 transition-colors">
                  Learn more →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-orange-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-orange-500 font-semibold text-sm uppercase tracking-wider">Simple Process</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mt-2 mb-3">How It Works</h2>
            <p className="text-slate-500 max-w-md mx-auto text-sm">Getting started is easy. Follow these simple steps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Create Account', desc: 'Sign up as a pet owner or shop owner in minutes.', icon: '👤' },
              { step: '02', title: 'Browse Pets', desc: 'Explore available pets for adoption from verified shops.', icon: '🔍' },
              { step: '03', title: 'Request Adoption', desc: 'Submit an adoption request for your chosen pet.', icon: '📝' },
              { step: '04', title: 'Welcome Home', desc: 'Get approved and bring your new companion home!', icon: '🏠' },
            ].map((item, i) => (
              <div key={item.step} className="relative">
                {i < 3 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-orange-200 z-0" style={{ width: 'calc(100% - 2rem)', left: '50%' }}></div>
                )}
                <div className="bg-white rounded-2xl p-6 border border-orange-100 text-center relative z-10 hover:shadow-md transition-all">
                  <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 shadow-md shadow-orange-500/20">
                    {item.icon}
                  </div>
                  <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest">{item.step}</span>
                  <h3 className="text-base font-bold text-slate-900 mt-1 mb-2">{item.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-14">
          <div className="lg:w-1/2 relative">
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=1000"
                alt="About PawPal"
                className="w-full h-auto"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-orange-500 text-white rounded-2xl p-5 shadow-xl hidden md:block">
              <p className="text-3xl font-black">10+</p>
              <p className="text-xs font-medium text-orange-100">Years of Care</p>
            </div>
          </div>
          <div className="lg:w-1/2">
            <span className="text-orange-500 font-semibold text-sm uppercase tracking-wider">About PawPal</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mt-2 mb-4 leading-tight">
              We Care For Every Pet Like Our Own
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              PawPal is a pet adoption and rescue management platform built to bridge the gap between pets in need and loving families. Our smart matching system connects lost and found reports automatically.
            </p>
            <ul className="space-y-3 mb-8">
              {['Professional Veterinary Surgeons', 'Smart Lost & Found Matching', 'Verified Pet Shop Network'].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-slate-700">
                  <span className="w-5 h-5 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/about" className="inline-block px-7 py-3 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-all text-sm">
              Learn More About Us
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Pets */}
      {featuredPets.length > 0 && (
        <section className="py-20 px-4 bg-orange-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="text-orange-500 font-semibold text-sm uppercase tracking-wider">New Members</span>
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 mt-1">Featured Pets</h2>
              </div>
              <Link to="/adoption" className="hidden md:block px-5 py-2.5 bg-white border border-orange-200 text-slate-700 font-semibold rounded-xl hover:bg-orange-50 transition-all text-sm">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPets.map((pet) => (
                <PetCard key={pet.id} pet={pet} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 px-4 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 text-9xl">🐾</div>
          <div className="absolute bottom-10 right-10 text-9xl">🐾</div>
        </div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
            Ready to Find Your<br />
            <span className="text-orange-400">Perfect Companion?</span>
          </h2>
          <p className="text-slate-400 text-sm mb-8 max-w-xl mx-auto leading-relaxed">
            Join thousands of happy pet owners. Whether you're looking to adopt or need professional care, we're here for you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {!user ? (
              <Link to="/register" className="px-8 py-3.5 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/30 text-sm">
                Get Started Free
              </Link>
            ) : (
              <Link to="/adoption" className="px-8 py-3.5 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/30 text-sm">
                Browse Pets
              </Link>
            )}
            <Link to="/services" className="px-8 py-3.5 bg-white/10 border border-white/20 text-white font-bold rounded-xl hover:bg-white/20 transition-all text-sm">
              Our Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
