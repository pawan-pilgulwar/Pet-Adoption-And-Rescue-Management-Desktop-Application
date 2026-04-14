import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import UserProfile from './UserProfile';
import ShopProfile from './ShopProfile';

const ProfileSwitcher: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <span className="text-4xl animate-float inline-block">🐾</span>
          <p className="mt-4 text-slate-500 font-bold">Loading Profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Admins can use the USER profile for basic info or we can create AdminProfile later
  if (user.role === 'SHOP_OWNER') {
    return <ShopProfile />;
  }

  return <UserProfile />;
};

export default ProfileSwitcher;
