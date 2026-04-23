import React from 'react';
import { Link } from 'react-router-dom';

function About() {
  const team = [
    { name: 'Rescue Team', emoji: '🚨', desc: 'Dedicated volunteers who respond to lost & found pet reports 24/7.' },
    { name: 'Adoption Experts', emoji: '❤️', desc: 'Helping match pets with the perfect loving families.' },
    { name: 'Vet Partners', emoji: '🏥', desc: 'Certified veterinarians ensuring every pet is healthy and vaccinated.' },
    { name: 'Tech Team', emoji: '💻', desc: 'Building the platform that connects it all seamlessly.' },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-brand-500 to-amber-500 text-white py-20 text-center">
        <h1 className="text-4xl font-extrabold mb-3 fade-in-up">About PetRescue 🐾</h1>
        <p className="text-orange-100 max-w-xl mx-auto text-sm fade-in-up" style={{ animationDelay: '0.1s' }}>
          Our mission is to ensure every pet finds a loving home and every lost pet is found.
        </p>
      </section>

      {/* Mission */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-bold text-stone-900 mb-4">Our Mission</h2>
            <p className="text-stone-500 leading-relaxed mb-4">
              PetRescue was founded with a simple belief: every animal deserves a safe, loving home. We connect 
              pet shops, rescue volunteers, and loving families through a single, easy-to-use platform.
            </p>
            <p className="text-stone-500 leading-relaxed">
              From adoption listings to rescue reports, from booking pet services to managing your rescued friends — 
              we're here every step of the way.
            </p>
          </div>
          <div className="text-center text-9xl float">🐾</div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-orange-50 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-stone-900 text-center mb-2">Our Team</h2>
          <p className="text-stone-500 text-center mb-10">The passionate people behind PetRescue</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map(t => (
              <div key={t.name} className="card text-center fade-in">
                <span className="text-5xl">{t.emoji}</span>
                <h3 className="font-bold text-stone-900 mt-3 mb-2">{t.name}</h3>
                <p className="text-stone-500 text-xs leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center px-6">
        <h2 className="text-2xl font-bold text-stone-900 mb-4">Join Us Today</h2>
        <p className="text-stone-500 mb-6 text-sm">Be part of a community that cares for every animal.</p>
        <Link to="/register" className="btn-primary px-8 py-3 text-base">Get Started →</Link>
      </section>
    </div>
  );
}

export default About;
