import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import UserDashboard from './UserDashboard';
import ShopDashboard from './ShopDashboard';

const Dashboard: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <span className="text-4xl animate-float inline-block">🐾</span>
          <p className="mt-4 text-slate-500 font-bold">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === 'ADMIN') {
    return <Navigate to="/admin" replace />;
  }

  if (user.role === 'SHOP_OWNER') {
    return <ShopDashboard />;
  }

  return <UserDashboard />;
};

export default Dashboard;
