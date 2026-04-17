import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-lg">🐾</span>
              </div>
              <span className="text-xl font-black">Paw<span className="text-orange-400">Pal</span></span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-5">
              Connecting pets with loving families. Professional care, adoptions, and rescue — all in one place.
            </p>
            <div className="flex gap-3">
              {['f', 't', 'in'].map((s) => (
                <span key={s} className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-xs text-slate-400 cursor-pointer hover:bg-orange-500 hover:text-white transition-all">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-bold text-sm mb-5 text-white uppercase tracking-wider">Services</h3>
            <ul className="space-y-3">
              {['Grooming', 'Vet Consultation', 'Vaccination', 'Pet Training'].map((item) => (
                <li key={item}>
                  <Link to="/services" className="text-slate-400 hover:text-orange-400 transition-colors text-sm">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-sm mb-5 text-white uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { label: 'Adopt a Pet', to: '/adoption' },
                { label: 'Rescue Center', to: '/rescue' },
                { label: 'About Us', to: '/about' },
                { label: 'Member Login', to: '/login' },
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className="text-slate-400 hover:text-orange-400 transition-colors text-sm">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-sm mb-5 text-white uppercase tracking-wider">Contact</h3>
            <ul className="space-y-4 text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <span className="text-orange-400 mt-0.5">📍</span>
                <span>123 Pet Avenue, Suite 500<br />San Francisco, CA 94103</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-orange-400">📞</span>
                <span>+1 (800) PAW-PAL-00</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-orange-400">📧</span>
                <span>hello@pawpal.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">© {new Date().getFullYear()} PawPal. All rights reserved.</p>
          <div className="flex gap-5">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
              <Link key={item} to="#" className="text-xs text-slate-500 hover:text-orange-400 transition-colors">{item}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
