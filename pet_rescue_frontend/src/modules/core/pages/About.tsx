import React from 'react';
import { Link } from 'react-router-dom';

const About: React.FC = () => (
  <div>
    <section className="bg-gradient-to-br from-stone-800 to-stone-900 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <span className="text-stone-400 text-xs font-semibold uppercase tracking-wider">Our Story</span>
        <h1 className="text-3xl md:text-4xl font-black text-white mt-2 mb-2">About <span className="text-brand-400">PetRescue</span></h1>
        <p className="text-stone-400 text-sm max-w-md">We're on a mission to connect every pet with a loving home.</p>
      </div>
    </section>

    <section className="py-16 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="bg-brand-50 border border-brand-100 p-8 rounded-2xl mb-8">
          <h2 className="text-xl font-black text-stone-900 mb-3">Our Mission</h2>
          <p className="text-stone-600 text-sm leading-relaxed mb-3">
            PetRescue is a Pet Adoption and Rescue Management Platform built to bridge the gap between pets in need and loving families. Whether an animal is looking for a new home or has been lost, our platform makes it easy to connect, report, and reunite.
          </p>
          <p className="text-stone-600 text-sm leading-relaxed">
            Through our Smart Matching System, we automatically connect lost pet reports with found pet reports, making reunions faster and more efficient.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            { icon: '🏠', color: 'bg-brand-100 text-brand-600', title: 'Pet Adoption', desc: 'Browse pets registered for adoption by verified shops. Find dogs, cats, and more.' },
            { icon: '📢', color: 'bg-teal-100 text-teal-600', title: 'Rescue Reports', desc: 'Lost your pet? Found someone\'s pet? File a report and our system will help match it.' },
            { icon: '🤝', color: 'bg-purple-100 text-purple-600', title: 'Smart Matching', desc: 'Our system compares lost and found reports based on species, breed, color, and location.' },
            { icon: '🔔', color: 'bg-amber-100 text-amber-600', title: 'Notifications', desc: 'Stay informed with real-time notifications about pets, reports, and potential matches.' },
          ].map(item => (
            <div key={item.title} className="bg-white p-6 rounded-2xl border border-stone-100 hover:shadow-md transition-all">
              <div className="flex items-start gap-4">
                <div className={`w-11 h-11 ${item.color} rounded-xl flex items-center justify-center text-xl flex-shrink-0`}>{item.icon}</div>
                <div>
                  <h3 className="font-bold text-stone-800 mb-1">{item.title}</h3>
                  <p className="text-sm text-stone-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-16 px-6 bg-stone-50">
      <div className="max-w-xl mx-auto text-center">
        <h2 className="text-2xl font-black text-stone-900 mb-3">Ready to Get Started?</h2>
        <p className="text-stone-500 text-sm mb-7">Join PetRescue today and help make a difference.</p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link to="/adoption" className="px-6 py-3 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-600 transition-colors text-sm">Browse Pets</Link>
          <Link to="/register" className="px-6 py-3 bg-stone-900 text-white font-semibold rounded-xl hover:bg-stone-800 transition-colors text-sm">Create Account</Link>
        </div>
      </div>
    </section>
  </div>
);

export default About;
