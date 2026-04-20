import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => (
  <footer className="bg-stone-900 text-white mt-auto">
    <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-brand-500 rounded-xl flex items-center justify-center">
            <span className="text-white">🐾</span>
          </div>
          <span className="font-black text-lg">Pet<span className="text-brand-400">Rescue</span></span>
        </div>
        <p className="text-stone-400 text-sm leading-relaxed">
          Connecting pets with loving families. Adopt, rescue, and care — all in one place.
        </p>
      </div>
      <div>
        <h4 className="font-semibold text-sm mb-4 text-stone-300 uppercase tracking-wider">Quick Links</h4>
        <ul className="space-y-2">
          {[['/', 'Home'], ['/adoption', 'Adoption'], ['/rescue', 'Rescue'], ['/services', 'Services']].map(([to, label]) => (
            <li key={to}><Link to={to} className="text-stone-400 hover:text-brand-400 text-sm transition-colors">{label}</Link></li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="font-semibold text-sm mb-4 text-stone-300 uppercase tracking-wider">Account</h4>
        <ul className="space-y-2">
          {[['/login', 'Login'], ['/register', 'Register'], ['/dashboard', 'Dashboard'], ['/profile', 'Profile']].map(([to, label]) => (
            <li key={to}><Link to={to} className="text-stone-400 hover:text-brand-400 text-sm transition-colors">{label}</Link></li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="font-semibold text-sm mb-4 text-stone-300 uppercase tracking-wider">Contact</h4>
        <ul className="space-y-2 text-stone-400 text-sm">
          <li>📍 123 Pet Avenue, SF CA</li>
          <li>📞 +1 (800) PET-RESCUE</li>
          <li>📧 hello@petrescue.com</li>
        </ul>
      </div>
    </div>
    <div className="border-t border-stone-800 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-2">
      <p className="text-xs text-stone-500">© {new Date().getFullYear()} PetRescue. All rights reserved.</p>
      <div className="flex gap-4">
        {['Privacy', 'Terms', 'Cookies'].map(t => (
          <Link key={t} to="#" className="text-xs text-stone-500 hover:text-brand-400 transition-colors">{t}</Link>
        ))}
      </div>
    </div>
  </footer>
);

export default Footer;
