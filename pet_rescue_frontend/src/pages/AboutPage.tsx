import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage: React.FC = () => {
  return (
    <div className="paw-bg min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-br from-slate-800 to-slate-900 py-14 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 text-9xl flex items-center justify-end pr-20 pointer-events-none">🐾</div>
        <div className="max-w-7xl mx-auto relative z-10">
          <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Our Story</span>
          <h1 className="text-3xl md:text-4xl font-black text-white mt-1 mb-2">
            About <span className="text-orange-400">PawPal</span>
          </h1>
          <p className="text-slate-400 text-sm max-w-md">
            We're on a mission to connect every pet with a loving home.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="bg-orange-50 border border-orange-100 p-8 md:p-10 rounded-2xl">
            <span className="text-orange-500 font-semibold text-xs uppercase tracking-wider">Our Mission</span>
            <h2 className="text-2xl font-black text-slate-900 mt-2 mb-4">Why We Do What We Do</h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-3">
              PawPal is a Pet Adoption and Rescue Management Platform built to bridge the gap between pets in need and loving families. Whether an animal is looking for a new home or has been lost, our platform makes it easy to connect, report, and reunite.
            </p>
            <p className="text-slate-600 text-sm leading-relaxed">
              We believe every pet deserves a second chance at happiness. Through our Smart Matching System, we automatically connect lost pet reports with found pet reports, making reunions faster and more efficient.
            </p>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-16 px-4 bg-orange-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-orange-500 font-semibold text-xs uppercase tracking-wider">Features</span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-2">What We Offer</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { icon: '🏠', color: 'bg-orange-100 text-orange-600', title: 'Pet Adoption', desc: 'Browse pets registered for adoption by verified shops. Find dogs, cats, and more — all looking for their forever home.' },
              { icon: '📢', color: 'bg-teal-100 text-teal-600', title: 'Rescue Reports', desc: 'Lost your pet? Found someone\'s pet? File a report and our system will help match it with other reports in the community.' },
              { icon: '🤝', color: 'bg-purple-100 text-purple-600', title: 'Smart Matching', desc: 'Our automated system compares lost and found reports based on pet type, breed, color, and location to find potential matches.' },
              { icon: '🔔', color: 'bg-amber-100 text-amber-600', title: 'Real-time Notifications', desc: 'Stay informed with notifications about new pets, report status updates, and potential matches for your reports.' },
            ].map((item) => (
              <div key={item.title} className="bg-white p-6 rounded-2xl border border-orange-100 card-hover">
                <div className="flex items-start gap-4">
                  <div className={`w-11 h-11 ${item.color} rounded-xl flex items-center justify-center text-xl flex-shrink-0`}>
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 mb-1.5">{item.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-black text-slate-900 mb-3">Ready to Get Started?</h2>
          <p className="text-slate-500 text-sm mb-7">
            Join PawPal today and help make a difference in the lives of animals.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link to="/adoption" className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-all shadow-md text-sm">
              Browse Pets
            </Link>
            <Link to="/register" className="px-6 py-3 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-all text-sm">
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
