import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Notification } from '../../types';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Notification state
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Fetch notifications for logged-in users
  useEffect(() => {
    if (!user) return;
    api.get('/notifications/get-user-notifications/')
      .then(res => setNotifications(res.data.data.Notifications || []))
      .catch(() => {});
  }, [user]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifs(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setShowUserMenu(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors duration-200 ${isActive ? 'text-brand-500' : 'text-stone-600 hover:text-brand-500'}`;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40 border-b border-stone-100">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-stone-900">
          <span className="text-2xl">🐾</span>
          <span className="text-brand-500">Pet</span>Rescue
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLink to="/" end className={navLinkClasses}>Home</NavLink>
          <NavLink to="/adoption" className={navLinkClasses}>Adoption</NavLink>
          <NavLink to="/rescue" className={navLinkClasses}>Rescue</NavLink>
          <NavLink to="/services" className={navLinkClasses}>Services</NavLink>
          <NavLink to="/about" className={navLinkClasses}>About</NavLink>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {/* Notification Bell */}
              <div className="relative" ref={notifRef}>
                <button
                  id="notif-bell-btn"
                  onClick={() => setShowNotifs(p => !p)}
                  className="relative p-2 rounded-xl hover:bg-orange-50 transition-colors"
                  aria-label="Notifications"
                >
                  <span className="text-xl">🔔</span>
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 bg-brand-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {showNotifs && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-stone-100 fade-in overflow-hidden">
                    <div className="px-4 py-3 border-b border-stone-100 flex items-center justify-between">
                      <p className="font-semibold text-stone-800 text-sm">Notifications</p>
                      {unreadCount > 0 && (
                        <button
                          className="text-xs text-brand-500 hover:underline"
                          onClick={() => {
                            api.patch('/notifications/mark-all-as-read/').then(() =>
                              setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
                            );
                          }}
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="text-stone-400 text-sm text-center py-8">No notifications</p>
                      ) : (
                        notifications.slice(0, 10).map(n => (
                          <div
                            key={n.id}
                            className={`px-4 py-3 border-b border-stone-50 hover:bg-orange-50 transition-colors ${!n.is_read ? 'bg-orange-50/60' : ''}`}
                          >
                            <p className={`text-sm font-medium ${!n.is_read ? 'text-stone-900' : 'text-stone-600'}`}>{n.title}</p>
                            <p className="text-xs text-stone-400 mt-0.5">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Menu */}
              <div className="relative" ref={userRef}>
                <button
                  id="user-menu-btn"
                  onClick={() => setShowUserMenu(p => !p)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-orange-50 transition-colors"
                >
                  <div className="h-8 w-8 rounded-full bg-brand-500 text-white flex items-center justify-center font-bold text-sm">
                    {user.first_name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-medium text-stone-700 hidden sm:block">
                    {user.first_name}
                  </span>
                  <span className="text-stone-400 text-xs">▾</span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-stone-100 fade-in py-1">
                    <Link
                      to={user.role === 'ADMIN' ? '/admin' : '/dashboard'}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-stone-700 hover:bg-orange-50 hover:text-brand-500 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      📊 Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-stone-700 hover:bg-orange-50 hover:text-brand-500 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      👤 Profile
                    </Link>
                    <div className="border-t border-stone-100 my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost text-sm">Login</Link>
              <Link to="/register" className="btn-primary text-sm">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
