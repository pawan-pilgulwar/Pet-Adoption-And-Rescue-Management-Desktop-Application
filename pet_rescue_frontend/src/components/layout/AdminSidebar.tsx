import React from 'react';
import { NavLink } from 'react-router-dom';

const AdminSidebar: React.FC = () => {
  const getActiveClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 text-sm font-semibold ${
      isActive
        ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
        : 'text-slate-500 hover:bg-orange-50 hover:text-orange-600'
    }`;

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
    ), end: true },
    { to: '/admin/users', label: 'Manage Users', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
    ) },
    { to: '/admin/pets', label: 'Manage Pets', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
    ) },
    { to: '/admin/reports', label: 'Manage Reports', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
    ) },
  ];

  return (
    <aside className="w-60 bg-white h-[calc(100vh-64px)] sticky top-16 flex-col hidden lg:flex border-r border-orange-100">
      <div className="p-6 pb-3">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Navigation</p>
        <h3 className="text-base font-bold text-slate-800">Admin Panel</h3>
      </div>
      <nav className="flex-1 px-3 py-2 space-y-1">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end} className={getActiveClass}>
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-orange-50">
        <div className="bg-orange-50 rounded-xl p-4">
          <p className="text-xs font-semibold text-orange-700 mb-1">Need help?</p>
          <p className="text-[11px] text-orange-500">Check the docs or contact support.</p>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
