import React from 'react';
import { NavLink } from 'react-router-dom';

const AdminSidebar: React.FC = () => {
  const getActiveClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-5 py-3 rounded-2xl transition-all duration-200 font-bold text-sm ${isActive
      ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20 translate-x-1'
      : 'text-slate-500 hover:bg-orange-50 hover:text-orange-600'
    }`;

  return (
    <aside className="w-72 bg-cream h-[calc(100vh-64px)] sticky top-16 flex-col hidden lg:flex border-r border-orange-100/50">
      <div className="p-8 pb-4">
        <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-1">
          Navigation
        </h2>
        <h3 className="text-xl font-black text-slate-800">Admin Control</h3>
      </div>
      <div className="flex-1 px-4 py-2 space-y-2 mt-4">
        <NavLink to="/admin" end className={getActiveClass}>
          <span>📊</span> Dashboard
        </NavLink>
        <NavLink to="/admin/users" className={getActiveClass}>
          <span>👥</span> Manage Users
        </NavLink>
        <NavLink to="/admin/pets" className={getActiveClass}>
          <span>🐕</span> Manage Pets
        </NavLink>
        <NavLink to="/admin/reports" className={getActiveClass}>
          <span>📋</span> Manage Reports
        </NavLink>
      </div>
    </aside>
  );
};

export default AdminSidebar;
