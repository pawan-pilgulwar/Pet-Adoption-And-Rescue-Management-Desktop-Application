import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Brand */}
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 text-white font-bold text-xl mb-3">
            <span className="text-2xl">🐾</span>
            <span className="text-brand-400">Pet</span>Rescue
          </div>
          <p className="text-sm text-stone-400 max-w-xs leading-relaxed">
            Connecting loving homes with pets in need. Adopt, rescue, and care — all in one place.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <p className="font-semibold text-white mb-3 text-sm uppercase tracking-wide">Quick Links</p>
          <ul className="space-y-2 text-sm">
            <li><Link to="/adoption" className="hover:text-brand-400 transition-colors">Adopt a Pet</Link></li>
            <li><Link to="/rescue" className="hover:text-brand-400 transition-colors">Rescue Center</Link></li>
            <li><Link to="/services" className="hover:text-brand-400 transition-colors">Pet Services</Link></li>
            <li><Link to="/about" className="hover:text-brand-400 transition-colors">About Us</Link></li>
          </ul>
        </div>

        {/* Account */}
        <div>
          <p className="font-semibold text-white mb-3 text-sm uppercase tracking-wide">Account</p>
          <ul className="space-y-2 text-sm">
            <li><Link to="/login" className="hover:text-brand-400 transition-colors">Login</Link></li>
            <li><Link to="/register" className="hover:text-brand-400 transition-colors">Register</Link></li>
            <li><Link to="/dashboard" className="hover:text-brand-400 transition-colors">Dashboard</Link></li>
            <li><Link to="/profile" className="hover:text-brand-400 transition-colors">Profile</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-stone-800 px-6 py-4">
        <p className="text-center text-xs text-stone-500">
          © {new Date().getFullYear()} PetRescue. Built with ❤️ for animals.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
