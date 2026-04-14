import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '../context/AuthContext';

const AdminLayout: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center">
          <span className="text-4xl animate-float inline-block">🐾</span>
          <p className="mt-4 text-slate-500 font-bold">Loading Admin Panel...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col font-nunito text-slate-800">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar />
        <main className="flex-1 p-6 md:p-10 overflow-y-auto bg-orange-50/30 rounded-tl-3xl shadow-inner mt-1 ml-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
