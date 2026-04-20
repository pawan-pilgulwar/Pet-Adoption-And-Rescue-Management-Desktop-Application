import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api, { imgUrl } from '../../api/api';
import { Notification } from '../../types';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    api.get('/notifications/get-user-notifications/')
      .then((r: any) => setNotifs(r.data.data?.Notifications || []))
      .catch(() => { });
  }, [user]);

  useEffect(() => {
    if (notifOpen) {
      api.patch('/notifications/mark-all-as-read/').catch(() => { });
      setNotifs(prev => prev.map(n => ({ ...n, is_read: true })));
    }
  }, [notifOpen]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const unread = notifs.filter(n => !n.is_read).length;
  const pic = (user?.profile as any)?.profile_picture_url;

  const navCls = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${isActive ? 'text-brand-500' : 'text-stone-600 hover:text-brand-500'}`;

  const links = [
    { to: '/', label: 'Home', end: true },
    { to: '/about', label: 'About' },
    { to: '/rescue', label: 'Rescue' },
    { to: '/adoption', label: 'Adoption' },
    { to: '/services', label: 'Services' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-stone-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-500 rounded-xl flex items-center justify-center">
            <span className="text-white text-base">🐾</span>
          </div>
          <span className="font-black text-lg text-stone-900">Pet<span className="text-brand-500">Rescue</span></span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {links.map(l => (
            <NavLink key={l.to} to={l.to} end={l.end} className={navCls}>{l.label}</NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <div className="relative" ref={notifRef}>
                <button onClick={() => setNotifOpen(o => !o)}
                  className="relative p-2 rounded-xl hover:bg-stone-100 transition-colors">
                  <svg className="w-5 h-5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {unread > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {unread > 9 ? '9+' : unread}
                    </span>
                  )}
                </button>
                {notifOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-stone-100 fade-in overflow-hidden">
                    <div className="px-4 py-3 border-b border-stone-100 flex items-center justify-between">
                      <span className="font-semibold text-sm text-stone-800">Notifications</span>
                      {unread > 0 && <span className="text-[10px] bg-brand-100 text-brand-600 px-2 py-0.5 rounded-full font-semibold">{unread} new</span>}
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-stone-50">
                      {notifs.length === 0 ? (
                        <p className="text-center text-sm text-stone-400 py-8">No notifications</p>
                      ) : notifs.map(n => (
                        <div key={n.id} className={`px-4 py-3 ${!n.is_read ? 'bg-brand-50' : ''}`}>
                          <p className="text-sm font-medium text-stone-800">{n.title}</p>
                          <p className="text-xs text-stone-500 mt-0.5">{n.message}</p>
                          <p className="text-[10px] text-stone-400 mt-1">{new Date(n.created_at).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="relative hidden md:block" ref={profileRef}>
                <button onClick={() => setProfileOpen(o => !o)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-stone-100 transition-colors">
                  <div className="w-7 h-7 rounded-lg bg-brand-500 overflow-hidden flex items-center justify-center text-white text-xs font-bold">
                    {pic ? <img src={imgUrl(pic)} alt="" className="w-full h-full object-cover" /> : user.first_name[0]}
                  </div>
                  <span className="text-sm font-medium text-stone-700">{user.first_name}</span>
                  <svg className={`w-3 h-3 text-stone-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-xl border border-stone-100 fade-in py-1 overflow-hidden">
                    <div className="px-3 py-2 border-b border-stone-50">
                      <p className="text-xs text-stone-400">Signed in as</p>
                      <p className="text-sm font-semibold text-stone-800 truncate">{user.first_name} {user.last_name}</p>
                    </div>
                    <Link to="/profile" onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-stone-600 hover:bg-stone-50 hover:text-brand-500 transition-colors">
                      Profile
                    </Link>
                    <Link to="/dashboard" onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-stone-600 hover:bg-stone-50 hover:text-brand-500 transition-colors">
                      Dashboard
                    </Link>
                    <div className="border-t border-stone-50 mt-1">
                      <button onClick={logout}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors">
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/login" className="text-sm font-medium text-stone-600 hover:text-brand-500 px-3 py-2 transition-colors">Login</Link>
              <Link to="/register" className="text-sm font-semibold px-4 py-2 bg-brand-500 text-white rounded-xl hover:bg-brand-600 transition-colors shadow-sm">Sign Up</Link>
            </div>
          )}

          <button onClick={() => setMobileOpen(o => !o)} className="md:hidden p-2 rounded-xl hover:bg-stone-100">
            <svg className="w-5 h-5 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-stone-100 bg-white px-4 py-3 space-y-1 fade-in">
          {links.map(l => (
            <NavLink key={l.to} to={l.to} end={l.end}
              className={({ isActive }) => `block px-3 py-2 rounded-xl text-sm font-medium transition-colors ${isActive ? 'bg-brand-50 text-brand-600' : 'text-stone-600 hover:bg-stone-50'}`}
              onClick={() => setMobileOpen(false)}>
              {l.label}
            </NavLink>
          ))}
          <div className="border-t border-stone-100 pt-2 mt-2">
            {user ? (
              <>
                <Link to="/profile" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-xl text-sm text-stone-600 hover:bg-stone-50">Profile</Link>
                <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-xl text-sm text-stone-600 hover:bg-stone-50">Dashboard</Link>
                <button onClick={logout} className="block w-full text-left px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-xl text-sm text-stone-600 hover:bg-stone-50">Login</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-xl text-sm font-semibold text-brand-600 hover:bg-brand-50">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
