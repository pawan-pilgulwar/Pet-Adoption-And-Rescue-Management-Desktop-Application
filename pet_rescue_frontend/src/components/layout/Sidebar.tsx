import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface MenuItem {
  label: string;
  to: string;
  icon: string;
}

// Role-based sidebar menu items
function getMenuItems(role: UserRole): MenuItem[] {
  if (role === 'ADMIN') {
    return [
      { label: 'Dashboard', to: '/admin', icon: '📊' },
      { label: 'Users', to: '/admin/users', icon: '👥' },
      { label: 'Pets', to: '/admin/pets', icon: '🐾' },
      { label: 'Reports', to: '/admin/reports', icon: '🚨' },
      { label: 'Services', to: '/admin/services', icon: '🛠️' },
    ];
  }

  if (role === 'SHOP_OWNER') {
    return [
      { label: 'Dashboard', to: '/dashboard', icon: '🏠' },
      { label: 'My Reports', to: '/dashboard/reports', icon: '📄' },
      { label: 'My Pets', to: '/dashboard/pets', icon: '🐾' },
      { label: 'Listings', to: '/dashboard/listings', icon: '📋' },
      { label: 'Services', to: '/dashboard/services', icon: '🛠️' },
      { label: 'Bookings', to: '/dashboard/bookings', icon: '📅' },
    ];
  }

  // USER role
  return [
    { label: 'Dashboard', to: '/dashboard', icon: '🏠' },
    { label: 'My Reports', to: '/dashboard/reports', icon: '📄' },
    { label: 'My Adoptions', to: '/dashboard/adoptions', icon: '❤️' },
    { label: 'My Rescue', to: '/dashboard/rescue', icon: '🆘' },
  ];
}

function Sidebar() {
  const { user } = useAuth();
  if (!user) return null;

  const items = getMenuItems(user.role);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
      ? 'bg-brand-500 text-white shadow-md'
      : 'text-stone-600 hover:bg-orange-50 hover:text-brand-500'
    }`;

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-stone-100 flex flex-col py-6 px-4 gap-1">
      {/* Role badge */}
      <div className="mb-4 px-2">
        <p className="text-xs text-stone-400 uppercase font-semibold tracking-widest mb-1">Menu</p>
        <span className={`badge ${user.role === 'ADMIN' ? 'badge-blue' :
          user.role === 'SHOP_OWNER' ? 'badge-orange' : 'badge-green'
          }`}>
          {user.role === 'SHOP_OWNER' ? 'Shop Owner' : user.role}
        </span>
      </div>

      {items.map(item => (
        <NavLink key={item.to} to={item.to} end={item.to === '/dashboard' || item.to === '/admin'} className={linkClass}>
          <span className="text-lg">{item.icon}</span>
          {item.label}
        </NavLink>
      ))}

      {/* Profile link at bottom */}
      <div className="mt-auto pt-4 border-t border-stone-100">
        <NavLink to="/profile" className={linkClass}>
          <span className="text-lg">👤</span>
          Profile
        </NavLink>
      </div>
    </aside>
  );
}

export default Sidebar;
