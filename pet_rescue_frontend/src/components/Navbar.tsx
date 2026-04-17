import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api, { formatImageUrl } from '../services/api';

interface NotificationItem {
  id: number;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const loadNotifications = async () => {
    if (!user) return;
    try {
      const res = await api.get('/notifications/get-user-notifications/');
      setNotifications(res.data.data.Notifications || []);
    } catch (error) {
      console.error('Could not load notifications', error);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [user]);

  useEffect(() => {
    const markAsRead = async () => {
      if (notifDropdownOpen && notifications.some(n => !n.is_read)) {
        try {
          await api.patch('/notifications/mark-all-as-read/');
          setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        } catch (error) {
          console.error('Could not mark notifications as read', error);
        }
      }
    };
    markAsRead();
  }, [notifDropdownOpen]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (notifDropdownOpen && notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifDropdownOpen(false);
      }
      if (profileDropdownOpen && profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [notifDropdownOpen, profileDropdownOpen]);

  const unreadCount = notifications.filter((item) => !item.is_read).length;

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
      isActive
        ? 'text-orange-600 bg-orange-50'
        : 'text-slate-600 hover:text-orange-600 hover:bg-orange-50'
    }`;

  return (
    <header className="w-full bg-white border-b border-orange-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center shadow-md shadow-orange-500/30">
              <span className="text-white text-lg">🐾</span>
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900">
              Paw<span className="text-orange-500">Pal</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/" end className={navLinkClass}>Home</NavLink>
            <NavLink to="/adoption" className={navLinkClass}>Adoption</NavLink>
            <NavLink to="/services" className={navLinkClass}>Services</NavLink>
            <NavLink to="/rescue" className={navLinkClass}>Rescue</NavLink>
            <NavLink to="/about" className={navLinkClass}>About</NavLink>
            {user && user.role === 'ADMIN' && (
              <NavLink to="/admin" className={navLinkClass}>Admin</NavLink>
            )}
          </nav>

          {/* Right section */}
          <div className="flex items-center gap-2">
            {/* Notification bell */}
            {user && (
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                  className="relative p-2 rounded-xl hover:bg-orange-50 transition-colors"
                  title={unreadCount > 0 ? `${unreadCount} unread notifications` : 'Notifications'}
                >
                  <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-orange-500 text-white text-[9px] font-bold flex items-center justify-center border-2 border-white">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {notifDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 z-50 bg-white rounded-2xl shadow-xl border border-orange-100 animate-fade-in overflow-hidden">
                    <div className="p-4 border-b border-orange-50 font-bold text-slate-800 flex items-center justify-between">
                      <span className="text-sm">Notifications</span>
                      {unreadCount > 0 && (
                        <span className="text-[10px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-bold">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    <div className="max-h-64 overflow-y-auto divide-y divide-slate-50">
                      {notifications.length === 0 ? (
                        <div className="text-sm text-slate-400 text-center py-8">No notifications yet.</div>
                      ) : (
                        notifications.map((item) => (
                          <div
                            key={item.id}
                            className={`p-3 transition-colors ${item.is_read ? 'bg-white' : 'bg-orange-50/50'}`}
                          >
                            <div className="flex items-start gap-2">
                              {!item.is_read && <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0" />}
                              <div className={!item.is_read ? '' : 'pl-3.5'}>
                                <p className="text-sm font-semibold text-slate-800 leading-tight">{item.title}</p>
                                <p className="text-xs text-slate-500 mt-0.5">{item.message}</p>
                                <p className="text-[10px] text-slate-400 mt-1">
                                  {new Date(item.created_at).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="p-3 border-t border-orange-50 text-center">
                      <button onClick={() => setNotifDropdownOpen(false)} className="text-xs text-orange-500 font-semibold hover:underline">
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Profile Dropdown */}
            {user ? (
              <div className="relative hidden md:block" ref={profileRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-orange-50 transition-all border border-transparent hover:border-orange-100"
                >
                  <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center text-white text-xs font-bold overflow-hidden">
                    {user.profile?.profile_picture_url ? (
                      <img src={formatImageUrl(user.profile.profile_picture_url)} alt="" className="w-full h-full object-cover" />
                    ) : (
                      user.first_name?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase()
                    )}
                  </div>
                  <span className="text-sm font-semibold text-slate-700">{user.first_name || user.username}</span>
                  <svg className={`w-3 h-3 text-slate-400 transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 z-50 bg-white rounded-2xl shadow-xl border border-orange-100 animate-fade-in py-2 overflow-hidden">
                    <div className="px-4 py-2 border-b border-orange-50 mb-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Signed in as</p>
                      <p className="text-sm font-bold text-slate-800 truncate">{user.first_name} {user.last_name}</p>
                    </div>
                    <Link to="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-orange-50 hover:text-orange-600 transition-colors" onClick={() => setProfileDropdownOpen(false)}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      Profile
                    </Link>
                    <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-orange-50 hover:text-orange-600 transition-colors" onClick={() => setProfileDropdownOpen(false)}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                      Dashboard
                    </Link>
                    <div className="border-t border-orange-50 my-1"></div>
                    <button onClick={handleLogout} className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <NavLink to="/login" className="text-sm font-semibold text-slate-600 hover:text-orange-600 px-4 py-2 rounded-lg transition-colors">
                  Login
                </NavLink>
                <NavLink to="/register" className="text-sm font-semibold px-5 py-2 rounded-xl bg-orange-500 text-white hover:bg-orange-600 transition-colors shadow-md shadow-orange-500/20">
                  Sign Up
                </NavLink>
              </div>
            )}

            {/* Mobile hamburger */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-lg hover:bg-orange-50">
              <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-orange-50 mt-2 pt-3 space-y-1 animate-fade-in">
            <NavLink to="/" end className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>Home</NavLink>
            <NavLink to="/adoption" className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>Adoption</NavLink>
            <NavLink to="/services" className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>Services</NavLink>
            <NavLink to="/rescue" className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>Rescue</NavLink>
            <NavLink to="/about" className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>About</NavLink>
            {user && user.role === 'ADMIN' && (
              <NavLink to="/admin" className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>Admin Panel</NavLink>
            )}
            <div className="pt-2 border-t border-orange-50 mt-2">
              {user ? (
                <div className="space-y-1">
                  <Link to="/profile" className="block px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-orange-50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>My Profile</Link>
                  <Link to="/dashboard" className="block px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-orange-50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm font-semibold text-red-500 hover:bg-red-50 rounded-lg">Logout</button>
                </div>
              ) : (
                <div className="space-y-1">
                  <NavLink to="/login" className="block px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-orange-50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>Login</NavLink>
                  <NavLink to="/register" className="block px-4 py-2 text-sm font-semibold text-orange-600 hover:bg-orange-50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>Sign Up</NavLink>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
