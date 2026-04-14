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

  // Load notifications initially on mount
  useEffect(() => {
    loadNotifications();
  }, [user]);

  // Mark as read when dropdown opens
  useEffect(() => {
    const markAsRead = async () => {
      if (notifDropdownOpen && notifications.some(n => !n.is_read)) {
        try {
          await api.patch('/notifications/mark-all-as-read/');
          // Update local state to mark all as read
          setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        } catch (error) {
          console.error('Could not mark notifications as read', error);
        }
      }
    };

    markAsRead();
  }, [notifDropdownOpen]);

  // Close dropdowns on outside click
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
    `px-3 py-2 rounded-lg text-sm font-bold transition-colors duration-200 ${isActive
      ? 'text-orange-600 bg-orange-50'
      : 'text-slate-700 hover:text-orange-600 hover:bg-orange-50'
    }`;

  return (
    <header className="w-full bg-white/90 backdrop-blur-md border-b border-orange-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🐾</span>
            <span className="text-xl font-black tracking-tight text-slate-800">
              Paw<span className="text-orange-500">Pal</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/" end className={navLinkClass}>Home</NavLink>
            <NavLink to="/adoption" className={navLinkClass}>Adoption</NavLink>
            <NavLink to="/rescue" className={navLinkClass}>Rescue</NavLink>
            <NavLink to="/about" className={navLinkClass}>About</NavLink>
            {user && user.role === 'ADMIN' && (
              <NavLink to="/admin" className={navLinkClass}>Admin</NavLink>
            )}
          </nav>

          {/* Right section */}
          <div className="flex items-center gap-3">
            {/* Notification bell */}
            {user && (
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                  className="relative p-2 rounded-full hover:bg-orange-50 transition-colors"
                  id="notification-bell"
                  title={unreadCount > 0 ? `${unreadCount} unread notifications` : 'No new notifications'}
                >
                  <span className="text-xl">🔔</span>
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notification dropdown */}
                {notifDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 z-50 bg-white rounded-2xl shadow-xl border border-orange-100 animate-fade-in overflow-hidden">
                    <div className="p-4 border-b border-orange-50 font-bold text-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span>🔔</span> Notifications
                      </div>
                      {unreadCount > 0 && (
                        <span className="text-[10px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full uppercase tracking-wider">
                          {unreadCount} New
                        </span>
                      )}
                    </div>
                    <div className="max-h-64 overflow-y-auto p-2 space-y-1 bg-slate-50/30">
                      {notifications.length === 0 ? (
                        <div className="text-sm text-slate-400 text-center py-8">No notifications yet.</div>
                      ) : (
                        notifications.map((item) => (
                          <div
                            key={item.id}
                            className={`p-3 rounded-xl transition-colors border ${item.is_read
                              ? 'bg-white border-transparent'
                              : 'bg-white border-orange-100 shadow-sm'
                              }`}
                          >
                            <div className="flex items-start gap-2">
                              {!item.is_read && <span className="w-2 h-2 rounded-full bg-orange-500 mt-1.5 shrink-0" />}
                              <div>
                                <p className="text-sm font-bold text-slate-800 leading-tight">{item.title}</p>
                                <p className="text-xs text-slate-500 mt-1 leading-snug">{item.message}</p>
                                <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
                                  <span>🕒</span> {new Date(item.created_at).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="p-3 border-t border-orange-50 text-center bg-white">
                      <button
                        onClick={() => setNotifDropdownOpen(false)}
                        className="text-sm text-orange-600 font-bold hover:underline"
                      >
                        Close Panel
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
                  className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-orange-50 transition-all border border-transparent hover:border-orange-100"
                >
                  <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-black overflow-hidden border-2 border-white shadow-sm">
                    {user.profile?.profile_picture_url ? (
                      <img src={formatImageUrl(user.profile.profile_picture_url)} alt="" className="w-full h-full object-cover" />
                    ) : (
                      user.first_name?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase()
                    )}
                  </div>
                  <span className="text-sm font-bold text-slate-700">{user.username}</span>
                  <span className={`text-[10px] transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180' : ''}`}>▼</span>
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 z-50 bg-white rounded-2xl shadow-xl border border-orange-100 animate-fade-in py-2 overflow-hidden">
                    <div className="px-4 py-2 border-b border-orange-50 mb-1">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Logged in as</p>
                      <p className="text-sm font-black text-slate-800 truncate">{user.first_name} {user.last_name}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <span>👤</span> Profile
                    </Link>
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <span>📊</span> Dashboard
                    </Link>
                    <div className="border-t border-orange-50 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <span className="ml-7">Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <NavLink
                  to="/login"
                  className="text-sm font-bold text-slate-700 hover:text-orange-600 px-4 py-2 rounded-lg transition-colors"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="text-sm font-bold px-5 py-2 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition-colors shadow-md shadow-orange-500/20"
                >
                  Sign Up
                </NavLink>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-orange-50"
            >
              <span className="text-xl">{mobileMenuOpen ? '✕' : '☰'}</span>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-orange-50 mt-2 pt-3 space-y-1 animate-fade-in">
            <NavLink to="/" end className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>Home</NavLink>
            <NavLink to="/adoption" className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>Adoption</NavLink>
            <NavLink to="/rescue" className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>Rescue</NavLink>
            <NavLink to="/about" className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>About</NavLink>
            {user && user.role === 'ADMIN' && (
              <NavLink to="/admin" className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>Admin Panel</NavLink>
            )}
            <div className="pt-2 border-t border-orange-50 mt-2">
              {user ? (
                <div className="space-y-1">
                  <Link to="/profile" className="block px-3 py-2 text-sm font-bold text-slate-700 hover:bg-orange-50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                    👤 My Profile
                  </Link>
                  <Link to="/dashboard" className="block px-3 py-2 text-sm font-bold text-slate-700 hover:bg-orange-50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                    📊 Dashboard
                  </Link>
                  <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg">
                    👋 Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  <NavLink to="/login" className="block px-3 py-2 text-sm font-bold text-slate-700 hover:bg-orange-50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>Login</NavLink>
                  <NavLink to="/register" className="block px-3 py-2 text-sm font-bold text-orange-600 hover:bg-orange-50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>Sign Up</NavLink>
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
