import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface SidebarItem { to: string; label: string; icon: string; end?: boolean; }

const adminLinks: SidebarItem[] = [
  { to: '/admin', label: 'Dashboard', icon: '📊', end: true },
  { to: '/admin/users', label: 'Users', icon: '👥' },
  { to: '/admin/pets', label: 'Pets', icon: '🐾' },
  { to: '/admin/listings', label: 'Listings', icon: '🏷️' },
  { to: '/admin/adoptions', label: 'Adoptions', icon: '🏠' },
  { to: '/admin/reports', label: 'Reports', icon: '📋' },
  { to: '/admin/rescue', label: 'Rescue Requests', icon: '🚨' },
  { to: '/admin/services', label: 'Services', icon: '✂️' },
];

const shopLinks: SidebarItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊', end: true },
  { to: '/dashboard/pets', label: 'My Pets', icon: '🐾' },
  { to: '/dashboard/listings', label: 'Listings', icon: '🏷️' },
  { to: '/dashboard/services', label: 'Services', icon: '✂️' },
  { to: '/dashboard/reports', label: 'My Reports', icon: '📋' },
];

const userLinks: SidebarItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊', end: true },
  { to: '/dashboard/reports', label: 'My Reports', icon: '📋' },
  { to: '/dashboard/rescue', label: 'Rescue Requests', icon: '🚨' },
  { to: '/dashboard/adoptions', label: 'My Adoptions', icon: '🏠' },
];

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  if (!user) return null;

  const links = user.role === 'ADMIN' ? adminLinks : user.role === 'SHOP_OWNER' ? shopLinks : userLinks;

  const cls = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
      isActive ? 'bg-brand-500 text-white shadow-sm' : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
    }`;

  return (
    <aside className="w-56 shrink-0 hidden lg:flex flex-col bg-white border-r border-stone-100 min-h-[calc(100vh-64px)] sticky top-16">
      <div className="p-4">
        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Navigation</p>
        <p className="text-sm font-bold text-stone-800">
          {user.role === 'ADMIN' ? 'Admin Panel' : user.role === 'SHOP_OWNER' ? 'Shop Panel' : 'My Account'}
        </p>
      </div>
      <nav className="flex-1 px-3 space-y-0.5">
        {links.map(l => (
          <NavLink key={l.to} to={l.to} end={l.end} className={cls}>
            <span>{l.icon}</span>
            <span>{l.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-stone-100">
        <NavLink to="/profile" className={cls}>
          <span>👤</span>
          <span>Profile</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
